package tn.esprit.pi.services;

import tn.esprit.pi.entities.Reclamation;

import java.util.List;

public interface IReclamationService {
    List<Reclamation> getAllReclamations();
    Reclamation getReclamationById(Long id);
    Reclamation createReclamation(Reclamation reclamation);
    Reclamation updateReclamation(Reclamation reclamation);
    void deleteReclamation(Long id);
}
