
import { RendezVousService } from 'src/app/services/rendez-vous.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RendezVous } from 'src/app/model/RendezVous';
import { ActivatedRoute, Router } from '@angular/router';
import { Medecin } from 'src/app/model/Medecin';


@Component({
  selector: 'app-update-rendez-vous',
  templateUrl: './update-rendez-vous.component.html',
  styleUrls: ['./update-rendez-vous.component.css']
})
export class UpdateRendezVousComponent {

  id!:number
  rendezVous!:RendezVous
  rendezVousForm!:FormGroup
  medecins: Medecin[] = [];


  constructor(private rendezVousService: RendezVousService,private router:Router,private route:ActivatedRoute){}


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    // Initialisation du formulaire
    this.rendezVousForm = new FormGroup({
      dateRendezVous: new FormControl('', [Validators.required]),
      medecin: new FormControl('', [Validators.required]),
      patient: new FormControl('', [Validators.required])
    });

    // Récupérer les détails du rendez-vous
    this.rendezVousService.getRendezVousById(this.id).subscribe(
      (data) => {
        this.rendezVous = data;
        console.log('Rendez-vous récupéré :', this.rendezVous);

        // Charger la liste des médecins
        this.rendezVousService.getMedecins().subscribe(
          (medecinsData) => {
            this.medecins = medecinsData;
            console.log('Médecins chargés :', this.medecins);

            // Remplir le formulaire avec les valeurs existantes
            this.rendezVousForm.patchValue({
              dateRendezVous: this.formatDateForInput(this.rendezVous.dateRendezVous),
              medecin: this.rendezVous.medecin.idUser,
              patient: this.rendezVous.patient?.idUser
            });
          },
          (error) => {
            console.error('Erreur lors du chargement des médecins :', error);
          }
        );
      },
      (error) => {
        console.error('Erreur lors de la récupération du rendez-vous :', error);
      }
    );

  }

  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }



  update() {
    if (this.rendezVousForm.valid) {
      const localDate = new Date(this.rendezVousForm.value.dateRendezVous);
      const updateRendezVous = {
        idRendezVous: this.id,
        dateRendezVous: localDate.toISOString(), // juste toISOString() sans ajustement
        medecin: {
          idUser: this.rendezVousForm.value.medecin
        },
        patient: {
          idUser: this.rendezVous.patient.idUser
        }
      };

      this.rendezVousService.updateRendezVous(updateRendezVous).subscribe(
        data => {
          console.log('Rendez-vous mis à jour avec succès', data);
          this.router.navigate(['/front/list-rendez-vous']);
        },
        err => {
          console.error('Erreur lors de la mise à jour du Rendez-vous', err);
          alert('Une erreur est survenue lors de la mise à jour.');
        }
      );
    }
  }



}
