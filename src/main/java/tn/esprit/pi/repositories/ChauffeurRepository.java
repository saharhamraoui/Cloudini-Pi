package tn.esprit.pi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.pi.entities.Chauffeur;

public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {
}