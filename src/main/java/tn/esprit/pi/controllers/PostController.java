package tn.esprit.pi.controllers;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import tn.esprit.pi.entities.User;
import tn.esprit.pi.repositories.PostRepository;
import tn.esprit.pi.repositories.TagRepository;
import tn.esprit.pi.repositories.UserRepository;
import tn.esprit.pi.services.TagServiceImpl;
import tn.esprit.pi.entities.Post;
import tn.esprit.pi.services.IPostService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;
import tn.esprit.pi.config.*;
@CrossOrigin(origins = "http://198.162.1.122:30596")
@RestController
@RequestMapping("/posts")
public class PostController {

  @Autowired
  private IPostService postService;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private TagRepository tagRepository;
  @Autowired
  private TagServiceImpl tagService;
  @Autowired
  private PostRepository postRepository;


  @PostMapping(value = "/create-with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> createPostWithImage(
    @RequestParam("title") String title,
    @RequestParam("content") String content,
    @RequestParam("authorId") Long authorId,
    @RequestParam(value = "tags", required = false) String tagsJson,
    @RequestParam(value = "image", required = false) MultipartFile file) {

    try {
      User author = userRepository.findById(authorId)
        .orElseThrow(() -> new RuntimeException("User not found"));

      Post post = new Post();
      post.setTitle(title);
      post.setContent(content);
      post.setAuthor(author);

      List<String> tagNames = tagsJson != null && !tagsJson.isEmpty() ?
        new ObjectMapper().readValue(tagsJson, new TypeReference<List<String>>() {})
        : new ArrayList<>();

      byte[] image = null;

      if (file != null && !file.isEmpty()) {
        if (file.getSize() > 5 * 1024 * 1024) { // Limite de 5MB
          return ResponseEntity.badRequest().body("File size exceeds 5MB limit");
        }
        image = file.getBytes();
      }

      Post savedPost = postService.createPostWithTags(post, tagNames, author);

      return ResponseEntity.ok(savedPost);

    } catch (Exception e) {
      return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
    }
  }


  @Operation(summary = "Update post content")
  @PutMapping("/updatepostbyid/{id}")
  public ResponseEntity<?> updatePost(
    @PathVariable Long id,
    @RequestBody Map<String, String> updates,
    @RequestHeader("X-User-Id") long currentUserId) {

    try {
      Post post = postRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Post not found"));

      // 2. Vérifier que l'utilisateur est l'auteur original
      if (post.getAuthor().getIdUser() != currentUserId) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body(Map.of(
            "error", "FORBIDDEN",
            "message", "Only the original author can update this post"
          ));
      }

      // 3. Mise à jour sélective
      if (updates.containsKey("title")) {
        post.setTitle(updates.get("title"));
      }
      if (updates.containsKey("content")) {
        post.setContent(updates.get("content"));
      }

      // 4. Sauvegarde
      Post updatedPost = postRepository.save(post);
      return ResponseEntity.ok(updatedPost);

    } catch (EntityNotFoundException e) {
      return ResponseEntity.notFound().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest()
        .body(Map.of(
          "error", "BAD_REQUEST",
          "message", e.getMessage()
        ));
    }
  }
  @Operation(summary = "Delete a post")
  @DeleteMapping("/{postId}")
  public ResponseEntity<?> deletePost(@PathVariable Long postId, @RequestHeader("userId") Long userId) {
    try {
      User currentUser = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

      postService.deletePost(postId, currentUser);
      return ResponseEntity.noContent().build();

    } catch (EntityNotFoundException e) {
      return ResponseEntity.notFound().build();
    } catch (IllegalStateException e) {
      return ResponseEntity.status(403).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
        .body("Delete error: " + e.getMessage());
    }
  }

  @Operation(summary = "Get all posts with author and optional image")
  @GetMapping("/getallposts")
  public ResponseEntity<List<Map<String, Object>>> getAllPostsWithAuthor() {
    List<Post> posts = postService.getAllPostsWithAuthor();
    posts.sort((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()));

    List<Map<String, Object>> enrichedPosts = posts.stream()
      .map(post -> {
        Map<String, Object> postData = new HashMap<>();
        postData.put("id", post.getId());
        postData.put("title", post.getTitle());
        postData.put("content", post.getContent());
        postData.put("createdAt", post.getCreatedAt());

        if (post.getAuthor() != null) {
          postData.put("authorFullName", post.getAuthor().getFirstName() + " " + post.getAuthor().getLastName());
        } else {
          postData.put("authorFullName", "Unknown Author");
        }

        return postData;
      })
      .toList();

    return ResponseEntity.ok(enrichedPosts);
  }

  @Operation(summary = "Get post by ID")
  @GetMapping("/getbyid/{id}")
  public ResponseEntity<?> getPostById(@PathVariable Long id) {
    try {
      Post post = postService.getPostById(id);
      return ResponseEntity.ok(post);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }


  @GetMapping("/getpostbyauthor/{authorId}")
  public List<Post> getPostsByAuthor(@PathVariable Long authorId) {
    return postService.getAllPostsByAuthorId(authorId);
  }

  @GetMapping("/getauthorbypostid/{postId}/author-id")
  public long getAuthorIdByPostId(@PathVariable Long postId) {
    return postService.getAuthorIdByPostId(postId);
  }

  @GetMapping("/getauthorname/{postId}")
  public Map<String, Object> getPostWithAuthorName(@PathVariable Long postId) {
    return postService.getPostWithAuthorName(postId);
  }

  @Operation(summary = "Add multiple tags to a post")
  @PostMapping("/{postId}/tags/bulk")
  public ResponseEntity<?> addTagsToPostBulk(@PathVariable Long postId, @RequestBody List<String> tagNames) {
    try {
      Post updatedPost = postService.addTagsToPost(postId, tagNames);
      return ResponseEntity.ok(updatedPost);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @Operation(summary = "Get posts by tag name")
  @GetMapping("/tagged/{tagName}")
  public ResponseEntity<?> getPostsByTag(@PathVariable String tagName) {
    try {
      List<Post> posts = postService.getPostsByTag(tagName);

      List<Map<String, Object>> enrichedPosts = posts.stream()
        .map(post -> {
          Map<String, Object> postData = new HashMap<>();
          postData.put("id", post.getId());
          postData.put("title", post.getTitle());
          postData.put("content", post.getContent());
          postData.put("createdAt", post.getCreatedAt());
          postData.put("tags", post.getTags());

          if (post.getAuthor() != null) {
            postData.put("authorFullName", post.getAuthor().getFirstName() + " " + post.getAuthor().getLastName());
          } else {
            postData.put("authorFullName", "Unknown Author");
          }

          return postData;
        })
        .toList();

      return ResponseEntity.ok(enrichedPosts);
    } catch (EntityNotFoundException e) {
      return ResponseEntity.notFound().build();
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
        .body("Error: " + e.getMessage());
    }
  }
  @PostMapping("/{postId}/like/{userId}")
  public ResponseEntity<Map<String, Object>> likePost(@PathVariable Long postId, @PathVariable Long userId) {
    try {
      if (!postRepository.existsById(postId)) {
        return ResponseEntity.notFound().build();
      }
      int likesCount = postService.likePost(postId, userId); // Correction ici
      return ResponseEntity.ok(Map.of(
        "success", true,
        "likesCount", likesCount
      ));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(Map.of(
        "success", false,
        "message", "Erreur serveur lors du like"
      ));
    }
  }


  @GetMapping("/getLikesForPost/{postId}")  public ResponseEntity<Map<String, Object>> getLikesCount(@PathVariable Long postId) {
    try {
      int likesCount = postService.getLikesCount(postId);
      return ResponseEntity.ok(Map.of(
        "postId", postId,
        "likesCount", likesCount,
        "timestamp", LocalDateTime.now()
      ));
    } catch (EntityNotFoundException e) {
      return ResponseEntity.notFound().build();
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
    }
  }

  @PostMapping("/{postId}/toggle-like/{userId}")
  public ResponseEntity<Map<String, Object>> toggleLike(
    @PathVariable Long postId,
    @PathVariable Long userId) {

    try {
      Map<String, Object> response = postService.toggleLike(postId, userId);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(Map.of(
        "success", false,
        "message", "Erreur lors du traitement du like"
      ));
    }
  }

}
