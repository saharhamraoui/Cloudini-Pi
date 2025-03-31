package esprit.tn.pidev.Controllers;


import esprit.tn.pidev.entities.Tag;
import esprit.tn.pidev.Services.ITagService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tags")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Tag Management", description = "Endpoints for managing tags")
public class TagController {

    @Autowired
    private ITagService tagService;

    @Operation(summary = "Create new tag")
    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Tag tag) {
        Tag createdTag = tagService.createTag(tag.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTag);
    }

    @Operation(summary = "Search tags by keyword")
    @GetMapping("/search")
    public ResponseEntity<List<Tag>> searchTags(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Tag> tags = tagService.searchByName(query);
        return ResponseEntity.ok(tags);
    }

    @Operation(summary = "Get trending tags")
    @GetMapping("/trending")
    public ResponseEntity<List<Tag>> getTrendingTags() {
        List<Tag> tags = tagService.findMostPopularTags();
        return ResponseEntity.ok(tags);
    }

    @Operation(summary = "Update tag")
    @PutMapping("/{id}")
    public ResponseEntity<Tag> updateTag(
            @PathVariable Long id,
            @RequestBody Tag tagDetails) {
        Tag updatedTag = tagService.updateTag(id, tagDetails.getName());
        return ResponseEntity.ok(updatedTag);
    }
}