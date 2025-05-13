import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class FaceAuthService {
  private modelsLoaded = false;
  private labeledFaceDescriptors: faceapi.LabeledFaceDescriptors[] = [];
  private maxDescriptorDistance = 0.6;
  

  constructor(
        private authService: AuthService,

  ) { }

  async loadModels() {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models')
      ]);
      this.modelsLoaded = true;
      console.log('Face recognition models loaded');
    } catch (error) {
      console.error('Error loading models:', error);
      throw error;
    }
  }
  async detectFace(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
    if (!this.modelsLoaded) await this.loadModels();
    
    return faceapi.detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();
  }

  async registerFace(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement, userId: string) {
    const detection = await this.detectFace(image);
    if (!detection) throw new Error('No face detected');

    const descriptor = Array.from(detection.descriptor as Float32Array);
    return this.authService.registerFace(userId, descriptor).toPromise();
  }
  private updateLocalDescriptors(userId: string, descriptor: Float32Array) {
    this.labeledFaceDescriptors = this.labeledFaceDescriptors.filter(
      desc => desc.label !== userId
    );
    this.labeledFaceDescriptors.push(
      new faceapi.LabeledFaceDescriptors(userId, [descriptor])
    );
  }

  async loadUserDescriptors(userId: string): Promise<void> {
    // Chargez les descripteurs depuis le backend
    const descriptors = await this.authService.getFaceDescriptors(userId).toPromise();
    if (descriptors) {
      this.updateLocalDescriptors(userId, new Float32Array(descriptors));
    }
  }

  async recognizeFace(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
    if (!this.modelsLoaded) {
      await this.loadModels();
    }

    if (this.labeledFaceDescriptors.length === 0) {
      throw new Error('No faces registered');
    }

    const detections = await faceapi.detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length === 0) {
      throw new Error('No faces detected');
    }

    const faceMatcher = new faceapi.FaceMatcher(
      this.labeledFaceDescriptors,
      this.maxDescriptorDistance
    );

    const results = detections.map(detection => 
      faceMatcher.findBestMatch(detection.descriptor)
    );

    return results;
  }

  async verifyFace(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement, userId: string) {
    const results = await this.recognizeFace(image);
    const bestMatch = results[0];
    
    return bestMatch.label === userId && bestMatch.distance <= this.maxDescriptorDistance;
  }
}