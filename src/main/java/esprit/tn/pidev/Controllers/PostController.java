package esprit.tn.pidev.Controllers;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import esprit.tn.pidev.Repositories.PostRepository;
import esprit.tn.pidev.Repositories.TagRepository;
import esprit.tn.pidev.Repositories.UserRepository;
import esprit.tn.pidev.Services.TagServiceImpl;
import esprit.tn.pidev.entities.Post;
import esprit.tn.pidev.Services.IPostService;
import esprit.tn.pidev.entities.Role;
import esprit.tn.pidev.entities.User;
import esprit.tn.pidev.entities.Tag;
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

@CrossOrigin(origins = "http://localhost:4200")
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

    private final String uploadDir = "uploads/images";
    @Operation(summary = "Upload an image and get its URL")
    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Aucun fichier n'a été téléchargé");
        }
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

            String imageUrl = "/api/images/" + fileName; // Assurez-vous que cette URL est correcte
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors du téléchargement de l'image: " + e.getMessage());
        }
    }
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

            // Convertir les tags JSON en liste
            List<String> tagNames = tagsJson != null && !tagsJson.isEmpty() ?
                    new ObjectMapper().readValue(tagsJson, new TypeReference<List<String>>() {})
                    : new ArrayList<>();

            // Gestion de l'image
            if (file != null && !file.isEmpty()) {
                if (file.getSize() > 5 * 1024 * 1024) { // Limite de 5MB
                    return ResponseEntity.badRequest().body("File size exceeds 5MB limit");
                }
                post.setImage(file.getBytes()); // Stocke l'image en BDD
            }

            Post savedPost = postService.createPostWithTags(post, tagNames, author);
            return ResponseEntity.ok(savedPost);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getPostImage(@PathVariable Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getImage() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // ou MediaType.IMAGE_PNG selon le format
                .body(post.getImage());
    }
    @Operation(summary = "Update an existing post (image optional)")
    @PutMapping("/updatepostbyid/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        try {
            if (postDetails.getAuthor() == null || postDetails.getAuthor().getIdUser() == 0) {
                return ResponseEntity.badRequest().body("Invalid author");
            }

            User author = userRepository.findById(postDetails.getAuthor().getIdUser())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Post updatedPost = postService.updatePost(id, postDetails, author);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
                    postData.put("imageUrl", post.getImage());

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
                        postData.put("imageUrl", post.getImage());
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
    @PostMapping("/{postId}/like")
  public ResponseEntity<Map<String, Object>> likePost(@PathVariable Long postId) {
    try {
      if (!postRepository.existsById(postId)) {
        return ResponseEntity.notFound().build();
      }
      int likesCount = postService.likePost(postId);
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
}
