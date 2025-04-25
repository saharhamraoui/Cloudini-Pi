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
        User existing = userRepository.findById(user.getIdUser())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Mise à jour des champs communs
        existing.setFirstName(user.getFirstName());
        existing.setLastName(user.getLastName());
        existing.setEmail(user.getEmail());
        existing.setPhoneNumber(user.getPhoneNumber());
        existing.setAddress(user.getAddress());


        return userRepository.save(existing);
    }
    public User changeUserRole(Long userId, Role newRole) {
        // Récupérer l'utilisateur existant
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Si le rôle est le même, retourner l'utilisateur tel quel
        if (user.getRole() == newRole) {
            return user;
        }

        // Supprimer l'entité spécifique existante
        deleteSpecificUserEntity(userId, user.getRole());

        // Créer la nouvelle entité spécifique
        return createSpecificUserEntity(user, newRole);
    }

    private void deleteSpecificUserEntity(Long userId, Role currentRole) {
        switch(currentRole) {
            case PATIENT:
                patientRepository.deleteById(userId);
                break;
            case MEDECIN:
                medecinRepository.deleteById(userId);
                break;
            case CHAUFFEUR:
                chauffeurRepository.deleteById(userId);
                break;
            default:
                // Pour les autres rôles (ADMIN, etc.), rien à supprimer
                break;
        }
    }

    private User createSpecificUserEntity(User user, Role newRole) {
        // Mettre à jour le rôle de base
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);

        // Créer l'entité spécifique selon le nouveau rôle
        switch(newRole) {
            case PATIENT:
                Patient patient = new Patient();
                copyUserPropertiesToPatient(user, patient);
                return patientRepository.save(patient);

            case MEDECIN:
                Medecin medecin = new Medecin();
                copyUserPropertiesToMedecin(user, medecin);
                return medecinRepository.save(medecin);

            case CHAUFFEUR:
                Chauffeur chauffeur = new Chauffeur();
                copyUserPropertiesToChauffeur(user, chauffeur);
                return chauffeurRepository.save(chauffeur);

            default:
                // Pour les autres rôles (ADMIN, etc.), retourner l'utilisateur de base
                return updatedUser;
        }
    }

    // Méthodes utilitaires pour copier les propriétés
    private void copyUserPropertiesToPatient(User source, Patient target) {
        target.setIdUser(source.getIdUser());
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());
        target.setEmail(source.getEmail());
        target.setPhoneNumber(source.getPhoneNumber());
        target.setAddress(source.getAddress());
        target.setPassword(source.getPassword());
        target.setBanned(source.isBanned());

        // Initialiser les champs spécifiques à Patient avec des valeurs par défaut
        target.setMedicalRecordNumber("");
        target.setBloodGroup("");
        target.setHealthInsuranceNumber("");
        target.setGender("M");
        target.setDateOfBirth(null);
    }

    private void copyUserPropertiesToMedecin(User source, Medecin target) {
        target.setIdUser(source.getIdUser());
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());
        target.setEmail(source.getEmail());
        target.setPhoneNumber(source.getPhoneNumber());
        target.setAddress(source.getAddress());
        target.setPassword(source.getPassword());
        target.setBanned(source.isBanned());

        // Initialiser les champs spécifiques à Medecin
        target.setSpeciality("");
        target.setLicenseNumber("");
        target.setAvailability("AVAILABLE");    }

    private void copyUserPropertiesToChauffeur(User source, Chauffeur target) {
        target.setIdUser(source.getIdUser());
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());
        target.setEmail(source.getEmail());
        target.setPhoneNumber(source.getPhoneNumber());
        target.setAddress(source.getAddress());
        target.setPassword(source.getPassword());
        target.setBanned(source.isBanned());

        // Initialiser les champs spécifiques à Chauffeur
        target.setDriverLicenseNumber("");
        target.setDriverAvailability("AVAILABLE");
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

    @Override
    public Patient updatePatient(Patient patient) {
        Patient existing = patientRepository.findById(patient.getIdUser())
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        // Mise à jour des champs communs
        existing.setFirstName(patient.getFirstName());
        existing.setLastName(patient.getLastName());
        existing.setEmail(patient.getEmail());
        existing.setPhoneNumber(patient.getPhoneNumber());
        existing.setAddress(patient.getAddress());

        // Mise à jour des champs spécifiques
        existing.setMedicalRecordNumber(patient.getMedicalRecordNumber());
        existing.setBloodGroup(patient.getBloodGroup());
        existing.setHealthInsuranceNumber(patient.getHealthInsuranceNumber());
        existing.setGender(patient.getGender());
        existing.setDateOfBirth(patient.getDateOfBirth());

        return patientRepository.save(existing);
    }
    @Override
    public Medecin updateMedecin(Medecin medecin) {
        Medecin existing = medecinRepository.findById(medecin.getIdUser())
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé"));

        // Champs communs
        existing.setFirstName(medecin.getFirstName());
        existing.setLastName(medecin.getLastName());
        existing.setEmail(medecin.getEmail());
        existing.setPhoneNumber(medecin.getPhoneNumber());
        existing.setAddress(medecin.getAddress());

        // Champs spécifiques
        existing.setSpeciality(medecin.getSpeciality());
        existing.setLicenseNumber(medecin.getLicenseNumber());
        existing.setAvailability(medecin.getAvailability());

        return medecinRepository.save(existing);
    }

    @Override
    public Chauffeur updateChauffeur(Chauffeur chauffeur) {
        Chauffeur existing = chauffeurRepository.findById(chauffeur.getIdUser())
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé"));

        // Champs communs
        existing.setFirstName(chauffeur.getFirstName());
        existing.setLastName(chauffeur.getLastName());
        existing.setEmail(chauffeur.getEmail());
        existing.setPhoneNumber(chauffeur.getPhoneNumber());
        existing.setAddress(chauffeur.getAddress());

        // Champs spécifiques
        existing.setDriverLicenseNumber(chauffeur.getDriverLicenseNumber());
        existing.setDriverAvailability(chauffeur.getDriverAvailability());

        return chauffeurRepository.save(existing);
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
        }
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect !");
        }
        if (user.isBanned()) {
            throw new RuntimeException("Ce compte est banni");
        }

        return user;
    }

}