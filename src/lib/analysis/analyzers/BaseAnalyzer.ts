import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';

export abstract class BaseAnalyzer {
  /**
   * Main analysis method that each analyzer must implement
   */
  abstract analyze(
    financialData: FinancialStatement[], 
    companyData: Company, 
    marketData?: any, 
    benchmarkData?: any
  ): Promise<AnalysisResult[]>;

  /**
   * Create a standardized error result
   */
  protected createErrorResult(id: string, name: string): AnalysisResult {
    return {
      id,
      name,
      category: 'error',
      type: 'error',
      currentValue: 0,
      rating: 'poor',
      interpretation: 'خطأ في حساب التحليل',
      calculation: { 
        formula: 'غير متاح', 
        variables: {} 
      },
      insights: ['خطأ في حساب التحليل'],
      recommendations: ['مراجعة البيانات المدخلة'],
      status: 'error'
    };
  }

  /**
   * Format currency values
   */
  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Format percentage values
   */
  protected formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  /**
   * Format ratio values
   */
  protected formatRatio(value: number): string {
    return value.toFixed(2);
  }

  /**
   * Calculate percentage change between two values
   */
  protected calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  }

  /**
   * Calculate CAGR (Compound Annual Growth Rate)
   */
  protected calculateCAGR(beginningValue: number, endingValue: number, years: number): number {
    if (beginningValue === 0 || years === 0) return 0;
    return Math.pow(endingValue / beginningValue, 1 / years) - 1;
  }

  /**
   * Calculate average of an array of numbers
   */
  protected calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  /**
   * Calculate median of an array of numbers
   */
  protected calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[middle - 1] + sorted[middle]) / 2 
      : sorted[middle];
  }

  /**
   * Calculate standard deviation
   */
  protected calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = this.calculateAverage(values);
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = this.calculateAverage(squaredDiffs);
    return Math.sqrt(avgSquaredDiff);
  }

  /**
   * Calculate correlation coefficient between two arrays
   */
  protected calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length < 2) return 0;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumYY = y.reduce((acc, yi) => acc + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Get industry benchmark data
   */
  protected getIndustryBenchmark(metric: string, benchmarkData?: any): any {
    if (!benchmarkData || !benchmarkData[metric]) return null;
    
    return {
      value: benchmarkData[metric].average,
      source: 'معايير الصناعة',
      period: 'السنة الحالية',
      percentile: benchmarkData[metric].percentile || 50
    };
  }

  /**
   * Get competitor analysis data
   */
  protected getCompetitorAnalysis(metric: string, value: number, benchmarkData?: any): any {
    if (!benchmarkData || !benchmarkData[metric]) return null;
    
    const competitors = benchmarkData[metric].competitors || [];
    const ranking = competitors.filter((c: any) => c.value < value).length + 1;
    
    return {
      competitors,
      ranking,
      averageCompetitorValue: this.calculateAverage(competitors.map((c: any) => c.value)),
      position: ranking <= competitors.length / 4 ? 'متفوق' : 
                ranking <= competitors.length / 2 ? 'متوسط' : 'أقل من المتوسط'
    };
  }

  /**
   * Generate insights based on value and thresholds
   */
  protected generateInsights(
    value: number, 
    thresholds: { excellent: number; good: number; average: number },
    insights: { excellent: string; good: string; average: string; poor: string }
  ): string[] {
    const result: string[] = [];
    
    if (value >= thresholds.excellent) {
      result.push(insights.excellent);
    } else if (value >= thresholds.good) {
      result.push(insights.good);
    } else if (value >= thresholds.average) {
      result.push(insights.average);
    } else {
      result.push(insights.poor);
    }
    
    return result.filter(Boolean);
  }

  /**
   * Generate recommendations based on value and thresholds
   */
  protected generateRecommendations(
    value: number, 
    thresholds: { excellent: number; good: number; average: number },
    recommendations: { excellent: string; good: string; average: string; poor: string }
  ): string[] {
    const result: string[] = [];
    
    if (value >= thresholds.excellent) {
      result.push(recommendations.excellent);
    } else if (value >= thresholds.good) {
      result.push(recommendations.good);
    } else if (value >= thresholds.average) {
      result.push(recommendations.average);
    } else {
      result.push(recommendations.poor);
    }
    
    return result.filter(Boolean);
  }

  /**
   * Calculate trend analysis
   */
  protected calculateTrend(values: number[]): {
    direction: 'up' | 'down' | 'stable';
    slope: number;
    rSquared: number;
  } {
    if (values.length < 2) {
      return { direction: 'stable', slope: 0, rSquared: 0 };
    }
    
    const n = values.length;
    const x = Array.from({length: n}, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * values[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumYY = values.reduce((acc, yi) => acc + yi * yi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const meanY = sumY / n;
    const ssRes = values.reduce((acc, yi, i) => acc + Math.pow(yi - (slope * i + (sumY - slope * sumX) / n), 2), 0);
    const ssTot = values.reduce((acc, yi) => acc + Math.pow(yi - meanY, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);
    
    let direction: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(slope) > 0.1) {
      direction = slope > 0 ? 'up' : 'down';
    }
    
    return { direction, slope, rSquared };
  }

  /**
   * Calculate volatility (standard deviation of returns)
   */
  protected calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    
    const returns = [];
    for (let i = 1; i < values.length; i++) {
      if (values[i-1] !== 0) {
        returns.push((values[i] - values[i-1]) / values[i-1]);
      }
    }
    
    return this.calculateStandardDeviation(returns);
  }

  /**
   * Calculate Sharpe ratio
   */
  protected calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.03): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = this.calculateAverage(returns);
    const volatility = this.calculateStandardDeviation(returns);
    
    return volatility === 0 ? 0 : (avgReturn - riskFreeRate) / volatility;
  }

  /**
   * Calculate Value at Risk (VaR)
   */
  protected calculateVaR(returns: number[], confidenceLevel: number = 0.05): number {
    if (returns.length === 0) return 0;
    
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor(confidenceLevel * sortedReturns.length);
    
    return sortedReturns[index] || 0;
  }

  /**
   * Calculate beta coefficient
   */
  protected calculateBeta(assetReturns: number[], marketReturns: number[]): number {
    if (assetReturns.length !== marketReturns.length || assetReturns.length < 2) return 1;
    
    const covariance = this.calculateCovariance(assetReturns, marketReturns);
    const marketVariance = this.calculateVariance(marketReturns);
    
    return marketVariance === 0 ? 1 : covariance / marketVariance;
  }

  /**
   * Calculate covariance between two arrays
   */
  protected calculateCovariance(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length < 2) return 0;
    
    const meanX = this.calculateAverage(x);
    const meanY = this.calculateAverage(y);
    
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
      sum += (x[i] - meanX) * (y[i] - meanY);
    }
    
    return sum / (x.length - 1);
  }

  /**
   * Calculate variance of an array
   */
  protected calculateVariance(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = this.calculateAverage(values);
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    
    return this.calculateAverage(squaredDiffs);
  }

  /**
   * Validate financial statement data
   */
  protected validateFinancialStatement(statement: FinancialStatement): boolean {
    if (!statement.balanceSheet || !statement.incomeStatement) return false;
    
    const { balanceSheet, incomeStatement } = statement;
    
    // Basic validation
    if (balanceSheet.totalAssets <= 0) return false;
    if (incomeStatement.revenue < 0) return false;
    
    // Balance sheet equation validation
    const totalLiabilitiesAndEquity = (balanceSheet.totalLiabilities || 0) + (balanceSheet.shareholdersEquity || 0);
    if (Math.abs(balanceSheet.totalAssets - totalLiabilitiesAndEquity) > 0.01) return false;
    
    return true;
  }

  /**
   * Get financial statement summary
   */
  protected getFinancialStatementSummary(statement: FinancialStatement): any {
    return {
      year: statement.year,
      revenue: statement.incomeStatement.revenue || 0,
      netIncome: statement.incomeStatement.netIncome || 0,
      totalAssets: statement.balanceSheet.totalAssets || 0,
      totalLiabilities: statement.balanceSheet.totalLiabilities || 0,
      shareholdersEquity: statement.balanceSheet.shareholdersEquity || 0,
      currentAssets: statement.balanceSheet.currentAssets || 0,
      currentLiabilities: statement.balanceSheet.currentLiabilities || 0,
      operatingCashFlow: statement.cashFlowStatement?.operatingCashFlow || 0
    };
  }
}
