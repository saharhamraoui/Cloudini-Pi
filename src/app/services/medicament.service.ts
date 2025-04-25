import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medicament } from '../model/Medicament';

@Injectable({
  providedIn: 'root'
})
export class MedicamentService {
  private apiUrl = 'http://localhost:8089/pi';  

  constructor(private http: HttpClient) { }

  getMedicamentsProchesExpiration(): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`${this.apiUrl}/Medicaments/expiration/alertes`);
  }

  addMedicamentToFournisseur(idFournisseur: number, medicament: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Medicaments/ajoutermedicament/${idFournisseur}`, medicament);
  }

  getAllMedicaments(): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`${this.apiUrl}/Medicaments/`);
  }

  getMedicament(id: number): Observable<Medicament> {
    return this.http.get<Medicament>(`${this.apiUrl}/Medicaments/${id}`);
  }

  updateMedicament(medicament: Medicament): Observable<Medicament> {
    return this.http.put<Medicament>(`${this.apiUrl}/Medicaments/`, medicament);
  }

  deleteMedicament(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Medicaments/${id}`);
  }
  getFournisseurName(idFournisseur: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/Medicaments/fournisseur/${idFournisseur}/nom`);
  }
}