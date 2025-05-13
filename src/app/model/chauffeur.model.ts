import { User } from './user.model';

export interface Chauffeur extends User {
  driverLicenseNumber: string;
  driverAvailability: string;
  dateOfBirth: Date;

  
}