package tn.esprit.pi.repositories;

import tn.esprit.pi.entities.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {
List<Paiement> findByNomPatientContaining(String nomPatient);

    List<Paiement> findByStatut(String statut);

    List<Paiement> findByDatePaiement(LocalDate date);

    List<Paiement> findByEmailMedecin(String emailMedecin);

    List<Paiement> findByNomPatient(String user);
    List<Paiement> findByEmailMedecinAndStatut(String user, String statut);

    List<Paiement> findByDiscountRequestedTrueAndDiscountStatus(Paiement.DiscountStatus status);
}
