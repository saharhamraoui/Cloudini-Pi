import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reclamation } from '../model/reclamation.model';

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private apiUrl = 'http://192.168.1.122:32584/Pi/api/reclamations';
  private responseUrl = 'http://192.168.1.122:32584/Pi/api/responses';

  constructor(private http: HttpClient) {}

  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/getAllReclamations`);
  }

  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/getreclamationbyid/${id}`);
  }

  createReclamation(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.apiUrl}/createReclamation`, reclamation);
  }

  updateReclamation(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.apiUrl}/updateReclamation`, reclamation);
  }

  deleteReclamation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteReclamation/${id}`);
  }

  triggerEscalation(): Observable<any> {
    return this.http.post(`${this.apiUrl}/escalate`, {});
  }

  getResponsesByReclamationId(reclamationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.responseUrl}/getresponsebyRecid/${reclamationId}`);
  }

  
}
