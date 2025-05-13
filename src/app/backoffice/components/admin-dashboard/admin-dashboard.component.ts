import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { UserService } from 'src/app/services/userService/user.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  public dataMap: { [key: string]: { original: any[], current: any[], displayed: any[] } } = {
    users: { original: [], current: [], displayed: [] },
    patients: { original: [], current: [], displayed: [] },
    medecins: { original: [], current: [], displayed: [] },
    chauffeurs: { original: [], current: [], displayed: [] }
  };
  
  currentTab: string = 'users';
  isLoading: boolean = true;
  searchTerm: string = '';
  sortField: string = 'idUser';
  sortDirection: 'asc' | 'desc' = 'asc';

  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];
  sentimentData: any = null;
  isAnalyzing = false;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  private loadAllData(): void {
    this.isLoading = true;
    Promise.all([
      this.loadData('users', () => this.userService.getBanned()),
      this.loadData('patients', () => this.userService.getAllPatients()),
      this.loadData('medecins', () => this.userService.getAllMedecins()),
      this.loadData('chauffeurs', () => this.userService.getAllChauffeurs())
    ]).finally(() => {
      this.isLoading = false;
      this.updateDisplayedData();
    });
  }

  private loadData(tab: string, serviceCall: () => any): Promise<void> {
    return new Promise((resolve, reject) => {
      serviceCall().subscribe({
        next: (data: any[]) => {
          this.dataMap[tab].current = data;
          this.dataMap[tab].original = [...data];
          resolve();
        },
        error: (err: any) => {
          console.error(`Error loading ${tab}:`, err);
          reject(err);
        }
      });
    });
  }
  
  changeTab(tab: string): void {
    this.currentTab = tab;
    this.resetSearch();
    this.pageIndex = 0;
    this.updateDisplayedData();
  }
  
  trackById(index: number, item: any): number {
    return item.idUser;
  }
  
  search(): void {
    const term = this.searchTerm.toLowerCase();
    const filters: { [key: string]: (item: any) => boolean } = {
      users: (u) => 
        u.lastName?.toLowerCase().includes(term) ||
        u.firstName?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term),
      patients: (p) =>
        p.lastName?.toLowerCase().includes(term) ||
        p.firstName?.toLowerCase().includes(term) ||
        p.email?.toLowerCase().includes(term) ||
        p.medicalRecordNumber?.toLowerCase().includes(term) ||
        p.healthInsuranceNumber?.toLowerCase().includes(term),
      medecins: (m) =>
        m.lastName?.toLowerCase().includes(term) ||
        m.firstName?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term) ||
        m.speciality?.toLowerCase().includes(term) ||
        m.licenseNumber?.toLowerCase().includes(term),
      chauffeurs: (c) =>
        c.lastName?.toLowerCase().includes(term) ||
        c.firstName?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.driverLicenseNumber?.toLowerCase().includes(term) ||
        c.vehicleType?.toLowerCase().includes(term)
    };

    this.dataMap[this.currentTab].current = this.dataMap[this.currentTab].original.filter(filters[this.currentTab]);
    this.pageIndex = 0;
    this.updateDisplayedData();
  }

  sort(field: string): void {
    this.sortField = this.sortField === field ? this.sortField : field;
    this.sortDirection = this.sortField === field && this.sortDirection === 'asc' ? 'desc' : 'asc';

    const direction = this.sortDirection === 'asc' ? 1 : -1;
    this.dataMap[this.currentTab].current.sort((a, b) => {
      const valA = a[field]?.toString().toLowerCase() || '';
      const valB = b[field]?.toString().toLowerCase() || '';
      return valA.localeCompare(valB) * direction;
    });
    this.updateDisplayedData();
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.dataMap[this.currentTab].current = [...this.dataMap[this.currentTab].original];
    this.pageIndex = 0;
    this.updateDisplayedData();
  }

  editUser(user: any): void {
    localStorage.setItem('userToEdit', JSON.stringify(user));
    this.router.navigate(['/back/admin/user-form']);
  }

  toggleBan(userId: number, isBanned: boolean): void {
    const user = this.findUserById(userId);
    if (!user) return;

    const action = isBanned ? 'Débannir' : 'Bannir';
    if (confirm(`${action} ${user.firstName} ${user.lastName} ?`)) {
      this.userService.toggleBan(userId, !isBanned).subscribe({
        next: () => this.refreshCurrentTab(),
        error: (err) => console.error('Error:', err)
      });
    }
  }

  deleteUser(userId: number): void {
    const user = this.findUserById(userId);
    if (!user) return;

    if (confirm(`Supprimer définitivement ${user.firstName} ${user.lastName} ?`)) {
      this.userService.deleteUser(userId).subscribe({
        next: () => this.refreshCurrentTab(),
        error: (err) => console.error('Error deleting:', err)
      });
    }
  }

  private findUserById(id: number): any {
    return Object.values(this.dataMap)
      .flatMap(data => data.original)
      .find(u => u.idUser === id);
  }

  private refreshCurrentTab(): void {
    const loadFn = {
      users: () => this.loadData('users', () => this.userService.getAllUsers()),
      patients: () => this.loadData('patients', () => this.userService.getAllPatients()),
      medecins: () => this.loadData('medecins', () => this.userService.getAllMedecins()),
      chauffeurs: () => this.loadData('chauffeurs', () => this.userService.getAllChauffeurs())
    }[this.currentTab];
  
    if (loadFn) {
      this.isLoading = true;
      loadFn().finally(() => {
        this.isLoading = false;
        this.updateDisplayedData();
      });
    }
  }

  runSentimentAnalysis(): void {
    this.isAnalyzing = true;
    this.userService.analyzeSentiments().subscribe({
      next: (data) => {
        this.sentimentData = data;
        this.isAnalyzing = false;
      },
      error: (err) => {
        console.error('Error analyzing sentiments:', err);
        this.isAnalyzing = false;
      }
    });
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'fa-sort';
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  updateDisplayedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataMap[this.currentTab].displayed = this.dataMap[this.currentTab].current.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    if (!this.paginator) return;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedData();
  }

  exportToPDF(): void {
    const element = document.querySelector('.table-responsive') as HTMLElement;
    if (!element) return;

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF.default('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${this.currentTab}-data.pdf`);
    });
  }

  exportToExcel(): void {
    const config: { [key: string]: { headers: string[], map: (item: any) => any[] } } = {
      users: {
        headers: ['Nom', 'Prénom', 'Email', 'Rôle', 'Statut'],
        map: u => [u.lastName, u.firstName, u.email, u.role, u.banned ? 'Banni' : 'Actif']
      },
      patients: {
        headers: ['Nom', 'Prénom', 'Email', 'N° Assurance', 'Dossier Médical', 'Groupe Sanguin', 'Genre', 'Date Naissance', 'Statut'],
        map: p => [
          p.lastName, p.firstName, p.email, p.healthInsuranceNumber || '-', p.medicalRecordNumber || '-',
          p.bloodGroup || '-', p.gender === 'M' ? 'M' : p.gender === 'F' ? 'F' : 'Autre',
          new Date(p.dateOfBirth).toLocaleDateString('fr-FR'), p.banned ? 'Banni' : 'Actif'
        ]
      },
      medecins: {
        headers: ['Nom', 'Prénom', 'Email', 'Spécialité', 'N° Licence', 'Disponibilité', 'Statut'],
        map: m => [
          m.lastName, m.firstName, m.email, m.speciality || '-', m.licenseNumber || '-',
          m.availability === 'AVAILABLE' ? 'Disponible' : m.availability === 'ON_VACATION' ? 'En vacances' : 'Indisponible',
          m.banned ? 'Banni' : 'Actif'
        ]
      },
      chauffeurs: {
        headers: ['Nom', 'Prénom', 'Email', 'N° Permis', 'Disponibilité', 'Statut'],
        map: c => [
          c.lastName, c.firstName, c.email, c.driverLicenseNumber || '-',
          c.driverAvailability === 'AVAILABLE' ? 'Disponible' : c.driverAvailability === 'ON_MISSION' ? 'En mission' : 'Indisponible',
          c.banned ? 'Banni' : 'Actif'
        ]
      }
    };

    const { headers, map } = config[this.currentTab];
    const data = this.dataMap[this.currentTab].current.map(map);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `${this.currentTab}-data.xlsx`);
  }
}