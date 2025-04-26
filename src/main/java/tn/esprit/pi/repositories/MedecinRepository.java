package tn.esprit.pi.repositories;


import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.pi.entities.Medecin;
@Repository
public interface MedecinRepository extends JpaRepository<Medecin, Long>  {
}
