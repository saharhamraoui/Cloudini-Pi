package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedecinRepository extends JpaRepository<Medecin, Long> {
}