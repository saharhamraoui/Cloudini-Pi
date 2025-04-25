import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../model/Stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {

private apiUrl = 'http://localhost:8089/pi';  // URL de ton backend

  constructor(private http: HttpClient) { }

  getMedicamentsProchesExpiration(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stock/expiration/alertes`);
  }
  getallStocks():  Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stock/`);
  }
}
