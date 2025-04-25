import { Component, OnInit } from '@angular/core';  
import { CommandeService } from 'src/app/services/commande.service';  
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';  

@Component({  
  selector: 'app-dashboard',  
  templateUrl: './dashboard.component.html',  
  styleUrls: ['./dashboard.component.css']  
})  
export class DashboardComponent implements OnInit {  
  commandesLivrees: any[] = [];  
  totalParFournisseur: { [key: string]: number } = {};  
  fournisseurs: string[] = [];  
  montants: number[] = [];  
  totalAmount: number = 0;  

  // Chart configurations  
  public barChartOptions: ChartConfiguration['options'] = {  
    responsive: true,  
    scales: {  
      x: {  
        title: {  
          display: true,  
          text: 'Fournisseurs',  
          font: {  
            size: 14,  
            weight: 'bold'  
          }  
        }  
      },  
      y: {  
        title: {  
          display: true,  
          text: 'Montant (€)',  
          font: {  
            size: 14,  
            weight: 'bold'  
          }  
        },  
        beginAtZero: true  
      }  
    },  
    plugins: {  
      legend: {  
        display: true,  
        position: 'top'  
      },  
      tooltip: {  
        callbacks: {  
          label: (context) => `${context.dataset.label}: ${context.raw} €`  
        }  
      }  
    }  
  };  

  public barChartType: ChartType = 'bar';  
  public barChartData: ChartData<'bar'> = {  
    labels: [],  
    datasets: [  
      {  
        data: [],  
        label: 'Montant par fournisseur',  
        backgroundColor: '#4e73df',  
        hoverBackgroundColor: '#2e59d9',  
        borderColor: '#1a56db',  
        borderWidth: 1  
      }  
    ]  
  };  

  public pieChartOptions: ChartConfiguration['options'] = {  
    responsive: true,  
    plugins: {  
      legend: {  
        position: 'top',  
      },  
      tooltip: {  
        callbacks: {  
          label: (context) => {  
            const label = context.label || '';  
            const value = context.raw as number;  
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);  
            const percentage = Math.round((value / total) * 100);  
            return `${label}: ${value} € (${percentage}%)`;  
          }  
        }  
      }  
    }  
  };  

  public pieChartType: ChartType = 'pie';  
  public pieChartData: ChartData<'pie'> = {  
    labels: [],  
    datasets: [  
      {  
        data: [],  
        backgroundColor: [  
          '#4e73df',  
          '#1cc88a',  
          '#36b9cc',  
          '#f6c23e',  
          '#e74a3b',  
          '#858796',  
          '#5a5c69'  
        ],  
        hoverBackgroundColor: [  
          '#2e59d9',  
          '#17a673',  
          '#2c9faf',  
          '#dda20a',  
          '#be2617',  
          '#6c6e7e',  
          '#3a3b45'  
        ],  
        hoverBorderColor: 'rgba(234, 236, 244, 1)',  
      }  
    ]  
  };  

  constructor(private _service: CommandeService) {}  

  ngOnInit(): void {  
    this._service.getCommandes().subscribe(commandes => {  
      this.commandesLivrees = commandes.filter(c => c.status === 'Livrée');  
      
      // Calculate totals by supplier  
      this.totalParFournisseur = {};  
      this.totalAmount = 0;  
      
      this.commandesLivrees.forEach(commande => {  
        const fournisseur = commande.fournisseur.nom;  
        const total = commande.lignesCommande.reduce((sum: number, ligne: any) =>  
          sum + (ligne.medicament.prix * ligne.quantite), 0  
        );  
        
        if (!this.totalParFournisseur[fournisseur]) {  
          this.totalParFournisseur[fournisseur] = 0;  
        }  
        this.totalParFournisseur[fournisseur] += total;  
        this.totalAmount += total;  
      });  

      // Prepare data for charts  
      this.fournisseurs = Object.keys(this.totalParFournisseur);  
      this.montants = Object.values(this.totalParFournisseur);  

      // Update chart data  
      this.barChartData = {  
        labels: this.fournisseurs,  
        datasets: [  
          {  
            data: this.montants,  
            label: 'Montant par fournisseur',  
            backgroundColor: '#4e73df',  
            hoverBackgroundColor: '#2e59d9',  
            borderColor: '#1a56db',  
            borderWidth: 1  
          }  
        ]  
      };  

      this.pieChartData = {  
        labels: this.fournisseurs,  
        datasets: [  
          {  
            data: this.montants,  
            backgroundColor: [  
              '#4e73df',  
              '#1cc88a',  
              '#36b9cc',  
              '#f6c23e',  
              '#e74a3b',  
              '#858796',  
              '#5a5c69'  
            ],  
            hoverBackgroundColor: [  
              '#2e59d9',  
              '#17a673',  
              '#2c9faf',  
              '#dda20a',  
              '#be2617',  
              '#6c6e7e',  
              '#3a3b45'  
            ],  
            hoverBorderColor: 'rgba(234, 236, 244, 1)',  
          }  
        ]  
      };  
    });  
  }  

  calculateCommandeTotal(commande: any): number {  
    return commande.lignesCommande.reduce((sum: number, ligne: any) =>  
      sum + (ligne.medicament.prix * ligne.quantite), 0  
    );  
  }  

  getTotalAmount(): number {  
    return this.totalAmount;  
  }  
}  