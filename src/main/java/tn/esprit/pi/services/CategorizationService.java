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

    @Value("${python.emotion.service.url}")
    private String emotionServiceUrl;  // New property for the emotion detection service

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
                        body.getConfidence(),
                        body.getSentiment(),
                        body.getSentimentConfidence()
                );
            }
            return new CategorizationResult("uncategorized", 0.0, "neutral", 0.0);

        } catch (HttpClientErrorException e) {
            handleHttpClientError(e);
        } catch (ResourceAccessException e) {
            throw new ServiceException("Categorization service unavailable", e);
        }

        return new CategorizationResult("uncategorized", 0.0, "neutral", 0.0);
    }

    public FacialEmotionResult detectFacialEmotion(String imageBase64) {
        if (imageBase64 == null || imageBase64.trim().isEmpty()) {
            throw new IllegalArgumentException("Image cannot be empty");
        }

        HttpEntity<Map<String, String>> entity = createImageRequestEntity(imageBase64);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    emotionServiceUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                String emotion = (String) body.get("facial_emotion");
                double confidence = body.containsKey("confidence") ? Double.parseDouble(body.get("confidence").toString()) : 0.0;
                return new FacialEmotionResult(emotion, confidence);
            }

            return new FacialEmotionResult("unknown", 0.0);

        } catch (HttpClientErrorException e) {
            handleHttpClientError(e);
        } catch (ResourceAccessException e) {
            throw new ServiceException("Emotion detection service unavailable", e);
        }

        return new FacialEmotionResult("unknown", 0.0);
    }

    private HttpEntity<Map<String, String>> createRequestEntity(String text) {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("text", text);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        return new HttpEntity<>(requestBody, headers);
    }

    private HttpEntity<Map<String, String>> createImageRequestEntity(String imageBase64) {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("image", imageBase64);  // Assuming image is passed as Base64 encoded string

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        return new HttpEntity<>(requestBody, headers);
    }

    private void handleHttpClientError(HttpClientErrorException e) {
        if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
            throw new IllegalArgumentException("Invalid request: " + e.getResponseBodyAsString());
        }
        throw new ServiceException("Service error: " + e.getMessage(), e);
    }

    // Response DTOs for Facial Emotion Detection
    private static class FacialEmotionResponse {
        private String emotion;
        private double confidence;

        public String getEmotion() { return emotion; }
        public double getConfidence() { return confidence; }

        public void setEmotion(String emotion) { this.emotion = emotion; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
    }

    public static class FacialEmotionResult {
        private final String emotion;
        private final double confidence;

        public FacialEmotionResult(String emotion, double confidence) {
            this.emotion = emotion;
            this.confidence = confidence;
        }

        public String getEmotion() { return emotion; }
        public double getConfidence() { return confidence; }
    }

    // Response DTO for Categorization
    private static class CategoryResponse {
        private String category;
        private double confidence;
        private String error;
        private String sentiment;
        private double sentimentConfidence;

        public String getCategory() { return category; }
        public double getConfidence() { return confidence; }
        public String getError() { return error; }
        public String getSentiment() { return sentiment; }
        public double getSentimentConfidence() { return sentimentConfidence; }

        public void setCategory(String category) { this.category = category; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
        public void setError(String error) { this.error = error; }
        public void setSentiment(String sentiment) { this.sentiment = sentiment; }
        public void setSentimentConfidence(double sentimentConfidence) { this.sentimentConfidence = sentimentConfidence; }
    }

    // Response DTO for Categorization Result
    public static class CategorizationResult {
        private final String category;
        private final double confidence;
        private final String sentiment;
        private final double sentimentConfidence;

        public CategorizationResult(String category, double confidence, String sentiment, double sentimentConfidence) {
            this.category = category;
            this.confidence = confidence;
            this.sentiment = sentiment;
            this.sentimentConfidence = sentimentConfidence;
        }

        public String getCategory() { return category; }
        public double getConfidence() { return confidence; }
        public String getSentiment() { return sentiment; }
        public double getSentimentConfidence() { return sentimentConfidence; }
    }

    public static class ServiceException extends RuntimeException {
        public ServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
