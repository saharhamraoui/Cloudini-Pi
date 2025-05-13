import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  editForm: FormGroup;
  user: any;
  roles = Object.values(Role);
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      idUser: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: [''],
      role: ['', Validators.required],
      banned: [false],
      medicalRecordNumber: [''],
      bloodGroup: [''],
      healthInsuranceNumber: [''],
      gender: ['M'],
      dateOfBirth: [''],
      speciality: [''],
      licenseNumber: [''],
      availability: ['AVAILABLE'],
      driverLicenseNumber: [''],
      driverAvailability: ['AVAILABLE']
    });
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('userToEdit');
    if (userData) {
      this.user = JSON.parse(userData);
      this.loadUserData();
    }
  }

  loadUserData(): void {
    this.isLoading = true;
    this.userService.getUser(this.user.idUser).subscribe({
      next: (fullUserData: any) => {
        this.user = fullUserData;
        this.initForm();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  initForm(): void {
    this.editForm.patchValue({
      idUser: this.user.idUser,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
      address: this.user.address,
      role: this.user.role,
      banned: this.user.banned || false,
      ...this.getRoleSpecificValues()
    });
  }

  private getRoleSpecificValues(): any {
    const values: any = {};
    switch(this.user.role) {
      case Role.PATIENT:
        values.medicalRecordNumber = this.user.medicalRecordNumber || '';
        values.bloodGroup = this.user.bloodGroup || '';
        values.healthInsuranceNumber = this.user.healthInsuranceNumber || '';
        values.gender = this.user.gender || 'M';
        values.dateOfBirth = this.user.dateOfBirth ? 
          new Date(this.user.dateOfBirth).toISOString().substring(0, 10) : '';
        break;
      case Role.MEDECIN:
        values.speciality = this.user.speciality || '';
        values.licenseNumber = this.user.licenseNumber || '';
        values.availability = this.user.availability || 'AVAILABLE';
        break;
      case Role.CHAUFFEUR:
        values.driverLicenseNumber = this.user.driverLicenseNumber || '';
        values.driverAvailability = this.user.driverAvailability || 'AVAILABLE';
        break;
    }
    return values;
  }

  onSubmit(): void {
    if (this.editForm.valid) {
        this.isLoading = true;
        const formData = this.prepareFormData();

        let updateCall: Observable<any>;
        switch(formData.role) {
            case Role.PATIENT:
                updateCall = this.userService.updatePatient(formData);
                break;
            case Role.MEDECIN:
                updateCall = this.userService.updateMedecin(formData);
                break;
            case Role.CHAUFFEUR:
                updateCall = this.userService.updateChauffeur(formData);
                break;
            default:
                updateCall = this.userService.updateUser(formData);
        }

        updateCall.subscribe({
            next: () => {
                this.isLoading = false;
                localStorage.removeItem('userToEdit');
                this.router.navigate(['/admin/dashboard']);
            },
            error: (err: any) => {
                this.isLoading = false;
                console.error('Full error:', err);
                console.error('Request payload:', formData);
                alert('Erreur lors de la mise à jour. Vérifiez la console pour plus de détails.');
            }
        });
    }
}

  private prepareFormData(): any {
    const formData = {
        idUser: this.editForm.get('idUser')?.value,
        firstName: this.editForm.get('firstName')?.value,
        lastName: this.editForm.get('lastName')?.value,
        email: this.editForm.get('email')?.value,
        phoneNumber: this.editForm.get('phoneNumber')?.value,
        address: this.editForm.get('address')?.value,
        banned: this.editForm.get('banned')?.value,
        role: this.editForm.get('role')?.value
    };

    switch(formData.role) {
        case Role.PATIENT:
            return {
                ...formData,
                medicalRecordNumber: this.editForm.get('medicalRecordNumber')?.value,
                bloodGroup: this.editForm.get('bloodGroup')?.value,
                healthInsuranceNumber: this.editForm.get('healthInsuranceNumber')?.value,
                gender: this.editForm.get('gender')?.value,
                dateOfBirth: this.editForm.get('dateOfBirth')?.value
            };
        case Role.MEDECIN:
            return {
                ...formData,
                speciality: this.editForm.get('speciality')?.value,
                licenseNumber: this.editForm.get('licenseNumber')?.value,
                availability: this.editForm.get('availability')?.value
            };
        case Role.CHAUFFEUR:
            return {
                ...formData,
                driverLicenseNumber: this.editForm.get('driverLicenseNumber')?.value,
                driverAvailability: this.editForm.get('driverAvailability')?.value
            };
        default:
            return formData;
    }
}
  cancel(): void {
    localStorage.removeItem('userToEdit');
    this.router.navigate(['/admin/dashboard']);
  }
}