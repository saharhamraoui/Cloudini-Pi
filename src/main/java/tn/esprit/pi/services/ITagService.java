package tn.esprit.pi.services;

import tn.esprit.pi.entities.Tag;
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
    List<Tag> createOrGetTags(List<String> tagNames);
    Tag getTagById(Long id);
}
