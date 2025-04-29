package tn.esprit.pi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.Consultation;

@Repository
public interface ConsultationRepository  extends JpaRepository<Consultation, Long>  {
}
