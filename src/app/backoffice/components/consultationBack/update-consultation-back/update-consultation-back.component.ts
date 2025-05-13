import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Consultation } from 'src/app/model/Consultation';
import { ConsultationService } from 'src/app/services/consultation.service';

@Component({
  selector: 'app-update-consultation-back',
  templateUrl: './update-consultation-back.component.html',
  styleUrls: ['./update-consultation-back.component.css']
})
export class UpdateConsultationBackComponent {
  id!:number
  consultation!:Consultation
  consultationForm!:FormGroup
  constructor(private consultationService: ConsultationService,private router:Router,private route:ActivatedRoute){}
        ngOnInit(): void {
            this.id = this.route.snapshot.params['id'];
            this.consultationForm = new FormGroup({
              dateConsultation: new FormControl('', [Validators.required]),
              rapport: new FormControl('', [Validators.required]),
             // rendezVous: new FormControl('', [Validators.required]),
             // medicalRecord: new FormControl('', [Validators.required])
            });
            this.consultationService.getConsultationById(this.id).subscribe(
              (data) => {
                this.consultation = data;
                console.log('Consultation récupéré :', this.consultation);
  
                this.consultationForm.patchValue({
                  dateConsultation: this.formatDateForInput(this.consultation.dateConsultation),
                  rapport: this.consultation.rapport,
                  //medecin: this.rendezVous.medecin.idUser,
                  //patient: this.rendezVous.patient?.idUser
                });
        
              },
             
            );
            
          }
        
          formatDateForInput(date: string | Date): string {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
          
            return  `${year}-${month}-${day}T${hours}:${minutes}`;
          }
  
  
          update() {
            if (this.consultationForm.valid) {
              const updateConsultation = {
                idConsultation: this.id, 
                dateConsultation: this.consultationForm.value.dateConsultation,
                rapport: this.consultationForm.value.rapport,
                // medecin: {
                //   idUser: this.rendezVousForm.value.medecin // Id du médecin sélectionné
                // },
                // patient: { 
                //   idUser: this.rendezVous.patient.idUser // Garder l'ID du patient inchangé
                // }
              
              };
          
              this.consultationService.updateConsultation(updateConsultation).subscribe(
                data => {
                  console.log('Consultation mis à jour avec succès', data);
                  this.router.navigate(['/back/list-consultation-Back']);
                },
                err => {
                  console.error('Erreur lors de la mise à jour du Consultation', err);
                  alert('Une erreur est survenue lors de la mise à jour.');
                }
              );
            }
          }
  }
