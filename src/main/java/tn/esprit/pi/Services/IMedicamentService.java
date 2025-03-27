package tn.esprit.pi.Services;

import tn.esprit.pi.entities.Medicament;

import java.util.List;

public interface IMedicamentService  {

    Medicament addMedicament(Medicament Medicament);

    Medicament updateMedicament(Medicament Medicament);

    void deleteMedicament(Long idMedicament);

    List<Medicament> getAllMedicament();

    Medicament getMedicament(Long idMedicament);

    Medicament affecterMedicament(Long idMedicament, Long idFournisseur);
}
