import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { Reclamation } from 'src/app/model/reclamation.model';
import { EmotionService } from 'src/app/services/emotion.service';
import { ReclamationService } from 'src/app/services/reclamation.service';

@Component({
  selector: 'app-reclamation-form',
  templateUrl: './reclamation-form.component.html',
  styleUrls: ['./reclamation-form.component.css']
})
export class ReclamationFormComponent {
  form: FormGroup;
  webcamImage: WebcamImage | null = null;
  emotion = '';
  category = '';
  aiConfidence = 0;
  success = false;

  private trigger: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private emotionService: EmotionService
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required]
    });
  }

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
      this.emotion = res.emotion;
    });
  }

  categorizeText(): void {
    const text = this.form.value.description;
    if (text) {
      this.emotionService.categorize(text).subscribe(res => {
        this.category = res.category;
        this.aiConfidence = res.confidence;
      });
    }
  }

  submit(): void {
    const data: Reclamation = {
      ...this.form.value,
      emotion: this.emotion,
      category: this.category,
      aiConfidence: this.aiConfidence
    };

    this.reclamationService.createReclamation(data).subscribe(() => {
      this.success = true;
      this.form.reset();
      this.webcamImage = null;
      this.emotion = '';
      this.category = '';
      this.aiConfidence = 0;
    });
  }
}
