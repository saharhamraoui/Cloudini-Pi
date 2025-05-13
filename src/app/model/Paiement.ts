import { CardType } from "./CardType";
import { DiscountStatus } from "./DiscountStatus";
import { PaymentStatus } from "./PaymentStatus";

export interface Paiement {
    id?: number;
    nomPatient: string;
    montant: number;
    modeDePaiement: string; // "Espèces", "Carte Bancaire", "Virement"
    datePaiement: string; // YYYY-MM-DD format
    statut: PaymentStatus; // "Payé", "Partiellement Payé", "Non Payé"
    typeCarte?: CardType;
    montantPaye?: number;
    emailMedecin?: string;
    fraudProbability?: number;
    emailPatient?: string;
    // Discount Fields
    requestMessage?:string
    disabilityCardId?: string;
    discountApplied?: number;
    discountRequested?: boolean;
    discountApproved?: boolean;
    discountPercentage?: number;
    discountStatus?: DiscountStatus;
    rejectionReason?: string;  // Stores why the discount was rejected
    disabilityCardImage?: any | ArrayBuffer | string;

}