import { Component } from '@angular/core';
import { Medicament } from 'src/app/models/Medicament';
import { MedicamentService } from 'src/app/services/medicament.service';

@Component({
  selector: 'app-medicament',
  templateUrl: './medicament.component.html',
  styleUrls: ['./medicament.component.css']
})
export class MedicamentComponent {
  medicaments: Medicament[] = [];
  newMedicament: Medicament = { nom: '', description: '', quantite: 0, dateExpiration: '', prix: 0 };

  constructor(private medicamentService: MedicamentService) {}

  ngOnInit(): void {
    this.fetchMedicaments();
  }

  fetchMedicaments(): void {
    this.medicamentService.getAllMedicaments().subscribe(data => {
      this.medicaments = data;
    });
  }

  addMedicament(): void {
    this.medicamentService.addMedicament(this.newMedicament).subscribe(() => {
      this.fetchMedicaments();
      this.newMedicament = { nom: '', description: '', quantite: 0, dateExpiration: '', prix: 0 }; // Reset form
    });
  }

  deleteMedicament(id?: number): void {
    if (id === undefined) {
      console.error("Medicament ID is undefined.");
      return;
    }
    this.medicamentService.deleteMedicament(id).subscribe(() => {
      this.medicaments = this.medicaments.filter(m => m.idmedicament !== id);
    });
  }
  
}
