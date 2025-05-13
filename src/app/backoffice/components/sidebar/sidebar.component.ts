import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  isCollapsed = false;
  isLoggedIn = false;
  isAdmin = false;
  isMedecinOrAdmin = false;
  showTasks = false;
  isLoadingTasks = false;
  currentUser = {
    firstName: '',
    lastName: '',
    role: ''
  };
  tasks = [
    { title: 'Vérifier les rendez-vous', completed: false },
    { title: 'Mettre à jour les dossiers patients', completed: true },
    { title: 'Planifier les chauffeurs', completed: false }
  ];


getAvatarInitials(): string {
  const firstInitial = this.currentUser.firstName?.charAt(0) || '';
  const lastInitial = this.currentUser.lastName?.charAt(0) || '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
}



// Track if image should be shown
showImage = true;

// Helper method to get the avatar initials
// getAvatarInitials(): string {
//   const firstInitial = this.user?.firstName?.charAt(0) ?? '';
//   const lastInitial = this.user?.lastName?.charAt(0) ?? '';
//   return `${firstInitial}${lastInitial}`.toUpperCase();
// }

// // Helper method to get the image URL
// getImageUrl(): string | null {
//   const image = this.user?.profilePicture || this.user?.faceImage;
//   return image ? `http://localhost:5001${image}` : null;
// }

// Handle image load error
handleImageError(): void {
  this.showImage = false; // Fall back to initials if image fails
}
}
