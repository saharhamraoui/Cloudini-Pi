package tn.esprit.pi.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.Medicament;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicamentRepository extends JpaRepository<Medicament,Long> {
    List<Medicament> findByDateExpirationBefore(LocalDate date);

}

