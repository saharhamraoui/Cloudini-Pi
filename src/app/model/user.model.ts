export interface User {
    idUser?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    role: Role;
    photoUrl?: string;
    
  }
  
  export interface UserCreateDTO extends Omit<User, 'idUser'> {}

export enum Role {
  ADMIN = 'ADMIN',
  PATIENT = 'PATIENT',
  MEDECIN = 'MEDECIN',
  CHAUFFEUR = 'CHAUFFEUR'
}