package tn.esprit.pi.controllers;

import tn.esprit.pi.services.IMedicalRecordService;
import tn.esprit.pi.entities.MedicalRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://192.168.1.122:32584") // add this above your controller
@RestController
@RequestMapping("/medicalRecord")
public class MedicalRecordController {

    @Autowired
    IMedicalRecordService medicalRecordService;

    @PostMapping("/addMedicalRecord")
    MedicalRecord addMedicalRecord (@RequestBody MedicalRecord medicalRecord){

        return medicalRecordService.addMedicalRecord(medicalRecord);
    }

    @PutMapping("/updateMedicalRecord")
    MedicalRecord updateMedicalRecord (@RequestBody MedicalRecord medicalRecord){
        return medicalRecordService.updateMedicalRecord(medicalRecord);
    }

    @DeleteMapping("/deleteMedicalRecord/{idMedicalRecord}")
    void deleteMedicalRecord (@PathVariable() long  idMedicalRecord){
        medicalRecordService.deleteMedicalRecord(idMedicalRecord);
    }

    @GetMapping("/getAll")
    List<MedicalRecord> getAllMedicalRecords(){
        return medicalRecordService.getMedicalRecords();
    }

    @GetMapping("/getMedicalRecord/{idMedicalRecord}")
    MedicalRecord getMedicalRecordById(@PathVariable() long  idMedicalRecord){
        return medicalRecordService.getMedcialRecordById(idMedicalRecord);
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicalRecord> getByPatient(@PathVariable Long patientId) {
        return medicalRecordService.getMedicalRecordsByPatientId(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<MedicalRecord> getByDoctor(@PathVariable Long doctorId) {
        return medicalRecordService.getMedicalRecordsByDoctorId(doctorId);
    }

    @GetMapping("/by-patient-email")
    public List<MedicalRecord> getByPatientEmail(@RequestParam String email) {
        return medicalRecordService.getByPatientEmail(email);
    }

}
