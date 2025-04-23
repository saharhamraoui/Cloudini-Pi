import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Medicament } from 'src/app/model/Medicament';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-medicament-list',
  templateUrl: './medicament-list.component.html',
  styleUrls: ['./medicament-list.component.css']
})
export class MedicamentListComponent implements OnInit {
  medicaments: Medicament[] = [];
  filteredMedicaments: Medicament[] = [];
  fournisseurId: number = 0;
  selectedMedicament: Medicament | null = null;
  quantiteCommande: number = 1;
  searchText: string = '';

  constructor(
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    this.fournisseurId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.fournisseurId) {
      this.getMedicamentsByFournisseur(this.fournisseurId);
    }
  }

  getMedicamentsByFournisseur(idFournisseur: number): void {
    this.fournisseurService.getMedicamentsByFournisseur(idFournisseur).subscribe(
      data => {
        this.medicaments = data || [];
        this.filteredMedicaments = [...this.medicaments];
      },
      error => {
        console.error('Erreur lors de la récupération des médicaments', error);
        this.medicaments = [];
      }
    );
  }

  ouvrirFenetreQuantite(medicament: Medicament): void {
    this.selectedMedicament = medicament;
    this.quantiteCommande = 1;  // Reset la quantité quand une nouvelle commande est ouverte
  }

  verifierQuantite(medicament: Medicament): void {
    if (this.quantiteCommande > medicament.quantite) {
      alert("La quantité demandée dépasse le stock disponible !");
    }
  }

  passerCommande(medicament: Medicament): void {
    if (this.quantiteCommande > medicament.quantite) {
      alert("La quantité demandée dépasse le stock disponible !");
      return;
    }

    const commande = {
      fournisseurId: this.fournisseurId,
      status: 'Encours',
      medicaments: [{ medicamentId: medicament.idmedicament, quantite: this.quantiteCommande }]
    };

    this.commandeService.passerCommande(commande).subscribe(
      response => {
        alert('✅ Commande passée avec succès !');
        this.selectedMedicament = null;
        this.getMedicamentsByFournisseur(this.fournisseurId); // Rechargement après commande
      },
      error => {
        console.error('Erreur lors de la commande', error);
        alert('❌ Erreur lors de la commande.');
      }
    );
  }

  filtrerMedicaments(): void {
    const search = this.searchText.trim().toLowerCase();
    this.filteredMedicaments = this.medicaments.filter(m =>
      m.nom.toLowerCase().includes(search)
    );
  }
}
