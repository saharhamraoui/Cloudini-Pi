package tn.esprit.pi.Controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.Services.IFournisseurService;
import tn.esprit.pi.entities.Fournisseur;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular frontend

@AllArgsConstructor
@RestController
@RequestMapping("/Fournisseurs")
public class FournisseurController {

    @Autowired
    IFournisseurService FournisseurService;

    @PostMapping("/")
    public Fournisseur addFournisseur(@RequestBody Fournisseur Fournisseur) {
        return FournisseurService.addFournisseur(Fournisseur);
    }
    @PutMapping("/") //si id not found it adds it
    public Fournisseur updateFournisseur(@RequestBody Fournisseur Fournisseur) {
        return FournisseurService.updateFournisseur(Fournisseur);
    }
    @DeleteMapping("/{idFournisseur}")
    public void delete(@PathVariable Long idFournisseur) {
        FournisseurService.deleteFournisseur(idFournisseur);
    }
    @GetMapping("/")
    public List<Fournisseur> getAllFournisseur(){
        return FournisseurService.getAllFournisseur();
    }
    @GetMapping(("/{idFournisseur}"))
    Fournisseur getFournisseur(@PathVariable Long idFournisseur){
        return FournisseurService.getFournisseur(idFournisseur);
    }
}
