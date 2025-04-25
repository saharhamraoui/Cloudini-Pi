package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    @Query("SELECT m FROM MedicalRecord m WHERE m.doctor.idUser = :doctorId")
    List<MedicalRecord> findByDoctorIdUser(@Param("doctorId") Long doctorId);

    @Query("SELECT m FROM MedicalRecord m WHERE m.patient.idUser = :patientId")
    List<MedicalRecord> findByPatientIdUser(@Param("patientId") Long patientId);

    @Query("SELECT m FROM MedicalRecord m WHERE m.patient.email = :email")
    List<MedicalRecord> findByPatientEmail(@Param("email") String email);

}
