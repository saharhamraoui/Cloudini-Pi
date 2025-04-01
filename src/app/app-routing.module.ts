import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicamentComponent } from './components/medicament/medicament.component';
import { FournisseursComponent } from './components/fournisseurs/fournisseurs.component';

const routes: Routes = [
  { path: 'medicaments', component: MedicamentComponent },
  { path: 'fournisseurs', component: FournisseursComponent },
  { path: '', redirectTo: '/fournisseurs', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
