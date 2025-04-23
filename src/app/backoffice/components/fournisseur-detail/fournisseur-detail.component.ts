import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Fournisseur } from 'src/app/model/Fournisseur';
import { Medicament } from 'src/app/model/Medicament';
import { FournisseurService } from 'src/app/services/fournisseur.service';

@Component({
  selector: 'app-fournisseur-detail',
  templateUrl: './fournisseur-detail.component.html',
  styleUrls: ['./fournisseur-detail.component.css']
})
export class FournisseurDetailComponent implements OnInit {
  fournisseur: Fournisseur | undefined; // Will hold the fournisseur details
  errorMessage: string = ''; // To display error messages if any

  constructor(
    private fournisseurService: FournisseurService, // Inject FournisseurService
    private route: ActivatedRoute // To get route parameters like 'id'
  ) { }

  ngOnInit(): void {
    this.getFournisseurDetails(); // Fetch fournisseur details when component is initialized
  }

  // Method to fetch fournisseur details by id
  getFournisseurDetails(): void {
    const id = +this.route.snapshot.paramMap.get('id')!; // Get 'id' from route parameters (e.g., /fournisseur/2)
    
    if (id) {
      this.fournisseurService.getFournisseurById(id).subscribe(
        (data) => {
          this.fournisseur = data; // Store the fetched fournisseur in the component variable
        },
        (error) => {
          this.errorMessage = 'Fournisseur not found or error occurred!';
          console.error(error); // Log error in console if there's an issue
        }
      );
    } else {
      this.errorMessage = 'Invalid ID';
    }
  }
}