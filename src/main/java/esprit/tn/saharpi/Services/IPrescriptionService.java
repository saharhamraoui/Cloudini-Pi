package esprit.tn.saharpi.Services;

import esprit.tn.saharpi.entities.Prescription;

import java.util.List;

public interface IPrescriptionService {
    Prescription addPrescription(Prescription prescription);
    Prescription updatePrescription(Prescription prescription);
    void deletePrescription(long idPrescription);
    List<Prescription> getPrescriptions();
    Prescription getPrescriptionById(long idPrescription);
}
