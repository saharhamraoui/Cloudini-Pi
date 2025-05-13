import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class DiseaseServiceService {

  

    private urlServeurApi = environment.urlServiceApi ;
  
    constructor(private http: HttpClient) { }
  
      /**
   * Envoie une liste de symptômes au backend et récupère la maladie prédite
   * @param symptoms Liste de symptômes (ex : ["headache", "fever"])
   * @returns Observable<string> avec la maladie prédite
   */
  public predictDisease(symptoms: string[]): Observable<string> {
    return this.http.post(`${this.urlServeurApi}/disease/predict`, symptoms, {
      responseType: 'text'
    });
  }
}
