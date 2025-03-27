package tn.esprit.pi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Reclamation;
import tn.esprit.pi.services.ReclamationService;

import java.util.List;

@RestController
@RequestMapping("/api/reclamations")
public class ReclamationController {
    @Autowired
    private ReclamationService reclamationService;

    @GetMapping
    public List<Reclamation> getAllReclamations() {
        return reclamationService.getAllReclamations();
    }

    @GetMapping("/{id}")
    public Reclamation getReclamationById(@PathVariable Long id) {
        return reclamationService.getReclamationById(id);}


    @PostMapping
    public Reclamation createReclamation(@RequestBody Reclamation reclamation) {
        return reclamationService.createReclamation(reclamation);
    }

    @DeleteMapping("/{id}")
    public void deleteReclamation(@PathVariable Long id) {
        reclamationService.deleteReclamation(id);
    }
}
