package tn.esprit.pi.entities;


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
    Time timeRendezVous;

    @ManyToOne
    Patient patient ;

    @ManyToOne
    Medecin medecin ;

    @OneToOne (mappedBy = "rendezVous")
    Consultation consultation ;



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

    public Time getTimeRendezVous() {
        return timeRendezVous;
    }

    public void setTimeRendezVous(Time timeDate) {
        this.timeRendezVous = timeDate;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}
