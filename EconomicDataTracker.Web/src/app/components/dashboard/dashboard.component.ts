import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EconomicDataService } from '../../services/economic-data.service';
import { IndicatorInterpretationService } from '../../services/indicator-interpretation.service';
import {
  DashboardSummary,
  EnrichedIndicator,
  CategoryGroup,
  EconomicHealthSummary
} from '../../models/dashboard-summary.model';
import { Series } from '../../models/series.model';
import { SeriesWithObservations } from '../../models/series-with-observations.model';
import { IndicatorChartComponent } from '../indicator-chart/indicator-chart.component';
import { SeriesSelectorComponent } from '../series-selector/series-selector.component';
import { DateRangeFilterComponent } from '../date-range-filter/date-range-filter.component';
import { KeyInsightsComponent } from '../key-insights/key-insights.component';
import { ChartInsightComponent } from '../chart-insight/chart-insight.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IndicatorChartComponent,
    SeriesSelectorComponent,
    DateRangeFilterComponent,
    KeyInsightsComponent,
    ChartInsightComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  summaries: DashboardSummary[] = [];
  enrichedIndicators: EnrichedIndicator[] = [];
  categoryGroups: CategoryGroup[] = [];
  healthSummary: EconomicHealthSummary | null = null;
  allSeries: Series[] = [];
  selectedSeriesIds: number[] = [];
  trendData: SeriesWithObservations[] = [];
  selectedPeriod: string = '1year';
  startDate?: Date;
  endDate?: Date;
  loading: boolean = true;
  chartsLoading: boolean = false; // Separate loading for charts only
  error: string = '';

  // Collapsible state management
  collapsedCategories: Set<string> = new Set();
  expandedIndicators: Set<string> = new Set();
  showIndicators: boolean = true; // Show/hide entire indicators section

  periodOptions = [
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: '2years', label: '2 Years' },
    { value: '5years', label: '5 Years' },
    { value: '10years', label: '10 Years' }
  ];

  constructor(
    private economicDataService: EconomicDataService,
    private interpretationService: IndicatorInterpretationService
  ) { }

  ngOnInit(): void {
    this.loadSavedState();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    let seriesLoaded = false;
    let summaryLoaded = false;

    const checkLoadingComplete = () => {
      if (seriesLoaded && summaryLoaded) {
        this.loading = false;
      }
    };

    // Load all series
    this.economicDataService.getAllSeries(true).subscribe({
      next: (series) => {
        this.allSeries = series;
        // Default to first 3 series for initial chart
        this.selectedSeriesIds = series.slice(0, 3).map(s => s.id);
        this.loadTrends();
        seriesLoaded = true;
        checkLoadingComplete();
      },
      error: (err) => {
        this.error = 'Failed to load series data';
        console.error('Error loading series:', err);
        this.loading = false;
      }
    });

    // Load dashboard summary and enrich with interpretation
    this.economicDataService.getDashboardSummary(true).subscribe({
      next: (summaries) => {
        this.summaries = summaries;

        // Enrich indicators with interpretation and context
        this.enrichedIndicators = summaries.map(summary =>
          this.interpretationService.enrichIndicator(summary)
        );

        // Group by category
        this.categoryGroups = this.interpretationService.groupByCategory(this.enrichedIndicators);

        // Generate economic health summary
        this.healthSummary = this.interpretationService.generateEconomicHealth(this.enrichedIndicators);

        summaryLoaded = true;
        checkLoadingComplete();
      },
      error: (err) => {
        this.error = 'Failed to load dashboard summary';
        console.error('Error loading summary:', err);
        this.loading = false;
      }
    });
  }

  loadTrends(): void {
    this.chartsLoading = true; // Use separate loading state for charts
    const ids = this.selectedSeriesIds.length > 0 ? this.selectedSeriesIds : undefined;

    this.economicDataService.getTrends(ids, this.selectedPeriod).subscribe({
      next: (trends) => {
        this.trendData = trends;
        this.chartsLoading = false;
        // Scroll to charts section smoothly after data loads
        setTimeout(() => this.scrollToCharts(), 100);
      },
      error: (err) => {
        this.error = 'Failed to load trend data';
        console.error('Error loading trends:', err);
        this.chartsLoading = false;
      }
    });
  }

  onSeriesSelectionChange(selectedIds: number[]): void {
    this.selectedSeriesIds = selectedIds;
    this.loadTrends();
  }

  onPeriodChange(): void {
    this.loadTrends();
  }

  onDateRangeChange(dates: { startDate?: Date; endDate?: Date }): void {
    this.startDate = dates.startDate;
    this.endDate = dates.endDate;
    // If using custom date range, we could add a separate API call here
    // For now, we'll stick with the period-based trends
  }

  getChangeClass(changePercent?: number): string {
    if (!changePercent) return '';
    return changePercent > 0 ? 'positive' : changePercent < 0 ? 'negative' : '';
  }

  formatNumber(value?: number): string {
    if (value === undefined || value === null) return 'N/A';
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  formatPercent(value?: number): string {
    if (value === undefined || value === null) return 'N/A';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }

  formatDate(date?: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // New helper methods for enriched indicators
  getSentimentClass(indicator: EnrichedIndicator): string {
    return `sentiment-${indicator.sentiment}`;
  }

  getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  }

  getTrendClass(indicator: EnrichedIndicator): string {
    return `trend-${indicator.trend}`;
  }

  // Collapse/Expand functionality
  toggleCategory(category: string): void {
    if (this.collapsedCategories.has(category)) {
      this.collapsedCategories.delete(category);
    } else {
      this.collapsedCategories.add(category);
    }
    this.saveState();
  }

  isCategoryCollapsed(category: string): boolean {
    return this.collapsedCategories.has(category);
  }

  toggleIndicator(indicatorName: string): void {
    if (this.expandedIndicators.has(indicatorName)) {
      this.expandedIndicators.delete(indicatorName);
    } else {
      this.expandedIndicators.add(indicatorName);
    }
    this.saveState();
  }

  isIndicatorExpanded(indicatorName: string): boolean {
    return this.expandedIndicators.has(indicatorName);
  }

  toggleIndicatorsSection(): void {
    this.showIndicators = !this.showIndicators;
    this.saveState();
  }

  collapseAllCategories(): void {
    this.categoryGroups.forEach(group => {
      this.collapsedCategories.add(group.category);
    });
    this.saveState();
  }

  expandAllCategories(): void {
    this.collapsedCategories.clear();
    this.saveState();
  }

  scrollToCharts(): void {
    const chartsSection = document.querySelector('.charts-section');
    if (chartsSection) {
      chartsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // LocalStorage persistence
  private loadSavedState(): void {
    try {
      const savedCollapsedCategories = localStorage.getItem('dashboard_collapsedCategories');
      const savedExpandedIndicators = localStorage.getItem('dashboard_expandedIndicators');
      const savedShowIndicators = localStorage.getItem('dashboard_showIndicators');

      if (savedCollapsedCategories) {
        this.collapsedCategories = new Set(JSON.parse(savedCollapsedCategories));
      }
      if (savedExpandedIndicators) {
        this.expandedIndicators = new Set(JSON.parse(savedExpandedIndicators));
      }
      if (savedShowIndicators !== null) {
        this.showIndicators = JSON.parse(savedShowIndicators);
      }
    } catch (e) {
      console.warn('Failed to load saved dashboard state:', e);
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem('dashboard_collapsedCategories', JSON.stringify(Array.from(this.collapsedCategories)));
      localStorage.setItem('dashboard_expandedIndicators', JSON.stringify(Array.from(this.expandedIndicators)));
      localStorage.setItem('dashboard_showIndicators', JSON.stringify(this.showIndicators));
    } catch (e) {
      console.warn('Failed to save dashboard state:', e);
    }
  }
}
