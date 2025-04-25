import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackofficeComponent } from './backoffice.component';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { FournisseurDetailComponent } from './components/fournisseur-detail/fournisseur-detail.component';
import { MedicamentListComponent } from './components/medicament-list/medicament-list.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
import { GestionCommandesComponent } from './components/gestion-commandes/gestion-commandes.component';
import { StockComponent } from './components/stock/stock.component';
import { GestionfournisseurComponent } from './components/gestionfournisseur/gestionfournisseur.component';
import { GestionmedsComponent } from './components/gestionmeds/gestionmeds.component';
import { SuivreCommandeComponent } from './components/suivre-commande/suivre-commande.component';
import { ValidationCommandeComponent } from './components/validation-commande/validation-commande.component';
import { DashboardStockComponent } from './components/dashboard-stock/dashboard-stock.component';

const routes: Routes = [
  {
    path: '',
    component: BackofficeComponent,
    children: [
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
  { path: 'commande/valider/:id', component: ValidationCommandeComponent }

 ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
