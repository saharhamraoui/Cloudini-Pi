import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { User } from 'src/app/model/User';
import { LeaveRequestService } from 'src/app/services/LeaveRequest/leave-request.service';

// Define status constants to avoid magic strings
enum LeaveStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  REJECTED = 'Rejected'
}

Chart.register(...registerables);

@Component({
  selector: 'app-list-leave-request',
  templateUrl: './list-leave-request.component.html',
  styleUrls: ['./list-leave-request.component.css']
})
export class ListLeaveRequestComponent implements OnInit {
  // Component properties
  leaveRequests: any[] = [];
  filteredLeaveRequests: any[] = [];
  doctorEmail: string = '';
  curRole!: string;
  searchStatus: string = '';
  currentPage = 1;
  itemsPerPage = 5;
  selectedRequest: any = null;
  Math = Math;
  showOnlyApproved: boolean = true;

  // Stats properties
  leaveStatusData = {
    approved: 0,
    pending: 0,
    rejected: 0
  };
  monthlyLeaveData: { month: string, count: number }[] = [];
  assistantActivityData: { assistant: string, leaves: number }[] = [];

  // User properties
  currentUser: User = {
    idUser: 1,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'saaharhamraoui@gmail.com',
    password: '',
    role: "ADMIN",
    phoneNumber: '1234567890',
    address: '123 Main St',
  };

  // Calendar properties
  currentDate: Date = new Date();
  currentMonth!: number;
  currentYear!: number;
  calendarDays: any[] = [];
  weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  selectedLeaveRequest: any = null;
  popupPosition: any = { top: '0', left: '0' };

  // Smart suggestions
  showSmartSuggestions: boolean = false;
  suggestedApprovals: any[] = [];
  recentlyApprovedIds: number[] = [];

  // Workload properties
  assistantsAvailable: number = 5;
  workloadLevel: string = 'low';





  constructor(
    private leaveService: LeaveRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.doctorEmail = sessionStorage.getItem('loggedUser') || '';
    this.curRole = this.currentUser.role!;
    this.loadLeaveRequests();
    this.initCalendar();
  }

  // ====================
  // Data Loading Methods
  // ====================
  loadLeaveRequests(): void {
    this.leaveService.getAllLeaveRequests().subscribe({
      next: (requests) => {
        // Normalize statuses to English
        this.leaveRequests = requests.map(req => ({
          ...req,
          status: this.normalizeStatus(req.status)
        }));
        
        this.filteredLeaveRequests = [...this.leaveRequests];
        this.calculateChartData();
        this.generateCalendar();
        this.initCharts();
      },
      error: (err) => {
        console.error('Error loading requests:', err);
      }
    });
  }

  refreshData(): void {
    this.loadLeaveRequests();
  }

  private normalizeStatus(status: string): string {
    const statusMap: {[key: string]: string} = {
      'Approved': LeaveStatus.APPROVED,
      'Pending': LeaveStatus.PENDING,
      'Rejected': LeaveStatus.REJECTED
    };
    return statusMap[status] || status;
  }

  // ====================
  // Calendar Methods
  // ====================
  initCalendar(): void {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendar();
  }

  generateCalendar(): void {
    console.log('Generating calendar...');
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startingDay = firstDay.getDay();
    
    // Previous month days
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - i);
      this.addCalendarDay(date, false);
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      this.addCalendarDay(date, true, this.isSameDay(date, today));
    }
    
    // Next month days
    const daysToAdd = 42 - this.calendarDays.length;
    for (let i = 1; i <= daysToAdd; i++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, i);
      this.addCalendarDay(date, false);
    }
  }

  addCalendarDay(date: Date, isCurrentMonth: boolean, isToday: boolean = false): void {
    const leaveRequests = this.getLeaveRequestsForDate(date);
    this.calendarDays.push({
      date,
      isCurrentMonth,
      isToday,
      hasLeave: leaveRequests.length > 0,
      leaveRequests
    });
  }

  getLeaveRequestsForDate(date: Date): any[] {
    return this.filteredLeaveRequests.filter(request => {
      // Filter by approval status if enabled
      if (this.showOnlyApproved && request.status !== LeaveStatus.APPROVED) return false;
      
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      return date >= startDate && date <= endDate;
    });
  }

  changeMonth(offset: number): void {
    this.currentMonth += offset;
    
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    
    this.generateCalendar();
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth, 1).toLocaleString('fr-FR', { month: 'long' });
  }

  toggleApprovedFilter(): void {
    this.showOnlyApproved = !this.showOnlyApproved;
    this.generateCalendar();
  }




  // ====================
  // Leave Request Methods
  // ====================
  updateStatus(requestId: number, newStatus: string): void {
    // Map French status to English if needed
    const englishStatus = this.normalizeStatus(newStatus);
    
    this.leaveService.updateLeaveRequestStatus(requestId, englishStatus).subscribe({
      next: () => {
        const request = this.leaveRequests.find(r => r.id === requestId);
        if (request) {
          request.status = englishStatus;
        }

        if (englishStatus === LeaveStatus.APPROVED) {
          this.suggestedApprovals = this.suggestedApprovals.filter(
            req => req.id !== requestId
          );

          this.recentlyApprovedIds.push(requestId);
          setTimeout(() => {
            this.recentlyApprovedIds = this.recentlyApprovedIds.filter(id => id !== requestId);
          }, 3000);
        }

        this.onSearchStatus();
        this.generateCalendar();
      },
      error: (err) => console.error('Error updating status:', err)
    });
  }

  viewDetails(request: any): void {
    this.selectedRequest = { ...request };
  }

  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  // ====================
  // Filtering Methods
  // ====================
  onSearchStatus(): void {
    const searchTerm = this.searchStatus.toLowerCase();
    this.filteredLeaveRequests = this.leaveRequests.filter(request =>
      request.status.toLowerCase().includes(searchTerm)
    );
    this.currentPage = 1;
    this.generateCalendar();
  }

  resetFilters(): void {
    this.searchStatus = '';
    this.filteredLeaveRequests = [...this.leaveRequests];
    this.currentPage = 1;
    this.generateCalendar();
  }

  // ====================
  // Smart Suggestions
  // ====================
  toggleSmartSuggestions(): void {
    this.showSmartSuggestions = !this.showSmartSuggestions;
    if (this.showSmartSuggestions) {
      this.calculateSuggestedApprovals();
    }
  }

  calculateSuggestedApprovals(): void {
    this.suggestedApprovals = this.leaveRequests.filter(request => 
      request.status === LeaveStatus.PENDING && this.shouldSuggestApproval(request)
    );
  }

  shouldSuggestApproval(request: any): boolean {
    const requestStart = new Date(request.startDate);
    const requestEnd = new Date(request.endDate);
    
    const hasOverlap = this.leaveRequests.some(lr => 
      lr.status === LeaveStatus.APPROVED &&
      lr.id !== request.id &&
      this.datesOverlap(requestStart, requestEnd, new Date(lr.startDate), new Date(lr.endDate))
    );
    
    const assistantLeaves = this.leaveRequests.filter(lr => 
      lr.assistantEmail === request.assistantEmail && 
      lr.status === LeaveStatus.APPROVED &&
      this.isRecentLeave(lr.endDate)
    ).length;
    
    
    return !hasOverlap && assistantLeaves < 3 ;
  }

  isSuggestedForApproval(request: any): boolean {
    return this.suggestedApprovals.some(suggested => suggested.id === request.id);
  }

  // ====================
  // Workload Methods
  // ====================
  calculateWorkload(request: any): void {
    const totalAssistants = 10;
    const overlappingRequests = this.leaveRequests.filter(lr => 
      lr.status === LeaveStatus.APPROVED &&
      lr.id !== request.id &&
      this.datesOverlap(request.startDate, request.endDate, lr.startDate, lr.endDate)
    );
    
    const uniqueAssistantsOnLeave = new Set(
      overlappingRequests.map(req => req.assistantEmail)
    ).size;
    
    this.assistantsAvailable = totalAssistants - uniqueAssistantsOnLeave;
    
    const availabilityRatio = this.assistantsAvailable / totalAssistants;
    if (availabilityRatio > 0.7) this.workloadLevel = 'low';
    else if (availabilityRatio > 0.4) this.workloadLevel = 'medium';
    else this.workloadLevel = 'high';
  }

  calculateWorkloadImpact(request: any): { level: string, available: number } {
    const totalAssistants = 10;
    const overlappingRequests = this.leaveRequests.filter(lr => 
      lr.status === LeaveStatus.APPROVED &&
      lr.id !== request.id &&
      this.datesOverlap(
        new Date(request.startDate), 
        new Date(request.endDate),
        new Date(lr.startDate), 
        new Date(lr.endDate)
      )
    );
    
    const uniqueAssistantsOnLeave = new Set(
      overlappingRequests.map(req => req.assistantEmail)
    ).size;
    
    const assistantsAvailable = totalAssistants - uniqueAssistantsOnLeave;
    
    const availabilityRatio = assistantsAvailable / totalAssistants;
    let level = 'high';
    if (availabilityRatio > 0.7) level = 'low';
    else if (availabilityRatio > 0.4) level = 'medium';
    
    return { level, available: assistantsAvailable };
  }

  getWorkloadPercentage(request: any): number {
    const impact = this.calculateWorkloadImpact(request);
    return (this.assistantsAvailable / 10) * 100;
  }

  getWorkloadLevel(request: any): string {
    return this.calculateWorkloadImpact(request).level;
  }

  getAvailableAssistants(request: any): number {
    return this.calculateWorkloadImpact(request).available;
  }


  // ====================
  // Utility Methods
  // ====================
  datesOverlap(start1: string | Date, end1: string | Date, start2: string | Date, end2: string | Date): boolean {
    const s1 = new Date(start1);
    const e1 = new Date(end1);
    const s2 = new Date(start2);
    const e2 = new Date(end2);
    return s1 <= e2 && e1 >= s2;
  }

  isRecentLeave(endDate: string): boolean {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return new Date(endDate) > threeMonthsAgo;
  }

 

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  getInitials(email: string): string {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  }

  getStatusColor(status: string): string {
    switch(status) {
      case LeaveStatus.APPROVED: return '#4CAF50';
      case LeaveStatus.REJECTED: return '#F44336';
      case LeaveStatus.PENDING: return '#FFC107';
      default: return '#9E9E9E';
    }
  }

  get pendingRequestsCount(): number {
    return this.leaveRequests.filter(request => request.status === LeaveStatus.PENDING).length;
  }

  // ====================
  // Pagination Methods
  // ====================
  get paginatedRequests(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLeaveRequests.slice(start, start + this.itemsPerPage);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredLeaveRequests.length / this.itemsPerPage);
  }

  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    return Array.from({length: end - start + 1}, (_, i) => start + i);
  }

  // ====================
  // Chart Methods
  // ====================
  calculateChartData(): void {
    // 1. Calculate leave status distribution
    this.leaveStatusData = {
      approved: this.leaveRequests.filter(l => l.status === LeaveStatus.APPROVED).length,
      pending: this.leaveRequests.filter(l => l.status === LeaveStatus.PENDING).length,
      rejected: this.leaveRequests.filter(l => l.status === LeaveStatus.REJECTED).length
    };

    // 2. Calculate monthly leave trends
    const monthlyLeaves = new Map<string, number>();
    this.leaveRequests.forEach(leave => {
      const date = new Date(leave.startDate);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      const current = monthlyLeaves.get(monthYear) || 0;
      monthlyLeaves.set(monthYear, current + 1);
    });
    
    this.monthlyLeaveData = Array.from(monthlyLeaves.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // 3. Calculate assistant activity
    const assistantCounts = new Map<string, number>();
    this.leaveRequests.forEach(leave => {
      const current = assistantCounts.get(leave.assistantEmail) || 0;
      assistantCounts.set(leave.assistantEmail, current + 1);
    });

    this.assistantActivityData = Array.from(assistantCounts.entries())
      .map(([assistant, leaves]) => ({ assistant, leaves }))
      .sort((a, b) => b.leaves - a.leaves)
      .slice(0, 5);
  }

  private initCharts(): void {
    this.createLeaveStatusChart();
    this.createLeaveTrendChart();
    this.createAssistantActivityChart();
  }

  private createLeaveStatusChart(): void {
    const ctx = document.getElementById('leaveStatusChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [LeaveStatus.APPROVED, LeaveStatus.PENDING, LeaveStatus.REJECTED],
        datasets: [{
          data: [this.leaveStatusData.approved, this.leaveStatusData.pending, this.leaveStatusData.rejected],
          backgroundColor: [
            'rgba(39, 174, 96, 0.8)',
            'rgba(241, 196, 15, 0.8)',
            'rgba(231, 76, 60, 0.8)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  private createLeaveTrendChart(): void {
    const ctx = document.getElementById('leaveTrendChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.monthlyLeaveData.map(d => d.month),
        datasets: [{
          label: 'Leaves per Month',
          data: this.monthlyLeaveData.map(d => d.count),
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgba(52, 152, 219, 1)',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true
            },
            ticks: {
              precision: 0
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  private createAssistantActivityChart(): void {
    const ctx = document.getElementById('assistantActivityChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.assistantActivityData.map(d => d.assistant.split('@')[0]),
        datasets: [{
          label: 'Leave Requests',
          data: this.assistantActivityData.map(d => d.leaves),
          backgroundColor: 'rgba(155, 89, 182, 0.7)',
          borderColor: 'rgba(155, 89, 182, 1)',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true
            },
            ticks: {
              precision: 0
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Add these methods to your component class

// Open modal with leave request details
openDetailsModal(request: any): void {
  this.selectedRequest = { ...request };
}

// Close modal
closeModal(): void {
  this.selectedRequest = null;
}

// Update status from modal
updateStatusFromModal(requestId: number, newStatus: string): void {
  this.updateStatus(requestId, newStatus);
  this.closeModal();
}

  // Add these methods to your component class if they don't exist

// Check if the request overlaps with any approved leaves
hasOverlap(request: any): boolean {
  const requestStart = new Date(request.startDate);
  const requestEnd = new Date(request.endDate);
  
  return this.leaveRequests.some(lr => 
    lr.status === 'Approved' &&
    lr.id !== request.id &&
    this.datesOverlap(
      requestStart, 
      requestEnd,
      new Date(lr.startDate), 
      new Date(lr.endDate)
    )
  );
}

// Check if the assistant has taken few leaves recently
hasLowLeaveCount(request: any): boolean {
  const recentLeaves = this.leaveRequests.filter(lr => 
    lr.assistantEmail === request.assistantEmail && 
    lr.status === 'Approved' &&
    this.isRecentLeave(lr.endDate)
  ).length;
  
  return recentLeaves < 3; // Consider less than 3 leaves as "low"
}



  // ====================
  // Navigation Methods
  // ====================
  navigateHome(): void {
    if (this.curRole === 'Medecin') {
      this.router.navigate(['/doctordashboard']);
    }
  }

  showLeaveDetails(request: any, event: MouseEvent): void {
    this.selectedLeaveRequest = request;
    this.popupPosition = {
      top: (event.clientY - 50) + 'px',
      left: (event.clientX + 20) + 'px'
    };
    event.stopPropagation();
  }
  
}