package esprit.tn.pidev.Services;



import esprit.tn.pidev.Repositories.MedecinRepository;
import esprit.tn.pidev.Repositories.PatientRepository;
import esprit.tn.pidev.Repositories.UserRepository;
import esprit.tn.pidev.entities.Medecin;
import esprit.tn.pidev.entities.Patient;
import esprit.tn.pidev.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedecinRepository medecinRepository;



    @Override
    public User createUser(User user) {

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

        return patientRepository.save(patient);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }


    @Override
    public Medecin createMedecin(Medecin medecin) {
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










}
