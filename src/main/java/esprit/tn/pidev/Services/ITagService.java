package esprit.tn.pidev.Services;

import esprit.tn.pidev.entities.Tag;
import java.util.List;
import java.util.Optional;

public interface ITagService {
    Tag createTag(String name);
    Optional<Tag> findByName(String name);
    Optional<Tag> findByNameIgnoreCase(String name);
    List<Tag> searchByName(String query);
    List<Tag> findMostPopularTags();
    List<Tag> getAllTags();
    Tag updateTag(Long id, String newName);
    void deleteTag(Long id);
}