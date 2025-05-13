
import { formatDate } from '@angular/common';
import { Patient } from 'src/app/model/Patient';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Medecin } from 'src/app/model/Medecin';
import { RendezVous } from 'src/app/model/RendezVous';
import { RendezVousService } from 'src/app/services/rendez-vous.service';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-add-rendez-vous',
  templateUrl: './add-rendez-vous.component.html',
  styleUrls: ['./add-rendez-vous.component.css']
})
export class AddRendezVousComponent {

  rendezVousForm!: FormGroup;
  rendezVous!: RendezVous
  medecins: Medecin[] = [];
  patients: Patient[] = [];
  filteredMedecins: Medecin[] = [];
  specialities: string[] = ["Cardiologie", "Dermatologie", "Neurologie", "Pédiatrie", "Chirurgie"];
  viewDate: Date = new Date();
  calendarEvents: any[] = [];
  rendezVousList: RendezVous[] = [];
  rendezVousPasses: RendezVous[] = [];
  pastRendezVous: any[] = [];
  errorMessage: string = '';
  constructor(private rendezVousService: RendezVousService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.rendezVousForm = this.fb.group({
      speciality: ['', Validators.required],
      dateRendezVous: new FormControl('', [Validators.required]),
      medecin: new FormControl('', [Validators.required]),
      patient: new FormControl('', [Validators.required]),
      typeRendezVous: new FormControl('PRESENTIEL', [Validators.required]) // valeur par défaut


    });

    this.rendezVousService.getMedecins().subscribe(
      (data) => {
        this.medecins = data;
        this.filteredMedecins = data;
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

  onSpecialityChange(): void {
    const selectedSpeciality = this.rendezVousForm.value.speciality;
    this.filteredMedecins = this.medecins.filter(m => m.speciality === selectedSpeciality);


  }



  isMedecinAvailable(medecin: Medecin, selectedDate: string): boolean {
    if (!selectedDate) return false;

    const dateToCheck = new Date(selectedDate).toISOString().split('T')[0];
    if (!Array.isArray(medecin.availability)) {
      return true;
    }
    return !medecin.availability.some(date =>
      new Date(date).toISOString().split('T')[0] === dateToCheck
    );
  }

  onMedecinChange(): void {
    const medecinId = this.rendezVousForm.get('medecin')?.value;

    if (medecinId) {
      this.rendezVousService.getRendezVousByMedecin(medecinId).subscribe(
        (rendezVousList) => {
          this.pastRendezVous = rendezVousList.map(rdv => {
            const dateObj = new Date(rdv.dateRendezVous);
            return {
              weekday: dateObj.toLocaleDateString('fr-FR', { weekday: 'long' }),
              day: dateObj.getTime() ? dateObj : null
            };
          });
          console.log("Rendez-vous passés :", this.pastRendezVous);
        },
        (error) => {
          console.error("Erreur lors du chargement des rendez-vous passés :", error);
        }
      );
    }
  }


  loadPastRendezVous(medecinId: number): void {
    this.rendezVousService.getRendezVousByMedecin(medecinId).subscribe(
      (rendezVousList) => {
        this.pastRendezVous = rendezVousList.map(rdv => {
          const dateObj = new Date(rdv.dateRendezVous);
          return {
            weekday: dateObj.toLocaleDateString('fr-FR', { weekday: 'long' }),
            day: dateObj.getTime() ? dateObj : null // Vérification si c'est une date valide
          };
        });

      },
      (error) => {
        console.error("Erreur lors du chargement des rendez-vous passés :", error);
      }
    );
  }

  validerHeure(): boolean {
    const rawDate = this.rendezVousForm.get('dateRendezVous')?.value;
    if (!rawDate) return false;

    const formattedDateObj = new Date(rawDate);
    const hours = formattedDateObj.getHours();
    const minutes = formattedDateObj.getMinutes();

    if (hours < 8 || (hours === 22 && minutes > 30) || hours > 22) {
      this.errorMessage = "Les rendez-vous doivent être pris entre 08:00 et 22:30.";
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  ajouter(): void {
    if (!this.validerHeure()) return;

    const rawDate = this.rendezVousForm.get('dateRendezVous')?.value;
    const formattedDateObj = new Date(rawDate);
    const typeRendezVous = this.rendezVousForm.get('typeRendezVous')?.value;
    const medecinId = this.rendezVousForm.get('medecin')?.value;

    // ✅ Vérification manuelle
    if (typeRendezVous !== 'PRESENTIEL' && typeRendezVous !== 'EN_LIGNE') {
      alert('Type de rendez-vous invalide. Veuillez choisir une option.');
      return;
    }

    this.rendezVousService.getRendezVousByMedecin(medecinId).subscribe((rendezVousList) => {
      const isConflict = rendezVousList.some(rv => {
        const rvDate = new Date(rv.dateRendezVous);
        return Math.abs(rvDate.getTime() - formattedDateObj.getTime()) < 30 * 60 * 1000;
      });

      if (isConflict) {
        alert('Ce médecin a déjà un rendez-vous dans cet intervalle de 30 minutes. Veuillez choisir un autre créneau.');
        return;
      }

      const rendezVous: RendezVous = {
        dateRendezVous: formattedDateObj,
        medecin: { idUser: medecinId },
        patient: { idUser: this.rendezVousForm.get('patient')?.value },
        typeRendezVous: typeRendezVous
      };

      console.log("Type de rendez-vous sélectionné :", typeRendezVous);

      this.rendezVousService.addRendezVous(rendezVous).subscribe(
        (data) => {
          alert(
            typeRendezVous === 'EN_LIGNE'
              ? 'Un lien sera envoyé par email au patient pour la visioconférence.'
              : 'Rendez-vous présentiel confirmé.'
          );
          this.router.navigate(['/front/list-rendez-vous']);
        },
        (error) => {
          console.error("Erreur lors de l'ajout du rendez-vous :", error);
          alert('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
      );
    });
  }


  suggererCreneau(): void {
    const medecinId = this.rendezVousForm.get('medecin')?.value;
    if (!medecinId) {
      alert('Veuillez choisir un médecin d’abord.');
      return;
    }

    this.rendezVousService.getCreneauOptimal(medecinId).subscribe(
      (creneau) => {
        this.rendezVousForm.patchValue({
          dateRendezVous: formatDate(creneau, 'yyyy-MM-ddTHH:mm', 'en-US')
        });

      },
      (error) => {
        console.error("Erreur IA :", error);
        alert("Impossible de proposer un créneau. Essayez plus tard.");
      }
    );
  }



}
