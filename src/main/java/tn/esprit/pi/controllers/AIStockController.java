package tn.esprit.pi.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.repositories.CommandeRepository;
import tn.esprit.pi.repositories.MedicamentRepository;
import tn.esprit.pi.services.AiStockService;
import tn.esprit.pi.entities.Commande;
import tn.esprit.pi.entities.Medicament;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://198.162.1.122:30596") // Allow requests from Angular frontend
@AllArgsConstructor
@RestController
@RequestMapping("/api/chatbot")
public class AIStockController {
//AIzaSyBM_YeWBVRmpsAzjyMXl3E_q-ql0hMGuuI

    @Autowired
        private AiStockService geminiService;

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private MedicamentRepository medicamentRepository;

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

        // Cas : infos sur les commandes
        if (lowerMessage.contains("commande")) {
            List<Commande> commandes = commandeRepository.findTop5ByOrderByDateCommandeDesc();
            return "Voici les dernières commandes :\n" +
                    commandes.stream()
                            .map(cmd -> "Commande ID: " + cmd.getIdcommande() + ", statut: " + cmd.getStatus() + ", fournisseur: " + cmd.getFournisseur().getNom())
                            .collect(Collectors.joining("\n"));
        }

        // Cas : médicaments expirés
        if (lowerMessage.contains("expiré") || lowerMessage.contains("expiration")) {
            List<Medicament> meds = medicamentRepository.findByDateExpirationBefore(LocalDate.now().plusDays(30));
            return "Médicaments proches de l’expiration :\n" +
                    meds.stream()
                            .map(m -> m.getNom() + " exp le " + m.getDateExpiration())
                            .collect(Collectors.joining("\n"));
        }

        // Cas : instructions pour passer une commande
        if (lowerMessage.contains("comment passer une commande?")) {
            return "Les étapes pour passer une commande sont les suivantes :\n1. Aller à la liste des fournisseurs. 2. Sélectionner un fournisseur et les médicaments. 3. Passer la commande.";
        }
        if (lowerMessage.contains("étapes")) {
            return "Les étapes pour passer une commande sont les suivantes :\n1. Aller à la liste des fournisseurs. 2. Sélectionner un fournisseur et les médicaments. 3. Passer la commande.";
        }

        // Cas : stock spécifique d’un médicament
        if (lowerMessage.contains("combien de") && lowerMessage.contains("dans le stock")) {
            String medName = extractMedicamentName(message);
            if (medName != null && !medName.isEmpty()) {
                List<Medicament> meds = medicamentRepository.findByNomContainingIgnoreCase(medName);
                if (!meds.isEmpty()) {
                    return "Stock actuel de " + medName + " :\n" +
                            meds.stream()
                                    .map(m -> m.getNom() + " → quantité : " + m.getQuantite())
                                    .collect(Collectors.joining("\n"));
                } else {
                    return " Aucun médicament nommé \"" + medName + "\" trouvé dans le stock.";
                }
            }
        }

        // Réponses par défaut
        switch (lowerMessage) {
            case "bonjour":
                return "👋 Bonjour ! Je suis votre assistant IA pour la gestion du stock.";
            case "quel est le stock actuel ?":
                return medicamentRepository.findAll().stream()
                        .map(m -> m.getNom() + " : " + m.getQuantite())
                        .collect(Collectors.joining("\n"));
            case "quel est le médicament le plus en rupture ?":
                return medicamentRepository.findTopByOrderByQuantiteAsc()
                        .map(m -> " Médicament le plus en rupture : " + m.getNom() + " (" + m.getQuantite() + " en stock)")
                        .orElse("Tous les médicaments sont bien en stock !");
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
