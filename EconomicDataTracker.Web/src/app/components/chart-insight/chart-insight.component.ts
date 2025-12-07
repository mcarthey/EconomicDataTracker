import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriesWithObservations } from '../../models/series-with-observations.model';
import { getIndicatorMetadata } from '../../models/indicator-metadata';

@Component({
  selector: 'app-chart-insight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-insight.component.html',
  styleUrls: ['./chart-insight.component.css']
})
export class ChartInsightComponent {
  @Input() seriesData!: SeriesWithObservations;

  get trendAnalysis(): string {
    if (!this.seriesData?.observations || this.seriesData.observations.length < 2) {
      return 'Insufficient data for trend analysis';
    }

    const sorted = [...this.seriesData.observations].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const latest = sorted[sorted.length - 1].value;
    const previous = sorted[sorted.length - 2].value;
    const oldest = sorted[0].value;

    const recentChange = ((latest - previous) / previous) * 100;
    const overallChange = ((latest - oldest) / oldest) * 100;

    const metadata = getIndicatorMetadata(this.seriesData.series.name);

    let analysis = '';

    // Overall trend
    if (Math.abs(overallChange) < 1) {
      analysis = `📊 <strong>Stable trend</strong>: ${this.seriesData.series.description} has remained relatively stable over this period, `;
    } else if (overallChange > 0) {
      analysis = `📈 <strong>Upward trend</strong>: ${this.seriesData.series.description} has increased by ${overallChange.toFixed(1)}% over this period, `;
    } else {
      analysis = `📉 <strong>Downward trend</strong>: ${this.seriesData.series.description} has decreased by ${Math.abs(overallChange).toFixed(1)}% over this period, `;
    }

    // Recent movement
    if (Math.abs(recentChange) < 0.5) {
      analysis += 'with minimal recent movement';
    } else if (recentChange > 0) {
      analysis += `rising ${recentChange.toFixed(1)}% recently`;
    } else {
      analysis += `falling ${Math.abs(recentChange).toFixed(1)}% recently`;
    }

    // Add interpretation if we have metadata
    if (metadata) {
      const isGood = (overallChange > 0 && metadata.interpretation.goodDirection === 'up') ||
                     (overallChange < 0 && metadata.interpretation.goodDirection === 'down');

      if (Math.abs(overallChange) >= 1) {
        analysis += isGood ? '. <span class="positive-indicator">This is a positive economic signal.</span>'
                          : '. <span class="negative-indicator">This raises economic concerns.</span>';
      }
    }

    return analysis;
  }

  get volatilityInsight(): string {
    if (!this.seriesData?.observations || this.seriesData.observations.length < 5) {
      return '';
    }

    const values = this.seriesData.observations.map(o => o.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = (stdDev / mean) * 100;

    if (coefficientOfVariation < 2) {
      return '🎯 <strong>Low volatility</strong> - Values are very stable with minimal fluctuation';
    } else if (coefficientOfVariation < 5) {
      return '📊 <strong>Moderate volatility</strong> - Values show some normal variation';
    } else {
      return '⚠️ <strong>High volatility</strong> - Values are fluctuating significantly, indicating uncertainty';
    }
  }

  get currentPosition(): string {
    if (!this.seriesData?.observations || this.seriesData.observations.length === 0) {
      return '';
    }

    const values = this.seriesData.observations.map(o => o.value);
    const latest = values[values.length - 1];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const position = ((latest - min) / range) * 100;

    const metadata = getIndicatorMetadata(this.seriesData.series.name);
    let positionText = '';

    if (position >= 80) {
      positionText = '📍 <strong>Near historical high</strong> for this time period';
    } else if (position >= 60) {
      positionText = '📍 <strong>Above mid-range</strong> for this time period';
    } else if (position >= 40) {
      positionText = '📍 <strong>Mid-range</strong> for this time period';
    } else if (position >= 20) {
      positionText = '📍 <strong>Below mid-range</strong> for this time period';
    } else {
      positionText = '📍 <strong>Near historical low</strong> for this time period';
    }

    // Add context if available
    if (metadata?.benchmarks) {
      const { recession, expansion } = metadata.benchmarks;
      if (recession && expansion) {
        if (latest <= recession) {
          positionText += ' ⚠️ <span class="warning-text">Near recession levels</span>';
        } else if (latest >= expansion) {
          positionText += ' ✓ <span class="positive-text">At healthy expansion levels</span>';
        }
      }
    }

    return positionText;
  }
}
