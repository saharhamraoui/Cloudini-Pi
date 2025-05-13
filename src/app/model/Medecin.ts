import { RendezVous } from "./RendezVous";
import { User } from "./User";


export class Medecin extends User {
    speciality!: string;
    licenseNumber!: string;
    availability: Date[] = [];
    rendezVous: RendezVous[] = [];
    }