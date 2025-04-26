package tn.esprit.pi.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.PasswordResetRequest;
import tn.esprit.pi.services.PasswordResetService;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {
//    private static final Logger logger = LoggerFactory.getLogger(PasswordResetController.class);
//
//    private final PasswordResetService passwordResetService;
//
//    @Autowired
//    public PasswordResetController(PasswordResetService passwordResetService) {
//        this.passwordResetService = passwordResetService;
//    }
//
//    @PostMapping("/forgot-password")
//    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
//        String email = request.get("email");
//
//        try {
//            logger.info("Demande reset password pour: {}", email);
//            passwordResetService.initiatePasswordReset(email);
//
//            return ResponseEntity.ok()
//                    .body(Map.of(
//                            "message", "Si l'email existe, un lien a été envoyé",
//                            "timestamp", LocalDateTime.now()
//                    ));
//
//        } catch (Exception e) {
//            logger.error("ECHEC reset password pour {}: {}", email, e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of(
//                            "error", "Service temporairement indisponible",
//                            "details", e.getMessage()
//                    ));
//        }
//    }
//
//    @PostMapping("/reset-password")
//    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody PasswordResetRequest request) {
//        try {
//            passwordResetService.completePasswordReset(
//                    request.getToken(),
//                    request.getNewPassword()
//            );
//
//            return ResponseEntity.ok()
//                    .contentType(MediaType.APPLICATION_JSON)
//                    .body(Collections.singletonMap(
//                            "message", "Votre mot de passe a été réinitialisé avec succès"
//                    ));
//
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest()
//                    .contentType(MediaType.APPLICATION_JSON)
//                    .body(Collections.singletonMap(
//                            "error", e.getMessage()
//                    ));
//        }
//    }
}