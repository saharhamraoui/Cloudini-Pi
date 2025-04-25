package esprit.tn.saharpi.Controllers;

import esprit.tn.saharpi.Services.IMedicalRecordService;
import esprit.tn.saharpi.entities.MedicalRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medcialRecord")
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
}
