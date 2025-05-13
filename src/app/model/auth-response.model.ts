import { Role } from './user.model'; 

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  role: Role;
  idUser: number;
  verified: boolean;
}