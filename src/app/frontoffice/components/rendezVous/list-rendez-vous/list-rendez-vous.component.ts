
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RendezVous } from 'src/app/model/RendezVous';
import { RendezVousService } from 'src/app/services/rendez-vous.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-rendez-vous',
  templateUrl: './list-rendez-vous.component.html',
  styleUrls: ['./list-rendez-vous.component.css']
})
export class ListRendezVousComponent {


  title = 'projectPi';
  rvs: any=[] ;



  constructor(private rendezVousService:RendezVousService ,private router:Router , private http: HttpClient ){}

  ngOnInit(): void {
    this.rendezVousService.getRendezVous().subscribe(data => {
      const statusMap = JSON.parse(localStorage.getItem('statusMap') || '{}');
      console.log("statusMap dans ListRendezVousComponent : ", statusMap); // Vérifie si les statuts sont récupérés

      this.rvs = data.map(rv => {
        const id = rv.idRendezVous;
        return {
          ...rv,
          status: id !== undefined && statusMap[id] ? statusMap[id] : 'En attente'
        };
      });

      console.log("Rendez-vous avec statuts :", this.rvs);
    });
  }



  // getRendezVous(){
  //   this.rendezVousService.getRendezVous().subscribe(
  //     (donnes:RendezVous[])=>{
  //       console.log("Réponse de l'API :", donnes);
  //       this.rvs=donnes;
  //     },
  //     (erreur:HttpErrorResponse)=>{
  //       console.log('Erreur de l\'API :',erreur);
  //     }

  //   );
  // }
  getRendezVous() {
    this.rendezVousService.getRendezVous().subscribe(
      (donnes: RendezVous[]) => {
        const statusMap = JSON.parse(localStorage.getItem('statusMap') || '{}');
        console.log("statusMap récupéré : ", statusMap); // Vérifie ici la structure du statusMap

        this.rvs = donnes.map(rv => ({
          ...rv,
          status: rv.idRendezVous !== undefined && statusMap[rv.idRendezVous]
                   ? statusMap[rv.idRendezVous]
                   : 'En attente'
        }));

        console.log("Rendez-vous avec statuts après modification :", this.rvs);
      },
      (erreur: HttpErrorResponse) => {
        console.log('Erreur de l\'API :', erreur);
      }
    );
  }


  changerStatus(rv: any) {
    if (rv.idRendezVous !== undefined) {
      const statusMap = JSON.parse(localStorage.getItem('statusMap') || '{}');
      statusMap[rv.idRendezVous] = rv.status;
      localStorage.setItem('statusMap', JSON.stringify(statusMap));
      console.log(`Statut changé pour le rendez-vous ID ${rv.idRendezVous} : ${rv.status}`);
      this.getRendezVous();  // Récupère à nouveau les rendez-vous avec les statuts mis à jour
    } else {
      console.warn("ID RendezVous est undefined, impossible de sauvegarder le statut.");
    }
  }






  supprimerRendezVous(id:any)
  {
    id=Number(id)
    this.rendezVousService.deleteRendezVous(id).subscribe(
      data =>{
        console.log(data)
        console.log("deleted")
        this.rvs = this.rvs.filter((rendezVous: RendezVous) => rendezVous.idRendezVous !== id);

      },
      error=>{
        console.log(error)
      }
    )
  }

  modifierRendezVous(id:any)
  {
    id=Number(id)
    this.router.navigate(['/front/updaterendezvous',id])
  }




}
