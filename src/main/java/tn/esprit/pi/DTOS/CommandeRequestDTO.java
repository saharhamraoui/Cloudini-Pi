package tn.esprit.pi.DTOS;
import java.util.List;

public class CommandeRequestDTO {
    private Long fournisseurId;
    private List<LigneCommandeDTO> medicaments;

    public Long getFournisseurId() {
        return fournisseurId;
    }

    public void setFournisseurId(Long fournisseurId) {
        this.fournisseurId = fournisseurId;
    }

    public List<LigneCommandeDTO> getMedicaments() {
        return medicaments;
    }

    public void setMedicaments(List<LigneCommandeDTO> medicaments) {
        this.medicaments = medicaments;
    }
}
