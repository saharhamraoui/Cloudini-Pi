package tn.esprit.pi.controllers;


import tn.esprit.pi.services.IPrescriptionService;
import tn.esprit.pi.entities.Prescription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://192.168.1.162:32584") // add this above your controller
@RestController
@RequestMapping("/Prescription")
public class PrescriptionController {

    @Autowired
    IPrescriptionService iPrescriptionService;


    @PostMapping("/addPrescription")
    Prescription addPrescription (@RequestBody Prescription prescription){

        return iPrescriptionService.addPrescription(prescription);
    }

    @CrossOrigin(origins = "http://192.168.1.162:32584") // add this above your controller
    @PutMapping("/updatePrescription")
    Prescription updatePrescription(@RequestBody Prescription prescription){
        return iPrescriptionService.updatePrescription(prescription);
    }

    @DeleteMapping("/deletePrescription/{idPrescription}")
    void deletePrescription (@PathVariable() long  idPrescription){
        iPrescriptionService.deletePrescription(idPrescription);
    }

    @GetMapping("/getAllPrescription")
    List<Prescription> getAllPrescription(){
        return iPrescriptionService.getPrescriptions();
    }

    @GetMapping("/getPrescription/{idPrescription}")
    Prescription getPrescriptionById(@PathVariable() long  idPrescription){
        return iPrescriptionService.getPrescriptionById(idPrescription);
    }

    @GetMapping("/getPrescriptionByRecord/{idRecord}")
    List<Prescription> getPrescriptionByIdRecord(@PathVariable() long  idRecord){
        return iPrescriptionService.getPrescriptionByIdRecord(idRecord);
    }

    @GetMapping("/getPrescriptionByMedication/{medication}")
    List<Prescription> getPrescriptionMedication(@PathVariable() String  medication){
        return iPrescriptionService.findByMedication(medication);
    }
}
