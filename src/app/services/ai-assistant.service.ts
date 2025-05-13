import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RendezVousService } from './rendez-vous.service';
import { Medecin } from '../model/Medecin';

@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private apiKey = 'AIzaSyBpa3w4kpfNoB5suzjdQ3g9kEo7QHkabEk';
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(
    private http: HttpClient,
    private rendezVousService: RendezVousService
  ) { }

  // Send message to Gemini API
  sendMessage(message: string): Observable<string> {
    const url = `${this.apiUrl}?key=${this.apiKey}`;
    const body = {
      contents: [{
        parts: [{ text: message }]
      }]
    };

    return this.http.post<any>(url, body).pipe(
      map(response => {
        if (response.candidates && response.candidates.length > 0 && 
            response.candidates[0].content && 
            response.candidates[0].content.parts && 
            response.candidates[0].content.parts.length > 0) {
          return response.candidates[0].content.parts[0].text;
        }
        return 'Sorry, I could not process your request. Please try again.';
      }),
      catchError(error => {
        console.error('AI Assistant API error:', error);
        return of('Sorry, there was an error communicating with the AI service. Please try again later.');
      })
    );
  }

  // Get doctor recommendations based on appointment frequency
  getDoctorRecommendations(): Observable<string> {
    return this.rendezVousService.getMedecins().pipe(
      switchMap(medecins => {
        // Create a map to store doctor IDs and their appointment counts
        const doctorAppointmentCounts = new Map<number, { medecin: Medecin, count: number }>();
        
        // Initialize the counts for all doctors
        medecins.forEach(medecin => {
          doctorAppointmentCounts.set(medecin.idUser, { medecin, count: 0 });
        });
        
        // Get all appointments to count them per doctor
        return this.rendezVousService.getRendezVous().pipe(
          map(appointments => {
            // Count appointments per doctor
            appointments.forEach(appointment => {
              const doctorId = appointment.medecin.idUser;
              const doctorData = doctorAppointmentCounts.get(doctorId);
              if (doctorData) {
                doctorData.count += 1;
                doctorAppointmentCounts.set(doctorId, doctorData);
              }
            });
            
            // Convert map to array and sort by appointment count (descending)
            const sortedDoctors = Array.from(doctorAppointmentCounts.values())
              .sort((a, b) => b.count - a.count)
              .slice(0, 3); // Get top 3 doctors
            
            // Format the response
            let response = 'Here are the most recommended doctors based on appointment frequency:\n\n';
            
            sortedDoctors.forEach((doctor, index) => {
              response += `${index + 1}. Dr. ${doctor.medecin.firstName} ${doctor.medecin.lastName}`;
              if (doctor.medecin.speciality) {
                response += ` (${doctor.medecin.speciality})`;
              }
              response += ` - ${doctor.count} appointments\n`;
            });
            
            return response;
          })
        );
      }),
      catchError(error => {
        console.error('Error getting doctor recommendations:', error);
        return of('Sorry, I could not retrieve doctor recommendations at this time.');
      })
    );
  }
} 