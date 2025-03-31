package tn.esprit.pi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.pi.Security.JwtUtil;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.repositories.UserRepository;
import tn.esprit.pi.repositories.PatientRepository;
import tn.esprit.pi.repositories.ChauffeurRepository;
import tn.esprit.pi.repositories.MedecinRepository;

import java.util.List;

@Service
public class UserService implements IUserService {
    @Qualifier("bCryptPasswordEncoder")
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private ChauffeurRepository chauffeurRepository;
    @Autowired
    private MedecinRepository medecinRepository;
    @Autowired

    private JwtUtil jwtUtil;


    @Override
    public User createUser(User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public User getUser(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Patient createPatient(Patient patient) {
        String hashedPassword = passwordEncoder.encode(patient.getPassword());
        patient.setPassword(hashedPassword);
        patient.setRole(Role.PATIENT);

        return patientRepository.save(patient);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Chauffeur createChauffeur(Chauffeur chauffeur) {
        String hashedPassword = passwordEncoder.encode(chauffeur.getPassword());
        chauffeur.setRole(Role.CHAUFFEUR);

        chauffeur.setPassword(hashedPassword);

        return chauffeurRepository.save(chauffeur);
    }

    @Override
    public List<Chauffeur> getAllChauffeurs() {
        return chauffeurRepository.findAll();
    }

    @Override
    public Medecin createMedecin(Medecin medecin) {
        String hashedPassword = passwordEncoder.encode(medecin.getPassword());
        medecin.setPassword(hashedPassword);
        medecin.setRole(Role.MEDECIN);

        return medecinRepository.save(medecin);
    }

    @Override
    public List<Medecin> getAllMedecins() {
        return medecinRepository.findAll();
    }
    public List<User> getAllBannedUsers() {
        return userRepository.findByBannedTrue();
    }

    public User toggleBan(Long userId, boolean status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setBanned(status);
        return userRepository.save(user);
    }
    public User createAdmin(String firstName, String lastName, String email, String password) {
        User admin = new User();
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole(Role.ADMIN);
        return userRepository.save(admin);
    }

    public User authenticate(String email, String rawPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé");
        }        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect !");
        }
        if (user.isBanned()) {
            throw new RuntimeException("Ce compte est banni");
        }

        return user;
    }
}