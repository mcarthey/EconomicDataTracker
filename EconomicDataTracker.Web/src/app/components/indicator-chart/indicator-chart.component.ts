import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { SeriesWithObservations } from '../../models/series-with-observations.model';

@Component({
  selector: 'app-indicator-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './indicator-chart.component.html',
  styleUrls: ['./indicator-chart.component.css']
})
export class IndicatorChartComponent implements OnChanges {
  @Input() seriesData!: SeriesWithObservations;
  @Input() height: number = 400;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.4
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    }
  };

  public lineChartType: ChartType = 'line';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seriesData'] && this.seriesData) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (!this.seriesData || !this.seriesData.observations || this.seriesData.observations.length === 0) {
      return;
    }

    // Sort observations by date
    const sortedObservations = [...this.seriesData.observations].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Extract labels (dates) and data (values)
    const labels = sortedObservations.map(obs =>
      new Date(obs.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    );

    const data = sortedObservations.map(obs => obs.value);

    // Generate a color based on series ID
    const color = this.getColorForSeries(this.seriesData.series.id);

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          label: this.seriesData.series.description,
          borderColor: color,
          backgroundColor: color + '33', // Add transparency
          fill: true,
          pointRadius: 2,
          pointHoverRadius: 5
        }
      ]
    };

    // Update the chart if it exists
    this.chart?.update();
  }

  private getColorForSeries(seriesId: number): string {
    const colors = [
      '#667eea', // Purple
      '#f093fb', // Pink
      '#4facfe', // Blue
      '#43e97b', // Green
      '#fa709a', // Red-Pink
      '#fee140', // Yellow
      '#30cfd0', // Cyan
      '#a8edea', // Light Blue
      '#ff6b6b', // Red
      '#4ecdc4'  // Teal
    ];

    return colors[seriesId % colors.length];
  }

  get chartContainerStyle() {
    return {
      'height.px': this.height,
      'position': 'relative'
    };
  }
}
