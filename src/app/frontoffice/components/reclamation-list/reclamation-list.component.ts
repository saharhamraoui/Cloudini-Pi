import { Component, OnInit } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/model/reclamation.model';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html'
})
export class ReclamationListComponent implements OnInit {
  reclamations: Reclamation[] = [];
  responseMap: { [key: number]: string[] } = {};

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.reclamationService.getAllReclamations().subscribe(data => {
      this.reclamations = data;

      this.reclamations.forEach(rec => {
        this.reclamationService.getResponsesByReclamationId(rec.id!).subscribe(responses => {
          this.responseMap[rec.id!] = responses.map(r => r.message);
        });
      });
    });
  }
}
