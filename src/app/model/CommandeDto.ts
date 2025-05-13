export interface CommandeDto {
    fournisseurId: number;
    status: string; 
    medicaments: { medicamentId: number; quantite: number;}[];
  }
  