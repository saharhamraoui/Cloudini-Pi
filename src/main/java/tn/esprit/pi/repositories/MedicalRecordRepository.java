package tn.esprit.pi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.MedicalRecord;
import tn.esprit.pi.entities.RendezVous;

import java.util.List;

@Repository

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    @Query("SELECT m FROM MedicalRecord m WHERE m.doctor.idUser = :doctorId")
    List<MedicalRecord> findByDoctorIdUser(@Param("doctorId") Long doctorId);

    @Query("SELECT m FROM MedicalRecord m WHERE m.patient.idUser = :patientId")
    List<MedicalRecord> findByPatientIdUser(@Param("patientId") Long patientId);

    @Query("SELECT m FROM MedicalRecord m WHERE m.patient.email = :email")
    List<MedicalRecord> findByPatientEmail(@Param("email") String email);
}
