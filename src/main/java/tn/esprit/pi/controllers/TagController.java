package tn.esprit.pi.controllers;


import tn.esprit.pi.entities.Tag;
import tn.esprit.pi.services.ITagService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://198.162.1.118:32584")

@RestController
@RequestMapping("/tags")
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

    @Operation(summary = "Get all tags")
    @GetMapping("/tags")
    public ResponseEntity<List<Tag>> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    @Operation(summary = "Create or get multiple tags")
    @PostMapping("/bulk")
    public ResponseEntity<List<Tag>> createOrGetTags(@RequestBody List<String> tagNames) {
        List<Tag> tags = tagService.createOrGetTags(tagNames);
        return ResponseEntity.status(HttpStatus.CREATED).body(tags);
    }

    @Operation(summary = "Get tag by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable Long id) {
        Tag tag = tagService.getTagById(id);
        return ResponseEntity.ok(tag);
    }


}
