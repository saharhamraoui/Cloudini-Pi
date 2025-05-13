import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseUrl = 'http://192.168.1.122:32584/pi/notifs'; // Changement de port et de chemin

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/user/${userId}`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${notificationId}/read`, {}); // Adapté au contrôleur
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/user/${userId}/read-all`, {}); // Adapté au contrôleur
  }

  getUnreadCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/user/${userId}/unread-count`); // Adapté au contrôleur
  }

  // Nouvelle méthode pour les notifications de posts
  notifyNewPost(postId: number): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/notify-post/${postId}`, {});
  }

  // Nouvelle méthode pour les notifications de commentaires
  notifyNewComment(commentId: number, recipientId: number): Observable<string> {
    return this.http.post<string>(
      `${this.baseUrl}/notify-comment/${commentId}?recipientId=${recipientId}`,
      {}
    );
  }
}
