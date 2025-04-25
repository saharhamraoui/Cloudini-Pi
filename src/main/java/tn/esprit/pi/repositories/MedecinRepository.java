package tn.esprit.pi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.pi.entities.Medecin;

public interface MedecinRepository extends JpaRepository<Medecin, Long> {
}