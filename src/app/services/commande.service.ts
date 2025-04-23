import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommandeDto } from '../model/CommandeDto';
import { Observable } from 'rxjs';
import { Stock } from '../model/Stock';

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
   // Récupérer la commande
   getCommandeById(commandeId: number): Observable<CommandeDto> {
    return this.http.get<CommandeDto>(`${this.apiUrl}/Commandes/${commandeId}`);
  }

  
  
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
  
  supprimerCommande(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Commandes/${id}`);
  }

  
}
