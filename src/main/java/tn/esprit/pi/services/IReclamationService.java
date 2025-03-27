package tn.esprit.pi.services;

import tn.esprit.pi.entities.Reclamation;

import java.util.List;

public interface IReclamationService {
    public List<Reclamation> getAllReclamations();
    public Reclamation getReclamationById(Long id);
    public Reclamation createReclamation(Reclamation reclamation);
    public void deleteReclamation(Long id);
}
