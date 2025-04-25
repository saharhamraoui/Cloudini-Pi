package tn.esprit.pi.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Max;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String assistantEmail;

    @Max(20)
    private int seuil;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String status; // Valeurs : "PENDING", "APPROVED", "REJECTED"
    private Number jour;
    public LeaveRequest() {
    }

    @Max(20)
    public int getSeuil() {
        return seuil;
    }

    public void setSeuil(@Max(20) int seuil) {
        this.seuil = seuil;
    }
    public Number getJour() {
        return jour;
    }

    public void setJour(Number jour) {
        this.jour = jour;
    }

    public LeaveRequest(Number jour,String assistant, LocalDate startDate, LocalDate endDate, String reason, String status) {
        this.assistantEmail = assistant;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
        this.status = status;
        this.jour = jour;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAssistantEmail() {
        return assistantEmail;
    }

    public void setAssistantEmail(String assistantEmail) {
        this.assistantEmail = assistantEmail;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
