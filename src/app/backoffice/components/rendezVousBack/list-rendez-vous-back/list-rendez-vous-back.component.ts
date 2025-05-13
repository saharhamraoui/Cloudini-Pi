import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RendezVous } from 'src/app/model/RendezVous';
import { RendezVousService } from 'src/app/services/rendez-vous.service';

@Component({
  selector: 'app-list-rendez-vous-back',
  templateUrl: './list-rendez-vous-back.component.html',
  styleUrls: ['./list-rendez-vous-back.component.css']
})
export class ListRendezVousBackComponent {
  title = 'projectPi';
  rvs: any=[] ;
  rv: RendezVous[] = [];



  constructor(private rendezVousService:RendezVousService ,private router:Router){}

  ngOnInit(): void {
    this.getRendezVous();
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
        console.log("statusMap dans ListRendezVousBack : ", statusMap); // Vérification du statusMap
  
        this.rvs = donnes.map(rv => ({
          ...rv,
          status: rv.idRendezVous !== undefined && statusMap[rv.idRendezVous]
                   ? statusMap[rv.idRendezVous]
                   : 'En attente'
        }));
      },
      (erreur: HttpErrorResponse) => {
        console.log('Erreur de l\'API :', erreur); 
      }
    );
  }
  

changerStatus(rv: any) {
    if (rv.idRendezVous !== undefined) {
      const statusMap = JSON.parse(localStorage.getItem('statusMap') || '{}');
      statusMap[rv.idRendezVous] = rv.status;  // Met à jour le status dans le localStorage
      localStorage.setItem('statusMap', JSON.stringify(statusMap));
      console.log(`Statut changé pour le rendez-vous ID ${rv.idRendezVous} : ${rv.status}`);
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
    this.router.navigate(['/back/updaterendezvousBack',id])
  }
     

  ajouterConsultation(idRendezVous: number): void {
    console.log("Bouton cliqué - ID RendezVous:", idRendezVous);
    const rendezVous: RendezVous | undefined = this.rvs.find((rv: RendezVous) => rv.idRendezVous === idRendezVous);
    
    if (rendezVous) {
      console.log("Rendez-vous trouvé :", rendezVous);
      this.router.navigate(['/back/addConsultation'], {
        queryParams: {
          idRendezVous: rendezVous.idRendezVous,
          dateRendezVous: rendezVous.dateRendezVous
        }
      });
    } else {
      console.warn("Rendez-vous non trouvé pour ID :", idRendezVous);
    }
  }
}
