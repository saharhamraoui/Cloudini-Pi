package esprit.tn.pidev.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPrescription;

    @ManyToOne
    @JoinColumn(name = "medical_record_id")
    private MedicalRecord medicalRecord;

    private String medication;
    private String dosage;
    private String instructions;
    private LocalDate issueDate;
    @Enumerated(EnumType.STRING)
    private PrescriptionStatus status;

    // Constructors
    public Prescription() {}

    public Prescription(MedicalRecord medicalRecord, String medication, String dosage, String instructions, LocalDate issueDate) {
        this.medicalRecord = medicalRecord;
        this.medication = medication;
        this.dosage = dosage;
        this.instructions = instructions;
        this.issueDate = issueDate;
    }

    // Getters and Setters
    public Long getId() { return idPrescription; }

    public void setId(Long id) { this.idPrescription = id; }

    public MedicalRecord getMedicalRecord() { return medicalRecord; }

    public void setMedicalRecord(MedicalRecord medicalRecord) { this.medicalRecord = medicalRecord; }

    public String getMedication() { return medication; }

    public void setMedication(String medication) { this.medication = medication; }

    public String getDosage() { return dosage; }

    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getInstructions() { return instructions; }

    public void setInstructions(String instructions) { this.instructions = instructions; }

    public LocalDate getIssueDate() { return issueDate; }

    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
}
