import axios from 'axios';

const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';
const API_KEY = process.env.FMP_API_KEY;

// Create axios instance with default config
const fmpClient = axios.create({
  baseURL: FMP_BASE_URL,
  params: {
    apikey: API_KEY
  }
});

// Company financial statements
export async function getFinancialStatements(
  symbol: string,
  statement: 'income-statement' | 'balance-sheet-statement' | 'cash-flow-statement',
  period: 'annual' | 'quarter' = 'annual',
  limit: number = 5
): Promise<any[]> {
  try {
    const response = await fmpClient.get(`/${statement}/${symbol}`, {
      params: {
        limit,
        period
      }
    });
    return response.data;
  } catch (error) {
    console.error(`FMP ${statement} error:`, error);
    return [];
  }
}

// Get all financial statements at once
export async function getAllFinancialStatements(
  symbol: string,
  period: 'annual' | 'quarter' = 'annual',
  limit: number = 5
): Promise<{
  incomeStatements: any[];
  balanceSheets: any[];
  cashFlowStatements: any[];
}> {
  const [incomeStatements, balanceSheets, cashFlowStatements] = await Promise.all([
    getFinancialStatements(symbol, 'income-statement', period, limit),
    getFinancialStatements(symbol, 'balance-sheet-statement', period, limit),
    getFinancialStatements(symbol, 'cash-flow-statement', period, limit)
  ]);

  return {
    incomeStatements,
    balanceSheets,
    cashFlowStatements
  };
}

// Financial ratios
export async function getFinancialRatios(
  symbol: string,
  period: 'annual' | 'quarter' = 'annual',
  limit: number = 5
): Promise<any[]> {
  try {
    const response = await fmpClient.get(`/ratios/${symbol}`, {
      params: {
        limit,
        period
      }
    });
    return response.data;
  } catch (error) {
    console.error('FMP ratios error:', error);
    return [];
  }
}

// Key metrics
export async function getKeyMetrics(
  symbol: string,
  period: 'annual' | 'quarter' = 'annual',
  limit: number = 5
): Promise<any[]> {
  try {
    const response = await fmpClient.get(`/key-metrics/${symbol}`, {
      params: {
        limit,
        period
      }
    });
    return response.data;
  } catch (error) {
    console.error('FMP key metrics error:', error);
    return [];
  }
}

// Company profile
export async function getCompanyProfile(symbol: string): Promise<any> {
  try {
    const response = await fmpClient.get(`/profile/${symbol}`);
    return response.data[0] || null;
  } catch (error) {
    console.error('FMP company profile error:', error);
    return null;
  }
}

// Industry sector performance
export async function getSectorPerformance(): Promise<any[]> {
  try {
    const response = await fmpClient.get('/sectors-performance');
    return response.data;
  } catch (error) {
    console.error('FMP sector performance error:', error);
    return [];
  }
}

// Industry average metrics
export async function getIndustryAverageMetrics(
  industry: string,
  metric: string
): Promise<number | null> {
  try {
    const response = await fmpClient.get('/industry-average', {
      params: {
        industry,
        metric
      }
    });
    return response.data.average || null;
  } catch (error) {
    console.error('FMP industry average error:', error);
    return null;
  }
}

// Peer companies
export async function getPeerCompanies(symbol: string): Promise<string[]> {
  try {
    const response = await fmpClient.get(`/stock_peers`, {
      params: {
        symbol
      }
    });
    return response.data[0]?.peersList || [];
  } catch (error) {
    console.error('FMP peer companies error:', error);
    return [];
  }
}

// Financial growth
export async function getFinancialGrowth(
  symbol: string,
  period: 'annual' | 'quarter' = 'annual',
  limit: number = 5
): Promise<any[]> {
  try {
    const response = await fmpClient.get(`/financial-growth/${symbol}`, {
      params: {
        limit,
        period
      }
    });
    return response.data;
  } catch (error) {
    console.error('FMP financial growth error:', error);
    return [];
  }
}

// Enterprise value
export async function getEnterpriseValue(
  symbol: string,
  period: 'annual' | 'quarter' = 'annual',
  limit: number = 5
): Promise<any[]> {
  try {
    const response = await fmpClient.get(`/enterprise-values/${symbol}`, {
      params: {
        limit,
        period
      }
    });
    return response.data;
  } catch (error) {
    console.error('FMP enterprise value error:', error);
    return [];
  }
}

// DCF valuation
export async function getDCFValuation(symbol: string): Promise<any> {
  try {
    const response = await fmpClient.get(`/discounted-cash-flow/${symbol}`);
    return response.data[0] || null;
  } catch (error) {
    console.error('FMP DCF valuation error:', error);
    return null;
  }
}

// Historical stock price
export async function getHistoricalPrice(
  symbol: string,
  from?: string,
  to?: string
): Promise<any[]> {
  try {
    const response = await fmpClient.get(`/historical-price-full/${symbol}`, {
      params: {
        from,
        to
      }
    });
    return response.data.historical || [];
  } catch (error) {
    console.error('FMP historical price error:', error);
    return [];
  }
}

// Market capitalization
export async function getMarketCap(symbol: string): Promise<number | null> {
  try {
    const response = await fmpClient.get(`/market-capitalization/${symbol}`);
    return response.data[0]?.marketCap || null;
  } catch (error) {
    console.error('FMP market cap error:', error);
    return null;
  }
}

// Financial statement analysis
export async function analyzeFinancialStatements(
  symbol: string,
  years: number = 5
): Promise<any> {
  try {
    const [statements, ratios, keyMetrics, growth] = await Promise.all([
      getAllFinancialStatements(symbol, 'annual', years),
      getFinancialRatios(symbol, 'annual', years),
      getKeyMetrics(symbol, 'annual', years),
      getFinancialGrowth(symbol, 'annual', years)
    ]);

    return {
      statements,
      ratios,
      keyMetrics,
      growth,
      symbol
    };
  } catch (error) {
    console.error('FMP analysis error:', error);
    throw error;
  }
}

// Compare companies
export async function compareCompanies(
  symbols: string[],
  metrics: string[] = ['pe', 'priceToBook', 'debtToEquity', 'roe', 'roa']
): Promise<any> {
  try {
    const comparisons = await Promise.all(
      symbols.map(async (symbol) => {
        const [profile, ratios, keyMetrics] = await Promise.all([
          getCompanyProfile(symbol),
          getFinancialRatios(symbol, 'annual', 1),
          getKeyMetrics(symbol, 'annual', 1)
        ]);

        return {
          symbol,
          profile,
          metrics: {
            ...ratios[0],
            ...keyMetrics[0]
          }
        };
      })
    );

    return comparisons;
  } catch (error) {
    console.error('FMP company comparison error:', error);
    throw error;
  }
}

// Get industry benchmarks
export async function getIndustryBenchmarks(
  sector: string,
  industry: string
): Promise<any> {
  try {
    // Get list of companies in the industry
    const searchResponse = await fmpClient.get('/stock-screener', {
      params: {
        sector,
        industry,
        limit: 100
      }
    });

    const companies = searchResponse.data || [];
    
    if (companies.length === 0) {
      return null;
    }

    // Get metrics for all companies
    const metricsPromises = companies.map((company: any) => 
      getFinancialRatios(company.symbol, 'annual', 1)
    );

    const allMetrics = await Promise.all(metricsPromises);
    
    // Calculate industry averages
    const benchmarks: any = {};
    const metricKeys = Object.keys(allMetrics[0]?.[0] || {});

    metricKeys.forEach(key => {
      if (typeof allMetrics[0][0][key] === 'number') {
        const values = allMetrics
          .map(m => m[0]?.[key])
          .filter(v => v !== null && v !== undefined && !isNaN(v));
        
        if (values.length > 0) {
          benchmarks[key] = {
            average: values.reduce((a, b) => a + b, 0) / values.length,
            median: calculateMedian(values),
            min: Math.min(...values),
            max: Math.max(...values),
            count: values.length
          };
        }
      }
    });

    return {
      sector,
      industry,
      companiesAnalyzed: companies.length,
      benchmarks
    };
  } catch (error) {
    console.error('FMP industry benchmarks error:', error);
    return null;
  }
}

// Helper function to calculate median
function calculateMedian(values: number[]): number {
  const sorted = values.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
}

// Search companies
export async function searchCompanies(query: string): Promise<any[]> {
  try {
    const response = await fmpClient.get('/search', {
      params: {
        query,
        limit: 10
      }
    });
    return response.data;
  } catch (error) {
    console.error('FMP search error:', error);
    return [];
  }
}

// Get economic indicators
export async function getEconomicIndicators(
  indicator: string = 'GDP'
): Promise<any[]> {
  try {
    const response = await fmpClient.get(`/economic`, {
      params: {
        name: indicator
      }
    });
    return response.data;
  } catch (error) {
    console.error('FMP economic indicators error:', error);
    return [];
  }
}
