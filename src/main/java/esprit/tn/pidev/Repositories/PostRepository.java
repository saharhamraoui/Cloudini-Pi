package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.Post;
import esprit.tn.pidev.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
     List<Post> findByAuthor(User author);

     Post findByTitle(String title);
}
