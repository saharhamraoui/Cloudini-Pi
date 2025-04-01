export interface Medicament {
  idmedicament?: number; // Optional because new medicaments don’t have an ID yet
    nom: string;
    description: string;
    quantite: number;
    dateExpiration: string; // Will be sent as "yyyy-MM-dd"
    prix: number;
    fournisseurId?: number; // Reference to Fournisseur (optional for now)
  }
