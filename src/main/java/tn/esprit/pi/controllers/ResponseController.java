package tn.esprit.pi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Response;
import tn.esprit.pi.services.ResponseService;

import java.util.List;

@CrossOrigin(origins = "http://198.162.1.122:30596")
@RestController
@RequestMapping("/api/responses")
public class ResponseController {

    @Autowired
    private ResponseService responseService;

    @GetMapping("/getallresponses")
    public List<Response> getAllResponses() {
        return responseService.getAllResponses();
    }

    @GetMapping("getresponsebyid/{id}")
    public Response getResponseById(@PathVariable Long id) {
        return responseService.getResponseById(id);

    }

    @GetMapping("/getresponsebyRecid/{reclamationId}")
    public List<Response> getResponsesByReclamationId(@PathVariable Long reclamationId) {
        return responseService.getResponsesByReclamationId(reclamationId);
    }
    @PutMapping("/updateresponse")
    public Response updateResponse(@RequestBody Response response) {
        return responseService.updateResponse(response);
    }

    @PostMapping("/{reclamationId}/create")
    public Response createResponse(@PathVariable Long reclamationId, @RequestBody Response response) {
        return responseService.createResponse(reclamationId, response);
    }

    @DeleteMapping("/{id}")
    public void deleteResponse(@PathVariable Long id) {
        responseService.deleteResponse(id);
    }

    @GetMapping("/finbyrecid/{id}")
    public List<Response> findByReclamationId(@PathVariable Long id) {
        return responseService.findByReclamationId(id);
    }
}
