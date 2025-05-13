export interface Reclamation {
    id?: number;
    feedback: string;
    description: string;
    category?: string;
    aiConfidence?: number;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    responses?: any[];
    emotion?: string;
  }