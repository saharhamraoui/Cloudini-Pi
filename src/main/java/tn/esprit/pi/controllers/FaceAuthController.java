package tn.esprit.pi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.User;
import tn.esprit.pi.services.FaceAuthService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/face-auth") // Avant: "/api"
public class FaceAuthController {
    private final Map<String,float[]> tempFaceStorage = new ConcurrentHashMap<>();

    @Autowired
    private FaceAuthService faceAuthService;

    @PostMapping("/register/{userId}")
    public ResponseEntity<?> registerFace(
            @PathVariable Long userId,
            @RequestBody float[] descriptor
    ) {
        faceAuthService.registerFace(userId, descriptor);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/temp-register")
    public ResponseEntity<?> tempRegisterFace(
            @RequestParam String email,
            @RequestBody float[] descriptor) {

        if (descriptor == null || descriptor.length < 128) {
            return ResponseEntity.badRequest().body("Invalid face descriptor");
        }
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }


        // Store temporarily
        tempFaceStorage.put(email, descriptor);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/recognize")
    public ResponseEntity<?> recognizeFace(@RequestBody float[] descriptor) {
        Optional<User> user = faceAuthService.recognizeUser(descriptor);
        return user.isPresent()
                ? ResponseEntity.ok(user.get())
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("No matching user found");
    }

}