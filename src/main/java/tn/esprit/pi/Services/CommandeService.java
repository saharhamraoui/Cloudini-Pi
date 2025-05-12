package tn.esprit.pi.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.DTOS.CommandeRequestDTO;
import tn.esprit.pi.DTOS.CommandeResponseDTO;
import tn.esprit.pi.DTOS.LigneCommandeDTO;
import tn.esprit.pi.Repositories.*;
import tn.esprit.pi.entities.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CommandeService implements ICommandeService{
    @Autowired
    private CommandeRepository commandeRepository;
    @Autowired
    private  MedicamentRepository medicamentRepository;
    @Autowired
    private StockRepository stockRepository;
    @Autowired
    private StockService stockService;
    @Autowired
    private LigneCommandeRepository ligneCommandeRepository;
    @Autowired
    private FournisseurRepository fournisseurRepository;
    @Autowired
    private MailService mailService;


    @Override
    public Commande addCommande(Commande Commande) {
        return commandeRepository.save(Commande);
    }

    @Override
    public Commande updateCommande(Commande Commande) {
        return commandeRepository.save(Commande);
    }

    @Override
    public void deleteCommande(Long idCommande) {
   commandeRepository.deleteById(idCommande);
    }

    @Override
    public List<Commande> getAllCommande() {
        return commandeRepository.findAll();
    }

    @Override
    public Commande getCommande(Long idCommande) {
        return commandeRepository.findById(idCommande).get();
    }

    @Override
    public CommandeResponseDTO createCommande(CommandeRequestDTO request) {
        Fournisseur fournisseur = fournisseurRepository.findById(request.getFournisseurId())
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));

        Commande commande = new Commande();
        commande.setFournisseur(fournisseur);
        commande.setStatus(Status.Encours);
        commande = commandeRepository.save(commande);

        List<LigneCommande> lignes = new ArrayList<>();
        for (LigneCommandeDTO ligneDto : request.getMedicaments()) {
            Medicament medicament = medicamentRepository.findById(ligneDto.getMedicamentId())
                    .orElseThrow(() -> new RuntimeException("Médicament non trouvé"));

            if (ligneDto.getQuantite() > medicament.getQuantite()) {
                throw new RuntimeException("Stock insuffisant pour le médicament : " + medicament.getNom());
            }

            medicament.setQuantite(medicament.getQuantite() - ligneDto.getQuantite());
            medicamentRepository.save(medicament);
            LigneCommande ligneCommande = new LigneCommande();
            ligneCommande.setCommande(commande);
            ligneCommande.setMedicament(medicament);
            ligneCommande.setQuantite(ligneDto.getQuantite());
            lignes.add(ligneCommande);
        }

        ligneCommandeRepository.saveAll(lignes);

        CommandeResponseDTO responseDTO = new CommandeResponseDTO();
        responseDTO.setCommandeId(commande.getIdcommande());
        responseDTO.setFournisseurName(fournisseur.getNom());
        responseDTO.setStatus(String.valueOf(commande.getStatus()));

        List<LigneCommandeDTO> ligneDTOs = new ArrayList<>();
        for (LigneCommande ligne : lignes) {
            LigneCommandeDTO dto = new LigneCommandeDTO();
            dto.setMedicamentId(ligne.getMedicament().getIdmedicament());
            dto.setQuantite(ligne.getQuantite());
            ligneDTOs.add(dto);
        }
        responseDTO.setMedicaments(ligneDTOs);
        String to = fournisseur.getContact();
        String subject = "Nouvelle commande #" + commande.getIdcommande();
        String urlValidation = "http://localhost:4200/back/commande/valider/" + commande.getIdcommande();
        String body = "Bonjour " + fournisseur.getNom() + ",\n\n" +
                "Vous avez reçu une nouvelle commande de médicaments. Voici les détails :\n" +
                "- ID Commande : " + commande.getIdcommande() + "\n" +
                "- Nombre d'articles : " + lignes.size() + "\n\n" +
                "Veuillez cliquer sur le lien suivant pour consulter et valider la commande :\n" +
                urlValidation + "\n\n" +
                "Merci,\nL'équipe de gestion hospitalière";

        mailService.sendEmail(to, subject, body);

        return responseDTO;
    }


@Override
public Commande updateStatusCommande1(Long id, String nouveauStatus) {
    Commande commande = commandeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

    // cndt si livrée ne change pas status
    if (commande.getStatus() == Status.Livrée && Status.valueOf(nouveauStatus) != Status.Livrée) {
        throw new RuntimeException("Impossible de revenir à un état précédent une fois la commande livrée.");
    }

    commande.setStatus(Status.valueOf(nouveauStatus));
    //met à jour stock
    if ("Livrée".equals(nouveauStatus)) {
        stockService.updateStockAfterDelivery(commande);
    }
    return commandeRepository.save(commande);
}



}

