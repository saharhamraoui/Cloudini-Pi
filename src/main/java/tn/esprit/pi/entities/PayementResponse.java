package esprit.tn.pidev.entities;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PayementResponse {


    @JsonProperty("payUrl")
    private String payUrl;

    @JsonProperty("paymentRef")
    private String paymentRef;

    // Add other fields that might be part of the response, like status, etc.

    public String getPayUrl() {
        return payUrl;
    }

    public void setPayUrl(String payUrl) {
        this.payUrl = payUrl;
    }

    public String getPaymentRef() {
        return paymentRef;
    }

    public void setPaymentRef(String paymentRef) {
        this.paymentRef = paymentRef;
    }
}
