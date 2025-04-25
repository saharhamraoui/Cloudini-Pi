package esprit.tn.pidev.Controllers;

import esprit.tn.pidev.Repositories.CommentRepository;
import esprit.tn.pidev.Repositories.PostRepository;
import esprit.tn.pidev.Repositories.UserRepository;
import esprit.tn.pidev.entities.Comment;
import esprit.tn.pidev.entities.Notification;
import esprit.tn.pidev.Services.INotificationService;
import esprit.tn.pidev.entities.Post;
import esprit.tn.pidev.entities.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notification Management", description = "Endpoints for managing user notifications")
public class NotificationController {

   @Autowired
   private PostRepository postRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserRepository userRepository;

    @Operation(summary = "Trigger notifications for a new post")
    @PostMapping("/notify-post/{postId}")
    public ResponseEntity<String> notifyNewPost(
            @PathVariable Long postId) {
        try {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new EntityNotFoundException("Post non trouvé"));

            notificationService.notifyNewPost(post);
            return ResponseEntity.ok("Notifications envoyées avec succès");

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur serveur: " + e.getMessage());
        }
    }

    @Autowired
    private INotificationService notificationService;

    @Operation(summary = "Get user notifications")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @Operation(summary = "Mark notification as read")
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Mark all notifications as read")
    @PatchMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get unread notifications count")
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        Long count = notificationService.getUnreadNotificationsCount(userId);
        return ResponseEntity.ok(count);
    }
    // Pour les nouveaux commentaires (à ajouter)
    @PostMapping("/notify-comment/{commentId}")
    public ResponseEntity<String> notifyNewComment(
            @PathVariable Long commentId,
            @RequestParam Long recipientId) {
        try {
            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new EntityNotFoundException("Commentaire non trouvé"));

            User recipient = userRepository.findById(recipientId)
                    .orElseThrow(() -> new EntityNotFoundException("Destinataire non trouvé"));

            notificationService.notifyNewComment(recipient, comment);
            return ResponseEntity.ok("Notification de commentaire envoyée");

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur: " + e.getMessage());
        }
    }
}
