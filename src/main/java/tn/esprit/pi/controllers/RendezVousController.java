package tn.esprit.pi.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Consultation;
import tn.esprit.pi.entities.Medecin;
import tn.esprit.pi.entities.Patient;
import tn.esprit.pi.entities.RendezVous;
import tn.esprit.pi.services.IRendezVousService;

import java.util.Date;
import java.util.List;

@Tag(name = "Gestion RendezVous")
@CrossOrigin(origins = "http://192.168.1.162:32584")
@RestController
@RequestMapping("/rendezVous")

public class RendezVousController {

    @Autowired
    IRendezVousService rendezVousService ;

    @PostMapping("/addRendezVous")
    RendezVous addRendezVous(@RequestBody RendezVous rendezVous) {
        return rendezVousService.addRendezVous(rendezVous);
    }
    @PutMapping("/updateRendezVous")
    RendezVous updateRendezVous(@RequestBody RendezVous rendezVous){
        return  rendezVousService.updateRendezVous(rendezVous);
    }
    @DeleteMapping("/deleteRendezVous/{idRendezVous}")
    void  deleteRendezVous(@PathVariable long idRendezVous){
        rendezVousService.deleteRendezVous(idRendezVous);
    }
    @GetMapping("/GetAll")
    List<RendezVous> getAllRendezVous(){
        return  rendezVousService.retrieveAllRendezVous();
    }
    @GetMapping("/GetById/{idRendezVous}")
    RendezVous getRendezVous(@PathVariable long idRendezVous){
        return  rendezVousService.retrieveRendezVous(idRendezVous);
    }

    @PutMapping("/affecterConsultationToRendezVous/{idConsultation}/{idRendezVous}")
    Consultation affecterConsultationToRendezVous(@PathVariable long idConsultation , @PathVariable long idRendezVous){
        return  rendezVousService.affecterRendezVousToConsultation(idConsultation , idRendezVous) ;
    }

    @GetMapping("/GetByMedecin/{idMedecin}")
    public List<RendezVous> getRendezVousByMedecin(@PathVariable long idMedecin) {
        return rendezVousService.retrieveRendezVousByMedecin(idMedecin);
    }


    //@PutMapping("/{idRendezVous}/assignMedecin/{idMedecin}")
    @PutMapping("/affectermedecin/{idRendezVous}/{idMedecin}")
    public RendezVous affecterRendezVousToMedecin(@PathVariable long idRendezVous, @PathVariable long idMedecin) {
        return rendezVousService.affecterRendezVousToMedecin(idRendezVous, idMedecin);
    }

    @PutMapping("/affecterpatient/{idRendezVous}/{idPatient}")
    public RendezVous affecterRendezVousToPatient(@PathVariable long idRendezVous, @PathVariable long idPatient) {
        return rendezVousService.affecterRendezVousToPatient(idRendezVous, idPatient);
    }


    @GetMapping("/getAllMedecins")
    public List<Medecin> getAllMedecins() {
        return rendezVousService.retrieveAllMedecins(); // Cette méthode récupère uniquement les utilisateurs de type "DOCTEUR"
    }

    // Récupérer tous les patients
    @GetMapping("/getAllPatients")
    public List<Patient> getAllPatients() {
        return rendezVousService.retrieveAllPatients(); // Cette méthode récupère uniquement les utilisateurs de type "PATIENT"
    }
    @GetMapping("/proposer-creneau/{idMedecin}")
    public ResponseEntity<Date> proposerCreneauOptimal(@PathVariable Long idMedecin) {
        Date creneau = rendezVousService.proposerCreneauOptimal(idMedecin);
        return ResponseEntity.ok(creneau);
    }


}
