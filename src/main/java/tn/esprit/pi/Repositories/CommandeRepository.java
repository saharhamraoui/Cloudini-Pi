package tn.esprit.pi.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.Commande;

import java.util.List;
//interface
@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> { //interface generique
    List<Commande> findTop5ByOrderByDateCommandeDesc();
}
