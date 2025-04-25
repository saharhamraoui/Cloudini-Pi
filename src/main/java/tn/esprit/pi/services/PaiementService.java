package tn.esprit.pi.services;


import tn.esprit.pi.repositories.PaiementRepository;
import tn.esprit.pi.entities.Paiement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaiementService implements IPaiementService  {
    @Autowired
    private PaiementRepository paiementRepository;

    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }

    public Paiement addPaiement(Paiement paiement) {
        return paiementRepository.save(paiement);
    }

    public Paiement updatePaiement(Long id, Paiement paiementDetails) {
        Paiement paiement = paiementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé avec l'id : " + id));
        paiement.setNomPatient(paiementDetails.getNomPatient());
        paiement.setMontant(paiementDetails.getMontant());
        paiement.setModeDePaiement(paiementDetails.getModeDePaiement());
        paiement.setDatePaiement(paiementDetails.getDatePaiement());
        paiement.setStatut(paiementDetails.getStatut());
        paiement.setEmailMedecin(paiementDetails.getEmailMedecin());
        return paiementRepository.save(paiement);
    }

    public void deletePaiement(Long id) {
        paiementRepository.deleteById(id);
    }

    @Override
    public Paiement getPaymentsById(Long id) {
        return paiementRepository.findById(id).orElse(null);
    }

    // Nouvelle méthode pour récupérer les paiements par e-mail du médecin
    public List<Paiement> getPaymentsByDoctor(String emailMedecin) {
        return paiementRepository.findByEmailMedecin(emailMedecin);
    }
    public List<Paiement> getPaymentsByUser(String user) {
        return paiementRepository.findByNomPatient(user);
    }
}
