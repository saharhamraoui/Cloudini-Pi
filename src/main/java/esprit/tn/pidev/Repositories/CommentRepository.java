package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.Comment;
import esprit.tn.pidev.entities.Notification;
import esprit.tn.pidev.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId ORDER BY c.createdAt ASC")
    Page<Comment> findCommentsByPostId(@Param("postId") Long postId, Pageable pageable);

  Page<Comment> findByPostIdAndParentCommentIsNull(Long postId, Pageable pageable);
  Page<Comment> findByParentCommentId(Long parentCommentId, Pageable pageable);
  boolean existsById(Long commentId);
}
