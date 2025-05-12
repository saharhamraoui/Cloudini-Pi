package tn.esprit.pi.entities;

import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
public class Paiement {

  public enum DiscountStatus {
    PENDING,
    APPROVED,
    REJECTED
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String nomPatient;
  private Integer montant;
  private String modeDePaiement; // "Espèces", "Carte Bancaire", "Virement"
  private LocalDate datePaiement;
  private String statut; // "Payé", "Partiellement Payé", "Non Payé"
  private String emailMedecin;
  private Integer montantPaye;
  private String typeCarte;
  private String disabilityCardId; // New: Card ID for disability discount
  private Double discountApplied;
  private String emailPatient;
  // Add these 4 new fields
  private boolean discountRequested = false;  // Default false
  private boolean discountApproved = false;  // Default false
  private final Double discountPercentage = 0.20; // Fixed 20% discount
  @Lob
  private byte[] disabilityCardImage;
  private String rejectionReason;
  private String requestMessage; // Patient's optional message

  public String getRejectionReason() {
    return rejectionReason;
  }

  public void setRejectionReason(String rejectionReason) {
    this.rejectionReason = rejectionReason;
  }

  public String getRequestMessage() {
    return requestMessage;
  }

  public void setRequestMessage(String requestMessage) {
    this.requestMessage = requestMessage;
  }

  @Enumerated(EnumType.STRING)
  private DiscountStatus discountStatus = DiscountStatus.PENDING;

  // Add getters and setters
  public DiscountStatus getDiscountStatus() {
    return discountStatus;
  }

  public void setDiscountStatus(DiscountStatus discountStatus) {
    this.discountStatus = discountStatus;
  }
  public byte[] getDisabilityCardImage() {
    return disabilityCardImage;
  }

  public void setDisabilityCardImage(byte[] disabilityCardImage) {
    this.disabilityCardImage = disabilityCardImage;
  }


  // ---- Discount Management Methods ----
  public boolean isDiscountRequested() {
    return discountRequested;
  }

  public void setDiscountRequested(boolean discountRequested) {
    this.discountRequested = discountRequested;
  }

  public boolean isDiscountApproved() {
    return discountApproved;
  }

  public void setDiscountApproved(boolean discountApproved) {
    this.discountApproved = discountApproved;
    if (discountApproved) {
      this.discountApplied = montant * discountPercentage;
      this.montant = (int) (montant - discountApplied);
    }
  }



  public Double getDiscountPercentage() {
    return discountPercentage;
  }


  public String getEmailPatient() {
    return emailPatient;
  }

  public void setEmailPatient(String emailPatient) {
    this.emailPatient = emailPatient;
  }
  public String getDisabilityCardId() {
    return disabilityCardId;
  }

  public void setDisabilityCardId(String disabilityCardId) {
    this.disabilityCardId = disabilityCardId;
  }

  public Double getDiscountApplied() {
    return discountApplied;
  }

  public void setDiscountApplied(Double discountApplied) {
    this.discountApplied = discountApplied;
  }

  public Integer getMontantPaye() {
    return montantPaye;
  }

  public void setMontantPaye(Integer montantPaye) {
    this.montantPaye = montantPaye;
  }

  public String getTypeCarte() {
    return typeCarte;
  }

  public void setTypeCarte(String typeCarte) {
    this.typeCarte = typeCarte;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getNomPatient() {
    return nomPatient;
  }

  public void setNomPatient(String nomPatient) {
    this.nomPatient = nomPatient;
  }

  public Integer getMontant() {
    return montant;
  }

  public void setMontant(Integer montant) {
    this.montant = montant;
  }

  public String getModeDePaiement() {
    return modeDePaiement;
  }

  public void setModeDePaiement(String modeDePaiement) {
    this.modeDePaiement = modeDePaiement;
  }

  public LocalDate getDatePaiement() {
    return datePaiement;
  }

  public void setDatePaiement(LocalDate datePaiement) {
    this.datePaiement = datePaiement;
  }

  public String getStatut() {
    return statut;
  }

  public void setStatut(String statut) {
    this.statut = statut;
  }

  public String getEmailMedecin() {
    return emailMedecin;
  }

  public void setEmailMedecin(String emailMedecin) {
    this.emailMedecin = emailMedecin;
  }
}

