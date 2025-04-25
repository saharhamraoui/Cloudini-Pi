package esprit.tn.pidev.Controllers;


import esprit.tn.pidev.Services.UserService;
import esprit.tn.pidev.entities.Medecin;
import esprit.tn.pidev.entities.Patient;
import esprit.tn.pidev.entities.User;
import jakarta.persistence.DiscriminatorValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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


    @PostMapping("/addMedecins")
    public Medecin createMedecin(@RequestBody Medecin medecin) {
        return userService.createMedecin(medecin);
    }

    @GetMapping("/getMedecins")
    public List<Medecin> getAllMedecins() {
        return userService.getAllMedecins();
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

}