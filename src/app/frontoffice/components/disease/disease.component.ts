import { Component, HostListener } from '@angular/core';
import { DiseaseServiceService } from 'src/app/services/disease-service.service';

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css']
})
export class DiseaseComponent {
  symptoms: string[] = [];
  newSymptom: string = '';
  predictionResult: string = '';

  constructor(private diseaseService: DiseaseServiceService) {}

  

 

  addSymptom() {
    const value = this.newSymptom.trim();
    if (value && !this.symptoms.includes(value)) {
      this.symptoms.push(value);
    }
    this.newSymptom = '';
  }

  removeSymptom(symptom: string) {
    this.symptoms = this.symptoms.filter(s => s !== symptom);
  }

  @HostListener('document:keydown.enter', ['$event'])
  @HostListener('document:keydown.', ['$event']) // pour la virgule
  handleKeyDown(event: KeyboardEvent) {
    const isInputFocused = (event.target as HTMLElement).tagName === 'INPUT';
    if (isInputFocused && (event.key === 'Enter' || event.key === ',')) {
      event.preventDefault();
      this.addSymptom();
    }
  }
 
  predict() {
    this.diseaseService.predictDisease(this.symptoms).subscribe({
      next: (result) => this.predictionResult = result,
      error: (err) => console.error('Erreur lors de la prédiction', err)
    });
  }
}
