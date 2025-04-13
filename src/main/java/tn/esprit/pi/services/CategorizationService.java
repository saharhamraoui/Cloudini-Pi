package tn.esprit.pi.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class CategorizationService {

    private final RestTemplate restTemplate;

    @Value("${python.service.url}")
    private String pythonServiceUrl;

    public CategorizationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String categorizeReclamation(String text) {
        CategorizationResult result = categorizeWithConfidence(text);
        return result.getCategory();
    }

    public CategorizationResult categorizeWithConfidence(String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Text cannot be empty");
        }

        HttpEntity<Map<String, String>> entity = createRequestEntity(text);

        try {
            ResponseEntity<CategoryResponse> response = restTemplate.exchange(
                    pythonServiceUrl,
                    HttpMethod.POST,
                    entity,
                    CategoryResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                CategoryResponse body = response.getBody();
                return new CategorizationResult(
                        body.getCategory(),
                        body.getConfidence()
                );
            }
            return new CategorizationResult("uncategorized", 0.0);

        } catch (HttpClientErrorException e) {
            handleHttpClientError(e);
        } catch (ResourceAccessException e) {
            throw new ServiceException("Categorization service unavailable", e);
        }
        return new CategorizationResult("uncategorized", 0.0);
    }

    private HttpEntity<Map<String, String>> createRequestEntity(String text) {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("text", text);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        return new HttpEntity<>(requestBody, headers);
    }

    private void handleHttpClientError(HttpClientErrorException e) {
        if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
            throw new IllegalArgumentException("Invalid request: " + e.getResponseBodyAsString());
        }
        throw new ServiceException("Categorization service error: " + e.getMessage(), e);
    }

    // Response DTOs
    private static class CategoryResponse {
        private String category;
        private double confidence;
        private String error;

        public String getCategory() { return category; }
        public double getConfidence() { return confidence; }
        public String getError() { return error; }

        // Setters needed for JSON deserialization
        public void setCategory(String category) { this.category = category; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
        public void setError(String error) { this.error = error; }
    }

    public static class CategorizationResult {
        private final String category;
        private final double confidence;

        public CategorizationResult(String category, double confidence) {
            this.category = category;
            this.confidence = confidence;
        }

        public String getCategory() { return category; }
        public double getConfidence() { return confidence; }
    }

    public static class ServiceException extends RuntimeException {
        public ServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}