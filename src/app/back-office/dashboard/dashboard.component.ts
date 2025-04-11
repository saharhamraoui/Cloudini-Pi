import { Component, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Medicament$: Observable<any[]> | undefined;
  commandesLivrees: any[] = [];
  totalParFournisseur: { [key: string]: number } = {};

  constructor(private _service: CommandeService, private renderer: Renderer2) {}
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

    const menuToggle = document.querySelector('.menuToggle');
    const menu = document.querySelector('.menu');

    if (menuToggle && menu) {
      this.renderer.listen(menuToggle, 'click', () => {
        menuToggle.classList.toggle('menuToggle_open');
        menu.classList.toggle('hideMenu');
      });
    }
  }
}
