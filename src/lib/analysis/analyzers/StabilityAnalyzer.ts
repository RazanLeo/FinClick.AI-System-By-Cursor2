import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class StabilityAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. نسبة الاستقرار المالي
      results.push(this.calculateFinancialStabilityRatio(latestStatement, benchmarkData));
      
      // 2. نسبة الاستقرار التشغيلي
      results.push(this.calculateOperationalStabilityRatio(latestStatement, benchmarkData));
      
      // 3. نسبة الاستقرار الاستثماري
      results.push(this.calculateInvestmentStabilityRatio(latestStatement, benchmarkData));
      
      // 4. نسبة الاستقرار النقدي
      results.push(this.calculateCashStabilityRatio(latestStatement, benchmarkData));
      
      // 5. نسبة الاستقرار الائتماني
      results.push(this.calculateCreditStabilityRatio(latestStatement, benchmarkData));
      
      // 6. نسبة الاستقرار السوقي
      results.push(this.calculateMarketStabilityRatio(latestStatement, benchmarkData));
      
      // 7. نسبة الاستقرار الإداري
      results.push(this.calculateManagementStabilityRatio(latestStatement, benchmarkData));
      
      // 8. نسبة الاستقرار التقني
      results.push(this.calculateTechnicalStabilityRatio(latestStatement, benchmarkData));
      
      // 9. نسبة الاستقرار البيئي
      results.push(this.calculateEnvironmentalStabilityRatio(latestStatement, benchmarkData));
      
      // 10. نسبة الاستقرار الاجتماعي
      results.push(this.calculateSocialStabilityRatio(latestStatement, benchmarkData));
      
      // 11. نسبة الاستقرار الحوكمي
      results.push(this.calculateGovernanceStabilityRatio(latestStatement, benchmarkData));
      
      // 12. نسبة الاستقرار التنظيمي
      results.push(this.calculateRegulatoryStabilityRatio(latestStatement, benchmarkData));
      
      // 13. نسبة الاستقرار التنافسي
      results.push(this.calculateCompetitiveStabilityRatio(latestStatement, benchmarkData));
      
      // 14. نسبة الاستقرار المالي
      results.push(this.calculateFinancialStabilityRatio(latestStatement, benchmarkData));
      
      // 15. نسبة الاستقرار التشغيلي
      results.push(this.calculateOperationalStabilityRatio(latestStatement, benchmarkData));

      return results;
    } catch (error) {
      console.error('Stability Analysis Error:', error);
      return [this.createErrorResult('stability-error', 'خطأ في تحليل الاستقرار')];
    }
  }

  private calculateFinancialStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('financial-stability', 'نسبة الاستقرار المالي');
    }

    // حساب مؤشر الاستقرار المالي
    const debtToAssetsRatio = totalDebt / totalAssets;
    const equityToAssetsRatio = shareholdersEquity / totalAssets;
    const interestCoverageRatio = interestExpense > 0 ? operatingIncome / interestExpense : 10;
    
    // مؤشر الاستقرار المالي (0-100)
    const financialStabilityScore = Math.min(100, Math.max(0, 
      (equityToAssetsRatio * 40) + 
      ((1 - debtToAssetsRatio) * 30) + 
      (Math.min(interestCoverageRatio / 5, 1) * 30)
    ));

    return {
      id: 'financial-stability',
      name: 'نسبة الاستقرار المالي',
      category: 'stability',
      type: 'score',
      currentValue: financialStabilityScore,
      rating: this.rateStabilityScore(financialStabilityScore),
      interpretation: `نسبة الاستقرار المالي ${financialStabilityScore.toFixed(1)}% تعكس قوة الوضع المالي للشركة وقدرتها على الوفاء بالتزاماتها`,
      calculation: {
        formula: '(نسبة حقوق الملكية × 40%) + (نسبة الأصول غير الممولة بالديون × 30%) + (نسبة تغطية الفوائد × 30%)',
        variables: {
          'نسبة حقوق الملكية': equityToAssetsRatio,
          'نسبة الأصول غير الممولة بالديون': 1 - debtToAssetsRatio,
          'نسبة تغطية الفوائد': Math.min(interestCoverageRatio / 5, 1),
          'مؤشر الاستقرار المالي': financialStabilityScore
        }
      },
      insights: [
        financialStabilityScore > 80 ? 'استقرار مالي ممتاز يدل على قوة مالية جيدة' : '',
        financialStabilityScore < 50 ? 'استقرار مالي ضعيف قد يشير لمخاطر مالية' : '',
        financialStabilityScore < 30 ? 'استقرار مالي ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        financialStabilityScore < 60 ? 'تحسين الاستقرار المالي من خلال زيادة حقوق الملكية وتقليل الديون' : '',
        financialStabilityScore > 90 ? 'الحفاظ على الاستقرار المالي العالي' : '',
        'مراقبة اتجاهات الاستقرار المالي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.financialStability ? {
        value: benchmarkData.financialStability.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateOperationalStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const revenue = statement.incomeStatement.revenue || 0;
    const operatingExpenses = statement.incomeStatement.operatingExpenses || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (revenue === 0 || totalAssets === 0) {
      return this.createErrorResult('operational-stability', 'نسبة الاستقرار التشغيلي');
    }

    // حساب مؤشر الاستقرار التشغيلي
    const operatingMargin = operatingIncome / revenue;
    const assetTurnover = revenue / totalAssets;
    const expenseRatio = operatingExpenses / revenue;
    
    // مؤشر الاستقرار التشغيلي (0-100)
    const operationalStabilityScore = Math.min(100, Math.max(0,
      (operatingMargin * 40) +
      (Math.min(assetTurnover / 2, 1) * 30) +
      ((1 - expenseRatio) * 30)
    ));

    return {
      id: 'operational-stability',
      name: 'نسبة الاستقرار التشغيلي',
      category: 'stability',
      type: 'score',
      currentValue: operationalStabilityScore,
      rating: this.rateStabilityScore(operationalStabilityScore),
      interpretation: `نسبة الاستقرار التشغيلي ${operationalStabilityScore.toFixed(1)}% تعكس كفاءة العمليات التشغيلية للشركة`,
      calculation: {
        formula: '(الهامش التشغيلي × 40%) + (دوران الأصول × 30%) + (كفاءة المصروفات × 30%)',
        variables: {
          'الهامش التشغيلي': operatingMargin,
          'دوران الأصول': assetTurnover,
          'كفاءة المصروفات': 1 - expenseRatio,
          'مؤشر الاستقرار التشغيلي': operationalStabilityScore
        }
      },
      insights: [
        operationalStabilityScore > 80 ? 'استقرار تشغيلي ممتاز يدل على كفاءة عالية في العمليات' : '',
        operationalStabilityScore < 50 ? 'استقرار تشغيلي ضعيف قد يشير لمشاكل في العمليات' : '',
        operationalStabilityScore < 30 ? 'استقرار تشغيلي ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        operationalStabilityScore < 60 ? 'تحسين الاستقرار التشغيلي من خلال تحسين الكفاءة وتقليل التكاليف' : '',
        operationalStabilityScore > 90 ? 'الحفاظ على الاستقرار التشغيلي العالي' : '',
        'مراقبة اتجاهات الاستقرار التشغيلي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.operationalStability ? {
        value: benchmarkData.operationalStability.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateInvestmentStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const retainedEarnings = statement.balanceSheet.retainedEarnings || 0;
    
    if (totalAssets === 0 || shareholdersEquity === 0) {
      return this.createErrorResult('investment-stability', 'نسبة الاستقرار الاستثماري');
    }

    // حساب مؤشر الاستقرار الاستثماري
    const roa = netIncome / totalAssets;
    const roe = netIncome / shareholdersEquity;
    const retentionRatio = retainedEarnings / shareholdersEquity;
    
    // مؤشر الاستقرار الاستثماري (0-100)
    const investmentStabilityScore = Math.min(100, Math.max(0,
      (Math.min(roa * 20, 1) * 40) +
      (Math.min(roe * 10, 1) * 30) +
      (retentionRatio * 30)
    ));

    return {
      id: 'investment-stability',
      name: 'نسبة الاستقرار الاستثماري',
      category: 'stability',
      type: 'score',
      currentValue: investmentStabilityScore,
      rating: this.rateStabilityScore(investmentStabilityScore),
      interpretation: `نسبة الاستقرار الاستثماري ${investmentStabilityScore.toFixed(1)}% تعكس جودة الاستثمارات والعائد المتوقع`,
      calculation: {
        formula: '(العائد على الأصول × 40%) + (العائد على حقوق الملكية × 30%) + (نسبة الاحتجاز × 30%)',
        variables: {
          'العائد على الأصول': roa,
          'العائد على حقوق الملكية': roe,
          'نسبة الاحتجاز': retentionRatio,
          'مؤشر الاستقرار الاستثماري': investmentStabilityScore
        }
      },
      insights: [
        investmentStabilityScore > 80 ? 'استقرار استثماري ممتاز يدل على جودة عالية في الاستثمارات' : '',
        investmentStabilityScore < 50 ? 'استقرار استثماري ضعيف قد يشير لمشاكل في الاستثمارات' : '',
        investmentStabilityScore < 30 ? 'استقرار استثماري ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        investmentStabilityScore < 60 ? 'تحسين الاستقرار الاستثماري من خلال تحسين العائدات' : '',
        investmentStabilityScore > 90 ? 'الحفاظ على الاستقرار الاستثماري العالي' : '',
        'مراقبة اتجاهات الاستقرار الاستثماري عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.investmentStability ? {
        value: benchmarkData.investmentStability.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateCashStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const operatingCashFlow = statement.cashFlowStatement?.operatingCashFlow || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const cash = statement.balanceSheet.cash || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('cash-stability', 'نسبة الاستقرار النقدي');
    }

    // حساب مؤشر الاستقرار النقدي
    const cashFlowCoverage = currentLiabilities > 0 ? operatingCashFlow / currentLiabilities : 1;
    const cashRatio = cash / totalAssets;
    const cashFlowStability = Math.min(cashFlowCoverage / 2, 1);
    
    // مؤشر الاستقرار النقدي (0-100)
    const cashStabilityScore = Math.min(100, Math.max(0,
      (cashFlowStability * 50) +
      (cashRatio * 50)
    ));

    return {
      id: 'cash-stability',
      name: 'نسبة الاستقرار النقدي',
      category: 'stability',
      type: 'score',
      currentValue: cashStabilityScore,
      rating: this.rateStabilityScore(cashStabilityScore),
      interpretation: `نسبة الاستقرار النقدي ${cashStabilityScore.toFixed(1)}% تعكس قوة الوضع النقدي للشركة`,
      calculation: {
        formula: '(استقرار التدفق النقدي × 50%) + (نسبة النقدية × 50%)',
        variables: {
          'استقرار التدفق النقدي': cashFlowStability,
          'نسبة النقدية': cashRatio,
          'مؤشر الاستقرار النقدي': cashStabilityScore
        }
      },
      insights: [
        cashStabilityScore > 80 ? 'استقرار نقدي ممتاز يدل على قوة مالية جيدة' : '',
        cashStabilityScore < 50 ? 'استقرار نقدي ضعيف قد يشير لمشاكل في السيولة' : '',
        cashStabilityScore < 30 ? 'استقرار نقدي ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        cashStabilityScore < 60 ? 'تحسين الاستقرار النقدي من خلال زيادة التدفق النقدي والنقدية' : '',
        cashStabilityScore > 90 ? 'الحفاظ على الاستقرار النقدي العالي' : '',
        'مراقبة اتجاهات الاستقرار النقدي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.cashStability ? {
        value: benchmarkData.cashStability.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateCreditStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('credit-stability', 'نسبة الاستقرار الائتماني');
    }

    // حساب مؤشر الاستقرار الائتماني
    const debtToAssetsRatio = totalDebt / totalAssets;
    const interestCoverageRatio = interestExpense > 0 ? operatingIncome / interestExpense : 10;
    const creditQuality = Math.min(interestCoverageRatio / 5, 1);
    
    // مؤشر الاستقرار الائتماني (0-100)
    const creditStabilityScore = Math.min(100, Math.max(0,
      ((1 - debtToAssetsRatio) * 60) +
      (creditQuality * 40)
    ));

    return {
      id: 'credit-stability',
      name: 'نسبة الاستقرار الائتماني',
      category: 'stability',
      type: 'score',
      currentValue: creditStabilityScore,
      rating: this.rateStabilityScore(creditStabilityScore),
      interpretation: `نسبة الاستقرار الائتماني ${creditStabilityScore.toFixed(1)}% تعكس جودة الائتمان وقدرة الشركة على الوفاء بالتزاماتها`,
      calculation: {
        formula: '(نسبة الأصول غير الممولة بالديون × 60%) + (جودة الائتمان × 40%)',
        variables: {
          'نسبة الأصول غير الممولة بالديون': 1 - debtToAssetsRatio,
          'جودة الائتمان': creditQuality,
          'مؤشر الاستقرار الائتماني': creditStabilityScore
        }
      },
      insights: [
        creditStabilityScore > 80 ? 'استقرار ائتماني ممتاز يدل على جودة عالية في الائتمان' : '',
        creditStabilityScore < 50 ? 'استقرار ائتماني ضعيف قد يشير لمخاطر ائتمانية' : '',
        creditStabilityScore < 30 ? 'استقرار ائتماني ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        creditStabilityScore < 60 ? 'تحسين الاستقرار الائتماني من خلال تقليل الديون وتحسين التدفق النقدي' : '',
        creditStabilityScore > 90 ? 'الحفاظ على الاستقرار الائتماني العالي' : '',
        'مراقبة اتجاهات الاستقرار الائتماني عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.creditStability ? {
        value: benchmarkData.creditStability.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Helper methods
  private rateStabilityScore(score: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 10 المتبقية...
  private calculateMarketStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('market-stability', 'نسبة الاستقرار السوقي');
  }

  private calculateManagementStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('management-stability', 'نسبة الاستقرار الإداري');
  }

  private calculateTechnicalStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('technical-stability', 'نسبة الاستقرار التقني');
  }

  private calculateEnvironmentalStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('environmental-stability', 'نسبة الاستقرار البيئي');
  }

  private calculateSocialStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('social-stability', 'نسبة الاستقرار الاجتماعي');
  }

  private calculateGovernanceStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('governance-stability', 'نسبة الاستقرار الحوكمي');
  }

  private calculateRegulatoryStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('regulatory-stability', 'نسبة الاستقرار التنظيمي');
  }

  private calculateCompetitiveStabilityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('competitive-stability', 'نسبة الاستقرار التنافسي');
  }
}
