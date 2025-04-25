package esprit.tn.pidev.Services;

import esprit.tn.pidev.Repositories.LeaveRequestRepository;
import esprit.tn.pidev.entities.LeaveRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getLeaveRequestsByAssistant(String assistantEmail) {
        return leaveRequestRepository.findByAssistantEmail(assistantEmail);
    }
    public List<LeaveRequest> getAll() {
        return leaveRequestRepository.findAll();
    }


    public LeaveRequest updateLeaveRequestStatus(Long id, String status) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id).orElseThrow();
        leaveRequest.setStatus(status);
        return leaveRequestRepository.save(leaveRequest);
    }
}
