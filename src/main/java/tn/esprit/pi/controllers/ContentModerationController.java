package tn.esprit.pi.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.pi.services.PurgoMalumService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/content-moderation")
public class ContentModerationController {

  @Autowired
  private PurgoMalumService purgoMalumService;

  @PostMapping("/check")
  public ResponseEntity<Map<String, Object>> checkContent(@RequestBody Map<String, String> request) {
    String text = request.get("text");
    boolean containsProfanity = purgoMalumService.containsProfanity(text);
    String filteredText = purgoMalumService.filterText(text);

    Map<String, Object> response = new HashMap<>();
    response.put("containsProfanity", containsProfanity);
    response.put("filteredText", filteredText);
    response.put("originalText", text);

    return ResponseEntity.ok(response);
  }
}
