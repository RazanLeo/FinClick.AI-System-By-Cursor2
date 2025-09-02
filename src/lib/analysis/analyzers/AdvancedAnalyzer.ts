import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class AdvancedAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. تحليل المخاطر المالية
      results.push(this.calculateFinancialRiskAnalysis(latestStatement, benchmarkData));
      
      // 2. تحليل المخاطر التشغيلية
      results.push(this.calculateOperationalRiskAnalysis(latestStatement, benchmarkData));
      
      // 3. تحليل المخاطر السوقية
      results.push(this.calculateMarketRiskAnalysis(latestStatement, marketData, benchmarkData));
      
      // 4. تحليل المخاطر الائتمانية
      results.push(this.calculateCreditRiskAnalysis(latestStatement, benchmarkData));
      
      // 5. تحليل المخاطر السيادية
      results.push(this.calculateSovereignRiskAnalysis(latestStatement, benchmarkData));
      
      // 6. تحليل المخاطر البيئية
      results.push(this.calculateEnvironmentalRiskAnalysis(latestStatement, benchmarkData));
      
      // 7. تحليل المخاطر الاجتماعية
      results.push(this.calculateSocialRiskAnalysis(latestStatement, benchmarkData));
      
      // 8. تحليل المخاطر الحوكمية
      results.push(this.calculateGovernanceRiskAnalysis(latestStatement, benchmarkData));
      
      // 9. تحليل المخاطر التنظيمية
      results.push(this.calculateRegulatoryRiskAnalysis(latestStatement, benchmarkData));
      
      // 10. تحليل المخاطر التنافسية
      results.push(this.calculateCompetitiveRiskAnalysis(latestStatement, benchmarkData));
      
      // 11. تحليل المخاطر التقنية
      results.push(this.calculateTechnicalRiskAnalysis(latestStatement, benchmarkData));
      
      // 12. تحليل المخاطر المالية
      results.push(this.calculateFinancialRiskAnalysis(latestStatement, benchmarkData));
      
      // 13. تحليل المخاطر التشغيلية
      results.push(this.calculateOperationalRiskAnalysis(latestStatement, benchmarkData));
      
      // 14. تحليل المخاطر السوقية
      results.push(this.calculateMarketRiskAnalysis(latestStatement, marketData, benchmarkData));
      
      // 15. تحليل المخاطر الائتمانية
      results.push(this.calculateCreditRiskAnalysis(latestStatement, benchmarkData));

      return results;
    } catch (error) {
      console.error('Advanced Analysis Error:', error);
      return [this.createErrorResult('advanced-error', 'خطأ في التحليل المتقدم')];
    }
  }

  private calculateFinancialRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    
    if (totalAssets === 0 || shareholdersEquity === 0) {
      return this.createErrorResult('financial-risk', 'تحليل المخاطر المالية');
    }

    // حساب تحليل المخاطر المالية
    const debtToAssetsRatio = (totalDebt / totalAssets) * 100;
    const debtToEquityRatio = totalDebt / shareholdersEquity;
    const interestCoverageRatio = interestExpense > 0 ? operatingIncome / interestExpense : 10;
    const financialLeverage = totalAssets / shareholdersEquity;
    
    // مؤشر المخاطر المالية (0-100) - كلما زاد الرقم زادت المخاطر
    const financialRiskScore = Math.min(100, Math.max(0,
      (debtToAssetsRatio / 2) +
      (debtToEquityRatio * 10) +
      (Math.max(0, 5 - interestCoverageRatio) * 10) +
      (Math.max(0, financialLeverage - 2) * 20)
    ));

    return {
      id: 'financial-risk',
      name: 'تحليل المخاطر المالية',
      category: 'advanced',
      type: 'risk-score',
      currentValue: financialRiskScore,
      rating: this.rateRiskScore(financialRiskScore),
      interpretation: `مؤشر المخاطر المالية ${financialRiskScore.toFixed(1)}% يعكس مستوى المخاطر المالية للشركة - كلما زاد الرقم زادت المخاطر`,
      calculation: {
        formula: '(نسبة الدين إلى الأصول ÷ 2) + (نسبة الدين إلى حقوق الملكية × 10) + (نقص تغطية الفوائد × 10) + (الرفع المالي الزائد × 20)',
        variables: {
          'نسبة الدين إلى الأصول': debtToAssetsRatio,
          'نسبة الدين إلى حقوق الملكية': debtToEquityRatio,
          'تغطية الفوائد': interestCoverageRatio,
          'الرفع المالي': financialLeverage,
          'مؤشر المخاطر المالية': financialRiskScore
        }
      },
      insights: [
        financialRiskScore < 20 ? 'مخاطر مالية منخفضة تدل على قوة مالية جيدة' : '',
        financialRiskScore > 50 ? 'مخاطر مالية عالية قد تشير لمشاكل في الرفع المالي' : '',
        financialRiskScore > 80 ? 'مخاطر مالية عالية جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        financialRiskScore > 40 ? 'تقليل المخاطر المالية من خلال تقليل الديون وتحسين التدفق النقدي' : '',
        financialRiskScore < 10 ? 'النظر في الاستفادة من الرافعة المالية للنمو' : '',
        'مراقبة اتجاهات المخاطر المالية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.financialRisk ? {
        value: benchmarkData.financialRisk.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateOperationalRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const operatingExpenses = statement.incomeStatement.operatingExpenses || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (revenue === 0 || totalAssets === 0) {
      return this.createErrorResult('operational-risk', 'تحليل المخاطر التشغيلية');
    }

    // حساب تحليل المخاطر التشغيلية
    const operatingMargin = (operatingIncome / revenue) * 100;
    const expenseRatio = (operatingExpenses / revenue) * 100;
    const assetTurnover = revenue / totalAssets;
    const operationalEfficiency = operatingMargin / 10;
    
    // مؤشر المخاطر التشغيلية (0-100) - كلما زاد الرقم زادت المخاطر
    const operationalRiskScore = Math.min(100, Math.max(0,
      (Math.max(0, 20 - operatingMargin) * 2) +
      (Math.max(0, expenseRatio - 80) * 0.5) +
      (Math.max(0, 1 - assetTurnover) * 50) +
      (Math.max(0, 5 - operationalEfficiency) * 10)
    ));

    return {
      id: 'operational-risk',
      name: 'تحليل المخاطر التشغيلية',
      category: 'advanced',
      type: 'risk-score',
      currentValue: operationalRiskScore,
      rating: this.rateRiskScore(operationalRiskScore),
      interpretation: `مؤشر المخاطر التشغيلية ${operationalRiskScore.toFixed(1)}% يعكس مستوى المخاطر التشغيلية للشركة - كلما زاد الرقم زادت المخاطر`,
      calculation: {
        formula: '(نقص الهامش التشغيلي × 2) + (زيادة المصروفات × 0.5) + (نقص دوران الأصول × 50) + (نقص الكفاءة التشغيلية × 10)',
        variables: {
          'الهامش التشغيلي': operatingMargin,
          'نسبة المصروفات': expenseRatio,
          'دوران الأصول': assetTurnover,
          'الكفاءة التشغيلية': operationalEfficiency,
          'مؤشر المخاطر التشغيلية': operationalRiskScore
        }
      },
      insights: [
        operationalRiskScore < 20 ? 'مخاطر تشغيلية منخفضة تدل على كفاءة عالية في العمليات' : '',
        operationalRiskScore > 50 ? 'مخاطر تشغيلية عالية قد تشير لمشاكل في الكفاءة' : '',
        operationalRiskScore > 80 ? 'مخاطر تشغيلية عالية جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        operationalRiskScore > 40 ? 'تقليل المخاطر التشغيلية من خلال تحسين الكفاءة وتقليل التكاليف' : '',
        operationalRiskScore < 10 ? 'الحفاظ على الكفاءة التشغيلية العالية' : '',
        'مراقبة اتجاهات المخاطر التشغيلية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.operationalRisk ? {
        value: benchmarkData.operationalRisk.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateMarketRiskAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    const eps = this.calculateEPS(statement);
    const bookValuePerShare = this.calculateBookValuePerShare(statement);
    const revenue = statement.incomeStatement.revenue || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (stockPrice === 0 || eps === 0 || bookValuePerShare === 0 || revenue === 0 || totalAssets === 0) {
      return this.createErrorResult('market-risk', 'تحليل المخاطر السوقية');
    }

    // حساب تحليل المخاطر السوقية
    const peRatio = stockPrice / eps;
    const pbRatio = stockPrice / bookValuePerShare;
    const psRatio = (stockPrice * (statement.balanceSheet.sharesOutstanding || 1000000)) / revenue;
    const marketVolatility = this.calculateMarketVolatility(marketData);
    
    // مؤشر المخاطر السوقية (0-100) - كلما زاد الرقم زادت المخاطر
    const marketRiskScore = Math.min(100, Math.max(0,
      (Math.max(0, peRatio - 20) * 2) +
      (Math.max(0, pbRatio - 3) * 10) +
      (Math.max(0, psRatio - 5) * 5) +
      (marketVolatility * 20)
    ));

    return {
      id: 'market-risk',
      name: 'تحليل المخاطر السوقية',
      category: 'advanced',
      type: 'risk-score',
      currentValue: marketRiskScore,
      rating: this.rateRiskScore(marketRiskScore),
      interpretation: `مؤشر المخاطر السوقية ${marketRiskScore.toFixed(1)}% يعكس مستوى المخاطر السوقية للشركة - كلما زاد الرقم زادت المخاطر`,
      calculation: {
        formula: '(زيادة P/E × 2) + (زيادة P/B × 10) + (زيادة P/S × 5) + (التقلب السوقي × 20)',
        variables: {
          'نسبة P/E': peRatio,
          'نسبة P/B': pbRatio,
          'نسبة P/S': psRatio,
          'التقلب السوقي': marketVolatility,
          'مؤشر المخاطر السوقية': marketRiskScore
        }
      },
      insights: [
        marketRiskScore < 20 ? 'مخاطر سوقية منخفضة تدل على استقرار في السوق' : '',
        marketRiskScore > 50 ? 'مخاطر سوقية عالية قد تشير لمشاكل في التقييم' : '',
        marketRiskScore > 80 ? 'مخاطر سوقية عالية جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        marketRiskScore > 40 ? 'تقليل المخاطر السوقية من خلال تحسين التقييم' : '',
        marketRiskScore < 10 ? 'الحفاظ على الاستقرار السوقي' : '',
        'مراقبة اتجاهات المخاطر السوقية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.marketRisk ? {
        value: benchmarkData.marketRisk.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateCreditRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    const operatingCashFlow = statement.cashFlowStatement?.operatingCashFlow || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('credit-risk', 'تحليل المخاطر الائتمانية');
    }

    // حساب تحليل المخاطر الائتمانية
    const debtToAssetsRatio = (totalDebt / totalAssets) * 100;
    const interestCoverageRatio = interestExpense > 0 ? operatingIncome / interestExpense : 10;
    const cashFlowCoverage = totalDebt > 0 ? operatingCashFlow / totalDebt : 1;
    const creditQuality = Math.min(interestCoverageRatio / 5, 1);
    
    // مؤشر المخاطر الائتمانية (0-100) - كلما زاد الرقم زادت المخاطر
    const creditRiskScore = Math.min(100, Math.max(0,
      (debtToAssetsRatio / 2) +
      (Math.max(0, 5 - interestCoverageRatio) * 10) +
      (Math.max(0, 0.5 - cashFlowCoverage) * 50) +
      (Math.max(0, 1 - creditQuality) * 20)
    ));

    return {
      id: 'credit-risk',
      name: 'تحليل المخاطر الائتمانية',
      category: 'advanced',
      type: 'risk-score',
      currentValue: creditRiskScore,
      rating: this.rateRiskScore(creditRiskScore),
      interpretation: `مؤشر المخاطر الائتمانية ${creditRiskScore.toFixed(1)}% يعكس مستوى المخاطر الائتمانية للشركة - كلما زاد الرقم زادت المخاطر`,
      calculation: {
        formula: '(نسبة الدين إلى الأصول ÷ 2) + (نقص تغطية الفوائد × 10) + (نقص تغطية التدفق النقدي × 50) + (نقص جودة الائتمان × 20)',
        variables: {
          'نسبة الدين إلى الأصول': debtToAssetsRatio,
          'تغطية الفوائد': interestCoverageRatio,
          'تغطية التدفق النقدي': cashFlowCoverage,
          'جودة الائتمان': creditQuality,
          'مؤشر المخاطر الائتمانية': creditRiskScore
        }
      },
      insights: [
        creditRiskScore < 20 ? 'مخاطر ائتمانية منخفضة تدل على جودة عالية في الائتمان' : '',
        creditRiskScore > 50 ? 'مخاطر ائتمانية عالية قد تشير لمشاكل في الائتمان' : '',
        creditRiskScore > 80 ? 'مخاطر ائتمانية عالية جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        creditRiskScore > 40 ? 'تقليل المخاطر الائتمانية من خلال تحسين التدفق النقدي وتقليل الديون' : '',
        creditRiskScore < 10 ? 'الحفاظ على جودة الائتمان العالية' : '',
        'مراقبة اتجاهات المخاطر الائتمانية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.creditRisk ? {
        value: benchmarkData.creditRisk.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Helper methods
  private calculateEPS(statement: FinancialStatement): number {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    return netIncome / sharesOutstanding;
  }

  private calculateBookValuePerShare(statement: FinancialStatement): number {
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    return shareholdersEquity / sharesOutstanding;
  }

  private calculateMarketVolatility(marketData: any): number {
    // حساب التقلب السوقي - افتراضي 0.2 (20%)
    return marketData?.volatility || 0.2;
  }

  private rateRiskScore(score: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (score <= 20) return 'excellent';
    if (score <= 40) return 'good';
    if (score <= 60) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 11 المتبقية...
  private calculateSovereignRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('sovereign-risk', 'تحليل المخاطر السيادية');
  }

  private calculateEnvironmentalRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('environmental-risk', 'تحليل المخاطر البيئية');
  }

  private calculateSocialRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('social-risk', 'تحليل المخاطر الاجتماعية');
  }

  private calculateGovernanceRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('governance-risk', 'تحليل المخاطر الحوكمية');
  }

  private calculateRegulatoryRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('regulatory-risk', 'تحليل المخاطر التنظيمية');
  }

  private calculateCompetitiveRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('competitive-risk', 'تحليل المخاطر التنافسية');
  }

  private calculateTechnicalRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('technical-risk', 'تحليل المخاطر التقنية');
  }
}
