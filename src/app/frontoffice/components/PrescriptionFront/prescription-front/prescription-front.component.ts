import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { MedicalRecord } from 'src/app/model/MedicalRecord';
import { Prescription } from 'src/app/model/Prescription';
import { PrescriptionStatus } from 'src/app/model/PrescriptionStatus';
import { PrescriptionService } from 'src/app/services/Prescription/prescription.service';
import { SmsService } from 'src/app/services/Sms/sms.service';

@Component({
  selector: 'app-prescription-front',
  templateUrl: './prescription-front.component.html',
  styleUrls: ['./prescription-front.component.css']
})
export class PrescriptionFrontComponent implements OnInit {
  @Input() medicalRecord: MedicalRecord | null = null;
  prescriptions: Prescription[] = [];
  filteredPrescriptions: Prescription[] = [];
  viewedPrescription: Prescription | null = null;
  searchTerm: string = '';
  statusFilter: string = '';
  currentPage = 1;
  itemsPerPage = 6;

  constructor(
    private prescriptionService: PrescriptionService,
    private smsService: SmsService,
    private router: Router
  ) {}

  speechSynthesis: SpeechSynthesis = window.speechSynthesis;
  currentUtterance: SpeechSynthesisUtterance | null = null;
  
  readPrescription(prescription: Prescription, language: 'en' | 'fr'): void {
    const text = language === 'fr'
      ? `Médicament: ${prescription.medication}. Dosage: ${prescription.dosage}. Instructions: ${prescription.instructions}`
      : `Medication: ${prescription.medication}. Dosage: ${prescription.dosage}. Instructions: ${prescription.instructions}`;
  
    // Stop any ongoing speech first
    this.stopReading();
  
    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.lang = language === 'fr' ? 'fr-FR' : 'en-US';
    this.speechSynthesis.speak(this.currentUtterance);
  }
  
  stopReading(): void {
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }
  }
  
  
  ngOnInit(): void {
    this.loadPrescriptions();
    console.log('MedicalRecord ID:', this.medicalRecord?.idMedicalRecord);

  }

  loadPrescriptions(): void {
    if (this.medicalRecord?.idMedicalRecord) {
        // Load prescriptions for specific medical record
        this.prescriptionService.getPrescriptionById(this.medicalRecord.idMedicalRecord)
            .subscribe(prescriptions => {
                this.prescriptions = prescriptions;
                this.filteredPrescriptions = [...prescriptions];
            });
    } else {
        // Load all prescriptions
        this.prescriptionService.getPrescriptions()
            .subscribe(prescriptions => {
                this.prescriptions = prescriptions;
                this.filteredPrescriptions = [...prescriptions];
            });
    }
}

  onSearch(): void {
    const searchTerm = this.searchTerm.toLowerCase();
    this.filteredPrescriptions = this.prescriptions.filter(prescription => 
      prescription.medication.toLowerCase().includes(searchTerm) ||
      prescription.instructions.toLowerCase().includes(searchTerm)
    );
    this.currentPage = 1;
  }

  applyFilters(): void {
    let result = [...this.prescriptions];
    
    if (this.statusFilter) {
      result = result.filter(p => p.status === this.statusFilter);
    }
    
    this.filteredPrescriptions = result;
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.filteredPrescriptions = [...this.prescriptions];
    this.currentPage = 1;
  }

  getActiveCount(): number {
    return this.prescriptions.filter(p => p.status === PrescriptionStatus.ACTIVE).length;
  }

  getPendingCount(): number {
    return this.prescriptions.filter(p => p.status === PrescriptionStatus.PENDING).length;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  viewDetails(prescription: Prescription): void {
    this.viewedPrescription = {...prescription};
  }

  generatePdfPrescription(prescription: Prescription): void {
    const doc = new jsPDF();
    const primaryColor = '#3498db';
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Medical Prescription', 105, 20, { align: 'center' });
    
    // Doctor info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Doctor: Dr. ${this.medicalRecord?.doctor?.firstName} ${this.medicalRecord?.doctor?.lastName}`, 20, 40);
    doc.text(`Date: ${new Date(prescription.issueDate).toLocaleDateString()}`, 150, 40);
    
    // Patient info
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information:', 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${this.medicalRecord?.patient?.firstName} ${this.medicalRecord?.patient?.lastName}`, 20, 70);
    doc.text(`Record ID: ${this.medicalRecord?.idMedicalRecord}`, 20, 80);
    
    // Prescription details
    doc.setFont('helvetica', 'bold');
    doc.text('Prescription Details:', 20, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Medication: ${prescription.medication}`, 20, 110);
    doc.text(`Dosage: ${prescription.dosage}`, 20, 120);
    doc.text(`Status: ${prescription.status}`, 20, 130);
    
    // Instructions with wrapping
    const instructions = doc.splitTextToSize(`Instructions: ${prescription.instructions}`, 170);
    doc.text(instructions, 20, 140);
    
    // Footer
    doc.setTextColor(100);
    doc.setFont('helvetica', 'italic');
    doc.text('This prescription is valid for 30 days from issue date.', 105, 280, { align: 'center' });
    
    // Save the PDF
    doc.save(`prescription-${prescription.idPrescription}.pdf`);
  }

  sendSmsNotification(prescription: Prescription): void {
    const message = `Reminder: Take ${prescription.medication}, ${prescription.dosage}. ${prescription.instructions}`;
    this.smsService.sendSms('+1234567890', message).subscribe({
      next: () => alert('SMS reminder sent successfully!'),
      error: () => alert('Failed to send SMS reminder')
    });
  }

  goBack(): void {
    this.router.navigate(['/medical-records']);
  }

  // Pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPrescriptions.length / this.itemsPerPage);
  }

  //add modal functions 
  // Add these properties
showAddPrescriptionModal: boolean = false;
newPrescription: Prescription = {
  medication: '',
  dosage: '',
  instructions: '',
  issueDate: new Date().toISOString().split('T')[0],
  status: PrescriptionStatus.ACTIVE
};

// Add these methods
openAddPrescriptionModal(): void {
  this.showAddPrescriptionModal = true;
}

closeAddPrescriptionModal(): void {
  this.showAddPrescriptionModal = false;
  this.newPrescription = {
    medication: '',
    dosage: '',
    instructions: '',
    issueDate: new Date().toISOString().split('T')[0],
    status: PrescriptionStatus.ACTIVE
  };
}

onSubmitPrescription(): void {
  this.prescriptionService.addPrescriptions(this.newPrescription).subscribe({
    next: (response) => {
      // Handle success
      this.closeAddPrescriptionModal();
      this.loadPrescriptions(); // Refresh your prescription list
    },
    error: (err) => {
      console.error('Error adding prescription:', err);
    }
  });
}
}