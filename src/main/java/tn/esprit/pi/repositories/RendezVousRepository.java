package tn.esprit.pi.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.RendezVous;

@Repository
public interface RendezVousRepository  extends JpaRepository<RendezVous, Long> {

}
