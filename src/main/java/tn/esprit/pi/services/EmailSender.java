package tn.esprit.pi.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailSender {

    @Autowired
    private JavaMailSender mailSender;

    public String sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Définir l'adresse de l'expéditeur comme "no-reply"
            helper.setFrom(new InternetAddress("no-reply@tondomaine.com", "No Reply - Hôpital Management"));
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // Contenu en HTML (si nécessaire)

            mailSender.send(message);
            return "Email envoyé avec succès!";
        } catch (MessagingException e) {
            return "Échec de l'envoi de l'email : " + e.getMessage();
        } catch (Exception e) {
            return "Erreur générale : " + e.getMessage();
        }
    }
}
