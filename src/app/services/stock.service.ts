import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../model/Stock';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = environment.urlServiceApi;

  constructor(private http: HttpClient) { }

  getMedicamentsProchesExpiration(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stock/expiration/alertes`);
  }
  getallStocks():  Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stock/`);
  }
}
