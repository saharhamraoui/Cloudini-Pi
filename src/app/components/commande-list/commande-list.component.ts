import { Component, OnInit } from '@angular/core';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css']
})
export class CommandeListComponent implements OnInit {
  commandes: any[] = []; // Stocke les commandes récupérées depuis l'API

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
}
