package tn.esprit.pi.services;


import tn.esprit.pi.entities.Consultation;
import tn.esprit.pi.entities.Medecin;
import tn.esprit.pi.entities.Patient;
import tn.esprit.pi.entities.RendezVous;

import java.util.Date;
import java.util.List;

public interface IRendezVousService {

    RendezVous addRendezVous(RendezVous rendezVous);
    RendezVous updateRendezVous(RendezVous rendezVous);
    void  deleteRendezVous(long idRendezVous);
    List<RendezVous> retrieveAllRendezVous() ;
    RendezVous retrieveRendezVous(long idRendezVous);
    public RendezVous affecterRendezVousToMedecin(long idRendezVous, long idMedecin);

    public RendezVous  affecterRendezVousToPatient(long idRendezVous, long idPatient) ;
    public List<RendezVous> retrieveRendezVousByMedecin(long idMedecin);
    public Date proposerCreneauOptimal(Long idMedecin);


    Consultation affecterRendezVousToConsultation(long idConsultation, long idRendezVous);
    public Consultation removeConsultationFromRendezVous(long idConsultation, long idRendezVous);
    List<Medecin> retrieveAllMedecins() ;
    List<Patient> retrieveAllPatients() ;



    public  void   desaffecterMedecinFromRendezVous(long idRendezVous );
    public void desaffecterPatientFromRendezVous(long idRendezVous);

    public RendezVous ajouterRendezVousEtAffecterMedecin(RendezVous rendezVous, long idUser);
    public RendezVous ajouterRendezVousEtAffecterPatient(RendezVous rendezVous, long idUser);

    // Méthodes supplémentaires
   // List<RendezVous> getRendezVousByConsultation(long idConsultation);
   // List<RendezVous> getRendezVousByPatient(long idPatient);
    //boolean isRendezVousDisponible(long idMedecin, String dateHeure);
    //void annulerRendezVous(long idRendezVous);
}
