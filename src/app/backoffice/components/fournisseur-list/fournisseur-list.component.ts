import { Component, OnInit } from '@angular/core';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Medicament } from 'src/app/model/Medicament';
import { Fournisseur } from 'src/app/model/Fournisseur';

@Component({
  selector: 'app-fournisseur-list',
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.css']
})
export class FournisseurListComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  medicaments: Medicament[] = [];
  searchTerm: string = '';
  filteredFournisseurs: Fournisseur[] = [];
  cheapestMedicaments: { fournisseur: Fournisseur, medicament: Medicament }[] = [];

  constructor(private fournisseurService: FournisseurService) { }

  ngOnInit(): void {
    this.getAllFournisseurs();
  }

  // Get all suppliers
  getAllFournisseurs(): void {
    this.fournisseurService.getAllFournisseurs().subscribe(data => {
      this.fournisseurs = data;
      this.filteredFournisseurs = data;  // Set filteredFournisseurs to all suppliers initially
    });
  }

  searchFournisseursByMedicament(): void {
    if (this.searchTerm.trim() === '') {
      // If the search term is empty, show all fournisseurs
      this.filteredFournisseurs = this.fournisseurs;
    } else {
      this.fournisseurService.searchFournisseursByMedicament(this.searchTerm).subscribe(data => {
        if (data.length > 0) {
          this.filteredFournisseurs = data;
          this.filteredFournisseurs.forEach(fournisseur => {
            this.fournisseurService.getMedicamentsByFournisseur(fournisseur.idfournisseur).subscribe(medicaments => {
              fournisseur.medicaments = medicaments;
            });
          });
        } else {
          // If no fournisseurs are found, keep showing all fournisseurs
          this.filteredFournisseurs = this.fournisseurs;
        }
      });
    }
  }
  
  

  getMedicamentPrice(fournisseur: Fournisseur): number | string {
    if (fournisseur.medicaments) {
      const medicament = fournisseur.medicaments.find(med => 
        med.nom.toLowerCase() === this.searchTerm.toLowerCase()  // Make comparison case-insensitive
      );
      return medicament ? medicament.prix : 'Non disponible';
    }
    return 'Non disponible';
  }

  
  
}
