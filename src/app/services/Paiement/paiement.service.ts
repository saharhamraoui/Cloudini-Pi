import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Observable } from 'rxjs';
import { Paiement } from 'src/app/model/Paiement';
import { environment } from 'src/environments/environment.development';

const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private stripePromise = loadStripe("pk_test_51REbxJIsTRWCabaqXD97ViCXWSp3JWXUm4jU3Npj5YwRRjEHbsVuXzVJGYO8FwWGAaKLWyXVFBWKFTLo9WwZFxdg00gvszT3kO");
  private stripe!: Stripe;

  constructor(private http: HttpClient) {}

  // Existing methods remain unchanged
  getPaiementsByDoctorEmail(email: string): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${NAV_URL}/paiements/doctor/${email}`);
  }

  getPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${NAV_URL}/paiements/getPaiements`);
  }

  getPaiementById(id: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${NAV_URL}/paiements/paiements/${id}`);
  }
  
  getPaiementsUser(user: string): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${NAV_URL}/paiements/user/${user}`);
  }

  addPaiement(paiement: Paiement): Observable<Paiement> {
    return this.http.post<Paiement>(`${NAV_URL}/paiements/add`, paiement);
  }

  updatePaiement(id: number, paiement: Paiement): Observable<Paiement> {
    return this.http.put<Paiement>(`${NAV_URL}/paiements/${id}`, paiement);
  }

  updatePaymentStatus(id: number, paiement: Paiement): Observable<Paiement> {
    return this.http.put<Paiement>(`${NAV_URL}/paiements/${id}`, paiement);
  }

  deletePaiement(id: number): Observable<any> {
    return this.http.delete(`${NAV_URL}/paiements/${id}`);
  }

  createPaymentIntent(paymentDetails: any): Observable<any> {
    return this.http.post<any>(`${NAV_URL}/paiements/create-payment-intent`, paymentDetails);
  }

  async confirmCardPayment(clientSecret: string, cardElement: any) {
    if (!this.stripe) {
      throw new Error('Stripe is not initialized');
    }
    return await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
  }

 
}