import { Injectable } from '@angular/core';
import {
  UserProfile,
  ActionRecommendation,
  ActionPlan
} from '../models/action-recommendation.model';
import { EnrichedIndicator } from '../models/dashboard-summary.model';
import { CorrelationAnalysis } from '../models/correlation.model';

@Injectable({
  providedIn: 'root'
})
export class ActionRecommendationService {

  generateActionPlan(
    indicators: EnrichedIndicator[],
    correlations: CorrelationAnalysis,
    profile: UserProfile
  ): ActionPlan {
    const recommendations: ActionRecommendation[] = [];

    // Get specific indicators
    const getIndicator = (name: string) =>
      indicators.find(i => i.name === name);

    const unrate = getIndicator('UNRATE');
    const cpi = getIndicator('CPIAUCSL');
    const fedfunds = getIndicator('FEDFUNDS');
    const sp500 = getIndicator('SP500');
    const mortgage = getIndicator('MORTGAGE30US');
    const recession = getIndicator('RECPROUSM156N');
    const payems = getIndicator('PAYEMS');

    const recessionProb = recession?.latestValue || 0;
    const overallRisk = correlations.overallRisk;

    // === EMERGENCY FUND RECOMMENDATIONS ===

    // High recession risk - boost emergency fund
    if (recessionProb > 0.4 || overallRisk === 'critical' || overallRisk === 'high') {
      recommendations.push({
        id: 'emergency-fund-boost',
        category: 'emergency-fund',
        icon: '🛡️',
        title: 'Increase Emergency Fund',
        description: 'Build emergency savings to 6-12 months of expenses',
        priority: overallRisk === 'critical' ? 'critical' : 'high',
        timeframe: 'immediate',
        profiles: ['general', 'conservative-investor', 'homeowner', 'renter', 'job-seeker'],
        reasoning: `With recession probability at ${(recessionProb * 100).toFixed(0)}% and ${overallRisk} risk level, having robust emergency savings is crucial to weather potential job loss or income reduction.`,
        relevantIndicators: ['RECPROUSM156N', 'UNRATE']
      });
    } else if (recessionProb > 0.2) {
      recommendations.push({
        id: 'emergency-fund-maintain',
        category: 'emergency-fund',
        icon: '💰',
        title: 'Maintain 3-6 Month Emergency Fund',
        description: 'Ensure you have adequate liquid savings',
        priority: 'medium',
        timeframe: 'short-term',
        profiles: ['general', 'conservative-investor', 'aggressive-investor', 'homeowner', 'renter'],
        reasoning: `Economic uncertainty is moderate (${(recessionProb * 100).toFixed(0)}% recession risk). A standard emergency fund provides good protection.`,
        relevantIndicators: ['RECPROUSM156N']
      });
    }

    // === INVESTMENT RECOMMENDATIONS ===

    // Market volatility - conservative approach
    if (sp500 && Math.abs(sp500.changePercent || 0) > 15) {
      recommendations.push({
        id: 'market-volatility',
        category: 'investment',
        icon: '📊',
        title: 'High Market Volatility Detected',
        description: 'Consider dollar-cost averaging instead of lump-sum investing',
        priority: 'high',
        timeframe: 'immediate',
        profiles: ['conservative-investor', 'aggressive-investor', 'general'],
        reasoning: `S&P 500 has moved ${sp500.changePercent?.toFixed(1)}% - significant volatility. DCA reduces timing risk and emotional decision-making.`,
        relevantIndicators: ['SP500']
      });
    }

    // Market decline - buying opportunity
    if (sp500 && (sp500.changePercent || 0) < -10 && overallRisk !== 'critical') {
      recommendations.push({
        id: 'buying-opportunity',
        category: 'investment',
        icon: '💎',
        title: 'Potential Buying Opportunity',
        description: `S&P 500 down ${Math.abs(sp500.changePercent || 0).toFixed(1)}% - consider quality stocks at discount`,
        priority: 'medium',
        timeframe: 'short-term',
        profiles: ['aggressive-investor', 'conservative-investor'],
        reasoning: 'Market corrections create opportunities for long-term investors. Focus on quality companies with strong fundamentals and balance sheets.',
        relevantIndicators: ['SP500']
      });
    }

    // Rising rates - shift to bonds
    if (fedfunds && fedfunds.trend === 'up' && (fedfunds.latestValue || 0) > 4) {
      recommendations.push({
        id: 'bond-opportunity',
        category: 'investment',
        icon: '📈',
        title: 'Higher Bond Yields Available',
        description: `Fed Funds at ${fedfunds.latestValue?.toFixed(2)}% - bonds more attractive`,
        priority: 'medium',
        timeframe: 'short-term',
        profiles: ['conservative-investor', 'general'],
        reasoning: 'Higher interest rates make fixed income investments more attractive. Consider laddering bonds or CDs for guaranteed returns.',
        relevantIndicators: ['FEDFUNDS']
      });
    }

    // Critical risk - defensive positioning
    if (overallRisk === 'critical') {
      recommendations.push({
        id: 'defensive-position',
        category: 'investment',
        icon: '🛡️',
        title: 'Consider Defensive Positioning',
        description: 'Shift toward defensive sectors, cash, and high-quality bonds',
        priority: 'critical',
        timeframe: 'immediate',
        profiles: ['conservative-investor', 'aggressive-investor', 'general'],
        reasoning: 'Multiple recession signals detected. Defensive assets (utilities, consumer staples, healthcare) and cash positions help preserve capital during downturns.',
        relevantIndicators: ['RECPROUSM156N', 'SP500']
      });
    }

    // === REAL ESTATE RECOMMENDATIONS ===

    // High mortgage rates
    if (mortgage && (mortgage.latestValue || 0) > 6.5) {
      recommendations.push({
        id: 'mortgage-high',
        category: 'real-estate',
        icon: '🏠',
        title: 'Mortgage Rates Elevated',
        description: `30-year rates at ${mortgage.latestValue?.toFixed(2)}% - consider waiting or adjustable rate`,
        priority: 'high',
        timeframe: 'medium-term',
        profiles: ['renter', 'homeowner'],
        reasoning: 'High mortgage rates significantly impact affordability. If buying is urgent, consider ARM or wait for potential rate decreases. Current homeowners: avoid cash-out refinancing unless necessary.',
        relevantIndicators: ['MORTGAGE30US']
      });
    }

    // Falling mortgage rates
    if (mortgage && mortgage.trend === 'down' && (mortgage.latestValue || 0) < 6) {
      recommendations.push({
        id: 'mortgage-refinance',
        category: 'real-estate',
        icon: '🏡',
        title: 'Refinancing Opportunity',
        description: `Mortgage rates trending down to ${mortgage.latestValue?.toFixed(2)}%`,
        priority: 'medium',
        timeframe: 'short-term',
        profiles: ['homeowner'],
        reasoning: 'Declining rates create refinancing opportunities. Check if you can lower your rate by 0.5%+ to justify closing costs.',
        relevantIndicators: ['MORTGAGE30US']
      });
    }

    // Recession + housing market
    if (recessionProb > 0.4 && mortgage && (mortgage.latestValue || 0) > 6) {
      recommendations.push({
        id: 'housing-wait',
        category: 'real-estate',
        icon: '⏳',
        title: 'Consider Delaying Home Purchase',
        description: 'High rates + recession risk may lead to price corrections',
        priority: 'medium',
        timeframe: 'medium-term',
        profiles: ['renter'],
        reasoning: `Recession probability at ${(recessionProb * 100).toFixed(0)}% combined with ${mortgage.latestValue?.toFixed(2)}% mortgage rates suggests potential for both price and rate decreases ahead.`,
        relevantIndicators: ['MORTGAGE30US', 'RECPROUSM156N']
      });
    }

    // === EMPLOYMENT RECOMMENDATIONS ===

    // Rising unemployment
    if (unrate && unrate.trend === 'up') {
      recommendations.push({
        id: 'employment-security',
        category: 'employment',
        icon: '💼',
        title: 'Strengthen Job Security',
        description: 'Update skills, network, and maintain strong work performance',
        priority: 'high',
        timeframe: 'immediate',
        profiles: ['general', 'job-seeker'],
        reasoning: `Unemployment trending up to ${unrate.latestValue?.toFixed(1)}%. Proactively strengthen your position: document achievements, expand skills, build professional network.`,
        relevantIndicators: ['UNRATE']
      });
    }

    // Declining payrolls
    if (payems && payems.trend === 'down') {
      recommendations.push({
        id: 'job-market-caution',
        category: 'employment',
        icon: '⚠️',
        title: 'Job Market Cooling',
        description: 'Hiring slowing - be cautious about job changes',
        priority: 'medium',
        timeframe: 'immediate',
        profiles: ['general', 'job-seeker'],
        reasoning: 'Payroll growth declining suggests fewer job opportunities. If employed, focus on job security. If job hunting, be prepared for longer search times.',
        relevantIndicators: ['PAYEMS']
      });
    }

    // Strong job market
    if (payems && payems.trend === 'up' && unrate && (unrate.latestValue || 100) < 4) {
      recommendations.push({
        id: 'job-opportunity',
        category: 'employment',
        icon: '🎯',
        title: 'Strong Job Market',
        description: 'Good time for career advancement or job change',
        priority: 'low',
        timeframe: 'short-term',
        profiles: ['general', 'job-seeker'],
        reasoning: `Low unemployment (${unrate.latestValue?.toFixed(1)}%) and growing payrolls indicate strong labor demand. Workers have negotiating power for better positions and wages.`,
        relevantIndicators: ['UNRATE', 'PAYEMS']
      });
    }

    // === SPENDING RECOMMENDATIONS ===

    // High inflation
    if (cpi && (cpi.changePercent || 0) > 3) {
      recommendations.push({
        id: 'inflation-spending',
        category: 'spending',
        icon: '💳',
        title: 'Combat Inflation Impact',
        description: 'Review budget, focus on necessities, consider inflation-protected assets',
        priority: 'high',
        timeframe: 'immediate',
        profiles: ['general', 'conservative-investor', 'renter', 'homeowner'],
        reasoning: `Inflation at ${cpi.changePercent?.toFixed(1)}% erodes purchasing power. Review discretionary spending, shop strategically, consider I-Bonds or TIPS.`,
        relevantIndicators: ['CPIAUCSL']
      });
    }

    // Rising rates + high debt
    if (fedfunds && fedfunds.trend === 'up') {
      recommendations.push({
        id: 'debt-paydown',
        category: 'debt',
        icon: '💰',
        title: 'Pay Down Variable-Rate Debt',
        description: 'Focus on credit cards and variable loans as rates rise',
        priority: 'high',
        timeframe: 'immediate',
        profiles: ['general', 'homeowner', 'renter', 'business-owner'],
        reasoning: `Fed raising rates to ${fedfunds.latestValue?.toFixed(2)}% increases cost of variable-rate debt. Prioritize paying down credit cards, HELOCs, and variable-rate loans.`,
        relevantIndicators: ['FEDFUNDS']
      });
    }

    // Recession preparation
    if (recessionProb > 0.5) {
      recommendations.push({
        id: 'recession-preparation',
        category: 'spending',
        icon: '📉',
        title: 'Prepare for Economic Downturn',
        description: 'Reduce discretionary spending, delay major purchases',
        priority: 'critical',
        timeframe: 'immediate',
        profiles: ['general', 'homeowner', 'renter', 'business-owner'],
        reasoning: `Recession probability at ${(recessionProb * 100).toFixed(0)}%. Conserve cash, defer non-essential purchases, prepare for potential income disruption.`,
        relevantIndicators: ['RECPROUSM156N']
      });
    }

    // === BUSINESS OWNER SPECIFIC ===

    // Economic slowdown
    if (recessionProb > 0.3 || overallRisk === 'high' || overallRisk === 'critical') {
      recommendations.push({
        id: 'business-cash-flow',
        category: 'spending',
        icon: '🏢',
        title: 'Strengthen Business Cash Position',
        description: 'Build cash reserves, review expenses, secure credit lines',
        priority: overallRisk === 'critical' ? 'critical' : 'high',
        timeframe: 'immediate',
        profiles: ['business-owner'],
        reasoning: 'Economic uncertainty ahead. Businesses should increase cash reserves, defer non-critical investments, and secure credit lines before conditions tighten.',
        relevantIndicators: ['RECPROUSM156N', 'FEDFUNDS']
      });
    }

    // Filter recommendations by profile
    const filteredRecommendations = recommendations
      .filter(r => r.profiles.includes(profile) || r.profiles.includes('general'))
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    // Generate summary and outlook
    const summary = this.generateSummary(filteredRecommendations, overallRisk);
    const economicOutlook = this.generateOutlook(indicators, correlations, recessionProb);

    return {
      profile,
      recommendations: filteredRecommendations,
      summary,
      economicOutlook
    };
  }

  private generateSummary(recommendations: ActionRecommendation[], risk: string): string {
    const criticalCount = recommendations.filter(r => r.priority === 'critical').length;
    const highCount = recommendations.filter(r => r.priority === 'high').length;

    if (criticalCount > 0) {
      return `🚨 ${criticalCount} critical action${criticalCount > 1 ? 's' : ''} recommended. Immediate attention required to protect your financial position.`;
    } else if (highCount > 0) {
      return `⚠️ ${highCount} high-priority action${highCount > 1 ? 's' : ''} suggested based on current economic conditions.`;
    } else if (recommendations.length > 0) {
      return `✓ ${recommendations.length} recommendation${recommendations.length > 1 ? 's' : ''} to optimize your financial position.`;
    } else {
      return '✓ No urgent actions required. Continue monitoring economic conditions.';
    }
  }

  private generateOutlook(
    indicators: EnrichedIndicator[],
    correlations: CorrelationAnalysis,
    recessionProb: number
  ): string {
    const risk = correlations.overallRisk;

    if (risk === 'critical') {
      return `Economic outlook is concerning with ${(recessionProb * 100).toFixed(0)}% recession probability. Multiple warning signals detected. Focus on capital preservation and risk management.`;
    } else if (risk === 'high') {
      return `Economic conditions show elevated risk (${(recessionProb * 100).toFixed(0)}% recession probability). Exercise caution with major financial decisions and maintain strong cash positions.`;
    } else if (risk === 'medium') {
      return `Economic outlook is mixed with moderate uncertainty. Stay informed and maintain a balanced, diversified approach to finances.`;
    } else {
      return `Economic conditions appear relatively stable with ${(recessionProb * 100).toFixed(0)}% recession probability. Good time for planned financial moves with appropriate risk management.`;
    }
  }
}
