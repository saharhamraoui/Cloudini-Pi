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

        // Construction de la réponse
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

        // ✅ Envoyer le mail au fournisseur
        String to = fournisseur.getContact(); // Contact = email du fournisseur
        String subject = "Nouvelle commande #" + commande.getIdcommande();
        String urlValidation = "http://localhost:4200/back/commande/valider/" + commande.getIdcommande(); // 🔗 lien vers page Angular pour valider
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

    /*public CommandeResponseDTO createCommande(CommandeRequestDTO request) {
        // 1️⃣ Trouver le fournisseur
        Fournisseur fournisseur = fournisseurRepository.findById(request.getFournisseurId())
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));

        // 2️⃣ Créer une nouvelle Commande
        Commande commande = new Commande();
        commande.setFournisseur(fournisseur);
        commande.setStatus(Status.Encours);

        // Sauvegarder la commande pour obtenir un ID
        commande = commandeRepository.save(commande);

        // 3️⃣ Vérifier les quantités des médicaments avant d'ajouter les lignes de commande
        List<LigneCommande> lignes = new ArrayList<>();
        for (LigneCommandeDTO ligneDto : request.getMedicaments()) {
            Medicament medicament = medicamentRepository.findById(ligneDto.getMedicamentId())
                    .orElseThrow(() -> new RuntimeException("Médicament non trouvé"));

            // Vérifier la disponibilité du stock
            if (ligneDto.getQuantite() > medicament.getQuantite()) {
                // Vous pouvez aussi ajouter une exception personnalisée pour un meilleur contrôle
                throw new RuntimeException("Stock insuffisant pour le médicament : " + medicament.getNom() +
                        ". Quantité disponible : " + medicament.getQuantite() +
                        ", Quantité demandée : " + ligneDto.getQuantite());
            }

            // Mettre à jour le stock après commande
            medicament.setQuantite(medicament.getQuantite() - ligneDto.getQuantite());
            medicamentRepository.save(medicament); // Sauvegarder la nouvelle quantité en stock

            // Créer la ligne de commande
            LigneCommande ligneCommande = new LigneCommande();
            ligneCommande.setCommande(commande);
            ligneCommande.setMedicament(medicament);
            ligneCommande.setQuantite(ligneDto.getQuantite());

            lignes.add(ligneCommande);
        }

        // Sauvegarder les lignes de commande
        ligneCommandeRepository.saveAll(lignes);

        // 4️⃣ Construire la réponse DTO
        CommandeResponseDTO responseDTO = new CommandeResponseDTO();
        responseDTO.setCommandeId(commande.getIdcommande());
        responseDTO.setFournisseurName(fournisseur.getNom());
        responseDTO.setStatus(String.valueOf(commande.getStatus()));

        // Convertir les lignes en DTO
        List<LigneCommandeDTO> ligneDTOs = new ArrayList<>();
        for (LigneCommande ligne : lignes) {
            LigneCommandeDTO dto = new LigneCommandeDTO();
            dto.setMedicamentId(ligne.getMedicament().getIdmedicament());
            dto.setQuantite(ligne.getQuantite());
            ligneDTOs.add(dto);
        }
        responseDTO.setMedicaments(ligneDTOs);

        return responseDTO;
    }
/*
    @Override
    // Méthode pour mettre à jour le statut de la commande
    public Commande updateStatusCommande(Long commandeId, Status newStatus) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

        // Vérifiez si l'état actuel est valide pour la modification (par exemple, on ne peut pas revenir en arrière)
        if (commande.getStatus() == Status.Livrée && newStatus != Status.Livrée) {
            throw new RuntimeException("Impossible de revenir à un état précédent une fois la commande livrée.");
        }

        // Mettre à jour le statut de la commande
        commande.setStatus(newStatus);

        // Sauvegarder la commande avec le nouveau statut
        return commandeRepository.save(commande);
    }*/

@Override
public Commande updateStatusCommande1(Long id, String nouveauStatus) {
    Commande commande = commandeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

    // Vérifie si l'état actuel est valide pour la modification (par exemple, on ne peut pas revenir en arrière)
    if (commande.getStatus() == Status.Livrée && Status.valueOf(nouveauStatus) != Status.Livrée) {
        throw new RuntimeException("Impossible de revenir à un état précédent une fois la commande livrée.");
    }

    // Met à jour le statut de la commande
    commande.setStatus(Status.valueOf(nouveauStatus));

    // Si la commande est marquée comme "Livrée", on met à jour le stock
    if ("Livrée".equals(nouveauStatus)) {
        stockService.updateStockAfterDelivery(commande);
    }

    // Sauvegarder la commande avec le nouveau statut
    return commandeRepository.save(commande);
}



}

