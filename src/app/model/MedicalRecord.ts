import { Bilan } from "./Bilan";
import { Consultation } from "./Consultation";
import { Medecin } from "./Medecin";
import { Patient } from "./Patient";
import { Prescription } from "./Prescription";

export class MedicalRecord {
    idMedicalRecord?: number;
    patient!: Patient;
    doctor!: Medecin;
    createdAt?: string;
    prescriptions?: Prescription[];
    consultations?: Consultation[];
    bilans?: Bilan[];
    diagnosis?: string;
    notes?: string;
    allergies?: string;

    
    constructor(patient: Patient, doctor: Medecin, diagnosis: string, notes: string) {
        this.patient = patient;
        this.doctor = doctor;
        this.diagnosis = diagnosis;
        this.notes = notes;
    }
}
