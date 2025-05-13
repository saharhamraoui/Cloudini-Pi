
import { MedicalRecord } from "./MedicalRecord";
import { PrescriptionStatus } from "./PrescriptionStatus";

export class Prescription {
    idPrescription?: number;
    medicalRecord?: MedicalRecord;
    medication!: string;
    dosage!: string;
    instructions!: string;
    issueDate!: string;
    status!: PrescriptionStatus;

    constructor(medicalRecord: MedicalRecord, medication: string, dosage: string, instructions: string, issueDate: string) {
        this.medicalRecord = medicalRecord;
        this.medication = medication;
        this.dosage = dosage;
        this.instructions = instructions;
        this.issueDate = issueDate;
    }
}
