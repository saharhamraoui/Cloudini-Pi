import { Component, OnInit } from '@angular/core';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-gestion-commandes',
  templateUrl: './gestion-commandes.component.html',
  styleUrls: ['./gestion-commandes.component.css']
})
export class GestionCommandesComponent implements OnInit {
  commandes: any[] = [];  // Liste des commandes à afficher

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.getAllCommandes();
  }

  // Récupérer toutes les commandes (celles en cours, validées, Livrées)
  getAllCommandes(): void {
    this.commandeService.getCommandes().subscribe(
      data => {
        this.commandes = data;
      },
      error => {
        console.error('Erreur lors de la récupération des commandes', error);
      }
    );
  }

  // Mise à jour du statut de la commande
  updateStatusCommande(commande: any): void {
    this.commandeService.updateStatusCommande(commande.idcommande, commande.newStatus).subscribe(
      response => {
        alert('Statut de la commande mis à jour avec succès.');
        this.getAllCommandes(); // Rafraîchir la liste des commandes
      },
      error => {
        console.error('Erreur lors de la mise à jour du statut de la commande', error);
        alert('Erreur lors de la mise à jour du statut de la commande.');
      }
    );
  }
}
