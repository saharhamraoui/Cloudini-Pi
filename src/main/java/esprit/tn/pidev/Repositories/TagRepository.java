package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByNameIgnoreCase(String name);

    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Tag> searchByName(String query);

    @Query("SELECT t FROM Tag t ORDER BY SIZE(t.posts) DESC")
    List<Tag> findMostPopularTags();

    Tag findByName(String name);
}