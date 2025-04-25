package esprit.tn.pidev.Services;

import esprit.tn.pidev.entities.Chauffeur;
import esprit.tn.pidev.entities.Medecin;
import esprit.tn.pidev.entities.Patient;
import esprit.tn.pidev.entities.User;

import java.util.List;

public interface IUserService {
    User createUser(User user);
    User updateUser(User user);


    void deleteUser(Long userId);
    User getUser(Long userId);
    List<User> getAllUsers();


    Patient createPatient(Patient patient);
    Medecin createMedecin(Medecin medecin);

    List<Patient> getAllPatients();
    List<Medecin> getAllMedecins();
    Patient updatePatient(Patient patient);
    Medecin updateMedecin(Medecin medecin);

}
