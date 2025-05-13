import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const NAV_URL = environment.apiURL+"/api/discount-requests";


@Injectable({
  providedIn: 'root'
})
export class DiscountPaymentService {

  constructor(private http: HttpClient) { }

  uploadDisabilityCard(paymentId: number, file: File, message?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (message) {
      formData.append('message', message);
    }

    return this.http.post(
      `${NAV_URL}/upload-disability-card/${paymentId}`,
      formData
    );
  }


  approveDiscount(paymentId: number): Observable<any> {
    return this.http.post(`${NAV_URL}/${paymentId}/approve`, {});
  }
  
  rejectDiscount(paymentId: number, reason: string): Observable<any> {
    return this.http.post(`${NAV_URL}/${paymentId}/reject`, { reason });
  }

// In your DiscountPaymentService
getDisabilityCard(paymentId: number): Observable<ArrayBuffer> {
  return this.http.get(`${NAV_URL}/${paymentId}/disability-card`, {
    responseType: 'arraybuffer'
  });
}
}