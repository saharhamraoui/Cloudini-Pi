package esprit.tn.pidev.Services;


import esprit.tn.pidev.entities.Comment;
import esprit.tn.pidev.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ICommentService {
    Comment createComment(Long postId, String content, User author);
    Page<Comment> getCommentsByPost(Long postId, Pageable pageable);
    Comment updateComment(Long commentId, String newContent, User currentUser);
    void deleteComment(Long commentId, User currentUser);
}