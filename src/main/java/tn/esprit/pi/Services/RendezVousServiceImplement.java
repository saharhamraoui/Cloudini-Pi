package tn.esprit.pi.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.Repositories.*;
import tn.esprit.pi.entities.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RendezVousServiceImplement implements IRendezVousService {

    @Autowired
    private RendezVousRepository rendezVousRepository ;
    @Autowired
    private ConsultationRepository consultationRepository ;
    @Autowired
    private MedecinRepository medecinRepository ;
    @Autowired
    private PatientRepository patientRepository ;
    @Autowired
    private UserRepository userRepository ;
    @Autowired
    private MailService emailService;


//    @Override
//    public RendezVous addRendezVous(RendezVous rendezVous) {
//        return rendezVousRepository.save(rendezVous);
//    }

//    @Override
//    public RendezVous addRendezVous(RendezVous rendezVous) {
//        RendezVous savedRendezVous = rendezVousRepository.save(rendezVous);
//
//        // Envoi du mail
//        if (savedRendezVous.getPatient() != null && savedRendezVous.getPatient().getEmail() != null) {
//            String toEmail = savedRendezVous.getPatient().getEmail();
//            String subject = "Confirmation de votre rendez-vous";
//            String body = "Bonjour " + savedRendezVous.getPatient().getFirstName() + ",\n\n" +
//                    "Votre rendez-vous est confirmé pour le " + savedRendezVous.getDateRendezVous() +
//                    " avec le Dr. " + savedRendezVous.getMedecin().getLastName() + ".\n\n" +
//                    "Merci de votre confiance.";
//
//            emailService.sendEmail(toEmail, subject, body);
//        }
//
//        return savedRendezVous;
//    }

    @Override
    public RendezVous addRendezVous(RendezVous rendezVous) {

        RendezVous savedRendezVous = rendezVousRepository.save(rendezVous);

        // Simulation ou test d'envoi
        try {
            String toEmail = "darinedhifallah2021@gmail.com";
            String subject = "Test : Confirmation de votre rendez-vous";
            String body = "Bonjour,\n\nVotre rendez-vous est confirmé pour le " +
                    savedRendezVous.getDateRendezVous() + ".\n\nMerci.";

            emailService.sendEmail(toEmail, subject, body);
        } catch (Exception e) {
            System.out.println("⚠️ Erreur d'envoi de mail : " + e.getMessage());
        }

        return savedRendezVous;
    }



    @Override
    public RendezVous updateRendezVous(RendezVous rendezVous) {
        return rendezVousRepository.save(rendezVous);
    }

    @Override
    public void deleteRendezVous(long idRendezVous) {
        rendezVousRepository.deleteById(idRendezVous);
    }

    @Override
    public List<RendezVous> retrieveAllRendezVous() {
        return rendezVousRepository.findAll();
    }

    @Override
    public RendezVous retrieveRendezVous(long idRendezVous) {
        return rendezVousRepository.findById(idRendezVous).get();
    }
    @Override
    public RendezVous affecterRendezVousToMedecin(long idRendezVous, long idMedecin) {

        RendezVous rendezVous = rendezVousRepository.findById(idRendezVous)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));

        User user = userRepository.findById(idMedecin)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(user instanceof Medecin)) {
            throw new RuntimeException("L'utilisateur sélectionné n'est pas un médecin !");
        }

        Medecin medecin = (Medecin) user;

        rendezVous.setMedecin(medecin);

        return rendezVousRepository.save(rendezVous);
    }

    @Override
    public RendezVous affecterRendezVousToPatient(long idRendezVous, long idPatient) {

        RendezVous rendezVous = rendezVousRepository.findById(idRendezVous)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));


        User user = userRepository.findById(idPatient)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Vérifier que c'est bien un médecin (DiscriminatorValue = "DOCTEUR")
        if (!(user instanceof Patient)) {
            throw new RuntimeException("L'utilisateur sélectionné n'est pas un patient !");
        }

        // Caster l'utilisateur en médecin
        Patient patient = (Patient) user;

        // Affecter le médecin au rendez-vous
        rendezVous.setPatient(patient);

        // Sauvegarder la mise à jour
        return rendezVousRepository.save(rendezVous);
    }


    @Override
    public List<RendezVous> retrieveRendezVousByMedecin(long idMedecin) {
        return rendezVousRepository.findAll()
                .stream()
                .filter(rdv -> rdv.getMedecin() != null && rdv.getMedecin().getIdUser() == idMedecin)
                .collect(Collectors.toList());
    }
    @Override
    public Consultation affecterRendezVousToConsultation(long idConsultation, long idRendezVous) {
        Consultation consultation = consultationRepository.findById(idConsultation).get() ;
        RendezVous  rendezVous = rendezVousRepository.findById(idRendezVous).get();
        consultation.setRendezVous(rendezVous);
        return  consultationRepository.save(consultation);
    }

    @Override
    public Consultation removeConsultationFromRendezVous(long idConsultation, long idRendezVous) {
        Consultation consultation = consultationRepository.findById(idConsultation).get() ;
        RendezVous rendezVous = rendezVousRepository.findById(idRendezVous).get() ;
        consultation.setRendezVous(null);
        return  consultationRepository.save(consultation);
        // projet.getEquipes().add(equipe);
        // return  projetRepository.save(projet);
    }







    @Override
    public void desaffecterMedecinFromRendezVous(long idRendezVous) {
        RendezVous  rendezVous = rendezVousRepository.findById(idRendezVous).get() ;
        rendezVous.setMedecin(null);
        rendezVousRepository.save(rendezVous);
    }
    @Override
    public void desaffecterPatientFromRendezVous(long idRendezVous) {
        RendezVous  rendezVous = rendezVousRepository.findById(idRendezVous).get() ;
        rendezVous.setPatient(null);
        rendezVousRepository.save(rendezVous);
    }

    @Override
    public RendezVous ajouterRendezVousEtAffecterMedecin(RendezVous rendezVous, long idUser) {
        Medecin medecin =  medecinRepository.findById(idUser).get() ;
        rendezVous.setMedecin(medecin);
        return rendezVousRepository.save(rendezVous);

    }


    @Override
    public RendezVous ajouterRendezVousEtAffecterPatient(RendezVous rendezVous, long idUser) {
        Patient patient =  patientRepository.findById(idUser).get() ;
        rendezVous.setPatient(patient);
        return rendezVousRepository.save(rendezVous);

    }


//    @Override
//    public List<User> retrieveAllMedecins() {
//        return userRepository.findByUserType("DOCTEUR");
//    }
public List<Medecin> retrieveAllMedecins() {
    System.out.println("Fetching all doctors...");
    return medecinRepository.findAll();
}

    // Récupérer les patients

    @Override
    public List<Patient> retrieveAllPatients() {
        System.out.println("Fetching all doctors...");
        return patientRepository.findAll();
    }


}
