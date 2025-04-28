import { Component, OnInit } from '@angular/core';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css']
})
export class CommandeListComponent implements OnInit {
  commandes: any[] = []; 
  statusFilter: string = '';

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.commandeService.getCommandes().subscribe(
      (data) => {
        this.commandes = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des commandes :', error);
      }
    );
  }
  getTotalPrixCommande(commande: any): number {
    let total = 0;
    for (let ligne of commande.lignesCommande) {
      total += ligne.medicament.prix * ligne.quantite;
    }
    return total;
  }
  annulerCommande(idcommande: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.commandeService.supprimerCommande(idcommande).subscribe({
        next: () => {
          this.commandes = this.commandes.filter(cmd => cmd.idcommande !== idcommande);
          alert('Commande annulée avec succès.');
        },
        error: err => {
          console.error('Erreur lors de la suppression :', err);
          alert("Échec de l'annulation de la commande.");
        }
      });
    }
  }
  
}
