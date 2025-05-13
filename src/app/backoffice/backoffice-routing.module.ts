import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackofficeComponent } from './backoffice.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserFormComponent } from './components/admin/user-form/user-form.component';
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
import { StockComponent } from './components/stock/stock.component';
import { SuivreCommandeComponent } from './components/suivre-commande/suivre-commande.component';
import { ValidationCommandeComponent } from './components/validation-commande/validation-commande.component';

const routes: Routes = [
  {
    path: '',
    component: BackofficeComponent,
    children: [
  {path: 'doctordashboard', component: DoctordashboardComponent },
  { path:'list-rendez-vous-back',  component: ListRendezVousBackComponent},
  { path:'addRendezVousBack',  component: AddRendezVousBackComponent},
  {path: 'updaterendezvousBack/:id', component: UpdateRendezVousBackComponent },
  { path:'addConsultation',  component: AddConsultationBackComponent},
  { path:'list-consultation-Back',  component: ListConsultationBackComponent},
  {path: 'updateConsultationBack/:id', component: UpdateConsultationBackComponent },
  { path: 'DashboardStock', component: DashboardStockComponent }, // Default route
  { path: 'fournisseur', component: FournisseurListComponent },  
  { path: 'fournisseur/:id', component: FournisseurDetailComponent },
  { path: 'medicaments/:id', component: MedicamentListComponent },
  { path: 'commandes', component: CommandeListComponent },
  { path: 'verifcommandes', component: GestionCommandesComponent },
  { path: 'stock', component: StockComponent },
  { path: 'fournisseur/:id/medicaments', component: MedicamentListComponent },
  { path: 'crudfournisseur', component: GestionfournisseurComponent },
  { path: 'crudmed', component: GestionmedsComponent},
  { path: 'suivi-etat/:idcommande', component: SuivreCommandeComponent },
  { path: 'commande/valider/:id', component: ValidationCommandeComponent },
  {path: 'listPrescription', component: ListPrescriptionComponent },
  {path: 'listPaiement', component: ListPaiementComponent },
  {path: 'listLeaveRequest', component: ListLeaveRequestComponent },
  {path: 'listMedicalRecord', component: ListMedcicalRecordComponent },
{path: 'addLeaveRequest', component: AddLeaveRequestComponent },
{ path: 'reclamations', component: ReclamationManagementComponent },
{ path: 'metrics', component: MetricsDashboardComponent },
{ path: 'admin/dashboard', component: AdminDashboardComponent },
{ path: 'admin/user-form', component: UserFormComponent },
{ path: 'admin/users', component: MetricsDashboardComponent },


 ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }

