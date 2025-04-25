package tn.esprit.pi.services;

import tn.esprit.pi.entities.User;
import tn.esprit.pi.repositories.NotificationRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.pi.entities.Comment;
import tn.esprit.pi.entities.Notification;
import tn.esprit.pi.entities.Post;
import tn.esprit.pi.repositories.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements INotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional

    public void notifyNewPost(Post post) {
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

  @Override
  @Transactional
  public void notifyNewReply(User recipient, Comment reply) {
    if (recipient == null) {
      throw new IllegalArgumentException("Le destinataire est null");
    }
    if (reply == null || reply.getAuthor() == null) {
      throw new IllegalArgumentException("Réponse ou auteur invalide");
    }

    String contentPreview = reply.getContent().length() > 30
      ? reply.getContent().substring(0, 30) + "..."
      : reply.getContent();

    String message = String.format("%s a répondu à votre commentaire: %s",
      reply.getAuthor().getFirstName(),
      contentPreview);

    Notification notification = new Notification(message, recipient);
    notification.setContentType("COMMENT_REPLY");
    notification.setContentId(reply.getId());
    notification.setSenderId(reply.getAuthor().getIdUser());

    notificationRepository.save(notification);
  }
}

