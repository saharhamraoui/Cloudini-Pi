import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from 'src/app/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://192.168.1.122:30596/Pi/users';
  private authApiUrl = 'http://192.168.1.122:30596/Pi/api/auth'; 

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`, { headers: this.getHeaders() });
  }

  getBanned(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/banned-users`, { headers: this.getHeaders() });
  }


  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUser/${id}`, { headers: this.getHeaders() });
  }

  updatePatient(patient: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-patient`, patient, {
      headers: this.getHeaders()
    });
  }

  updateMedecin(medecin: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-medecin`, medecin, {
      headers: this.getHeaders()
    });
  }

  updateChauffeur(chauffeur: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-chauffeur`, chauffeur, {
      headers: this.getHeaders()
    });
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-user`, user, {
      headers: this.getHeaders()
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteUser/${id}`, { headers: this.getHeaders() });
  }

  getAllPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getPatients`, { headers: this.getHeaders() });
  }

  getAllMedecins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getMedecins`, { headers: this.getHeaders() });
  }

  getAllChauffeurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getChauffeurs`, { headers: this.getHeaders() });
  }

  toggleBan(userId: number, status: boolean): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/toggle-ban`, null, {
      headers: this.getHeaders(),
      params: { userId: userId.toString(), status: status.toString() }
    });
  }

  changeUserRole(userId: number, newRole: Role): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/change-role`, null, {
      params: { newRole }
    });
  }

  analyzeSentiments(): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/analyze-sentiments`, {}, { headers: this.getHeaders() });
  }
}