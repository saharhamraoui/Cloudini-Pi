import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const NAV_URL = environment.apiURL+"/api/chat/ask";
@Injectable({
  providedIn: 'root'
})
export class ChatBotService {


  constructor(private http: HttpClient) {}

  askQuestion(question: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(NAV_URL, { message: question });
  }

}
