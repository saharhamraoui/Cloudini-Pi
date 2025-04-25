package esprit.tn.pidev.Services;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${auth_token}")
    private String authToken;

    @Value("${from_number}")
    private String fromNumber;

    // Cette méthode est appelée automatiquement après l’injection des dépendances
    @PostConstruct
    public void initTwilio() {
        Twilio.init(accountSid, authToken);
    }

    public String sendSms(String to, String body) {
        try {
            Message message = Message.creator(
                    new com.twilio.type.PhoneNumber(to),
                    new com.twilio.type.PhoneNumber(fromNumber),
                    body
            ).create();

            return "SMS envoyé avec SID : " + message.getSid();
        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur lors de l'envoi du SMS : " + e.getMessage();
        }
    }
}
