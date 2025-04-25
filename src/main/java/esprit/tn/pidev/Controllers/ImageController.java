package esprit.tn.pidev.Controllers;

import esprit.tn.pidev.Repositories.PostRepository;
import esprit.tn.pidev.Repositories.TagRepository;
import esprit.tn.pidev.Repositories.UserRepository;
import esprit.tn.pidev.Services.TagServiceImpl;
import esprit.tn.pidev.entities.Post;
import esprit.tn.pidev.Services.IPostService;
import esprit.tn.pidev.entities.Role;
import esprit.tn.pidev.entities.User;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import esprit.tn.pidev.entities.Tag;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    // Répertoire temporaire pour stocker les images
    private final Path rootLocation = Paths.get("temp-uploads");

    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), Paths.get("uploads").resolve(filename));
        return filename;
    }

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {
        Path file = Paths.get("uploads").resolve(filename);
        Resource resource = new UrlResource(file.toUri());
        return ResponseEntity.ok().body(resource);
    }




    // Nettoyage périodique (optionnel)
    @Scheduled(fixedRate = 86400000) // Tous les jours
    public void cleanupOldImages() {
        try {
            Files.walk(rootLocation)
                    .filter(Files::isRegularFile)
                    .filter(path -> {
                        try {
                            return Files.getLastModifiedTime(path).toMillis() <
                                    System.currentTimeMillis() - 86400000; // 24h
                        } catch (IOException e) {
                            return false;
                        }
                    })
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            System.err.println("Échec suppression: " + path);
                        }
                    });
        } catch (IOException e) {
            System.err.println("Échec nettoyage: " + e.getMessage());
        }
    }
}