package tn.esprit.pi.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.Services.MailService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/mail")

public class MailController {

    @Autowired
    private MailService mailService;

    @PostMapping("/send")
    public String sendEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body) {
        return mailService.sendEmail(to, subject, body);
    }
}