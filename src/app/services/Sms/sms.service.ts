import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private http: HttpClient) {}

  public sendSms(to: string, body: string): Observable<any> {
    const encodedTo = encodeURIComponent(to);
    const encodedBody = encodeURIComponent(body);
    return this.http.post(`${NAV_URL}/api/sms/send/${encodedTo}/${encodedBody}`, {}, { responseType: 'text' as 'json' });
  }

}
