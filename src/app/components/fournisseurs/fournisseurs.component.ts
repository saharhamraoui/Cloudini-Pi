import { Component, OnInit } from '@angular/core';
import { Fournisseur } from 'src/app/models/Fournisseur';
import { Medicament } from 'src/app/models/Medicament';
import { FournisseurService } from 'src/app/services/fournisseur.service';

@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.css']
})
export class FournisseursComponent implements OnInit {

  fournisseurs: Fournisseur[] = [];
  newFournisseur: Fournisseur = { idfournisseur: 0, nom: '', contact: '', adresse: '', medicaments: [] };
  searchTerm: string = '';
  bestFournisseurs: Fournisseur[] = [];
  selectedFournisseur: Fournisseur | null = null;

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.getFournisseurs();
  }

  getFournisseurs(): void {
    this.fournisseurService.getAllFournisseurs().subscribe((data: Fournisseur[]) => {
      this.fournisseurs = data;
    });
  }

  addFournisseur(): void {
    this.fournisseurService.addFournisseur(this.newFournisseur).subscribe((data: Fournisseur) => {
      this.fournisseurs.push(data);
      this.newFournisseur = { idfournisseur: 0, nom: '', contact: '', adresse: '', medicaments: [] };
    });
  }

  deleteFournisseur(id: number): void {
    this.fournisseurService.deleteFournisseur(id).subscribe(() => {
      this.fournisseurs = this.fournisseurs.filter(f => f.idfournisseur !== id);
    });
  }

  searchBestFournisseurs(): void {
    if (this.searchTerm.trim()) {
      this.fournisseurService.getBestFournisseurs(this.searchTerm).subscribe((data: Fournisseur[]) => {
        this.bestFournisseurs = data;
      });
    }
  }

  toggleMedicamentList(fournisseur: Fournisseur): void {
    this.selectedFournisseur = this.selectedFournisseur === fournisseur ? null : fournisseur;
  }
}