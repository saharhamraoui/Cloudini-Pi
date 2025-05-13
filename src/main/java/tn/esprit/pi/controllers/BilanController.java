package tn.esprit.pi.controllers;



import tn.esprit.pi.repositories.BilanRepository;
import tn.esprit.pi.repositories.MedicalRecordRepository;
import tn.esprit.pi.entities.Bilan;
import tn.esprit.pi.entities.MedicalRecord;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/bilans")
@CrossOrigin(origins = "*")
public class BilanController {

    @Autowired
    private BilanRepository bilanRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @CrossOrigin(origins = "http://192.168.1.162:32584",
            allowedHeaders = "*",
            exposedHeaders = "Content-Disposition")
    @GetMapping("/medicalRecord/{medicalRecordId}")
    public List<Bilan> getBilansByMedicalRecord(@PathVariable Long medicalRecordId) {
        List<Bilan> bilans = bilanRepository.findByMedicalRecordIdMedicalRecord(medicalRecordId);
        return bilans;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadBilan(
            @RequestParam("type") String type,
            @RequestParam("results") String results,
            @RequestParam("file") MultipartFile file,
            @RequestParam("medicalRecordId") Long medicalRecordId
    ) {
        try {
            // Debug logging
            System.out.println("Received upload request:");
            System.out.println("Type: " + type);
            System.out.println("Results: " + results);
            System.out.println("MedicalRecord ID: " + medicalRecordId);
            System.out.println("File: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");

            // Validate medical record exists
            MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId)
                    .orElseThrow(() -> new RuntimeException("MedicalRecord not found with id: " + medicalRecordId));

            // Validate file
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            // Prepare Bilan entity
            Bilan bilan = new Bilan();
            bilan.setType(type);
            bilan.setResults(results);
            bilan.setFileData(file.getBytes());
            bilan.setFileName(file.getOriginalFilename());
            bilan.setFileType(file.getContentType());
            bilan.setMedicalRecord(medicalRecord);

            // Save and return
            Bilan savedBilan = bilanRepository.save(bilan);
            return ResponseEntity.ok(savedBilan);
        } catch (Exception e) {
            e.printStackTrace(); // This will show the full stack trace in server logs
            return ResponseEntity.status(500)
                    .body("Error uploading bilan: " + e.getMessage() +
                            "\nStack Trace: " + Arrays.toString(e.getStackTrace()));
        }
    }
}
