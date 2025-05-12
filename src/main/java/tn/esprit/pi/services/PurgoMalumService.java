package tn.esprit.pi.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class PurgoMalumService {

  private static final String API_URL = "http://www.purgomalum.com/service";
  private final RestTemplate restTemplate;

  public PurgoMalumService(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  public boolean containsProfanity(String text) {
    try {
      String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8.toString());
      String url = API_URL + "/containsprofanity?text=" + encodedText;

      String response = restTemplate.getForObject(url, String.class);
      return Boolean.parseBoolean(response);
    } catch (Exception e) {
      // Log l'erreur et retourne false pour ne pas bloquer l'application
      return false;
    }
  }

  public String filterText(String text) {
    try {
      String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8.toString());
      String url = API_URL + "/json?text=" + encodedText + "&fill_char=*";

      // Pour une réponse JSON plus structurée
      Map<String, String> response = restTemplate.getForObject(url, Map.class);
      return response.get("result");
    } catch (Exception e) {
      // Retourne le texte original en cas d'erreur
      return text;
    }
  }
}
