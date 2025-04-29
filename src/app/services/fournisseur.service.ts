import { Injectable } from '@angular/core';
import { Fournisseur } from '../model/Fournisseur';
import { Observable } from 'rxjs';
import { Medicament } from '../model/Medicament';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

 // private apiUrl = 'http://localhost:8089/pi';  // URL de ton backend
  private apiUrl = environment.urlServiceApi;

  constructor(private http: HttpClient) { }

  // Récupérer tous les fournisseurs
  getAllFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${this.apiUrl}/Fournisseurs/`);
  }

  // Récupérer les médicaments d'un fournisseur
  getMedicamentsByFournisseur(idFournisseur: number): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`${this.apiUrl}/Fournisseurs/${idFournisseur}/medicaments`);
  }

  // Recherche de fournisseur par médicament
  searchFournisseursByMedicament(nomMedicament: string): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${this.apiUrl}/Fournisseurs/chercher-medicament/${nomMedicament}`);
  }
 
   // Fetch fournisseur by ID
   getFournisseurById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.apiUrl}/Fournisseurs/${id}`);
  }
  
 // Add fournisseur
addFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
  return this.http.post<Fournisseur>(`${this.apiUrl}/Fournisseurs/`, fournisseur);
}

updateFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
  console.log(`Updating fournisseur with id: ${fournisseur.idfournisseur}`);  // Debug log
  return this.http.put<Fournisseur>(`${this.apiUrl}/Fournisseurs/${fournisseur.idfournisseur}`, fournisseur);
}


getFournisseurs(): Observable<Fournisseur[]> {
  return this.http.get<Fournisseur[]>(`${this.apiUrl}`);
}


deleteFournisseur(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/Fournisseurs/${id}`);
}


}

