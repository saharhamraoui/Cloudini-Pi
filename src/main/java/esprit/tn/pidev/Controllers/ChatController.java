package esprit.tn.pidev.Controllers;

import esprit.tn.pidev.Services.EmailSender;
import esprit.tn.pidev.Services.MedicalRecordService;
import esprit.tn.pidev.Services.PrescriptionService;
import esprit.tn.pidev.entities.MedicalRecord;
import esprit.tn.pidev.entities.Prescription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import esprit.tn.pidev.Services.GeminiService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:4200")
public class ChatController {

    @Autowired
    private EmailSender emailService;

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private MedicalRecordService medicalRecordService;


    @Autowired
    private GeminiService chatService;

    @PostMapping("/ask")
    public Map<String, String> askQuestion(@RequestBody Map<String, String> body) {
        String message = body.get("message");
        String lowerMessage = message.toLowerCase();

        if (lowerMessage.contains("my prescription") || lowerMessage.contains("prescriptions")) {
            List<Prescription> prescriptions = prescriptionService.getPrescriptions();
            StringBuilder result = new StringBuilder("Here are your prescriptions:\n");
            for (Prescription p : prescriptions) {
                result.append("- ").append(p.getMedication())
                        .append(" (").append(p.getDosage()).append(")\n");
            }
            return Map.of("response", result.toString());
        } else if (lowerMessage.contains("my medical record") || lowerMessage.contains("medical records")) {
            List<MedicalRecord> medicalRecords = medicalRecordService.getMedicalRecords();
            for (MedicalRecord record : medicalRecords) {
                String result = "Your medical record:\n" +
                        "Diagnosis: " + record.getDiagnosis() + "\n" +
                        "Doctor: " + record.getDoctor().getFirstName() + "\n" +
                        "Notes: " + record.getNotes();
                return Map.of("response", result);
            }
        } else if (lowerMessage.contains("send reminder") || lowerMessage.contains("email reminder")) {
            // Basic example — you can customize the address, subject, and body
            String to = "saaharhamraoui@gmail.com"; // Replace with actual user's email from context
            String subject = "Prescription Reminder";
            String emailBody = "Hello! This is a reminder to take your medications.";

            String status = emailService.sendEmail(to, subject, emailBody);
            return Map.of("response", "Reminder email sent: " + status);
        }

        // Default: use Gemini AI
        String response = chatService.ask(message);
        return Map.of("response", response);
    }


    // New endpoint to list available models
    @GetMapping("/listModels")
    public String listModels() {
        return chatService.listAvailableModels();
    }
}
