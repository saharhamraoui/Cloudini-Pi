import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { jsPDF } from 'jspdf';
import { Prescription } from 'src/app/model/Prescription';
import { PrescriptionStatus } from 'src/app/model/PrescriptionStatus';
import { PrescriptionService } from 'src/app/services/Prescription/prescription.service';
import { SmsService } from 'src/app/services/Sms/sms.service';
Chart.register(...registerables);

@Component({
  selector: 'app-list-prescription',
  templateUrl: './list-prescription.component.html',
  styleUrls: ['./list-prescription.component.css']
})
export class ListPrescriptionComponent {
  prescriptions: Prescription[] = [];
  filteredPrescriptions: Prescription[] = [];
  newPrescription: Prescription = { 
    medication: '', 
    dosage: '', 
    instructions: '', 
    issueDate: '',
    status: PrescriptionStatus.ACTIVE 
  };
  selectedPrescription: Prescription | null = null;
  viewedPrescription: Prescription | null = null;
  isAddFormVisible = false;
  searchTerm: string = '';
  statusFilter: string = '';
  dateFilter: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  currentPage = 1;
  itemsPerPage = 5;
  
  // Chat bot
  chatbotOpen = false;
  chatHistory: {sender: string, message: string}[] = [];
  userMessage = '';

  //stats
  prescriptionStatusData = {
    active: 0,
    pending: 0,
    completed: 0,
    expired: 0
  };
  
  monthlyPrescriptionData: { month: string, count: number }[] = [];
  topMedicationsData: { medication: string, count: number }[] = [];
  

  constructor(
    private prescriptionService: PrescriptionService,
    private _router: Router,
    private smsService: SmsService
  ) {}

  ngOnInit(): void {
    this.loadPrescriptions();
    // Add welcome message from bot
    this.chatHistory.push({
      sender: 'bot',
      message: 'Hello! I can help you with prescription management. Ask me anything!'
    });
  }

  loadPrescriptions() {
    this.prescriptionService.getPrescriptions().subscribe((data) => {
      this.prescriptions = data;
      this.filteredPrescriptions = [...data];
      this.calculateChartData(); // Add this line
      this.applyFilters();
      this.initCharts(); // Initialize charts after data is ready
    });
  }

  onSearch() {
    const searchTerm = this.searchTerm.toLowerCase();
    this.filteredPrescriptions = this.prescriptions.filter(prescription => 
      prescription.medication.toLowerCase().includes(searchTerm) ||
      prescription.instructions.toLowerCase().includes(searchTerm)
    );
    this.currentPage = 1;
  }

  applyFilters() {
    let result = [...this.prescriptions];
    
    // Apply status filter
    if (this.statusFilter) {
      result = result.filter(p => p.status === this.statusFilter);
    }
    
    // Apply date filter
    if (this.dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      result = result.filter(p => {
        const issueDate = new Date(p.issueDate);
        
        switch(this.dateFilter) {
          case 'today':
            return issueDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            return issueDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            return issueDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    this.filteredPrescriptions = result;
    this.currentPage = 1;
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.dateFilter = '';
    this.filteredPrescriptions = [...this.prescriptions];
    this.currentPage = 1;
  }

  sort(field: keyof Prescription) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.filteredPrescriptions.sort((a, b) => {
      // Get values safely with fallbacks
      const valueA = a[field] ?? '';
      const valueB = b[field] ?? '';
      
      // Handle different types appropriately
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' 
          ? valueA - valueB 
          : valueB - valueA;
      }
      
      // Fallback for dates or other types
      const strA = String(valueA);
      const strB = String(valueB);
      return this.sortDirection === 'asc' 
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
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

  firstPage(): void {
    this.currentPage = 1;
  }

  lastPage(): void {
    this.currentPage = this.totalPages;
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

  // Status counts
  getActiveCount(): number {
    return this.prescriptions.filter(p => p.status === 'ACTIVE').length;
  }

  getPendingCount(): number {
    return this.prescriptions.filter(p => p.status === 'PENDING').length;
  }

  getExpiredCount(): number {
    return this.prescriptions.filter(p => p.status === 'EXPIRED').length;
  }

  getStatusClass(status: string): string {
    return status;
  }

  // Prescription CRUD operations
  onShowAddForm(): void {
    this.isAddFormVisible = true;
    this.newPrescription = { 
      medication: '', 
      dosage: '', 
      instructions: '', 
      issueDate: new Date().toISOString().split('T')[0],
      status: PrescriptionStatus.ACTIVE 
    };
  }

  closeAddForm(): void {
    this.isAddFormVisible = false;
  }

  addPrescription(): void {
    this.prescriptionService.addPrescriptions(this.newPrescription).subscribe(() => {
      this.loadPrescriptions();
      this.isAddFormVisible = false;
    });
  }

  viewDetails(prescription: Prescription): void {
    this.viewedPrescription = {...prescription};
  }

  onEditPrescription(prescription: Prescription): void {
    this.selectedPrescription = { ...prescription };
  }

  cancelPrescription(): void {
    this.selectedPrescription = null;
  }
  submitPrescription(): void {
    if (!this.selectedPrescription) return;
  
    this.prescriptionService.updatePrescription(this.selectedPrescription).subscribe({
      next: (updatedPrescription) => {
        const index = this.prescriptions.findIndex(p => p.idPrescription === updatedPrescription.idPrescription);
        if (index !== -1) {
          this.prescriptions[index] = updatedPrescription;
          this.filteredPrescriptions[index] = updatedPrescription;
        }
        this.selectedPrescription = null;
      },
      error: (err) => console.error('Erreur lors de la mise à jour de l’ordonnance', err)
    });
  }
  

  onDeletePrescription(id: number): void {
    if (confirm('Are you sure you want to delete this prescription?')) {
      this.prescriptionService.deletePrescription(id).subscribe(() => {
        this.loadPrescriptions();
      });
    }
  }

  // PDF Generation
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
    doc.text(`Doctor: Dr. Smith`, 20, 40);
    doc.text(`Date: ${new Date(prescription.issueDate).toLocaleDateString()}`, 150, 40);
    
    // Patient info
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information:', 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: [Patient Name]`, 20, 70);
    doc.text(`Age: [Patient Age]`, 20, 80);
    
    // Prescription details
    doc.setFont('helvetica', 'bold');
    doc.text('Prescription Details:', 20, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Medication: ${prescription.medication}`, 20, 110);
    doc.text(`Dosage: ${prescription.dosage}`, 20, 120);
    
    // Instructions with wrapping
    const instructions = doc.splitTextToSize(`Instructions: ${prescription.instructions}`, 170);
    doc.text(instructions, 20, 130);
    
    // Footer
    doc.setTextColor(100);
    doc.setFont('helvetica', 'italic');
    doc.text('This prescription is valid for 30 days from issue date.', 105, 280, { align: 'center' });
    
    // Save the PDF
    doc.save(`prescription-${prescription.idPrescription}.pdf`);
  }

  // SMS Notification
  sendSmsNotification(prescription: Prescription): void {
    const message = `Reminder: Take ${prescription.medication}, ${prescription.dosage}. ${prescription.instructions}`;
    this.smsService.sendSms('+1234567890', message).subscribe({
      next: () => alert('SMS reminder sent successfully!'),
      error: () => alert('Failed to send SMS reminder')
    });
  }

  // Chat Bot
  toggleChatBot(): void {
    this.chatbotOpen = !this.chatbotOpen;
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;
    
    // Add user message
    this.chatHistory.push({
      sender: 'user',
      message: this.userMessage
    });
    
    // Simple bot responses
    let botResponse = '';
    const lowerMessage = this.userMessage.toLowerCase();
    
    if (lowerMessage.includes('add') || lowerMessage.includes('create')) {
      botResponse = 'To add a new prescription, click the "New Prescription" button at the top of the page.';
    } 
    else if (lowerMessage.includes('edit') || lowerMessage.includes('update')) {
      botResponse = 'To edit a prescription, click the edit icon (pencil) in the actions column.';
    }
    else if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
      botResponse = 'To delete a prescription, click the delete icon (trash can) in the actions column.';
    }
    else if (lowerMessage.includes('print') || lowerMessage.includes('pdf')) {
      botResponse = 'You can generate a PDF of any prescription by clicking the PDF icon in the actions column.';
    }
    else if (lowerMessage.includes('status') || lowerMessage.includes('filter')) {
      botResponse = 'You can filter prescriptions by status using the status dropdown in the toolbar.';
    }
    else {
      botResponse = 'I can help you with adding, editing, or managing prescriptions. Could you be more specific about what you need?';
    }
    
    // Add bot response
    this.chatHistory.push({
      sender: 'bot',
      message: botResponse
    });
    
    // Clear input
    this.userMessage = '';
  }

  navigateHome() {
    this._router.navigate(['/home']);
  }


  //stats 

  calculateChartData(): void {
    // 1. Calculate prescription status distribution
    this.prescriptionStatusData = {
      active: this.prescriptions.filter(p => p.status === 'ACTIVE').length,
      pending: this.prescriptions.filter(p => p.status === 'PENDING').length,
      completed: this.prescriptions.filter(p => p.status === 'COMPLETED').length,
      expired: this.prescriptions.filter(p => p.status === 'EXPIRED').length
    };
  
    // 2. Calculate monthly prescription trends
    const monthlyPrescriptions = new Map<string, number>();
    this.prescriptions.forEach(prescription => {
      const date = new Date(prescription.issueDate);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      const current = monthlyPrescriptions.get(monthYear) || 0;
      monthlyPrescriptions.set(monthYear, current + 1);
    });
    
    this.monthlyPrescriptionData = Array.from(monthlyPrescriptions.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  
    // 3. Calculate top medications
    const medicationCounts = new Map<string, number>();
    this.prescriptions.forEach(prescription => {
      const current = medicationCounts.get(prescription.medication) || 0;
      medicationCounts.set(prescription.medication, current + 1);
    });
  
    this.topMedicationsData = Array.from(medicationCounts.entries())
      .map(([medication, count]) => ({ medication, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 medications
  }
  
  // Add these chart initialization methods
  private initCharts(): void {
    this.createPrescriptionStatusChart();
    this.createPrescriptionTrendChart();
    this.createMedicationChart();
  }
  
  private createPrescriptionStatusChart(): void {
    const ctx = document.getElementById('prescriptionStatusChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Pending', 'Completed', 'Expired'],
        datasets: [{
          data: [
            this.prescriptionStatusData.active,
            this.prescriptionStatusData.pending,
            this.prescriptionStatusData.completed,
            this.prescriptionStatusData.expired
          ],
          backgroundColor: [
            'rgba(39, 174, 96, 0.8)',
            'rgba(241, 196, 15, 0.8)',
            'rgba(52, 152, 219, 0.8)',
            'rgba(231, 76, 60, 0.8)'
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
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
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
  
  private createPrescriptionTrendChart(): void {
    const ctx = document.getElementById('prescriptionTrendChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.monthlyPrescriptionData.map(d => d.month),
        datasets: [{
          label: 'Prescriptions per Month',
          data: this.monthlyPrescriptionData.map(d => d.count),
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          borderColor: 'rgba(155, 89, 182, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgba(155, 89, 182, 1)',
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
  
  private createMedicationChart(): void {
    const ctx = document.getElementById('medicationChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.topMedicationsData.map(d => d.medication),
        datasets: [{
          label: 'Prescriptions',
          data: this.topMedicationsData.map(d => d.count),
          backgroundColor: 'rgba(52, 152, 219, 0.7)',
          borderColor: 'rgba(52, 152, 219, 1)',
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
}



