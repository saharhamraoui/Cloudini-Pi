package esprit.tn.pidev.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;


import java.sql.Time;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Timer;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RendezVous {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long idRendezVous;
    Date dateRendezVous;

    @ManyToOne
    Patient patient ;

    @ManyToOne
    Medecin medecin ;

    @OneToOne (mappedBy = "rendezVous")
    @JsonIgnore
    Consultation consultation ;

    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public Consultation getConsultation() {
        return consultation;
    }

    public void setConsultation(Consultation consultation) {
        this.consultation = consultation;
    }

    public long getIdRendezVous() {
        return idRendezVous;
    }

    public void setIdRendezVous(long idRendezVous) {
        this.idRendezVous = idRendezVous;
    }

    public Date getDateRendezVous() {
        return dateRendezVous;
    }

    public void setDateRendezVous(Date dateDate) {
        this.dateRendezVous = dateDate;
    }





    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}