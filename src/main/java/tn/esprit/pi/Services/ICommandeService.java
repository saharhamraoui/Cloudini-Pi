package tn.esprit.pi.Services;

import tn.esprit.pi.DTOS.CommandeRequestDTO;
import tn.esprit.pi.DTOS.CommandeResponseDTO;
import tn.esprit.pi.entities.Commande;
import tn.esprit.pi.entities.Status;

import java.util.List;

public interface ICommandeService {

    Commande addCommande(Commande Commande);

    Commande updateCommande(Commande Commande);

    void deleteCommande(Long idCommande);

    List<Commande> getAllCommande();

    Commande getCommande(Long idCommande);
    CommandeResponseDTO createCommande(CommandeRequestDTO request);
    //Commande updateStatusCommande(Long commandeId, Status newStatus);
    Commande updateStatusCommande1(Long id, String nouveauStatus);
}
