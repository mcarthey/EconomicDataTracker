import { Injectable } from '@angular/core';
import {
  DashboardSummary,
  EnrichedIndicator,
  CategoryGroup,
  KeyInsight,
  EconomicHealthSummary
} from '../models/dashboard-summary.model';
import {
  getIndicatorMetadata,
  getIndicatorsByCategory,
  IndicatorCategory,
  CATEGORY_INFO,
  IndicatorMetadata
} from '../models/indicator-metadata';

@Injectable({
  providedIn: 'root'
})
export class IndicatorInterpretationService {

  enrichIndicator(summary: DashboardSummary): EnrichedIndicator {
    const metadata = getIndicatorMetadata(summary.name);

    if (!metadata) {
      // Fallback for indicators without metadata
      return this.createDefaultEnrichedIndicator(summary);
    }

    const trend = this.calculateTrend(summary.changePercent || 0);
    const sentiment = this.calculateSentiment(
      trend,
      metadata.interpretation.goodDirection
    );
    const severity = this.calculateSeverity(summary.changePercent || 0);

    return {
      ...summary,
      trend,
      sentiment,
      severity,
      category: metadata.category,
      whatItMeans: metadata.context.whatItMeans,
      whyItMatters: metadata.context.whyItMatters,
      currentAssessment: this.generateAssessment(summary, metadata),
      whatDrivesThis: metadata.context.whatDrivesThis,
      implications: this.generateImplications(trend, metadata),
      benchmarkComparison: this.generateBenchmarkComparison(summary, metadata),
      formattedValue: this.formatValue(summary.latestValue || 0, metadata),
      formattedChange: this.formatChange(summary.changePercent || 0)
    };
  }

  groupByCategory(enrichedIndicators: EnrichedIndicator[]): CategoryGroup[] {
    const categoryMap = new Map<string, EnrichedIndicator[]>();

    enrichedIndicators.forEach(indicator => {
      if (!categoryMap.has(indicator.category)) {
        categoryMap.set(indicator.category, []);
      }
      categoryMap.get(indicator.category)!.push(indicator);
    });

    const groups: CategoryGroup[] = [];

    categoryMap.forEach((indicators, category) => {
      const catInfo = CATEGORY_INFO[category as IndicatorCategory];
      if (!catInfo) return;

      // Calculate health score for this category
      const healthScore = this.calculateCategoryHealth(indicators);
      const overallTrend = this.calculateCategoryTrend(indicators);

      groups.push({
        category,
        categoryName: catInfo.name,
        icon: catInfo.icon,
        color: catInfo.color,
        indicators,
        healthScore,
        overallTrend
      });
    });

    // Sort by category importance (employment, inflation, growth, markets, housing, consumer)
    const categoryOrder = [
      IndicatorCategory.Employment,
      IndicatorCategory.Inflation,
      IndicatorCategory.Growth,
      IndicatorCategory.Markets,
      IndicatorCategory.Housing,
      IndicatorCategory.Consumer
    ];

    groups.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.category as IndicatorCategory);
      const bIndex = categoryOrder.indexOf(b.category as IndicatorCategory);
      return aIndex - bIndex;
    });

    return groups;
  }

  generateEconomicHealth(enrichedIndicators: EnrichedIndicator[]): EconomicHealthSummary {
    const categoryGroups = this.groupByCategory(enrichedIndicators);

    // Calculate overall economic health score (0-100)
    const overallScore = this.calculateOverallHealth(categoryGroups);
    const scoreLabel = this.getHealthLabel(overallScore);

    // Category scores
    const categoryScores = categoryGroups.map(group => ({
      category: group.categoryName,
      score: group.healthScore,
      trend: this.mapTrendDirection(group.overallTrend)
    }));

    // Generate key insights
    const keyInsights = this.generateKeyInsights(enrichedIndicators);

    return {
      overallScore,
      scoreLabel,
      categoryScores,
      keyInsights,
      lastUpdated: new Date()
    };
  }

  private calculateTrend(changePercent: number): 'up' | 'down' | 'stable' {
    // Use same threshold as assessment (0.5%) for consistency
    if (Math.abs(changePercent) < 0.5) return 'stable';
    return changePercent > 0 ? 'up' : 'down';
  }

  private calculateSentiment(
    trend: 'up' | 'down' | 'stable',
    goodDirection: 'up' | 'down'
  ): 'positive' | 'negative' | 'neutral' {
    if (trend === 'stable') return 'neutral';
    if (trend === goodDirection) return 'positive';
    return 'negative';
  }

  private calculateSeverity(changePercent: number): 'strong' | 'moderate' | 'mild' {
    const absChange = Math.abs(changePercent);
    if (absChange > 5) return 'strong';
    if (absChange > 2) return 'moderate';
    return 'mild';
  }

  private generateAssessment(summary: DashboardSummary, metadata: IndicatorMetadata): string {
    const changePercent = summary.changePercent || 0;
    const absChange = Math.abs(changePercent);
    const direction = changePercent > 0 ? 'rising' : 'falling';
    const isGood = this.calculateSentiment(
      this.calculateTrend(changePercent),
      metadata.interpretation.goodDirection
    ) === 'positive';

    if (absChange < 0.5) {
      return 'Stable with minimal change';
    } else if (absChange < 2) {
      return `${isGood ? 'Favorable' : 'Unfavorable'} - ${direction} moderately`;
    } else if (absChange < 5) {
      return `${isGood ? 'Positive' : 'Concerning'} - ${direction} significantly`;
    } else {
      return `${isGood ? 'Strong improvement' : 'Sharp decline'} - ${direction} rapidly`;
    }
  }

  private generateImplications(trend: 'up' | 'down' | 'stable', metadata: IndicatorMetadata): string {
    if (trend === 'stable') {
      return 'Maintaining current levels suggests stability in this economic area';
    }

    return trend === 'up'
      ? metadata.context.implications.rising
      : metadata.context.implications.falling;
  }

  private generateBenchmarkComparison(summary: DashboardSummary, metadata: IndicatorMetadata): string | undefined {
    const currentValue = summary.latestValue;
    if (!currentValue || !metadata.benchmarks) return undefined;

    const { preCovidAvg, historicalAvg, recession, expansion } = metadata.benchmarks;
    const comparisons: string[] = [];

    // Compare to pre-COVID baseline
    if (preCovidAvg !== undefined) {
      const diff = currentValue - preCovidAvg;
      const percentDiff = ((diff / preCovidAvg) * 100).toFixed(1);
      const direction = diff > 0 ? 'above' : 'below';
      comparisons.push(`${Math.abs(Number(percentDiff))}% ${direction} pre-COVID avg (${this.formatValue(preCovidAvg, metadata)})`);
    }

    // Compare to historical average
    if (historicalAvg !== undefined) {
      const diff = currentValue - historicalAvg;
      const percentDiff = ((diff / historicalAvg) * 100).toFixed(1);
      const direction = diff > 0 ? 'above' : 'below';
      comparisons.push(`${Math.abs(Number(percentDiff))}% ${direction} long-term avg (${this.formatValue(historicalAvg, metadata)})`);
    }

    // Indicate recession/expansion context
    if (recession !== undefined && expansion !== undefined) {
      if (currentValue <= recession) {
        comparisons.push('⚠️ Near recession levels');
      } else if (currentValue >= expansion) {
        comparisons.push('✓ At expansion levels');
      }
    }

    return comparisons.length > 0 ? comparisons.join(' • ') : undefined;
  }

  private formatValue(value: number, metadata: IndicatorMetadata): string {
    const { formatting } = metadata;
    let formatted = value.toFixed(formatting.decimals);

    if (formatting.isCurrency) {
      formatted = '$' + formatted;
    }

    if (formatting.suffix) {
      formatted += formatting.suffix;
    }

    return formatted;
  }

  private formatChange(changePercent: number): string {
    const sign = changePercent > 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  }

  private calculateCategoryHealth(indicators: EnrichedIndicator[]): number {
    if (indicators.length === 0) return 50;

    // Calculate average sentiment score
    const sentimentScores = indicators.map(ind => {
      if (ind.sentiment === 'positive') return 100;
      if (ind.sentiment === 'neutral') return 50;
      return 0;
    });

    return sentimentScores.reduce<number>((a, b) => a + b, 0) / sentimentScores.length;
  }

  private calculateCategoryTrend(indicators: EnrichedIndicator[]): 'improving' | 'stable' | 'declining' {
    const positiveCount = indicators.filter(i => i.sentiment === 'positive').length;
    const negativeCount = indicators.filter(i => i.sentiment === 'negative').length;

    if (positiveCount > negativeCount) return 'improving';
    if (negativeCount > positiveCount) return 'declining';
    return 'stable';
  }

  private calculateOverallHealth(categoryGroups: CategoryGroup[]): number {
    if (categoryGroups.length === 0) return 50;

    // Weighted average - employment and inflation are most important
    const weights: Record<string, number> = {
      [IndicatorCategory.Employment]: 1.5,
      [IndicatorCategory.Inflation]: 1.5,
      [IndicatorCategory.Growth]: 1.2,
      [IndicatorCategory.Markets]: 0.8,
      [IndicatorCategory.Housing]: 0.8,
      [IndicatorCategory.Consumer]: 1.0
    };

    let totalScore = 0;
    let totalWeight = 0;

    categoryGroups.forEach(group => {
      const weight = weights[group.category] || 1.0;
      totalScore += group.healthScore * weight;
      totalWeight += weight;
    });

    return Math.round(totalScore / totalWeight);
  }

  private getHealthLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 35) return 'Weak';
    return 'Poor';
  }

  private mapTrendDirection(trend: 'improving' | 'stable' | 'declining'): 'up' | 'down' | 'stable' {
    if (trend === 'improving') return 'up';
    if (trend === 'declining') return 'down';
    return 'stable';
  }

  private generateKeyInsights(indicators: EnrichedIndicator[]): KeyInsight[] {
    const insights: KeyInsight[] = [];

    // Find strong positive indicators
    const strongPositive = indicators.filter(
      i => i.sentiment === 'positive' && i.severity === 'strong'
    );
    if (strongPositive.length > 0) {
      const ind = strongPositive[0];
      insights.push({
        type: 'positive',
        icon: '✅',
        title: `Strong: ${ind.description}`,
        message: `${ind.description} ${ind.trend === 'up' ? 'increased' : 'decreased'} by ${ind.formattedChange}`,
        indicators: [ind.name]
      });
    }

    // Find concerning indicators
    const strongNegative = indicators.filter(
      i => i.sentiment === 'negative' && i.severity === 'strong'
    );
    if (strongNegative.length > 0) {
      const ind = strongNegative[0];
      insights.push({
        type: 'negative',
        icon: '⚠️',
        title: `Watch: ${ind.description}`,
        message: `${ind.description} ${ind.trend === 'up' ? 'rose' : 'fell'} by ${ind.formattedChange}`,
        indicators: [ind.name]
      });
    }

    // Check for inflation trend
    const inflationIndicators = indicators.filter(i => i.category === IndicatorCategory.Inflation);
    if (inflationIndicators.length > 0) {
      const avgTrend = inflationIndicators.filter(i => i.trend === 'down').length >
                      inflationIndicators.length / 2;
      if (avgTrend) {
        insights.push({
          type: 'positive',
          icon: '📉',
          title: 'Inflation Moderating',
          message: 'Price pressures showing signs of easing',
          indicators: inflationIndicators.map(i => i.name)
        });
      }
    }

    // Check employment health
    const employmentIndicators = indicators.filter(i => i.category === IndicatorCategory.Employment);
    if (employmentIndicators.length > 0) {
      const allPositive = employmentIndicators.every(i => i.sentiment === 'positive');
      if (allPositive) {
        insights.push({
          type: 'positive',
          icon: '💼',
          title: 'Labor Market Strong',
          message: 'Employment indicators remain healthy',
          indicators: employmentIndicators.map(i => i.name)
        });
      }
    }

    return insights.slice(0, 4); // Limit to 4 insights
  }

  private createDefaultEnrichedIndicator(summary: DashboardSummary): EnrichedIndicator {
    const trend = this.calculateTrend(summary.changePercent || 0);

    return {
      ...summary,
      trend,
      sentiment: 'neutral',
      severity: 'mild',
      category: 'unknown',
      whatItMeans: '',
      whyItMatters: '',
      currentAssessment: 'No assessment available',
      whatDrivesThis: '',
      implications: '',
      benchmarkComparison: undefined,
      formattedValue: (summary.latestValue || 0).toFixed(2),
      formattedChange: this.formatChange(summary.changePercent || 0)
    };
  }
}
