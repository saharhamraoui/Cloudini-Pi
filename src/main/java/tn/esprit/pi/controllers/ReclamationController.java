package tn.esprit.pi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Reclamation;
import tn.esprit.pi.services.ReclamationService;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200" , maxAge = 3600)
@RestController
@RequestMapping("/api/reclamations")
public class ReclamationController {
    @Autowired
    private ReclamationService reclamationService;

    @GetMapping("/getAllReclamations")
    public List<Reclamation> getAllReclamations() {
        return reclamationService.getAllReclamations();
    }

    @GetMapping("/getreclamationbyid/{id}")
    public Reclamation getReclamationById(@PathVariable Long id) {
        return reclamationService.getReclamationById(id);}


    @PostMapping("/createReclamation")
    public Reclamation createReclamation(@RequestBody Reclamation reclamation) {
        return reclamationService.createReclamation(reclamation);
    }

    @PutMapping("/updateReclamation")
    public Reclamation updateReclamation(@RequestBody Reclamation reclamation) {
        return reclamationService.updateReclamation(reclamation);
    }

    @DeleteMapping("/{id}")
    public void deleteReclamation(@PathVariable Long id) {
        reclamationService.deleteReclamation(id);
    }


}
