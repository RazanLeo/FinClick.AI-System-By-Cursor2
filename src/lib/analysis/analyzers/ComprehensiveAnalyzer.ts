import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class ComprehensiveAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. التحليل الشامل للربحية
      results.push(this.calculateComprehensiveProfitabilityAnalysis(latestStatement, benchmarkData));
      
      // 2. التحليل الشامل للسيولة
      results.push(this.calculateComprehensiveLiquidityAnalysis(latestStatement, benchmarkData));
      
      // 3. التحليل الشامل للرفع المالي
      results.push(this.calculateComprehensiveLeverageAnalysis(latestStatement, benchmarkData));
      
      // 4. التحليل الشامل للكفاءة
      results.push(this.calculateComprehensiveEfficiencyAnalysis(latestStatement, benchmarkData));
      
      // 5. التحليل الشامل للنمو
      results.push(this.calculateComprehensiveGrowthAnalysis(financialData, benchmarkData));
      
      // 6. التحليل الشامل للاستقرار
      results.push(this.calculateComprehensiveStabilityAnalysis(latestStatement, benchmarkData));
      
      // 7. التحليل الشامل للأداء
      results.push(this.calculateComprehensivePerformanceAnalysis(latestStatement, benchmarkData));
      
      // 8. التحليل الشامل للسوق
      results.push(this.calculateComprehensiveMarketAnalysis(latestStatement, marketData, benchmarkData));
      
      // 9. التحليل الشامل للهيكل
      results.push(this.calculateComprehensiveStructuralAnalysis(latestStatement, benchmarkData));
      
      // 10. التحليل الشامل للنشاط
      results.push(this.calculateComprehensiveActivityAnalysis(latestStatement, benchmarkData));
      
      // 11. التحليل الشامل للمخاطر
      results.push(this.calculateComprehensiveRiskAnalysis(latestStatement, benchmarkData));
      
      // 12. التحليل الشامل للقيمة
      results.push(this.calculateComprehensiveValueAnalysis(latestStatement, marketData, benchmarkData));
      
      // 13. التحليل الشامل للاستدامة
      results.push(this.calculateComprehensiveSustainabilityAnalysis(latestStatement, benchmarkData));
      
      // 14. التحليل الشامل للتنافسية
      results.push(this.calculateComprehensiveCompetitivenessAnalysis(latestStatement, benchmarkData));
      
      // 15. التحليل الشامل للابتكار
      results.push(this.calculateComprehensiveInnovationAnalysis(latestStatement, benchmarkData));

      return results;
    } catch (error) {
      console.error('Comprehensive Analysis Error:', error);
      return [this.createErrorResult('comprehensive-error', 'خطأ في التحليل الشامل')];
    }
  }

  private calculateComprehensiveProfitabilityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const netIncome = statement.incomeStatement.netIncome || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const grossProfit = statement.incomeStatement.grossProfit || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    
    if (revenue === 0 || totalAssets === 0 || shareholdersEquity === 0) {
      return this.createErrorResult('comprehensive-profitability', 'التحليل الشامل للربحية');
    }

    // حساب التحليل الشامل للربحية
    const netProfitMargin = (netIncome / revenue) * 100;
    const operatingMargin = (operatingIncome / revenue) * 100;
    const grossMargin = (grossProfit / revenue) * 100;
    const roa = (netIncome / totalAssets) * 100;
    const roe = (netIncome / shareholdersEquity) * 100;
    
    // مؤشر التحليل الشامل للربحية (0-100)
    const comprehensiveProfitabilityScore = Math.min(100, Math.max(0,
      (netProfitMargin / 2) +
      (operatingMargin / 2) +
      (grossMargin / 4) +
      (roa * 2) +
      (roe / 2)
    ));

    return {
      id: 'comprehensive-profitability',
      name: 'التحليل الشامل للربحية',
      category: 'comprehensive',
      type: 'score',
      currentValue: comprehensiveProfitabilityScore,
      rating: this.rateComprehensiveScore(comprehensiveProfitabilityScore),
      interpretation: `التحليل الشامل للربحية ${comprehensiveProfitabilityScore.toFixed(1)}% يعكس قوة الربحية الشاملة للشركة من خلال جميع مؤشرات الربحية`,
      calculation: {
        formula: '(هامش صافي الربح ÷ 2) + (الهامش التشغيلي ÷ 2) + (الهامش الإجمالي ÷ 4) + (العائد على الأصول × 2) + (العائد على حقوق الملكية ÷ 2)',
        variables: {
          'هامش صافي الربح': netProfitMargin,
          'الهامش التشغيلي': operatingMargin,
          'الهامش الإجمالي': grossMargin,
          'العائد على الأصول': roa,
          'العائد على حقوق الملكية': roe,
          'مؤشر التحليل الشامل للربحية': comprehensiveProfitabilityScore
        }
      },
      insights: [
        comprehensiveProfitabilityScore > 80 ? 'ربحية شاملة ممتازة تدل على قوة مالية جيدة' : '',
        comprehensiveProfitabilityScore < 50 ? 'ربحية شاملة ضعيفة قد تشير لمشاكل في الربحية' : '',
        comprehensiveProfitabilityScore < 30 ? 'ربحية شاملة ضعيفة جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        comprehensiveProfitabilityScore < 60 ? 'تحسين الربحية الشاملة من خلال زيادة جميع مؤشرات الربحية' : '',
        comprehensiveProfitabilityScore > 90 ? 'الحفاظ على الربحية الشاملة الممتازة' : '',
        'مراقبة اتجاهات الربحية الشاملة عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.comprehensiveProfitability ? {
        value: benchmarkData.comprehensiveProfitability.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateComprehensiveLiquidityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const cash = statement.balanceSheet.cash || 0;
    const inventory = statement.balanceSheet.inventory || 0;
    const operatingCashFlow = statement.cashFlowStatement?.operatingCashFlow || 0;
    
    if (currentLiabilities === 0) {
      return this.createErrorResult('comprehensive-liquidity', 'التحليل الشامل للسيولة');
    }

    // حساب التحليل الشامل للسيولة
    const currentRatio = currentAssets / currentLiabilities;
    const quickRatio = (currentAssets - inventory) / currentLiabilities;
    const cashRatio = cash / currentLiabilities;
    const cashFlowCoverage = operatingCashFlow / currentLiabilities;
    
    // مؤشر التحليل الشامل للسيولة (0-100)
    const comprehensiveLiquidityScore = Math.min(100, Math.max(0,
      (currentRatio * 20) +
      (quickRatio * 20) +
      (cashRatio * 20) +
      (cashFlowCoverage * 20)
    ));

    return {
      id: 'comprehensive-liquidity',
      name: 'التحليل الشامل للسيولة',
      category: 'comprehensive',
      type: 'score',
      currentValue: comprehensiveLiquidityScore,
      rating: this.rateComprehensiveScore(comprehensiveLiquidityScore),
      interpretation: `التحليل الشامل للسيولة ${comprehensiveLiquidityScore.toFixed(1)}% يعكس قوة السيولة الشاملة للشركة من خلال جميع مؤشرات السيولة`,
      calculation: {
        formula: '(النسبة الجارية × 20) + (النسبة السريعة × 20) + (نسبة النقد × 20) + (تغطية التدفق النقدي × 20)',
        variables: {
          'النسبة الجارية': currentRatio,
          'النسبة السريعة': quickRatio,
          'نسبة النقد': cashRatio,
          'تغطية التدفق النقدي': cashFlowCoverage,
          'مؤشر التحليل الشامل للسيولة': comprehensiveLiquidityScore
        }
      },
      insights: [
        comprehensiveLiquidityScore > 80 ? 'سيولة شاملة ممتازة تدل على قوة مالية جيدة' : '',
        comprehensiveLiquidityScore < 50 ? 'سيولة شاملة ضعيفة قد تشير لمشاكل في السيولة' : '',
        comprehensiveLiquidityScore < 30 ? 'سيولة شاملة ضعيفة جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        comprehensiveLiquidityScore < 60 ? 'تحسين السيولة الشاملة من خلال زيادة جميع مؤشرات السيولة' : '',
        comprehensiveLiquidityScore > 90 ? 'الحفاظ على السيولة الشاملة الممتازة' : '',
        'مراقبة اتجاهات السيولة الشاملة عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.comprehensiveLiquidity ? {
        value: benchmarkData.comprehensiveLiquidity.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateComprehensiveLeverageAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    
    if (totalAssets === 0 || shareholdersEquity === 0) {
      return this.createErrorResult('comprehensive-leverage', 'التحليل الشامل للرفع المالي');
    }

    // حساب التحليل الشامل للرفع المالي
    const debtToAssetsRatio = (totalDebt / totalAssets) * 100;
    const debtToEquityRatio = totalDebt / shareholdersEquity;
    const equityToAssetsRatio = (shareholdersEquity / totalAssets) * 100;
    const interestCoverageRatio = interestExpense > 0 ? operatingIncome / interestExpense : 10;
    
    // مؤشر التحليل الشامل للرفع المالي (0-100)
    const comprehensiveLeverageScore = Math.min(100, Math.max(0,
      ((100 - debtToAssetsRatio) / 2) +
      ((1 / (1 + debtToEquityRatio)) * 50) +
      (equityToAssetsRatio / 2) +
      (Math.min(interestCoverageRatio / 5, 1) * 50)
    ));

    return {
      id: 'comprehensive-leverage',
      name: 'التحليل الشامل للرفع المالي',
      category: 'comprehensive',
      type: 'score',
      currentValue: comprehensiveLeverageScore,
      rating: this.rateComprehensiveScore(comprehensiveLeverageScore),
      interpretation: `التحليل الشامل للرفع المالي ${comprehensiveLeverageScore.toFixed(1)}% يعكس قوة الرفع المالي الشامل للشركة من خلال جميع مؤشرات الرفع المالي`,
      calculation: {
        formula: '((100 - نسبة الدين إلى الأصول) ÷ 2) + ((1 ÷ (1 + نسبة الدين إلى حقوق الملكية)) × 50) + (نسبة حقوق الملكية إلى الأصول ÷ 2) + (تغطية الفوائد × 50)',
        variables: {
          'نسبة الدين إلى الأصول': debtToAssetsRatio,
          'نسبة الدين إلى حقوق الملكية': debtToEquityRatio,
          'نسبة حقوق الملكية إلى الأصول': equityToAssetsRatio,
          'تغطية الفوائد': Math.min(interestCoverageRatio / 5, 1),
          'مؤشر التحليل الشامل للرفع المالي': comprehensiveLeverageScore
        }
      },
      insights: [
        comprehensiveLeverageScore > 80 ? 'رفع مالي شامل ممتاز يدل على قوة مالية جيدة' : '',
        comprehensiveLeverageScore < 50 ? 'رفع مالي شامل ضعيف قد يشير لمخاطر مالية' : '',
        comprehensiveLeverageScore < 30 ? 'رفع مالي شامل ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        comprehensiveLeverageScore < 60 ? 'تحسين الرفع المالي الشامل من خلال تحسين جميع مؤشرات الرفع المالي' : '',
        comprehensiveLeverageScore > 90 ? 'الحفاظ على الرفع المالي الشامل الممتاز' : '',
        'مراقبة اتجاهات الرفع المالي الشامل عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.comprehensiveLeverage ? {
        value: benchmarkData.comprehensiveLeverage.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateComprehensiveEfficiencyAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const costOfGoodsSold = statement.incomeStatement.costOfGoodsSold || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const fixedAssets = statement.balanceSheet.fixedAssets || 0;
    const inventory = statement.balanceSheet.inventory || 0;
    const accountsReceivable = statement.balanceSheet.accountsReceivable || 0;
    
    if (revenue === 0 || totalAssets === 0) {
      return this.createErrorResult('comprehensive-efficiency', 'التحليل الشامل للكفاءة');
    }

    // حساب التحليل الشامل للكفاءة
    const totalAssetTurnover = revenue / totalAssets;
    const fixedAssetTurnover = fixedAssets > 0 ? revenue / fixedAssets : 0;
    const inventoryTurnover = inventory > 0 ? costOfGoodsSold / inventory : 0;
    const receivablesTurnover = accountsReceivable > 0 ? revenue / accountsReceivable : 0;
    
    // مؤشر التحليل الشامل للكفاءة (0-100)
    const comprehensiveEfficiencyScore = Math.min(100, Math.max(0,
      (totalAssetTurnover * 30) +
      (fixedAssetTurnover * 20) +
      (inventoryTurnover * 25) +
      (receivablesTurnover * 25)
    ));

    return {
      id: 'comprehensive-efficiency',
      name: 'التحليل الشامل للكفاءة',
      category: 'comprehensive',
      type: 'score',
      currentValue: comprehensiveEfficiencyScore,
      rating: this.rateComprehensiveScore(comprehensiveEfficiencyScore),
      interpretation: `التحليل الشامل للكفاءة ${comprehensiveEfficiencyScore.toFixed(1)}% يعكس كفاءة العمليات الشاملة للشركة من خلال جميع مؤشرات الكفاءة`,
      calculation: {
        formula: '(دوران الأصول الإجمالية × 30) + (دوران الأصول الثابتة × 20) + (دوران المخزون × 25) + (دوران الذمم المدينة × 25)',
        variables: {
          'دوران الأصول الإجمالية': totalAssetTurnover,
          'دوران الأصول الثابتة': fixedAssetTurnover,
          'دوران المخزون': inventoryTurnover,
          'دوران الذمم المدينة': receivablesTurnover,
          'مؤشر التحليل الشامل للكفاءة': comprehensiveEfficiencyScore
        }
      },
      insights: [
        comprehensiveEfficiencyScore > 80 ? 'كفاءة شاملة ممتازة تدل على كفاءة عالية في العمليات' : '',
        comprehensiveEfficiencyScore < 50 ? 'كفاءة شاملة ضعيفة قد تشير لمشاكل في الكفاءة' : '',
        comprehensiveEfficiencyScore < 30 ? 'كفاءة شاملة ضعيفة جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        comprehensiveEfficiencyScore < 60 ? 'تحسين الكفاءة الشاملة من خلال تحسين جميع مؤشرات الكفاءة' : '',
        comprehensiveEfficiencyScore > 90 ? 'الحفاظ على الكفاءة الشاملة الممتازة' : '',
        'مراقبة اتجاهات الكفاءة الشاملة عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.comprehensiveEfficiency ? {
        value: benchmarkData.comprehensiveEfficiency.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateComprehensiveGrowthAnalysis(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    if (financialData.length < 2) {
      return this.createErrorResult('comprehensive-growth', 'التحليل الشامل للنمو');
    }

    const currentRevenue = financialData[financialData.length - 1].incomeStatement.revenue || 0;
    const previousRevenue = financialData[financialData.length - 2].incomeStatement.revenue || 0;
    const currentNetIncome = financialData[financialData.length - 1].incomeStatement.netIncome || 0;
    const previousNetIncome = financialData[financialData.length - 2].incomeStatement.netIncome || 0;
    const currentAssets = financialData[financialData.length - 1].balanceSheet.totalAssets || 0;
    const previousAssets = financialData[financialData.length - 2].balanceSheet.totalAssets || 0;
    
    if (previousRevenue === 0 || previousNetIncome === 0 || previousAssets === 0) {
      return this.createErrorResult('comprehensive-growth', 'التحليل الشامل للنمو');
    }

    // حساب التحليل الشامل للنمو
    const revenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    const profitGrowth = ((currentNetIncome - previousNetIncome) / previousNetIncome) * 100;
    const assetGrowth = ((currentAssets - previousAssets) / previousAssets) * 100;
    const growthStability = Math.min(Math.abs(revenueGrowth) / 20, 1) * 100;
    
    // مؤشر التحليل الشامل للنمو (0-100)
    const comprehensiveGrowthScore = Math.min(100, Math.max(0,
      (Math.abs(revenueGrowth) / 2) +
      (Math.abs(profitGrowth) / 2) +
      (Math.abs(assetGrowth) / 2) +
      (growthStability / 2)
    ));

    return {
      id: 'comprehensive-growth',
      name: 'التحليل الشامل للنمو',
      category: 'comprehensive',
      type: 'score',
      currentValue: comprehensiveGrowthScore,
      rating: this.rateComprehensiveScore(comprehensiveGrowthScore),
      interpretation: `التحليل الشامل للنمو ${comprehensiveGrowthScore.toFixed(1)}% يعكس قوة النمو الشامل للشركة من خلال جميع مؤشرات النمو`,
      calculation: {
        formula: '(نمو الإيرادات ÷ 2) + (نمو الأرباح ÷ 2) + (نمو الأصول ÷ 2) + (استقرار النمو ÷ 2)',
        variables: {
          'نمو الإيرادات': revenueGrowth,
          'نمو الأرباح': profitGrowth,
          'نمو الأصول': assetGrowth,
          'استقرار النمو': growthStability,
          'مؤشر التحليل الشامل للنمو': comprehensiveGrowthScore
        }
      },
      insights: [
        comprehensiveGrowthScore > 80 ? 'نمو شامل ممتاز يدل على نمو قوي ومستدام' : '',
        comprehensiveGrowthScore < 50 ? 'نمو شامل ضعيف قد يشير لمشاكل في النمو' : '',
        comprehensiveGrowthScore < 30 ? 'نمو شامل ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        comprehensiveGrowthScore < 60 ? 'تحسين النمو الشامل من خلال تحقيق نمو متوازن في جميع المؤشرات' : '',
        comprehensiveGrowthScore > 90 ? 'الحفاظ على النمو الشامل الممتاز' : '',
        'مراقبة اتجاهات النمو الشامل عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.comprehensiveGrowth ? {
        value: benchmarkData.comprehensiveGrowth.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Helper methods
  private rateComprehensiveScore(score: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 10 المتبقية...
  private calculateComprehensiveStabilityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('comprehensive-stability', 'التحليل الشامل للاستقرار');
  }

  private calculateComprehensivePerformanceAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('comprehensive-performance', 'التحليل الشامل للأداء');
  }

  private calculateComprehensiveMarketAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('comprehensive-market', 'التحليل الشامل للسوق');
  }

  private calculateComprehensiveStructuralAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('comprehensive-structural', 'التحليل الشامل للهيكل');
  }

  private calculateComprehensiveActivityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('comprehensive-activity', 'التحليل الشامل للنشاط');
  }

  private calculateComprehensiveRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('comprehensive-risk', 'التحليل الشامل للمخاطر');
  }

  private calculateComprehensiveValueAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('comprehensive-value', 'التحليل الشامل للقيمة');
  }

  private calculateComprehensiveSustainabilityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('comprehensive-sustainability', 'التحليل الشامل للاستدامة');
  }

  private calculateComprehensiveCompetitivenessAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('comprehensive-competitiveness', 'التحليل الشامل للتنافسية');
  }

  private calculateComprehensiveInnovationAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('comprehensive-innovation', 'التحليل الشامل للابتكار');
  }
}
