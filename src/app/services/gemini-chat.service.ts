import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicament } from '../model/Medicament';
@Injectable({
  providedIn: 'root'
})
export class GeminiChatService {
  private apiUrl = 'http://localhost:8089/pi/api/chatbot/ask';  // Your Spring Boot API URL

  constructor(private http: HttpClient) {}

  sendMessage(prompt: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, prompt);
  }
}
