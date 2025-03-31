package esprit.tn.pidev.Services;
import esprit.tn.pidev.entities.*;
import esprit.tn.pidev.Repositories.PostRepository;
import esprit.tn.pidev.Repositories.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements IPostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;
    private final INotificationService notificationService;

    @Override
    @Transactional
    public Post createPost(Post post, User author) {
        if (author.getRole() != Role.MEDECIN) {
            throw new IllegalStateException("Seuls les médecins peuvent créer des posts");
        }

        post.setAuthor(author);
        Post savedPost = postRepository.save(post);
        notificationService.notifyNewPost(savedPost);
        return savedPost;
    }

    @Override
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post non trouvé"));
    }

    @Override
    public List<Post> getAllPosts() {
        // Solution temporaire - implémentez findAllByOrderByCreatedAtDesc() dans le repository plus tard
        return postRepository.findAll().stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Post updatePost(Long postId, Post postDetails, User currentUser) {
        Post post = getPostById(postId);

        if (post.getAuthor().getIdUser() != currentUser.getIdUser()) {
            throw new IllegalStateException("Vous ne pouvez modifier que vos propres posts");
        }

        post.setTitle(postDetails.getTitle());
        post.setContent(postDetails.getContent());
        return postRepository.save(post);
    }

    @Override
    @Transactional
    public void deletePost(Long postId, User currentUser) {
        Post post = getPostById(postId);

        if (post.getAuthor().getIdUser() != currentUser.getIdUser()) {
            throw new IllegalStateException("Vous ne pouvez supprimer que vos propres posts");
        }

        postRepository.delete(post);
    }

    @Override
    @Transactional
    public Post addTagToPost(Long postId, Long tagId) {
        Post post = getPostById(postId);
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new EntityNotFoundException("Tag non trouvé"));

        if (!post.getTags().contains(tag)) {
            post.getTags().add(tag);
            tag.getPosts().add(post);
        }

        return postRepository.save(post);
    }

    @Override
    @Transactional
    public Post removeTagFromPost(Long postId, Long tagId) {
        Post post = getPostById(postId);
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new EntityNotFoundException("Tag non trouvé"));

        post.getTags().remove(tag);
        tag.getPosts().remove(post);

        return postRepository.save(post);
    }
}