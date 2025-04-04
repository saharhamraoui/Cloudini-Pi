package tn.esprit.pi.Services;

import tn.esprit.pi.entities.Commande;
import tn.esprit.pi.entities.Stock;

import java.util.List;

public interface IStockService {
    void updateStockAfterDelivery(Commande commande);
    List<Stock> getAllStocks();
}
