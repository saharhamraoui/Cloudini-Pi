package tn.esprit.pi.services;

import tn.esprit.pi.entities.Reclamation;
import tn.esprit.pi.entities.Response;

import java.util.List;

public interface IResponseService {
     List<Response> getAllResponses();
     Response getResponseById(Long id);
     Response createResponse(Response response);
     void deleteResponse(Long id);
    List<Response> getResponsesByReclamationId(Long reclamationId);
    Response updateResponse(Response response);
    List<Response> findByReclamationId(Long reclamationId);
}
