package esprit.tn.pidev.Services;

import esprit.tn.pidev.Repositories.MedicalRecordRepository;
import esprit.tn.pidev.entities.MedicalRecord;
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
    public List<MedicalRecord> getMedicalRecordsByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientIdUser(patientId);
    }

    @Override
    public List<MedicalRecord> getMedicalRecordsByDoctorId(Long doctorId) {
        return medicalRecordRepository.findByDoctorIdUser(doctorId);
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

    @Override
    public List<MedicalRecord> getByPatientEmail(String email) {
        return medicalRecordRepository.findByPatientEmail(email);
    }
}
