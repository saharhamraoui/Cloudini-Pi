package tn.esprit.pi.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@JsonIgnoreProperties("consultation")


public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMedicalRecord;

    @OneToOne
    @JoinColumn(name = "patientId", referencedColumnName = "idUser")
    private Patient patient;

    @OneToMany (mappedBy = "medicalRecord")
    @JsonIgnore
   List< Consultation >consultation = new ArrayList<>() ;


    @ManyToOne
    @JoinColumn(name = "doctorId", referencedColumnName = "idUser")
    private Medecin doctor;

    @Column(nullable = false, updatable = false)
    private Date createdAt;

    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL)
   private List<Prescription> prescriptions;


    private String diagnosis;
    private String notes;

    // Constructors
    public MedicalRecord() {}

    public MedicalRecord(Patient patient, Medecin doctor, String diagnosis, String notes) {
        this.patient = patient;
        this.doctor = doctor;
        this.diagnosis = diagnosis;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getIdMedicalRecord() { return idMedicalRecord; }

    public User getPatient() { return patient; }

    public User getDoctor() { return doctor; }

    public List<Prescription> getPrescriptions() { return prescriptions; }

    public String getDiagnosis() { return diagnosis; }

    public String getNotes() { return notes; }

    public void setIdMedicalRecord(Long idMedicalRecord) {
        this.idMedicalRecord = idMedicalRecord;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public List<Consultation> getConsultation() {
        return consultation;
    }

    public void setConsultation(List<Consultation> consultation) {
        this.consultation = consultation;
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

    public void setPrescriptions(List<Prescription> prescriptions) {
        this.prescriptions = prescriptions;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}