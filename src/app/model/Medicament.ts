export interface Medicament {
  idmedicament: number;
  nom: string;
  description: string;
  quantite: number;
  dateExpiration: string;
  prix: number;
  idfournisseur: number;  // Keep this for form binding
}