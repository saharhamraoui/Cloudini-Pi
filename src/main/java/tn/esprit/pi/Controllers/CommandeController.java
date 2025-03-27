package tn.esprit.pi.Controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.Services.ICommandeService;
import tn.esprit.pi.entities.Commande;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular frontend

@AllArgsConstructor
@RestController
@RequestMapping("/Commandes")
public class CommandeController {

    @Autowired
    ICommandeService CommandeService;

    @PostMapping("/")
    public Commande addCommande(@RequestBody Commande Commande) {
        return CommandeService.addCommande(Commande);
    }
    @PutMapping("/") //si id not found it adds it
    public Commande updateCommande(@RequestBody Commande Commande) {
        return CommandeService.updateCommande(Commande);
    }
    @DeleteMapping("/{idCommande}")
    public void delete(@PathVariable Long idCommande) {
        CommandeService.deleteCommande(idCommande);
    }
    @GetMapping("/")
    public List<Commande> getAllCommande(){
        return CommandeService.getAllCommande();
    }
    @GetMapping(("/{idCommande}"))
    Commande getCommande(@PathVariable Long idCommande){
        return CommandeService.getCommande(idCommande);
    }

}
