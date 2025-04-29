package tn.esprit.pi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.pi.entities.Paiement;
import tn.esprit.pi.services.DiscountService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/discount-requests")
public class DiscountRequestController {

  @Autowired
  private DiscountService discountService;

  @PostMapping(value = "/upload-disability-card/{paymentId}",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Map<String, Object>> uploadDisabilityCard(
    @PathVariable Long paymentId,
    @RequestParam("file") MultipartFile file,
    @RequestParam(value = "message", required = false) String message) throws IOException {
    return discountService.uploadDisabilityCard(paymentId, file, message);
  }

  @GetMapping("/pending")
  public ResponseEntity<List<Paiement>> getPendingDiscountRequests() {
    return ResponseEntity.ok(discountService.getPendingDiscountRequests());
  }

  @PostMapping("/{paymentId}/approve")
  public ResponseEntity<Map<String, Object>> approveDiscountRequest(
    @PathVariable Long paymentId) {
    return discountService.approveDiscountRequest(paymentId);
  }

  @PostMapping("/{paymentId}/reject")
  public ResponseEntity<Map<String, Object>> rejectDiscountRequest(
    @PathVariable Long paymentId,
    @RequestBody Map<String, String> request) {
    return discountService.rejectDiscountRequest(paymentId, request.get("reason"));
  }

  @GetMapping("/{paymentId}/disability-card")
  public ResponseEntity<byte[]> getDisabilityCard(@PathVariable Long paymentId) {
    return discountService.getDisabilityCard(paymentId);
  }
}
