package esprit.tn.pidev.Controllers;


import esprit.tn.pidev.Services.SmsService;
import jakarta.websocket.server.PathParam;
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
