import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalRecord } from 'src/app/model/MedicalRecord';
import { environment } from 'src/environments/environment.development';


const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {

  constructor(public httpClient:HttpClient) { }
  
  getByPatient(patientId: number): Observable<MedicalRecord[]> {
    return this.httpClient.get<MedicalRecord[]>(`${NAV_URL}/medicalRecord/patient/${patientId}`);
  }
  
  getByDoctor(doctorId: number): Observable<MedicalRecord[]> {
    return this.httpClient.get<MedicalRecord[]>(`${NAV_URL}/medicalRecord/doctor/${doctorId}`);
  }
  
  getByPatientEmail(email: string): Observable<MedicalRecord[]> {
    return this.httpClient.get<MedicalRecord[]>(`${NAV_URL}/medicalRecord/by-patient-email/${email}`);
  }

    public addMedicalrecord(medicalRecord: MedicalRecord): Observable<MedicalRecord> {
      return this.httpClient.post<any>(`${NAV_URL}/medicalRecord/addMedicalRecord`, medicalRecord);
    }
  
    updateMedicalRecord(medicalRecord: MedicalRecord): Observable<MedicalRecord> {
      return this.httpClient.put<MedicalRecord>(`${NAV_URL}/medicalRecord/updateMedicalRecord`, medicalRecord);
    }
    
    
      deletePaiement(id: number): Observable<any> {
        return this.httpClient.delete(`${NAV_URL}/medicalRecord/deleteMedicalRecord/${id}`);
      }
  
    
    getMedicalRecords(): Observable<any[]> {
      return this.httpClient.get<any[]>(`${NAV_URL}/medicalRecord/getAll`);
    }
}

