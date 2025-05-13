package tn.esprit.pi.services;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.Reclamation;
import tn.esprit.pi.entities.Response;
import tn.esprit.pi.entities.StatutReclamation;
import tn.esprit.pi.exceptions.ResourceNotFoundException;
import tn.esprit.pi.repository.ReclamationRepository;
import tn.esprit.pi.repository.ResponseRepository;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class ResponseService implements IResponseService {
    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private ReclamationRepository reclamationRepository;

    @Override
    public List<Response> getAllResponses() {
        return responseRepository.findAll();
    }

    @Override
    public Response getResponseById(Long id) {
        return responseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Response not found with id: " + id));
    }

    @Override
    public Response createResponse(Long reclamationId, Response response) {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reclamation not found"));

        // Maintain bidirectional relationship
        response.setReclamation(reclamation);  // Critical fix here
        reclamation.getResponses().add(response);

        // Update status if needed
        if (reclamation.getStatus() == StatutReclamation.PENDING) {
            reclamation.setStatus(StatutReclamation.IN_PROGRESS);
            reclamation.setUpdatedAt(new Date());
        }

        // Only save the reclamation - responses are cascaded
        reclamationRepository.save(reclamation);

        return response; // The response will be persisted through cascade
    }
    @Override
    public void deleteResponse(Long id) {
        responseRepository.deleteById(id);
    }



    @Override
    public List<Response> getResponsesByReclamationId(Long reclamationId) {
        return responseRepository.findByReclamationId(reclamationId);
    }

    @Override
    public Response updateResponse(Response response) {
        return responseRepository.save(response);
    }

    @Override
    public List<Response> findByReclamationId(Long reclamationId) {
        return responseRepository.findByReclamationId(reclamationId);
    }
}


