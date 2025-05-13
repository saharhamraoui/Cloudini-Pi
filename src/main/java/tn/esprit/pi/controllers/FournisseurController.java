package tn.esprit.pi.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.services.IFournisseurService;
import tn.esprit.pi.entities.Fournisseur;
import tn.esprit.pi.entities.Medicament;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://192.168.1.122:32584") // Allow requests from Angular frontend
@AllArgsConstructor
@RequestMapping("/Fournisseurs")
public class FournisseurController {

    @Autowired
    IFournisseurService fournisseurService;

    @PostMapping("/")
    public ResponseEntity<Fournisseur> addFournisseur(@RequestBody Fournisseur fournisseur) {
        Fournisseur savedFournisseur = fournisseurService.addFournisseur(fournisseur);
        return ResponseEntity.status(201).body(savedFournisseur);
    }

    @PutMapping("/")
    public ResponseEntity<Fournisseur> updateFournisseur(@RequestBody Fournisseur fournisseur) {
        Fournisseur updatedFournisseur = fournisseurService.updateFournisseur(fournisseur);
        return ResponseEntity.ok(updatedFournisseur);
    }
    @PutMapping("/{idFournisseur}")
    public ResponseEntity<Fournisseur> updateFournisseur(@PathVariable Long idFournisseur, @RequestBody Fournisseur fournisseur) {
        fournisseur.setIdfournisseur(idFournisseur); // Set the idFournisseur from the path variable
        Fournisseur updatedFournisseur = fournisseurService.updateFournisseur(fournisseur);
        return ResponseEntity.ok(updatedFournisseur);
    }

    @DeleteMapping("/{idFournisseur}")
    public ResponseEntity<Void> delete(@PathVariable Long idFournisseur) {
        fournisseurService.deleteFournisseur(idFournisseur);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/")
    public ResponseEntity<List<Fournisseur>> getAllFournisseur() {
        List<Fournisseur> fournisseurs = fournisseurService.getAllFournisseur();
        return ResponseEntity.ok(fournisseurs);
    }

    @GetMapping("/{idFournisseur}")
    public ResponseEntity<Fournisseur> getFournisseur(@PathVariable Long idFournisseur) {
        Fournisseur fournisseur = fournisseurService.getFournisseur(idFournisseur);
        return ResponseEntity.ok(fournisseur);
    }

    @PutMapping("/{idFournisseur}/medicaments")
    public ResponseEntity<Fournisseur> affecterMedicaments(@PathVariable Long idFournisseur, @RequestBody List<Long> idMedicaments) {
        Fournisseur updatedFournisseur = fournisseurService.affecterMedicaments(idFournisseur, idMedicaments);
        return ResponseEntity.ok(updatedFournisseur);
    }

    @GetMapping("/{idFournisseur}/medicaments")
    public List<Medicament> getMedicamentsByFournisseur(@PathVariable Long idFournisseur) {
        return fournisseurService.getFournisseur(idFournisseur).getMedicaments();  // Retourne les médicaments du fournisseur
    }

    @GetMapping("/chercher-medicament/{nomMedicament}")
    public List<Fournisseur> getFournisseursByMedicament(@PathVariable String nomMedicament) {
        List<Fournisseur> fournisseurs = fournisseurService.getFournisseursParMedicament(nomMedicament);

        // Sort the list of fournisseurs based on the price of the medicament in ascending order
        fournisseurs.sort((f1, f2) -> {
            Double price1 = f1.getMedicaments().stream()
                    .filter(med -> med.getNom().equalsIgnoreCase(nomMedicament))
                    .map(Medicament::getPrix)
                    .findFirst()
                    .orElse(Double.MAX_VALUE); // if no price, set a very high value
            Double price2 = f2.getMedicaments().stream()
                    .filter(med -> med.getNom().equalsIgnoreCase(nomMedicament))
                    .map(Medicament::getPrix)
                    .findFirst()
                    .orElse(Double.MAX_VALUE); // if no price, set a very high value
            return price1.compareTo(price2); // Compare based on price
        });

        return fournisseurs;
    }


}
