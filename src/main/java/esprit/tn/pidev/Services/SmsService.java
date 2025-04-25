package esprit.tn.pidev.Services;


import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    // Replace with your Twilio credentials
    private static final String ACCOUNT_SID = "AC3ffab2df212130fd9df97dde0230c82a";
    private static final String AUTH_TOKEN = "52f245b0d37e28f54527b86466df05a1";
    private static final String FROM_NUMBER = "+12319992092";

    static {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    public String sendSms(String to, String body) {
        try {
            Message message = Message.creator(
                    new com.twilio.type.PhoneNumber(to),
                    new com.twilio.type.PhoneNumber(FROM_NUMBER),
                    body
            ).create();

            return "SMS envoyé avec SID : " + message.getSid();
        } catch (Exception e) {
            e.printStackTrace(); // Affiche l'erreur dans la console
            return "Erreur lors de l'envoi du SMS : " + e.getMessage();
        }
    }


}

