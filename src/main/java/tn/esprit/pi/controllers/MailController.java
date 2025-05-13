package tn.esprit.pi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.services.MailService;


@CrossOrigin(origins = "http://198.162.1.122:32584")
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

