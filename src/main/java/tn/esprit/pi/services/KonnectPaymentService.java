package tn.esprit.pi.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import esprit.tn.pidev.configurations.KonnectConfig;
import esprit.tn.pidev.entities.PayementRequest;
import esprit.tn.pidev.entities.PayementResponse;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.services.EmailSender;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

@Service
public class KonnectPaymentService {

    private static final Logger logger = Logger.getLogger(KonnectPaymentService.class.getName());

    private final String apiKey;
    private final String baseUrl;
    private final String receiverWalletId;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private EmailSender emailService;  // Injected EmailService

    public KonnectPaymentService() {
        KonnectConfig konnectConfig = new KonnectConfig();
        this.apiKey = konnectConfig.getAPI_KEY();
        this.baseUrl = konnectConfig.getAPI_URL();
        this.receiverWalletId = konnectConfig.getPORTFOLIO_ID();
    }

    public PayementResponse initPayment(float amount, String clientEmail) {
        String url = baseUrl + "payments/init-payment";

        PayementRequest paymentRequest = new PayementRequest();
        paymentRequest.setReceiverWalletId(receiverWalletId);
        paymentRequest.setToken("TND"); // Currency is now 'token'
        paymentRequest.setAmount(amount * 1000); // Amount in millimes (important)
        paymentRequest.setType("immediate");
        paymentRequest.setDescription("Payment for services");
        paymentRequest.setAcceptedPaymentMethods(List.of("wallet", "bank_card", "e-DINAR"));
        paymentRequest.setLifespan(10);
        paymentRequest.setCheckoutForm(true);
        paymentRequest.setAddPaymentFeesToAmount(true);
        paymentRequest.setFirstName("Client");
        paymentRequest.setLastName("Name");
        paymentRequest.setPhoneNumber("22777777");
        paymentRequest.setEmail(clientEmail);
        paymentRequest.setOrderId("ORDER_" + System.currentTimeMillis());
        paymentRequest.setWebhook("https://yourbackend.com/api/konnect/webhook"); // mettre un webhook valide
        paymentRequest.setTheme("light");

        String requestBody = toJson(paymentRequest);
        if (requestBody == null) {
            logger.severe("Request body is null, aborting payment init.");
            return null;
        }

        PayementResponse payementResponse = sendPaymentRequest(url, requestBody);

        if (payementResponse != null && clientEmail != null && !clientEmail.isEmpty()) {
            String emailContent = "Please complete your payment using this link: " + payementResponse.getPayUrl();
            emailService.sendEmail(clientEmail, "Complete Your Payment", emailContent);
        }

        return payementResponse;
    }


    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (IOException e) {
            logger.severe("Error serializing payment request: " + e.getMessage());
            return null;
        }
    }

    private PayementResponse sendPaymentRequest(String url, String requestBody) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost(url);
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setHeader("x-api-key", apiKey);

            StringEntity entity = new StringEntity(requestBody, "UTF-8");
            httpPost.setEntity(entity);

            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                HttpEntity responseEntity = response.getEntity();

                int statusCode = response.getStatusLine().getStatusCode();
                String responseString = responseEntity != null ? EntityUtils.toString(responseEntity) : "";

                logger.info("Response Status: " + statusCode);
                logger.info("Response Body: " + responseString);

                if (statusCode == 200) {
                    return objectMapper.readValue(responseString, PayementResponse.class);
                } else {
                    logger.warning("Payment initiation failed: " + responseString);
                    return null;
                }
            }
        } catch (IOException e) {
            logger.severe("Error sending payment request: " + e.getMessage());
            return null;
        }
    }
}
