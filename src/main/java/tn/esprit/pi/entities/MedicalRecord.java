package tn.esprit.pi.entities;

import esprit.tn.pidev.entities.Medecin;
import esprit.tn.pidev.entities.Patient;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMedicalRecord;

    @OneToOne
    @JoinColumn(name = "patientId", referencedColumnName = "idUser")
    private esprit.tn.pidev.entities.Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctorId", referencedColumnName = "idUser")
    private esprit.tn.pidev.entities.Medecin doctor;

    @Column(nullable = false, updatable = false)
    private LocalDate createdAt;


    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDate.now(); // Assign system date when saving
    }

    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL)
    private List<Prescription> prescriptions;

    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL)
    private List<Consultation> consultations;

    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL)
    private List<Bilan> bilans;

    private String diagnosis;
    private String notes;
    private String allergies;
    // Constructors
    public MedicalRecord() {}

    public MedicalRecord(esprit.tn.pidev.entities.Patient patient, esprit.tn.pidev.entities.Medecin doctor, String diagnosis, String notes) {
        this.patient = patient;
        this.doctor = doctor;
        this.diagnosis = diagnosis;
        this.notes = notes;
    }

    public Long getIdMedicalRecord() {
        return idMedicalRecord;
    }

    public void setIdMedicalRecord(Long idMedicalRecord) {
        this.idMedicalRecord = idMedicalRecord;
    }

    public esprit.tn.pidev.entities.Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public esprit.tn.pidev.entities.Medecin getDoctor() {
        return doctor;
    }

    public void setDoctor(Medecin doctor) {
        this.doctor = doctor;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public List<Prescription> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(List<Prescription> prescriptions) {
        this.prescriptions = prescriptions;
    }

    public List<Consultation> getConsultations() {
        return consultations;
    }

    public void setConsultations(List<Consultation> consultations) {
        this.consultations = consultations;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }
}

