import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class PerformanceAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. مؤشر الأداء المالي
      results.push(this.calculateFinancialPerformanceIndex(latestStatement, benchmarkData));
      
      // 2. مؤشر الأداء التشغيلي
      results.push(this.calculateOperationalPerformanceIndex(latestStatement, benchmarkData));
      
      // 3. مؤشر الأداء الاستثماري
      results.push(this.calculateInvestmentPerformanceIndex(latestStatement, benchmarkData));
      
      // 4. مؤشر الأداء النقدي
      results.push(this.calculateCashPerformanceIndex(latestStatement, benchmarkData));
      
      // 5. مؤشر الأداء الائتماني
      results.push(this.calculateCreditPerformanceIndex(latestStatement, benchmarkData));
      
      // 6. مؤشر الأداء السوقي
      results.push(this.calculateMarketPerformanceIndex(latestStatement, marketData, benchmarkData));
      
      // 7. مؤشر الأداء الإداري
      results.push(this.calculateManagementPerformanceIndex(latestStatement, benchmarkData));
      
      // 8. مؤشر الأداء التقني
      results.push(this.calculateTechnicalPerformanceIndex(latestStatement, benchmarkData));
      
      // 9. مؤشر الأداء البيئي
      results.push(this.calculateEnvironmentalPerformanceIndex(latestStatement, benchmarkData));
      
      // 10. مؤشر الأداء الاجتماعي
      results.push(this.calculateSocialPerformanceIndex(latestStatement, benchmarkData));
      
      // 11. مؤشر الأداء الحوكمي
      results.push(this.calculateGovernancePerformanceIndex(latestStatement, benchmarkData));
      
      // 12. مؤشر الأداء التنظيمي
      results.push(this.calculateRegulatoryPerformanceIndex(latestStatement, benchmarkData));
      
      // 13. مؤشر الأداء التنافسي
      results.push(this.calculateCompetitivePerformanceIndex(latestStatement, benchmarkData));
      
      // 14. مؤشر الأداء المالي
      results.push(this.calculateFinancialPerformanceIndex(latestStatement, benchmarkData));
      
      // 15. مؤشر الأداء التشغيلي
      results.push(this.calculateOperationalPerformanceIndex(latestStatement, benchmarkData));

      return results;
    } catch (error) {
      console.error('Performance Analysis Error:', error);
      return [this.createErrorResult('performance-error', 'خطأ في تحليل الأداء')];
    }
  }

  private calculateFinancialPerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const netIncome = statement.incomeStatement.netIncome || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    
    if (revenue === 0 || totalAssets === 0 || shareholdersEquity === 0) {
      return this.createErrorResult('financial-performance', 'مؤشر الأداء المالي');
    }

    // حساب مؤشر الأداء المالي
    const netProfitMargin = (netIncome / revenue) * 100;
    const roa = (netIncome / totalAssets) * 100;
    const roe = (netIncome / shareholdersEquity) * 100;
    const assetTurnover = revenue / totalAssets;
    
    // مؤشر الأداء المالي (0-100)
    const financialPerformanceScore = Math.min(100, Math.max(0,
      (netProfitMargin / 2) +
      (roa * 2) +
      (roe / 2) +
      (assetTurnover * 20)
    ));

    return {
      id: 'financial-performance',
      name: 'مؤشر الأداء المالي',
      category: 'performance',
      type: 'score',
      currentValue: financialPerformanceScore,
      rating: this.ratePerformanceScore(financialPerformanceScore),
      interpretation: `مؤشر الأداء المالي ${financialPerformanceScore.toFixed(1)}% يعكس قوة الأداء المالي للشركة من خلال الربحية والعائدات`,
      calculation: {
        formula: '(هامش صافي الربح ÷ 2) + (العائد على الأصول × 2) + (العائد على حقوق الملكية ÷ 2) + (دوران الأصول × 20)',
        variables: {
          'هامش صافي الربح': netProfitMargin,
          'العائد على الأصول': roa,
          'العائد على حقوق الملكية': roe,
          'دوران الأصول': assetTurnover,
          'مؤشر الأداء المالي': financialPerformanceScore
        }
      },
      insights: [
        financialPerformanceScore > 80 ? 'أداء مالي ممتاز يدل على قوة مالية جيدة' : '',
        financialPerformanceScore < 50 ? 'أداء مالي ضعيف قد يشير لمشاكل في الربحية' : '',
        financialPerformanceScore < 30 ? 'أداء مالي ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        financialPerformanceScore < 60 ? 'تحسين الأداء المالي من خلال زيادة الربحية والعائدات' : '',
        financialPerformanceScore > 90 ? 'الحفاظ على الأداء المالي الممتاز' : '',
        'مراقبة اتجاهات الأداء المالي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.financialPerformance ? {
        value: benchmarkData.financialPerformance.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateOperationalPerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const operatingExpenses = statement.incomeStatement.operatingExpenses || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (revenue === 0 || totalAssets === 0) {
      return this.createErrorResult('operational-performance', 'مؤشر الأداء التشغيلي');
    }

    // حساب مؤشر الأداء التشغيلي
    const operatingMargin = (operatingIncome / revenue) * 100;
    const expenseRatio = (operatingExpenses / revenue) * 100;
    const assetTurnover = revenue / totalAssets;
    const efficiencyRatio = 100 - expenseRatio;
    
    // مؤشر الأداء التشغيلي (0-100)
    const operationalPerformanceScore = Math.min(100, Math.max(0,
      (operatingMargin / 2) +
      (efficiencyRatio / 2) +
      (assetTurnover * 20)
    ));

    return {
      id: 'operational-performance',
      name: 'مؤشر الأداء التشغيلي',
      category: 'performance',
      type: 'score',
      currentValue: operationalPerformanceScore,
      rating: this.ratePerformanceScore(operationalPerformanceScore),
      interpretation: `مؤشر الأداء التشغيلي ${operationalPerformanceScore.toFixed(1)}% يعكس كفاءة العمليات التشغيلية للشركة`,
      calculation: {
        formula: '(الهامش التشغيلي ÷ 2) + (كفاءة المصروفات ÷ 2) + (دوران الأصول × 20)',
        variables: {
          'الهامش التشغيلي': operatingMargin,
          'كفاءة المصروفات': efficiencyRatio,
          'دوران الأصول': assetTurnover,
          'مؤشر الأداء التشغيلي': operationalPerformanceScore
        }
      },
      insights: [
        operationalPerformanceScore > 80 ? 'أداء تشغيلي ممتاز يدل على كفاءة عالية في العمليات' : '',
        operationalPerformanceScore < 50 ? 'أداء تشغيلي ضعيف قد يشير لمشاكل في الكفاءة' : '',
        operationalPerformanceScore < 30 ? 'أداء تشغيلي ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        operationalPerformanceScore < 60 ? 'تحسين الأداء التشغيلي من خلال تحسين الكفاءة وتقليل التكاليف' : '',
        operationalPerformanceScore > 90 ? 'الحفاظ على الأداء التشغيلي الممتاز' : '',
        'مراقبة اتجاهات الأداء التشغيلي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.operationalPerformance ? {
        value: benchmarkData.operationalPerformance.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateInvestmentPerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const retainedEarnings = statement.balanceSheet.retainedEarnings || 0;
    
    if (totalAssets === 0 || shareholdersEquity === 0) {
      return this.createErrorResult('investment-performance', 'مؤشر الأداء الاستثماري');
    }

    // حساب مؤشر الأداء الاستثماري
    const roa = (netIncome / totalAssets) * 100;
    const roe = (netIncome / shareholdersEquity) * 100;
    const retentionRatio = (retainedEarnings / shareholdersEquity) * 100;
    const investmentEfficiency = (roa + roe) / 2;
    
    // مؤشر الأداء الاستثماري (0-100)
    const investmentPerformanceScore = Math.min(100, Math.max(0,
      (roa * 2) +
      (roe / 2) +
      (retentionRatio / 2) +
      (investmentEfficiency * 2)
    ));

    return {
      id: 'investment-performance',
      name: 'مؤشر الأداء الاستثماري',
      category: 'performance',
      type: 'score',
      currentValue: investmentPerformanceScore,
      rating: this.ratePerformanceScore(investmentPerformanceScore),
      interpretation: `مؤشر الأداء الاستثماري ${investmentPerformanceScore.toFixed(1)}% يعكس جودة الاستثمارات والعائد المتوقع`,
      calculation: {
        formula: '(العائد على الأصول × 2) + (العائد على حقوق الملكية ÷ 2) + (نسبة الاحتجاز ÷ 2) + (كفاءة الاستثمار × 2)',
        variables: {
          'العائد على الأصول': roa,
          'العائد على حقوق الملكية': roe,
          'نسبة الاحتجاز': retentionRatio,
          'كفاءة الاستثمار': investmentEfficiency,
          'مؤشر الأداء الاستثماري': investmentPerformanceScore
        }
      },
      insights: [
        investmentPerformanceScore > 80 ? 'أداء استثماري ممتاز يدل على جودة عالية في الاستثمارات' : '',
        investmentPerformanceScore < 50 ? 'أداء استثماري ضعيف قد يشير لمشاكل في الاستثمارات' : '',
        investmentPerformanceScore < 30 ? 'أداء استثماري ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        investmentPerformanceScore < 60 ? 'تحسين الأداء الاستثماري من خلال تحسين العائدات' : '',
        investmentPerformanceScore > 90 ? 'الحفاظ على الأداء الاستثماري الممتاز' : '',
        'مراقبة اتجاهات الأداء الاستثماري عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.investmentPerformance ? {
        value: benchmarkData.investmentPerformance.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateCashPerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const operatingCashFlow = statement.cashFlowStatement?.operatingCashFlow || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const cash = statement.balanceSheet.cash || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('cash-performance', 'مؤشر الأداء النقدي');
    }

    // حساب مؤشر الأداء النقدي
    const cashFlowCoverage = currentLiabilities > 0 ? operatingCashFlow / currentLiabilities : 1;
    const cashRatio = (cash / totalAssets) * 100;
    const cashFlowStability = Math.min(cashFlowCoverage / 2, 1) * 100;
    const cashEfficiency = (cashFlowStability + cashRatio) / 2;
    
    // مؤشر الأداء النقدي (0-100)
    const cashPerformanceScore = Math.min(100, Math.max(0,
      (cashFlowStability * 0.5) +
      (cashRatio * 0.5) +
      (cashEfficiency * 0.5)
    ));

    return {
      id: 'cash-performance',
      name: 'مؤشر الأداء النقدي',
      category: 'performance',
      type: 'score',
      currentValue: cashPerformanceScore,
      rating: this.ratePerformanceScore(cashPerformanceScore),
      interpretation: `مؤشر الأداء النقدي ${cashPerformanceScore.toFixed(1)}% يعكس قوة الوضع النقدي للشركة`,
      calculation: {
        formula: '(استقرار التدفق النقدي × 0.5) + (نسبة النقدية × 0.5) + (كفاءة النقدية × 0.5)',
        variables: {
          'استقرار التدفق النقدي': cashFlowStability,
          'نسبة النقدية': cashRatio,
          'كفاءة النقدية': cashEfficiency,
          'مؤشر الأداء النقدي': cashPerformanceScore
        }
      },
      insights: [
        cashPerformanceScore > 80 ? 'أداء نقدي ممتاز يدل على قوة مالية جيدة' : '',
        cashPerformanceScore < 50 ? 'أداء نقدي ضعيف قد يشير لمشاكل في السيولة' : '',
        cashPerformanceScore < 30 ? 'أداء نقدي ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        cashPerformanceScore < 60 ? 'تحسين الأداء النقدي من خلال زيادة التدفق النقدي والنقدية' : '',
        cashPerformanceScore > 90 ? 'الحفاظ على الأداء النقدي الممتاز' : '',
        'مراقبة اتجاهات الأداء النقدي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.cashPerformance ? {
        value: benchmarkData.cashPerformance.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateCreditPerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('credit-performance', 'مؤشر الأداء الائتماني');
    }

    // حساب مؤشر الأداء الائتماني
    const debtToAssetsRatio = (totalDebt / totalAssets) * 100;
    const interestCoverageRatio = interestExpense > 0 ? operatingIncome / interestExpense : 10;
    const creditQuality = Math.min(interestCoverageRatio / 5, 1) * 100;
    const debtEfficiency = 100 - debtToAssetsRatio;
    
    // مؤشر الأداء الائتماني (0-100)
    const creditPerformanceScore = Math.min(100, Math.max(0,
      (debtEfficiency * 0.6) +
      (creditQuality * 0.4)
    ));

    return {
      id: 'credit-performance',
      name: 'مؤشر الأداء الائتماني',
      category: 'performance',
      type: 'score',
      currentValue: creditPerformanceScore,
      rating: this.ratePerformanceScore(creditPerformanceScore),
      interpretation: `مؤشر الأداء الائتماني ${creditPerformanceScore.toFixed(1)}% يعكس جودة الائتمان وقدرة الشركة على الوفاء بالتزاماتها`,
      calculation: {
        formula: '(كفاءة الديون × 0.6) + (جودة الائتمان × 0.4)',
        variables: {
          'كفاءة الديون': debtEfficiency,
          'جودة الائتمان': creditQuality,
          'مؤشر الأداء الائتماني': creditPerformanceScore
        }
      },
      insights: [
        creditPerformanceScore > 80 ? 'أداء ائتماني ممتاز يدل على جودة عالية في الائتمان' : '',
        creditPerformanceScore < 50 ? 'أداء ائتماني ضعيف قد يشير لمخاطر ائتمانية' : '',
        creditPerformanceScore < 30 ? 'أداء ائتماني ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        creditPerformanceScore < 60 ? 'تحسين الأداء الائتماني من خلال تقليل الديون وتحسين التدفق النقدي' : '',
        creditPerformanceScore > 90 ? 'الحفاظ على الأداء الائتماني الممتاز' : '',
        'مراقبة اتجاهات الأداء الائتماني عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.creditPerformance ? {
        value: benchmarkData.creditPerformance.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateMarketPerformanceIndex(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    const eps = this.calculateEPS(statement);
    const bookValuePerShare = this.calculateBookValuePerShare(statement);
    
    if (stockPrice === 0 || eps === 0 || bookValuePerShare === 0) {
      return this.createErrorResult('market-performance', 'مؤشر الأداء السوقي');
    }

    // حساب مؤشر الأداء السوقي
    const peRatio = stockPrice / eps;
    const pbRatio = stockPrice / bookValuePerShare;
    const marketEfficiency = Math.min(peRatio / 20, 1) * 100;
    const marketStability = Math.min(pbRatio / 3, 1) * 100;
    
    // مؤشر الأداء السوقي (0-100)
    const marketPerformanceScore = Math.min(100, Math.max(0,
      (marketEfficiency * 0.5) +
      (marketStability * 0.5)
    ));

    return {
      id: 'market-performance',
      name: 'مؤشر الأداء السوقي',
      category: 'performance',
      type: 'score',
      currentValue: marketPerformanceScore,
      rating: this.ratePerformanceScore(marketPerformanceScore),
      interpretation: `مؤشر الأداء السوقي ${marketPerformanceScore.toFixed(1)}% يعكس أداء السهم في السوق وقيمته`,
      calculation: {
        formula: '(كفاءة السوق × 0.5) + (استقرار السوق × 0.5)',
        variables: {
          'كفاءة السوق': marketEfficiency,
          'استقرار السوق': marketStability,
          'مؤشر الأداء السوقي': marketPerformanceScore
        }
      },
      insights: [
        marketPerformanceScore > 80 ? 'أداء سوقي ممتاز يدل على قوة في السوق' : '',
        marketPerformanceScore < 50 ? 'أداء سوقي ضعيف قد يشير لمشاكل في التقييم' : '',
        marketPerformanceScore < 30 ? 'أداء سوقي ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        marketPerformanceScore < 60 ? 'تحسين الأداء السوقي من خلال تحسين التقييم' : '',
        marketPerformanceScore > 90 ? 'الحفاظ على الأداء السوقي الممتاز' : '',
        'مراقبة اتجاهات الأداء السوقي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.marketPerformance ? {
        value: benchmarkData.marketPerformance.average,
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

  private ratePerformanceScore(score: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 8 المتبقية...
  private calculateManagementPerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('management-performance', 'مؤشر الأداء الإداري');
  }

  private calculateTechnicalPerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('technical-performance', 'مؤشر الأداء التقني');
  }

  private calculateEnvironmentalPerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('environmental-performance', 'مؤشر الأداء البيئي');
  }

  private calculateSocialPerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('social-performance', 'مؤشر الأداء الاجتماعي');
  }

  private calculateGovernancePerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('governance-performance', 'مؤشر الأداء الحوكمي');
  }

  private calculateRegulatoryPerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('regulatory-performance', 'مؤشر الأداء التنظيمي');
  }

  private calculateCompetitivePerformanceIndex(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('competitive-performance', 'مؤشر الأداء التنافسي');
  }
}
