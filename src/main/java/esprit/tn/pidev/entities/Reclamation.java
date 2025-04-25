package esprit.tn.pidev.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class Reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date date;
    private String description;

    @Enumerated(EnumType.STRING)
    private StatutReclamation status;

   // @ManyToOne
   // @JoinColumn(name = "patient_id")
   // private Utilisateur patient;

   // @ManyToOne
    //@JoinColumn(name = "ambulance_id")
   // private Ambulance ambulance;



}

