export interface Stock {
    id: number;
    quantiteEnStock: number;
    medicament: {
      idmedicament: number;
      nom: string;
      description: string;
      prix: number;
      dateExpiration: string;
    };
  }
  