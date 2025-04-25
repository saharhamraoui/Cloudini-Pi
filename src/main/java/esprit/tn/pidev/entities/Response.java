package esprit.tn.pidev.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idResponse;

    private String message;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "reclamation_id")
    private Reclamation reclamation;




}

