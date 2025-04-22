package tn.esprit.pi.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.pi.entities.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
