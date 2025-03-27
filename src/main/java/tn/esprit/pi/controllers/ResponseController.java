package tn.esprit.pi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Response;
import tn.esprit.pi.exceptions.ResourceNotFoundException;
import tn.esprit.pi.services.ResponseService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/responses")
public class ResponseController {

    @Autowired
    private ResponseService responseService;

    @GetMapping
    public List<Response> getAllResponses() {
        return responseService.getAllResponses();
    }

    @GetMapping("/{id}")
    public Response getResponseById(@PathVariable Long id) {
        return responseService.getResponseById(id);

    }

    @GetMapping("/reclamation/{reclamationId}")
    public List<Response> getResponsesByReclamationId(@PathVariable Long reclamationId) {
        return responseService.getResponsesByReclamationId(reclamationId);
    }

    @PostMapping
    public Response createResponse(@RequestBody Response response) {
        return responseService.createResponse(response);
    }

    @DeleteMapping("/{id}")
    public void deleteResponse(@PathVariable Long id) {
        responseService.deleteResponse(id);
    }
}
