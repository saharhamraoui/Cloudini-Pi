package tn.esprit.pi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.repositories.FournisseurRepository;
import tn.esprit.pi.repositories.MedicamentRepository;
import tn.esprit.pi.entities.Fournisseur;
import tn.esprit.pi.entities.Medicament;

import java.time.LocalDate;
import java.util.List;

@Service
public class MedicamentService implements IMedicamentService {
    @Autowired
    MedicamentRepository medicamentRepository;
    @Autowired
    private FournisseurRepository fournisseurRepository;

    @Override
    public Medicament addMedicament(Medicament Medicament) {
        return medicamentRepository.save(Medicament);
    }

    @Override
    public Medicament updateMedicament(Medicament Medicament) {
        return medicamentRepository.save(Medicament);

    }

    @Override
    public void deleteMedicament(Long idMedicament) {
    medicamentRepository.deleteById(idMedicament);
    }

    @Override
    public List<Medicament> getAllMedicament() {
        return medicamentRepository.findAll();
    }

    @Override
    public Medicament getMedicament(Long idMedicament) {
        return medicamentRepository.findById(idMedicament).get();
    }

    @Override
    public Medicament affecterMedicament(Long idMedicament, Long idFournisseur) {
        Medicament medicament = medicamentRepository.findById(idMedicament).orElseThrow(
                () -> new RuntimeException("Medicament not found")
        );
        Fournisseur fournisseur = fournisseurRepository.findById(idFournisseur).orElseThrow(
                () -> new RuntimeException("Fournisseur not found")
        );
        medicament.setFournisseur(fournisseur);
        return medicamentRepository.save(medicament);
    }




    @Override
    public Medicament ajouterMedicamentEtAffecterFournisseur(Long idFournisseur, Medicament medicament) {
        // Récupérer le fournisseur par son ID
        Fournisseur fournisseur = fournisseurRepository.findById(idFournisseur).orElseThrow(
                () -> new RuntimeException("Fournisseur not found")
        );

        // Affecter le fournisseur au médicament
        medicament.setFournisseur(fournisseur);

        // Sauvegarder le médicament avec l'affectation
        return medicamentRepository.save(medicament);
    }
@Override
    public List<Medicament> getMedicamentsProchesExpiration() {
        LocalDate dateLimite = LocalDate.now().plusDays(30);
        return medicamentRepository.findByDateExpirationBefore(dateLimite);
    }
    @Override
    public Medicament desaffecterFournisseur(Long idMedicament) {
        Medicament medicament = medicamentRepository.findById(idMedicament).orElseThrow(
                () -> new RuntimeException("Medicament not found")
        );

        medicament.setFournisseur(null); // Désaffecter le fournisseur

        return medicamentRepository.save(medicament);
    }
    @Override
    public String getFournisseurNameById(Long idFournisseur) {
        Fournisseur fournisseur = fournisseurRepository.findById(idFournisseur).orElseThrow(
                () -> new RuntimeException("Fournisseur not found")
        );
        return fournisseur.getNom();
    }

}
