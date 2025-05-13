// notifications.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;
  isOpen = false;
  isLoading = false;
  error: string | null = null;

  private readonly userId = 5; // À remplacer par votre ID dynamique

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadUnreadCount();
  }

  toggleNotifications(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.notifications.length === 0) {
      this.loadNotifications();
    }
  }

  private loadNotifications(): void {
    this.isLoading = true;
    this.error = null;
    this.notificationService.getUserNotifications(this.userId).subscribe({
      next: (notifs) => {
        this.notifications = notifs.map(n => ({
          ...n,
          createdAt: new Date(n.createdAt)
        })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.error = 'Impossible de charger les notifications';
        this.isLoading = false;
      }
    });
  }

  private loadUnreadCount(): void {
    this.notificationService.getUnreadCount(this.userId).subscribe({
      next: (count) => {
        this.unreadCount = count;
      },
      error: (err) => {
        console.error('Error loading unread count:', err);
        // En cas d'erreur CORS, on peut compter les non-lues localement
        if (this.notifications.length > 0) {
          this.unreadCount = this.notifications.filter(n => !n.seen).length;
        }
      }
    });
  }

  markAsRead(notificationId: number): void {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif && !notif.seen) {
      this.notificationService.markAsRead(notificationId).subscribe({
        next: () => {
          notif.seen = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        },
        error: (err) => {
          console.error('Error marking as read:', err);
        }
      });
    }
  }

  markAllAsRead(): void {
    if (this.unreadCount === 0) return;

    this.notificationService.markAllAsRead(this.userId).subscribe({
      next: () => {
        this.notifications.forEach(n => n.seen = true);
        this.unreadCount = 0;
      },
      error: (err) => {
        console.error('Error marking all as read:', err);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-container') && this.isOpen) {
      this.isOpen = false;
    }
  }
}
