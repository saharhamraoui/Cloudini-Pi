import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/userService/auth.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  message: string = '';
  isSuccess: boolean = false;
  isLoading: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.handleError("Token invalide ou manquant");
    }
  }

  private handleError(message: string): void {
    this.message = message;
    this.isSuccess = false;
    this.isLoading = false;
  }
  checkPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }
  onSubmit(): void {
    if (!this.token || this.resetForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    
    this.authService.resetPassword(this.token, this.resetForm.value.password)
      .subscribe({
        next: () => {
          this.message = "Mot de passe réinitialisé avec succès!";
          this.isSuccess = true;
          this.isLoading = false;
          this.resetForm.reset();
        },
        error: (error) => {
          this.message = error.error?.message || "Erreur lors de la réinitialisation";
          this.isSuccess = false;
          this.isLoading = false;
        }
      });
  }
}