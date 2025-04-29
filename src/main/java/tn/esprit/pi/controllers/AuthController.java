package tn.esprit.pi.controllers;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.pi.Security.JwtResponse;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.repositories.UserRepository;
import tn.esprit.pi.services.EmailService;
import tn.esprit.pi.services.GoogleAuthService;
import tn.esprit.pi.services.TokenService;
import tn.esprit.pi.services.UserService;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:8087"})
public class AuthController {

    @Autowired
    private GoogleAuthService googleAuthService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;

    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    @PostMapping("/register-patient")
    public ResponseEntity<Map<String, String>> registerPatient(@RequestBody Patient patient) {
        try {
            if (userRepository.existsByEmail(patient.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Collections.singletonMap("error", "This email is already in use"));
            }

            String code = generateVerificationCode();
            patient.setVerificationCode(code);
            patient.setVerified(false);
            patient.setDescription(patient.getDescription() != null ? patient.getDescription() : "");

            Patient registeredPatient = userService.createPatient(patient);
            emailService.sendVerificationEmail(patient.getEmail(), code);

            return ResponseEntity.ok(Collections.singletonMap("message", "Registration successful. Check your email for verification code."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/register-medecin")
    public ResponseEntity<Map<String, String>> registerMedecin(@RequestBody Medecin medecin) {
        try {
            if (userRepository.existsByEmail(medecin.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Collections.singletonMap("error", "This email is already in use"));
            }
            String code = generateVerificationCode();
            medecin.setVerificationCode(code);
            medecin.setVerified(false);
            medecin.setDescription(medecin.getDescription() != null ? medecin.getDescription() : "");

            Medecin registeredMedecin = userService.createMedecin(medecin);
            emailService.sendVerificationEmail(medecin.getEmail(), code);

            return ResponseEntity.ok(Collections.singletonMap("message", "Registration successful. Check your email for verification code."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/register-chauffeur")
    public ResponseEntity<Map<String, String>> registerChauffeur(@RequestBody Chauffeur chauffeur) {
        try {
            if (userRepository.existsByEmail(chauffeur.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Collections.singletonMap("error", "This email is already in use"));
            }
            String code = generateVerificationCode();
            chauffeur.setVerificationCode(code);
            chauffeur.setVerified(false);
            chauffeur.setDescription(chauffeur.getDescription() != null ? chauffeur.getDescription() : "");

            Chauffeur registeredChauffeur = userService.createChauffeur(chauffeur);
            emailService.sendVerificationEmail(chauffeur.getEmail(), code);

            return ResponseEntity.ok(Collections.singletonMap("message", "Registration successful. Check your email for verification code."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/create-admin")
    public ResponseEntity<User> createAdmin(
            @RequestParam String firstName,
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

    @PostMapping(value = "/upload-photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPhoto(
            @RequestPart("file") MultipartFile file,
            HttpServletRequest request) {
        System.out.println("Content-Type: " + request.getContentType());
        System.out.println("File size: " + file.getSize());

        try {
            String photoUrl = userService.saveUserPhoto(file);
            return ResponseEntity.ok(Map.of("photoUrl", photoUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload photo: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            if (user.isBanned()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("This account is banned");
            }

            String token = tokenService.generateToken(user);
            return ResponseEntity.ok(new JwtResponse(
                    token,
                    user.getEmail(),
                    user.getFirstName(),
                    user.getRole(),
                    user.isVerified(),
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

    @PostMapping("/login/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> request) {
        try {
            String idToken = request.get("idToken");
            if (idToken == null || !idToken.matches("^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$")) {
                return ResponseEntity.badRequest().body("Invalid ID token format");
            }

            System.out.println("Received Google token (first 50 chars): " +
                    (idToken.length() > 50 ? idToken.substring(0, 50) + "..." : idToken));

            GoogleIdToken.Payload payload = googleAuthService.verifyToken(idToken);
            String email = payload.getEmail();

            if (email == null) {
                return ResponseEntity.badRequest().body("Email not found in token");
            }
            User user = userRepository.findByEmail(email);
            if (user == null) {
                // Create new user without role
                user = new User();
                user.setEmail(email);
                user.setFirstName((String) payload.get("given_name"));
                user.setLastName((String) payload.get("family_name"));
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                user.setVerified(true);
                user.setRole(null); // Explicit null for role selection
                user = userRepository.save(user); // Now allowed because role is nullable

                return ResponseEntity.ok(Map.of(
                        "status", "role_selection_required",
                        "email", email,
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName(),
                        "idUser", user.getIdUser()
                ));
            }

            if (user.isBanned()) {
                return ResponseEntity.badRequest().body("Account is banned");
            }

            if (user.getRole() == null) {
                // User exists but no role assigned
                Map<String, Object> response = new HashMap<>();
                response.put("status", "role_selection_required");
                response.put("email", email);
                response.put("firstName", user.getFirstName());
                response.put("lastName", user.getLastName());
                response.put("idUser", user.getIdUser());
                return ResponseEntity.ok(response);
            }

            String token = tokenService.generateToken(user);
            return ResponseEntity.ok(new JwtResponse(
                    token,
                    user.getEmail(),
                    user.getFirstName(),
                    user.getRole(),
                    user.isVerified(),
                    user.getIdUser()
            ));

        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication failed: " + e.getMessage());
        }
    }
    @PostMapping("/google/register")
    public ResponseEntity<?> registerWithGoogle(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            String role = request.get("role");

            if (email == null || role == null) {
                return ResponseEntity.badRequest().body("Email and role are required");
            }

            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            if (user.getRole() != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User already has a role assigned");
            }

            // Convert String role to Role enum
            Role roleEnum;
            try {
                roleEnum = Role.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid role: " + role);
            }

            // Assign role and update user
            user.setRole(roleEnum);
            user.setFirstName(firstName != null ? firstName : user.getFirstName());
            user.setLastName(lastName != null ? lastName : user.getLastName());

            // Create specific entity based on role
            switch (roleEnum) {
                case PATIENT:
                    Patient patient = new Patient();
                    patient.setEmail(email);
                    patient.setFirstName(firstName);
                    patient.setLastName(lastName);
                    patient.setPassword(user.getPassword());
                    patient.setVerified(true);
                    patient.setDescription("");
                    userService.createPatient(patient);
                    break;
                case MEDECIN:
                    Medecin medecin = new Medecin();
                    medecin.setEmail(email);
                    medecin.setFirstName(firstName);
                    medecin.setLastName(lastName);
                    medecin.setPassword(user.getPassword());
                    medecin.setVerified(true);
                    medecin.setDescription("");
                    userService.createMedecin(medecin);
                    break;
                case CHAUFFEUR:
                    Chauffeur chauffeur = new Chauffeur();
                    chauffeur.setEmail(email);
                    chauffeur.setFirstName(firstName);
                    chauffeur.setLastName(lastName);
                    chauffeur.setPassword(user.getPassword());
                    chauffeur.setVerified(true);
                    chauffeur.setDescription("");
                    userService.createChauffeur(chauffeur);
                    break;
                default:
                    return ResponseEntity.badRequest().body("Invalid role: " + role);
            }

            userRepository.save(user);
            String token = tokenService.generateToken(user);

            return ResponseEntity.ok(new JwtResponse(
                    token,
                    user.getEmail(),
                    user.getFirstName(),
                    user.getRole(),
                    user.isVerified(),
                    user.getIdUser()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }


    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("Email already verified");
        }

        if (code.equals(user.getVerificationCode())) {
            user.setVerified(true);
            userRepository.save(user);
            return ResponseEntity.ok().body(Map.of("message", "Email verified successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid verification code"));
        }
    }
}