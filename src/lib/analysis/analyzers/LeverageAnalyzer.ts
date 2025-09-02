import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class LeverageAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. نسبة الدين إلى إجمالي الأصول
      results.push(this.calculateDebtToAssetsRatio(latestStatement, benchmarkData));
      
      // 2. نسبة الدين إلى حقوق الملكية
      results.push(this.calculateDebtToEquityRatio(latestStatement, benchmarkData));
      
      // 3. نسبة تغطية الفوائد
      results.push(this.calculateInterestCoverageRatio(latestStatement, benchmarkData));
      
      // 4. نسبة تغطية خدمة الدين
      results.push(this.calculateDebtServiceCoverageRatio(latestStatement, benchmarkData));
      
      // 5. نسبة حقوق الملكية إلى الأصول
      results.push(this.calculateEquityToAssetsRatio(latestStatement, benchmarkData));
      
      // 6. نسبة الدين إلى رأس المال
      results.push(this.calculateDebtToCapitalRatio(latestStatement, benchmarkData));
      
      // 7. نسبة الدين إلى الأرباح
      results.push(this.calculateDebtToEarningsRatio(latestStatement, benchmarkData));
      
      // 8. نسبة الدين إلى التدفق النقدي
      results.push(this.calculateDebtToCashFlowRatio(latestStatement, benchmarkData));
      
      // 9. نسبة الدين إلى المبيعات
      results.push(this.calculateDebtToSalesRatio(latestStatement, benchmarkData));
      
      // 10. نسبة الدين إلى الأصول الثابتة
      results.push(this.calculateDebtToFixedAssetsRatio(latestStatement, benchmarkData));
      
      // 11. نسبة الدين إلى الأصول المتداولة
      results.push(this.calculateDebtToCurrentAssetsRatio(latestStatement, benchmarkData));
      
      // 12. نسبة الدين إلى الأصول غير المتداولة
      results.push(this.calculateDebtToNonCurrentAssetsRatio(latestStatement, benchmarkData));
      
      // 13. نسبة الدين إلى الأصول الملموسة
      results.push(this.calculateDebtToTangibleAssetsRatio(latestStatement, benchmarkData));
      
      // 14. نسبة الدين إلى الأصول غير الملموسة
      results.push(this.calculateDebtToIntangibleAssetsRatio(latestStatement, benchmarkData));
      
      // 15. نسبة الدين إلى الأصول الاستثمارية
      results.push(this.calculateDebtToInvestmentAssetsRatio(latestStatement, benchmarkData));
      
      // 16. نسبة الدين إلى الأصول المالية
      results.push(this.calculateDebtToFinancialAssetsRatio(latestStatement, benchmarkData));
      
      // 17. نسبة الدين إلى الأصول التشغيلية
      results.push(this.calculateDebtToOperatingAssetsRatio(latestStatement, benchmarkData));
      
      // 18. نسبة الدين إلى الأصول الصافية
      results.push(this.calculateDebtToNetAssetsRatio(latestStatement, benchmarkData));

      return results;
    } catch (error) {
      console.error('Leverage Analysis Error:', error);
      return [this.createErrorResult('leverage-error', 'خطأ في تحليل الرفع المالي')];
    }
  }

  private calculateDebtToAssetsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('debt-to-assets', 'نسبة الدين إلى إجمالي الأصول');
    }

    const debtToAssetsRatio = (totalDebt / totalAssets) * 100;

    return {
      id: 'debt-to-assets',
      name: 'نسبة الدين إلى إجمالي الأصول',
      category: 'leverage',
      type: 'percentage',
      currentValue: debtToAssetsRatio,
      rating: this.rateDebtToAssets(debtToAssetsRatio),
      interpretation: `نسبة الدين إلى إجمالي الأصول ${debtToAssetsRatio.toFixed(2)}% تعني أن ${debtToAssetsRatio.toFixed(1)}% من الأصول ممولة بالديون`,
      calculation: {
        formula: '(إجمالي الديون ÷ إجمالي الأصول) × 100',
        variables: {
          'إجمالي الديون': totalDebt,
          'إجمالي الأصول': totalAssets,
          'الديون قصيرة الأجل': statement.balanceSheet.currentLiabilities || 0,
          'الديون طويلة الأجل': statement.balanceSheet.longTermDebt || 0
        }
      },
      insights: [
        debtToAssetsRatio < 30 ? 'مستوى ديون منخفض يدل على قوة مالية جيدة' : '',
        debtToAssetsRatio > 60 ? 'مستوى ديون عالي قد يشير لمخاطر مالية' : '',
        debtToAssetsRatio > 80 ? 'مستوى ديون عالي جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        debtToAssetsRatio > 50 ? 'تقليل مستوى الديون أو زيادة الأصول' : '',
        debtToAssetsRatio < 20 ? 'النظر في الاستفادة من الرافعة المالية للنمو' : '',
        'مراقبة اتجاهات نسبة الدين إلى الأصول عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.debtToAssets ? {
        value: benchmarkData.debtToAssets.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateDebtToEquityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    
    if (shareholdersEquity === 0) {
      return this.createErrorResult('debt-to-equity', 'نسبة الدين إلى حقوق الملكية');
    }

    const debtToEquityRatio = totalDebt / shareholdersEquity;

    return {
      id: 'debt-to-equity',
      name: 'نسبة الدين إلى حقوق الملكية',
      category: 'leverage',
      type: 'ratio',
      currentValue: debtToEquityRatio,
      rating: this.rateDebtToEquity(debtToEquityRatio),
      interpretation: `نسبة الدين إلى حقوق الملكية ${debtToEquityRatio.toFixed(2)} تعني أن كل ريال من حقوق الملكية يقابله ${debtToEquityRatio.toFixed(2)} ريال من الديون`,
      calculation: {
        formula: 'إجمالي الديون ÷ حقوق الملكية',
        variables: {
          'إجمالي الديون': totalDebt,
          'حقوق الملكية': shareholdersEquity,
          'الديون قصيرة الأجل': statement.balanceSheet.currentLiabilities || 0,
          'الديون طويلة الأجل': statement.balanceSheet.longTermDebt || 0
        }
      },
      insights: [
        debtToEquityRatio < 0.5 ? 'مستوى ديون منخفض يدل على قوة مالية جيدة' : '',
        debtToEquityRatio > 2 ? 'مستوى ديون عالي قد يشير لمخاطر مالية' : '',
        debtToEquityRatio > 3 ? 'مستوى ديون عالي جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        debtToEquityRatio > 1.5 ? 'تقليل مستوى الديون أو زيادة حقوق الملكية' : '',
        debtToEquityRatio < 0.3 ? 'النظر في الاستفادة من الرافعة المالية للنمو' : '',
        'مراقبة اتجاهات نسبة الدين إلى حقوق الملكية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.debtToEquity ? {
        value: benchmarkData.debtToEquity.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateInterestCoverageRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    
    if (interestExpense === 0) {
      return this.createErrorResult('interest-coverage', 'نسبة تغطية الفوائد');
    }

    const interestCoverageRatio = operatingIncome / interestExpense;

    return {
      id: 'interest-coverage',
      name: 'نسبة تغطية الفوائد',
      category: 'leverage',
      type: 'ratio',
      currentValue: interestCoverageRatio,
      rating: this.rateInterestCoverage(interestCoverageRatio),
      interpretation: `نسبة تغطية الفوائد ${interestCoverageRatio.toFixed(2)} تعني أن الشركة تستطيع تغطية مصروفات الفوائد ${interestCoverageRatio.toFixed(1)} مرة من الأرباح التشغيلية`,
      calculation: {
        formula: 'الأرباح التشغيلية ÷ مصروفات الفوائد',
        variables: {
          'الأرباح التشغيلية': operatingIncome,
          'مصروفات الفوائد': interestExpense
        }
      },
      insights: [
        interestCoverageRatio > 5 ? 'قدرة ممتازة على تغطية مصروفات الفوائد' : '',
        interestCoverageRatio < 2.5 ? 'قدرة محدودة على تغطية مصروفات الفوائد' : '',
        interestCoverageRatio < 1 ? 'عدم القدرة على تغطية مصروفات الفوائد' : ''
      ].filter(Boolean),
      recommendations: [
        interestCoverageRatio < 3 ? 'تحسين الأرباح التشغيلية أو تقليل مصروفات الفوائد' : '',
        interestCoverageRatio > 10 ? 'النظر في الاستفادة من الرافعة المالية' : '',
        'مراقبة اتجاهات نسبة تغطية الفوائد عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.interestCoverage ? {
        value: benchmarkData.interestCoverage.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateDebtServiceCoverageRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    const principalPayments = (statement.balanceSheet.currentLiabilities || 0) * 0.1; // افتراضي 10% من الديون قصيرة الأجل
    const totalDebtService = interestExpense + principalPayments;
    
    if (totalDebtService === 0) {
      return this.createErrorResult('debt-service-coverage', 'نسبة تغطية خدمة الدين');
    }

    const debtServiceCoverageRatio = operatingIncome / totalDebtService;

    return {
      id: 'debt-service-coverage',
      name: 'نسبة تغطية خدمة الدين',
      category: 'leverage',
      type: 'ratio',
      currentValue: debtServiceCoverageRatio,
      rating: this.rateDebtServiceCoverage(debtServiceCoverageRatio),
      interpretation: `نسبة تغطية خدمة الدين ${debtServiceCoverageRatio.toFixed(2)} تعني أن الشركة تستطيع تغطية خدمة الدين ${debtServiceCoverageRatio.toFixed(1)} مرة من الأرباح التشغيلية`,
      calculation: {
        formula: 'الأرباح التشغيلية ÷ خدمة الدين الإجمالية',
        variables: {
          'الأرباح التشغيلية': operatingIncome,
          'مصروفات الفوائد': interestExpense,
          'أقساط الدين': principalPayments,
          'خدمة الدين الإجمالية': totalDebtService
        }
      },
      insights: [
        debtServiceCoverageRatio > 2.5 ? 'قدرة ممتازة على تغطية خدمة الدين' : '',
        debtServiceCoverageRatio < 1.5 ? 'قدرة محدودة على تغطية خدمة الدين' : '',
        debtServiceCoverageRatio < 1 ? 'عدم القدرة على تغطية خدمة الدين' : ''
      ].filter(Boolean),
      recommendations: [
        debtServiceCoverageRatio < 2 ? 'تحسين الأرباح التشغيلية أو إعادة هيكلة الديون' : '',
        debtServiceCoverageRatio > 5 ? 'النظر في الاستفادة من الرافعة المالية' : '',
        'مراقبة اتجاهات نسبة تغطية خدمة الدين عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.debtServiceCoverage ? {
        value: benchmarkData.debtServiceCoverage.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateEquityToAssetsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('equity-to-assets', 'نسبة حقوق الملكية إلى الأصول');
    }

    const equityToAssetsRatio = (shareholdersEquity / totalAssets) * 100;

    return {
      id: 'equity-to-assets',
      name: 'نسبة حقوق الملكية إلى الأصول',
      category: 'leverage',
      type: 'percentage',
      currentValue: equityToAssetsRatio,
      rating: this.rateEquityToAssets(equityToAssetsRatio),
      interpretation: `نسبة حقوق الملكية إلى الأصول ${equityToAssetsRatio.toFixed(2)}% تعني أن ${equityToAssetsRatio.toFixed(1)}% من الأصول ممولة بحقوق الملكية`,
      calculation: {
        formula: '(حقوق الملكية ÷ إجمالي الأصول) × 100',
        variables: {
          'حقوق الملكية': shareholdersEquity,
          'إجمالي الأصول': totalAssets
        }
      },
      insights: [
        equityToAssetsRatio > 50 ? 'قوة مالية ممتازة مع اعتماد منخفض على الديون' : '',
        equityToAssetsRatio < 30 ? 'اعتماد عالي على الديون قد يشير لمخاطر مالية' : '',
        equityToAssetsRatio < 20 ? 'اعتماد عالي جداً على الديون يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        equityToAssetsRatio < 40 ? 'زيادة حقوق الملكية أو تقليل الأصول' : '',
        equityToAssetsRatio > 70 ? 'النظر في الاستفادة من الرافعة المالية' : '',
        'مراقبة اتجاهات نسبة حقوق الملكية إلى الأصول عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.equityToAssets ? {
        value: benchmarkData.equityToAssets.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateDebtToCapitalRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const totalCapital = totalDebt + shareholdersEquity;
    
    if (totalCapital === 0) {
      return this.createErrorResult('debt-to-capital', 'نسبة الدين إلى رأس المال');
    }

    const debtToCapitalRatio = (totalDebt / totalCapital) * 100;

    return {
      id: 'debt-to-capital',
      name: 'نسبة الدين إلى رأس المال',
      category: 'leverage',
      type: 'percentage',
      currentValue: debtToCapitalRatio,
      rating: this.rateDebtToCapital(debtToCapitalRatio),
      interpretation: `نسبة الدين إلى رأس المال ${debtToCapitalRatio.toFixed(2)}% تعني أن ${debtToCapitalRatio.toFixed(1)}% من رأس المال ممول بالديون`,
      calculation: {
        formula: '(إجمالي الديون ÷ إجمالي رأس المال) × 100',
        variables: {
          'إجمالي الديون': totalDebt,
          'حقوق الملكية': shareholdersEquity,
          'إجمالي رأس المال': totalCapital
        }
      },
      insights: [
        debtToCapitalRatio < 40 ? 'هيكل رأس مال متوازن مع اعتماد معتدل على الديون' : '',
        debtToCapitalRatio > 60 ? 'اعتماد عالي على الديون قد يشير لمخاطر مالية' : '',
        debtToCapitalRatio > 80 ? 'اعتماد عالي جداً على الديون يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        debtToCapitalRatio > 50 ? 'تقليل مستوى الديون أو زيادة حقوق الملكية' : '',
        debtToCapitalRatio < 30 ? 'النظر في الاستفادة من الرافعة المالية' : '',
        'مراقبة اتجاهات نسبة الدين إلى رأس المال عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.debtToCapital ? {
        value: benchmarkData.debtToCapital.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Helper methods for rating
  private rateDebtToAssets(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio <= 30) return 'excellent';
    if (ratio <= 50) return 'good';
    if (ratio <= 70) return 'average';
    return 'poor';
  }

  private rateDebtToEquity(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio <= 0.5) return 'excellent';
    if (ratio <= 1) return 'good';
    if (ratio <= 2) return 'average';
    return 'poor';
  }

  private rateInterestCoverage(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 5) return 'excellent';
    if (ratio >= 2.5) return 'good';
    if (ratio >= 1.5) return 'average';
    return 'poor';
  }

  private rateDebtServiceCoverage(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 2.5) return 'excellent';
    if (ratio >= 1.5) return 'good';
    if (ratio >= 1.2) return 'average';
    return 'poor';
  }

  private rateEquityToAssets(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 50) return 'excellent';
    if (ratio >= 40) return 'good';
    if (ratio >= 30) return 'average';
    return 'poor';
  }

  private rateDebtToCapital(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio <= 40) return 'excellent';
    if (ratio <= 60) return 'good';
    if (ratio <= 80) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 12 المتبقية...
  private calculateDebtToEarningsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-earnings', 'نسبة الدين إلى الأرباح');
  }

  private calculateDebtToCashFlowRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-cash-flow', 'نسبة الدين إلى التدفق النقدي');
  }

  private calculateDebtToSalesRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-sales', 'نسبة الدين إلى المبيعات');
  }

  private calculateDebtToFixedAssetsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-fixed-assets', 'نسبة الدين إلى الأصول الثابتة');
  }

  private calculateDebtToCurrentAssetsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-current-assets', 'نسبة الدين إلى الأصول المتداولة');
  }

  private calculateDebtToNonCurrentAssetsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-non-current-assets', 'نسبة الدين إلى الأصول غير المتداولة');
  }

  private calculateDebtToTangibleAssetsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-tangible-assets', 'نسبة الدين إلى الأصول الملموسة');
  }

  private calculateDebtToIntangibleAssetsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-intangible-assets', 'نسبة الدين إلى الأصول غير الملموسة');
  }

  private calculateDebtToInvestmentAssetsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-investment-assets', 'نسبة الدين إلى الأصول الاستثمارية');
  }

  private calculateDebtToFinancialAssetsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-financial-assets', 'نسبة الدين إلى الأصول المالية');
  }

  private calculateDebtToOperatingAssetsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-operating-assets', 'نسبة الدين إلى الأصول التشغيلية');
  }

  private calculateDebtToNetAssetsRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('debt-to-net-assets', 'نسبة الدين إلى الأصول الصافية');
  }
}