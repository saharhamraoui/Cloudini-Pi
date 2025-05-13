package tn.esprit.pi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.Medicament;
import tn.esprit.pi.entities.Stock;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByMedicament(Medicament medicament);
    List<Stock> findByQuantiteEnStockLessThanEqual(int seuil);
    List<Stock> findByMedicamentDateExpirationBefore(LocalDate date);
}
