import { RendezVous } from "./RendezVous";
import { User } from "./User";


export class Patient extends User {
    medicalRecordNumber!: string;
    bloodGroup!: string;
    healthInsuranceNumber!: string;
    gender!: string;
    dateOfBirth!: string;
    rendezVous: RendezVous[] = [];
    }