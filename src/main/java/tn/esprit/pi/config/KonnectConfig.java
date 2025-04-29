package esprit.tn.pidev.configurations;


public class KonnectConfig {

    // this is works: 65e324850ed588b9933885f0:e3q1ibb3b4meQAZXwHSPRdn
    private final String API_KEY = "663d2aabd65ce91d9e030dec:eOh212gQ0b94m1P6kcW2hg9FrKkGu7l";

    private final String API_URL = "https://api.preprod.konnect.network/api/v2/";

    private final String PORTFOLIO_ID = "663d2aabd65ce91d9e030df0"; // receiver wallet id


    public String getAPI_KEY() {
        return API_KEY;
    }

    public String getAPI_URL() {
        return API_URL;
    }

    public String getPORTFOLIO_ID() {
        return PORTFOLIO_ID;
    }
}