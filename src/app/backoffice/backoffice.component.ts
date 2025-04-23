import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css']
})
export class BackofficeComponent {
  constructor(public router: Router) {}

  showLayout(): boolean {
    return !this.router.url.startsWith('/back/commande/valider/');
  }
}
