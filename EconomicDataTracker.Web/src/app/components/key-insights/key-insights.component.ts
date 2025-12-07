import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EconomicHealthSummary, KeyInsight } from '../../models/dashboard-summary.model';

@Component({
  selector: 'app-key-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-insights.component.html',
  styleUrls: ['./key-insights.component.css']
})
export class KeyInsightsComponent {
  @Input() healthSummary!: EconomicHealthSummary;

  getInsightClass(type: string): string {
    return `insight-${type}`;
  }

  getHealthScoreClass(score: number): string {
    if (score >= 80) return 'health-excellent';
    if (score >= 65) return 'health-good';
    if (score >= 50) return 'health-fair';
    if (score >= 35) return 'health-weak';
    return 'health-poor';
  }

  getHealthIcon(score: number): string {
    if (score >= 80) return '🟢';
    if (score >= 65) return '🟡';
    if (score >= 50) return '🟠';
    return '🔴';
  }
}
