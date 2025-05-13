import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://192.168.1.122:32584/pi/ai/suggest-articles';

  constructor(private http: HttpClient) {}

  suggestArticles(specialty: string, keywords: string): Observable<{articles: string}> {
    const body = { specialty, keywords };
    return this.http.post<{articles: string}>(this.apiUrl, body);
  }
}
