package tn.esprit.pi.services;

import tn.esprit.pi.entities.Commande;
import tn.esprit.pi.entities.Stock;

import java.util.List;

public interface IStockService {
    void updateStockAfterDelivery(Commande commande);
    List<Stock> getAllStocks();
    List<Stock> getMedicamentsProchesExpiration();

}
