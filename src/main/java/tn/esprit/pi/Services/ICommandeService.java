package tn.esprit.pi.Services;

import tn.esprit.pi.entities.Commande;

import java.util.List;

public interface ICommandeService {

    Commande addCommande(Commande Commande);

    Commande updateCommande(Commande Commande);

    void deleteCommande(Long idCommande);

    List<Commande> getAllCommande();

    Commande getCommande(Long idCommande);
}
