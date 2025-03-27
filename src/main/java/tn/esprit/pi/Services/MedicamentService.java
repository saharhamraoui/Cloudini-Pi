package tn.esprit.pi.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.Repositories.FournisseurRepository;
import tn.esprit.pi.Repositories.MedicamentRepository;
import tn.esprit.pi.entities.Fournisseur;
import tn.esprit.pi.entities.Medicament;

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


}
