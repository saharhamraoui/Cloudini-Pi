package esprit.tn.saharpi.Controllers;

import esprit.tn.saharpi.Services.IMedicalRecordService;
import esprit.tn.saharpi.Services.IPrescriptionService;
import esprit.tn.saharpi.entities.MedicalRecord;
import esprit.tn.saharpi.entities.Prescription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Prescription")
public class PrescriptionController {

    @Autowired
    IPrescriptionService iPrescriptionService;


    @PostMapping("/addPrescription")
    Prescription addPrescription (@RequestBody Prescription prescription){

        return iPrescriptionService.addPrescription(prescription);
    }

    @PutMapping("/updatePrescription")
    Prescription updatePrescription(@RequestBody Prescription prescription){
        return iPrescriptionService.updatePrescription(prescription);
    }

    @DeleteMapping("/deletePrescription/{idPrescription}")
    void deleteMedicalRecord (@PathVariable() long  idPrescription){
        iPrescriptionService.deletePrescription(idPrescription);
    }

    @GetMapping("/getAllPrescription")
    List<Prescription> getAllMedicalRecords(){
        return iPrescriptionService.getPrescriptions();
    }

    @GetMapping("/getPrescription/{idPrescription}")
    Prescription getMedicalRecordById(@PathVariable() long  idPrescription){
        return iPrescriptionService.getPrescriptionById(idPrescription);
    }
}
