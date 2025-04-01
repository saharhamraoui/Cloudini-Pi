import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FournisseurDetailComponent } from './components/fournisseur-detail/fournisseur-detail.component';
import { MedicamentListComponent } from './components/medicament-list/medicament-list.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
@NgModule({
  declarations: [
    AppComponent,
    FournisseurListComponent,
    FournisseurDetailComponent,
    MedicamentListComponent,
    CommandeListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
