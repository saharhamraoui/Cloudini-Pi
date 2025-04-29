package tn.esprit.pi.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.repositories.StockRepository;
import tn.esprit.pi.services.StockService;
import tn.esprit.pi.entities.Medicament;
import tn.esprit.pi.entities.Stock;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular frontend
@RestController
@RequestMapping("/stock")
@AllArgsConstructor
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping("/")
    public List<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }

    @GetMapping("/expiration/alertes")
    public List<Stock> getAlertesExpiration() {
        return stockService.getMedicamentsProchesExpiration();
    }
}
