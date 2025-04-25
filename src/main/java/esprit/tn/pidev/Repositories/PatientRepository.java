package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}