package tn.esprit.pi.controllers;



import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Paiement;
import tn.esprit.pi.services.IPaiementService;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/paiements")
@CrossOrigin(origins = "http://192.168.1.162:32584")
public class PaiementController {
    @Autowired
    private IPaiementService paiementService;

    @CrossOrigin(origins = "http://192.168.1.162:32584")
    @GetMapping("getPaiements")
    public List<Paiement> getAllPaiements() {
        return paiementService.getAllPaiements();
    }

    @PostMapping("/add")
    public Paiement addPaiement(@RequestBody Paiement paiement) {
        return paiementService.addPaiement(paiement);
    }

    @PutMapping("/{id}")
    public Paiement updatePaiement(@PathVariable Long id, @RequestBody Paiement paiementDetails) {
        return paiementService.updatePaiement(id, paiementDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePaiement(@PathVariable Long id) {
        paiementService.deletePaiement(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Paiement supprimé avec succès.");
        return ResponseEntity.ok(response);
    }

    // Nouvelle méthode pour récupérer les paiements par e-mail du médecin
    @GetMapping("/doctor/{emailMedecin}")
    public List<Paiement> getPaymentsByDoctor(@PathVariable String emailMedecin) {
        return paiementService.getPaymentsByDoctor(emailMedecin);
    }

    @GetMapping("/user/{user}")
    public List<Paiement> getPaymentsByUser(@PathVariable String user) {
        return paiementService.getPaymentsByUser(user);
    }


    @GetMapping("/paiements/{id}")
    public Paiement getPaymentById(@PathVariable Long id) {
        return paiementService.getPaymentsById(id);
    }

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }


    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Paiement paiement) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (paiement.getMontant() * 100)) // Stripe uses cents
                    .setCurrency("usd")
                    .setDescription("Paiement pour: " + paiement.getNomPatient())
                    .setReceiptEmail(paiement.getEmailMedecin())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            Map<String, String> responseData = new HashMap<>();
            responseData.put("clientSecret", intent.getClientSecret());

            return ResponseEntity.ok(responseData);

        } catch (StripeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject-discount")
    public Paiement rejectDiscount(@PathVariable Long id) {
        return paiementService.rejectDiscount(id);
    }

    @PostMapping("/{id}/approve-discount")
    public Paiement approveDiscount(@PathVariable Long id) {
         return paiementService.approveDiscount(id);
    }
}