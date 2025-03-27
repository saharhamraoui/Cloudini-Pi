package tn.esprit.pi.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.Repositories.CommandeRepository;
import tn.esprit.pi.entities.Commande;

import java.util.List;

@Service
public class CommandeService implements ICommandeService{
    @Autowired
    private CommandeRepository commandeRepository;

    @Override
    public Commande addCommande(Commande Commande) {
        return commandeRepository.save(Commande);
    }

    @Override
    public Commande updateCommande(Commande Commande) {
        return commandeRepository.save(Commande);
    }

    @Override
    public void deleteCommande(Long idCommande) {
   commandeRepository.deleteById(idCommande);
    }

    @Override
    public List<Commande> getAllCommande() {
        return commandeRepository.findAll();
    }

    @Override
    public Commande getCommande(Long idCommande) {
        return commandeRepository.findById(idCommande).get();
    }
}
