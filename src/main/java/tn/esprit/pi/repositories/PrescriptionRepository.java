package tn.esprit.pi.repositories;

import tn.esprit.pi.entities.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findPrescriptionByMedication(String medications);
    List<Prescription> findPrescriptionByMedicalRecordIdMedicalRecord(Long idMedicalRecord);
}
