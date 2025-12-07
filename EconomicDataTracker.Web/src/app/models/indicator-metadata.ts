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
    whatDrivesThis: string; // What factors cause this to change
    implications: {
      rising: string; // What it means when value goes up
      falling: string; // What it means when value goes down
    };
  };
  benchmarks: {
    preCovidAvg?: number; // Pre-COVID baseline (2019)
    historicalAvg?: number; // Long-term average
    recession?: number; // Typical recession level
    expansion?: number; // Typical expansion level
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
      goodRange: '3.5-5.0% is considered healthy full employment',
      whatDrivesThis: 'Job creation/losses, labor force participation, economic growth, business confidence, and seasonal factors',
      implications: {
        rising: 'Job losses, weakening economy, reduced consumer spending power, potential recession signal',
        falling: 'Job creation, economic expansion, increased consumer spending, but if too low may cause wage inflation'
      }
    },
    benchmarks: {
      preCovidAvg: 3.7,
      historicalAvg: 5.7,
      recession: 8.0,
      expansion: 4.0
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
      goodRange: 'Steady growth of 150,000+ jobs per month is healthy',
      whatDrivesThis: 'Business expansion/contraction, economic growth, consumer demand, productivity, and automation trends',
      implications: {
        rising: 'Job creation, economic growth, increased income and spending, tightening labor market',
        falling: 'Layoffs, business contraction, recession risk, reduced consumer spending power'
      }
    },
    benchmarks: {
      preCovidAvg: 152000,
      historicalAvg: 140000,
      recession: 130000,
      expansion: 160000
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
      goodRange: 'Fed targets around 2% annual increase',
      whatDrivesThis: 'Supply/demand balance, energy prices, wage growth, monetary policy, global supply chains',
      implications: {
        rising: 'Eroding purchasing power, potential Fed rate hikes, reduced consumer spending, higher cost of living',
        falling: 'Increased purchasing power, potential Fed rate cuts, but if too low may signal weak demand or deflation risk'
      }
    },
    benchmarks: {
      preCovidAvg: 252,
      historicalAvg: 230,
      recession: 240,
      expansion: 255
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
      goodRange: 'Moderate growth around 2% annually',
      whatDrivesThis: 'Raw material costs, energy prices, labor costs, global commodity prices, supply chain efficiency',
      implications: {
        rising: 'Producer cost pressures, likely future consumer price increases, margin compression for businesses',
        falling: 'Easing input costs, potential consumer price relief, improving business margins'
      }
    },
    benchmarks: {
      preCovidAvg: 195,
      historicalAvg: 180,
      recession: 185,
      expansion: 200
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
      goodRange: 'Growth of 2-3% annually is considered healthy',
      whatDrivesThis: 'Consumer spending, business investment, government spending, exports minus imports, productivity gains',
      implications: {
        rising: 'Economic expansion, job creation, business growth, rising incomes, increased tax revenues',
        falling: 'Economic contraction, potential recession, job losses, declining corporate profits'
      }
    },
    benchmarks: {
      preCovidAvg: 19000,
      historicalAvg: 17500,
      recession: 18000,
      expansion: 19500
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
      goodRange: 'Steady positive growth indicates expanding production',
      whatDrivesThis: 'Manufacturing demand, capacity utilization, new orders, inventory levels, export demand',
      implications: {
        rising: 'Strong manufacturing sector, business expansion, increased hiring, supply meeting demand',
        falling: 'Weak manufacturing, potential layoffs, reduced business investment, weakening economic activity'
      }
    },
    benchmarks: {
      preCovidAvg: 109,
      historicalAvg: 100,
      recession: 95,
      expansion: 110
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
      goodRange: 'Depends on economic conditions; higher to fight inflation, lower to boost growth',
      whatDrivesThis: 'Federal Reserve policy decisions based on inflation, unemployment, and economic growth targets',
      implications: {
        rising: 'Fed fighting inflation, higher borrowing costs, slowing economic activity, stronger dollar, potential housing market cooling',
        falling: 'Fed stimulating economy, lower borrowing costs, encouraging investment and spending, weaker dollar'
      }
    },
    benchmarks: {
      preCovidAvg: 1.75,
      historicalAvg: 3.5,
      recession: 0.25,
      expansion: 2.5
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
      goodRange: 'Varies with inflation expectations and economic conditions',
      whatDrivesThis: 'Inflation expectations, Fed policy, economic growth outlook, global demand for safe assets, government borrowing',
      implications: {
        rising: 'Higher borrowing costs, mortgage rates up, bond prices down, often signals economic growth or inflation fears',
        falling: 'Lower borrowing costs, mortgage rates down, bond prices up, often signals economic uncertainty or recession fears'
      }
    },
    benchmarks: {
      preCovidAvg: 2.0,
      historicalAvg: 4.5,
      recession: 1.5,
      expansion: 3.0
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
      goodRange: 'Steady long-term growth with moderate volatility',
      whatDrivesThis: 'Corporate earnings, economic growth, interest rates, investor sentiment, geopolitical events, Fed policy',
      implications: {
        rising: 'Strong investor confidence, positive economic outlook, wealth effect boosts spending, rising retirement accounts',
        falling: 'Investor uncertainty, economic concerns, potential recession fears, declining household wealth'
      }
    },
    benchmarks: {
      preCovidAvg: 3230,
      historicalAvg: 2500,
      recession: 2200,
      expansion: 3500
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
      goodRange: 'Below 20% is low risk; above 30% signals elevated recession risk',
      whatDrivesThis: 'Yield curve shape (spread between long and short-term rates), Fed policy, economic growth expectations',
      implications: {
        rising: 'Increased recession risk, inverted yield curve, potential economic slowdown ahead, flight to safety',
        falling: 'Lower recession risk, normal yield curve, positive economic outlook, investor confidence improving'
      }
    },
    benchmarks: {
      preCovidAvg: 5,
      historicalAvg: 15,
      recession: 60,
      expansion: 10
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
      goodRange: 'Below 4% historically favorable; above 7% significantly impacts affordability',
      whatDrivesThis: '10-year Treasury yields, Fed policy, inflation expectations, housing demand, lender risk assessments',
      implications: {
        rising: 'Reduced home affordability, slower housing market, fewer refinancings, potential price corrections',
        falling: 'Improved affordability, increased home buying, refinancing boom, potential housing price increases'
      }
    },
    benchmarks: {
      preCovidAvg: 3.9,
      historicalAvg: 6.0,
      recession: 3.5,
      expansion: 4.5
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
      goodRange: 'Steady growth indicates healthy consumer confidence',
      whatDrivesThis: 'Employment levels, wage growth, consumer confidence, credit availability, savings rates, wealth effects',
      implications: {
        rising: 'Strong consumer confidence, economic growth, business expansion, job creation, but may fuel inflation',
        falling: 'Weak consumer confidence, economic slowdown, potential recession, business contraction, deflation risk'
      }
    },
    benchmarks: {
      preCovidAvg: 14500,
      historicalAvg: 13000,
      recession: 13500,
      expansion: 15000
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
