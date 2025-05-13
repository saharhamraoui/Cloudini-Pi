import { Component, OnInit } from '@angular/core';
import { Reclamation } from 'src/app/model/reclamation.model';
import { ReclamationService } from 'src/app/services/reclamation.service';

@Component({
  selector: 'app-reclamation-management',
  templateUrl: './reclamation-management.component.html'
})
export class ReclamationManagementComponent implements OnInit {
  reclamations: Reclamation[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  categoryFilter: string = '';
  emotionFilter: string = '';

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe((data) => {
      this.reclamations = data;
    });
  }

  deleteReclamation(id: number): void {
    this.reclamationService.deleteReclamation(id).subscribe(() => {
      this.reclamations = this.reclamations.filter(r => r.id !== id);
    });
  }

  triggerEscalation(): void {
    this.reclamationService.triggerEscalation().subscribe(() => {
      alert('✔ Réclamations escaladées avec succès !');
      this.loadReclamations(); // reload list
    });
  }

  markResolved(id: number): void {
    const rec = this.reclamations.find(r => r.id === id);
    if (!rec) return;
  
    const updatedReclamation = { ...rec, status: 'RESOLVED' };
  
    this.reclamationService.updateReclamation(updatedReclamation).subscribe(() => {
      alert('✔ Réclamation marquée comme résolue.');
      this.loadReclamations(); // refresh list
    });
  }

  filteredReclamations(): Reclamation[] {
    if (!this.searchTerm?.trim()) return this.reclamations;
  
    const term = this.searchTerm.toLowerCase();
    return this.reclamations.filter(rec =>
      (rec.description?.toLowerCase().includes(term)) ||
      (rec.status?.toLowerCase().includes(term)) ||
      (rec.category?.toLowerCase().includes(term)) ||
      (rec.emotion?.toLowerCase().includes(term))
    );
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.categoryFilter = '';
    this.emotionFilter = '';
  }
}

