package esprit.tn.pidev.entities;

import jakarta.persistence.*;

@Entity
public class Bilan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // e.g., "Blood Test", "MRI"
    private String results; // e.g., JSON or text summary

    private String filePath; // File location for uploaded reports

    @ManyToOne
    @JoinColumn(name = "medical_record_id")
    private MedicalRecord medicalRecord;
}
