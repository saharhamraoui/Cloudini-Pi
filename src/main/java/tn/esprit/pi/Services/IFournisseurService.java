package tn.esprit.pi.Services;


import tn.esprit.pi.entities.Fournisseur;

import java.util.List;

public interface IFournisseurService {
    Fournisseur addFournisseur(Fournisseur Fournisseur);

    Fournisseur updateFournisseur(Fournisseur Fournisseur);

    void deleteFournisseur(Long idFournisseur);

    List<Fournisseur> getAllFournisseur();

    Fournisseur getFournisseur(Long idFournisseur);
    Fournisseur affecterMedicaments(Long idFournisseur, List<Long> idMedicaments);
}
