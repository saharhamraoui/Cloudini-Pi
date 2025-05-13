import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RendezVous } from '../model/RendezVous';
import { environment } from './../../environments/environment.development';
import { Medecin } from '../model/Medecin';
import { Patient } from '../model/Patient';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {

  private urlServeurApi = environment.urlServiceApi ;

  constructor(private http: HttpClient) { }

  public getRendezVous(): Observable<RendezVous[]>{

    return this.http.get<RendezVous[]>(this.urlServeurApi+"/rendezVous/GetAll");
  }



  public getMedecins(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(this.urlServeurApi+"/rendezVous/getAllMedecins");
  }

  public getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.urlServeurApi+"/rendezVous/getAllPatients");
  }

  addRendezVous(rendezVous:RendezVous) {

    return this.http.post<RendezVous>(
      `${this.urlServeurApi}/rendezVous/addRendezVous`,
      rendezVous,
      { headers: { 'Content-Type': 'application/json' } }
  );
  }
  deleteRendezVous(id:number) :Observable<RendezVous> {

   return this.http.delete<RendezVous>(`${this.urlServeurApi}/rendezVous/deleteRendezVous/${id}`);

  }

  // updateRendezVous(rendezVous: any): Observable<any> {
  //   return this.http.put(`${this.urlServeurApi}/pidb/rendezVous/updateRendezVous/${rendezVous.idRendezVous}`, rendezVous);

  // }

  updateRendezVous(rendezVous: any): Observable<any> {
    return this.http.put(`${this.urlServeurApi}/rendezVous/updateRendezVous`, rendezVous);
  }

  public getRendezVousByMedecin(medecinId: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.urlServeurApi}/rendezVous/GetByMedecin/${medecinId}`);
  }



  // updateRendezVous(rendezVous: RendezVous): Observable<RendezVous> {
  //   return this.http.put<RendezVous>(`${this.urlServeurApi}/pidb/rendezVous/updateRendezVous`, rendezVous);
  // }



  getRendezVousById(id:number) :Observable<RendezVous> {
    return this.http.get<RendezVous>(this.urlServeurApi+"/rendezVous/GetById/"+id);

  }


  getCreneauOptimal(medecinId: number): Observable<Date> {
    return this.http.get<Date>(this.urlServeurApi+"/rendezVous/proposer-creneau/"+medecinId);
  }


}
