import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Medecin } from 'src/app/model/Medecin';
import { Patient } from 'src/app/model/Patient';
import { RendezVous } from 'src/app/model/RendezVous';
import { RendezVousService } from 'src/app/services/rendez-vous.service';

@Component({
  selector: 'app-add-rendez-vous-back',
  templateUrl: './add-rendez-vous-back.component.html',
  styleUrls: ['./add-rendez-vous-back.component.css']
})
export class AddRendezVousBackComponent {

  
    rendezVousForm!: FormGroup;
    rendezVous!: RendezVous
    medecins: Medecin[] = [];
    patients: Patient[] = [];
   
    constructor(private rendezVousService: RendezVousService, private fb: FormBuilder, private router: Router) { }
  
    ngOnInit(): void {
      this.rendezVousForm = new FormGroup({
        dateRendezVous: new FormControl('', [Validators.required]),
        medecin: new FormControl('', [Validators.required]),
        patient: new FormControl('', [Validators.required])
      });
    
      this.rendezVousService.getMedecins().subscribe(
        (data) => {
          this.medecins = data;
          console.log("Médecins chargés :", this.medecins);
        },
        (error) => {
          console.error("Erreur lors du chargement des médecins :", error);
        }
      );
    
      this.rendezVousService.getPatients().subscribe(
        (data) => {
          this.patients = data;
          console.log("Patients chargés :", this.patients);
        },
        (error) => {
          console.error("Erreur lors du chargement des patients :", error);
        }
      );
    }
    
  
  
    ajouter(): void {
      const rawDate = this.rendezVousForm.value.dateRendezVous;
    
      const formattedDateObj = new Date(rawDate);
    
     
    
      const rendezVous: RendezVous = {
        dateRendezVous: formattedDateObj,
       
        medecin: { idUser: this.rendezVousForm.value.medecin },
        patient: { idUser: this.rendezVousForm.value.patient }
      };
    
     // console.log("Données du rendez-vous :", rendezVous);
     console.log("Objet envoyé :", JSON.stringify(rendezVous, null, 2)); // 🔍 Debug
    
      this.rendezVousService.addRendezVous(rendezVous).subscribe(
        (data) => {
          console.log("Rendez-vous ajouté avec succès :", data);
          this.router.navigate(['/back/list-rendez-vous-back']); // Navigation après ajout
        },
        (error) => {
          console.error("Erreur lors de l'ajout du rendez-vous :", error);
          alert('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
      );
    }

}
