import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'; // Ajout de l'import Observable
import { AuthService } from 'src/app/services/userService/auth.service';
import { UserService } from 'src/app/services/userService/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  editForm: FormGroup;
  user: any = {};
  userType: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    const userData = this.authService.currentUserValue;
    if (userData && userData.idUser) {
      this.user = userData;
      this.userType = this.user.role;
      this.loadUserData();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUserData(): void {
    this.userService.getUser(this.user.idUser).subscribe({
      next: (fullUserData: any) => { // Typage explicite
        this.user = fullUserData;
        this.initForm();
      },
      error: (err: any) => { // Typage explicite
        console.error('Erreur:', err);
        Swal.fire('Erreur', 'Impossible de charger les données du profil', 'error');
        this.router.navigate(['/profile']);
      }
    });
  }

  initForm(): void {
    this.editForm.patchValue({
      firstName: this.user.firstName || '',
      lastName: this.user.lastName || '',
      email: this.user.email || '',
      phoneNumber: this.user.phoneNumber || '',
      address: this.user.address || ''
    });

    this.addSpecificControls();
  }

  addSpecificControls(): void {
    this.removeSpecificControls();

    switch(this.userType) {
      case 'PATIENT':
        this.editForm.addControl('medicalRecordNumber', 
          this.fb.control(this.user.medicalRecordNumber || ''));
        this.editForm.addControl('bloodGroup', 
          this.fb.control(this.user.bloodGroup || ''));
        this.editForm.addControl('healthInsuranceNumber', 
          this.fb.control(this.user.healthInsuranceNumber || ''));
        this.editForm.addControl('gender', 
          this.fb.control(this.user.gender || ''));
        this.editForm.addControl('dateOfBirth', 
          this.fb.control(this.formatDate(this.user.dateOfBirth)));
        break;

      case 'MEDECIN':
        this.editForm.addControl('speciality', 
          this.fb.control(this.user.speciality || ''));
        this.editForm.addControl('licenseNumber', 
          this.fb.control(this.user.licenseNumber || ''));
        this.editForm.addControl('availability', 
          this.fb.control(this.user.availability || ''));
        break;

      case 'CHAUFFEUR':
        this.editForm.addControl('driverLicenseNumber', 
          this.fb.control(this.user.driverLicenseNumber || ''));
        this.editForm.addControl('driverAvailability', 
          this.fb.control(this.user.driverAvailability || ''));
        break;
    }
  }

  removeSpecificControls(): void {
    const specificControls = [
      'medicalRecordNumber', 'bloodGroup', 'healthInsuranceNumber', 'gender', 'dateOfBirth',
      'speciality', 'licenseNumber', 'availability',
      'driverLicenseNumber', 'driverAvailability'
    ];

    specificControls.forEach(control => {
      if (this.editForm.get(control)) {
        this.editForm.removeControl(control);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedData = this.prepareUpdateData();
      const emailChanged = this.editForm.value.email !== this.user.email;
  
      let updateCall: Observable<any>;
  
      switch(this.userType) {
        case 'PATIENT':
          updateCall = this.userService.updatePatient(updatedData);
          break;
        case 'MEDECIN':
          updateCall = this.userService.updateMedecin(updatedData);
          break;
        case 'CHAUFFEUR':
          updateCall = this.userService.updateChauffeur(updatedData);
          break;
        default:
          updateCall = this.userService.updateUser(updatedData);
      }
  
      updateCall.subscribe({
        next: (updatedUser: any) => { // Typage explicite
          const authData = {
            ...this.user,
            ...updatedUser,
            token: localStorage.getItem('token')
          };
          localStorage.setItem('authData', JSON.stringify(authData));
          
          Swal.fire('Succès!', 'Profil mis à jour avec succès', 'success');
          
          if (emailChanged) {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/profile']);
          }
        },
        error: (err: any) => { // Typage explicite
          console.error('Erreur:', err);
          Swal.fire('Erreur', err.error?.message || 'Échec de la mise à jour', 'error');
        }
      });
    }
  }
  
  prepareUpdateData(): any {
    const formValue = this.editForm.value;
    const baseData = {
      idUser: this.user.idUser,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      address: formValue.address
    };
  
    if (this.userType === 'PATIENT') {
      return {
        ...baseData,
        medicalRecordNumber: formValue.medicalRecordNumber,
        bloodGroup: formValue.bloodGroup,
        healthInsuranceNumber: formValue.healthInsuranceNumber,
        gender: formValue.gender,
        dateOfBirth: formValue.dateOfBirth
      };
    } else if (this.userType === 'MEDECIN') {
      return {
        ...baseData,
        speciality: formValue.speciality,
        licenseNumber: formValue.licenseNumber,
        availability: formValue.availability
      };
    } else if (this.userType === 'CHAUFFEUR') {
      return {
        ...baseData,
        driverLicenseNumber: formValue.driverLicenseNumber,
        driverAvailability: formValue.driverAvailability
      };
    }
    
    return baseData;
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}