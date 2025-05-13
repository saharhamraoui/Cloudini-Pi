import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const authData = localStorage.getItem('authData');
    console.log('AdminGuard authData:', authData);
  
    if (!authData) {
      this.router.navigate(['/login']);
      return false;
    }
  
    const { role } = JSON.parse(authData);
    console.log('User role:', role);
  
    if (role !== 'ADMIN') {
      this.router.navigate(['/test-page']);
      return false;
    }
  
    console.log('Access granted to admin routes');
    return true;
  }
  
}