package tn.esprit.pi.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.MedicalRecord;
import tn.esprit.pi.entities.RendezVous;

@Repository

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
}
