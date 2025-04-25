package tn.esprit.pi.services;

import tn.esprit.pi.entities.Paiement;

import java.util.List;

public interface IPaiementService {

    public List<Paiement> getPaymentsByDoctor(String emailMedecin);
    public List<Paiement> getAllPaiements();

    public Paiement addPaiement(Paiement paiement);

    public Paiement updatePaiement(Long id, Paiement paiementDetails);

    public void deletePaiement(Long id);
    public Paiement getPaymentsById(Long id);

    public List<Paiement> getPaymentsByUser(String user);
}