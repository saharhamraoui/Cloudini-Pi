package tn.esprit.pi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.Reclamation;
@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
}
