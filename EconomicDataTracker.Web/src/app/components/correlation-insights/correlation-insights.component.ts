import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorrelationAnalysis, CorrelationPattern } from '../../models/correlation.model';

@Component({
  selector: 'app-correlation-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './correlation-insights.component.html',
  styleUrls: ['./correlation-insights.component.css']
})
export class CorrelationInsightsComponent {
  @Input() analysis!: CorrelationAnalysis;
  @Input() collapsed: boolean = false;

  getSeverityClass(severity: string): string {
    return `severity-${severity}`;
  }

  getTypeClass(type: string): string {
    return `type-${type}`;
  }

  getRiskClass(risk: string): string {
    return `risk-${risk}`;
  }

  getConfidenceBadge(confidence: number): string {
    if (confidence >= 80) return 'Very High';
    if (confidence >= 70) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  }

  getConfidenceClass(confidence: number): string {
    if (confidence >= 80) return 'confidence-very-high';
    if (confidence >= 70) return 'confidence-high';
    if (confidence >= 60) return 'confidence-medium';
    return 'confidence-low';
  }
}
