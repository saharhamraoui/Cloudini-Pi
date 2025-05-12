package tn.esprit.pi.DTOS;

import java.util.List;

public class CommandeResponseDTO {
    private Long commandeId;
    private String fournisseurName;
    private String status;
    private List<LigneCommandeDTO> medicaments;

    public Long getCommandeId() {
        return commandeId;
    }

    public void setCommandeId(Long commandeId) {
        this.commandeId = commandeId;
    }

    public String getFournisseurName() {
        return fournisseurName;
    }

    public void setFournisseurName(String fournisseurName) {
        this.fournisseurName = fournisseurName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<LigneCommandeDTO> getMedicaments() {
        return medicaments;
    }

    public void setMedicaments(List<LigneCommandeDTO> medicaments) {
        this.medicaments = medicaments;
    }
}

