package tn.esprit.pi.services;

import tn.esprit.pi.entities.Comment;
import tn.esprit.pi.entities.Notification;
import tn.esprit.pi.entities.Post;
import tn.esprit.pi.entities.User;

import java.util.List;

public interface INotificationService {
    void notifyNewPost(Post post);
    void notifyNewComment(User recipient, Comment comment);
    List<Notification> getUserNotifications(Long userId);
    void markAsRead(Long notificationId);
    void markAllAsRead(Long userId);
    long getUnreadNotificationsCount(Long userId);

    void notifyNewReply(User author, Comment savedReply);
}
