import { Component, OnInit } from '@angular/core';
import { Stock } from 'src/app/models/Stock';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent  implements OnInit {
  stockList: Stock[] = [];

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.commandeService.getStock().subscribe(data => {
      this.stockList = data;
    });
  }
}
