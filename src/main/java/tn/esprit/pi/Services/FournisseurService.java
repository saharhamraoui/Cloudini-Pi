package tn.esprit.pi.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.Repositories.FournisseurRepository;
import tn.esprit.pi.Repositories.MedicamentRepository;
import tn.esprit.pi.entities.Fournisseur;
import tn.esprit.pi.entities.Medicament;

import java.util.List;

@Service
public class FournisseurService implements IFournisseurService {
    @Autowired
    private FournisseurRepository fournisseurRepository;
    @Autowired
    private MedicamentRepository medicamentRepository;
    @Override
    public Fournisseur addFournisseur(Fournisseur Fournisseur) {
        return fournisseurRepository.save(Fournisseur);
    }

    @Override
    public Fournisseur updateFournisseur(Fournisseur Fournisseur) {
        return fournisseurRepository.save(Fournisseur);
    }

    @Override
    public void deleteFournisseur(Long idFournisseur) {
   fournisseurRepository.deleteById(idFournisseur);
    }

    @Override
    public List<Fournisseur> getAllFournisseur() {
        return fournisseurRepository.findAll();
    }

    @Override
    public Fournisseur getFournisseur(Long idFournisseur) {
        return fournisseurRepository.findById(idFournisseur).get();
    }
    @Override
    public Fournisseur affecterMedicaments(Long idFournisseur, List<Long> idMedicaments) {
        Fournisseur fournisseur = fournisseurRepository.findById(idFournisseur).orElseThrow(
                () -> new RuntimeException("Fournisseur not found")
        );

        List<Medicament> medicaments = medicamentRepository.findAllById(idMedicaments);
        for (Medicament med : medicaments) {
            med.setFournisseur(fournisseur);
        }

        medicamentRepository.saveAll(medicaments);
        return fournisseur;
    }

}
