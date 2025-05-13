package tn.esprit.pi.entities;

import tn.esprit.pi.entities.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private boolean seen = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "idUser", nullable = false)
    private User recipient;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "content_id")
    private Long contentId;

    @Column(name = "sender_id")
    private Long senderId;

    public Notification(String message, User recipient) {
        this.message = message;
        this.recipient = recipient;
    }
}
