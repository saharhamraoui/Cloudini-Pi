import { MedicalRecord } from "./MedicalRecord";
import { Prescription } from "./Prescription";
import { RendezVous } from "./RendezVous";

export class Consultation {
    idConsultation?: number;
    dateConsultation!: Date;
    rapport!: string;
    rendezVous!: RendezVous; // Lien vers un rendez-vous
    medicalRecord!: MedicalRecord; // Lien vers une prescription

    constructor(dateConsultation: Date, rapport: string, rendezVous: RendezVous, medicalRecord :MedicalRecord ) {
        this.dateConsultation = dateConsultation;
        this.rapport = rapport;
        this.rendezVous = rendezVous;
        this.medicalRecord = medicalRecord;
    }
}
