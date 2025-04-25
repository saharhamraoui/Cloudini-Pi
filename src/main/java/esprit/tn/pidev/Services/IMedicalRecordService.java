package esprit.tn.pidev.Services;


import esprit.tn.pidev.entities.MedicalRecord;

import java.util.List;

public interface IMedicalRecordService {

    MedicalRecord addMedicalRecord(MedicalRecord medicalRecord);
    MedicalRecord updateMedicalRecord(MedicalRecord medicalRecord);
    void deleteMedicalRecord(long idMedicalRecord);
    List<MedicalRecord> getMedicalRecords();
    MedicalRecord getMedcialRecordById(long idMedicalRecord);
    List<MedicalRecord> getMedicalRecordsByPatientId(Long patientId);
    List<MedicalRecord> getMedicalRecordsByDoctorId(Long doctorId);
    public List<MedicalRecord> getByPatientEmail(String email) ;

}
