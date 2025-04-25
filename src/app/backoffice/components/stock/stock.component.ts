import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockService } from 'src/app/services/stock.service';
import { CommandeService } from 'src/app/services/commande.service';
import { Stock } from 'src/app/model/Stock';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  stockList: Stock[] = [];
  expirationAlertes: Stock[] = [];

  constructor(
    private commandeService: CommandeService,
    private stockService: StockService, // Renommez medicamentService en stockService pour plus de clarté
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStockData();
  }

  loadStockData(): void {
    this.commandeService.getStock().subscribe(data => {
      this.stockList = data;
      this.checkExpirationAlertes();
      this.initCharts();
    });

    this.stockService.getMedicamentsProchesExpiration().subscribe(data => {
      this.expirationAlertes = data;
    });
  }

  isExpire(expirationDate: string): boolean {
    const now = new Date();
    const expDate = new Date(expirationDate);
    return expDate < now;
  }

  checkExpirationAlertes(): void {
    const today = new Date();
    this.expirationAlertes = this.stockList.filter(stock => {
      const expDate = new Date(stock.medicament.dateExpiration);
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      return diffDays <= 7;
    });
  }

  shouldShowCommanderButton(stock: Stock): boolean {
    return stock.quantiteEnStock < stock.seuilAlerte;
  }

  commanderChezFournisseur(fournisseurId: number): void {
    this.router.navigate(['/back/fournisseur', fournisseurId, 'medicaments']);
  }

  getLowStockCount(): number {
    return this.stockList.filter(s => s.quantiteEnStock < s.seuilAlerte).length;
  }

  getTotalValue(): number {
    return this.stockList.reduce((sum, stock) => sum + (stock.medicament.prix * stock.quantiteEnStock), 0);
  }

  initCharts(): void {
    const statusCtx = document.getElementById('stockStatusChart') as HTMLCanvasElement;
    new Chart(statusCtx, {
      type: 'pie',
      data: {
        labels: ['Normal', 'Stock faible', 'Expiré'],
        datasets: [{
          data: [
            this.stockList.filter(s => s.quantiteEnStock >= s.seuilAlerte && !this.isExpire(s.medicament.dateExpiration)).length,
            this.getLowStockCount(),
            this.stockList.filter(s => this.isExpire(s.medicament.dateExpiration)).length
          ],
          backgroundColor: [
            '#2ecc71', '#f39c12', '#e74c3c'
          ]
        }]
      }
    });
  }
}