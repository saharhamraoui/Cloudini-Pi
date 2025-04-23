import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FournisseurListComponent } from './backoffice/components/fournisseur-list/fournisseur-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FournisseurDetailComponent } from './backoffice/components/fournisseur-detail/fournisseur-detail.component';
import { MedicamentListComponent } from './backoffice/components/medicament-list/medicament-list.component';
import { CommandeListComponent } from './backoffice/components/commande-list/commande-list.component';
import { GestionCommandesComponent } from './backoffice/components/gestion-commandes/gestion-commandes.component';
import { StockComponent } from './backoffice/components/stock/stock.component';
import { GestionfournisseurComponent } from './backoffice/components/gestionfournisseur/gestionfournisseur.component';
import { GestionmedsComponent } from './backoffice/components/gestionmeds/gestionmeds.component';
import { StatusFilterPipe } from './pipes/status-filter.pipe';
import { SuivreCommandeComponent } from './backoffice/components/suivre-commande/suivre-commande.component';
import { BackofficeComponent } from './backoffice/backoffice.component';

@NgModule({
  declarations: [
    AppComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
