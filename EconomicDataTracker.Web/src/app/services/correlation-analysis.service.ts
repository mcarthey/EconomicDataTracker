import { Injectable } from '@angular/core';
import { CorrelationPattern, CorrelationAnalysis } from '../models/correlation.model';
import { EnrichedIndicator } from '../models/dashboard-summary.model';

@Injectable({
  providedIn: 'root'
})
export class CorrelationAnalysisService {

  analyzeCorrelations(indicators: EnrichedIndicator[]): CorrelationAnalysis {
    const patterns: CorrelationPattern[] = [];

    // Get indicator values for analysis
    const getIndicator = (name: string) =>
      indicators.find(i => i.name === name);

    const unrate = getIndicator('UNRATE');
    const payems = getIndicator('PAYEMS');
    const cpi = getIndicator('CPIAUCSL');
    const ppi = getIndicator('PPIACO');
    const gdp = getIndicator('GDPC1');
    const indpro = getIndicator('INDPRO');
    const fedfunds = getIndicator('FEDFUNDS');
    const gs10 = getIndicator('GS10');
    const sp500 = getIndicator('SP500');
    const recession = getIndicator('RECPROUSM156N');
    const mortgage = getIndicator('MORTGAGE30US');

    // Pattern 1: Yield Curve Inversion + Rising Unemployment
    if (fedfunds && gs10) {
      const yieldSpread = (gs10.latestValue || 0) - (fedfunds.latestValue || 0);
      const isInverted = yieldSpread < 0;
      const unemploymentRising = unrate && unrate.trend === 'up';

      if (isInverted && unemploymentRising) {
        patterns.push({
          id: 'yield-inversion-unemployment',
          title: '⚠️ Yield Curve Inversion + Rising Unemployment',
          description: `10-year Treasury yield is ${Math.abs(yieldSpread).toFixed(2)}% below Fed Funds rate while unemployment is trending up`,
          indicators: ['FEDFUNDS', 'GS10', 'UNRATE'],
          confidence: 85,
          severity: 'critical',
          type: 'negative',
          economicSignal: 'Historically strong recession indicator - this pattern has preceded 7 of the last 8 recessions',
          historicalContext: 'When the yield curve inverts and unemployment begins rising, recession typically follows within 6-18 months'
        });
      } else if (isInverted) {
        patterns.push({
          id: 'yield-inversion',
          title: '⚠️ Yield Curve Inversion Detected',
          description: `10-year Treasury yield is ${Math.abs(yieldSpread).toFixed(2)}% below Fed Funds rate`,
          indicators: ['FEDFUNDS', 'GS10'],
          confidence: 70,
          severity: 'high',
          type: 'negative',
          economicSignal: 'Potential recession warning - markets expect Fed to cut rates in the future',
          historicalContext: 'Yield curve inversions have preceded recessions, though timing varies (6-24 months)'
        });
      }
    }

    // Pattern 2: Fed Rate Cuts + Stable/Falling Inflation
    if (fedfunds && cpi) {
      const fedTrending = fedfunds.trend;
      const cpiTrending = cpi.trend;
      const cpiStableOrFalling = cpiTrending === 'down' || cpiTrending === 'stable';

      if (fedTrending === 'down' && cpiStableOrFalling) {
        patterns.push({
          id: 'soft-landing',
          title: '✅ Potential Soft Landing Scenario',
          description: 'Fed cutting rates while inflation remains controlled',
          indicators: ['FEDFUNDS', 'CPIAUCSL'],
          confidence: 65,
          severity: 'low',
          type: 'positive',
          economicSignal: 'Fed may be successfully reducing inflation without triggering recession',
          historicalContext: 'Soft landings are rare but possible - last achieved in mid-1990s'
        });
      }
    }

    // Pattern 3: Industrial Production Declining + Shrinking Payrolls
    if (indpro && payems) {
      const indproDecline = indpro.trend === 'down';
      const payemsDecline = payems.trend === 'down';

      if (indproDecline && payemsDecline) {
        patterns.push({
          id: 'production-employment-decline',
          title: '⚠️ Industrial Production & Employment Both Declining',
          description: 'Manufacturing output and job growth both trending negative',
          indicators: ['INDPRO', 'PAYEMS'],
          confidence: 80,
          severity: 'high',
          type: 'negative',
          economicSignal: 'Early recession signal - businesses cutting production and workforce',
          historicalContext: 'Simultaneous declines typically indicate economic contraction is underway'
        });
      }
    }

    // Pattern 4: Rising Inflation + Rising Interest Rates
    if (cpi && ppi && fedfunds) {
      const inflationRising = (cpi.trend === 'up' || ppi.trend === 'up');
      const ratesRising = fedfunds.trend === 'up';

      if (inflationRising && ratesRising) {
        patterns.push({
          id: 'inflation-rate-spiral',
          title: '⚠️ Inflation Pressure + Fed Tightening',
          description: 'Inflation trending up while Fed raises rates to combat it',
          indicators: ['CPIAUCSL', 'PPIACO', 'FEDFUNDS'],
          confidence: 75,
          severity: 'high',
          type: 'negative',
          economicSignal: 'Fed fighting inflation - expect higher borrowing costs and potential economic slowdown',
          historicalContext: 'Aggressive rate hikes to combat inflation often lead to recessions (1980-82, 2001)'
        });
      }
    }

    // Pattern 5: Strong GDP + Low Unemployment + Moderate Inflation
    if (gdp && unrate && cpi) {
      const gdpStrong = gdp.trend === 'up' && (gdp.changePercent || 0) > 1;
      const unemploymentLow = (unrate.latestValue || 100) < 4.5;
      const inflationModerate = (cpi.changePercent || 0) < 3 && (cpi.changePercent || 0) > 1.5;

      if (gdpStrong && unemploymentLow && inflationModerate) {
        patterns.push({
          id: 'goldilocks-economy',
          title: '✅ "Goldilocks" Economic Conditions',
          description: 'Strong growth, low unemployment, and controlled inflation',
          indicators: ['GDPC1', 'UNRATE', 'CPIAUCSL'],
          confidence: 70,
          severity: 'low',
          type: 'positive',
          economicSignal: 'Ideal economic conditions - not too hot, not too cold',
          historicalContext: 'Sustainable when productivity growth supports wage gains without triggering inflation'
        });
      }
    }

    // Pattern 6: Rising Mortgage Rates + Falling Home Prices (proxy: economic slowdown)
    if (mortgage && gdp) {
      const mortgageHigh = (mortgage.latestValue || 0) > 6.5;
      const economicSlowing = gdp.trend === 'down' || gdp.trend === 'stable';

      if (mortgageHigh && economicSlowing) {
        patterns.push({
          id: 'housing-stress',
          title: '⚠️ Housing Market Stress',
          description: `Mortgage rates at ${(mortgage.latestValue || 0).toFixed(2)}% while economy slowing`,
          indicators: ['MORTGAGE30US', 'GDPC1'],
          confidence: 65,
          severity: 'medium',
          type: 'negative',
          economicSignal: 'Housing market cooling - affordability challenges and reduced activity',
          historicalContext: 'High mortgage rates typically slow housing market and can impact consumer spending'
        });
      }
    }

    // Pattern 7: Market Rally Despite Recession Signals
    if (sp500 && recession) {
      const marketUp = sp500.trend === 'up' && (sp500.changePercent || 0) > 5;
      const recessionSignal = (recession.latestValue || 0) > 0.3; // Recession probability > 30%

      if (marketUp && recessionSignal) {
        patterns.push({
          id: 'market-disconnect',
          title: '⚠️ Market-Economy Disconnect',
          description: 'Stock market rallying despite elevated recession risk',
          indicators: ['SP500', 'RECPROUSM156N'],
          confidence: 60,
          severity: 'medium',
          type: 'neutral',
          economicSignal: 'Markets may be pricing in future recovery or Fed pivot - increased volatility likely',
          historicalContext: 'Markets often bottom before recessions end, anticipating recovery'
        });
      }
    }

    // Pattern 8: Falling Interest Rates + Rising Stock Market
    if (fedfunds && sp500) {
      const ratesFalling = fedfunds.trend === 'down';
      const marketRising = sp500.trend === 'up';

      if (ratesFalling && marketRising) {
        patterns.push({
          id: 'rate-cut-rally',
          title: '✅ Rate Cut Market Rally',
          description: 'Declining interest rates supporting stock market gains',
          indicators: ['FEDFUNDS', 'SP500'],
          confidence: 75,
          severity: 'low',
          type: 'positive',
          economicSignal: 'Lower rates boost valuations and reduce borrowing costs - positive for equities',
          historicalContext: 'Rate cut cycles often support market rallies, though timing matters'
        });
      }
    }

    // Pattern 9: Leading Indicators Divergence
    if (payems && indpro && sp500) {
      const laborStrong = payems.trend === 'up';
      const productionWeak = indpro.trend === 'down';
      const marketVolatile = Math.abs(sp500.changePercent || 0) > 10;

      if (laborStrong && productionWeak) {
        patterns.push({
          id: 'mixed-signals',
          title: '⚠️ Mixed Economic Signals',
          description: 'Employment strong but industrial production weak',
          indicators: ['PAYEMS', 'INDPRO'],
          confidence: 55,
          severity: 'medium',
          type: 'neutral',
          economicSignal: 'Economy transitioning - could indicate shift from manufacturing to services',
          historicalContext: 'Diverging indicators suggest economic inflection point - monitor closely'
        });
      }
    }

    // Determine overall risk level based on patterns
    const criticalCount = patterns.filter(p => p.severity === 'critical').length;
    const highCount = patterns.filter(p => p.severity === 'high').length;
    const negativeCount = patterns.filter(p => p.type === 'negative').length;

    let overallRisk: 'low' | 'medium' | 'high' | 'critical';
    if (criticalCount > 0 || (highCount > 1 && negativeCount > 2)) {
      overallRisk = 'critical';
    } else if (highCount > 0 || negativeCount > 1) {
      overallRisk = 'high';
    } else if (patterns.length > 0 && negativeCount > 0) {
      overallRisk = 'medium';
    } else {
      overallRisk = 'low';
    }

    // Generate summary
    const summary = this.generateSummary(patterns, overallRisk);

    return {
      patterns,
      summary,
      overallRisk
    };
  }

  private generateSummary(patterns: CorrelationPattern[], risk: string): string {
    if (patterns.length === 0) {
      return 'No significant correlation patterns detected at this time. Economic indicators are showing independent trends.';
    }

    const positiveCount = patterns.filter(p => p.type === 'positive').length;
    const negativeCount = patterns.filter(p => p.type === 'negative').length;
    const neutralCount = patterns.filter(p => p.type === 'neutral').length;

    let summary = `Detected ${patterns.length} significant correlation pattern${patterns.length > 1 ? 's' : ''}. `;

    if (negativeCount > positiveCount) {
      summary += `Caution advised: ${negativeCount} concerning signal${negativeCount > 1 ? 's' : ''} detected. `;
    } else if (positiveCount > negativeCount) {
      summary += `Positive outlook: ${positiveCount} favorable signal${positiveCount > 1 ? 's' : ''} identified. `;
    } else {
      summary += 'Mixed signals present - ';
    }

    if (risk === 'critical') {
      summary += 'Overall economic risk level is CRITICAL. Close monitoring and defensive positioning recommended.';
    } else if (risk === 'high') {
      summary += 'Overall economic risk level is HIGH. Exercise caution and review your financial positions.';
    } else if (risk === 'medium') {
      summary += 'Overall economic risk level is MODERATE. Stay informed and maintain balanced approach.';
    } else {
      summary += 'Overall economic risk level is LOW. Conditions appear relatively stable.';
    }

    return summary;
  }
}
