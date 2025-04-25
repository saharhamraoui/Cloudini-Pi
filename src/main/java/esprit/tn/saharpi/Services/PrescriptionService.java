package esprit.tn.saharpi.Services;

import esprit.tn.saharpi.Repositories.PrescriptionRepository;
import esprit.tn.saharpi.entities.Prescription;
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
    public Prescription getPrescriptionById(long idPrescription) {
        return prescriptionRepository.findById(idPrescription).orElse(null);
    }
}
