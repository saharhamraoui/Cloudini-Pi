import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { lastValueFrom, Observable, of, throwError } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/userService/auth.service';
import { FaceAuthService } from 'src/app/services/userService/face-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('faceRegistrationVideo') faceRegistrationVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('descriptionFileInput') descriptionFileInput!: ElementRef<HTMLInputElement>;

  registerForm: FormGroup;
  role: string | null = null;
  isPatient: boolean = false;
  isMedecin: boolean = false;
  isChauffeur: boolean = false;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  selectedFile: File | null = null;
  previewPhoto: string | ArrayBuffer | null = null;
  showFaceRegistration = false;
  videoStream: MediaStream | null = null;
  faceRegistrationSuccess = false;
  isCameraLoading: boolean = false;
  keywords: string = ''; 
  generatedDescription: string = '';
  uploadedDescription: string | null = null;
  descriptionFile: File | null = null; // Add this property
  descriptionGenerated: boolean = false; // Add this property
  descriptionEdited: boolean = false; // Add this property

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private faceAuthService: FaceAuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      address: ['', Validators.required],
      keywords: [''],
      description: [''], // New form control for generated description
      photoUrl: [''],
    }, { validators: this.passwordMatchValidator.bind(this) });
  }

  async startCamera() {
    this.isCameraLoading = true;
    this.errorMessage = null;

    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      if (this.faceRegistrationVideo?.nativeElement) {
        this.faceRegistrationVideo.nativeElement.srcObject = this.videoStream;
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error('Camera took too long to start'));
          }, 5000);

          this.faceRegistrationVideo.nativeElement.onplaying = () => {
            clearTimeout(timer);
            resolve();
          };
        });
      } else {
        throw new Error('Camera element not available');
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Could not access camera';
      console.error('Camera error:', error);
      throw error;
    } finally {
      this.isCameraLoading = false;
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    this.role = this.route.snapshot.paramMap.get('role');
    this.initForm();
  }

  selectRole(role: string): void {
    this.router.navigate(['/register', role]);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewPhoto = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  changePhoto(): void {
    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    fileInput.click();
  }

  public initForm(): void {
    if (!this.role) {
      this.router.navigate(['/role-selection']);
      return;
    }

    switch (this.role.toLowerCase()) {
      case 'patient':
        this.isPatient = true;
        this.addPatientControls();
        break;
      case 'medecin':
        this.isMedecin = true;
        this.addMedecinControls();
        break;
      case 'chauffeur':
        this.isChauffeur = true;
        this.addChauffeurControls();
        break;
      default:
        this.router.navigate(['/role-selection']);
        break;
    }
  }

  private addPatientControls(): void {
    this.registerForm.addControl('bloodGroup', this.fb.control('', Validators.required));
    this.registerForm.addControl('gender', this.fb.control('', Validators.required));
    this.registerForm.addControl('dateOfBirth', this.fb.control('', Validators.required));
  }

  private addMedecinControls(): void {
    this.registerForm.addControl('speciality', this.fb.control('', Validators.required));
    this.registerForm.addControl('licenseNumber', this.fb.control('', Validators.required));
    this.registerForm.addControl('availability', this.fb.control('', Validators.required));
    this.registerForm.addControl('dateOfBirth', this.fb.control('', Validators.required));
  }

  private addChauffeurControls(): void {
    this.registerForm.addControl('driverLicenseNumber', this.fb.control('', Validators.required));
    this.registerForm.addControl('driverAvailability', this.fb.control('', Validators.required));
    this.registerForm.addControl('dateOfBirth', this.fb.control('', Validators.required));
  }

  showPassword = false;
  showConfirmPassword = false;

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async handleFaceRegistration(): Promise<void> {
    try {
      if (!this.faceRegistrationVideo?.nativeElement) {
        throw new Error('Camera not initialized. Please start the camera first.');
      }

      const video = this.faceRegistrationVideo.nativeElement;
      await this.waitForVideoReady(video);

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const detection = await this.faceAuthService.detectFace(canvas);
      if (!detection) throw new Error('No face detected. Please ensure your face is clearly visible.');

      const descriptor = Array.from(detection.descriptor as Float32Array);
      await this.authService.registerFaceTemporarily(this.registerForm.value.email, descriptor).toPromise();

      this.faceRegistrationSuccess = true;
    } catch (error) {
      console.error('Face registration error:', error);
      this.errorMessage = error instanceof Error ? error.message : 'Face registration failed';
      throw error;
    }
  }

  private waitForVideoReady(video: HTMLVideoElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = 5000;
      const startTime = Date.now();

      const checkReady = () => {
        if (video.readyState >= video.HAVE_ENOUGH_DATA) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Camera took too long to initialize'));
        } else {
          setTimeout(checkReady, 100);
        }
      };

      checkReady();
    });
  }

  private handleRegistrationError(err: any): Observable<never> {
    console.error('Registration error:', err);
    if (err.message.includes('déjà utilisé')) {
      this.errorMessage = err.message;
    } else {
      this.errorMessage = err.error?.message || err.message || 'Erreur lors de l\'inscription';
    }
    this.isLoading = false;
    return throwError(() => err);
  }

  toggleRegistrationMode() {
    this.showFaceRegistration = !this.showFaceRegistration;
    this.errorMessage = '';
  }

  async onDescriptionFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
        this.descriptionFile = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            let text = reader.result as string;
            text = text.replace(/[\n\r\t"]/g, ' '); // Replace newlines, tabs, and quotes with spaces
            this.registerForm.patchValue({ description: text.trim() });
            this.descriptionGenerated = true;
            this.descriptionEdited = true;
        };
        reader.onerror = () => {
            this.errorMessage = "Erreur lors de la lecture du fichier de description.";
        };
        reader.readAsText(this.descriptionFile);
    }
}

  async onSubmit(): Promise<void> {
    if (this.registerForm.hasError('mismatch')) {
      this.errorMessage = "Passwords don't match";
      return;
    }
    if (this.registerForm.invalid || !this.role || this.isLoading) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;

    try {
      if (this.showFaceRegistration) {
        await this.handleFaceRegistration();
      }

      // Log the form value to debug
      console.log('Form value before submission:', this.registerForm.value);

      const registration$ = this.selectedFile
        ? this.authService.uploadPhoto(this.selectedFile).pipe(
            switchMap(photoUrl => {
              this.registerForm.patchValue({ photoUrl });
              return this.completeRegistration();
            })
          )
        : this.completeRegistration();

      await registration$.toPromise();
      this.router.navigate(['/verify-email'], { 
        queryParams: { email: this.registerForm.value.email } 
      });
    } catch (error) {
      console.error('Registration error:', error);
      this.handleRegistrationError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private completeRegistration(): Observable<any> {
    const formValue = this.registerForm.value;
    const payload = {
      ...formValue,
      description: formValue.description || '',
    };

    // Log the payload to debug
    console.log('Registration payload:', payload);

    let registration$: Observable<any>;

    switch (this.role?.toLowerCase()) {
      case 'patient':
        registration$ = this.authService.registerPatient({
          ...payload,
          medicalRecordNumber: formValue.medicalRecordNumber,
          bloodGroup: formValue.bloodGroup,
          healthInsuranceNumber: formValue.healthInsuranceNumber,
          gender: formValue.gender,
          dateOfBirth: formValue.dateOfBirth,
        });
        break;
      case 'medecin':
        registration$ = this.authService.registerMedecin({
          ...payload,
          speciality: formValue.speciality,
          licenseNumber: formValue.licenseNumber,
          availability: formValue.availability,
          dateOfBirth: formValue.dateOfBirth,
        });
        break;
      case 'chauffeur':
        registration$ = this.authService.registerChauffeur({
          ...payload,
          driverLicenseNumber: formValue.driverLicenseNumber,
          driverAvailability: formValue.driverAvailability,
          dateOfBirth: formValue.dateOfBirth,
        });
        break;
      default:
        return of(null);
    }

    return registration$.pipe(finalize(() => (this.isLoading = false)));
  }

  private handleError(err: any): void {
    console.error('Registration error:', err);
    this.errorMessage = err.error?.message || err.message || 'Erreur lors de l\'inscription';
    this.isLoading = false;
  }
 
  // Méthode pour lire le contenu du fichier
  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      
      reader.readAsText(file);
    });
  }
  
  // Méthode pour vider le fichier
  clearDescriptionFile() {
    this.uploadedDescription = null;
    this.registerForm.patchValue({ description: '' });
    this.descriptionFileInput.nativeElement.value = '';
    this.descriptionFile = null; // Reset the descriptionFile property
    this.descriptionGenerated = false;
    this.descriptionEdited = false;
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.previewPhoto = 'assets/profile.png';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get passwordMismatch(): boolean {
    return this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value;
  }

  async generateDescription(): Promise<void> {
    const keywords = this.registerForm.get('keywords')?.value;
    if (!keywords || !this.role) {
      this.errorMessage = 'Please provide keywords and select a role.';
      return;
    }

    this.isLoading = true;
    try {
      const response = await lastValueFrom(this.authService.generateDescription(keywords, this.role.toLowerCase()));
      this.generatedDescription = response.description;
      this.registerForm.patchValue({ description: this.generatedDescription });
      this.descriptionGenerated = true; // Update the flag
      this.descriptionEdited = false; // Reset the edited flag
    } catch (error) {
      this.errorMessage = 'Failed to generate description. Please try again.';
      console.error('Description generation error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  downloadDescription(): void {
    if (!this.generatedDescription) {
      this.errorMessage = 'No description available to download.';
      return;
    }

    this.isLoading = true;
    this.authService.downloadDescription(this.generatedDescription).subscribe({
      next: (blob) => {
        saveAs(blob, 'profile_description.txt');
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to download description. Please try again.';
        console.error('Download error:', error);
        this.isLoading = false;
      }
    });
  }
}