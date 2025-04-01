import { Medicament } from "./Medicament";

export interface Fournisseur {
    idfournisseur: number;
    nom: string;
    contact: string;
    adresse: string;
    medicaments: Medicament[];
  }
  