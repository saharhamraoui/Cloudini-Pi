import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { jsPDF } from 'jspdf';
import { Medecin } from 'src/app/model/Medecin';
import { MedicalRecord } from 'src/app/model/MedicalRecord';
import { Patient } from 'src/app/model/Patient';
import { Prescription } from 'src/app/model/Prescription';
import { MedicalRecordService } from 'src/app/services/MedicalRecord/medical-record.service';
import { PrescriptionService } from 'src/app/services/Prescription/prescription.service';
Chart.register(...registerables);

@Component({
  selector: 'app-list-medcical-record',
  templateUrl: './list-medcical-record.component.html',
  styleUrls: ['./list-medcical-record.component.css']
})
export class ListMedcicalRecordComponent {
  medicalRecords: MedicalRecord[] = [];
  filteredRecords: MedicalRecord[] = [];
  selectedQRCodeRecordId: number | null = null;
  selectedRecord: MedicalRecord | null = null;
  viewedRecord: MedicalRecord | null = null;
  isAddFormVisible = false;
  
  // New record form model
  newRecord: any = {
    diagnosis: '',
    notes: '',
    allergies: ''
  };
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  dateFilter = '';

   selectedPatient: Patient = {
    idUser: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@demo.com',
    password: 'securePass',
    phoneNumber: '1234567890',
    address: '123 Main St',
    medicalRecordNumber: 'MR001',
    bloodGroup: 'O+',
    healthInsuranceNumber: 'HIN123',
    gender: 'Male',
    dateOfBirth: '1990-01-01',
    rendezVous: []
  };
  
   selectedDoctor: Medecin = {
    idUser: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@clinic.com',
    password: 'anotherPass',
    phoneNumber: '9876543210',
    address: '456 Clinic Ave',
    speciality: 'Cardiology',
    licenseNumber: 'LIC456',
    availability: [],
    rendezVous: []
  };
  

  //stats 
medicalRecordStats = {
  withDiagnosis: 0,
  withAllergies: 0,
  recentRecords: 0
};

monthlyRecordData: { month: string, count: number }[] = [];
topDiagnosesData: { diagnosis: string, count: number }[] = [];

//modal upload 
// Add to your component class
isImportModalVisible = false;

openImportModal(): void {
  this.isImportModalVisible = true;
}

closeImportModal(): void {
  this.isImportModalVisible = false;
  this.isDragOver = false;
  this.importProgress = 0;
}

  constructor(private medicalRecordService: MedicalRecordService,  private prescriptionService: PrescriptionService
  ) {}

  

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        try {
          const content = reader.result as string;
          console.log('File content:', content);
  
          let parsed: Partial<MedicalRecord>;
  
          if (file.type === 'application/json' || file.name.endsWith('.json')) {
            parsed = JSON.parse(content);
          } else {
            parsed = this.parseTextToRecord(content);
          }
  
          // Validate required fields
          if (!parsed.diagnosis) {
            throw new Error('Diagnosis is required');
          }
  
          const recordToSend = {
            diagnosis: parsed.diagnosis,
            notes: parsed.notes || null,
            allergies: parsed.allergies || null,
            patientId: this.selectedPatient.idUser,
            doctorId: this.selectedDoctor.idUser
          } as unknown as MedicalRecord; // Only if backend accepts this format
  
          console.log('Sending record:', recordToSend);
  
          this.medicalRecordService.addMedicalrecord(recordToSend).subscribe({
            next: (record) => {
              this.medicalRecords.unshift(record);
              this.filteredRecords.unshift(record);
              alert('Record imported successfully!');
            },
            error: (err) => {
              console.error('Error creating record', err);
              alert(`Error: ${err.message || 'Failed to create record'}`);
            }
          });
  
        } catch (e) {
          console.error('Error processing file', e);
          alert(`Error: ${e instanceof Error ? e.message : 'Invalid file format'}`);
        }
      };
  
      reader.readAsText(file);
    }
  }

  parseTextToRecord(content: string): Partial<MedicalRecord> {
    const lines = content.split('\n');
    const record: Partial<MedicalRecord> = {};
    
    lines.forEach(line => {
      if (line.trim() === '') return;
      
      const [key, ...rest] = line.split(':');
      const value = rest.join(':').trim();
      
      switch (key.toLowerCase().trim()) {
        case 'diagnosis':
          record.diagnosis = value;
          break;
        case 'notes':
          record.notes = value;
          break;
        case 'allergies':
          record.allergies = value;
          break;
      }
    });
    
    return record;
  }


  ngOnInit(): void {
    this.fetchMedicalRecords();
  }

  fetchMedicalRecords(): void {
    this.medicalRecordService.getMedicalRecords().subscribe(data => {
      this.medicalRecords = data;
      this.filteredRecords = [...this.medicalRecords];
      this.calculateChartData(); // Add this line
      this.initCharts(); // Initialize charts after data is ready
    });
  }

  // QR Code functions
  toggleQRCode(recordId: number | undefined): void {
    if (this.selectedQRCodeRecordId === recordId) {
      this.selectedQRCodeRecordId = null;
    } else {
      this.selectedQRCodeRecordId = recordId ?? null;
    }
  }

  getRecordById(id: number): MedicalRecord | undefined {
    return this.medicalRecords.find(record => record.idMedicalRecord === id);
  }

  getQRCodeData(record: MedicalRecord): string {
    const notes = record.notes ? record.notes.substring(0, 100) + '...' : 'No notes';
    const diagnosis = record.diagnosis || 'No diagnosis';
    const allergies = record.allergies || 'No allergies';
    const createdAt = record.createdAt || 'Unknown date';

    return `--- MEDICAL RECORD ---
ID: ${record.idMedicalRecord}
Date: ${createdAt}
Diagnosis: ${diagnosis}
Notes: ${notes}
Allergies: ${allergies}`;
  }

  // Stats functions
  getRecordsWithDiagnosis(): number {
    return this.medicalRecords.filter(record => record.diagnosis && record.diagnosis.trim() !== '').length;
  }

  getRecordsWithAllergies(): number {
    return this.medicalRecords.filter(record => record.allergies && record.allergies.trim() !== '').length;
  }

  getRecentRecords(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.medicalRecords.filter(record => {
      const recordDate = new Date(record.createdAt || '');
      return recordDate >= oneWeekAgo;
    }).length;
  }

  // Add these to your component class
isPrescriptionsModalVisible = false;
selectedPrescriptions: Prescription[] = [];
selectedRecordForPrescriptions: MedicalRecord | null = null;


// Add these methods to your component class
showPrescriptions(record: MedicalRecord): void {
  if (record.idMedicalRecord) {
    this.prescriptionService.getPrescriptionByIdRecord(record.idMedicalRecord).subscribe(prescriptions => {
      this.selectedPrescriptions = prescriptions;
      this.selectedRecordForPrescriptions = record;
      this.isPrescriptionsModalVisible = true;
    });
  }
}

closePrescriptionsModal(): void {
  this.isPrescriptionsModalVisible = false;
  this.selectedPrescriptions = [];
  this.selectedRecordForPrescriptions = null;
}
  // CRUD operations
  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this medical record?')) {
      this.medicalRecordService.deletePaiement(id).subscribe(() => {
        this.medicalRecords = this.medicalRecords.filter(rec => rec.idMedicalRecord !== id);
        this.filteredRecords = this.filteredRecords.filter(rec => rec.idMedicalRecord !== id);
      }, error => {
        console.error('Error deleting record:', error);
      });
    }
  }

  onUpdate(record: MedicalRecord): void {
    this.selectedRecord = { ...record };
  }

  cancelUpdate(): void {
    this.selectedRecord = null;
  }

  submitUpdate(): void {
    if (!this.selectedRecord) return;
  
    this.medicalRecordService.updateMedicalRecord(this.selectedRecord).subscribe({
      next: (updatedRecord) => {
        const index = this.medicalRecords.findIndex(r => r.idMedicalRecord === updatedRecord.idMedicalRecord);
        if (index !== -1) {
          this.medicalRecords[index] = updatedRecord;
          this.filteredRecords[index] = updatedRecord;
        }
        this.selectedRecord = null;
      },
      error: (err) => console.error('Erreur lors de la mise à jour du dossier médical', err)
    });
  }
  

  // Add record functions
  onShowAddForm(): void {
    this.isAddFormVisible = true;
  }

  closeAddForm(): void {
    this.isAddFormVisible = false;
  }

  addRecord(): void {
    this.medicalRecordService.addMedicalrecord(this.newRecord).subscribe({
      next: (record) => {
        this.medicalRecords.unshift(record);
        this.filteredRecords.unshift(record);
        this.closeAddForm();
      },
      error: (err) => console.error('Error creating record', err)
    });
  }

  // View details
  viewDetails(record: MedicalRecord): void {
    this.viewedRecord = { ...record };
  }

 
  downloadPDF(medicalRecord: any) {
    const doc = new jsPDF();
  
    // Titre stylisé
    doc.setFontSize(18);
    doc.setTextColor('#0e5551');
    doc.text('Dossier Médical', 105, 20, { align: 'center' });
  
    // Bordure du document
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);
  
    // Ligne sous le titre
    doc.line(20, 25, 190, 25);
  
    // Section Informations
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Informations du Dossier:', 20, 35);
  
    doc.setFontSize(12);
  
    doc.setFont('helvetica', 'bold');
    doc.text(`ID Dossier :`, 20, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(`${medicalRecord.idMedicalRecord}`, 60, 45);
  
    doc.setFont('helvetica', 'bold');
    doc.text(`Date de création :`, 20, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(`${medicalRecord.createdAt}`, 60, 55);
  
    doc.setFont('helvetica', 'bold');
    doc.text(`Diagnostic :`, 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`${medicalRecord.diagnosis || 'N/A'}`, 60, 65);
  
    doc.setFont('helvetica', 'bold');
    doc.text(`Notes :`, 20, 75);
    doc.setFont('helvetica', 'normal');
    doc.text(`${medicalRecord.notes || 'N/A'}`, 60, 75);
  
    doc.setFont('helvetica', 'bold');
    doc.text(`Allergies :`, 20, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(`${medicalRecord.allergies || 'Aucune'}`, 60, 85);
  
    // Pied de page
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Merci pour votre confiance.', 105, 290, { align: 'center' });
  
    doc.save(`DossierMedical-${medicalRecord.idMedicalRecord}.pdf`);
  }
  
  onPrint(record: any) {
    const printContent = `
      <div>
        <h2 style="color: #0e5551;">Dossier Médical n°${record.idMedicalRecord}</h2>
        <hr />
        <p><strong>Créé le :</strong> ${record.createdAt}</p>
        <p><strong>Diagnostic :</strong> ${record.diagnosis}</p>
        <p><strong>Notes :</strong> ${record.notes}</p>
        <p><strong>Allergies :</strong> ${record.allergies}</p>
      </div>
    `;
  
    const printWindow = window.open('', '', 'height=900,width=1200');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Impression du Dossier Médical</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              button, .no-print { display: none !important; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

  // Filtering and sorting
  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.medicalRecords];
    
    // Apply search term filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        (record.diagnosis && record.diagnosis.toLowerCase().includes(term)) ||
        (record.notes && record.notes.toLowerCase().includes(term)) ||
        (record.allergies && record.allergies.toLowerCase().includes(term))
      );
    }
    
    // Apply date filter
    if (this.dateFilter) {
      const now = new Date();
      filtered = filtered.filter(record => {
        const recordDate = new Date((record.createdAt || '').toString());
        
        switch (this.dateFilter) {
          case 'today':
            return recordDate.toDateString() === now.toDateString();
          case 'week':
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return recordDate >= oneWeekAgo;
          case 'month':
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);
            return recordDate >= oneMonthAgo;
          default:
            return true;
        }
      });
    }
    
    this.filteredRecords = filtered;
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.dateFilter = '';
    this.filteredRecords = [...this.medicalRecords];
    this.currentPage = 1;
  }

  sort(property: string): void {
    this.filteredRecords.sort((a, b) => {
      // @ts-ignore
      if (a[property] < b[property]) return -1;
      // @ts-ignore
      if (a[property] > b[property]) return 1;
      return 0;
    });
  }

  // Pagination functions
  get totalPages(): number {
    return Math.ceil(this.filteredRecords.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  firstPage(): void {
    this.currentPage = 1;
  }

  lastPage(): void {
    this.currentPage = this.totalPages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }


  //stats

  getDiagnosisDistribution(): any {
    // Group records by diagnosis category
    const categories = {
      'Respiratory': 0,
      'Cardiovascular': 0,
      'Neurological': 0,
      'Digestive': 0,
      'Other': 0
    };
  
    this.medicalRecords.forEach(record => {
      if (record.diagnosis) {
        const lowerDiagnosis = record.diagnosis.toLowerCase();
        if (lowerDiagnosis.includes('asthma') || lowerDiagnosis.includes('copd') || lowerDiagnosis.includes('respiratory')) {
          categories['Respiratory']++;
        } else if (lowerDiagnosis.includes('cardiac') || lowerDiagnosis.includes('heart') || lowerDiagnosis.includes('hypertension')) {
          categories['Cardiovascular']++;
        } else if (lowerDiagnosis.includes('neuro') || lowerDiagnosis.includes('brain') || lowerDiagnosis.includes('migraine')) {
          categories['Neurological']++;
        } else if (lowerDiagnosis.includes('digestive') || lowerDiagnosis.includes('stomach') || lowerDiagnosis.includes('ibs')) {
          categories['Digestive']++;
        } else {
          categories['Other']++;
        }
      } else {
        categories['Other']++;
      }
    });
  
    return {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: [
          '#3498db',
          '#2ecc71',
          '#9b59b6',
          '#f1c40f',
          '#e74c3c'
        ]
      }]
    };
  }
  
  getTimelineData(): any {
    // Group records by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const monthCounts = new Array(6).fill(0); // Last 6 months
  
    this.medicalRecords.forEach(record => {
      if (record.createdAt) {
        const recordDate = new Date(record.createdAt);
        const recordMonth = recordDate.getMonth();
        const monthDiff = currentMonth - recordMonth;
        
        if (monthDiff >= 0 && monthDiff < 6) {
          monthCounts[5 - monthDiff]++;
        }
      }
    });
  
    const monthLabels = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      monthLabels.push(months[monthIndex]);
    }
  
    return {
      labels: monthLabels,
      datasets: [{
        label: 'Records Created',
        data: monthCounts,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };
  }
  
  getAllergiesData(): any {
    // Group records by allergy type
    const allergyTypes = {
      'None': 0,
      'Food': 0,
      'Drug': 0,
      'Environmental': 0,
      'Insect': 0
    };
  
    this.medicalRecords.forEach(record => {
      if (!record.allergies || record.allergies.trim() === '') {
        allergyTypes['None']++;
      } else {
        const lowerAllergies = record.allergies.toLowerCase();
        if (lowerAllergies.includes('peanut') || lowerAllergies.includes('dairy') || lowerAllergies.includes('gluten')) {
          allergyTypes['Food']++;
        } else if (lowerAllergies.includes('penicillin') || lowerAllergies.includes('antibiotic') || lowerAllergies.includes('aspirin')) {
          allergyTypes['Drug']++;
        } else if (lowerAllergies.includes('pollen') || lowerAllergies.includes('dust') || lowerAllergies.includes('mold')) {
          allergyTypes['Environmental']++;
        } else if (lowerAllergies.includes('bee') || lowerAllergies.includes('wasp') || lowerAllergies.includes('insect')) {
          allergyTypes['Insect']++;
        } else {
          allergyTypes['None']++;
        }
      }
    });
  
    return {
      labels: Object.keys(allergyTypes),
      datasets: [{
        label: 'Patients',
        data: Object.values(allergyTypes),
        backgroundColor: '#0e5551'
      }]
    };
  }
  

  //stats 
  calculateChartData(): void {
    // 1. Calculate basic statistics
    this.medicalRecordStats = {
      withDiagnosis: this.getRecordsWithDiagnosis(),
      withAllergies: this.getRecordsWithAllergies(),
      recentRecords: this.getRecentRecords()
    };
  
    // 2. Calculate monthly records trend
    const monthlyRecords = new Map<string, number>();
    this.medicalRecords.forEach(record => {
      const date = new Date(record.createdAt || '');
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      const current = monthlyRecords.get(monthYear) || 0;
      monthlyRecords.set(monthYear, current + 1);
    });
    
    this.monthlyRecordData = Array.from(monthlyRecords.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  
    // 3. Calculate top diagnoses
    const diagnosisCounts = new Map<string, number>();
    this.medicalRecords.forEach(record => {
      if (record.diagnosis) {
        const current = diagnosisCounts.get(record.diagnosis) || 0;
        diagnosisCounts.set(record.diagnosis, current + 1);
      }
    });
  
    this.topDiagnosesData = Array.from(diagnosisCounts.entries())
      .map(([diagnosis, count]) => ({ diagnosis, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 diagnoses
  }
  
  // Add these chart initialization methods
  private initCharts(): void {
    this.createMedicalRecordStatsChart();
    this.createRecordsTrendChart();
    this.createDiagnosesChart();
  }
  
  private createMedicalRecordStatsChart(): void {
    const ctx = document.getElementById('medicalRecordStatsChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['With Diagnosis', 'With Allergies', 'Recent (7 days)'],
        datasets: [{
          data: [
            this.medicalRecordStats.withDiagnosis,
            this.medicalRecordStats.withAllergies,
            this.medicalRecordStats.recentRecords
          ],
          backgroundColor: [
            'rgba(52, 152, 219, 0.8)',
            'rgba(155, 89, 182, 0.8)',
            'rgba(39, 174, 96, 0.8)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = this.medicalRecords.length;
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }
  
  private createRecordsTrendChart(): void {
    const ctx = document.getElementById('recordsTrendChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.monthlyRecordData.map(d => d.month),
        datasets: [{
          label: 'Records per Month',
          data: this.monthlyRecordData.map(d => d.count),
          backgroundColor: 'rgba(46, 134, 222, 0.1)',
          borderColor: 'rgba(46, 134, 222, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgba(46, 134, 222, 1)',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true
            },
            ticks: {
              precision: 0
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
  
  private createDiagnosesChart(): void {
    const ctx = document.getElementById('diagnosesChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.topDiagnosesData.map(d => d.diagnosis),
        datasets: [{
          label: 'Records',
          data: this.topDiagnosesData.map(d => d.count),
          backgroundColor: 'rgba(231, 76, 60, 0.7)',
          borderColor: 'rgba(231, 76, 60, 1)',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true
            },
            ticks: {
              precision: 0
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  //enhaced add 


  // Add these properties to your component class
isDragOver = false;
importProgress = 0;
importStatus = '';

// Add these methods
onDragOver(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  this.isDragOver = true;
}

onDragLeave(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  this.isDragOver = false;
}

onDrop(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  this.isDragOver = false;
  
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    this.processFile(event.dataTransfer.files[0]);
  }
}

processFile(file: File): void {
  this.importProgress = 0;
  this.importStatus = 'Processing file...';
  
  // Simulate progress (replace with actual upload progress)
  const progressInterval = setInterval(() => {
    this.importProgress += 10;
    if (this.importProgress >= 100) {
      clearInterval(progressInterval);
      this.onFileSelected({ target: { files: [file] } } as any);
      this.importStatus = 'File processed successfully!';
      setTimeout(() => this.importStatus = '', 3000);
    }
  }, 200);
}

formatText(format: string): void {
  const textarea = document.querySelector('.rich-text-container textarea') as HTMLTextAreaElement;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  let formattedText = '';

  switch(format) {
    case 'bold':
      formattedText = `**${selectedText}**`;
      break;
    case 'italic':
      formattedText = `_${selectedText}_`;
      break;
    case 'underline':
      formattedText = `<u>${selectedText}</u>`;
      break;
  }

  this.newRecord.notes = 
    textarea.value.substring(0, start) + 
    formattedText + 
    textarea.value.substring(end);
}

removeAllergy(allergy: string): void {
  if (!this.newRecord?.allergies) return;

  const allergyList = this.newRecord.allergies
    .split(',')
    .map((a: string) => a.trim())
    .filter((a: string) => a && a !== allergy.trim()); // Also filters out empty strings

  this.newRecord.allergies = allergyList.length > 0 
    ? allergyList.join(', ') 
    : ''; // Handle case when all allergies are removed
}


}