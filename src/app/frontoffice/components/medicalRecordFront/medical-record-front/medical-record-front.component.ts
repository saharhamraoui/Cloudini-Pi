import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { MedicalRecord } from 'src/app/model/MedicalRecord';
import { Prescription } from 'src/app/model/Prescription';
import { MedicalRecordService } from 'src/app/services/MedicalRecord/medical-record.service';
import { PrescriptionService } from 'src/app/services/Prescription/prescription.service';
import { BilanListComponent } from '../../BilanFront/bilan-list/bilan-list.component';

@Component({
  selector: 'app-medical-record-front',
  templateUrl: './medical-record-front.component.html',
  styleUrls: ['./medical-record-front.component.css'],
  animations: [
    trigger('cardAnimation', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class MedicalRecordFrontComponent implements OnInit {
   currentUser = {
    idUser: 1, // replace with actual id from DB after auto-increment
    email: 'medecin@gmail.com',
    firstName: 'ahmed',
    lastName: 'mohssen',
    role: 'MEDECIN',
    // you can add more fields if needed
  };
  medicalRecords: MedicalRecord[] = [];
  filteredRecords: MedicalRecord[] = [];
  selectedRecord: MedicalRecord | null = null;
  searchTerm: string = '';
  dateFilter: string = '';
  currentPage = 1;
  itemsPerPage = 6;
  currentPrescriptions: Prescription[] = [];
  showPrescriptionsModal = false;
  currentRecordId: number | null = null;
  isLoading = false;
  viewedRecord: MedicalRecord | null = null;
  isAddFormVisible = false;
  
  // Component methods to add
showBilanUploadModal = false;
showBilanListModal = false;
userRole: string = '';


openBilanUploadModal(recordId: number) {
  this.currentRecordId = recordId;
  this.showBilanUploadModal = true;
}

closeBilanUploadModal() {
  this.showBilanUploadModal = false;
}

openBilanListModal(recordId: number) {
  this.currentRecordId = recordId;
  this.showBilanListModal = true;
}

closeBilanListModal() {
  this.showBilanListModal = false;
}

onBilanUploaded() {
  // Refresh the bilan list if needed
  this.closeBilanUploadModal();
}

onBilanDeleted() {
  // Handle any cleanup after bilan deletion
}
  @ViewChild('bilanList') bilanList!: BilanListComponent;


  refreshBilans(recordId: number) {
    if (this.bilanList) {
      this.bilanList.ngOnInit(); // Refresh the bilan list
    }
  }

  newRecord: any = {
    diagnosis: '',
    notes: '',
    allergies: ''
  };

  onShowAddForm(): void {
    this.isAddFormVisible = true;
  }



  addRecord(): void {
    this.newRecord.Doctor=this.currentUser;
    this.medicalRecordService.addMedicalrecord(this.newRecord).subscribe({
      next: (record) => {
        this.medicalRecords.unshift(record);
        this.filteredRecords.unshift(record);
        this.closeAddForm();
      },
      error: (err) => console.error('Error creating record', err)
    });
  }


  closeAddForm(): void {
    this.isAddFormVisible = false;
  }
  // Add to your existing component class
openPrescriptionsModal(recordId: number): void {
  this.currentRecordId = recordId;
  this.prescriptionService.getPrescriptionByIdRecord(recordId).subscribe(
    (prescriptions) => {
      this.currentPrescriptions = prescriptions;
      this.showPrescriptionsModal = true;
    },
    (error) => {
      console.error('Error loading prescriptions:', error);
      this.currentPrescriptions = [];
      this.showPrescriptionsModal = true;
    }
  );
}

closePrescriptionsModal(): void {
  this.showPrescriptionsModal = false;
  this.currentRecordId = null;
  this.currentPrescriptions = [];
}
  constructor(
    private medicalRecordService: MedicalRecordService,
    private prescriptionService: PrescriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMedicalRecords();
  }

  loadMedicalRecords(): void {
    this.isLoading = true;
  
    if (this.currentUser.role === 'PATIENT') {
      this.medicalRecordService.getByPatient(this.currentUser.idUser).subscribe(
        (data) => {
          this.medicalRecords = data;
          this.filteredRecords = [...data];
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading patient records:', error);
          this.isLoading = false;
        }
      );
    } else if (this.currentUser.role === 'MEDECIN') {
      this.medicalRecordService.getByDoctor(this.currentUser.idUser).subscribe(
        (data) => {
          this.medicalRecords = data;
          this.filteredRecords = [...data];
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading doctor records:', error);
          this.isLoading = false;
        }
      );
    }
  }
  

  onSearch(): void {
    const searchTerm = this.searchTerm.toLowerCase();
    this.filteredRecords = this.medicalRecords.filter(record => 
      (record.diagnosis?.toLowerCase().includes(searchTerm)) ||
      (record.notes?.toLowerCase().includes(searchTerm)) ||
      (record.allergies?.toLowerCase().includes(searchTerm)) ||
      (`${record.idMedicalRecord}`.includes(searchTerm))
    );
    this.currentPage = 1;
  }

  applyFilters(): void {
    let result = [...this.medicalRecords];
    
    if (this.dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      result = result.filter(record => {
        const recordDate = new Date(record.createdAt || '');
        
        switch(this.dateFilter) {
          case 'today':
            return recordDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            return recordDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            return recordDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(today.getFullYear() - 1);
            return recordDate >= yearAgo;
          default:
            return true;
        }
      });
    }
    
    this.filteredRecords = result;
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.dateFilter = '';
    this.filteredRecords = [...this.medicalRecords];
    this.currentPage = 1;
  }

  getRecentCount(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.medicalRecords.filter(record => {
      const recordDate = new Date(record.createdAt || '');
      return recordDate >= thirtyDaysAgo;
    }).length;
  }



  viewRecordDetails(record: MedicalRecord): void {
    this.selectedRecord = {...record};
  }

  downloadPDF(record: MedicalRecord): void {
    const doc = new jsPDF();
    const primaryColor = '#667eea';
    const secondaryColor = '#764ba2';
    
    // Header with gradient
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 220, 30, 'F');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Medical Record', 105, 20, { align: 'center' });
    
    // Doctor info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Doctor: Dr. ${record.doctor?.firstName} ${record.doctor?.lastName}`, 20, 50);
    doc.text(`Date: ${new Date(record.createdAt || '').toLocaleDateString()}`, 150, 50);
    
    // Patient info
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information:', 20, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${record.patient?.firstName} ${record.patient?.lastName}`, 20, 80);
    doc.text(`Age: ${this.calculateAge(record.patient?.dateOfBirth || '')}`, 20, 90);
    
    // Record details
    doc.setFont('helvetica', 'bold');
    doc.text('Record Details:', 20, 110);
    doc.setFont('helvetica', 'normal');
    doc.text(`Record ID: ${record.idMedicalRecord}`, 20, 120);
    doc.text(`Diagnosis: ${record.diagnosis || 'Not specified'}`, 20, 130);
    doc.text(`Allergies: ${record.allergies || 'None recorded'}`, 20, 140);
    
    // Notes with wrapping
    const notes = doc.splitTextToSize(`Notes: ${record.notes || 'No additional notes'}`, 170);
    doc.text(notes, 20, 150);
    
    // Footer
    doc.setTextColor(100);
    doc.setFont('helvetica', 'italic');
    doc.text('This document contains confidential medical information.', 105, 280, { align: 'center' });
    
    // Save the PDF
    doc.save(`medical-record-${record.idMedicalRecord}.pdf`);
  }

  calculateAge(birthDate: string): string {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
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
    return Math.ceil(this.filteredRecords.length / this.itemsPerPage);
  }
}