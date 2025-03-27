package tn.esprit.pi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.Reclamation;
import tn.esprit.pi.exceptions.ResourceNotFoundException;
import tn.esprit.pi.repository.ReclamationRepository;

import java.util.List;

@Service
public class ReclamationService implements IReclamationService {
    @Autowired
    private ReclamationRepository reclamationRepository;

    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }

    public Reclamation getReclamationById(Long id) {
        return reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reclamation not found with id: " + id));
    }

    public Reclamation createReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }

    public void deleteReclamation(Long id) {
        reclamationRepository.deleteById(id);
    }
}
