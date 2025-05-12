package tn.esprit.pi.services;


import tn.esprit.pi.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.esprit.pi.entities.User;

public interface ICommentService {
  Comment createComment(Long postId, String content, User author);
  Comment createReply(Long parentCommentId, String content, User author);
  Page<Comment> getCommentsByPost(Long postId, Pageable pageable);
  Page<Comment> getRepliesByComment(Long commentId, Pageable pageable);
  Comment updateComment(Long commentId, String newContent, User currentUser);
  void deleteComment(Long commentId, User currentUser);
}
