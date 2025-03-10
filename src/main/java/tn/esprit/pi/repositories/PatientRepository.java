package tn.esprit.pi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.pi.entities.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}