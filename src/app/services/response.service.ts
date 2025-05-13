import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../model/response.model';

@Injectable({ providedIn: 'root' })
export class ResponseService {
  private apiUrl = 'http://192.168.1.122:30596/Pi/api/responses';

  constructor(private http: HttpClient) {}

  getResponsesByReclamation(reclamationId: number): Observable<ResponseModel[]> {
    return this.http.get<ResponseModel[]>(`${this.apiUrl}/getresponsebyRecid/${reclamationId}`);
  }

  createResponse(reclamationId: number, response: ResponseModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.apiUrl}/${reclamationId}/create`, response);
  }

  updateResponse(response: ResponseModel): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.apiUrl}/updateresponse`, response);
  }

  deleteResponse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
