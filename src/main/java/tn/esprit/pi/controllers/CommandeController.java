package tn.esprit.pi.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import tn.esprit.pi.DTOS.CommandeRequestDTO;
import tn.esprit.pi.DTOS.CommandeResponseDTO;
import tn.esprit.pi.DTOS.LigneCommandeDTO;
import tn.esprit.pi.DTOS.StockVerificationDTO;
import tn.esprit.pi.repositories.MedicamentRepository;
import tn.esprit.pi.services.ICommandeService;
import tn.esprit.pi.services.IMedicamentService;
import tn.esprit.pi.entities.Commande;
import tn.esprit.pi.entities.Medicament;
import tn.esprit.pi.entities.Status;

import java.util.List;
@CrossOrigin(origins = "http://198.162.1.118:32584") // Allow requests from Angular frontend

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
    public ResponseEntity<?> delete(@PathVariable Long idCommande) {
        Commande commande = CommandeService.getCommande(idCommande);
        if (commande != null) {
            if (commande.getStatus() == Status.Encours) {
                CommandeService.deleteCommande(idCommande);
                return ResponseEntity.ok().build(); // 200 OK
            } else {
                return ResponseEntity.badRequest().body("Seules les commandes avec le statut 'Encours' peuvent être supprimées.");
            }
        } else {
            return ResponseEntity.notFound().build(); // 404
        }
    }



    @GetMapping("/")
    public List<Commande> getAllCommande(){
        return CommandeService.getAllCommande();
    }
    // Récupérer une commande par ID
    @GetMapping("/{idCommande}")
    public Commande getCommande(@PathVariable Long idCommande){
        return CommandeService.getCommande(idCommande);
    }
    @PostMapping
    public CommandeResponseDTO createCommande(@RequestBody CommandeRequestDTO request) {
        return CommandeService.createCommande(request);
    }
    // Endpoint to update the status of a command
    @PutMapping("/updateStatus/{commandeId}")
    public Commande updateStatusCommande(
            @PathVariable Long commandeId,
            @RequestParam Status newStatus) {
        return CommandeService.updateStatusCommande1(commandeId, String.valueOf(newStatus));
    }


}
