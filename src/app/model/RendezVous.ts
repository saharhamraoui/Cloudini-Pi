import { Patient } from "./Patient";
import { Medecin } from "./Medecin";
import { Consultation } from "./Consultation";

export class RendezVous {
    idRendezVous?: number;
    dateRendezVous!: Date;
    medecin: { idUser: number };  // Accepte seulement l'ID
    patient: { idUser: number }; // Lien vers un patient
    status?: string;

    typeRendezVous?: string;
   // consultation!: Consultation; // Lien vers une consultation

   constructor(dateRendezVous: Date, medecin: Medecin, patient: Patient) {
    this.dateRendezVous = dateRendezVous;
    this.medecin = medecin;
    this.patient = patient;
  }
}
