package esprit.tn.saharpi.Services;

import esprit.tn.saharpi.entities.MedicalRecord;

import java.util.List;

public interface IMedicalRecordService {

    MedicalRecord addMedicalRecord(MedicalRecord medicalRecord);
    MedicalRecord updateMedicalRecord(MedicalRecord medicalRecord);
    void deleteMedicalRecord(long idMedicalRecord);
    List<MedicalRecord> getMedicalRecords();
    MedicalRecord getMedcialRecordById(long idMedicalRecord);
}
