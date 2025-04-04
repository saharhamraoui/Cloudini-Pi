package tn.esprit.pi.DTOS;

public class StockVerificationDTO {
    private Long medicamentId;
    private String nom;
    private int quantiteDemande;
    private int stock;
    private boolean enStock;  // true if the stock is sufficient

    // Getters and setters

    public Long getMedicamentId() {
        return medicamentId;
    }

    public void setMedicamentId(Long medicamentId) {
        this.medicamentId = medicamentId;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public int getQuantiteDemande() {
        return quantiteDemande;
    }

    public void setQuantiteDemande(int quantiteDemande) {
        this.quantiteDemande = quantiteDemande;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public boolean isEnStock() {
        return enStock;
    }

    public void setEnStock(boolean enStock) {
        this.enStock = enStock;
    }
}
