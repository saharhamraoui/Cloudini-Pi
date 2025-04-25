package esprit.tn.pidev.Services;

import esprit.tn.pidev.entities.*;
import esprit.tn.pidev.Repositories.NotificationRepository;
import esprit.tn.pidev.Repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements INotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional

    public void notifyNewPost(Post post) {
        // Vérification nullité de l'auteur
        if (post.getAuthor() == null) {
            throw new IllegalArgumentException("L'auteur du post est null");
        }

        String message = "Nouveau post publié: " + post.getTitle();
        long authorId = post.getAuthor().getIdUser(); // Note: type primitif long

        userRepository.findAll().stream()
                .filter(user -> user.getIdUser() != authorId) // Comparaison directe avec !=
                .forEach(user -> {
                    Notification notification = new Notification(message, user);
                    notificationRepository.save(notification);
                });
    }

    @Override
    @Transactional
    public void notifyNewComment(User recipient, Comment comment) {
        String contentPreview = comment.getContent().length() > 30
                ? comment.getContent().substring(0, 30) + "..."
                : comment.getContent();

        String message = "Nouveau commentaire de " + comment.getAuthor().getFirstName() + ": " + contentPreview;

        Notification notification = new Notification(message, recipient);
        notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId)
                .ifPresent(notification -> {
                    notification.setSeen(true);
                    notificationRepository.save(notification);
                });
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.findByRecipientIdAndSeenFalse(userId)
                .forEach(notification -> {
                    notification.setSeen(true);
                    notificationRepository.save(notification);
                });
    }

    @Override
    public long getUnreadNotificationsCount(Long userId) {
        return notificationRepository.countByRecipientIdAndSeenFalse(userId);
    }
}