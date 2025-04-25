package tn.esprit.pi.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class RecaptchaService {

    @Value("${recaptcha.secret}")
    private String secretKey;

    @Value("${recaptcha.url}")
    private String verifyUrl;

    public boolean verifyRecaptcha(String recaptchaResponse) {
        if (recaptchaResponse == null || recaptchaResponse.isEmpty()) {
            return false;
        }

        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> requestParams = new HashMap<>();
        requestParams.put("secret", secretKey);
        requestParams.put("response", recaptchaResponse);

        Map<String, Object> response = restTemplate.postForObject(
                verifyUrl + "?secret={secret}&response={response}",
                null,
                Map.class,
                requestParams
        );

        return response != null && (Boolean) response.get("success");
    }
}