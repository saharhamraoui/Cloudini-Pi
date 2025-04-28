package tn.esprit.pi.Controllers;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
        import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpEntity;
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular frontend
@AllArgsConstructor
@RestController
@RequestMapping("/api/chatbot")
public class chatbotController {

}
