package tn.esprit.pi.repositories;

import tn.esprit.pi.entities.Bilan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BilanRepository extends JpaRepository<Bilan, Long> {
    List<Bilan> findByMedicalRecordIdMedicalRecord(Long medicalRecordId);

}
