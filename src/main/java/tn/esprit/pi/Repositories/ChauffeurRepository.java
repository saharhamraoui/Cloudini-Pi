package tn.esprit.pi.Repositories;

import tn.esprit.pi.entities.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {
}
