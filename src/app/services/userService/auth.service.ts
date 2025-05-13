import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthResponse } from 'src/app/model/auth-response.model';
import { Chauffeur } from 'src/app/model/chauffeur.model';
import { Medecin } from 'src/app/model/medecin.model';
import { Patient } from 'src/app/model/patient.model';
import { User } from 'src/app/model/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.1.122:30596/Pi/api/auth';
  private apiUrl2 = 'http://192.168.1.122:30596/Pi/api';
  private apiUrl3 = 'http://192.168.1.122:30596/Pi/api/face-auth';
  private flaskApiUrl = 'http://192.168.1.122:30596';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('An error occurred'));
  }

  registerPatient(patient: Patient): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-patient`, patient, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return throwError(() => new Error('This email is already in use'));
        }
        return this.handleError(error);
      })
    );
  }

  registerMedecin(medecin: Medecin): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-medecin`, medecin, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return throwError(() => new Error('This email is already in use'));
        }
        return this.handleError(error);
      })
    );
  }

  registerChauffeur(chauffeur: Chauffeur): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-chauffeur`, chauffeur, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return throwError(() => new Error('This email is already in use'));
        }
        return this.handleError(error);
      })
    );
  }

  loginWithGoogle(idToken: string): Observable<AuthResponse> {
    if (!idToken) {
      return throwError(() => new Error('Google token is invalid'));
    }
    
    console.log('Sending Google token to backend:', idToken.substring(0, 20) + '...');
    
    const body = { idToken }; 

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login/google`, 
      body, 
      { headers: this.getHeaders() } // Removed withCredentials
    ).pipe(
      tap((response: AuthResponse) => {
        console.log('Google login successful');
        localStorage.setItem('authData', JSON.stringify(response));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Google login error:', error);
        let errorMessage = 'Failed to login with Google';
        
        if (error.status === 400) {
          if (error.error?.includes('banned')) {
            errorMessage = 'Your account is banned';
          } else if (error.error?.includes('Invalid Google token')) {
            errorMessage = 'Invalid Google login token';
          } else {
            errorMessage = error.error || 'Invalid Google login token';
          }
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  login(email: string, password: string, recaptchaToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`, 
      { email, password, recaptchaToken },
      { headers: this.getHeaders() }
    ).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('authData', JSON.stringify(response));
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        if (error.status === 400 && error.error?.includes('banni')) {
          errorMessage = 'Your account is banned';
        } else if (error.status === 400 && error.error?.includes('captcha')) {
          errorMessage = 'reCAPTCHA verification failed';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getFaceDescriptors(userId: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl3}/face-descriptors/${userId}`);
  }

  createAdmin(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create-admin`, user, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    }, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateUserProfile(userData: any): Observable<any> {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const token = authData.token;
    
    if (!token) {
      return throwError(() => new Error('Token not available'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/update-profile`, userData, { headers }).pipe(
      tap((response: any) => {
        const updatedAuthData = { ...authData, ...response };
        localStorage.setItem('authData', JSON.stringify(updatedAuthData));
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('authData');
    localStorage.removeItem('role');
    localStorage.removeItem('userData'); 
  }

  get currentUserValue(): User | null {
    try {
      const token = localStorage.getItem('token');
      const authData = localStorage.getItem('authData');
      
      if (!token || !authData) {
        return null;
      }
      
      return JSON.parse(authData);
    } catch (error) {
      console.error('Error parsing auth data:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsed = JSON.parse(authData);
      const token = parsed.token || parsed.jwtToken;
      const idUser = parsed.idUser || parsed.user?.id;
      return !!token && !!idUser;
    }
    return false;
  }

  uploadPhoto(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ photoUrl: string }>(`${this.apiUrl}/upload-photo`, formData)
      .pipe(map(response => response.photoUrl));
  }

  loginWithFace(userId: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl3}/login/face`, 
      { userId },
      { headers: this.getHeaders() }
    ).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('authData', JSON.stringify(response));
      }),
      catchError(this.handleError)
    );
  }

  recognizeFace(descriptor: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl3}/recognize`, descriptor, {
      headers: this.getHeaders()
    });
  }

  registerFace(userId: string, descriptor: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl3}/register/${userId}`, descriptor, {
      headers: this.getHeaders()
    });
  }

  registerFaceTemporarily(email: string, descriptor: number[]): Observable<any> {
    const float32Descriptor = new Float32Array(descriptor);
    
    return this.http.post(
      `${this.apiUrl3}/temp-register?email=${encodeURIComponent(email)}`, 
      Array.from(float32Descriptor),
      { headers: this.getHeaders() }
    );
  }

  verifyEmail(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { email, code }, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(
      map(response => {
        try {
          return JSON.parse(response);
        } catch (e) {
          return { message: response };
        }
      }),
      catchError(this.handleError)
    );
  }

  generateDescription(keywords: string, role: string): Observable<any> {
const rolePrompts = {
  patient: 'Génère une description patient médicale professionnelle en français',
  medecin: 'Génère une description de médecin avec spécialité en français',
  chauffeur: 'Génère une description de chauffeur professionnel en français'
};
    return this.http.post(`${this.flaskApiUrl}/generate-description`, { keywords, role }, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  downloadDescription(description: string): Observable<Blob> {
    return this.http.post(`${this.flaskApiUrl}/download-description`, { description }, {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }
  registerWithGoogle(email: string, firstName: string, lastName: string, role: string): Observable<AuthResponse> {
    const body = { email, firstName, lastName, role };
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/google/register`,
      body,
      { headers: this.getHeaders() }
    ).pipe(
      tap((response: AuthResponse) => {
        console.log('Google registration successful');
        localStorage.setItem('authData', JSON.stringify(response));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Google registration error:', error);
        let errorMessage = 'Failed to register with Google';
        if (error.status === 400) {
          errorMessage = error.error || 'Invalid registration data';
        } else if (error.status === 409) {
          errorMessage = 'User already exists with a role';
        } else if (error.status === 404) {
          errorMessage = 'User not found';
        } else if (error.status === 500) {
          errorMessage = 'Server error: ' + (error.error || 'Registration failed');
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}