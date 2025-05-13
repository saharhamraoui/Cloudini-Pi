import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { jsPDF } from 'jspdf';
import { DiscountStatus } from 'src/app/model/DiscountStatus';
import { Paiement } from 'src/app/model/Paiement';
import { PaymentStatus } from 'src/app/model/PaymentStatus';
import { DiscountPaymentService } from 'src/app/services/Discount/discount-payment.service';
import { EmailSenderService } from 'src/app/services/EmailSender/email-sender.service';
import { PaiementService } from 'src/app/services/Paiement/paiement.service';
Chart.register(...registerables);


@Component({
  selector: 'app-list-paiement',
  templateUrl: './list-paiement.component.html',
  styleUrls: ['./list-paiement.component.css']
})
export class ListPaiementComponent {
  searchTerm: string = '';
  statusFilter: string = '';
  dateFilter: string = '';
  filteredPaiements: Paiement[] = [];
  paginatedPaiements: Paiement[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  
  openCard:boolean = false ;
  isAddFormVisible: boolean = false;
  isEditFormVisible: boolean = false;
  viewedPayment: Paiement | null = null;
  
  paiements: Paiement[] = [];
  newPaiement: Paiement = {
    nomPatient: '',
    montant: 0,
    modeDePaiement: '',
    datePaiement: new Date().toISOString().split('T')[0],
    statut: PaymentStatus.Paid
  };
  
  statusOfDiscount:DiscountStatus =DiscountStatus.REJECTED;
  PaymentStatus = PaymentStatus;
  sortField: string = 'datePaiement';
  sortDirection: 'asc' | 'desc' = 'desc';

  totalAmount: number = 0;
paidPayments: number = 0;
partiallyPaidPayments: number = 0;
notPaidPayments: number = 0;

//statistic 
// Add these properties to your component
paymentStatusData = {
  paid: 0,
  partial: 0,
  unpaid: 0
};

monthlyRevenueData: { month: string, amount: number }[] = [];
paymentMethodData: { method: string, count: number }[] = [];


// Add this new method to calculate the statistics
calculatePaymentStats(): void {
  this.totalAmount = this.paiements.reduce((sum, p) => sum + p.montant, 0);
  this.paidPayments = this.paiements.filter(p => p.statut === 'PAID').length;
  this.partiallyPaidPayments = this.paiements.filter(p => p.statut === 'PARTIAL').length;
  this.notPaidPayments = this.paiements.filter(p => p.statut === 'NOT PAID').length;
}

// Also call calculatePaymentStats when filtering payments


  constructor(
    private paiementService: PaiementService,
    private router: Router,
    private emailService: EmailSenderService,
    private discountService:DiscountPaymentService
  ) {}

  ngOnInit(): void {
    this.loadPaiements();
  }


  applyFilters(): void {
    let result = [...this.paiements];
    
    if (this.statusFilter) {
      result = result.filter(p => p.statut === this.statusFilter);
    }
    
    if (this.dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      result = result.filter(p => {
        const paymentDate = new Date(p.datePaiement);
        
        switch(this.dateFilter) {
          case 'today':
            return paymentDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            return paymentDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            return paymentDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    this.filteredPaiements = result;
    this.currentPage = 1;
    this.updatePage();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.dateFilter = '';
    this.filterPaiements();
  }

  // Pagination
  updatePage(): void {
    this.totalPages = Math.ceil(this.filteredPaiements.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedPaiements = this.filteredPaiements.slice(start, end);
  }

  firstPage(): void { this.changePage(1); }
  lastPage(): void { this.changePage(this.totalPages); }
  nextPage(): void { this.changePage(this.currentPage + 1); }
  previousPage(): void { this.changePage(this.currentPage - 1); }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePage();
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

  // Sorting
  sort(field: keyof Paiement): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredPaiements.sort((a, b) => {
      const valueA = a[field] ?? '';
      const valueB = b[field] ?? '';

      if (field === 'statut') {
        const statusOrder = { 'PAID': 3, 'PARTIALLY_PAID': 2, 'NOT_PAID': 1 };
        const orderA = statusOrder[a.statut as keyof typeof statusOrder] || 0;
        const orderB = statusOrder[b.statut as keyof typeof statusOrder] || 0;
        return this.sortDirection === 'asc' ? orderA - orderB : orderB - orderA;
      }
      else if (field === 'montant') {
        return this.sortDirection === 'asc' 
          ? (a.montant - b.montant) 
          : (b.montant - a.montant);
      }
      else if (field === 'datePaiement') {
        const dateA = new Date(a.datePaiement).getTime();
        const dateB = new Date(b.datePaiement).getTime();
        return this.sortDirection === 'asc' 
          ? (dateA - dateB) 
          : (dateB - dateA);
      }
      else {
        return this.sortDirection === 'asc'
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      }
    });

    this.currentPage = 1;
    this.updatePage();
  }

  // Form handling
  openAddForm(): void {
    this.newPaiement = {
      nomPatient: '',
      montant: 0,
      modeDePaiement: '',
      datePaiement: new Date().toISOString().split('T')[0],
      statut: PaymentStatus.Paid
    };
    this.isAddFormVisible = true;
  }

  closeAddForm(): void {
    this.isAddFormVisible = false;
  }

  addPaiement(): void {
    this.paiementService.addPaiement(this.newPaiement).subscribe({
      next: () => {
        this.loadPaiements();
        this.closeAddForm();
      },
      error: (err) => console.error('Error adding payment:', err)
    });
  }

  openEditForm(paiement: Paiement): void {
    this.newPaiement = { ...paiement };
    this.isEditFormVisible = true;
  }

  closeEditForm(): void {
    this.isEditFormVisible = false;
  }

  editPaiement(id:number): void {
    if (id) {
      this.paiementService.updatePaiement(id, this.newPaiement).subscribe({
        next: () => {
          this.loadPaiements();
          this.closeEditForm();
        },
        error: (err) => console.error('Error updating payment:', err)
      });
    }
  }

  // Payment actions
  deletePaiement(id: number): void {
    if (confirm('Are you sure you want to delete this payment?')) {
      this.paiementService.deletePaiement(id).subscribe({
        next: () => this.loadPaiements(),
        error: (err) => console.error('Error deleting payment:', err)
      });
    }
  }

  viewDetails(paiement: Paiement): void {
    this.viewedPayment = { ...paiement };
  }

  // Helpers
  getStatusDisplay(status: string): string {
    switch(status) {
      case 'PAID': return 'Paid';
      case 'PARTIALLY_PAID': return 'Partially Paid';
      case 'NOT_PAID': return 'Not Paid';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'PAID': return 'paid';
      case 'PARTIALLY_PAID': return 'partially-paid';
      case 'NOT_PAID': return 'not-paid';
      default: return '';
    }
  }

  getPaymentMethodIcon(method: string): string {
    switch(method) {
      case 'CREDIT_CARD': return '💳';
      case 'DEBIT_CARD': return '🏦';
      case 'BANK_TRANSFER': return '📊';
      case 'CASH': return '💵';
      case 'CHECK': return '📝';
      default: return '💰';
    }
  }

  // PDF Generation
  generateFacture(paiement: Paiement): void {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor('#0e5551');
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Medical Clinic Name', 20, 30);
    doc.text('123 Clinic Street', 20, 35);
    doc.text('Tunis, Tunisia', 20, 40);
    
    doc.text(`Invoice #: ${paiement.id}`, 150, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35);
    
    doc.setFontSize(14);
    doc.text('Bill To:', 20, 60);
    doc.setFontSize(12);
    doc.text(`Patient: ${paiement.nomPatient}`, 20, 70);
    
    doc.setFontSize(14);
    doc.text('Payment Details', 20, 90);
    
    doc.setFontSize(12);
    doc.text(`Amount: ${paiement.montant} TND`, 20, 100);
    doc.text(`Payment Method: ${paiement.modeDePaiement}`, 20, 110);
    doc.text(`Payment Date: ${paiement.datePaiement}`, 20, 120);
    doc.text(`Status: ${this.getStatusDisplay(paiement.statut)}`, 20, 130);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for your payment', 105, 280, { align: 'center' });
    
    doc.save(`invoice-${paiement.nomPatient}.pdf`);
  }

  // Email Receipt
  sendPaymentReceipt(paiement: Paiement): void {
    const subject = `Payment Receipt #${paiement.id}`;
    const body = `Dear ${paiement.nomPatient},\n\nThank you for your payment of ${paiement.montant} TND via ${paiement.modeDePaiement}.\n\nPayment Date: ${paiement.datePaiement}\nStatus: ${this.getStatusDisplay(paiement.statut)}\n\nBest regards,\nMedical Clinic`;
    
    this.emailService.sendEmail('saaharhamraoui@gmail.com', subject, body).subscribe(
      () => console.log('✅ Email envoyé'),
      error => console.error('❌ Erreur lors de l’envoi de l’email :', error)
    );
  }

  // Print Functionality
  onPrint(): void {
    const content = document.getElementById('paiements');
    const printWindow = window.open('', '', 'height=600,width=800');
    
    if (printWindow && content) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Records</title>
            <style>
              body { font-family: Arial; margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f2f2f2; }
              .no-print { display: none; }
            </style>
          </head>
          <body>
            <h2>Payment Records</h2>
            ${content.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  //discount 
  // Add these new properties to your component class
pendingDiscounts: number = 0;
isRejectDialogVisible: boolean = false;
paiementToReject: Paiement | null = null;
rejectionReason: string = '';
viewedDisabilityCard: string | null = null;
discountFilter: string = '';

// Add these methods to your component
getDiscountStatusDisplay(paiement: Paiement): string {
  if (!paiement.discountRequested) return 'None';
  switch(paiement.discountStatus) {
    case DiscountStatus.PENDING: return 'Pending';
    case DiscountStatus.APPROVED: return 'Approved';
    case DiscountStatus.REJECTED: return 'Rejected';
    default: return 'None';
  }
}

getDiscountStatusClass(paiement: Paiement): string {
  if (!paiement.discountRequested) return '';
  switch(paiement.discountStatus) {
    case DiscountStatus.PENDING: return 'pending';
    case DiscountStatus.APPROVED: return 'approved';
    case DiscountStatus.REJECTED: return 'rejected';
    default: return '';
  }
}

showDiscountActions(paiement: Paiement): boolean | undefined{
  return paiement.discountRequested && paiement.discountStatus === DiscountStatus.PENDING;
}


successMessage:any;
errorMessage: any;
private showSuccess(message: string): void {
  this.successMessage = message;
  setTimeout(() => this.successMessage = '', 5000);
}

private showError(message: string): void {
  this.errorMessage = message;
  setTimeout(() => this.errorMessage = '', 5000);
}




closeRejectDialog(): void {
  this.isRejectDialogVisible = false;
}



loadPaiements(): void {
  this.paiementService.getPaiements().subscribe({
    next: (data) => {
      this.paiements = data;
      this.calculatePaymentStats();
      this.calculateChartData(); // Add this line
      this.initCharts(); // Initialize charts after data is ready
    },
    error: (err) => console.error('Error loading payments:', err)
  });
}

calculateChartData(): void {
  // 1. Calculate payment status distribution
  this.paymentStatusData = {
    paid: this.paiements.filter(p => p.statut === 'PAID').length,
    partial: this.paiements.filter(p => p.statut === 'PARTIAL').length,
    unpaid: this.paiements.filter(p => p.statut === 'NOT PAID').length
  };

  // 2. Calculate monthly revenue (group by month)
  const monthlyRevenue = new Map<string, number>();
  this.paiements.forEach(payment => {
    const date = new Date(payment.datePaiement);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    const current = monthlyRevenue.get(monthYear) || 0;
    monthlyRevenue.set(monthYear, current + payment.montant);
  });
  
  this.monthlyRevenueData = Array.from(monthlyRevenue.entries())
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // 3. Calculate payment method distribution
  const methodCounts = new Map<string, number>();
  this.paiements.forEach(payment => {
    const current = methodCounts.get(payment.modeDePaiement) || 0;
    methodCounts.set(payment.modeDePaiement, current + 1);
  });

  this.paymentMethodData = Array.from(methodCounts.entries())
    .map(([method, count]) => ({ method, count }));
}
// Update your filterPaiements method
filterPaiements(): void {
  let result = [...this.paiements];
  
  // Existing filters
  if (this.searchTerm) {
    const term = this.searchTerm.toLowerCase();
    result = result.filter(p => 
      p.nomPatient.toLowerCase().includes(term)
    );
  }

  // Add discount filter
  if (this.discountFilter) {
    switch(this.discountFilter) {
      case 'PENDING':
        result = result.filter(p => 
          p.discountRequested && p.discountStatus === DiscountStatus.PENDING
        );
        break;
      case 'APPROVED':
        result = result.filter(p => 
          p.discountStatus === DiscountStatus.APPROVED
        );
        break;
      case 'REJECTED':
        result = result.filter(p => 
          p.discountStatus === DiscountStatus.REJECTED
        );
        break;
    }
  }

  this.filteredPaiements = result;
  this.updatePage();
}

  


//statistic 



// Add these methods to your component
private initCharts(): void {
  // Payment Status Chart (Doughnut)
  this.createPaymentStatusChart();
  
  // Revenue Trend Chart (Line)
  this.createRevenueTrendChart();
  
  // Payment Method Chart (Bar)
  this.createPaymentMethodChart();
}

private createPaymentStatusChart(): void {
  const ctx = document.getElementById('paymentStatusChart') as HTMLCanvasElement;
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Paid', 'Partially Paid', 'Not Paid'],
      datasets: [{
        data: [this.paymentStatusData.paid, this.paymentStatusData.partial, this.paymentStatusData.unpaid],
        backgroundColor: [
          'rgba(39, 174, 96, 0.8)',
          'rgba(241, 196, 15, 0.8)',
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

private createRevenueTrendChart(): void {
  const ctx = document.getElementById('revenueTrendChart') as HTMLCanvasElement;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.monthlyRevenueData.map(d => d.month),
      datasets: [{
        label: 'Monthly Revenue (TND)',
        data: this.monthlyRevenueData.map(d => d.amount),
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw as number; // Type assertion here
              return `Revenue: ${value} TND`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            display: true
          },
          ticks: {
            callback: (value) => {
              if (typeof value === 'number') { // Type guard
                return `${value}TND`;
              }
              return value;
            }
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

private createPaymentMethodChart(): void {
  const ctx = document.getElementById('paymentMethodChart') as HTMLCanvasElement;
  
  // Convert counts to percentages
  const totalMethods = this.paymentMethodData.reduce((sum, item) => sum + item.count, 0);
  const methodPercentages = this.paymentMethodData.map(item => 
    Math.round((item.count / totalMethods) * 100)
  );

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: this.paymentMethodData.map(d => d.method),
      datasets: [{
        label: 'Payment Method Usage (%)',
        data: methodPercentages,
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
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw as number;
              return `${value}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            display: true
          },
          ticks: {
            callback: (value) => {
              if (typeof value === 'number') {
                return `${value}%`;
              }
              return value;
            }
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


//discount modal 
// Component properties to add
selectedDiscountPayment: Paiement | null = null;
showRejectDialog = false;
isAdmin = true; // Set this based on your auth logic







// Get disability card image
getDisabilityCardImage(payment: Paiement): string {
  return 'data:image/jpeg;base64,' + this.arrayBufferToBase64(payment.disabilityCardImage);
}











// Helper method to convert ArrayBuffer to base64
private arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binary = new Uint8Array(buffer);
  let binaryString = '';
  binary.forEach(byte => {
    binaryString += String.fromCharCode(byte);
  });
  return window.btoa(binaryString);
}

// Reject dialog methods
openRejectDialog(payment: Paiement) {
  this.selectedDiscountPayment = payment;
  this.showRejectDialog = true;
  this.rejectionReason = '';
}

cancelReject() {
  this.showRejectDialog = false;
}

confirmReject() {
  if (this.rejectionReason && this.selectedDiscountPayment?.id) {
    this.discountService.rejectDiscount(
      this.selectedDiscountPayment.id, 
      this.rejectionReason
    ).subscribe({
      next: () => {
        this.showRejectDialog = false;
        this.loadPaiements(); // Refresh the list
        this.closeDiscountModal();
      },
      error: (err) => console.error('Error rejecting discount:', err)
    });
  }
}



// Method to open the discount modal
openDiscountModal(payment: Paiement) {
  this.selectedDiscountPayment = payment;
}

// Method to close the discount modal
closeDiscountModal() {
  this.selectedDiscountPayment = null;
  this.rejectionReason = '';
}

// Updated viewDisabilityCard function
viewDisabilityCard(payment: Paiement): void {
  if (!payment.id) return;
  
  this.discountService.getDisabilityCard(payment.id).subscribe({
    next: (imageData: ArrayBuffer) => {
      if (imageData) {
        // Convert ArrayBuffer to base64
        const binary = new Uint8Array(imageData);
        let binaryString = '';
        binary.forEach(byte => {
          binaryString += String.fromCharCode(byte);
        });
        this.viewedDisabilityCard = 'data:image/jpeg;base64,' + window.btoa(binaryString);
      } else {
        this.viewedDisabilityCard = null;
      }
    },
    error: (err) => {
      console.error('Error loading disability card:', err);
      this.viewedDisabilityCard = null;
    }
  });
}

closeCardModal(): void {
  this.viewedDisabilityCard = null;
}

// Approve discount
approveDiscount(payment: Paiement) {
  if (!payment.id) return;
  
  this.discountService.approveDiscount(payment.id).subscribe({
    next: (updatedPayment) => {
      this.selectedDiscountPayment = updatedPayment;
    },
    error: (err) => {
      console.error('Error approving discount:', err);
      // Show error message to user
    }
  });
}

// Reject discount
rejectDiscount() {
  if (!this.selectedDiscountPayment?.id || !this.rejectionReason) return;
  
  this.discountService.rejectDiscount(
    this.selectedDiscountPayment.id, 
    this.rejectionReason
  ).subscribe({
    next: (updatedPayment) => {
      this.selectedDiscountPayment = updatedPayment;
      this.loadPaiements(); // Refresh the list
      this.rejectionReason = '';
    },
    error: (err) => console.error('Error rejecting discount:', err)
  });
}
}