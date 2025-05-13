import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/userService/auth.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  selectedFile: File | null = null;
  previewPhoto: string | ArrayBuffer | null = null;
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService ,
    private location: Location 
    

  ) {}

  ngOnInit(): void {
    const authData = localStorage.getItem('authData');
    if (authData) {
      this.user = JSON.parse(authData);
      console.log('UserProfile - authData:', this.user);
    } else {
      this.router.navigate(['/login']);
    }
    if (!this.user.photoUrl) {
      this.user.photoUrl = 'assets/profile.png';
    }
    this.previewPhoto = this.user.photoUrl;
  
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Créer un preview de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewPhoto = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  changePhoto(): void {
    // Déclencher le click sur l'input file caché
    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    fileInput.click();
  }

  uploadPhoto(): void {
    if (!this.selectedFile) return;

    this.authService.uploadPhoto(this.selectedFile).subscribe({
      next: (photoUrl) => {
        // Mettre à jour la photo dans les données utilisateur
        this.user.photoUrl = photoUrl;
        
        // Mettre à jour les données dans le localStorage
        this.updateLocalStorage();
        
        alert('Photo de profil mise à jour avec succès');
      },
      error: (err) => {
        console.error('Error uploading photo:', err);
        alert('Erreur lors du changement de photo');
      }
    });
  }

  updateLocalStorage(): void {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const userData = JSON.parse(authData);
      userData.photoUrl = this.user.photoUrl;
      localStorage.setItem('authData', JSON.stringify(userData));
    }
  }
  editProfile(): void {
    const currentUrl = this.router.url;
    this.router.navigate(['/profile/edit'], { 
      queryParams: { from: currentUrl } 
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
  cancel(): void {
    this.location.back();
  }
  
}