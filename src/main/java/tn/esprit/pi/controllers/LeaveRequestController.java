package tn.esprit.pi.controllers;

import tn.esprit.pi.services.LeaveRequestService;
import tn.esprit.pi.entities.LeaveRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave-requests")
@CrossOrigin(origins = "http://localhost:4200")

public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    @PostMapping
    public ResponseEntity<LeaveRequest> createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        return ResponseEntity.ok(leaveRequestService.createLeaveRequest(leaveRequest));
    }

    @GetMapping("/{assistantEmail}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequests(@PathVariable String assistantEmail) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestsByAssistant(assistantEmail));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<LeaveRequest>> getAll() {
        return ResponseEntity.ok(leaveRequestService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveRequest> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(leaveRequestService.updateLeaveRequestStatus(id, status));
    }
}
