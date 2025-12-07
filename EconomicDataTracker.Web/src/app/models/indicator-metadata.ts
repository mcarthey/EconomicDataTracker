export interface IndicatorMetadata {
  seriesId: string;
  category: IndicatorCategory;
  priority: number; // 1 = highest priority
  displayOrder: number;
  interpretation: {
    goodDirection: 'up' | 'down'; // Is rising good or bad?
    targetRange?: { min: number; max: number };
    optimalValue?: number;
  };
  context: {
    whatItMeans: string;
    whyItMatters: string;
    goodRange: string;
  };
  formatting: {
    suffix?: string; // %, $B, etc.
    decimals: number;
    isCurrency?: boolean;
  };
}

export enum IndicatorCategory {
  Employment = 'employment',
  Inflation = 'inflation',
  Growth = 'growth',
  Markets = 'markets',
  Housing = 'housing',
  Consumer = 'consumer'
}

export interface CategoryInfo {
  id: IndicatorCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const CATEGORY_INFO: Record<IndicatorCategory, CategoryInfo> = {
  [IndicatorCategory.Employment]: {
    id: IndicatorCategory.Employment,
    name: 'Employment & Labor',
    icon: '💼',
    description: 'Job market health and workforce participation',
    color: '#667eea'
  },
  [IndicatorCategory.Inflation]: {
    id: IndicatorCategory.Inflation,
    name: 'Inflation & Prices',
    icon: '💵',
    description: 'Price levels and purchasing power',
    color: '#f093fb'
  },
  [IndicatorCategory.Growth]: {
    id: IndicatorCategory.Growth,
    name: 'Economic Growth',
    icon: '📈',
    description: 'Overall economic output and activity',
    color: '#43e97b'
  },
  [IndicatorCategory.Markets]: {
    id: IndicatorCategory.Markets,
    name: 'Markets & Rates',
    icon: '💰',
    description: 'Financial markets and interest rates',
    color: '#4facfe'
  },
  [IndicatorCategory.Housing]: {
    id: IndicatorCategory.Housing,
    name: 'Housing Market',
    icon: '🏠',
    description: 'Real estate prices and mortgage rates',
    color: '#fa709a'
  },
  [IndicatorCategory.Consumer]: {
    id: IndicatorCategory.Consumer,
    name: 'Consumer Health',
    icon: '🛒',
    description: 'Consumer spending and sentiment',
    color: '#fee140'
  }
};

export const INDICATOR_METADATA: Record<string, IndicatorMetadata> = {
  // EMPLOYMENT & LABOR
  'UNRATE': {
    seriesId: 'UNRATE',
    category: IndicatorCategory.Employment,
    priority: 1,
    displayOrder: 1,
    interpretation: {
      goodDirection: 'down',
      targetRange: { min: 3.5, max: 5.0 }
    },
    context: {
      whatItMeans: 'Percentage of people actively looking for work who cannot find jobs',
      whyItMatters: 'Low unemployment indicates a strong job market and healthy economy',
      goodRange: '3.5-5.0% is considered healthy full employment'
    },
    formatting: {
      suffix: '%',
      decimals: 1
    }
  },
  'PAYEMS': {
    seriesId: 'PAYEMS',
    category: IndicatorCategory.Employment,
    priority: 2,
    displayOrder: 2,
    interpretation: {
      goodDirection: 'up'
    },
    context: {
      whatItMeans: 'Total number of employees on nonfarm payrolls (in thousands)',
      whyItMatters: 'Rising payrolls indicate job creation and economic expansion',
      goodRange: 'Steady growth of 150,000+ jobs per month is healthy'
    },
    formatting: {
      suffix: 'K',
      decimals: 0
    }
  },

  // INFLATION & PRICES
  'CPIAUCSL': {
    seriesId: 'CPIAUCSL',
    category: IndicatorCategory.Inflation,
    priority: 1,
    displayOrder: 1,
    interpretation: {
      goodDirection: 'down', // Lower inflation is generally better
      targetRange: { min: 1.5, max: 2.5 } // Fed targets ~2%
    },
    context: {
      whatItMeans: 'Measures average change in prices paid by urban consumers for goods and services',
      whyItMatters: 'High inflation erodes purchasing power; too low can signal weak demand',
      goodRange: 'Fed targets around 2% annual increase'
    },
    formatting: {
      decimals: 2
    }
  },
  'PPIACO': {
    seriesId: 'PPIACO',
    category: IndicatorCategory.Inflation,
    priority: 3,
    displayOrder: 2,
    interpretation: {
      goodDirection: 'down'
    },
    context: {
      whatItMeans: 'Measures average change in prices received by domestic producers',
      whyItMatters: 'Leading indicator for consumer inflation; shows upstream price pressures',
      goodRange: 'Moderate growth around 2% annually'
    },
    formatting: {
      decimals: 2
    }
  },

  // ECONOMIC GROWTH
  'GDPC1': {
    seriesId: 'GDPC1',
    category: IndicatorCategory.Growth,
    priority: 1,
    displayOrder: 1,
    interpretation: {
      goodDirection: 'up'
    },
    context: {
      whatItMeans: 'Total value of all goods and services produced, adjusted for inflation',
      whyItMatters: 'The primary measure of economic growth and overall economic health',
      goodRange: 'Growth of 2-3% annually is considered healthy'
    },
    formatting: {
      suffix: 'B',
      decimals: 2,
      isCurrency: true
    }
  },
  'INDPRO': {
    seriesId: 'INDPRO',
    category: IndicatorCategory.Growth,
    priority: 2,
    displayOrder: 2,
    interpretation: {
      goodDirection: 'up'
    },
    context: {
      whatItMeans: 'Measures output of manufacturing, mining, and utilities sectors',
      whyItMatters: 'Key indicator of industrial sector health and economic activity',
      goodRange: 'Steady positive growth indicates expanding production'
    },
    formatting: {
      decimals: 2
    }
  },

  // MARKETS & RATES
  'FEDFUNDS': {
    seriesId: 'FEDFUNDS',
    category: IndicatorCategory.Markets,
    priority: 1,
    displayOrder: 1,
    interpretation: {
      goodDirection: 'down' // Lower rates = easier borrowing, but context dependent
    },
    context: {
      whatItMeans: 'Interest rate at which banks lend to each other overnight',
      whyItMatters: 'Fed uses this to control inflation and stimulate/cool the economy',
      goodRange: 'Depends on economic conditions; higher to fight inflation, lower to boost growth'
    },
    formatting: {
      suffix: '%',
      decimals: 2
    }
  },
  'GS10': {
    seriesId: 'GS10',
    category: IndicatorCategory.Markets,
    priority: 2,
    displayOrder: 2,
    interpretation: {
      goodDirection: 'down' // Context dependent
    },
    context: {
      whatItMeans: 'Yield on 10-year U.S. Treasury bonds',
      whyItMatters: 'Benchmark for mortgage rates and corporate borrowing; reflects economic expectations',
      goodRange: 'Varies with inflation expectations and economic conditions'
    },
    formatting: {
      suffix: '%',
      decimals: 2
    }
  },
  'SP500': {
    seriesId: 'SP500',
    category: IndicatorCategory.Markets,
    priority: 1,
    displayOrder: 3,
    interpretation: {
      goodDirection: 'up'
    },
    context: {
      whatItMeans: 'Stock market index of 500 largest U.S. public companies',
      whyItMatters: 'Reflects investor confidence and corporate profitability',
      goodRange: 'Steady long-term growth with moderate volatility'
    },
    formatting: {
      decimals: 2
    }
  },
  'RECPROUSM156N': {
    seriesId: 'RECPROUSM156N',
    category: IndicatorCategory.Markets,
    priority: 2,
    displayOrder: 4,
    interpretation: {
      goodDirection: 'down'
    },
    context: {
      whatItMeans: 'Probability that U.S. economy is in recession based on yield curve',
      whyItMatters: 'Early warning indicator for potential economic downturns',
      goodRange: 'Below 20% is low risk; above 30% signals elevated recession risk'
    },
    formatting: {
      suffix: '%',
      decimals: 1
    }
  },

  // HOUSING MARKET
  'MORTGAGE30US': {
    seriesId: 'MORTGAGE30US',
    category: IndicatorCategory.Housing,
    priority: 1,
    displayOrder: 1,
    interpretation: {
      goodDirection: 'down'
    },
    context: {
      whatItMeans: 'Average interest rate on 30-year fixed-rate mortgages',
      whyItMatters: 'Directly impacts home affordability and housing market activity',
      goodRange: 'Below 4% historically favorable; above 7% significantly impacts affordability'
    },
    formatting: {
      suffix: '%',
      decimals: 2
    }
  },

  // CONSUMER HEALTH
  'PCE': {
    seriesId: 'PCE',
    category: IndicatorCategory.Consumer,
    priority: 1,
    displayOrder: 1,
    interpretation: {
      goodDirection: 'up'
    },
    context: {
      whatItMeans: 'Total spending by consumers on goods and services',
      whyItMatters: 'Consumer spending drives ~70% of U.S. economy; key growth indicator',
      goodRange: 'Steady growth indicates healthy consumer confidence'
    },
    formatting: {
      suffix: 'B',
      decimals: 2,
      isCurrency: true
    }
  }
};

export function getIndicatorMetadata(seriesId: string): IndicatorMetadata | undefined {
  return INDICATOR_METADATA[seriesId];
}

export function getIndicatorsByCategory(): Map<IndicatorCategory, IndicatorMetadata[]> {
  const categoryMap = new Map<IndicatorCategory, IndicatorMetadata[]>();

  Object.values(INDICATOR_METADATA).forEach(metadata => {
    if (!categoryMap.has(metadata.category)) {
      categoryMap.set(metadata.category, []);
    }
    categoryMap.get(metadata.category)!.push(metadata);
  });

  // Sort by display order within each category
  categoryMap.forEach((indicators) => {
    indicators.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  return categoryMap;
}
