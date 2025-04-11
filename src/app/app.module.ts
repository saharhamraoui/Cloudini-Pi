import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FournisseurDetailComponent } from './components/fournisseur-detail/fournisseur-detail.component';
import { MedicamentListComponent } from './components/medicament-list/medicament-list.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
import { GestionCommandesComponent } from './components/gestion-commandes/gestion-commandes.component';
import { StockComponent } from './components/stock/stock.component';
import { HeaderComponent } from './back-office/header/header.component';
import { DashboardComponent } from './back-office/dashboard/dashboard.component';
import { FooterComponent } from './back-office/footer/footer.component';
import { GestionfournisseurComponent } from './back-office/gestionfournisseur/gestionfournisseur.component';

@NgModule({
  declarations: [
    AppComponent,
    FournisseurListComponent,
    FournisseurDetailComponent,
    MedicamentListComponent,
    CommandeListComponent,
    GestionCommandesComponent,
    StockComponent,
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    GestionfournisseurComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
