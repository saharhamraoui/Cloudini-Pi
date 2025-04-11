import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { FournisseurDetailComponent } from './components/fournisseur-detail/fournisseur-detail.component';
import { MedicamentListComponent } from './components/medicament-list/medicament-list.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
import { GestionCommandesComponent } from './components/gestion-commandes/gestion-commandes.component';
import { StockComponent } from './components/stock/stock.component';
import { DashboardComponent } from './back-office/dashboard/dashboard.component';
import { GestionfournisseurComponent } from './back-office/gestionfournisseur/gestionfournisseur.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }, // Default route
  { path: 'fournisseur', component: FournisseurListComponent },  
  { path: 'fournisseur/:id', component: FournisseurDetailComponent },
  { path: 'medicaments/:id', component: MedicamentListComponent },
  { path: 'commandes', component: CommandeListComponent },
  { path: 'verifcommandes', component: GestionCommandesComponent },
  { path: 'stock', component: StockComponent },
  { path: 'fournisseur/:id/medicaments', component: MedicamentListComponent },
  { path: 'crudfournisseur', component: GestionfournisseurComponent }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
