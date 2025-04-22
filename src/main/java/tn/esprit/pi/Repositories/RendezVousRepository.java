package tn.esprit.pi.Repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.RendezVous;

import java.util.List;

@Repository
public interface RendezVousRepository  extends JpaRepository<RendezVous, Long> {

}
