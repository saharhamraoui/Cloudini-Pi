import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { FournisseurDetailComponent } from './components/fournisseur-detail/fournisseur-detail.component';
import { MedicamentListComponent } from './components/medicament-list/medicament-list.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
<<<<<<< Updated upstream
=======
import { GestionCommandesComponent } from './components/gestion-commandes/gestion-commandes.component';
import { StockComponent } from './components/stock/stock.component';
>>>>>>> Stashed changes

const routes: Routes = [
  { path: '', component: FournisseurListComponent },  // Default route
  { path: 'fournisseur/:id', component: FournisseurDetailComponent },
  { path: 'medicaments/:id', component: MedicamentListComponent },
<<<<<<< Updated upstream
  { path: 'commandes', component: CommandeListComponent }

=======
  { path: 'commandes', component: CommandeListComponent },
  { path: 'verifcommandes', component: GestionCommandesComponent },
  { path: 'stock', component: StockComponent }
>>>>>>> Stashed changes

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
