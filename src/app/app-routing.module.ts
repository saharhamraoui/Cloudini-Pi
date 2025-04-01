import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { FournisseurDetailComponent } from './components/fournisseur-detail/fournisseur-detail.component';
import { MedicamentListComponent } from './components/medicament-list/medicament-list.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';

const routes: Routes = [
  { path: '', component: FournisseurListComponent },  // Default route
  { path: 'fournisseur/:id', component: FournisseurDetailComponent },
  { path: 'medicaments/:id', component: MedicamentListComponent },
  { path: 'commandes', component: CommandeListComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
