package tn.esprit.pi.services;

import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    private static final String API_KEY = "AIzaSyCEx1W86EHOfA4suHgeuB-8iwFdid8GCNE";
    private static final String URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=" + API_KEY;

    public String ask(String userMessage) {
        try {
            HttpClient client = HttpClient.newHttpClient();

            String json = """
                    {
                      "contents": [ {
                        "parts": [{
                          "text": "%s"
                        }]
                      }]
                    }
                    """.formatted(userMessage);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(URL))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Log la réponse brute
            System.out.println("Réponse de Gemini brute : " + response.body());

            ObjectMapper mapper = new ObjectMapper();
            Map<?, ?> jsonResponse = mapper.readValue(response.body(), Map.class);

            if (!jsonResponse.containsKey("candidates")) {
                return "Erreur : Aucune réponse générée par Gemini. Vérifie ta clé API.";
            }

            Map<?, ?> firstCandidate = ((Map<?, ?>) ((java.util.List<?>) jsonResponse.get("candidates")).get(0));
            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
            Map<?, ?> part = (Map<?, ?>) ((java.util.List<?>) content.get("parts")).get(0);
            return part.get("text").toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur lors de la communication avec Gemini : " + e.getMessage();
        }
    }

    // New method to list available models
    public String listAvailableModels() {
        try {
            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models?key=" + API_KEY))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Log the raw response to check available models
            System.out.println("Available models: " + response.body());

            return response.body();
        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur lors de la communication avec Gemini : " + e.getMessage();
        }
    }
}
