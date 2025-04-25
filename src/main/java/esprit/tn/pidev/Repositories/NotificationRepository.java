package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.Notification;
import esprit.tn.pidev.entities.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient(User user);
    List<Notification> findByRecipientAndSeenFalse(User user);
    long countByRecipientAndSeenFalse(User user);

    @Query("SELECT n FROM Notification n WHERE n.recipient = :user ORDER BY n.createdAt DESC")
    List<Notification> findRecentByUser(User user);
}