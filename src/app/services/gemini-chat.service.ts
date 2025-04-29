import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicament } from '../model/Medicament';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class GeminiChatService {
  //private apiUrl = 'http://localhost:8089/pi/api/chatbot'; 
  private apiUrl = environment.urlServiceApi;

  constructor(private http: HttpClient) {}

sendMessage(message: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/chatbot`, { message }, { responseType: 'text' });
}
}