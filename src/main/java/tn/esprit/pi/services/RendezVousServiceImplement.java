package tn.esprit.pi.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.repositories.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        // Sauvegarder le rendez-vous dans la base de données
        RendezVous savedRendezVous = rendezVousRepository.save(rendezVous);

        // Récupérer le type de rendez-vous directement depuis l'objet 'rendezVous'
        String typeRendezVous = rendezVous.getTypeRendezVous(); // Utilise le type directement du formulaire, sans chercher dans la base

        // Simulation ou test d'envoi
        try {
            String toEmail = "darinedhifallah2021@gmail.com";
            String subject = "Test : Confirmation de votre rendez-vous";
            String body = "Bonjour,\n\nVotre rendez-vous est confirmé pour le " +
                    savedRendezVous.getDateRendezVous() + ".\n\nMerci.";

            // Vérifier le type de rendez-vous et envoyer un mail différent selon le type
            if ("EN_LIGNE".equals(typeRendezVous)) {
                // Générer un lien de réunion dynamique (à adapter à ton besoin)
                String meetLink = "https://meet.google.com/jzx-auhv-rex";
                // Remplace par ta méthode pour générer un code Meet
                body += "\nVoici votre lien pour la visioconférence : " + meetLink;
            } else {
                // Sinon, juste une confirmation de rendez-vous présentiel
                body += "\nNous vous attendons à notre cabinet.";
            }

            // Envoi du mail
           // emailService.sendEmail(toEmail, subject, body);
        } catch (Exception e) {
            System.out.println("⚠️ Erreur d'envoi de mail : " + e.getMessage());
        }

        return savedRendezVous;
    }

    public Date proposerCreneauOptimal(Long idMedecin) {
        List<RendezVous> rdvs = rendezVousRepository.findAll()
                .stream()
                .filter(rdv -> rdv.getMedecin() != null && rdv.getMedecin().getIdUser() == idMedecin)
                .collect(Collectors.toList());

        // Supposons que le médecin travaille de 08h à 22h chaque jour
        LocalDateTime now = LocalDateTime.now().withHour(8).withMinute(0);

        // Utilisation de l'historique pour ajuster les créneaux
        Map<Integer, Long> chargeParHeure = new HashMap<>();
        for (RendezVous rdv : rdvs) {
            LocalDateTime rdvDate = LocalDateTime.ofInstant(rdv.getDateRendezVous().toInstant(), ZoneId.systemDefault());
            int hour = rdvDate.getHour();
            chargeParHeure.put(hour, chargeParHeure.getOrDefault(hour, 0L) + 1);
        }

        while (true) {
            // Crée une nouvelle variable pour la comparaison dans la lambda
            LocalDateTime currentTime = now;

            boolean estPris = rdvs.stream().anyMatch(rdv -> {
                LocalDateTime rdvDate = LocalDateTime.ofInstant(rdv.getDateRendezVous().toInstant(), ZoneId.systemDefault());
                return ChronoUnit.MINUTES.between(currentTime, rdvDate) < 30 && ChronoUnit.MINUTES.between(rdvDate, currentTime) < 30;
            });

            if (!estPris && now.getHour() < 22 && chargeParHeure.getOrDefault(now.getHour(), 0L) < 3) {
                // Propose un créneau si il n'est pas déjà pris et qu'il n'y a pas trop de rendez-vous
                return Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
            }

            now = now.plusMinutes(30);  // Incrémentation du créneau horaire
        }
    }



//    private String generateMeetingCode() {
//        // Génère un code aléatoire au format XXX-XXXX-XXX
//        String chars = "abcdefghijklmnopqrstuvwxyz0123456789";
//        Random random = new Random();
//
//        StringBuilder code = new StringBuilder();
//        for (int i = 0; i < 10; i++) {
//            code.append(chars.charAt(random.nextInt(chars.length())));
//            if (i == 2 || i == 6) {
//                code.append("-");
//            }
//        }
//        return code.toString();
//    }

//    public String generateMeetingCode() {
//        // Générer un code unique pour chaque réunion
//        return UUID.randomUUID().toString().substring(0, 12); // Prend seulement les 12 premiers caractères
//    }



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
