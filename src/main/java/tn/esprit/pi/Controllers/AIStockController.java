package tn.esprit.pi.Controllers;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.Repositories.CommandeRepository;
import tn.esprit.pi.Repositories.MedicamentRepository;
import tn.esprit.pi.Repositories.StockRepository;
import tn.esprit.pi.Services.AiStockService;
import tn.esprit.pi.Services.AiStockService;
import tn.esprit.pi.entities.Commande;
import tn.esprit.pi.entities.Medicament;
import tn.esprit.pi.entities.Stock;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular frontend
@AllArgsConstructor
@RestController
@RequestMapping("/api/chatbot")
public class AIStockController {

    @Autowired
        private AiStockService geminiService;

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private MedicamentRepository medicamentRepository;
    @Autowired
    private StockRepository StockRepository;

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");

        String dynamicInfo = generateContextualInfo(message);

        String fullPrompt = dynamicInfo + "\nRéponds à la question suivante : " + message;

        String reply = geminiService.askGemini(fullPrompt);
        return ResponseEntity.ok(reply);
    }
    private String generateContextualInfo(String message) {
        String lowerMessage = message.toLowerCase();

        if (lowerMessage.contains("commande")) {
            List<Commande> commandes = commandeRepository.findTop5ByOrderByDateCommandeDesc();
            return "Voici les dernières commandes :\n" +
                    commandes.stream()
                            .map(cmd -> "Commande ID: " + cmd.getIdcommande() + ", statut: " + cmd.getStatus() + ", fournisseur: " + cmd.getFournisseur().getNom())
                            .collect(Collectors.joining("\n"));
        }

        if (lowerMessage.contains("expiré") || lowerMessage.contains("expiration")) {
            List<Stock> meds = StockRepository.findByMedicamentDateExpirationBefore(LocalDate.now().plusDays(30));
            return "Médicaments proches de l’expiration :\n" +
                    meds.stream()
                            .map(m -> m.getMedicament().getNom() + " exp le " + m.getDateExpiration())
                            .collect(Collectors.joining("\n"));
        }

        if (lowerMessage.contains("comment passer une commande?")) {
            return "Les étapes pour passer une commande sont les suivantes :\n1. Aller à la liste des fournisseurs. 2. Sélectionner un fournisseur . 3. Passer la commande.";
        }
        if (lowerMessage.contains("étapes")) {
            return "Les étapes pour passer une commande sont les suivantes :\n1. Aller à la liste des fournisseurs. 2. Sélectionner un fournisseur. 3. Passer la commande.";
        }

        if (lowerMessage.contains("combien de") && lowerMessage.contains("dans le stock")) {
            String medName = extractMedicamentName(message);
            if (medName != null && !medName.isEmpty()) {
                List<Stock> stocks = StockRepository.findByMedicamentNomContainingIgnoreCase(medName);
                if (!stocks.isEmpty()) {
                    return "Stock actuel de " + medName + " :\n" +
                            stocks.stream()
                                    .map(s -> s.getMedicament().getNom() + " → quantité : " + s.getQuantiteEnStock())
                                    .collect(Collectors.joining("\n"));
                } else {
                    return "Aucun médicament nommé \"" + medName + "\" trouvé dans le stock.";
                }
            }
        }

        switch (lowerMessage) {
            case "bonjour":
                return " Bonjour ! Je suis votre assistant IA pour la gestion du stock.";
            case "quel est le stock actuel ?":
                return StockRepository.findAll().stream()
                        .map(m -> m.getMedicament() + " : " + m.getQuantiteEnStock())
                        .collect(Collectors.joining("\n"));
            case "quel est le médicament le plus en rupture ?":
                List<Stock> stocksEnRupture = StockRepository.findByQuantiteEnStockLessThanEqual(10);
                if (!stocksEnRupture.isEmpty()) {
                    return stocksEnRupture.stream()
                            .map(s -> "Médicament: " + s.getMedicament().getNom() + ", Quantité en stock: " + s.getQuantiteEnStock())
                            .collect(Collectors.joining("\n"));
                } else {
                    return "Tous les médicaments sont bien en stock !";
                }
            default:
                return "Je n'ai pas compris votre question. Essayez : \"Combien de Doliprane dans le stock ?\"";
        }
    }

    private String extractMedicamentName(String message) {
        try {
            String[] parts = message.toLowerCase().split("combien de");
            if (parts.length > 1) {
                String[] subParts = parts[1].split("dans le stock");
                return subParts[0].trim();
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }


}
