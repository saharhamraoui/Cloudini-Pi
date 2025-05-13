package tn.esprit.pi.controllers;


import tn.esprit.pi.services.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sms")
public class SmsController {

    @Autowired
    private SmsService smsService;

    @PostMapping("/send/{to}/{body}")
    public String sendSms(@PathVariable("to") String to, @PathVariable("body") String body) {
        return smsService.sendSms(to, body);
    }

}
