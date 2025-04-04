package tn.esprit.pi.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.pi.entities.Commande;
import tn.esprit.pi.entities.LigneCommande;

import java.util.List;

public interface LigneCommandeRepository extends JpaRepository<LigneCommande, Long> {
    List<LigneCommande> findByCommande(Commande commande);
}
