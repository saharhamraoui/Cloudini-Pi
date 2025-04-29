import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicament } from '../model/Medicament';
@Injectable({
  providedIn: 'root'
})
export class GeminiChatService {
  private apiUrl = 'http://localhost:8089/pi/api/chatbot'; 

  constructor(private http: HttpClient) {}

sendMessage(message: string): Observable<any> {
  return this.http.post(this.apiUrl, { message }, { responseType: 'text' });
}
}