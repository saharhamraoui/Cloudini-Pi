package tn.esprit.pi.services;

import tn.esprit.pi.entities.Role;
import tn.esprit.pi.entities.User;
import tn.esprit.pi.repositories.PostRepository;
import tn.esprit.pi.repositories.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.pi.entities.Post;
import tn.esprit.pi.entities.Tag;
import tn.esprit.pi.repositories.UserRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements IPostService {

  private final PostRepository postRepository;
  private final TagRepository tagRepository;
  private final UserRepository userRepository;
  private TagServiceImpl tagService;

  @Override
  public Post getPostById(Long id) {
    return postRepository.findById(id)
      .orElseThrow(() -> new EntityNotFoundException("Post non trouvé"));
  }

  @Override
  public List<Post> getAllPosts() {
    return postRepository.findAll().stream()
      .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
      .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public Post updatePost(Long postId, Post postDetails, User currentUser) {
    Post post = getPostById(postId);

    if (currentUser == null || post.getAuthor() == null
      || currentUser.getIdUser() != post.getAuthor().getIdUser()) {
      throw new IllegalStateException("Vous ne pouvez modifier que vos propres posts");
    }

    post.setTitle(postDetails.getTitle());
    post.setContent(postDetails.getContent());
    return postRepository.save(post);
  }

  @Transactional
  public void deletePost(Long postId, User currentUser) {
    Post post = postRepository.findById(postId)
      .orElseThrow(() -> new EntityNotFoundException("Post not found"));

    if (post.getAuthor() == null ||
      (post.getAuthor().getIdUser() != currentUser.getIdUser()
        && currentUser.getRole() != Role.ADMIN)) {
      throw new IllegalStateException("Unauthorized deletion");
    }

    if (!post.getTags().isEmpty()) {
      post.getTags().clear();
      postRepository.save(post);
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

  @Override
  public List<Post> getAllPostsByAuthorId(Long authorId) {
    return postRepository.findByAuthorIdUser(authorId).stream()
      .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
      .collect(Collectors.toList());
  }

  @Override
  public List<Post> getAllPostsWithAuthor() {
    List<Post> posts = postRepository.findAllWithAuthor();
    posts.forEach(post -> {
      System.out.println("Post Title: " + post.getTitle());
      if (post.getAuthor() != null) {
        System.out.println("Author: " + post.getAuthor().getFirstName() + " " + post.getAuthor().getLastName());
      } else {
        System.out.println("Author is null");
      }
    });
    return posts;
  }

  @Override
  public long getAuthorIdByPostId(Long postId) {
    return postRepository.findAuthorIdByPostId(postId)
      .describeConstable().orElseThrow(() -> new EntityNotFoundException("Aucun auteur trouvé pour ce post"));
  }

  @Override
  public Map<String, Object> getPostWithAuthorName(Long postId) {
    Optional<Post> optionalPost = postRepository.findById(postId);

    if (optionalPost.isEmpty()) {
      throw new RuntimeException("Post not found");
    }

    Post post = optionalPost.get();

    Map<String, Object> response = new HashMap<>();
    response.put("id", post.getId());
    response.put("title", post.getTitle());
    response.put("content", post.getContent());
    response.put("createdAt", post.getCreatedAt());
    response.put("updatedAt", post.getUpdatedAt());

    String authorFullName = "Auteur inconnu";
    if (post.getAuthor() != null) {
      authorFullName = post.getAuthor().getFirstName() + " " + post.getAuthor().getLastName();
    }
    response.put("authorFullName", authorFullName);

    return response;
  }

  @Override
  public Post addTagsToPost(Long postId, List<String> tagNames) {
    Post post = getPostById(postId);
    List<Tag> tags = tagService.createOrGetTags(tagNames);

    tags.forEach(tag -> {
      if (!post.getTags().contains(tag)) {
        post.getTags().add(tag);
        tag.getPosts().add(post);
      }
    });

    return postRepository.save(post);    }

  @Override
  public Post createPostWithTags(Post post, List<String> tagNames, User author) {
    if (author.getRole() != Role.MEDECIN) {
      throw new IllegalStateException("Seuls les médecins peuvent publier des posts");
    }

    post.setAuthor(author);

    if (tagNames != null && !tagNames.isEmpty()) {
      List<Tag> managedTags = new ArrayList<>();

      // Gérer les tags comme dans ton code existant
      for (String tagName : tagNames) {
        Tag existingTag = tagRepository.findByName(tagName)
          .orElseGet(() -> {
            Tag newTag = new Tag(tagName);
            return tagRepository.save(newTag);
          });

        if (!managedTags.contains(existingTag)) {
          managedTags.add(existingTag);
        }
      }

      post.setTags(managedTags);
    }



    return postRepository.save(post);
  }
  @Override
  public List<Post> getPostsByTag(String tagName) {
    Tag tag = tagRepository.findByName(tagName)
      .orElseThrow(() -> new EntityNotFoundException("Tag not found"));
    return postRepository.findByTagsContaining(tag);    }

  @Transactional
  public int likePost(Long postId , Long UserId) {
    Post post = postRepository.findById(postId)
      .orElseThrow(() -> new EntityNotFoundException("Post non trouvé"));
    post.incrementLikes();
    postRepository.save(post);
    return post.getLikesCount();
  }

  @Override
  public int getLikesCount(Long postId) {
    return postRepository.getLikesCount(postId);
  }

  @Override
  public Map<String, Object> toggleLike(Long postId, Long userId) {
    Post post = postRepository.findById(postId)
      .orElseThrow(() -> new EntityNotFoundException("Post non trouvé"));

    post.toggleLike(userId);
    postRepository.save(post);

    return Map.of(
      "success", true,
      "likesCount", post.getLikesCount(),
      "userHasLiked", post.isLikedBy(userId)
    );  }


  @Transactional
  public int dislikePost(Long postId, Long userId) {
    Post post = postRepository.findById(postId)
      .orElseThrow(() -> new EntityNotFoundException("Post non trouvé"));

    post.decrementLikes(); // Utilise la méthode existante dans votre entité Post
    postRepository.save(post);

    return post.getLikesCount();
  }}

