package tn.esprit.pi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.repositories.ChauffeurRepository;
import tn.esprit.pi.repositories.MedecinRepository;
import tn.esprit.pi.repositories.PatientRepository;
import tn.esprit.pi.repositories.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class UserService implements IUserService {
    private static final String DEFAULT_PHOTO_URL = "/assets/default-profile.png";
    private static final String UPLOAD_DIR = "static/uploads/";
    private static final String UPLOAD_PATH_PREFIX = "/uploads/";

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

    // --- User Management ---

    @Override
    public User createUser(User user) {
        setCommonUserProperties(user);
        return userRepository.save(user);
    }

    @Override
    public User updateUser(User user) {
        User existing = findUserById(user.getIdUser());
        updateCommonUserFields(existing, user);
        return userRepository.save(existing);
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


    public List<User> getAllBannedUsers() {
        return userRepository.findByBannedTrue();
    }

    public User toggleBan(Long userId, boolean status) {
        User user = findUserById(userId);
        user.setBanned(status);
        return userRepository.save(user);
    }

    // --- Role-Specific User Creation ---

    @Override
    public Patient createPatient(Patient patient) {
        setCommonUserProperties(patient);
        patient.setRole(Role.PATIENT);
        return patientRepository.save(patient);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Chauffeur createChauffeur(Chauffeur chauffeur) {
        setCommonUserProperties(chauffeur);
        chauffeur.setRole(Role.CHAUFFEUR);
        return chauffeurRepository.save(chauffeur);
    }

    @Override
    public List<Chauffeur> getAllChauffeurs() {
        return chauffeurRepository.findAll();
    }

    @Override
    public Medecin createMedecin(Medecin medecin) {
        setCommonUserProperties(medecin);
        medecin.setRole(Role.MEDECIN);
        return medecinRepository.save(medecin);
    }

    @Override
    public List<Medecin> getAllMedecins() {
        return medecinRepository.findAll();
    }

    // --- Role-Specific User Updates ---

    @Override
    public Patient updatePatient(Patient patient) {
        Patient existing = findPatientById(patient.getIdUser());
        updateCommonUserFields(existing, patient);
        existing.setMedicalRecordNumber(patient.getMedicalRecordNumber());
        existing.setBloodGroup(patient.getBloodGroup());
        existing.setHealthInsuranceNumber(patient.getHealthInsuranceNumber());
        existing.setGender(patient.getGender());
        existing.setDateOfBirth(patient.getDateOfBirth());
        return patientRepository.save(existing);
    }

    @Override
    public Medecin updateMedecin(Medecin medecin) {
        Medecin existing = findMedecinById(medecin.getIdUser());
        updateCommonUserFields(existing, medecin);
        existing.setSpeciality(medecin.getSpeciality());
        existing.setLicenseNumber(medecin.getLicenseNumber());
        existing.setAvailability(medecin.getAvailability());
        return medecinRepository.save(existing);
    }

    @Override
    public Chauffeur updateChauffeur(Chauffeur chauffeur) {
        Chauffeur existing = findChauffeurById(chauffeur.getIdUser());
        updateCommonUserFields(existing, chauffeur);
        existing.setDriverLicenseNumber(chauffeur.getDriverLicenseNumber());
        existing.setDriverAvailability(chauffeur.getDriverAvailability());
        return chauffeurRepository.save(existing);
    }

    // --- Role Management ---

    public User changeUserRole(Long userId, Role newRole) {
        User user = findUserById(userId);
        if (user.getRole() == newRole) {
            return user;
        }
        deleteSpecificUserEntity(userId, user.getRole());
        return createSpecificUserEntity(user, newRole);
    }

    private void deleteSpecificUserEntity(Long userId, Role currentRole) {
        switch (currentRole) {
            case PATIENT -> patientRepository.deleteById(userId);
            case MEDECIN -> medecinRepository.deleteById(userId);
            case CHAUFFEUR -> chauffeurRepository.deleteById(userId);
            default -> {
                // No action for ADMIN or other roles
            }
        }
    }

    private User createSpecificUserEntity(User user, Role newRole) {
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);

        return switch (newRole) {
            case PATIENT -> {
                Patient patient = new Patient();
                copyUserProperties(updatedUser, patient);
                patient.setMedicalRecordNumber("");
                patient.setBloodGroup("");
                patient.setHealthInsuranceNumber("");
                patient.setGender("M");
                patient.setDateOfBirth(null);
                yield patientRepository.save(patient);
            }
            case MEDECIN -> {
                Medecin medecin = new Medecin();
                copyUserProperties(updatedUser, medecin);
                medecin.setSpeciality("");
                medecin.setLicenseNumber("");
                medecin.setAvailability("AVAILABLE");
                yield medecinRepository.save(medecin);
            }
            case CHAUFFEUR -> {
                Chauffeur chauffeur = new Chauffeur();
                copyUserProperties(updatedUser, chauffeur);
                chauffeur.setDriverLicenseNumber("");
                chauffeur.setDriverAvailability("AVAILABLE");
                yield chauffeurRepository.save(chauffeur);
            }
            default -> updatedUser;
        };
    }

    // --- Authentication ---

    public User createAdmin(String firstName, String lastName, String email, String password) {
        User admin = new User();
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole(Role.ADMIN);
        admin.setPhotoUrl(DEFAULT_PHOTO_URL);
        admin.setDescription("");
        return userRepository.save(admin);
    }

    public User authenticate(String email, String rawPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect password");
        }
        if (user.isBanned()) {
            throw new RuntimeException("This account is banned");
        }
        if (!user.isVerified()) {
            throw new RuntimeException("Email not verified");
        }
        return user;
    }

    // --- Photo Upload ---

    public String saveUserPhoto(MultipartFile file) throws IOException {
        // Use an external directory (e.g., project root or system temp dir)
        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        String fileName = UUID.randomUUID() + "_" +
                StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return UPLOAD_PATH_PREFIX + fileName;
    }

    // --- Utility Methods ---

    private void setCommonUserProperties(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setPhotoUrl(user.getPhotoUrl() != null && !user.getPhotoUrl().isEmpty() ? user.getPhotoUrl() : DEFAULT_PHOTO_URL);
        user.setDescription(user.getDescription() != null ? user.getDescription() : "");
    }

    private void updateCommonUserFields(User existing, User updated) {
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhoneNumber(updated.getPhoneNumber());
        existing.setAddress(updated.getAddress());
        existing.setDescription(updated.getDescription());
    }

    private void copyUserProperties(User source, User target) {
        target.setIdUser(source.getIdUser());
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());
        target.setEmail(source.getEmail());
        target.setPhoneNumber(source.getPhoneNumber());
        target.setAddress(source.getAddress());
        target.setPassword(source.getPassword());
        target.setBanned(source.isBanned());
        target.setRole(source.getRole());
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Patient findPatientById(Long userId) {
        return patientRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    private Medecin findMedecinById(Long userId) {
        return medecinRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Medecin not found"));
    }

    private Chauffeur findChauffeurById(Long userId) {
        return chauffeurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Chauffeur not found"));
    }
}