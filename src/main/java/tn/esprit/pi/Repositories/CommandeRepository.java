package tn.esprit.pi.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.Commande;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
}
