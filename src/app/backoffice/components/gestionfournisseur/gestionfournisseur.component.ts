import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Fournisseur } from 'src/app/model/Fournisseur';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-gestionfournisseur',
  templateUrl: './gestionfournisseur.component.html',
  styleUrls: ['./gestionfournisseur.component.css']
})
export class GestionfournisseurComponent implements OnInit, AfterViewInit {
  fournisseurs: Fournisseur[] = [];
  fournisseurForm!: FormGroup;
  isEditMode: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  map!: L.Map;

  constructor(
    private fournisseurService: FournisseurService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllFournisseurs();
    this.initForm();
  }

  initForm(): void {
    this.fournisseurForm = this.fb.group({
      idFournisseur: [null],
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      contact: ['', [Validators.required, Validators.email]]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.locate({ setView: true, maxZoom: 16 });

    this.map.on('locationfound', async (e: L.LocationEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      try {
        const address = await this.getAddressFromCoordinates(lat, lng);
        this.fournisseurForm.patchValue({ adresse: address });
      } catch (error) {
        console.error('Erreur lors de la récupération de l’adresse :', error);
      }

      const customIcon = L.icon({
        iconUrl: 'assets/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'assets/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });

      L.marker([lat, lng], { icon: customIcon }).addTo(this.map)
        .bindPopup('Vous êtes ici')
        .openPopup();
    });

    this.map.on('locationerror', (e: L.ErrorEvent) => {
      console.error('Impossible de trouver la localisation.', e);
      alert('Impossible de trouver votre position.');
      this.map.setView([48.8566, 2.3522], 11); // Paris par défaut
    });

    this.map.on('click', async (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      try {
        const address = await this.getAddressFromCoordinates(lat, lng);
        this.fournisseurForm.patchValue({ adresse: address });

        const customIcon = L.icon({
          iconUrl: 'assets/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'assets/marker-shadow.png',
          shadowSize: [41, 41],
          shadowAnchor: [12, 41]
        });

        L.marker([lat, lng], { icon: customIcon }).addTo(this.map)
          .bindPopup('Adresse sélectionnée')
          .openPopup();
      } catch (error) {
        console.error('Erreur lors de la récupération de l’adresse :', error);
      }
    });

    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);
  }

  async getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    return data.display_name;
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
          this.errorMessage = ''; 
          this.successMessage = 'Fournisseur ajouté avec succès !';
        },
        error => {
          this.successMessage = ''; 
          this.errorMessage = 'Erreur lors de l\'ajout du fournisseur.';
          console.error(error);
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      this.successMessage = '';
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
          this.successMessage = 'Fournisseur mis à jour avec succès!';
          this.errorMessage = '';
        },
        error => {
          this.successMessage = ''; 
          this.errorMessage = 'Erreur lors de la mise à jour du fournisseur.';
          console.error(error);
        }
      );
    } else {
      this.successMessage = ''; 
      this.errorMessage = 'Veuillez remplir tous les champs.';
    }
  }
  
  deleteFournisseur(id: number): void {
    this.fournisseurService.deleteFournisseur(id).subscribe(
      () => {
        this.fournisseurs = this.fournisseurs.filter(f => f.idfournisseur !== id);
        this.successMessage = 'Fournisseur supprimé avec succès!';
        this.errorMessage = '';
      },
      error => {
        this.successMessage = ''; 
        this.errorMessage = 'Le fournisseur a des commandes en cours ou une erreur est survenue.';
        console.error(error);
      }
    );
  }
  

  editFournisseur(fournisseur: Fournisseur): void {
    this.fournisseurForm.setValue({
      idFournisseur: fournisseur.idfournisseur,
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
