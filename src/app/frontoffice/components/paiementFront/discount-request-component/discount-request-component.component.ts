import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountStatus } from 'src/app/model/DiscountStatus';
import { Paiement } from 'src/app/model/Paiement';
import { DiscountPaymentService } from 'src/app/services/Discount/discount-payment.service';
import { PaiementService } from 'src/app/services/Paiement/paiement.service';

@Component({
  selector: 'app-discount-request-component',
  templateUrl: './discount-request-component.component.html',
  styleUrls: ['./discount-request-component.component.css']
})
export class DiscountRequestComponentComponent implements OnInit {
  message: string = '';
  selectedFile: File | null = null;
  successMessage: string = '';
  errorMessage: string = '';
  paymentId: number | null = null;
  isLoading: boolean = false;
  currentPayment!:Paiement;

  constructor(
    private discountService: DiscountPaymentService,
    private router: Router,
    private route: ActivatedRoute,
    private paymentService:PaiementService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.paymentId = +params['id']; // Convert string to number
      
      if (!this.paymentId || isNaN(this.paymentId)) {
        this.errorMessage = 'Invalid payment selection. Please try again.';
        setTimeout(() => this.router.navigate(['/payments']), 3000);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  submitRequest() {
    // Clear previous messages
    this.successMessage = '';
    this.errorMessage = '';
    this.isLoading = true;

    // Validate inputs
    if (!this.paymentId) {
      this.errorMessage = 'No payment selected. Please try again.';
      this.isLoading = false;
      return;
    }
    
    if (!this.selectedFile) {
      this.errorMessage = 'Please upload your disability card.';
      this.isLoading = false;
      return;
    }

    // Prepare the updated payment data
  

    this.paymentService.getPaiementById(this.paymentId).subscribe({
      next: (payment) => {
        this.currentPayment = payment;
        console.log('Payment details:', payment);
      },
      error: (err) => console.error('Error fetching payment', err)
    });

    this.currentPayment.discountRequested=true;
    this.currentPayment.discountStatus=DiscountStatus.PENDING;


    // First update the payment status
    this.paymentService.updatePaiement(this.paymentId, this.currentPayment as Paiement).subscribe({
      next: () => {
        // Then upload the disability card
        this.discountService.uploadDisabilityCard(this.paymentId!, this.selectedFile!, this.message).subscribe({
          next: () => {
            this.successMessage = 'Discount request submitted successfully!';
            this.isLoading = false;
            this.resetForm();
           
          },
          error: (uploadError) => {
            console.error('Upload error:', uploadError);
            this.errorMessage = uploadError.error?.message || 'Error submitting request. Please try again.';
            this.isLoading = false;
          }
        });
      },
      error: (updateError) => {
        console.error('Error updating payment status:', updateError);
        this.errorMessage = 'Error updating payment status. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private resetForm() {
    this.message = '';
    this.selectedFile = null;
    // Reset file input
    const fileInput = document.getElementById('disabilityCard') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}