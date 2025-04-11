import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Fournisseur } from 'src/app/models/Fournisseur';
import { FournisseurService } from 'src/app/services/fournisseur.service';

@Component({
  selector: 'app-gestionfournisseur',
  templateUrl: './gestionfournisseur.component.html',
  styleUrls: ['./gestionfournisseur.component.css']
})
export class GestionfournisseurComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  fournisseurForm!: FormGroup;
  isEditMode: boolean = false;
  errorMessage: string = '';

  constructor(
    private fournisseurService: FournisseurService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllFournisseurs();
    this.initForm();
  }

  initForm(): void {
    this.fournisseurForm = this.fb.group({
      idFournisseur: [null],  // This is the field that should hold 'idfournisseur'
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      contact: ['', Validators.required]
    });
  }
  

  getAllFournisseurs(): void {
    this.fournisseurService.getAllFournisseurs().subscribe(
      data => {
        this.fournisseurs = data;
      },
      error => {
        this.errorMessage = 'Erreur lors de la récupération des fournisseurs.';
        console.error(error);
      }
    );
  }

  addFournisseur(): void {
    if (this.fournisseurForm.valid) {
      this.fournisseurService.addFournisseur(this.fournisseurForm.value).subscribe(
        response => {
          this.fournisseurs.push(response);
          this.resetForm();
        },
        error => {
          this.errorMessage = 'Erreur lors de l\'ajout du fournisseur.';
          console.error(error);
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs.';
    }
  }

  updateFournisseur(): void {
    if (this.fournisseurForm.valid) {
      const fournisseurToUpdate = { 
        ...this.fournisseurForm.value,
        idfournisseur: this.fournisseurForm.value.idFournisseur 
      };
      this.fournisseurService.updateFournisseur(fournisseurToUpdate).subscribe(
        response => {
          const index = this.fournisseurs.findIndex(f => f.idfournisseur === this.fournisseurForm.value.idFournisseur);
          if (index !== -1) {
            this.fournisseurs[index] = response;
          }
          this.resetForm();
        },
        error => {
          this.errorMessage = 'Erreur lors de la mise à jour du fournisseur.';
          console.error(error);
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs.';
    }
  }
  
  

  deleteFournisseur(id: number): void {
    this.fournisseurService.deleteFournisseur(id).subscribe(
      () => {
        this.fournisseurs = this.fournisseurs.filter(f => f.idfournisseur !== id);
      },
      error => {
        this.errorMessage = 'Erreur lors de la suppression du fournisseur.';
        console.error(error);
      }
    );
  }

  editFournisseur(fournisseur: Fournisseur): void {
    this.fournisseurForm.setValue({
      idFournisseur: fournisseur.idfournisseur,  // Make sure you use 'idfournisseur'
      nom: fournisseur.nom,
      adresse: fournisseur.adresse,
      contact: fournisseur.contact
    });
    this.isEditMode = true;
  }
  
  

  resetForm(): void {
    this.fournisseurForm.reset();
    this.isEditMode = false;
    this.errorMessage = '';
  }
}