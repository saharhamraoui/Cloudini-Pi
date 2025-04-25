package tn.esprit.pi.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${brevo.sender.email}")
    private String fromEmail;

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String code) throws MailException {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail); // Email vérifié dans Brevo
            message.setTo(toEmail);
            message.setSubject("[MedCare] Vérification d'email");
            message.setText(String.format(
                    "Bonjour,\n\n"
                            + "Votre code de vérification est : %s\n\n"
                            + "Ce code est valable 30 minutes.\n\n"
                            + "Cordialement,\nL'équipe MedCare",
                    code
            ));

            mailSender.send(message);
            logger.info("Email de vérification envoyé à {} | Code: {}", toEmail, code);

        } catch (MailException ex) {
            logger.error("ÉCHEC envoi vérification à {} | Erreur: {}", toEmail, ex.getMessage());
            throw new RuntimeException("Erreur d'envoi d'email de vérification", ex);
        }
    }

    // Méthode commune pour le reset password
    public void sendPasswordResetEmail(String email, String token, String resetLink, int expirationHours) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Réinitialisation de mot de passe");
            message.setText(String.format(
                    "Bonjour,\n\n"
                            + "Cliquez sur ce lien pour réinitialiser votre mot de passe :\n%s\n\n"
                            + "Lien valable %d heures.\n\n"
                            + "Cordialement,\nVotre équipe support",
                    resetLink, expirationHours
            ));

            mailSender.send(message);
            logger.info("Email de reset envoyé à {} | Token: {}", email, token);

        } catch (MailException ex) {
            logger.error("ÉCHEC envoi reset à {} | Erreur: {}", email, ex.getMessage());
            throw new RuntimeException("Erreur d'envoi d'email de réinitialisation", ex);
        }
    }
}