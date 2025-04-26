package tn.esprit.pi.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.Consultation;
import tn.esprit.pi.entities.RendezVous;

@Repository
public interface ConsultationRepository  extends JpaRepository<Consultation, Long>  {
}
