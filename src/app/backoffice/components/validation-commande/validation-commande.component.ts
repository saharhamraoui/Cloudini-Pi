import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-validation-commande',
  templateUrl: './validation-commande.component.html',
  styleUrls: ['./validation-commande.component.css']
})
export class ValidationCommandeComponent implements OnInit {
  commande: any;

  constructor(private route: ActivatedRoute, private commandeService: CommandeService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.commandeService.getCommandeById(+id).subscribe(
        data => this.commande = data,
        error => console.error('Erreur', error)
      );
    }
  }

  validerCommande(status: string): void {
    this.commandeService.updateStatusCommande(this.commande.idcommande, status).subscribe(
      res => {
        alert(`Commande ${status}`);
        this.reloadCommande(); // Refresh the commande data
      },
      err => alert('Erreur lors de la validation')
    );
  }
  
  reloadCommande(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.commandeService.getCommandeById(+id).subscribe(
        data => this.commande = data,
        error => console.error('Erreur', error)
      );
    }
  }
  
}
