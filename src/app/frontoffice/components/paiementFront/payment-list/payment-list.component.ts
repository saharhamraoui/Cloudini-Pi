import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { Paiement } from 'src/app/model/Paiement';
import { PaymentStatus } from 'src/app/model/PaymentStatus';
import { KonnectPaymentService } from 'src/app/services/Konnect/konnect-payment.service';
import { PaiementService } from 'src/app/services/Paiement/paiement.service';
import { UserServiceService } from 'src/app/services/UserTest/user-service.service';

interface PaymentNavigationState {
  refreshPayments?: boolean;
}

interface PaymentDisplay extends Paiement {
  medecinNom: string;
  medecinSpecialite: string;
}

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PaymentListComponent implements OnInit {
  payments: PaymentDisplay[] = [];
  filteredPayments: PaymentDisplay[] = [];
  selectedPayment: PaymentDisplay | null = null;
  statusFilter: PaymentStatus | 'all' = 'all';
  dateFilter = 'all';
  searchQuery = '';
  Math=Math;
  totalPaid = 0;
  totalPending = 0;
  totalPartial = 0;

  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;

  PaymentStatus = PaymentStatus;

  doctors = [
    { id: 1, name: 'Smith', specialty: 'Cardiology', avatarColor: '#4CAF50' },
    { id: 2, name: 'Johnson', specialty: 'Dermatology', avatarColor: '#2196F3' },
    { id: 3, name: 'Williams', specialty: 'Pediatrics', avatarColor: '#FF9800' },
    { id: 4, name: 'Brown', specialty: 'Neurology', avatarColor: '#9C27B0' },
    { id: 5, name: 'Jones', specialty: 'Orthopedics', avatarColor: '#F44336' }
  ];

  patients = [
    { id: 1, name: 'Smith', specialty: 'Cardiology', avatarColor: '#4CAF50' },
    { id: 2, name: 'Johnson', specialty: 'Dermatology', avatarColor: '#2196F3' },
    { id: 3, name: 'Williams', specialty: 'Pediatrics', avatarColor: '#FF9800' },
    { id: 4, name: 'Brown', specialty: 'Neurology', avatarColor: '#9C27B0' },
    { id: 5, name: 'Jones', specialty: 'Orthopedics', avatarColor: '#F44336' }
  ];



  

  constructor(private paymentService: PaiementService, private router: Router,private konnectPaymentService:KonnectPaymentService,userService:UserServiceService) {}

  ngOnInit(): void {
    this.checkForRefresh();
    this.loadPayments();
  }


  speechSynthesis: SpeechSynthesis = window.speechSynthesis;
  currentUtterance: SpeechSynthesisUtterance | null = null;
  
  readPayment(payment: PaymentDisplay, language: 'en' | 'fr'): void {
  const amountText = payment.montant.toFixed(2);
  const status = this.getStatusDisplay(payment.statut);
  const date = new Date(payment.datePaiement).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US');

  const text = language === 'fr'
    ? `Paiement numéro ${payment.id}. Patient: ${payment.nomPatient}. Montant: ${amountText} dollars. Statut: ${status}. Date: ${date}.`
    : `Payment number ${payment.id}. Patient: ${payment.nomPatient}. Amount: ${amountText} dollars. Status: ${status}. Date: ${date}.`;

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


  downloadReceipt(payment: PaymentDisplay): void {
    const doc = new jsPDF();
    
    doc.text(`Receipt - Payment #${payment.id}`, 10, 10);
    doc.text(`Date: ${new Date(payment.datePaiement).toLocaleDateString()}`, 10, 20);
    doc.text(`Amount: ${payment.montant.toFixed(2)} USD`, 10, 30);
    // Add more content as needed
    
    doc.save(`Receipt_${payment.id}.pdf`);
  }
  private checkForRefresh() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as PaymentNavigationState | undefined;

    if (state?.refreshPayments) {
      this.loadPayments();
    }
  }

  private cardIcons = new Map<string, string>([
    ['visa', 'assets/images/visa.svg'],
    ['mastercard', 'assets/images/mastercard.svg'],
    ['master card', 'assets/images/mastercard.svg'],
    ['amex', 'assets/images/amex.svg'],
    ['american express', 'assets/images/amex.svg'],
    ['paypal', 'assets/images/paypal.svg']
  ]);

  getCardTypeIcon(cardType: string | undefined): string {
    if (!cardType) {
      return 'assets/images/credit-card.svg';
    }
    return this.cardIcons.get(cardType.toLowerCase()) ?? 'assets/images/credit-card.svg';
  }

  getDoctorAvatar(doctorName: string): string {
    const doctor = this.doctors.find(d => d.name === doctorName.split(' ')[0]);
    if (doctor) {
      return `https://ui-avatars.com/api/?name=${doctor.name}&background=${doctor.avatarColor.replace('#', '')}&color=fff&size=128`;
    }
    return `https://ui-avatars.com/api/?name=${doctorName}&background=1e81b0&color=fff&size=128`;
  }

  loadPayments(): void {
    this.paymentService.getPaiements().subscribe({
      next: (data: Paiement[]) => {
        this.processPayments(data);
      },
      error: err => this.handleLoadError(err)
    });
  }

  private processPayments(data: Paiement[]) {
    this.payments = data.map(payment => ({
      ...payment,
      medecinNom: this.getRandomDoctor().name,
      medecinSpecialite: this.getRandomDoctor().specialty
    }));
    this.calculateSummary();
    this.filterPayments();
  }

  private handleLoadError(error: any) {
    console.error('Error loading payments:', error);
    // Show error notification
  }

  getRandomDoctor() {
    return this.doctors[Math.floor(Math.random() * this.doctors.length)];
  }

  calculateSummary(): void {
    this.totalPaid = this.payments.filter(p => p.statut === PaymentStatus.Paid)
      .reduce((sum, p) => sum + p.montant, 0);

    this.totalPending = this.payments.filter(p => p.statut === PaymentStatus.Unpaid)
      .reduce((sum, p) => sum + p.montant, 0);

    this.totalPartial = this.payments.filter(p => p.statut === PaymentStatus.Partial)
      .reduce((sum, p) => sum + (p.montant - (p.montantPaye || 0)), 0);
  }

  filterPayments(): void {
    let filtered = [...this.payments];

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(p => p.statut === this.statusFilter);
    }

    const now = new Date();
    if (this.dateFilter !== 'all') {
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.datePaiement);

        switch (this.dateFilter) {
          case 'today':
            return paymentDate.toDateString() === now.toDateString();
          case 'week':
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            return paymentDate >= startOfWeek;
          case 'month':
            return paymentDate.getMonth() === now.getMonth() && 
                   paymentDate.getFullYear() === now.getFullYear();
          case 'year':
            return paymentDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.nomPatient.toLowerCase().includes(query) ||
        p.medecinNom.toLowerCase().includes(query) ||
        p.modeDePaiement.toLowerCase().includes(query) ||
        this.getStatusDisplay(p.statut).toLowerCase().includes(query)
      );
    }

    this.filteredPayments = filtered;
    this.totalPages = Math.ceil(this.filteredPayments.length / this.itemsPerPage);
    this.currentPage = this.totalPages > 0 ? Math.min(this.currentPage, this.totalPages) : 1;
  }

  clearFilters(): void {
    this.statusFilter = 'all';
    this.dateFilter = 'all';
    this.searchQuery = '';
    this.filterPayments();
  }

  getStatusDisplay(status: PaymentStatus): string {
    switch(status) {
      case PaymentStatus.Paid: return 'Paid';
      case PaymentStatus.Unpaid: return 'Unpaid';
      case PaymentStatus.Partial: return 'Partial';
      default: return status;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToTop();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTop();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToTop();
    }
  }

  itemsPerPageChanged(): void {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredPayments.length / this.itemsPerPage);
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

 

  initiatePayment(payment: Paiement): void {
    const paymentData = {
      ...payment,
      montant: payment.statut === PaymentStatus.Partial 
        ? payment.montant - (payment.montantPaye || 0)
        : payment.montant
    };

    this.router.navigate(['/front/PaiementClient'], {
      state: {
        paymentData,
        returnUrl: this.router.url
      }
    });
  }

  goToPaiement(id: number) {
    this.router.navigate(['/front/PaiementClient', id]);
  }
  
  viewDetails(payment: PaymentDisplay): void {
    this.selectedPayment = payment;
  }

  closeModal(event?: MouseEvent): void {
    if (!event || (event.target as HTMLElement).classList.contains('payment-modal-overlay')) {
      this.selectedPayment = null;
    }
  }

  exportPayments(): void {
    // Implement export functionality
    console.log('Exporting payments...');
  }

  refreshPayments(): void {
    this.loadPayments();
  }

  payTND(payment:Paiement) {
    this.router.navigate(['/front/paiementTn',payment.id]);
  }


  requestDiscount(id: number) {
    // Optionally, pass payment details in navigation
    this.router.navigate(['/front/request-discount',id]);
  }
  

  //add payment 
  // Add these properties to your component class
showAddPaymentModal: boolean = false;
//patients: any[] = [];
// doctors: any[] = [];

newPayment: Paiement = {
  nomPatient: '',
  montant: 0,
  modeDePaiement: 'Carte Bancaire',
  datePaiement: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
  statut: PaymentStatus.Unpaid,
  emailMedecin: '',
  emailPatient: ''
};

// Add these methods to your component class
initiateNewPayment(): void {
  this.loadPatientsAndDoctors();
  this.showAddPaymentModal = true;
}

loadPatientsAndDoctors(): void {
  /* this.userService.getPatients().subscribe(patients => {
    this.patients = patients;
  });
  
 this.userService.getMedecin().subscribe(doctors => {
    this.doctors = doctors;
  });*/
}

closeAddPaymentModal(event?: Event): void {
  if (event) {
    event.stopPropagation();
  }
  this.showAddPaymentModal = false;
  this.resetNewPayment();
}

resetNewPayment(): void {
  this.newPayment = {
    nomPatient: '',
    montant: 0,
    modeDePaiement: 'Carte Bancaire',
    datePaiement: new Date().toISOString().split('T')[0],
    statut: PaymentStatus.Unpaid,
    emailMedecin: '',
    emailPatient: ''
  };
}

submitPayment(): void {
  // Set patient email if needed (you might need to modify this based on your data structure)
  const selectedPatient = this.patients.find(p => p.name === this.newPayment.nomPatient);
  if (selectedPatient) {
    this.newPayment.emailPatient = selectedPatient.name;
  }
  
  this.paymentService.addPaiement(this.newPayment).subscribe({
    next: (response) => {
      // Handle success
      this.closeAddPaymentModal();
      this.refreshPayments();
      // Show success message
    },
    error: (error) => {
      // Handle error
      console.error('Error adding payment:', error);
    }
  });
}
}