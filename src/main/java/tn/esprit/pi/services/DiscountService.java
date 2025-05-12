package tn.esprit.pi.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.pi.entities.Paiement;
import tn.esprit.pi.repositories.PaiementRepository;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DiscountService implements IDiscountService {

    @Autowired
    private PaiementRepository paiementRepository;

    @Override
    public ResponseEntity<Map<String, Object>> uploadDisabilityCard(Long paiementId, MultipartFile file, String message) throws IOException {
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Validate file
            if (file.isEmpty()) {
                response.put("status", "error");
                response.put("message", "File cannot be empty");
                return ResponseEntity.badRequest().body(response);
            }

            // 2. Validate file type
            String contentType = file.getContentType();
            if (!contentType.startsWith("image/") && !contentType.equals("application/pdf")) {
                response.put("status", "error");
                response.put("message", "Only images and PDF files are allowed");
                return ResponseEntity.badRequest().body(response);
            }

            // 3. Process payment
            Paiement paiement = paiementRepository.findById(paiementId)
                    .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paiementId));

            // 4. Update payment entity
            paiement.setDisabilityCardImage(file.getBytes());
            paiement.setDiscountRequested(true);

            if (message != null && !message.isEmpty()) {
                paiement.setDisabilityCardId(message.hashCode() + "_" + System.currentTimeMillis());
            }

            // 5. Save changes
            paiementRepository.save(paiement);

            // 6. Prepare success response
            response.put("status", "success");
            response.put("message", "Disability card uploaded successfully");
            response.put("paymentId", paiementId);
            response.put("fileName", file.getOriginalFilename());
            response.put("fileSize", file.getSize());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Handle any unexpected errors
            response.put("status", "error");
            response.put("message", "Failed to process upload: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    public ResponseEntity<byte[]> getDisabilityCard(Long paiementId) {
        Optional<Paiement> paiementOptional = paiementRepository.findById(paiementId);

        if (paiementOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Paiement paiement = paiementOptional.get();
        if (paiement.getDisabilityCardImage() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header("Content-Type", "application/octet-stream")
                .body(paiement.getDisabilityCardImage());
    }


    public List<Paiement> getPendingDiscountRequests() {
        return paiementRepository.findByDiscountRequestedTrueAndDiscountStatus(Paiement.DiscountStatus.PENDING);
    }

    public ResponseEntity<Map<String, Object>> approveDiscountRequest(Long paiementId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Paiement paiement = paiementRepository.findById(paiementId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            if (!paiement.isDiscountRequested()) {
                response.put("status", "error");
                response.put("message", "This payment doesn't have a discount request");
                return ResponseEntity.badRequest().body(response);
            }

            paiement.setDiscountStatus(Paiement.DiscountStatus.APPROVED);
            paiement.setDiscountApproved(true);
            paiement.setMontant((int)(paiement.getMontant() * 0.8)); // Apply 20% discount

            paiementRepository.save(paiement);

            response.put("status", "success");
            response.put("message", "Discount approved successfully");
            response.put("newAmount", paiement.getMontant());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }



    public ResponseEntity<Map<String, Object>> rejectDiscountRequest(Long paiementId, String reason) {
        Map<String, Object> response = new HashMap<>();

        try {
            Paiement paiement = paiementRepository.findById(paiementId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            paiement.setDiscountStatus(Paiement.DiscountStatus.REJECTED);
            paiement.setDiscountApproved(false);
            if (reason != null) {
                paiement.setDisabilityCardId("REJECTED: " + reason); // Store rejection reason
            }

            paiementRepository.save(paiement);

            response.put("status", "success");
            response.put("message", "Discount rejected successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
}