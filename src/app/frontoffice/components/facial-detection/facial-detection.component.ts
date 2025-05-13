import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { EmotionService } from 'src/app/services/emotion.service';

@Component({
  selector: 'app-facial-detection',
  templateUrl: './facial-detection.component.html'
})
export class FacialDetectionComponent {
  public webcamImage: WebcamImage | null = null;
  public emotionResult: string = '';
  private trigger: Subject<void> = new Subject<void>();

  constructor(private emotionService: EmotionService) {}

  triggerSnapshot(): void {
    this.trigger.next();
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    const base64 = webcamImage.imageAsBase64;
    this.emotionService.detectEmotion(base64).subscribe(res => {
      this.emotionResult = `${res.emotion} (${res.score})`;
    });
  }
}
