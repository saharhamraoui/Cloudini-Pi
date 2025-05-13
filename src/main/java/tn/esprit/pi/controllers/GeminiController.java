package tn.esprit.pi.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://192.168.1.162:32584")
public class GeminiController {

    @Value("${gemini.api.key}")
    private String apiKey;

    @PostMapping("/suggest-articles")
    public ResponseEntity<Map<String, Object>> suggestArticles(@RequestBody Map<String, String> requestBody) {
        String specialty = requestBody.get("specialty");
        String keywords = requestBody.get("keywords");

        // Vérifier si les champs sont présents
        if (specialty == null || keywords == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Les champs 'specialty' et 'keywords' sont requis."));
        }

        try {
            // Construire le prompt pour l'API Gemini
            String prompt = String.format(
                    "Tu es un expert en %s. Propose 3 articles académiques récents sur '%s'. Formatte strictement ta réponse comme suit:\n\n" +
                            "1. [Titre de l'article] - [Résumé concis]\n" +
                            "**Pourquoi cet article est important:** [Explication]\n\n" +
                            "2. [Titre de l'article] - [Résumé concis]\n" +
                            "**Pourquoi cet article est important:** [Explication]\n\n" +
                            "3. [Titre de l'article] - [Résumé concis]\n" +
                            "**Pourquoi cet article est important:** [Explication]",
                    specialty,
                    keywords
            );

            // Appeler l'API Gemini
            String geminiResponse = callGeminiAPI(prompt);

            // Extraire le texte brut de la réponse Gemini
            String formattedResponse = extractTextFromResponse(geminiResponse);

            // Encapsuler la réponse dans une structure JSON simple
            Map<String, Object> response = Map.of("articles", formattedResponse);

            // Renvoyer directement la Map
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la génération de suggestions. Veuillez réessayer plus tard."));
        }
    }

    private String callGeminiAPI(String prompt) throws IOException {
        // URL de l'API Gemini avec la clé API
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        // Créer la requête HTTP
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(
                        String.format("{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}]}", prompt)
                ))
                .build();

        // Envoyer la requête et récupérer la réponse
        HttpClient client = HttpClient.newHttpClient();
        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body(); // Renvoie la réponse brute (JSON)
        } catch (Exception e) {
            throw new IOException("Erreur lors de l'appel à l'API Gemini.", e);
        }
    }

    private String extractTextFromResponse(String jsonResponse) {
        try {
            // Extraire le texte entre les guillemets après "text": "
            int start = jsonResponse.indexOf("\"text\": \"") + 9; // Position juste après "text": "
            int end = jsonResponse.indexOf("\"", start); // Position du prochain guillemet
            String extractedText = jsonResponse.substring(start, end);

            // Remplacer les caractères échappés (\n, \") pour un affichage correct
            return extractedText
                    .replace("\\n", "\n") // Remplacer les sauts de ligne
                    .replace("\\\"", "\""); // Remplacer les guillemets échappés
        } catch (Exception e) {
            // En cas d'erreur, retourner la réponse brute comme fallback
            return jsonResponse;
        }
    }
}
