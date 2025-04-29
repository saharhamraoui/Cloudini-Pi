import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeComponent } from './backoffice.component';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderBackComponent } from './components/header-back/header-back.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { FournisseurDetailComponent } from './components/fournisseur-detail/fournisseur-detail.component';
import { MedicamentListComponent } from './components/medicament-list/medicament-list.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
import { GestionCommandesComponent } from './components/gestion-commandes/gestion-commandes.component';
import { StockComponent } from './components/stock/stock.component';
import { GestionfournisseurComponent } from './components/gestionfournisseur/gestionfournisseur.component';
import { GestionmedsComponent } from './components/gestionmeds/gestionmeds.component';
import { StatusFilterPipe } from '../pipes/status-filter.pipe';
import { SuivreCommandeComponent } from './components/suivre-commande/suivre-commande.component';
import { ValidationCommandeComponent } from './components/validation-commande/validation-commande.component';
import { NgChartsModule } from 'ng2-charts';
import { DashboardStockComponent } from './components/dashboard-stock/dashboard-stock.component';
import { ChatbotComponent } from './components/chatbotStock/chatbot.component';

@NgModule({
  declarations: [
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
        ChatbotComponent
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,  
    NgChartsModule

  ]
})
export class BackofficeModule { }
