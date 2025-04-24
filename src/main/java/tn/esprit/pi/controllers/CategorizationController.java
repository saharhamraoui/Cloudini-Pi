package tn.esprit.pi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.services.CategorizationService;

import java.util.Map;

@RestController
@RequestMapping("/api/categorize")
@RequiredArgsConstructor
public class CategorizationController {

    private final CategorizationService categorizationService;


    // Endpoint to categorize text and analyze sentiment
    @PostMapping("/categorize")
    public CategorizationService.CategorizationResult testCategorization(@RequestBody Map<String, String> body) {
        String text = body.get("text");
        return categorizationService.categorizeWithConfidence(text);
    }

    // New endpoint to handle facial emotion detection
    @PostMapping("/detect-emotion")
    public CategorizationService.FacialEmotionResult detectEmotion(@RequestBody Map<String, String> body) {
        String imageBase64 = body.get("image");  // Assuming image is passed as Base64 encoded string
        return categorizationService.detectFacialEmotion(imageBase64);
    }
}
