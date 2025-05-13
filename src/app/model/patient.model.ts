import { User } from './user.model';

export interface Patient extends User {
  medicalRecordNumber: string;
  bloodGroup: string;
  healthInsuranceNumber: string;
  gender: string;
  dateOfBirth: Date;
  
}
