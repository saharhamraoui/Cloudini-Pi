import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paiement } from 'src/app/model/Paiement';
import { KonnectPaymentService } from 'src/app/services/Konnect/konnect-payment.service';
import { PaiementService } from 'src/app/services/Paiement/paiement.service';

@Component({
  selector: 'app-paiement-client-tn',
  templateUrl: './paiement-client-tn.component.html',
  styleUrls: ['./paiement-client-tn.component.css']
})
export class PaiementClientTnComponent {


  constructor(private konnectPaymentService: KonnectPaymentService,private paymentService:PaiementService,private activatedRoute:ActivatedRoute) {}

   paiement!: Paiement;
    
    goBack() {
      window.history.back();
    }
  
    async ngOnInit() {
  
      const id = +this. activatedRoute.snapshot.paramMap.get('id')!;
    if (id) {
      this.paymentService.getPaiementById(+id).subscribe(p => {
        this.paiement = p;
      });
    }
  }


  pay() {
    const id = +this. activatedRoute.snapshot.paramMap.get('id')!;
    if (id) {
      this.paymentService.getPaiementById(+id).subscribe(p => {
        this.paiement = p;
      });
    }
    
    this.konnectPaymentService.initPayment(this.paiement).subscribe({
      next: (response) => {
        console.log('Payment response:', response);
        // You can show a success message or do something else here
        alert('Payment initiated successfully!');
      },
      error: (error) => {
        console.error('Error initiating payment:', error);
        alert('Payment initiation failed!');
      }
    });
  }
  
}
