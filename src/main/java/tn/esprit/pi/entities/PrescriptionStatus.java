package tn.esprit.pi.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PrescriptionStatus {
    PENDING("PENDING"),
    ACTIVE("ACTIVE"),
    EXPIRED("EXPIRED"),
    COMPLETED("COMPLETED");

    private final String value;

    PrescriptionStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static PrescriptionStatus forValue(String value) {
        for (PrescriptionStatus status : values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}

