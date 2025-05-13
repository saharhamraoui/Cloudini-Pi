import { Role } from "./role.enum";

export interface User {
  idUser: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;  // ? car on ne devrait pas l'exposer partout
  phoneNumber: string;
  address: string;
  role: Role;
}
