package esprit.tn.pidev.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class PayementRequest {

    @JsonProperty("receiverWalletId")
    private String receiverWalletId;

    @JsonProperty("token")
    private String token;

    @JsonProperty("amount")
    private float amount;

    @JsonProperty("type")
    private String type;

    @JsonProperty("description")
    private String description;

    @JsonProperty("acceptedPaymentMethods")
    private List<String> acceptedPaymentMethods;

    @JsonProperty("lifespan")
    private int lifespan;

    @JsonProperty("checkoutForm")
    private boolean checkoutForm;

    @JsonProperty("addPaymentFeesToAmount")
    private boolean addPaymentFeesToAmount;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("phoneNumber")
    private String phoneNumber;

    @JsonProperty("email")
    private String email;

    @JsonProperty("orderId")
    private String orderId;

    @JsonProperty("webhook")
    private String webhook;

    @JsonProperty("theme")
    private String theme;


    public String getReceiverWalletId() {
        return receiverWalletId;
    }

    public void setReceiverWalletId(String receiverWalletId) {
        this.receiverWalletId = receiverWalletId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public float getAmount() {
        return amount;
    }

    public void setAmount(float amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getAcceptedPaymentMethods() {
        return acceptedPaymentMethods;
    }

    public void setAcceptedPaymentMethods(List<String> acceptedPaymentMethods) {
        this.acceptedPaymentMethods = acceptedPaymentMethods;
    }

    public int getLifespan() {
        return lifespan;
    }

    public void setLifespan(int lifespan) {
        this.lifespan = lifespan;
    }

    public boolean isCheckoutForm() {
        return checkoutForm;
    }

    public void setCheckoutForm(boolean checkoutForm) {
        this.checkoutForm = checkoutForm;
    }

    public boolean isAddPaymentFeesToAmount() {
        return addPaymentFeesToAmount;
    }

    public void setAddPaymentFeesToAmount(boolean addPaymentFeesToAmount) {
        this.addPaymentFeesToAmount = addPaymentFeesToAmount;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getWebhook() {
        return webhook;
    }

    public void setWebhook(String webhook) {
        this.webhook = webhook;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }
}
