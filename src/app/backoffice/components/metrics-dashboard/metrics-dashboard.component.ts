import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { MetricsService } from 'src/app/services/metrics.service';

@Component({
  selector: 'app-metrics-dashboard',
  templateUrl: './metrics-dashboard.component.html'
})
export class MetricsDashboardComponent implements OnInit {
  total = 0;
  avgResolutionTime = 0;
  top5: any[] = [];

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    // Load general metrics
    this.metricsService.getReclamationMetrics().subscribe(data => {
      this.total = data.totalReclamations;
      this.avgResolutionTime = data.avgResolutionHours;

      this.renderStatusChart(data.statusDistribution);
      this.renderActivityChart(data.last7DaysActivity);
    });

    // Load category chart
    this.metricsService.getCategoryDistribution().subscribe(data => {
      this.renderCategoryChart(data);
    });

    // Load Top 5 active complaints
    this.metricsService.getTop5ActiveReclamations().subscribe(data => {
      this.top5 = data;
    });
  }

  renderCategoryChart(data: any): void {
    new Chart('categoryChart', {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            label: 'Réclamations par catégorie',
            data: Object.values(data),
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          }
        ]
      }
    });
  }

  renderStatusChart(data: any): void {
    new Chart('statusChart', {
      type: 'pie',
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            label: 'Statuts',
            data: Object.values(data),
            backgroundColor: [
              '#ffc107', '#17a2b8', '#28a745', '#6c757d', '#dc3545'
            ]
          }
        ]
      }
    });
  }

  renderActivityChart(data: any): void {
    const labels = Object.keys(data);
    const values = Object.values(data);

    new Chart('activityChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Réclamations - 7 derniers jours',
            data: values,
            backgroundColor: 'rgba(0, 123, 255, 0.6)'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0 // force integer values
            }
          }
        }
      }
    });
  }
}
