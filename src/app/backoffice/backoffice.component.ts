import { Component } from '@angular/core';
import { NotificationService } from '../services/notification-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css']
})
export class BackofficeComponent  {
 constructor(private notificationService: NotificationService,public router: Router) { }

  ngOnInit(): void {
    this.notificationService.startNotificationCheck();
  }
  showLayout(): boolean {
    return !this.router.url.startsWith('/back/commande/valider/');
  }
}
