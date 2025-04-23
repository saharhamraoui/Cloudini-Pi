export interface Stock {
    id: number;
    quantiteEnStock: number;
    seuilAlerte: number;
    medicament: {
      nom: string;
      description: string;
      prix: number;
      dateExpiration: string;
      fournisseur: { idfournisseur: number; nom: string;}

    };
  }
  