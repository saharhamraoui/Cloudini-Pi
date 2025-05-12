package tn.esprit.pi.services;

import org.springframework.stereotype.Service;

@Service
public class SignalService {

    // Envoi de l'offre WebRTC
    public void sendOfferToReceiver(String offer) {
        // Logique pour envoyer l'offre à l'autre utilisateur
        System.out.println("Sending offer: " + offer);
    }

    // Envoi de la réponse WebRTC
    public void sendAnswerToReceiver(String answer) {
        // Logique pour envoyer la réponse à l'autre utilisateur
        System.out.println("Sending answer: " + answer);
    }

    // Envoi du candidat ICE WebRTC
    public void sendIceCandidateToReceiver(String iceCandidate) {
        // Logique pour envoyer le candidat ICE à l'autre utilisateur
        System.out.println("Sending ICE Candidate: " + iceCandidate);
    }
}
