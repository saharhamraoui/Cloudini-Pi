import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { NgChartsModule } from 'ng2-charts';
import { StatusFilterPipe } from '../pipes/status-filter.pipe';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { BackofficeComponent } from './backoffice.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserFormComponent } from './components/admin/user-form/user-form.component';
import { ChatbotComponent } from './components/chatbotStock/chatbot.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
import { AddConsultationBackComponent } from './components/consultationBack/add-consultation-back/add-consultation-back.component';
import { ListConsultationBackComponent } from './components/consultationBack/list-consultation-back/list-consultation-back.component';
import { UpdateConsultationBackComponent } from './components/consultationBack/update-consultation-back/update-consultation-back.component';
import { DashboardStockComponent } from './components/dashboard-stock/dashboard-stock.component';
import { DoctordashboardComponent } from './components/doctordashboard/doctordashboard.component';
import { FournisseurDetailComponent } from './components/fournisseur-detail/fournisseur-detail.component';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { GestionCommandesComponent } from './components/gestion-commandes/gestion-commandes.component';
import { GestionfournisseurComponent } from './components/gestionfournisseur/gestionfournisseur.component';
import { GestionmedsComponent } from './components/gestionmeds/gestionmeds.component';
import { HeaderBackComponent } from './components/header-back/header-back.component';
import { AddLeaveRequestComponent } from './components/LeaveRequestBack/add-leave-request/add-leave-request.component';
import { ListLeaveRequestComponent } from './components/LeaveRequestBack/list-leave-request/list-leave-request.component';
import { ListMedcicalRecordComponent } from './components/MedicalRecord/list-medcical-record/list-medcical-record.component';
import { MedicamentListComponent } from './components/medicament-list/medicament-list.component';
import { MetricsDashboardComponent } from './components/metrics-dashboard/metrics-dashboard.component';
import { ListPaiementComponent } from './components/PaiementBack/list-paiement/list-paiement.component';
import { ListPrescriptionComponent } from './components/PrescriptionBack/list-prescription/list-prescription.component';
import { ReclamationManagementComponent } from './components/reclamation-management/reclamation-management.component';
import { AddRendezVousBackComponent } from './components/rendezVousBack/add-rendez-vous-back/add-rendez-vous-back.component';
import { ListRendezVousBackComponent } from './components/rendezVousBack/list-rendez-vous-back/list-rendez-vous-back.component';
import { UpdateRendezVousBackComponent } from './components/rendezVousBack/update-rendez-vous-back/update-rendez-vous-back.component';
import { ResponseFormComponent } from './components/response-form/response-form.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StockComponent } from './components/stock/stock.component';
import { SuivreCommandeComponent } from './components/suivre-commande/suivre-commande.component';
import { ValidationCommandeComponent } from './components/validation-commande/validation-commande.component';
@NgModule({
  declarations: [
       DoctordashboardComponent,
       AddConsultationBackComponent,
       ListConsultationBackComponent,
       UpdateConsultationBackComponent,
       AddRendezVousBackComponent,
       ListRendezVousBackComponent,
       UpdateRendezVousBackComponent,
       BackofficeComponent,
       HeaderBackComponent,
       SidebarComponent,
         FournisseurListComponent,
           FournisseurDetailComponent,
           MedicamentListComponent,
           CommandeListComponent,
           GestionCommandesComponent,
           StockComponent,
           GestionfournisseurComponent,
           GestionmedsComponent,
           StatusFilterPipe,
           SuivreCommandeComponent,
           ValidationCommandeComponent,
           DashboardStockComponent,
           ChatbotComponent,
           ListPrescriptionComponent,
           ListPaiementComponent,
           AddLeaveRequestComponent,
           ListLeaveRequestComponent,
           ListMedcicalRecordComponent,
           ReclamationManagementComponent,
           ResponseFormComponent,
           MetricsDashboardComponent,
           AdminDashboardComponent,
           UserFormComponent
  ],
  imports: [
    CommonModule,
        QRCodeModule ,
        MatSnackBarModule, 
    BackofficeRoutingModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgChartsModule,
    CommonModule,

 ]
})
export class BackofficeModule { }
