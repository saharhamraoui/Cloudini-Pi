package esprit.tn.saharpi.Repositories;

import esprit.tn.saharpi.entities.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
}
