export interface LeaveRequest {
    id: number;
    assistantEmail: string;
    startDate: string;  // or Date
    endDate: string;    // or Date
    reason: string;
    status: string;
    jour: number;      
    seuil: number;     

}
