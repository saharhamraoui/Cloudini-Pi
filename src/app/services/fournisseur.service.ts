import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Fournisseur } from '../models/Fournisseur';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private apiUrl = `${environment.apiBaseUrl}/Fournisseurs/`;

  constructor(private http: HttpClient) {}

  getAllFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.apiUrl).pipe(
      tap(() => console.log('Fournisseurs retrieved successfully')),
      catchError(this.handleError)
    );
  }

  getFournisseurById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.apiUrl}${id}`).pipe(
      tap(() => console.log(`Fournisseur retrieved: ID=${id}`)),
      catchError(this.handleError)
    );
  }

  addFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.apiUrl, fournisseur).pipe(
      tap((newFournisseur) => console.log(`Fournisseur added: ID=${newFournisseur.idfournisseur}`)),
      catchError(this.handleError)
    );
  }

  updateFournisseur(id: number, fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.apiUrl}${id}`, fournisseur).pipe(
      tap(() => console.log(`Fournisseur updated: ID=${id}`)),
      catchError(this.handleError)
    );
  }

  deleteFournisseur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`).pipe(
      tap(() => console.log(`Fournisseur deleted: ID=${id}`)),
      catchError(this.handleError)
    );
  }

  // Associer plusieurs médicaments à un fournisseur
  assignMedicamentsToFournisseur(idFournisseur: number, idMedicaments: number[]): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.apiUrl}affectermedicaments/${idFournisseur}`, idMedicaments).pipe(
      tap(() => console.log(`Médicaments assignés au fournisseur: ID=${idFournisseur}`)),
      catchError(this.handleError)
    );
  }

  // Trouver les meilleurs fournisseurs pour un médicament donné
  getBestFournisseurs(medicamentName: string): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${this.apiUrl}best/${medicamentName}`).pipe(
      tap(() => console.log(`Meilleurs fournisseurs récupérés pour le médicament: ${medicamentName}`)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('An error occurred while processing your request.'));
  }
}