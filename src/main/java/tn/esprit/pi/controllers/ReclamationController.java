package tn.esprit.pi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Reclamation;
import tn.esprit.pi.services.CategorizationService;
import tn.esprit.pi.services.ReclamationService;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://192.168.1.162:32584")
@RestController
@RequestMapping("/api/reclamations")
public class ReclamationController {

    @Autowired
    private ReclamationService reclamationService;

    @Autowired
    private final CategorizationService categorizationService;
    public ReclamationController(CategorizationService categorizationService) {
        this.categorizationService = categorizationService;}


    @PostMapping("/createReclamation")
    public Reclamation createReclamation(@RequestBody Reclamation reclamation) {
        return reclamationService.createReclamation(reclamation);
    }

    @PutMapping("/updateReclamation")
    public Reclamation updateReclamation(@RequestBody Reclamation reclamation) {
        return reclamationService.updateReclamation(reclamation);
    }

    @GetMapping("/getAllReclamations")
    public List<Reclamation> getAllReclamations() {
        return reclamationService.getAllReclamations();
    }

    @GetMapping("/getreclamationbyid/{id}")
    public Reclamation getReclamationById(@PathVariable Long id) {
        return reclamationService.getReclamationById(id);
    }

    @DeleteMapping("deleteReclamation/{id}")
    public void deleteReclamation(@PathVariable Long id) {
        reclamationService.deleteReclamation(id);
    }

    @PostMapping("/{id}/feedback")
    public Reclamation addFeedback(@PathVariable Long id, @RequestBody String feedback) {
        return reclamationService.addFeedback(id, feedback);
    }

    @PostMapping("/escalate")
    public ResponseEntity<String> triggerEscalation() {
        reclamationService.escalatePendingReclamations();
        return ResponseEntity.ok("Escalation process triggered.");
    }

    @PostMapping("/categorize")
    public Map<String, Object> categorizeReclamation(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        CategorizationService.CategorizationResult result =
                categorizationService.categorizeWithConfidence(text);

        return Map.of(
                "category", result.getCategory(),
                "confidence", result.getConfidence()
        );
    }
}


