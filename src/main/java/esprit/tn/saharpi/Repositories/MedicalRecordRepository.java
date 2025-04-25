package esprit.tn.saharpi.Repositories;

import esprit.tn.saharpi.entities.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
}
