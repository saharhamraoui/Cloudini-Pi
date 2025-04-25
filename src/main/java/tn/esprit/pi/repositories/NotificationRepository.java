package tn.esprit.pi.repositories;

import tn.esprit.pi.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.User;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Méthodes avec User complet
    List<Notification> findByRecipientOrderByCreatedAtDesc(User user);
    List<Notification> findByRecipientAndSeenFalse(User user);

    // Méthodes avec ID utilisant @Query
    @Query("SELECT n FROM Notification n WHERE n.recipient.idUser = :userId ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE n.recipient.idUser = :userId AND n.seen = false")
    List<Notification> findByRecipientIdAndSeenFalse(@Param("userId") Long userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient.idUser = :userId AND n.seen = false")
    long countByRecipientIdAndSeenFalse(@Param("userId") Long userId);
}
