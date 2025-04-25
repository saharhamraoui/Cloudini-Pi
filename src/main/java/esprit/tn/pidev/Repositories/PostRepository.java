package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.Post;
import esprit.tn.pidev.entities.Tag;
import esprit.tn.pidev.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Recherche par auteur (trié par date décroissante)
    List<Post> findByAuthorOrderByCreatedAtDesc(User author);

    // Recherche par titre (exact match)
    Optional<Post> findByTitle(String title); // Utilisez Optional pour gérer le "non trouvé"
    List<Post> findAllByOrderByCreatedAtDesc(); // Pour getAllPosts()
    // Tous les posts triés + pagination
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Post> findByAuthorIdUser(Long authorId);

        @Query("SELECT p FROM Post p JOIN FETCH p.author")
        List<Post> findAllWithAuthor();
    // Requête pour récupérer l'ID de l'auteur d'un post
    @Query("SELECT p.author.idUser FROM Post p WHERE p.id = :postId")
    Long findAuthorIdByPostId(@Param("postId") Long postId);

    // Requête pour récupérer un post avec le nom complet de l'auteur
    @Query("SELECT p.id, p.title, p.content, p.createdAt, p.updatedAt, " +
            "CONCAT(u.firstName, ' ', u.lastName) AS authorFullName " +
            "FROM Post p " +
            "LEFT JOIN p.author u " +
            "WHERE p.id = :postId")
    Object[] findPostWithAuthorName(@Param("postId") Long postId);
    List<Post> findByTagsContaining(Tag tag);
}