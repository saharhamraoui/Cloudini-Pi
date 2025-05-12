package tn.esprit.pi.repositories;

import tn.esprit.pi.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId ORDER BY c.createdAt ASC")
    Page<Comment> findCommentsByPostId(@Param("postId") Long postId, Pageable pageable);

  Page<Comment> findByPostIdAndParentCommentIsNull(Long postId, Pageable pageable);
  Page<Comment> findByParentCommentId(Long parentCommentId, Pageable pageable);
  boolean existsById(Long commentId);
}
