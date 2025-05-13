import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';


const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {


  constructor(private http: HttpClient) {}

  createLeaveRequest(request: any): Observable<any> {
    return this.http.post(`${NAV_URL}/leave-requests`, request);
  }

  getLeaveRequestsByAssistant(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${NAV_URL}/leave-requests/${email}`);
  }

  updateLeaveRequestStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${NAV_URL}/leave-requests/${id}?status=${status}`, null);
  }

  getAllLeaveRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${NAV_URL}/leave-requests/getAll`);
  }

}

