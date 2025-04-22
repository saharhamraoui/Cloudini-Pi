package tn.esprit.pi.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.Repositories.ConsultationRepository;
import tn.esprit.pi.Repositories.MedicalRecordRepository;
import tn.esprit.pi.Repositories.RendezVousRepository;
import tn.esprit.pi.entities.Consultation;
import tn.esprit.pi.entities.MedicalRecord;
import tn.esprit.pi.entities.RendezVous;

import java.util.List;

@Service
public class ConsultationServiceImplement implements  IConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository ;
    @Autowired
    private RendezVousRepository rendezVousRepository ;
    @Autowired
    private MedicalRecordRepository medicalRecordRepository ;
    @Override
    public Consultation addConsultation(Consultation consultation) {
        return consultationRepository.save(consultation);
    }

    @Override
    public Consultation updateConsultation(Consultation consultation) {
        return consultationRepository.save(consultation);
    }

    @Override
    public void deleteConsultation(long idConsultation) {
        consultationRepository.deleteById(idConsultation);
    }

    @Override
    public List<Consultation> retrieveAllConsultation() {
        return consultationRepository.findAll();
    }

    @Override
    public Consultation retrieveConsultation(long idConsultation) {
        return consultationRepository.findById(idConsultation).get();
    }

    @Override
    public Consultation affecterConsultationToRendezVous(long idConsultation, long idRendezVous) {
        Consultation consultation = consultationRepository.findById(idConsultation)
                .orElseThrow(() -> new RuntimeException("Consultation introuvable"));

        RendezVous rendezVous = rendezVousRepository.findById(idRendezVous)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));

        if (rendezVous.getConsultation() != null) {
            throw new RuntimeException("Ce rendez-vous est déjà associé à une consultation !");
        }

        consultation.setRendezVous(rendezVous);
        rendezVous.setConsultation(consultation);

        consultationRepository.save(consultation);
        rendezVousRepository.save(rendezVous);

        return consultation;
    }

    @Override
    public Consultation affecterConsultationToMedicalRecord(long idConsultation, long idMedicalRecord) {
        Consultation consultation = consultationRepository.findById(idConsultation)
                .orElseThrow(() -> new RuntimeException("Consultation introuvable"));

        MedicalRecord medicalRecord = medicalRecordRepository.findById(idMedicalRecord)
                .orElseThrow(() -> new RuntimeException("Dossier médical introuvable"));

        consultation.setMedicalRecord(medicalRecord);
        medicalRecord.getConsultation().add(consultation);

        consultationRepository.save(consultation);
        medicalRecordRepository.save(medicalRecord);

        return consultation;
    }

    @Override
    public List<RendezVous> retrieveAllRendezVous() {
        System.out.println("Fetching all doctors...");
        return rendezVousRepository.findAll();
    }

    @Override
    public List<MedicalRecord> retrieveAllMedicalRecords() {
        System.out.println("Fetching all doctors...");
        return medicalRecordRepository.findAll();
    }

}
