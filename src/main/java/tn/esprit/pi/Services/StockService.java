package tn.esprit.pi.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.Repositories.StockRepository;
import tn.esprit.pi.entities.Commande;
import tn.esprit.pi.entities.LigneCommande;
import tn.esprit.pi.entities.Medicament;
import tn.esprit.pi.entities.Stock;

import java.time.LocalDate;
import java.util.List;

@Service
public class StockService implements IStockService {

    @Autowired
    private StockRepository stockRepository;
    @Override
    public void updateStockAfterDelivery(Commande commande) {
        for (LigneCommande ligne : commande.getLignesCommande()) {
            Medicament medicament = ligne.getMedicament();
            int quantiteCommandee = ligne.getQuantite();

            Stock stock = stockRepository.findByMedicament(medicament)
                    .orElseGet(() -> {
                        Stock newStock = new Stock();
                        newStock.setMedicament(medicament);
                        newStock.setQuantiteEnStock(0);
                        return newStock;
                    });

            stock.setQuantiteEnStock(stock.getQuantiteEnStock() + quantiteCommandee);
            stockRepository.save(stock);
        }
    }

    @Override
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    @Override
    public List<Stock> getMedicamentsProchesExpiration() {
        LocalDate dateLimite = LocalDate.now();
        return stockRepository.findByMedicamentDateExpirationBefore(dateLimite);  // Querying based on medicament's expiration date
    }
}
