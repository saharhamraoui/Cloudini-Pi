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
}