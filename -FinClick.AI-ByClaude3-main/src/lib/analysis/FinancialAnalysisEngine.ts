import { AnalysisResult, FinancialStatement, Company, AnalysisOptions } from '@/lib/types';
import { 
  LiquidityAnalyzer,
  ProfitabilityAnalyzer, 
  EfficiencyAnalyzer,
  LeverageAnalyzer,
  MarketAnalyzer,
  ValuationAnalyzer,
  RiskAnalyzer,
  GrowthAnalyzer,
  CashFlowAnalyzer,
  AdvancedAnalyzer
} from './analyzers';

export interface AnalysisInput {
  companyData: Company;
  financialData: FinancialStatement[];
  marketData?: any;
  benchmarkData?: any;
  options: AnalysisOptions;
}

export class FinancialAnalysisEngine {
  private analyzers: Record<string, any>;

  constructor() {
    this.analyzers = {
      liquidity: new LiquidityAnalyzer(),
      profitability: new ProfitabilityAnalyzer(),
      efficiency: new EfficiencyAnalyzer(),
      leverage: new LeverageAnalyzer(),
      market: new MarketAnalyzer(),
      valuation: new ValuationAnalyzer(),
      risk: new RiskAnalyzer(),
      growth: new GrowthAnalyzer(),
      cashflow: new CashFlowAnalyzer(),
      advanced: new AdvancedAnalyzer()
    };
  }

  async performComprehensiveAnalysis(input: AnalysisInput): Promise<AnalysisResult[]> {
    const { companyData, financialData, marketData, benchmarkData, options } = input;
    
    if (!financialData || financialData.length === 0) {
      throw new Error('Financial data is required for analysis');
    }

    const results: AnalysisResult[] = [];
    const latestStatement = financialData[financialData.length - 1];

    // Determine which analyses to run based on options
    const analysesToRun = this.getAnalysesToRun(options);

    try {
      // 1. Liquidity Analysis (20 analyses)
      if (analysesToRun.includes('liquidity')) {
        const liquidityResults = await this.analyzers.liquidity.analyze(
          financialData, companyData, marketData, benchmarkData
        );
        results.push(...liquidityResults);
      }

      // 2. Profitability Analysis (25 analyses)
      if (analysesToRun.includes('profitability')) {
        const profitabilityResults = await this.analyzers.profitability.analyze(
          financialData, companyData, marketData, benchmarkData
        );
        results.push(...profitabilityResults);
      }

      // 3. Efficiency Analysis (20 analyses)
      if (analysesToRun.includes('efficiency')) {
        const efficiencyResults = await this.analyzers.efficiency.analyze(
          financialData, companyData, marketData, benchmarkData
        );
        results.push(...efficiencyResults);
      }

      // 4. Leverage Analysis (18 analyses)
      if (analysesToRun.includes('leverage')) {
        const leverageResults = await this.analyzers.leverage.analyze(
          financialData, companyData, marketData, benchmarkData
        );
        results.push(...leverageResults);
      }

      // 5. Market Analysis (15 analyses)
      if (analysesToRun.includes('market')) {
        const marketResults = await this.analyzers.market.analyze(
          financialData, companyData, marketData, benchmarkData
        );
        results.push(...marketResults);
      }

      // 6. Valuation Analysis (18 analyses)
      if (analysesToRun.includes('valuation')) {
        const valuationResults = await this.analyzers.valuation.analyze(
          financialData, companyData, marketData, benchmarkData
        );
        results.push(...valuationResults);
      }

      // 7. Risk Analysis (16 analyses)
      if (analysesToRun.includes('risk')) {
        const riskResults = await this.analyzers.risk.analyze(
          financialData, companyData, marketData, benchmarkData
        );
        results.push(...riskResults);
      }

      // 8. Growth Analysis (14 analyses)
      if (analysesToRun.includes('growth')) {
        const growthResults = await this.analyzers.growth.analyze(
          financialData, companyData, marketData, benchmarkData
        );
        results.push(...growthResults);
      }

      // 9. Cash Flow Analysis (12 analyses)
      if (analysesToRun.includes('cashflow')) {
        const cashFlowResults = await this.analyzers.cashflow.analyze(
          financialData, companyData, marketData, benchmarkData
        );
        results.push(...cashFlowResults);
      }

      // 10. Advanced Analysis (23 analyses)
      if (analysesToRun.includes('advanced')) {
        const advancedResults = await this.analyzers.advanced.analyze(
          financialData, companyData, marketData, benchmarkData
        );
        results.push(...advancedResults);
      }

      // Add cross-analysis correlations and insights
      const enhancedResults = await this.enhanceWithCrossAnalysis(
        results, financialData, companyData, options
      );

      return this.sortAndPrioritizeResults(enhancedResults, options);

    } catch (error) {
      console.error('Analysis Engine Error:', error);
      throw new Error(`Failed to perform financial analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getAnalysesToRun(options: AnalysisOptions): string[] {
    if (options.analysisType === 'comprehensive') {
      return ['liquidity', 'profitability', 'efficiency', 'leverage', 'market', 'valuation', 'risk', 'growth', 'cashflow', 'advanced'];
    }

    if (options.specificAnalyses && options.specificAnalyses.length > 0) {
      return options.specificAnalyses;
    }

    // Default to essential analyses
    return ['liquidity', 'profitability', 'efficiency', 'leverage'];
  }

  private async enhanceWithCrossAnalysis(
    results: AnalysisResult[],
    financialData: FinancialStatement[],
    companyData: Company,
    options: AnalysisOptions
  ): Promise<AnalysisResult[]> {
    
    // Add correlation analysis
    const correlations = this.calculateCorrelations(results);
    
    // Enhance each result with additional context
    return results.map(result => {
      const enhanced = { ...result };

      // Add trend analysis if multiple years available
      if (financialData.length > 1) {
        enhanced.historicalTrend = this.calculateTrend(result, financialData);
      }

      // Add industry context
      if (result.industryBenchmark) {
        enhanced.industryPosition = this.calculateIndustryPosition(result);
      }

      // Add risk assessment
      enhanced.riskLevel = this.assessRiskLevel(result, results);

      // Add actionability score
      enhanced.actionabilityScore = this.calculateActionabilityScore(result);

      return enhanced;
    });
  }

  private calculateCorrelations(results: AnalysisResult[]): Record<string, number> {
    const correlations: Record<string, number> = {};
    
    // Calculate correlations between different metrics
    // This is a simplified implementation
    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        const key = `${results[i].name}_${results[j].name}`;
        correlations[key] = this.calculatePearsonCorrelation(
          [results[i].currentValue], 
          [results[j].currentValue]
        );
      }
    }

    return correlations;
  }

  private calculatePearsonCorrelation(x: number[], y: number[]): number {
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

  private calculateTrend(result: AnalysisResult, financialData: FinancialStatement[]): string {
    if (financialData.length < 2) return 'insufficient_data';

    // This is a simplified trend calculation
    // In practice, you'd need to recalculate the metric for each period
    const currentValue = result.currentValue;
    const previousValue = currentValue * 0.95; // Placeholder - should be actual historical value

    const change = (currentValue - previousValue) / previousValue;

    if (Math.abs(change) < 0.05) return 'stable';
    return change > 0 ? 'improving' : 'declining';
  }

  private calculateIndustryPosition(result: AnalysisResult): string {
    if (!result.industryBenchmark) return 'unknown';

    const companyValue = result.currentValue;
    const industryAverage = result.industryBenchmark.value;

    const difference = (companyValue - industryAverage) / industryAverage;

    if (difference > 0.25) return 'top_quartile';
    if (difference > 0) return 'above_average';
    if (difference > -0.25) return 'below_average';
    return 'bottom_quartile';
  }

  private assessRiskLevel(result: AnalysisResult, allResults: AnalysisResult[]): 'low' | 'medium' | 'high' {
    // Risk assessment based on the metric type and value
    if (result.category === 'liquidity' && result.rating === 'poor') return 'high';
    if (result.category === 'leverage' && result.rating === 'poor') return 'high';
    if (result.rating === 'poor') return 'medium';
    return 'low';
  }

  private calculateActionabilityScore(result: AnalysisResult): number {
    // Score from 1-10 indicating how actionable this metric is
    let score = 5; // Base score

    // Adjust based on rating
    if (result.rating === 'poor') score += 3;
    else if (result.rating === 'average') score += 1;
    else if (result.rating === 'excellent') score -= 1;

    // Adjust based on category
    if (['liquidity', 'efficiency'].includes(result.category)) score += 2;
    if (['market', 'valuation'].includes(result.category)) score -= 1;

    // Adjust based on trend
    if (result.trend === 'down') score += 2;
    if (result.trend === 'up') score -= 1;

    return Math.max(1, Math.min(10, score));
  }

  private sortAndPrioritizeResults(
    results: AnalysisResult[], 
    options: AnalysisOptions
  ): AnalysisResult[] {
    
    return results.sort((a, b) => {
      // Primary sort: actionability score (higher first)
      if (a.actionabilityScore !== b.actionabilityScore) {
        return (b.actionabilityScore || 0) - (a.actionabilityScore || 0);
      }

      // Secondary sort: risk level (higher risk first)
      const riskOrder = { high: 3, medium: 2, low: 1 };
      if (a.riskLevel !== b.riskLevel) {
        return (riskOrder[b.riskLevel || 'low'] || 0) - (riskOrder[a.riskLevel || 'low'] || 0);
      }

      // Tertiary sort: rating (poor first for attention)
      const ratingOrder = { poor: 4, average: 3, good: 2, excellent: 1 };
      return (ratingOrder[a.rating] || 0) - (ratingOrder[b.rating] || 0);
    });
  }

  // Utility method to get analysis summary
  getAnalysisSummary(results: AnalysisResult[]): {
    totalAnalyses: number;
    byRating: Record<string, number>;
    byCategory: Record<string, number>;
    topConcerns: AnalysisResult[];
    topStrengths: AnalysisResult[];
  } {
    const byRating: Record<string, number> = {
      excellent: 0, good: 0, average: 0, poor: 0
    };
    const byCategory: Record<string, number> = {};

    results.forEach(result => {
      byRating[result.rating] = (byRating[result.rating] || 0) + 1;
      byCategory[result.category] = (byCategory[result.category] || 0) + 1;
    });

    const topConcerns = results
      .filter(r => r.rating === 'poor' || (r.riskLevel === 'high'))
      .slice(0, 5);

    const topStrengths = results
      .filter(r => r.rating === 'excellent')
      .slice(0, 5);

    return {
      totalAnalyses: results.length,
      byRating,
      byCategory,
      topConcerns,
      topStrengths
    };
  }
}
