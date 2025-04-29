package tn.esprit.pi.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AiStockService {

    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBM_YeWBVRmpsAzjyMXl3E_q-ql0hMGuuI";
    public String askGemini(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> content = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(content, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(API_URL, entity, String.class);

            // Traite la réponse pour obtenir uniquement le texte du message du bot
            String responseBody = response.getBody();
            // Extrait le texte du JSON
            if (responseBody != null) {
                String text = extractBotReply(responseBody);
                return text;
            }
            return "Aucune réponse du bot.";

        } catch (Exception e) {
            return "Erreur : " + e.getMessage();
        }
    }

    private String extractBotReply(String responseBody) {
        try {
            // Création d'un ObjectMapper
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> responseMap = objectMapper.readValue(responseBody, Map.class);

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
            return "Texte non trouvé.";
        } catch (Exception e) {
            return "Erreur lors de l'extraction du texte : " + e.getMessage();
        }
    }
}