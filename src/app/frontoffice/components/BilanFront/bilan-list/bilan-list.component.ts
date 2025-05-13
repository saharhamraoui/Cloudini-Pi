import { Component, Input } from '@angular/core';
import { BilanService } from 'src/app/services/Bilan/bilan.service';

@Component({
  selector: 'app-bilan-list',
  templateUrl: './bilan-list.component.html',
  styleUrls: ['./bilan-list.component.css']
})
export class BilanListComponent {
  @Input() medicalRecordId?: number | null;
  bilans: any[] = [];

  constructor(private bilanService: BilanService) {}

  ngOnInit() {
    if (this.medicalRecordId) {
      this.bilanService.getBilansByMedicalRecord(this.medicalRecordId).subscribe(data => {
        this.bilans = data;
      });
    }
  }
}
