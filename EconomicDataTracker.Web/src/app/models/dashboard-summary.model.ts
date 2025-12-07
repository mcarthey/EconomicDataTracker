export interface DashboardSummary {
  seriesId: number;
  name: string;
  description: string;
  latestValue?: number;
  latestDate?: Date;
  previousValue?: number;
  previousDate?: Date;
  changeValue?: number;
  changePercent?: number;
}

export interface EnrichedIndicator extends DashboardSummary {
  // Interpretation
  trend: 'up' | 'down' | 'stable';
  sentiment: 'positive' | 'negative' | 'neutral';
  severity: 'strong' | 'moderate' | 'mild';

  // Context
  category: string;
  whatItMeans: string;
  whyItMatters: string;
  currentAssessment: string;

  // Formatting
  formattedValue: string;
  formattedChange: string;
}

export interface CategoryGroup {
  category: string;
  categoryName: string;
  icon: string;
  color: string;
  indicators: EnrichedIndicator[];
  healthScore: number; // 0-100
  overallTrend: 'improving' | 'stable' | 'declining';
}

export interface KeyInsight {
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  icon: string;
  title: string;
  message: string;
  indicators: string[]; // Array of series IDs
}

export interface EconomicHealthSummary {
  overallScore: number; // 0-100
  scoreLabel: string; // 'Excellent', 'Good', 'Fair', 'Weak'
  categoryScores: {
    category: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  keyInsights: KeyInsight[];
  lastUpdated: Date;
}

