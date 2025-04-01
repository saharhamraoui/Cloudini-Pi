package tn.esprit.pi.services;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.User;
import tn.esprit.pi.repositories.UserRepository;

import java.time.LocalDate;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class PasswordResetService {
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    public PasswordResetService(@Qualifier("bCryptPasswordEncoder") PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.reset-password.expiration}")
    private int expirationHours;

    @Value("${brevo.sender.email}")  // Nouvelle propriété pour l'email de l'expéditeur
    private String senderEmail;

    public void initiatePasswordReset(String email) {
        try {
            logger.info("Tentative de réinitialisation pour l'email: {}", email);

            User user = userRepository.findByEmail(email);
            if (user == null) {
                logger.warn("Email non trouvé: {}", email);
                throw new RuntimeException("Si cet email existe, un lien de réinitialisation a été envoyé");
            }

            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setTokenExpiryDate(LocalDateTime.now().plusHours(expirationHours));
            userRepository.save(user);

            logger.info("Token généré pour {}: {}", email, token);
            sendResetEmail(user.getEmail(), token);

        } catch (Exception e) {
            logger.error("Erreur lors de l'initiation de la réinitialisation pour {}", email, e);
            throw e;
        }
    }
    @Transactional

    public void completePasswordReset(String token, String newPassword) {
        try {
            logger.info("Tentative de réinitialisation avec le token: {}", token);

            User user = userRepository.findByResetToken(token);
            if (user == null) {
                logger.warn("Token invalide: {}", token);
                throw new RuntimeException("Lien de réinitialisation invalide");
            }

            if (user.getTokenExpiryDate() == null || user.getTokenExpiryDate().isBefore(LocalDateTime.now())) {
                logger.warn("Token expiré: {}", token);
                throw new RuntimeException("Le lien de réinitialisation a expiré");
            }

            String hashedPassword = passwordEncoder.encode(newPassword);
            logger.info("Nouveau mot de passe haché: {}", hashedPassword);

            user.setPassword(hashedPassword);
            user.setResetToken(null);
            user.setTokenExpiryDate(null);

            userRepository.save(user);

            logger.info("Mot de passe réinitialisé avec succès pour l'utilisateur: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Erreur lors de la réinitialisation du mot de passe", e);
            throw e;
        }
    }

    private void sendResetEmail(String email, String token) throws MailException {
        try {
            String resetLink = baseUrl + "/reset-password?token=" + token;
            logger.info("Génération du lien de reset: {}", resetLink);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(email);
            message.setSubject("Réinitialisation de mot de passe - " + LocalDate.now());
            message.setText(
                    "Bonjour,\n\n" +
                            "Pour réinitialiser votre mot de passe, cliquez sur ce lien :\n" +
                            resetLink + "\n\n" +
                            "Ce lien expirera dans " + expirationHours + " heures.\n\n" +
                            "Cordialement,\nVotre équipe support"
            );

            logger.debug("Tentative d'envoi email à: {}", email);
            mailSender.send(message);
            logger.info("Email envoyé avec succès à {}", email);

        } catch (MailException e) {
            logger.error("ÉCHEC envoi email à {} - Erreur: {}", email, e.getMessage());
            throw new RuntimeException("Le service d'email est temporairement indisponible", e);
        }
    }
    public boolean isResetTokenValid(String token) {
        User user = userRepository.findByResetToken(token);
        boolean isValid = user != null &&
                user.getTokenExpiryDate() != null &&
                !user.getTokenExpiryDate().isBefore(LocalDateTime.now());

        logger.debug("Validation du token {}: {}", token, isValid);
        return isValid;
    }
}