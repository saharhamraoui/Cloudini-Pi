package tn.esprit.pi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.services.SignalService;

@CrossOrigin(origins = "http://192.168.1.122:32584")
@RestController
@RequestMapping("/signal")

public class SignalController {

    @Autowired
    private SignalService signalService;

    // Endpoint pour envoyer une offre
    @PostMapping("/sendOffer")
    public String sendOffer(@RequestBody String offer) {
        // Logic to send offer to the receiver (e.g., doctor or patient)
        signalService.sendOfferToReceiver(offer);
        return "Offer sent successfully";
    }

    // Endpoint pour envoyer une réponse (acceptation/rejet)
    @PostMapping("/sendAnswer")
    public String sendAnswer(@RequestBody String answer) {
        // Logic to send the answer to the receiver
        signalService.sendAnswerToReceiver(answer);
        return "Answer sent successfully";
    }

    // Endpoint pour envoyer un candidat ICE
    @PostMapping("/sendIceCandidate")
    public String sendIceCandidate(@RequestBody String iceCandidate) {
        // Logic to send the ICE candidate to the receiver
        signalService.sendIceCandidateToReceiver(iceCandidate);
        return "ICE Candidate sent successfully";
    }

}
