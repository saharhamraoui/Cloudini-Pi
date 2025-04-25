package esprit.tn.pidev.Services;

import esprit.tn.pidev.entities.*;
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
