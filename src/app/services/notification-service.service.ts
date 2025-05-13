import { Injectable } from '@angular/core';
import { RendezVous } from '../model/RendezVous';
import { ConsultationService } from './consultation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, timer } from 'rxjs';
import { RendezVousService } from './rendez-vous.service'; // Assurez-vous que ce service récupère les RDV du backend
import { catchError, map, switchMap } from 'rxjs/operators';
import { Patient } from '../model/Patient';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifiedRendezVous: Set<string>;

  constructor(
    private toastr: ToastrService, 
    private snackBar: MatSnackBar,
    private rendezVousService: RendezVousService
  ) {
    const storedIds = localStorage.getItem('notifiedRendezVous');
    this.notifiedRendezVous = storedIds ? new Set(JSON.parse(storedIds)) : new Set();
  }

  private saveNotifiedRendezVous() {
    localStorage.setItem('notifiedRendezVous', JSON.stringify(Array.from(this.notifiedRendezVous)));
  }

  checkRendezVousNotification(): Observable<void> {
    return this.rendezVousService.getRendezVous().pipe(
      map(rendezVousList => {
        const now = new Date();
        rendezVousList.forEach(rendezVous => {
          const rdvDate = new Date(rendezVous.dateRendezVous);
          const timeDifference = rdvDate.getTime() - now.getTime();
          console.log(`RDV pour ${rendezVous.idRendezVous} dans ${timeDifference / 1000} secondes`);

          const id = rendezVous.idRendezVous?.toString();
          if (id && !this.notifiedRendezVous.has(id)) {
            if (timeDifference <= 10 * 60 * 1000 && timeDifference > 0) {
              const patient = rendezVous.patient as Patient;
              this.snackBar.open(
                `Rappel : Rendez-vous avec ${patient.firstName} ${patient.lastName} dans 10 minutes.`,
                'Fermer',
                {
                  duration: 5000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center',
                }
              );
              this.notifiedRendezVous.add(id);
              this.saveNotifiedRendezVous(); // <<<< Enregistre les notifications vues
            }
          }
        });
      })
    );
  }

  startNotificationCheck() {
    timer(0, 60000) // 0 ms d'attente pour la première fois, puis toutes les 60000ms (1 minute)
    .pipe(
      switchMap(() => this.checkRendezVousNotification())
    )
    .subscribe(); // Appel immédiat dès que la page charge
    this.checkRendezVousNotification().subscribe();
    
    // Ensuite, continuer toutes les 10 minutes
    setInterval(() => {
      this.checkRendezVousNotification().subscribe();
    }, 10 * 60 * 1000);
  }
}