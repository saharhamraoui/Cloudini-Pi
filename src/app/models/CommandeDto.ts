export interface CommandeDto {
    fournisseurId: number;
    status: string; // e.g., "Encours"
    medicaments: { medicamentId: number; quantite: number }[];
  }
  