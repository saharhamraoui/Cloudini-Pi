package tn.esprit.pi.controllers;


import esprit.tn.pidev.entities.PayementResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.services.KonnectPaymentService;

@RestController
@RequestMapping("/konnect")
@CrossOrigin(origins = "http://192.168.1.162:32584")
public class KonnectPaymentController {

    @Autowired
    private KonnectPaymentService konnectPaymentService;

    @PostMapping("/init-payment/{amount}/{emailClient}")
    public PayementResponse initPayment(@PathVariable float amount, @PathVariable String emailClient) {
        return konnectPaymentService.initPayment(amount, emailClient);
    }
}
