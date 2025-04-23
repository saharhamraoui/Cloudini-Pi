import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  name = '';
  gender = '';
  loggedUser = '';
  currRole = '';
  patients : Observable<any[]> | undefined;
  users : Observable<any[]> | undefined;
  doctors : Observable<any[]> | undefined;
  slots : Observable<any[]> | undefined;
  prescriptions : Observable<any[]> | undefined;
  Medicament$: Observable<any[]> | undefined;
  commandesLivrees: any[] = [];
  totalParFournisseur: { [key: string]: number } = {};

  constructor(private _route : Router, private _service: CommandeService, private renderer: Renderer2) {}
//Livrée
  ngOnInit(): void {
    this.Medicament$ = this._service.getStock();
    this._service.getCommandes().subscribe(commandes => {
      this.commandesLivrees = commandes.filter(c => c.status === 'Livrée');

      // Calcule le total par fournisseur
      this.totalParFournisseur = {};
      this.commandesLivrees.forEach(commande => {
        const fournisseur = commande.fournisseur.nom;
        const total = commande.lignesCommande.reduce((sum: number, ligne: any) =>
          sum + (ligne.medicament.prix * ligne.quantite), 0
        );
        if (!this.totalParFournisseur[fournisseur]) {
          this.totalParFournisseur[fournisseur] = 0;
        }
        this.totalParFournisseur[fournisseur] += total;
      });
    });


  }

}
