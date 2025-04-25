package tn.esprit.pi.controllers;

import jakarta.persistence.DiscriminatorValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/addUser")
    public User addUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/updateUser/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setIdUser(id);
        return userService.updateUser(user);
    }

    @DeleteMapping("/deleteUser/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping("/getUser/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @GetMapping("/getAll")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/addPatients")
    public Patient createPatient(@RequestBody Patient patient) {
        return userService.createPatient(patient);
    }

    @GetMapping("/getPatients")
    public List<Patient> getAllPatients() {
        return userService.getAllPatients();
    }

    @PostMapping("/addChauffeurs")
    public Chauffeur createChauffeur(@RequestBody Chauffeur chauffeur) {
        return userService.createChauffeur(chauffeur);
    }

    @GetMapping("/getChauffeurs")
    public List<Chauffeur> getAllChauffeurs() {
        return userService.getAllChauffeurs();
    }

    @PostMapping("/addMedecins")
    public Medecin createMedecin(@RequestBody Medecin medecin) {
        return userService.createMedecin(medecin);
    }

    @GetMapping("/getMedecins")
    public List<Medecin> getAllMedecins() {
        return userService.getAllMedecins();
    }

    @PostMapping("/create-admin")
    public User createAdmin(@RequestParam String firstName, @RequestParam String lastName,
                            @RequestParam String email, @RequestParam String password) {
        return userService.createAdmin(firstName, lastName, email, password);
    }
    @GetMapping("/banned-users")
    public ResponseEntity<List<User>> getBannedUsers() {
        return ResponseEntity.ok(userService.getAllBannedUsers());
    }

    @PostMapping("/toggle-ban")
    public ResponseEntity<User> toggleBan(
            @RequestParam Long userId,
            @RequestParam boolean status) {

        try {
            User user = userService.toggleBan(userId, status);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @PutMapping("/update-patient")
    public ResponseEntity<Patient> updatePatient(@RequestBody Patient patient) {
        try {
            return ResponseEntity.ok(userService.updatePatient(patient));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/update-medecin")
    public ResponseEntity<Medecin> updateMedecin(@RequestBody Medecin medecin) {
        try {
            return ResponseEntity.ok(userService.updateMedecin(medecin));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/update-chauffeur")
    public ResponseEntity<Chauffeur> updateChauffeur(@RequestBody Chauffeur chauffeur) {
        try {
            return ResponseEntity.ok(userService.updateChauffeur(chauffeur));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @PutMapping("/users/{userId}/change-role")
    public ResponseEntity<User> changeUserRole(
            @PathVariable Long userId,
            @RequestParam Role newRole) {
        try {
            User updatedUser = userService.changeUserRole(userId, newRole);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}