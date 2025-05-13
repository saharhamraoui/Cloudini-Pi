import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const NAV_URL = environment.apiURL+"/api/email/send";


@Injectable({
  providedIn: 'root'
})
export class EmailSenderService {
 
  
  

  
  
    constructor(private http: HttpClient) {}
  
    sendEmail(to: string, subject: string, body: string) {
      const params = new HttpParams()
        .set('to', to)
        .set('subject', subject)
        .set('body', body);
  
      return this.http.post(NAV_URL, null, { params });
    }
  }
  

