import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmotionService {
  private categorizeUrl = 'http://192.168.1.162:30596/Pi/api/reclamations/categorize';
  private emotionUrl = 'http://192.168.1.162:30596/Pi/api/categorize/detect-emotion';

  constructor(private http: HttpClient) {}

  detectEmotion(base64Image: string): Observable<any> {
    return this.http.post(this.emotionUrl, { image: base64Image });
  }

  categorize(text: string): Observable<any> {
    return this.http.post(this.categorizeUrl, { text });
  }
}
