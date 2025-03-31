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
        String message = "Nouveau post publié: " + post.getTitle();
        List<User> allUsers = userRepository.findAll();

        allUsers.stream()
                .filter(user -> user.getIdUser() != post.getAuthor().getIdUser())
                .forEach(user -> {
                    Notification notification = new Notification(message, user);
                    notificationRepository.save(notification);
                });
    }

    @Override
    @Transactional
    public void notifyNewComment(User recipient, Comment comment) {
        String message = "Nouveau commentaire de " +
                comment.getAuthor().getFirstName() +
                ": " + comment.getContent().substring(0, Math.min(30, comment.getContent().length())) + "...";

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
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification non trouvée"));

        if (!notification.isSeen()) {
            notification.setSeen(true);
            notificationRepository.save(notification);
        }
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByRecipientIdAndSeenFalse(userId);
        unreadNotifications.forEach(notification -> notification.setSeen(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    @Override
    public long getUnreadNotificationsCount(Long userId) {
        return notificationRepository.countByRecipientIdAndSeenFalse(userId);
    }
}