package tn.esprit.pi.services;

import tn.esprit.pi.entities.User;
import tn.esprit.pi.entities.Patient;
import tn.esprit.pi.entities.Chauffeur;
import tn.esprit.pi.entities.Medecin;

import java.util.List;

public interface IUserService {
    User createUser(User user);
    User updateUser(User user);
    void deleteUser(Long userId);
    User getUser(Long userId);
    List<User> getAllUsers();


    Patient createPatient(Patient patient);
    Chauffeur createChauffeur(Chauffeur chauffeur);
    Medecin createMedecin(Medecin medecin);

    List<Patient> getAllPatients();
    List<Chauffeur> getAllChauffeurs();
    List<Medecin> getAllMedecins();
}