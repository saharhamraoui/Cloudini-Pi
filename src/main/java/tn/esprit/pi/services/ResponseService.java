package tn.esprit.pi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.Response;
import tn.esprit.pi.exceptions.ResourceNotFoundException;
import tn.esprit.pi.repository.ResponseRepository;

import java.util.List;

@Service
public class ResponseService implements IResponseService {
    @Autowired
    private ResponseRepository responseRepository;

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
    public Response createResponse(Response response) {
        return responseRepository.save(response);
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


