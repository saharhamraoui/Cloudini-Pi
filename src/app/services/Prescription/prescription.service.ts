import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prescription } from 'src/app/model/Prescription';
import { environment } from 'src/environments/environment.development';


const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  constructor(public httpClient:HttpClient) { }


  public addPrescriptions(prescription: Prescription): Observable<Prescription> {
    return this.httpClient.post<any>(`${NAV_URL}/Prescription/addPrescription`, prescription);
  }

    deletePrescription(id: number): Observable<any> {
      return this.httpClient.delete(`${NAV_URL}/Prescription/deletePrescription/${id}`);
    }

  
  
    public updatePrescription(prescription: Prescription): Observable<Prescription> {
      return this.httpClient.put<Prescription>(`${NAV_URL}/Prescription/updatePrescription`, prescription);
    }
    

  getPrescriptions(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${NAV_URL}/Prescription/getAllPrescription`);
  }


  getPrescriptionById(id:number): Observable<Prescription[]> {
    return this.httpClient.get<any[]>(`${NAV_URL}/Prescription/getPrescription/${id}`);
  }

  
  getPrescriptionByIdRecord(idRecord:number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${NAV_URL}/Prescription/getPrescriptionByRecord/${idRecord}`);
  }
}
