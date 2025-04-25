package esprit.tn.pidev.Controllers;


import esprit.tn.pidev.Repositories.UserRepository;
import esprit.tn.pidev.entities.Comment;
import esprit.tn.pidev.Services.ICommentService;
import esprit.tn.pidev.entities.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/comments")
@Tag(name = "Comment Management", description = "Endpoints for managing comments")
@CrossOrigin(origins = "http://localhost:4200")

public class CommentController {

    @Autowired
    private ICommentService commentService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    public CommentController(ICommentService commentService) {
        this.commentService = commentService;
    }

    @Operation(summary = "Create comment for post")
    @PostMapping("/postcomment/{postId}")
    public ResponseEntity<?> createComment(
            @PathVariable Long postId,
            @RequestBody Map<String, Object> requestData) {
        try {
            String content = (String) requestData.get("content");
            Long authorId = ((Number) requestData.get("authorId")).longValue();

            if (content == null || authorId == null) {
                return ResponseEntity.badRequest().body("Données du commentaire invalides");
            }

            User author = userRepository.findById(authorId)
                    .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

            Comment createdComment = commentService.createComment(
                    postId,
                    content,
                    author
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur: " + e.getMessage());
        }
    }
    @Operation(summary = "Get comments for post with pagination")
    @GetMapping("/post/{postId}")
    public ResponseEntity<Page<Comment>> getPostComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, Pageable pageable) {
        Page<Comment> comments = commentService.getCommentsByPost(postId,pageable);
        return ResponseEntity.ok(comments);
    }

    @Operation(summary = "Update comment")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long id,
            @RequestBody Comment commentDetails) {
        try {
            User author = userRepository.findById(commentDetails.getAuthor().getIdUser())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            Comment updatedComment = commentService.updateComment(
                    id,
                    commentDetails.getContent(),
                    author
            );
            return ResponseEntity.ok(updatedComment);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            User currentUser = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            commentService.deleteComment(id, currentUser);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }
  @Operation(summary = "Create reply to comment")
  @PostMapping("/reply/{parentCommentId}")
  public ResponseEntity<?> createReply(
    @PathVariable Long parentCommentId,
    @RequestBody Map<String, Object> requestData) {
    try {
      String content = (String) requestData.get("content");
      Long authorId = ((Number) requestData.get("authorId")).longValue();

      if (content == null || authorId == null) {
        return ResponseEntity.badRequest().body("Données de la réponse invalides");
      }

      User author = userRepository.findById(authorId)
        .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

      Comment createdReply = commentService.createReply(
        parentCommentId,
        content,
        author
      );

      return ResponseEntity.status(HttpStatus.CREATED).body(createdReply);

    } catch (EntityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
        .body("Erreur: " + e.getMessage());
    }
  }

  @Operation(summary = "Get replies for a comment")
  @GetMapping("/{commentId}/replies")
  public ResponseEntity<Page<Comment>> getCommentReplies(
    @PathVariable Long commentId,
    Pageable pageable) {
    Page<Comment> replies = commentService.getRepliesByComment(commentId, pageable);
    return ResponseEntity.ok(replies);
  }
}
