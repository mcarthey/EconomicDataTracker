export interface CorrelationPattern {
  id: string;
  title: string;
  description: string;
  indicators: string[]; // Indicator names involved
  confidence: number; // 0-100
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'positive' | 'negative' | 'neutral';
  economicSignal: string; // What this correlation indicates
  historicalContext?: string;
}

export interface CorrelationAnalysis {
  patterns: CorrelationPattern[];
  summary: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
}
