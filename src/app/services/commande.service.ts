import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommandeDto } from '../models/CommandeDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8089/pi';  // URL de ton backend

  constructor(private http: HttpClient) {}

  // Send a new order to the backend
  passerCommande(commande: CommandeDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Commandes`, commande);
  }
  getCommandes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Commandes/`);
  }
 

}
