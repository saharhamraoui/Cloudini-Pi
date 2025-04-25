package esprit.tn.saharpi.Services;

import esprit.tn.saharpi.Repositories.MedicalRecordRepository;
import esprit.tn.saharpi.entities.MedicalRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalRecordService implements IMedicalRecordService{

    @Autowired
    MedicalRecordRepository medicalRecordRepository;

    @Override
    public MedicalRecord addMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    @Override
    public MedicalRecord updateMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    @Override
    public void deleteMedicalRecord(long idMedicalRecord) {
         medicalRecordRepository.deleteById(idMedicalRecord);
    }

    @Override
    public List<MedicalRecord> getMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    @Override
    public MedicalRecord getMedcialRecordById(long idMedicalRecord) {
        return medicalRecordRepository.findById(idMedicalRecord).get();
    }
}
