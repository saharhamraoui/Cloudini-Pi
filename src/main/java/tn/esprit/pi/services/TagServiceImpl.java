package tn.esprit.pi.services;

import tn.esprit.pi.entities.Tag;
import tn.esprit.pi.repositories.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
    @RequiredArgsConstructor
    public class TagServiceImpl implements ITagService {

        private final TagRepository tagRepository;

        @Override
        @Transactional
        public Tag createTag(String name) {
            if (tagRepository.findByNameIgnoreCase(name).isPresent()) {
                throw new IllegalArgumentException("Un tag avec ce nom existe déjà");
            }
            return tagRepository.save(new Tag(name));
        }

        @Override
        public Optional<Tag> findByName(String name) {
            return tagRepository.findByName(name);
        }

        @Override
        public Optional<Tag> findByNameIgnoreCase(String name) {
            return tagRepository.findByNameIgnoreCase(name);
        }

        @Override
        public List<Tag> searchByName(String query) {
            return tagRepository.searchByName(query);
        }

        @Override
        public List<Tag> findMostPopularTags() {
            return tagRepository.findMostPopularTags();
        }

        @Override
        public List<Tag> getAllTags() {
            return tagRepository.findAll();
        }

        @Override
        @Transactional
        public Tag updateTag(Long id, String newName) {
            Tag tag = tagRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Tag non trouvé"));

            if (!tag.getName().equalsIgnoreCase(newName) &&
                    tagRepository.findByNameIgnoreCase(newName).isPresent()) {
                throw new IllegalArgumentException("Un tag avec ce nom existe déjà");
            }

            tag.setName(newName);
            return tagRepository.save(tag);
        }

        @Override
        @Transactional
        public void deleteTag(Long id) {
            Tag tag = tagRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Tag non trouvé"));

            // Détacher le tag des posts avant suppression
            tag.getPosts().forEach(post -> post.getTags().remove(tag));
            tagRepository.delete(tag);
        }

        @Override
        public List<Tag> createOrGetTags(List<String> tagNames) {
            List<Tag> tags = new ArrayList<>();
            for (String tagName : tagNames) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            return tagRepository.save(newTag);
                        });
                tags.add(tag);
            }
            return tags;
        }
        @Override
        public Tag getTagById(Long id) {
            return tagRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Tag non trouvé avec l'ID: " + id));        }

    }
