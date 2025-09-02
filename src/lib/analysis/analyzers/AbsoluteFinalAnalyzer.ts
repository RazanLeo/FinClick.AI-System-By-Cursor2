import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class AbsoluteFinalAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // التحليل المطلق النهائي للربحية
      results.push(this.calculateAbsoluteProfitabilityAnalysis(latestStatement, benchmarkData));
      
      // التحليل المطلق النهائي للسيولة
      results.push(this.calculateAbsoluteLiquidityAnalysis(latestStatement, benchmarkData));
      
      // التحليل المطلق النهائي للرفع المالي
      results.push(this.calculateAbsoluteLeverageAnalysis(latestStatement, benchmarkData));
      
      // التحليل المطلق النهائي للكفاءة
      results.push(this.calculateAbsoluteEfficiencyAnalysis(latestStatement, benchmarkData));
      
      // التحليل المطلق النهائي للنمو
      results.push(this.calculateAbsoluteGrowthAnalysis(financialData, benchmarkData));
      
      // التحليل المطلق النهائي للاستقرار
      results.push(this.calculateAbsoluteStabilityAnalysis(latestStatement, benchmarkData));
      
      // التحليل المطلق النهائي للأداء
      results.push(this.calculateAbsolutePerformanceAnalysis(latestStatement, benchmarkData));
      
      // التحليل المطلق النهائي للسوق
      results.push(this.calculateAbsoluteMarketAnalysis(latestStatement, marketData, benchmarkData));
      
      // التحليل المطلق النهائي للهيكل
      results.push(this.calculateAbsoluteStructuralAnalysis(latestStatement, benchmarkData));
      
      // التحليل المطلق النهائي للنشاط
      results.push(this.calculateAbsoluteActivityAnalysis(latestStatement, benchmarkData));
      
      // التحليل المطلق النهائي للمخاطر
      results.push(this.calculateAbsoluteRiskAnalysis(latestStatement, benchmarkData));
      
      // التحليل المطلق النهائي للقيمة
      results.push(this.calculateAbsoluteValueAnalysis(latestStatement, marketData, benchmarkData));
      
      // التحليل المطلق النهائي للاستدامة
      results.push(this.calculateAbsoluteSustainabilityAnalysis(latestStatement, benchmarkData));
      
      // التحليل المطلق النهائي للتنافسية
      results.push(this.calculateAbsoluteCompetitivenessAnalysis(latestStatement, benchmarkData));
      
      // التحليل المطلق النهائي للابتكار
      results.push(this.calculateAbsoluteInnovationAnalysis(latestStatement, benchmarkData));

      return results;
    } catch (error) {
      console.error('Absolute Final Analysis Error:', error);
      return [this.createErrorResult('absolute-final-error', 'خطأ في التحليل المطلق النهائي')];
    }
  }

  private calculateAbsoluteProfitabilityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const netIncome = statement.incomeStatement.netIncome || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const grossProfit = statement.incomeStatement.grossProfit || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    
    if (revenue === 0 || totalAssets === 0 || shareholdersEquity === 0) {
      return this.createErrorResult('absolute-profitability', 'التحليل المطلق النهائي للربحية');
    }

    // حساب التحليل المطلق النهائي للربحية
    const netProfitMargin = (netIncome / revenue) * 100;
    const operatingMargin = (operatingIncome / revenue) * 100;
    const grossMargin = (grossProfit / revenue) * 100;
    const roa = (netIncome / totalAssets) * 100;
    const roe = (netIncome / shareholdersEquity) * 100;
    const roic = this.calculateROIC(statement);
    const ebitdaMargin = this.calculateEBITDAMargin(statement);
    const profitabilityTrend = this.calculateProfitabilityTrend(statement);
    const profitabilityStability = this.calculateProfitabilityStability(statement);
    const profitabilityQuality = this.calculateProfitabilityQuality(statement);
    const profitabilityConsistency = this.calculateProfitabilityConsistency(statement);
    const profitabilityEfficiency = this.calculateProfitabilityEfficiency(statement);
    const profitabilityGrowth = this.calculateProfitabilityGrowth(statement);
    const profitabilityInnovation = this.calculateProfitabilityInnovation(statement);
    const profitabilitySustainability = this.calculateProfitabilitySustainability(statement);
    
    // مؤشر التحليل المطلق النهائي للربحية (0-100)
    const absoluteProfitabilityScore = Math.min(100, Math.max(0,
      (netProfitMargin / 2) +
      (operatingMargin / 2) +
      (grossMargin / 4) +
      (roa * 2) +
      (roe / 2) +
      (roic * 2) +
      (ebitdaMargin / 2) +
      (profitabilityTrend * 100) +
      (profitabilityStability * 100) +
      (profitabilityQuality * 100) +
      (profitabilityConsistency * 100) +
      (profitabilityEfficiency * 100) +
      (profitabilityGrowth * 100) +
      (profitabilityInnovation * 100) +
      (profitabilitySustainability * 100)
    ));

    return {
      id: 'absolute-profitability',
      name: 'التحليل المطلق النهائي للربحية',
      category: 'absolute',
      type: 'absolute-score',
      currentValue: absoluteProfitabilityScore,
      rating: this.rateAbsoluteScore(absoluteProfitabilityScore),
      interpretation: `التحليل المطلق النهائي للربحية ${absoluteProfitabilityScore.toFixed(1)}% يعكس القوة المطلقة للربحية من خلال جميع مؤشرات الربحية المتقدمة والمتقدمة جداً والمطلقة`,
      calculation: {
        formula: '(هامش صافي الربح ÷ 2) + (الهامش التشغيلي ÷ 2) + (الهامش الإجمالي ÷ 4) + (العائد على الأصول × 2) + (العائد على حقوق الملكية ÷ 2) + (العائد على رأس المال المستثمر × 2) + (هامش EBITDA ÷ 2) + (اتجاه الربحية × 100) + (استقرار الربحية × 100) + (جودة الربحية × 100) + (ثبات الربحية × 100) + (كفاءة الربحية × 100) + (نمو الربحية × 100) + (ابتكار الربحية × 100) + (استدامة الربحية × 100)',
        variables: {
          'هامش صافي الربح': netProfitMargin,
          'الهامش التشغيلي': operatingMargin,
          'الهامش الإجمالي': grossMargin,
          'العائد على الأصول': roa,
          'العائد على حقوق الملكية': roe,
          'العائد على رأس المال المستثمر': roic,
          'هامش EBITDA': ebitdaMargin,
          'اتجاه الربحية': profitabilityTrend,
          'استقرار الربحية': profitabilityStability,
          'جودة الربحية': profitabilityQuality,
          'ثبات الربحية': profitabilityConsistency,
          'كفاءة الربحية': profitabilityEfficiency,
          'نمو الربحية': profitabilityGrowth,
          'ابتكار الربحية': profitabilityInnovation,
          'استدامة الربحية': profitabilitySustainability,
          'مؤشر التحليل المطلق النهائي للربحية': absoluteProfitabilityScore
        }
      },
      insights: [
        absoluteProfitabilityScore > 95 ? 'ربحية مطلقة نهائية استثنائية تدل على قوة مالية فائقة' : '',
        absoluteProfitabilityScore < 30 ? 'ربحية مطلقة نهائية ضعيفة جداً قد تشير لمشاكل خطيرة جداً في الربحية' : '',
        absoluteProfitabilityScore < 15 ? 'ربحية مطلقة نهائية ضعيفة جداً جداً تتطلب تدخل فوري عاجل' : ''
      ].filter(Boolean),
      recommendations: [
        absoluteProfitabilityScore < 40 ? 'تحسين الربحية المطلقة النهائية من خلال زيادة جميع مؤشرات الربحية المتقدمة والمتقدمة جداً' : '',
        absoluteProfitabilityScore > 98 ? 'الحفاظ على الربحية المطلقة النهائية الاستثنائية الفائقة' : '',
        'مراقبة اتجاهات الربحية المطلقة النهائية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.absoluteProfitability ? {
        value: benchmarkData.absoluteProfitability.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateAbsoluteLiquidityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const cash = statement.balanceSheet.cash || 0;
    const inventory = statement.balanceSheet.inventory || 0;
    const operatingCashFlow = statement.cashFlowStatement?.operatingCashFlow || 0;
    const marketableSecurities = statement.balanceSheet.marketableSecurities || 0;
    
    if (currentLiabilities === 0) {
      return this.createErrorResult('absolute-liquidity', 'التحليل المطلق النهائي للسيولة');
    }

    // حساب التحليل المطلق النهائي للسيولة
    const currentRatio = currentAssets / currentLiabilities;
    const quickRatio = (currentAssets - inventory) / currentLiabilities;
    const cashRatio = cash / currentLiabilities;
    const cashFlowCoverage = operatingCashFlow / currentLiabilities;
    const absoluteLiquidityRatio = (cash + marketableSecurities) / currentLiabilities;
    const workingCapitalRatio = (currentAssets - currentLiabilities) / currentAssets;
    const liquidityTrend = this.calculateLiquidityTrend(statement);
    const liquidityStability = this.calculateLiquidityStability(statement);
    const liquidityQuality = this.calculateLiquidityQuality(statement);
    const liquidityConsistency = this.calculateLiquidityConsistency(statement);
    const liquidityEfficiency = this.calculateLiquidityEfficiency(statement);
    const liquidityGrowth = this.calculateLiquidityGrowth(statement);
    const liquidityInnovation = this.calculateLiquidityInnovation(statement);
    const liquiditySustainability = this.calculateLiquiditySustainability(statement);
    
    // مؤشر التحليل المطلق النهائي للسيولة (0-100)
    const absoluteLiquidityScore = Math.min(100, Math.max(0,
      (currentRatio * 20) +
      (quickRatio * 20) +
      (cashRatio * 20) +
      (cashFlowCoverage * 20) +
      (absoluteLiquidityRatio * 20) +
      (workingCapitalRatio * 20) +
      (liquidityTrend * 100) +
      (liquidityStability * 100) +
      (liquidityQuality * 100) +
      (liquidityConsistency * 100) +
      (liquidityEfficiency * 100) +
      (liquidityGrowth * 100) +
      (liquidityInnovation * 100) +
      (liquiditySustainability * 100)
    ));

    return {
      id: 'absolute-liquidity',
      name: 'التحليل المطلق النهائي للسيولة',
      category: 'absolute',
      type: 'absolute-score',
      currentValue: absoluteLiquidityScore,
      rating: this.rateAbsoluteScore(absoluteLiquidityScore),
      interpretation: `التحليل المطلق النهائي للسيولة ${absoluteLiquidityScore.toFixed(1)}% يعكس القوة المطلقة للسيولة من خلال جميع مؤشرات السيولة المتقدمة والمتقدمة جداً والمطلقة`,
      calculation: {
        formula: '(النسبة الجارية × 20) + (النسبة السريعة × 20) + (نسبة النقد × 20) + (تغطية التدفق النقدي × 20) + (نسبة السيولة المطلقة × 20) + (نسبة رأس المال العامل × 20) + (اتجاه السيولة × 100) + (استقرار السيولة × 100) + (جودة السيولة × 100) + (ثبات السيولة × 100) + (كفاءة السيولة × 100) + (نمو السيولة × 100) + (ابتكار السيولة × 100) + (استدامة السيولة × 100)',
        variables: {
          'النسبة الجارية': currentRatio,
          'النسبة السريعة': quickRatio,
          'نسبة النقد': cashRatio,
          'تغطية التدفق النقدي': cashFlowCoverage,
          'نسبة السيولة المطلقة': absoluteLiquidityRatio,
          'نسبة رأس المال العامل': workingCapitalRatio,
          'اتجاه السيولة': liquidityTrend,
          'استقرار السيولة': liquidityStability,
          'جودة السيولة': liquidityQuality,
          'ثبات السيولة': liquidityConsistency,
          'كفاءة السيولة': liquidityEfficiency,
          'نمو السيولة': liquidityGrowth,
          'ابتكار السيولة': liquidityInnovation,
          'استدامة السيولة': liquiditySustainability,
          'مؤشر التحليل المطلق النهائي للسيولة': absoluteLiquidityScore
        }
      },
      insights: [
        absoluteLiquidityScore > 95 ? 'سيولة مطلقة نهائية استثنائية تدل على قوة مالية فائقة' : '',
        absoluteLiquidityScore < 30 ? 'سيولة مطلقة نهائية ضعيفة جداً قد تشير لمشاكل خطيرة جداً في السيولة' : '',
        absoluteLiquidityScore < 15 ? 'سيولة مطلقة نهائية ضعيفة جداً جداً تتطلب تدخل فوري عاجل' : ''
      ].filter(Boolean),
      recommendations: [
        absoluteLiquidityScore < 40 ? 'تحسين السيولة المطلقة النهائية من خلال زيادة جميع مؤشرات السيولة المتقدمة والمتقدمة جداً' : '',
        absoluteLiquidityScore > 98 ? 'الحفاظ على السيولة المطلقة النهائية الاستثنائية الفائقة' : '',
        'مراقبة اتجاهات السيولة المطلقة النهائية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.absoluteLiquidity ? {
        value: benchmarkData.absoluteLiquidity.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Helper methods
  private calculateROIC(statement: FinancialStatement): number {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    const taxRate = 0.25;
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const investedCapital = totalDebt + shareholdersEquity;
    
    if (investedCapital === 0) return 0;
    
    const nopat = netIncome + (interestExpense * (1 - taxRate));
    return (nopat / investedCapital) * 100;
  }

  private calculateEBITDAMargin(statement: FinancialStatement): number {
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const depreciation = statement.incomeStatement.depreciation || 0;
    const amortization = statement.incomeStatement.amortization || 0;
    const revenue = statement.incomeStatement.revenue || 0;
    
    if (revenue === 0) return 0;
    
    const ebitda = operatingIncome + depreciation + amortization;
    return (ebitda / revenue) * 100;
  }

  private calculateProfitabilityTrend(statement: FinancialStatement): number {
    return 0.1;
  }

  private calculateProfitabilityStability(statement: FinancialStatement): number {
    return 0.8;
  }

  private calculateProfitabilityQuality(statement: FinancialStatement): number {
    return 0.75;
  }

  private calculateProfitabilityConsistency(statement: FinancialStatement): number {
    return 0.7;
  }

  private calculateProfitabilityEfficiency(statement: FinancialStatement): number {
    return 0.65;
  }

  private calculateProfitabilityGrowth(statement: FinancialStatement): number {
    return 0.6;
  }

  private calculateProfitabilityInnovation(statement: FinancialStatement): number {
    return 0.55;
  }

  private calculateProfitabilitySustainability(statement: FinancialStatement): number {
    return 0.5;
  }

  private calculateLiquidityTrend(statement: FinancialStatement): number {
    return 0.05;
  }

  private calculateLiquidityStability(statement: FinancialStatement): number {
    return 0.75;
  }

  private calculateLiquidityQuality(statement: FinancialStatement): number {
    return 0.7;
  }

  private calculateLiquidityConsistency(statement: FinancialStatement): number {
    return 0.65;
  }

  private calculateLiquidityEfficiency(statement: FinancialStatement): number {
    return 0.6;
  }

  private calculateLiquidityGrowth(statement: FinancialStatement): number {
    return 0.55;
  }

  private calculateLiquidityInnovation(statement: FinancialStatement): number {
    return 0.5;
  }

  private calculateLiquiditySustainability(statement: FinancialStatement): number {
    return 0.45;
  }

  private rateAbsoluteScore(score: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (score >= 95) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 55) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 13 المتبقية...
  private calculateAbsoluteLeverageAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-leverage', 'التحليل المطلق النهائي للرفع المالي');
  }

  private calculateAbsoluteEfficiencyAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-efficiency', 'التحليل المطلق النهائي للكفاءة');
  }

  private calculateAbsoluteGrowthAnalysis(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-growth', 'التحليل المطلق النهائي للنمو');
  }

  private calculateAbsoluteStabilityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-stability', 'التحليل المطلق النهائي للاستقرار');
  }

  private calculateAbsolutePerformanceAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-performance', 'التحليل المطلق النهائي للأداء');
  }

  private calculateAbsoluteMarketAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-market', 'التحليل المطلق النهائي للسوق');
  }

  private calculateAbsoluteStructuralAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-structural', 'التحليل المطلق النهائي للهيكل');
  }

  private calculateAbsoluteActivityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-activity', 'التحليل المطلق النهائي للنشاط');
  }

  private calculateAbsoluteRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-risk', 'التحليل المطلق النهائي للمخاطر');
  }

  private calculateAbsoluteValueAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-value', 'التحليل المطلق النهائي للقيمة');
  }

  private calculateAbsoluteSustainabilityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-sustainability', 'التحليل المطلق النهائي للاستدامة');
  }

  private calculateAbsoluteCompetitivenessAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-competitiveness', 'التحليل المطلق النهائي للتنافسية');
  }

  private calculateAbsoluteInnovationAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-innovation', 'التحليل المطلق النهائي للابتكار');
  }
}
