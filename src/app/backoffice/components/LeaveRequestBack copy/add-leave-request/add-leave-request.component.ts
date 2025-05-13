import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { LeaveRequestService } from 'src/app/services/LeaveRequest/leave-request.service';

@Component({
  selector: 'app-add-leave-request',
  templateUrl: './add-leave-request.component.html',
  styleUrls: ['./add-leave-request.component.css']
})
export class AddLeaveRequestComponent implements OnInit {
  leaveRequests: any[] = [];
  newRequest = { startDate: '', endDate: '', reason: '' };
  loggedUser!: string;
  currRole!: string;
  durationDays = 0;
  isSubmitting = false;
  currentUser: User = {
    idUser: 1,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'saaharhamraoui2@gmail.com',
    password: '',
    role:'ASSISTANT',
    phoneNumber: '1234567890',
    address: '123 Main St',
  };



  getTotalLeaveDays(): number {
    let total = 0;
    this.leaveRequests.forEach(req => {
      if (req.status === 'Approved' || req.status === 'Pending') { // Changed from 'Approuvé'
        const start = new Date(req.startDate);
        const end = new Date(req.endDate);
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        total += diff;
      }
    });
    return total;
  }

  

  constructor(
    private leaveService: LeaveRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
     this.loadLeaveRequests();
  }

   
  
  loadLeaveRequests(): void {
    const assistantEmail = this.currentUser.email;
    this.leaveService
      .getLeaveRequestsByAssistant(assistantEmail)
      .subscribe((data) => {
        this.leaveRequests = data;
      });
  }

  createLeaveRequest(): void {
    this.isSubmitting = true;
    
    const assistantEmail = this.currentUser.email;
  
    this.leaveService.getLeaveRequestsByAssistant(assistantEmail).subscribe((requests) => {
      const approvedRequests = requests.filter(req => req.status === 'Approuvé');
  
      // Sum duration of approved leave requests
      let totalApprovedDays = 0;
      approvedRequests.forEach(req => {
        const start = new Date(req.startDate);
        const end = new Date(req.endDate);
        const days = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        totalApprovedDays += days;
      });
  
      // Add new request duration
      const newRequestDays = this.durationDays;
      const totalAfterAddition = totalApprovedDays + newRequestDays;
  
      if (totalAfterAddition > 20) {
        alert(`La demande dépasse le seuil autorisé de 20 jours. Actuellement: ${totalApprovedDays} jours déjà approuvés, ${newRequestDays} demandés.`);
        this.isSubmitting = false;
        return;
      }
  
      const request = {
        ...this.newRequest,
        assistantEmail: assistantEmail,
        status: 'Pending', // Changed from 'En attente'
      };

      this.leaveService.createLeaveRequest(request).subscribe(() => {
        this.loadLeaveRequests();
        this.newRequest = { startDate: '', endDate: '', reason: '' };
        this.durationDays = 0;
        this.isSubmitting = false;
      });
    });
  }
  

  calculateDuration(): void {
    if (this.newRequest.startDate && this.newRequest.endDate) {
      const start = new Date(this.newRequest.startDate);
      const end = new Date(this.newRequest.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      this.durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else {
      this.durationDays = 0;
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'Approved': return 'fas fa-check-circle'; // Changed from 'Approuvé'
      case 'Rejected': return 'fas fa-times-circle'; // Changed from 'Rejeté'
      default: return 'fas fa-clock'; // 'Pending' remains the same
    }
  }

}