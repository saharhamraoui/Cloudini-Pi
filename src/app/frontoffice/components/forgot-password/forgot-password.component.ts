import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/userService/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  message: string = '';
  isSuccess: boolean = false;
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (this.email.invalid || this.isLoading) {
      return;
    }
  
    this.isLoading = true;
    this.message = "";
    
    this.authService.requestPasswordReset(this.email.value!)
      .subscribe({
        next: () => {
          this.message = "Si cet email est enregistré, un lien a été envoyé";
          this.isSuccess = true;
          this.isLoading = false;
        },
        error: (error) => {
          this.message = error.message || "Erreur lors de la demande";
          this.isSuccess = false;
          this.isLoading = false;
        }
      });
  }
}