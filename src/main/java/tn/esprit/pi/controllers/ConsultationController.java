package tn.esprit.pi.controllers;


import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Consultation;
import tn.esprit.pi.entities.MedicalRecord;
import tn.esprit.pi.entities.RendezVous;
import tn.esprit.pi.services.IConsultationService;

import java.util.List;

@Tag(name = "Gestion Consultation")
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/consultation")
public class ConsultationController {
    @Autowired
    IConsultationService consultationService ;
    @PostMapping("/addConsultation")
    Consultation addConsultation(@RequestBody Consultation consultation) {
        return consultationService.addConsultation(consultation);
    }
    @PutMapping("/updateConsultation")
    Consultation updateConsultation(@RequestBody Consultation consultation){
        return  consultationService.updateConsultation(consultation);
    }
    @DeleteMapping("/deleteConsultation/{idConsultation}")
    void  deleteConsultation(@PathVariable long idConsultation){
        consultationService.deleteConsultation(idConsultation);
    }

    @GetMapping("/GetAll")
    List<Consultation> getAllConsultation(){
        return  consultationService.retrieveAllConsultation();
    }
    @GetMapping("/GetById/{idConsultation}")
    Consultation getConsultation(@PathVariable long idConsultation){
        return  consultationService.retrieveConsultation(idConsultation);
    }
    @PutMapping("/affecterRendezVous/{idConsultation}/{idRendezVous}")
    Consultation affecterConsultationToRendezVous(@PathVariable long idConsultation, @PathVariable long idRendezVous) {
        return consultationService.affecterConsultationToRendezVous(idConsultation, idRendezVous);
    }

    @PutMapping("/affecterMedicalRecord/{idConsultation}/{idMedicalRecord}")
    Consultation affecterConsultationToMedicalRecord(@PathVariable long idConsultation, @PathVariable long idMedicalRecord) {
        return consultationService.affecterConsultationToMedicalRecord(idConsultation, idMedicalRecord);
    }
    @GetMapping("/getAllRendezVous")
    public List<RendezVous> retrieveAllRendezVous() {

        return consultationService.retrieveAllRendezVous();
    }

    @GetMapping("/getAllMedicalRecord")
    public List<MedicalRecord> retrieveAllMedicalRecord() {

        return consultationService.retrieveAllMedicalRecords();
    }

}
