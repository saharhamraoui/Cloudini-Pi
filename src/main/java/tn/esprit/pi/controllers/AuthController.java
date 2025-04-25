package tn.esprit.pi.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import tn.esprit.pi.Security.JwtResponse;
import tn.esprit.pi.controllers.LoginRequest;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.repositories.UserRepository;
import tn.esprit.pi.services.TokenService;
import tn.esprit.pi.services.UserService;

@EnableAsync
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {


    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register-patient")
    public ResponseEntity<?> registerPatient(@RequestBody Patient patient) {
        try {
            Patient registeredPatient = userService.createPatient(patient);
            return ResponseEntity.ok("Patient enregistré avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register-medecin")
    public ResponseEntity<?> registerMedecin(@RequestBody Medecin medecin) {
        try {
            Medecin registeredMedecin = userService.createMedecin(medecin);
            return ResponseEntity.ok("Médecin enregistré avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register-chauffeur")
    public ResponseEntity<?> registerChauffeur(@RequestBody Chauffeur chauffeur) {
        try {
            Chauffeur registeredChauffeur = userService.createChauffeur(chauffeur);
            return ResponseEntity.ok("Chauffeur enregistré avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/create-admin")
    public ResponseEntity<User> createAdmin(@RequestParam String firstName,
                                            @RequestParam String lastName,
                                            @RequestParam String email,
                                            @RequestParam String password) {
        try {
            User createdAdmin = userService.createAdmin(firstName, lastName, email, password);
            return ResponseEntity.ok(createdAdmin);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            if (user.isBanned()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Ce compte est banni");
            }
            String token = tokenService.generateToken(user);
            return ResponseEntity.ok(new JwtResponse(
                    token,
                    user.getEmail(),
                    user.getFirstName(), // Ajout du prénom
                    user.getRole(),
                    user.getIdUser()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 