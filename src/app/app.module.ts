import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MedicamentComponent } from './components/medicament/medicament.component'; 
import { FormsModule } from '@angular/forms';
import { FournisseursComponent } from './components/fournisseurs/fournisseurs.component';

@NgModule({
  declarations: [
    AppComponent,
    MedicamentComponent,
    FournisseursComponent
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
