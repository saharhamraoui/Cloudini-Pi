package tn.esprit.pi.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.pi.entities.User;

import java.util.ArrayList;
import java.util.List;


@Entity
@DiscriminatorValue("DOCTEUR")
@Getter
@Setter
@NoArgsConstructor
public class Medecin extends User {



    private String speciality;
    private String licenseNumber;
    private String availability;

    @OneToMany(mappedBy = "medecin", cascade = CascadeType.ALL)
    @JsonIgnore
    List<RendezVous> rendezVous  = new ArrayList<>();

    public List<RendezVous> getRendezVous() {
        return rendezVous;
    }

    public void setRendezVous(List<RendezVous> rendezVous) {
        this.rendezVous = rendezVous;
    }


    public String getSpeciality() {
        return speciality;
    }

    public void setSpeciality(String speciality) {
        this.speciality = speciality;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

}

