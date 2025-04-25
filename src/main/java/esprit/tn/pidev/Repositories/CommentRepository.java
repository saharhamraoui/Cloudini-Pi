package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {}
