import { Component, OnInit } from '@angular/core';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { MedicamentService } from 'src/app/services/medicament.service';
import { CommandeService } from 'src/app/services/commande.service';  // Import the service
import { Medicament } from 'src/app/model/Medicament';
import { StockService } from 'src/app/services/stock.service';  // Import the stock service

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
    private fournisseurService: FournisseurService,
    private commandeService: CommandeService,  // Inject the commande service
    private stockService: StockService  // Inject the stock service
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
        console.log('Fournisseurs chargés:', data);  
        this.fournisseurs = data;
      },
      error: err => {
        console.error("Erreur chargement fournisseurs :", err);
        this.errorMessage = 'Erreur lors du chargement des fournisseurs. Veuillez réessayer.';
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
        this.errorMessage = 'Erreur lors du chargement des médicaments. Veuillez réessayer.';
      }
    });
  }

  ajouterMedicament() {
    this.successMessage = '';
    this.errorMessage = '';

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
        this.successMessage = 'Le médicament a été ajouté avec succès.';
        this.resetForm();
        this.loadMedicaments();
      },
      error: err => {
        this.errorMessage = 'Une erreur est survenue lors de l\'ajout du médicament. Veuillez réessayer.';
      }
    });
  }

  updateMedicament(): void {
    this.medicamentService.updateMedicament(this.medicament).subscribe({
      next: res => {
        this.successMessage = 'Le médicament a été modifié avec succès.';
        this.resetForm();
        this.loadMedicaments();
      },
      error: err => {
        this.errorMessage = 'Une erreur est survenue lors de la modification du médicament. Veuillez réessayer.';
      }
    });
  }

  editMedicament(medicament: Medicament): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.medicament = { ...medicament };
    this.isEditing = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteMedicament(id: number): void {
    this.successMessage = '';
    this.errorMessage = '';

    // Check if the medicament is in any order or still in stock
    this.commandeService.getCommandes().subscribe({
      next: (commandes) => {
        const isInOrder = commandes?.some((commande: any) => 
          commande.medicaments?.some((medicament: Medicament) => medicament.idmedicament === id)
        );
        

        if (isInOrder) {
          this.errorMessage = 'Impossible de supprimer le médicament, il est déjà dans une commande.';
          return;
        }

        this.stockService.getallStocks().subscribe({
          next: (stocks) => {
            const isInStock = stocks.some((stock: any) => stock.medicament.idmedicament === id);

            if (isInStock) {
              this.errorMessage = 'Impossible de supprimer le médicament, il est encore dans le stock.';
              return;
            }

            // If not in any order or stock, proceed with deletion
            if (confirm('Êtes-vous sûr de vouloir supprimer ce médicament ? Cette action est irréversible.')) {
              this.medicamentService.deleteMedicament(id).subscribe({
                next: () => {
                  this.successMessage = 'Le médicament a été supprimé avec succès.';
                  this.loadMedicaments();
                },
                error: err => {
                  this.errorMessage = 'Impossible de supprimer le médicament, il est déjà dans une commande.';
                }
              });
            }
          },
          error: (err) => {
            console.error("Erreur lors de la vérification du stock:", err);
            this.errorMessage = 'Erreur lors de la vérification du stock.';
          }
        });
      },
      error: (err) => {
        console.error("Erreur lors de la vérification des commandes:", err);
        this.errorMessage = 'Erreur lors de la vérification des commandes.';
      }
    });
  }
  
  getFournisseurName(idFournisseur: number): string {
    const fournisseur = this.fournisseurs.find(f => f.idfournisseur === idFournisseur);
    if (!fournisseur) {
      console.warn(`Fournisseur avec ID ${idFournisseur} non trouvé`);
      return 'Fournisseur non trouvé';
    }
    return fournisseur.nom;
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
