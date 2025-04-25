import { Component, OnInit } from '@angular/core';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { MedicamentService } from 'src/app/services/medicament.service';
import { Medicament } from 'src/app/model/Medicament';

@Component({
  selector: 'app-gestionmeds',
  templateUrl: './gestionmeds.component.html',
  styleUrls: ['./gestionmeds.component.css']
})
export class GestionmedsComponent implements OnInit {
  medicaments: Medicament[] = [];
  medicament: Medicament = {
    nom: '',
    description: '',
    quantite: 0,
    dateExpiration: '',
    prix: 0,
    idfournisseur: 0
  } as Medicament;

  fournisseurs: any[] = [];
  minDate: string = '';
  isEditing: boolean = false;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private medicamentService: MedicamentService,
    private fournisseurService: FournisseurService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.loadFournisseurs();
    this.loadMedicaments();
  }

  loadFournisseurs(): void {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: data => {
        this.fournisseurs = data;
      },
      error: err => {
        console.error("Erreur chargement fournisseurs :", err);
      }
    });
  }

  loadMedicaments(): void {
    this.medicamentService.getAllMedicaments().subscribe({
      next: data => {
        this.medicaments = data;
      },
      error: err => {
        console.error("Erreur chargement médicaments :", err);
      }
    });
  }

  ajouterMedicament() {
    if (this.isEditing) {
      this.updateMedicament();
    } else {
      this.createMedicament();
    }
  }

  createMedicament(): void {
    const medicamentToSend = { ...this.medicament };
    
    this.medicamentService.addMedicamentToFournisseur(
      medicamentToSend.idfournisseur,
      medicamentToSend
    ).subscribe({
      next: res => {
        this.successMessage = 'Médicament ajouté avec succès';
        this.errorMessage = '';
        this.resetForm();
        this.loadMedicaments();
      },
      error: err => {
        this.errorMessage = 'Erreur lors de l\'ajout du médicament';
        this.successMessage = '';
      }
    });
  }

  updateMedicament(): void {
    this.medicamentService.updateMedicament(this.medicament).subscribe({
      next: res => {
        this.successMessage = 'Médicament modifié avec succès';
        this.errorMessage = '';
        this.resetForm();
        this.loadMedicaments();
      },
      error: err => {
        this.errorMessage = 'Erreur lors de la modification du médicament';
        this.successMessage = '';
      }
    });
  }

  editMedicament(medicament: Medicament): void {
    this.medicament = { ...medicament };
    this.isEditing = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteMedicament(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce médicament?')) {
      this.medicamentService.deleteMedicament(id).subscribe({
        next: () => {
          this.successMessage = 'Médicament supprimé avec succès';
          this.errorMessage = '';
          this.loadMedicaments();
        },
        error: err => {
          this.errorMessage = 'Erreur lors de la suppression du médicament';
          this.successMessage = '';
        }
      });
    }
  }
  getFournisseurName(idFournisseur: number): string {
    const fournisseur = this.fournisseurs.find(f => f.idfournisseur === idFournisseur);
    return fournisseur ? fournisseur.nom : 'Inconnu';
  }
  resetForm(): void {
    this.medicament = {
      idmedicament: 0,  
      nom: '',
      description: '',
      quantite: 0,
      dateExpiration: '',
      prix: 0,
      idfournisseur: 0
    };
    this.isEditing = false;
  }
}