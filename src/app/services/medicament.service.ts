import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Medicament } from '../models/Medicament';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class MedicamentService {
  private apiUrl = `${environment.apiBaseUrl}/Medicaments/`; 

  constructor(private http: HttpClient) {}

  getAllMedicaments(): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(this.apiUrl);
  }

  getMedicamentById(id: number): Observable<Medicament> {
    return this.http.get<Medicament>(`${this.apiUrl}${id}`);
  }

  addMedicament(medicament: Medicament): Observable<Medicament> {
    return this.http.post<Medicament>(this.apiUrl, medicament);
  }

  updateMedicament(id: number, medicament: Medicament): Observable<Medicament> {
    return this.http.put<Medicament>(`${this.apiUrl}${id}`, medicament);
  }

  /*deleteMedicament(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }*/
 
  deleteMedicament(id: number): Observable<void> {
    console.log('Deleting medicament with ID:', id); // Add logging to ensure the ID is being sent
    return this.http.delete<void>(`${this.apiUrl}${id}`).pipe(
      tap(() => {
        console.log('Medicament deleted successfully.');
      }),
      catchError((error) => {
        console.error('Error deleting medicament:', error);
        return throwError(() => new Error('Failed to delete medicament'));
      })
    );
  }
  
   // Assign a medicament to a fournisseur
   assignMedicamentToFournisseur(idMedicament: number, idFournisseur: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}affectermedicament/${idMedicament}/${idFournisseur}`, {});
  }

  // Remove a medicament from a fournisseur
  unassignMedicament(idMedicament: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}desaffectermedicament/${idMedicament}`, {});
  }
}
