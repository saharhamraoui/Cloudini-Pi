import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Bilan } from 'src/app/model/Bilan';
import { environment } from 'src/environments/environment.development';


const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class BilanService {

constructor(public httpClient:HttpClient) { }

  /*public addBilan(formData: FormData): Observable<FormData> {
    return this.httpClient.post<any>(`${NAV_URL}/api/bilans/upload`, formData);
  }*/

  public getBilansByMedicalRecord(medicalRecordId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${NAV_URL}/api/bilans/medicalRecord/${medicalRecordId}`);
  }
  

 // bilan.service.ts
addBilan(formData: FormData): Observable<Bilan> {
  return this.httpClient.post<Bilan>(`${NAV_URL}/api/bilans/upload`, formData).pipe(
    catchError(error => {
      console.error('Full error:', error);
      let errorMessage = 'Unknown error occurred';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        if (error.error) {
          errorMessage += `\nServer Response: ${JSON.stringify(error.error)}`;
        }
      }
      return throwError(() => new Error(errorMessage));
    })
  );
}
}
