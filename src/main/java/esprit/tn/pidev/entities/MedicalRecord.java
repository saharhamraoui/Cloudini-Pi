package esprit.tn.pidev.entities;

import jakarta.persistence.*;
import esprit.tn.pidev.entities.*;
import java.util.Date;
import java.util.List;

@Entity
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMedicalRecord;

    @OneToOne
    @JoinColumn(name = "patientId", referencedColumnName = "idUser")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctorId", referencedColumnName = "idUser")
    private Medecin doctor;

    @Column(nullable = false, updatable = false)
    private Date createdAt;

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

    public MedicalRecord(Patient patient, Medecin doctor, String diagnosis, String notes) {
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

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Medecin getDoctor() {
        return doctor;
    }

    public void setDoctor(Medecin doctor) {
        this.doctor = doctor;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
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

