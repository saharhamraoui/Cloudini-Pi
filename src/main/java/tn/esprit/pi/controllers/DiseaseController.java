package tn.esprit.pi.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

// DiseaseController.java
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/disease")
public class DiseaseController {

    @PostMapping("/predict")
    public ResponseEntity<String> predictDisease(@RequestBody List<String> symptoms) {
        // exemple simple avec appel vers Python
        try {
            String symptomsText = String.join(" ", symptoms);
            ProcessBuilder pb = new ProcessBuilder(
                    "C:\\Users\\DELL£\\AppData\\Local\\Programs\\Python\\Python313\\python.exe",
                    "E:\\PiDev\\AI\\predict_model.py",
                    symptomsText
            );

            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String output = reader.lines().collect(Collectors.joining("\n"));
            process.waitFor();

            return ResponseEntity.ok(output);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la prédiction");
        }
    }
}
