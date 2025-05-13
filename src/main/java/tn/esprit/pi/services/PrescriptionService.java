package tn.esprit.pi.services;

import tn.esprit.pi.repositories.PrescriptionRepository;
import tn.esprit.pi.entities.Prescription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionService implements IPrescriptionService {

    @Autowired
    PrescriptionRepository prescriptionRepository;

    @Override
    public Prescription addPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    @Override
    public Prescription updatePrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    @Override
    public void deletePrescription(long idPrescription) {
       prescriptionRepository.deleteById(idPrescription);
    }

    @Override
    public List<Prescription> getPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @Override
    public List<Prescription> findByMedication(String medication) {
        return prescriptionRepository.findPrescriptionByMedication(medication);
    }

    @Override
    public Prescription getPrescriptionById(long idPrescription) {
        return prescriptionRepository.findById(idPrescription).orElse(null);
    }

    @Override
    public List<Prescription> getPrescriptionByIdRecord(long idMedicationRecord) {
        return prescriptionRepository.findPrescriptionByMedicalRecordIdMedicalRecord(idMedicationRecord);
    }
}
