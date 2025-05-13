package tn.esprit.pi.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.services.IMedicamentService;
import tn.esprit.pi.entities.Medicament;

import java.util.List;
@CrossOrigin(origins = "http://198.162.1.122:30596") // Allow requests from Angular frontend
@AllArgsConstructor
@RestController
@RequestMapping("/Medicaments")
public class MedicamentController {
    @Autowired
    IMedicamentService medicamentService;


    @PostMapping("/")
    public ResponseEntity<Medicament> addMedicament(@RequestBody Medicament medicament) {
        Medicament savedMedicament = medicamentService.addMedicament(medicament);
        return ResponseEntity.status(201).body(savedMedicament);  // Return 201 Created
    }

    @PutMapping("/")
    public ResponseEntity<Medicament> updateMedicament(@RequestBody Medicament medicament) {
        Medicament updatedMedicament = medicamentService.updateMedicament(medicament);
        return ResponseEntity.ok(updatedMedicament); // Return 200 OK
    }

    @DeleteMapping("/{idMedicament}")
    public ResponseEntity<Void> delete(@PathVariable Long idMedicament) {
        medicamentService.deleteMedicament(idMedicament);
        return ResponseEntity.noContent().build();  // Return 204 No Content
    }

    @GetMapping("/")
    public ResponseEntity<List<Medicament>> getAllMedicament() {
        List<Medicament> medicaments = medicamentService.getAllMedicament();
        return ResponseEntity.ok(medicaments);  // Return 200 OK with the list
    }

    @GetMapping("/{idMedicament}")
    public ResponseEntity<Medicament> getMedicament(@PathVariable Long idMedicament) {
        Medicament medicament = medicamentService.getMedicament(idMedicament);
        return ResponseEntity.ok(medicament);
    }

    @PutMapping("/{idMedicament}/fournisseurs/{idFournisseur}")
    public ResponseEntity<Medicament> affecterMedicament(@PathVariable Long idMedicament, @PathVariable Long idFournisseur) {
        Medicament medicament = medicamentService.affecterMedicament(idMedicament, idFournisseur);
        return ResponseEntity.ok(medicament);
    }


    @PostMapping("/ajoutermedicament/{idFournisseur}")
    public Medicament ajouterMedicamentEtAffecterFournisseur(@PathVariable Long idFournisseur, @RequestBody Medicament medicament) {
        return medicamentService.ajouterMedicamentEtAffecterFournisseur(idFournisseur, medicament);
    }

    @GetMapping("/expiration/alertes")
    public List<Medicament> getAlertesExpiration() {
        return medicamentService.getMedicamentsProchesExpiration();
    }
    @PutMapping("/medicament/{id}/desaffecter-fournisseur")
    public Medicament desaffecterFournisseur(@PathVariable Long id) {
        return medicamentService.desaffecterFournisseur(id);
    }

    @GetMapping("/fournisseur/{idFournisseur}/nom")
    public ResponseEntity<String> getFournisseurNameById(@PathVariable Long idFournisseur) {
        String fournisseurName = medicamentService.getFournisseurNameById(idFournisseur);
        return ResponseEntity.ok(fournisseurName);  // Return 200 OK with the fournisseur name
    }
}
