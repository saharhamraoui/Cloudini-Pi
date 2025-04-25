package esprit.tn.saharpi.entities;

import jakarta.persistence.*;
import lombok.Setter;

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

}

