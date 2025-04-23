import { MedicamentService } from '../../../services/medicament.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Medicament } from 'src/app/model/Medicament';
import { Stock } from 'src/app/model/Stock';
import { CommandeService } from 'src/app/services/commande.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent  implements OnInit {
  stockList: Stock[] = [];
  expirationAlertes: Stock[] = []; // 👈 Médicaments proches de l’expiration

  constructor(
    private commandeService: CommandeService,
    private medicamentService: StockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.commandeService.getStock().subscribe(data => {
      this.stockList = data;
    });

    this.medicamentService.getMedicamentsProchesExpiration().subscribe(data => {
      this.expirationAlertes = data;
    });
  }

  commanderChezFournisseur(fournisseurId: number): void {
    this.router.navigate(['/back/fournisseur', fournisseurId, 'medicaments']);
  }

 // Vérifier si la date d'expiration est dépassée
 isExpire(expirationDate: string): boolean {
  const now = new Date();
  const expDate = new Date(expirationDate);
  return expDate < now;
}

// Vérifier les alertes pour les médicaments proches de l'expiration
checkExpirationAlertes(): void {
  const today = new Date();
  this.expirationAlertes = this.stockList.filter(stock => {
    const expDate = new Date(stock.medicament.dateExpiration);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24); // Convertir le temps en jours
    return diffDays <= 7;  // Si expiration dans les 7 jours
  });
}
}