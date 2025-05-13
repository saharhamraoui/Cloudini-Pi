import { User } from './user.model';

export interface Medecin extends User {
  speciality: string;
  licenseNumber: string;
  availability: string;
  dateOfBirth: Date;

  
}