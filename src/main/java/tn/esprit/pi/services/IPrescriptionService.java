package tn.esprit.pi.services;


import tn.esprit.pi.entities.Prescription;

import java.util.List;

public interface IPrescriptionService {
    Prescription addPrescription(Prescription prescription);
    Prescription updatePrescription(Prescription prescription);
    void deletePrescription(long idPrescription);
    List<Prescription> getPrescriptions();
    List<Prescription> findByMedication(String medication);
    Prescription getPrescriptionById(long idPrescription);
    List<Prescription> getPrescriptionByIdRecord(long idMedicationRecord);


}
