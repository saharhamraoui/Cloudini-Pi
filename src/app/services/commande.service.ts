import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommandeDto } from '../models/CommandeDto';
import { Observable } from 'rxjs';
<<<<<<< Updated upstream
=======
import { Stock } from '../models/Stock';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
 

=======
  
  updateStatusCommande(commandeId: number, newStatus: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/Commandes/updateStatus/${commandeId}?newStatus=${newStatus}`,
      {}, // Empty body since the backend expects query parameters
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  getStock(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stock/`);
  }
  
  
  
>>>>>>> Stashed changes
}
