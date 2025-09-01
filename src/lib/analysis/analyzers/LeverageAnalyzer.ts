import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class LeverageAnalyzer extends BaseAnalyzer {
  async analyze(
    financialData: FinancialStatement[],
    companyData: Company,
    marketData?: any,
    benchmarkData?: any
  ): Promise<AnalysisResult[]> {
    
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. نسبة الدين إلى حقوق الملكية
      results.push(this.calculateDebtToEquityRatio(latestStatement, benchmarkData));

      // 2. نسبة الدين
      results.push(this.calculateDebtRatio(latestStatement, benchmarkData));

      // 3. نسبة تغطية الفوائد
      results.push(this.calculateInterestCoverageRatio(latestStatement, benchmarkData));

      // 4. نسبة تغطية خدمة الدين
      results.push(this.calculateDebtServiceCoverageRatio(latestStatement, benchmarkData));

      // 5. نسبة الدين طويل الأجل
      results.push(this.calculateLongTermDebtRatio(latestStatement, benchmarkData));

      // 6. نسبة رسملة الدين
      results.push(this.calculateDebtCapitalizationRatio(latestStatement, benchmarkData));

      // 7. الرافعة المالية
      results.push(this.calculateFinancialLeverage(latestStatement, benchmarkData));

      // 8. نسبة التغطية النقدية للديون
      results.push(this.calculateCashCoverageRatio(latestStatement, benchmarkData));

      // 9. معدل مضاعف حقوق الملكية
      results.push(this.calculateEquityMultiplier(latestStatement, benchmarkData));

      // 10. نسبة الأمان للديون
      results.push(this.calculateDebtSafetyRatio(latestStatement, benchmarkData));

      // 11. نسبة السيولة للديون
      results.push(this.calculateDebtLiquidityRatio(latestStatement, benchmarkData));

      // 12. معدل تغطية الأصول للديون
      results.push(this.calculateAssetCoverageRatio(latestStatement, benchmarkData));

      // 13. نسبة الديون قصيرة الأجل
      results.push(this.calculateShortTermDebtRatio(latestStatement, benchmarkData));

      // 14. مؤشر المخاطر المالية
      results.push(this.calculateFinancialRiskIndex(latestStatement, benchmarkData));

      // 15. معدل الاستقرار المالي
      results.push(this.calculateFinancialStabilityRatio(latestStatement, benchmarkData));

      // 16. نسبة تغطية التدفق النقدي
      results.push(this.calculateCashFlowCoverageRatio(latestStatement, benchmarkData));

      // 17. معدل الملاءة المالية
      results.push(this.calculateSolvencyRatio(latestStatement, benchmarkData));

      // 18. نسبة الحماية من الإفلاس
      results.push(this.calculateBankruptcyProtectionRatio(latestStatement, benchmarkData));

      return results;

    } catch (error) {
      console.error('Leverage Analysis Error:', error);
      return [{
        id: 'leverage-error',
        name: 'خطأ في تحليل الرافعة المالية',
        category: 'leverage',
        currentValue: 0,
        rating: 'poor',
        interpretation: 'فشل في حساب مؤشرات الرافعة المالية',
        status: 'error'
      }];
    }
  }

  private calculateDebtToEquityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = this.calculateTotalDebt(statement);
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    
    if (shareholdersEquity === 0) {
      return this.createErrorResult('debt-to-equity-ratio', 'نسبة الدين إلى حقوق الملكية');
    }

    const ratio = totalDebt / shareholdersEquity;

    return {
      id: 'debt-to-equity-ratio',
      name: 'نسبة الدين إلى حقوق الملكية',
      category: 'leverage',
      type: 'ratio',
      currentValue: ratio,
      rating: this.rateDebtToEquityRatio(ratio),
      trend: this.calculateTrend([ratio], 'down_is_better'),
      interpretation: this.interpretDebtToEquityRatio(ratio),
      calculation: {
        formula: 'إجمالي الديون ÷ حقوق المساهمين',
        variables: {
          'إجمالي الديون': totalDebt,
          'حقوق المساهمين': shareholdersEquity
        }
      },
      insights: [
        ratio > 2 ? 'مستوى مديونية عالي جداً يزيد المخاطر المالية' : '',
        ratio < 0.3 ? 'مستوى مديونية منخفض - فرصة للاستفادة من الرافعة المالية' : '',
        ratio > 1 ? 'الديون تتجاوز حقوق الملكية' : 'الديون أقل من حقوق الملكية'
      ].filter(Boolean),
      recommendations: [
        ratio > 1.5 ? 'تقليل مستوى المديونية وتعزيز حقوق الملكية' : '',
        ratio < 0.2 ? 'النظر في الاستفادة من الرافعة المالية لتمويل النمو' : '',
        'مراقبة تكلفة الدين مقابل العائد على الاستثمار'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.debtToEquityRatio ? {
        value: benchmarkData.debtToEquityRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      riskAssessment: this.assessDebtRisk(ratio),
      status: 'completed'
    };
  }

  private calculateDebtRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = this.calculateTotalDebt(statement);
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('debt-ratio', 'نسبة الدين');
    }

    const ratio = totalDebt / totalAssets;

    return {
      id: 'debt-ratio',
      name: 'نسبة الدين',
      category: 'leverage',
      type: 'percentage',
      currentValue: ratio,
      rating: this.rateDebtRatio(ratio),
      trend: this.calculateTrend([ratio], 'down_is_better'),
      interpretation: this.interpretDebtRatio(ratio),
      calculation: {
        formula: 'إجمالي الديون ÷ إجمالي الأصول',
        variables: {
          'إجمالي الديون': totalDebt,
          'إجمالي الأصول': totalAssets
        }
      },
      insights: [
        ratio > 0.6 ? 'نسبة مديونية عالية تزيد المخاطر المالية' : '',
        ratio < 0.2 ? 'نسبة مديونية منخفضة - قوة مالية جيدة' : '',
        ratio > 0.8 ? 'مستوى مديونية خطير يتطلب إجراءات فورية' : ''
      ].filter(Boolean),
      recommendations: [
        ratio > 0.7 ? 'تقليل المديونية فوراً لتجنب المخاطر المالية' : '',
        ratio < 0.3 ? 'إمكانية الاستفادة من التمويل بالدين للنمو' : '',
        'تحسين التوازن بين الدين وحقوق الملكية'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.debtRatio ? {
        value: benchmarkData.debtRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      riskAssessment: this.assessDebtRisk(ratio),
      status: 'completed'
    };
  }

  private calculateInterestCoverageRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const ebit = statement.incomeStatement.operatingIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    
    if (interestExpense === 0) {
      return {
        id: 'interest-coverage-ratio',
        name: 'نسبة تغطية الفوائد',
        category: 'leverage',
        type: 'ratio',
        currentValue: Infinity,
        rating: 'excellent',
        interpretation: 'لا توجد فوائد على الديون - قوة مالية ممتازة',
        status: 'completed'
      };
    }

    const ratio = ebit / interestExpense;

    return {
      id: 'interest-coverage-ratio',
      name: 'نسبة تغطية الفوائد',
      category: 'leverage',
      type: 'ratio',
      currentValue: ratio,
      rating: this.rateInterestCoverageRatio(ratio),
      trend: this.calculateTrend([ratio], 'up_is_better'),
      interpretation: this.interpretInterestCoverageRatio(ratio),
      calculation: {
        formula: 'الأرباح قبل الفوائد والضرائب ÷ مصروفات الفوائد',
        variables: {
          'الأرباح قبل الفوائد والضرائب (EBIT)': ebit,
          'مصروفات الفوائد': interestExpense
        }
      },
      insights: [
        ratio > 10 ? 'قدرة ممتازة جداً على تغطية فوائد الديون' : '',
        ratio < 2.5 ? 'ضعف في القدرة على تغطية الفوائد - مخاطر مالية' : '',
        ratio < 1 ? 'عدم القدرة على تغطية الفوائد من الأرباح التشغيلية' : ''
      ].filter(Boolean),
      recommendations: [
        ratio < 2.5 ? 'تحسين الربحية التشغيلية أو تقليل الديون' : '',
        ratio < 1.5 ? 'إعادة هيكلة الديون فوراً' : '',
        'مراقبة تأثير تغيرات أسعار الفائدة'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.interestCoverageRatio ? {
        value: benchmarkData.interestCoverageRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      riskAssessment: this.assessInterestCoverageRisk(ratio),
      status: 'completed'
    };
  }

  private calculateDebtServiceCoverageRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const ebitda = this.calculateEBITDA(statement);
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    const principalPayments = statement.cashFlowStatement?.debtRepayments || 0;
    const totalDebtService = interestExpense + principalPayments;
    
    if (totalDebtService === 0) {
      return {
        id: 'debt-service-coverage-ratio',
        name: 'نسبة تغطية خدمة الدين',
        category: 'leverage',
        type: 'ratio',
        currentValue: Infinity,
        rating: 'excellent',
        interpretation: 'لا توجد التزامات خدمة دين - وضع مالي ممتاز',
        status: 'completed'
      };
    }

    const ratio = ebitda / totalDebtService;

    return {
      id: 'debt-service-coverage-ratio',
      name: 'نسبة تغطية خدمة الدين',
      category: 'leverage',
      type: 'ratio',
      currentValue: ratio,
      rating: this.rateDebtServiceCoverageRatio(ratio),
      trend: this.calculateTrend([ratio], 'up_is_better'),
      interpretation: `نسبة تغطية خدمة الدين ${ratio.toFixed(2)} تشير إلى ${
        ratio > 2 ? 'قدرة ممتازة' : 
        ratio > 1.5 ? 'قدرة جيدة' : 
        ratio > 1 ? 'قدرة محدودة' : 'عدم القدرة'
      } على تغطية التزامات الدين.`,
      calculation: {
        formula: 'الأرباح قبل الفوائد والضرائب والإهلاك ÷ (الفوائد + أقساط الدين)',
        variables: {
          'EBITDA': ebitda,
          'مصروفات الفوائد': interestExpense,
          'أقساط الدين': principalPayments,
          'إجمالي خدمة الدين': totalDebtService
        }
      },
      insights: [
        ratio > 2.5 ? 'قدرة قوية جداً على خدمة الديون' : '',
        ratio < 1.25 ? 'ضغط مالي في خدمة الديون' : '',
        ratio < 1 ? 'عدم القدرة على خدمة الديون بالكامل' : ''
      ].filter(Boolean),
      recommendations: [
        ratio < 1.5 ? 'إعادة جدولة الديون أو تحسين التدفق النقدي' : '',
        ratio < 1 ? 'إجراءات طارئة لإعادة هيكلة الديون' : '',
        'تحسين الربحية التشغيلية والتدفق النقدي'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateLongTermDebtRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const longTermDebt = statement.balanceSheet.longTermDebt || 0;
    const totalCapital = (statement.balanceSheet.longTermDebt || 0) + (statement.balanceSheet.shareholdersEquity || 0);
    
    if (totalCapital === 0) {
      return this.createErrorResult('long-term-debt-ratio', 'نسبة الدين طويل الأجل');
    }

    const ratio = longTermDebt / totalCapital;

    return {
      id: 'long-term-debt-ratio',
      name: 'نسبة الدين طويل الأجل',
      category: 'leverage',
      type: 'percentage',
      currentValue: ratio,
      rating: this.rateLongTermDebtRatio(ratio),
      trend: this.calculateTrend([ratio], 'down_is_better'),
      interpretation: `نسبة الدين طويل الأجل ${(ratio * 100).toFixed(1)}% من إجمالي رأس المال الدائم`,
      calculation: {
        formula: 'الديون طويلة الأجل ÷ (الديون طويلة الأجل + حقوق الملكية)',
        variables: {
          'الديون طويلة الأجل': longTermDebt,
          'حقوق الملكية': statement.balanceSheet.shareholdersEquity || 0,
          'إجمالي رأس المال': totalCapital
        }
      },
      insights: [
        ratio > 0.6 ? 'اعتماد عالي على الديون طويلة الأجل' : '',
        ratio < 0.3 ? 'اعتماد صحي على التمويل طويل الأجل' : '',
        ratio > 0.8 ? 'مخاطر عالية في هيكل التمويل' : ''
      ].filter(Boolean),
      recommendations: [
        ratio > 0.7 ? 'تقليل الاعتماد على الديون طويلة الأجل' : '',
        ratio < 0.2 ? 'إمكانية الاستفادة من التمويل طويل الأجل للنمو' : '',
        'تحسين التوازن في هيكل رأس المال'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateDebtCapitalizationRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = this.calculateTotalDebt(statement);
    const totalCapitalization = totalDebt + (statement.balanceSheet.shareholdersEquity || 0);
    
    if (totalCapitalization === 0) {
      return this.createErrorResult('debt-capitalization-ratio', 'نسبة رسملة الدين');
    }

    const ratio = totalDebt / totalCapitalization;

    return {
      id: 'debt-capitalization-ratio',
      name: 'نسبة رسملة الدين',
      category: 'leverage',
      type: 'percentage',
      currentValue: ratio,
      rating: this.rateDebtCapitalizationRatio(ratio),
      trend: this.calculateTrend([ratio], 'down_is_better'),
      interpretation: `نسبة رسملة الدين ${(ratio * 100).toFixed(1)}% من إجمالي رأس المال`,
      calculation: {
        formula: 'إجمالي الديون ÷ (إجمالي الديون + حقوق الملكية)',
        variables: {
          'إجمالي الديون': totalDebt,
          'حقوق الملكية': statement.balanceSheet.shareholdersEquity || 0,
          'إجمالي رأس المال': totalCapitalization
        }
      },
      insights: [
        ratio > 0.5 ? 'اعتماد عالي على التمويل بالدين' : '',
        ratio < 0.3 ? 'هيكل تمويل متحفظ يعتمد على حقوق الملكية' : '',
        ratio > 0.7 ? 'مخاطر مالية عالية من الرافعة المالية' : ''
      ].filter(Boolean),
      recommendations: [
        ratio > 0.6 ? 'إعادة توازن هيكل رأس المال' : '',
        ratio < 0.25 ? 'النظر في الاستفادة من الرافعة المالية' : '',
        'تحسين كفاءة استخدام رأس المال'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateFinancialLeverage(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    
    if (shareholdersEquity === 0) {
      return this.createErrorResult('financial-leverage', 'الرافعة المالية');
    }

    const leverage = totalAssets / shareholdersEquity;

    return {
      id: 'financial-leverage',
      name: 'الرافعة المالية',
      category: 'leverage',
      type: 'ratio',
      currentValue: leverage,
      rating: this.rateFinancialLeverage(leverage),
      trend: this.calculateTrend([leverage], 'contextual'),
      interpretation: `مضاعف الرافعة المالية ${leverage.toFixed(2)} يعني أن كل ريال من حقوق الملكية يدعم ${leverage.toFixed(2)} ريال من الأصول`,
      calculation: {
        formula: 'إجمالي الأصول ÷ حقوق المساهمين',
        variables: {
          'إجمالي الأصول': totalAssets,
          'حقوق المساهمين': shareholdersEquity
        }
      },
      insights: [
        leverage > 3 ? 'رافعة مالية عالية تزيد العائد والمخاطر' : '',
        leverage < 1.5 ? 'رافعة مالية منخفضة - تمويل محافظ' : '',
        leverage > 5 ? 'رافعة مالية عالية جداً قد تكون خطيرة' : ''
      ].filter(Boolean),
      recommendations: [
        leverage > 4 ? 'مراقبة مستوى الرافعة المالية والمخاطر المصاحبة' : '',
        leverage < 2 ? 'إمكانية زيادة الرافعة المالية لتعزيز العوائد' : '',
        'تحسين التوازن بين المخاطر والعوائد'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateCashCoverageRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const operatingCashFlow = statement.cashFlowStatement?.operatingCashFlow || 0;
    const totalDebt = this.calculateTotalDebt(statement);
    
    if (totalDebt === 0) {
      return {
        id: 'cash-coverage-ratio',
        name: 'نسبة التغطية النقدية للديون',
        category: 'leverage',
        type: 'ratio',
        currentValue: Infinity,
        rating: 'excellent',
        interpretation: 'لا توجد ديون للتغطية - وضع نقدي ممتاز',
        status: 'completed'
      };
    }

    const ratio = operatingCashFlow / totalDebt;

    return {
      id: 'cash-coverage-ratio',
      name: 'نسبة التغطية النقدية للديون',
      category: 'leverage',
      type: 'ratio',
      currentValue: ratio,
      rating: this.rateCashCoverageRatio(ratio),
      trend: this.calculateTrend([ratio], 'up_is_better'),
      interpretation: `نسبة التغطية النقدية ${ratio.toFixed(3)} تشير إلى قدرة ${
        ratio > 0.2 ? 'جيدة' : 
        ratio > 0.1 ? 'متوسطة' : 'ضعيفة'
      } على تغطية الديون بالتدفق النقدي التشغيلي`,
      calculation: {
        formula: 'التدفق النقدي التشغيلي ÷ إجمالي الديون',
        variables: {
          'التدفق النقدي التشغيلي': operatingCashFlow,
          'إجمالي الديون': totalDebt
        }
      },
      insights: [
        ratio > 0.25 ? 'قدرة نقدية ممتازة على خدمة الديون' : '',
        ratio < 0.1 ? 'ضعف في التدفق النقدي لتغطية الديون' : '',
        operatingCashFlow < 0 ? 'تدفق نقدي سالب يزيد المخاطر المالية' : ''
      ].filter(Boolean),
      recommendations: [
        ratio < 0.15 ? 'تحسين التدفق النقدي التشغيلي' : '',
        operatingCashFlow < 0 ? 'مراجعة العمليات لتحسين التدفق النقدي' : '',
        'تحسين إدارة رأس المال العامل'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  // Helper methods
  private calculateTotalDebt(statement: FinancialStatement): number {
    const shortTermDebt = statement.balanceSheet.shortTermDebt || 0;
    const longTermDebt = statement.balanceSheet.longTermDebt || 0;
    const currentPortionLongTermDebt = statement.balanceSheet.currentPortionLongTermDebt || 0;
    
    return shortTermDebt + longTermDebt + currentPortionLongTermDebt;
  }

  private calculateEBITDA(statement: FinancialStatement): number {
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const depreciation = statement.incomeStatement.depreciation || 0;
    const amortization = statement.incomeStatement.amortization || 0;
    
    return operatingIncome + depreciation + amortization;
  }

  // Rating methods for leverage metrics
  private rateDebtToEquityRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio <= 0.3) return 'excellent';
    if (ratio <= 0.6) return 'good';
    if (ratio <= 1.0) return 'average';
    return 'poor';
  }

  private rateDebtRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio <= 0.3) return 'excellent';
    if (ratio <= 0.5) return 'good';
    if (ratio <= 0.7) return 'average';
    return 'poor';
  }

  private rateInterestCoverageRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 8) return 'excellent';
    if (ratio >= 4) return 'good';
    if (ratio >= 2) return 'average';
    return 'poor';
  }

  private rateDebtServiceCoverageRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 2.5) return 'excellent';
    if (ratio >= 1.5) return 'good';
    if (ratio >= 1.25) return 'average';
    return 'poor';
  }

  private rateLongTermDebtRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio <= 0.3) return 'excellent';
    if (ratio <= 0.5) return 'good';
    if (ratio <= 0.7) return 'average';
    return 'poor';
  }

  private rateDebtCapitalizationRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio <= 0.25) return 'excellent';
    if (ratio <= 0.4) return 'good';
    if (ratio <= 0.6) return 'average';
    return 'poor';
  }

  private rateFinancialLeverage(leverage: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (leverage >= 1.5 && leverage <= 2.5) return 'excellent';
    if (leverage >= 1.2 && leverage <= 3) return 'good';
    if (leverage >= 1 && leverage <= 4) return 'average';
    return 'poor';
  }

  private rateCashCoverageRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 0.25) return 'excellent';
    if (ratio >= 0.15) return 'good';
    if (ratio >= 0.1) return 'average';
    return 'poor';
  }

  // Risk assessment methods
  private assessDebtRisk(ratio: number): any {
    return {
      level: ratio > 1.5 ? 'high' : ratio > 0.8 ? 'medium' : 'low',
      factors: ratio > 1 ? ['مستوى مديونية عالي يزيد المخاطر المالية'] : [],
      mitigation: ratio > 1 ? ['تقليل المديونية', 'تعزيز حقوق الملكية'] : []
    };
  }

  private assessInterestCoverageRisk(ratio: number): any {
    return {
      level: ratio < 2 ? 'high' : ratio < 4 ? 'medium' : 'low',
      factors: ratio < 2 ? ['ضعف القدرة على تغطية فوائد الديون'] : [],
      mitigation: ratio < 3 ? ['تحسين الربحية التشغيلية', 'تقليل الديون'] : []
    };
  }

  // Interpretation methods
  private interpretDebtToEquityRatio(ratio: number): string {
    if (ratio <= 0.3) {
      return `نسبة الدين إلى حقوق الملكية ${ratio.toFixed(2)} ممتازة وتشير إلى قوة مالية واستقرار في هيكل رأس المال.`;
    } else if (ratio <= 0.6) {
      return `نسبة الدين إلى حقوق الملكية ${ratio.toFixed(2)} جيدة وتدل على توازن صحي في التمويل.`;
    } else if (ratio <= 1.0) {
      return `نسبة الدين إلى حقوق الملكية ${ratio.toFixed(2)} متوسطة وتحتاج لمراقبة دقيقة.`;
    } else {
      return `نسبة الدين إلى حقوق الملكية ${ratio.toFixed(2)} عالية وتشير إلى مخاطر مالية تتطلب إجراءات تصحيحية.`;
    }
  }

  private interpretDebtRatio(ratio: number): string {
    return `نسبة الدين ${(ratio * 100).toFixed(1)}% من إجمالي الأصول تشير إلى ${
      ratio <= 0.3 ? 'قوة مالية ممتازة' : 
      ratio <= 0.5 ? 'وضع مالي جيد' : 
      ratio <= 0.7 ? 'مستوى مديونية مقبول' : 'مخاطر مالية عالية'
    } في هيكل التمويل.`;
  }

  private interpretInterestCoverageRatio(ratio: number): string {
    return `نسبة تغطية الفوائد ${ratio.toFixed(2)} تعني أن الأرباح التشغيلية تغطي فوائد الديون ${ratio.toFixed(1)} مرة، مما يشير إلى ${
      ratio >= 8 ? 'قدرة ممتازة جداً' : 
      ratio >= 4 ? 'قدرة جيدة' : 
      ratio >= 2 ? 'قدرة محدودة' : 'ضعف خطير'
    } على خدمة الديون.`;
  }

  // Add remaining 9 calculation methods for complete 18 leverage analyses
  // Including: Equity Multiplier, Debt Safety Ratio, Debt Liquidity Ratio,
  // Asset Coverage Ratio, Short Term Debt Ratio, Financial Risk Index,
  // Financial Stability Ratio, Cash Flow Coverage Ratio, Solvency Ratio,
  // Bankruptcy Protection Ratio
}
