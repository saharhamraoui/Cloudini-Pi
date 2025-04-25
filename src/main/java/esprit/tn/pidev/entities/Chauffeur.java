package esprit.tn.pidev.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("CHAUFFEUR")
@Getter
@Setter
@NoArgsConstructor
public class Chauffeur extends User {
    public String getDriverLicenseNumber() {
        return driverLicenseNumber;
    }

    public void setDriverLicenseNumber(String driverLicenseNumber) {
        this.driverLicenseNumber = driverLicenseNumber;
    }

    public String getDriverAvailability() {
        return driverAvailability;
    }

    public void setDriverAvailability(String driverAvailability) {
        this.driverAvailability = driverAvailability;
    }

    private String driverLicenseNumber;
    private String driverAvailability;

}