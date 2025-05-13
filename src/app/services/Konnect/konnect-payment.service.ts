import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paiement } from 'src/app/model/Paiement';
import { environment } from 'src/environments/environment.development';

const NAV_URL = environment.apiURL+"/konnect";  

@Injectable({
  providedIn: 'root'
})
export class KonnectPaymentService {



  constructor(private http: HttpClient) {}

  initPayment(payment: Paiement): Observable<any> {
      return this.http.post<any>(`${NAV_URL}/init-payment/${payment.montant}/${payment.emailPatient}`, {});
    }
}
