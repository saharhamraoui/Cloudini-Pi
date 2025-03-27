package tn.esprit.pi.Controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.Services.FournisseurService;
import tn.esprit.pi.Services.IFournisseurService;
import tn.esprit.pi.Services.IMedicamentService;
import tn.esprit.pi.entities.Fournisseur;
import tn.esprit.pi.entities.Medicament;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular frontend
@AllArgsConstructor
@RestController
@RequestMapping("/Medicaments")
public class MedicamentController {
    @Autowired
    IMedicamentService MedicamentService;
    @Autowired
    IFournisseurService FournisseurService;

    @PostMapping("/")
    public Medicament addMedicament(@RequestBody Medicament Medicament) {
        return MedicamentService.addMedicament(Medicament);
    }
    @PutMapping("/") //si id not found it adds it
    public Medicament updateMedicament(@RequestBody Medicament Medicament) {
        return MedicamentService.updateMedicament(Medicament);
    }
    @DeleteMapping("/{idMedicament}")
    public void delete(@PathVariable Long idMedicament) {
        MedicamentService.deleteMedicament(idMedicament);
    }
    @GetMapping("/")
    public List<Medicament> getAllMedicament(){
        return MedicamentService.getAllMedicament();
    }
    @GetMapping(("/{idMedicament}"))
    Medicament getMedicament(@PathVariable Long idMedicament){
        return MedicamentService.getMedicament(idMedicament);
    }
    @PutMapping("/affectermedicament/{idMedicament}/{idFournisseur}")
    public Medicament affecterMedicament(@PathVariable Long idMedicament, @PathVariable Long idFournisseur) {
        return MedicamentService.affecterMedicament(idMedicament, idFournisseur);
    }
    @PutMapping("/affectermedicaments/{idFournisseur}")
    public Fournisseur affecterMedicaments(@PathVariable Long idFournisseur, @RequestBody List<Long> idMedicaments) {
        return FournisseurService.affecterMedicaments(idFournisseur, idMedicaments);
    }


}
