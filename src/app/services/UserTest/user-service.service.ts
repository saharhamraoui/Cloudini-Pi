import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';


const NAV_URL = environment.apiURL;


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private httpClient:HttpClient) { }


   getatients(): Observable<any[]> {
      return this.httpClient.get<any[]>(`${NAV_URL}/users/getPatients`);
    }


     getMedecin(): Observable<any[]> {
        return this.httpClient.get<any[]>(`${NAV_URL}/users/getMedecins`);
      }

      


}
