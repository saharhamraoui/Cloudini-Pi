package esprit.tn.pidev.Controllers;


import esprit.tn.pidev.entities.Comment;
import esprit.tn.pidev.Services.ICommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@Tag(name = "Comment Management", description = "Endpoints for managing comments")
public class CommentController {

    @Autowired
    private ICommentService commentService;

    @Operation(summary = "Create comment for post")
    @PostMapping("/post/{postId}")
    public ResponseEntity<Comment> createComment(
            @PathVariable Long postId,
            @RequestBody Comment comment) {
        Comment createdComment = commentService.createComment(postId, comment.getContent(), comment.getAuthor());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
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
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long id,
            @RequestBody Comment commentDetails) {
        Comment updatedComment = commentService.updateComment(id, commentDetails.getContent(), commentDetails.getAuthor());
        return ResponseEntity.ok(updatedComment);
    }

    @Operation(summary = "Delete comment")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id, null);
        return ResponseEntity.noContent().build();
    }
}