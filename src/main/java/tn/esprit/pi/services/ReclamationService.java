package tn.esprit.pi.services;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.Reclamation;
import tn.esprit.pi.entities.StatutReclamation;
import tn.esprit.pi.exceptions.ResourceNotFoundException;
import tn.esprit.pi.repository.ReclamationRepository;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final CategorizationService categorizationService;

    @Autowired
    public ReclamationService(ReclamationRepository reclamationRepository,
                              CategorizationService categorizationService) {
        this.reclamationRepository = reclamationRepository;
        this.categorizationService = categorizationService;
    }

    public Reclamation createReclamation(Reclamation reclamation) {
        // Set default status if not provided
        if (reclamation.getStatus() == null) {
            reclamation.setStatus(StatutReclamation.PENDING);
        }

        // Handle AI categorization only if description exists
        if (reclamation.getDescription() != null && !reclamation.getDescription().isEmpty()) {
            try {
                CategorizationService.CategorizationResult result =
                        categorizationService.categorizeWithConfidence(reclamation.getDescription());

                // Set both category and confidence from AI results
                reclamation.setCategory(result.getCategory());
                reclamation.setAiConfidence(result.getConfidence());

            } catch (CategorizationService.ServiceException e) {
                // Handle service unavailable scenario
                reclamation.setCategory("uncategorized");
                reclamation.setAiConfidence(0.0);
                // Consider logging the error here
            }
        } else {
            // Handle empty description case
            reclamation.setCategory("uncategorized");
            reclamation.setAiConfidence(0.0);
        }

        // Set creation timestamp (if not handled by @CreatedDate)
        if (reclamation.getCreatedAt() == null) {
            reclamation.setCreatedAt(new Date());
        }

        // Save to database
        return reclamationRepository.save(reclamation);
    }

    public Reclamation updateReclamation(Reclamation reclamation) {
        Reclamation existing = reclamationRepository.findById(reclamation.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reclamation not found"));

        // Automatically set resolution time when status changes to RESOLVED
        if (reclamation.getStatus() == StatutReclamation.RESOLVED
                && existing.getStatus() != StatutReclamation.RESOLVED) {
            existing.setUpdatedAt(new Date()); // Tracks resolution time via updatedAt
        }

        existing.setDescription(reclamation.getDescription());
        existing.setStatus(reclamation.getStatus());

        return reclamationRepository.save(existing);
    }

    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }

    public Reclamation getReclamationById(Long id) {
        return reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reclamation not found"));
    }

    public void deleteReclamation(Long id) {
        reclamationRepository.deleteById(id);
    }

    public void escalatePendingReclamations() {

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, -3);
        Date threeDaysAgo = calendar.getTime();


        List<Reclamation> toEscalate = reclamationRepository.findByStatusAndCreatedAtBefore(
                StatutReclamation.PENDING,
                threeDaysAgo
        );


        toEscalate.forEach(reclamation -> {
            reclamation.setStatus(StatutReclamation.ESCALATED);
            reclamation.setUpdatedAt(new Date());
            reclamationRepository.save(reclamation);
        });
    }
    public Reclamation addFeedback(Long id, String feedback) {
        Reclamation reclamation = getReclamationById(id);
        if (reclamation.getStatus() != StatutReclamation.RESOLVED) {
            throw new IllegalStateException("Cannot add feedback unless resolved.");
        }
        reclamation.setFeedback(feedback);
        return reclamationRepository.save(reclamation);
    }

}