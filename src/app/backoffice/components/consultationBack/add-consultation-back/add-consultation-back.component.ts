import { MedicalRecord } from 'src/app/model/MedicalRecord';

import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Consultation } from 'src/app/model/Consultation';
import { RendezVous } from 'src/app/model/RendezVous';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-consultation-back',
  templateUrl: './add-consultation-back.component.html',
  styleUrls: ['./add-consultation-back.component.css'],
  providers: [DatePipe] 
})
export class AddConsultationBackComponent {
   
  consultationForm!: FormGroup;
  consultation!: Consultation;
  rendezVous: RendezVous[] = [];
  medicalRecords: MedicalRecord[] = [];
  formattedDate: string | null = null;
   
  //selectedRendezVousDate: string | null = null;
  constructor(private consultationService: ConsultationService, private fb: FormBuilder, private router: Router ,  private route: ActivatedRoute , private datePipe: DatePipe ) { }

  ngOnInit(): void {
    this.consultationForm = new FormGroup({
       
        rapport: new FormControl('', [Validators.required]),
        rendezVous: new FormControl('', [Validators.required]),
        medicalRecord: new FormControl('', [Validators.required]),
        dateRendezVous: new FormControl({ value: '', disabled: true }) // Champ en lecture seule
    });

    // 🔹 Récupérer la date du rendez-vous depuis l'URL
    this.route.queryParams.subscribe((params: Params) => {
        const rendezVousId = params['idRendezVous'];
        const rendezVousDate = params['dateRendezVous'];

        if (rendezVousId) {
            this.consultationForm.get('rendezVous')?.setValue(rendezVousId);
        }

        if (rendezVousDate) {
            // Convertir la date au format acceptable pour datetime-local (yyyy-MM-ddTHH:mm)
            const formatted = this.datePipe.transform(rendezVousDate, 'yyyy-MM-ddTHH:mm');
            this.consultationForm.get('dateRendezVous')?.setValue(formatted); // Mettre la date formatée dans le formulaire
        }
    });

    // Charger les rendez-vous
    this.consultationService.getRendezVous().subscribe(
        (data) => {
            this.rendezVous = data;
            console.log("Rendez-vous chargés :", this.rendezVous);
        },
        (error) => {
            console.error("Erreur lors du chargement des rendez-vous :", error);
        }
    );

    // Charger les dossiers médicaux
    this.consultationService.getMedicalRecords().subscribe(
        (data) => {
            this.medicalRecords = data;
            console.log("Dossiers médicaux chargés :", this.medicalRecords);
        },
        (error) => {
            console.error("Erreur lors du chargement des dossiers médicaux :", error);
        }
    );
}



  


ajouter(): void {
  if (this.consultationForm.invalid) {
    console.log("Le formulaire est invalide");
    return; // Ne pas soumettre si le formulaire est invalide
  }
  const selectedRendezVous = this.rendezVous.find(rdv => rdv.idRendezVous === +this.consultationForm.value.rendezVous);
const selectedMedicalRecord = this.medicalRecords.find(record => record.idMedicalRecord === +this.consultationForm.value.medicalRecord);

  if (selectedRendezVous && selectedMedicalRecord) {
    const consultation: Consultation = {
      dateConsultation: new Date(this.consultationForm.value.dateConsultation),
      rapport: this.consultationForm.value.rapport,
      rendezVous: selectedRendezVous,
      medicalRecord: selectedMedicalRecord
    };

    console.log("Objet envoyé :", JSON.stringify(consultation, null, 2));

    this.consultationService.addConsultation(consultation).subscribe(
      (data) => {
        console.log("Consultation ajoutée avec succès :", data);
        this.router.navigate(['/back/list-consultation-Back']);
      },
      (error) => {
        console.error("Erreur lors de l'ajout de la consultation :", error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
      }
    );
  } else {
    console.error("Rendez-vous ou dossier médical introuvable.");
  }
}


}

