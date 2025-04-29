package tn.esprit.pi.services;


import tn.esprit.pi.entities.Consultation;
import tn.esprit.pi.entities.MedicalRecord;
import tn.esprit.pi.entities.RendezVous;

import java.util.List;

public interface IConsultationService {
    Consultation addConsultation(Consultation consultation);
    Consultation updateConsultation(Consultation consultation);
    void  deleteConsultation(long idConsultation);
    List<Consultation> retrieveAllConsultation() ;
    Consultation retrieveConsultation(long idConsultation);
    public Consultation affecterConsultationToRendezVous(long idConsultation, long idRendezVous);

    public Consultation affecterConsultationToMedicalRecord(long idConsultation, long idMedicalRecord);
    public List<RendezVous> retrieveAllRendezVous();
    public List<MedicalRecord> retrieveAllMedicalRecords();
}
