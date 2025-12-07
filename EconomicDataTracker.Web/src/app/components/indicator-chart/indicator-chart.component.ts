import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { SeriesWithObservations } from '../../models/series-with-observations.model';
import { getIndicatorMetadata, IndicatorMetadata } from '../../models/indicator-metadata';

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

  public lineChartOptions: ChartConfiguration['options'] = {};

  public lineChartType: ChartType = 'line';

  public chartSentiment: 'positive' | 'negative' | 'neutral' | null = null;

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

    // Get metadata for this indicator
    const metadata = getIndicatorMetadata(this.seriesData.series.name);

    // Generate a color based on series ID
    const color = this.getColorForSeries(this.seriesData.series.id);

    // Build datasets - start with the main line
    const datasets: any[] = [
      {
        data: data,
        label: this.seriesData.series.description,
        borderColor: color,
        backgroundColor: color + '33',
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5,
        order: 1
      }
    ];

    // Add target range lines if metadata is available
    if (metadata?.interpretation.targetRange) {
      const { min, max } = metadata.interpretation.targetRange;

      // Add target range background (as a dataset)
      datasets.push({
        label: 'Target Range',
        data: labels.map(() => max),
        borderColor: '#10b98133',
        backgroundColor: '#10b98111',
        fill: '+1',
        pointRadius: 0,
        borderWidth: 1,
        borderDash: [5, 5],
        order: 3
      });

      datasets.push({
        label: '',
        data: labels.map(() => min),
        borderColor: '#10b98133',
        backgroundColor: 'transparent',
        pointRadius: 0,
        borderWidth: 1,
        borderDash: [5, 5],
        order: 3
      });
    }

    // Add benchmark lines if available
    if (metadata?.benchmarks) {
      if (metadata.benchmarks.preCovidAvg) {
        datasets.push({
          label: 'Pre-COVID Avg',
          data: labels.map(() => metadata.benchmarks.preCovidAvg),
          borderColor: '#6b7280',
          borderWidth: 1,
          borderDash: [3, 3],
          pointRadius: 0,
          fill: false,
          order: 2
        });
      }
    }

    this.lineChartData = {
      labels: labels,
      datasets: datasets
    };

    // Build chart options dynamically
    this.lineChartOptions = {
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
            text: metadata?.context.whatItMeans || 'Value'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            filter: (item) => item.text !== '' // Hide empty labels
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (context) => {
              return context[0].label;
            },
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                if (metadata?.formatting) {
                  let formatted = context.parsed.y.toFixed(metadata.formatting.decimals);
                  if (metadata.formatting.isCurrency) {
                    formatted = '$' + formatted;
                  }
                  if (metadata.formatting.suffix) {
                    formatted += metadata.formatting.suffix;
                  }
                  label += formatted;
                } else {
                  label += context.parsed.y.toFixed(2);
                }
              }
              return label;
            }
          }
        }
      }
    };

    // Calculate chart sentiment based on recent trend
    this.calculateChartSentiment(data, metadata);

    // Update the chart if it exists
    this.chart?.update();
  }

  private calculateChartSentiment(data: number[], metadata: IndicatorMetadata | undefined): void {
    if (data.length < 2 || !metadata) {
      this.chartSentiment = null;
      return;
    }

    // Calculate trend from latest vs previous value
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const changePercent = ((latest - previous) / previous) * 100;

    // Determine trend
    let trend: 'up' | 'down' | 'stable';
    if (Math.abs(changePercent) < 0.5) {
      trend = 'stable';
    } else {
      trend = changePercent > 0 ? 'up' : 'down';
    }

    // Calculate sentiment based on good direction
    if (trend === 'stable') {
      this.chartSentiment = 'neutral';
    } else if (trend === metadata.interpretation.goodDirection) {
      this.chartSentiment = 'positive';
    } else {
      this.chartSentiment = 'negative';
    }
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

  getChartWrapperClass(): string {
    if (!this.chartSentiment) return '';
    return `chart-sentiment-${this.chartSentiment}`;
  }

  getSentimentClass(): string {
    if (!this.chartSentiment) return '';
    return `sentiment-${this.chartSentiment}`;
  }

  getSentimentIcon(): string {
    switch (this.chartSentiment) {
      case 'positive':
        return '✅';
      case 'negative':
        return '⚠️';
      case 'neutral':
        return '➡️';
      default:
        return '';
    }
  }

  getSentimentLabel(): string {
    switch (this.chartSentiment) {
      case 'positive':
        return 'Positive Trend';
      case 'negative':
        return 'Concerning Trend';
      case 'neutral':
        return 'Stable';
      default:
        return '';
    }
  }
}
