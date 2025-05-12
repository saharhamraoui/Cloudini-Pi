package tn.esprit.pi.services;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface IDiscountService {

    ResponseEntity<Map<String, Object>> uploadDisabilityCard(Long paiementId, MultipartFile file, String message) throws IOException;
    ResponseEntity<byte[]> getDisabilityCard(Long paiementId);

    }
