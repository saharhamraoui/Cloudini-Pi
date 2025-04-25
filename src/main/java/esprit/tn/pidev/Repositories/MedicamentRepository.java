package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.Medicament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface MedicamentRepository extends JpaRepository<Medicament,Long> {
}

