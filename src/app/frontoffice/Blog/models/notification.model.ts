
import { User } from "./user.model";

export interface Notification {
  id: number;
  message: string;
  seen: boolean;
  createdAt: Date;  // Utilisé en tant que string (format ISO 8601)
  recipient: User;    // Assurez-vous d'avoir un modèle User défini
}
