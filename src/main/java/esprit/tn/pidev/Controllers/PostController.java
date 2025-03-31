package esprit.tn.pidev.Controllers;

import esprit.tn.pidev.entities.Post;
import esprit.tn.pidev.Services.IPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@Tag(name = "Post Management", description = "Endpoints for managing blog posts")
public class PostController {

    @Autowired
    private IPostService postService;

    @Operation(summary = "Create a new post")
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post createdPost = postService.createPost(post, post.getAuthor());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @Operation(summary = "Update an existing post")
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Long id,
            @RequestBody Post postDetails) {
        Post updatedPost = postService.updatePost(id, postDetails, postDetails.getAuthor());
        return ResponseEntity.ok(updatedPost);
    }

    @Operation(summary = "Delete a post")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id, null);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get all posts with pagination")
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @Operation(summary = "Get post by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @Operation(summary = "Add tag to post")
    @PostMapping("/{postId}/tags/{tagId}")
    public ResponseEntity<Post> addTagToPost(
            @PathVariable Long postId,
            @PathVariable Long tagId) {
        Post post = postService.addTagToPost(postId, tagId);
        return ResponseEntity.ok(post);
    }
}