import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class LiquidityAnalyzer extends BaseAnalyzer {
  async analyze(
    financialData: FinancialStatement[],
    companyData: Company,
    marketData?: any,
    benchmarkData?: any
  ): Promise<AnalysisResult[]> {
    
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. Current Ratio
      results.push(this.calculateCurrentRatio(latestStatement, benchmarkData));

      // 2. Quick Ratio (Acid Test)
      results.push(this.calculateQuickRatio(latestStatement, benchmarkData));

      // 3. Cash Ratio
      results.push(this.calculateCashRatio(latestStatement, benchmarkData));

      // 4. Operating Cash Flow Ratio
      results.push(this.calculateOperatingCashFlowRatio(latestStatement, benchmarkData));

      // 5. Working Capital
      results.push(this.calculateWorkingCapital(latestStatement, benchmarkData));

      // 6. Working Capital Ratio
      results.push(this.calculateWorkingCapitalRatio(latestStatement, benchmarkData));

      // 7. Net Working Capital to Sales
      results.push(this.calculateNWCToSales(latestStatement, benchmarkData));

      // 8. Receivables Turnover
      results.push(this.calculateReceivablesTurnover(latestStatement, benchmarkData));

      // 9. Days Sales Outstanding (DSO)
      results.push(this.calculateDaysSalesOutstanding(latestStatement, benchmarkData));

      // 10. Inventory Turnover
      results.push(this.calculateInventoryTurnover(latestStatement, benchmarkData));

      // 11. Days Inventory Outstanding (DIO)
      results.push(this.calculateDaysInventoryOutstanding(latestStatement, benchmarkData));

      // 12. Payables Turnover
      results.push(this.calculatePayablesTurnover(latestStatement, benchmarkData));

      // 13. Days Payable Outstanding (DPO)
      results.push(this.calculateDaysPayableOutstanding(latestStatement, benchmarkData));

      // 14. Cash Conversion Cycle
      results.push(this.calculateCashConversionCycle(latestStatement, benchmarkData));

      // 15. Defensive Interval Ratio
      results.push(this.calculateDefensiveIntervalRatio(latestStatement, benchmarkData));

      // 16. Cash Coverage Ratio
      results.push(this.calculateCashCoverageRatio(latestStatement, benchmarkData));

      // 17. Liquidity Index
      results.push(this.calculateLiquidityIndex(latestStatement, benchmarkData));

      // 18. Net Liquid Balance
      results.push(this.calculateNetLiquidBalance(latestStatement, benchmarkData));

      // 19. Current Liabilities Coverage
      results.push(this.calculateCurrentLiabilitiesCoverage(latestStatement, benchmarkData));

      // 20. Short-term Debt Coverage
      results.push(this.calculateShortTermDebtCoverage(latestStatement, benchmarkData));

      return results;

    } catch (error) {
      console.error('Liquidity Analysis Error:', error);
      return [{
        id: 'liquidity-error',
        name: 'خطأ في تحليل السيولة',
        category: 'liquidity',
        currentValue: 0,
        rating: 'poor',
        interpretation: 'فشل في حساب مؤشرات السيولة',
        status: 'error'
      }];
    }
  }

  private calculateCurrentRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    
    if (currentLiabilities === 0) {
      return this.createErrorResult('current-ratio', 'النسبة الجارية');
    }

    const ratio = currentAssets / currentLiabilities;

    return {
      id: 'current-ratio',
      name: 'النسبة الجارية',
      category: 'liquidity',
      type: 'ratio',
      currentValue: ratio,
      rating: this.rateCurrentRatio(ratio),
      trend: this.calculateTrend([ratio], 'up_is_better'),
      interpretation: this.interpretCurrentRatio(ratio),
      calculation: {
        formula: 'الأصول المتداولة ÷ الالتزامات المتداولة',
        variables: {
          'الأصول المتداولة': currentAssets,
          'الالتزامات المتداولة': currentLiabilities
        }
      },
      insights: [
        ratio > 2 ? 'مستوى سيولة ممتاز يوفر حماية قوية' : '',
        ratio < 1 ? 'مخاطر سيولة - قد تواجه صعوبة في سداد الالتزامات قصيرة الأجل' : '',
        ratio > 3 ? 'سيولة زائدة قد تشير إلى عدم الاستغلال الأمثل للأصول' : ''
      ].filter(Boolean),
      recommendations: this.getRecommendations('current-ratio', ratio),
      industryBenchmark: benchmarkData?.currentRatio ? {
        value: benchmarkData.currentRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateQuickRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const inventory = statement.balanceSheet.inventory || 0;
    const prepaidExpenses = statement.balanceSheet.prepaidExpenses || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    
    if (currentLiabilities === 0) {
      return this.createErrorResult('quick-ratio', 'نسبة السيولة السريعة');
    }

    const quickAssets = currentAssets - inventory - prepaidExpenses;
    const ratio = quickAssets / currentLiabilities;

    return {
      id: 'quick-ratio',
      name: 'نسبة السيولة السريعة (اختبار الحمض)',
      category: 'liquidity',
      type: 'ratio',
      currentValue: ratio,
      rating: this.rateQuickRatio(ratio),
      trend: this.calculateTrend([ratio], 'up_is_better'),
      interpretation: this.interpretQuickRatio(ratio),
      calculation: {
        formula: '(الأصول المتداولة - المخزون - المصروفات المدفوعة مقدماً) ÷ الالتزامات المتداولة',
        variables: {
          'الأصول المتداولة': currentAssets,
          'المخزون': inventory,
          'المصروفات المدفوعة مقدماً': prepaidExpenses,
          'الالتزامات المتداولة': currentLiabilities,
          'الأصول السريعة': quickAssets
        }
      },
      insights: [
        ratio >= 1 ? 'قدرة ممتازة على تلبية الالتزامات الفورية' : '',
        ratio < 0.5 ? 'ضعف في السيولة الفورية - اعتماد كبير على المخزون' : '',
        ratio > 1.5 ? 'سيولة فورية عالية توفر مرونة مالية كبيرة' : ''
      ].filter(Boolean),
      recommendations: this.getRecommendations('quick-ratio', ratio),
      industryBenchmark: benchmarkData?.quickRatio ? {
        value: benchmarkData.quickRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateCashRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const cash = (statement.balanceSheet.cash || 0) + (statement.balanceSheet.marketableSecurities || 0);
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    
    if (currentLiabilities === 0) {
      return this.createErrorResult('cash-ratio', 'النسبة النقدية');
    }

    const ratio = cash / currentLiabilities;

    return {
      id: 'cash-ratio',
      name: 'النسبة النقدية',
      category: 'liquidity',
      type: 'ratio',
      currentValue: ratio,
      rating: this.rateCashRatio(ratio),
      trend: this.calculateTrend([ratio], 'up_is_better'),
      interpretation: this.interpretCashRatio(ratio),
      calculation: {
        formula: '(النقدية + الأوراق المالية قصيرة الأجل) ÷ الالتزامات المتداولة',
        variables: {
          'النقدية والأوراق المالية': cash,
          'الالتزامات المتداولة': currentLiabilities
        }
      },
      insights: [
        ratio >= 0.2 ? 'مستوى نقدي جيد لمواجهة الالتزامات الطارئة' : '',
        ratio < 0.1 ? 'مستوى نقدي منخفض قد يعرض الشركة لمخاطر السيولة' : '',
        ratio > 0.5 ? 'مستوى نقدي عالي جداً قد يشير إلى عدم الاستثمار الأمثل' : ''
      ].filter(Boolean),
      recommendations: this.getRecommendations('cash-ratio', ratio),
      industryBenchmark: benchmarkData?.cashRatio ? {
        value: benchmarkData.cashRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateOperatingCashFlowRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const operatingCashFlow = statement.cashFlowStatement?.operatingCashFlow || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    
    if (currentLiabilities === 0) {
      return this.createErrorResult('operating-cash-flow-ratio', 'نسبة التدفق النقدي التشغيلي');
    }

    const ratio = operatingCashFlow / currentLiabilities;

    return {
      id: 'operating-cash-flow-ratio',
      name: 'نسبة التدفق النقدي التشغيلي',
      category: 'liquidity',
      type: 'ratio',
      currentValue: ratio,
      rating: this.rateOperatingCashFlowRatio(ratio),
      trend: this.calculateTrend([ratio], 'up_is_better'),
      interpretation: this.interpretOperatingCashFlowRatio(ratio),
      calculation: {
        formula: 'التدفق النقدي التشغيلي ÷ الالتزامات المتداولة',
        variables: {
          'التدفق النقدي التشغيلي': operatingCashFlow,
          'الالتزامات المتداولة': currentLiabilities
        }
      },
      insights: [
        ratio >= 0.4 ? 'تدفق نقدي تشغيلي ممتاز يوفر سيولة مستدامة' : '',
        ratio < 0.1 ? 'ضعف في التدفق النقدي التشغيلي قد يؤثر على السيولة' : '',
        operatingCashFlow < 0 ? 'تدفق نقدي تشغيلي سالب - مخاطر سيولة عالية' : ''
      ].filter(Boolean),
      recommendations: this.getRecommendations('operating-cash-flow-ratio', ratio),
      industryBenchmark: benchmarkData?.operatingCashFlowRatio ? {
        value: benchmarkData.operatingCashFlowRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateWorkingCapital(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const workingCapital = currentAssets - currentLiabilities;

    return {
      id: 'working-capital',
      name: 'رأس المال العامل',
      category: 'liquidity',
      type: 'currency',
      currentValue: workingCapital,
      rating: this.rateWorkingCapital(workingCapital, statement.incomeStatement.revenue || 0),
      trend: this.calculateTrend([workingCapital], 'up_is_better'),
      interpretation: this.interpretWorkingCapital(workingCapital),
      calculation: {
        formula: 'الأصول المتداولة - الالتزامات المتداولة',
        variables: {
          'الأصول المتداولة': currentAssets,
          'الالتزامات المتداولة': currentLiabilities
        }
      },
      insights: [
        workingCapital > 0 ? 'رأس مال عامل إيجابي يوفر مرونة تشغيلية' : '',
        workingCapital < 0 ? 'رأس مال عامل سالب - قد يواجه صعوبات في التشغيل' : '',
        Math.abs(workingCapital) > (statement.incomeStatement.revenue || 0) * 0.2 ? 
          'رأس المال العامل كبير نسبياً مقارنة بالإيرادات' : ''
      ].filter(Boolean),
      recommendations: this.getRecommendations('working-capital', workingCapital),
      industryBenchmark: benchmarkData?.workingCapital ? {
        value: benchmarkData.workingCapital.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateWorkingCapitalRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const workingCapital = currentAssets - currentLiabilities;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('working-capital-ratio', 'نسبة رأس المال العامل');
    }

    const ratio = workingCapital / totalAssets;

    return {
      id: 'working-capital-ratio',
      name: 'نسبة رأس المال العامل',
      category: 'liquidity',
      type: 'ratio',
      currentValue: ratio,
      rating: this.rateWorkingCapitalRatio(ratio),
      trend: this.calculateTrend([ratio], 'contextual'),
      interpretation: this.interpretWorkingCapitalRatio(ratio),
      calculation: {
        formula: '(الأصول المتداولة - الالتزامات المتداولة) ÷ إجمالي الأصول',
        variables: {
          'رأس المال العامل': workingCapital,
          'إجمالي الأصول': totalAssets
        }
      },
      insights: [
        ratio > 0.1 ? 'نسبة رأس مال عامل صحية تدعم العمليات التشغيلية' : '',
        ratio < 0 ? 'نسبة رأس مال عامل سالبة تشير إلى ضغوط سيولة' : '',
        ratio > 0.3 ? 'نسبة رأس مال عامل عالية قد تشير إلى عدم الكفاءة في إدارة رأس المال' : ''
      ].filter(Boolean),
      recommendations: this.getRecommendations('working-capital-ratio', ratio),
      industryBenchmark: benchmarkData?.workingCapitalRatio ? {
        value: benchmarkData.workingCapitalRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Continue with remaining liquidity calculations...
  private calculateNWCToSales(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const workingCapital = currentAssets - currentLiabilities;
    const revenue = statement.incomeStatement.revenue || 0;
    
    if (revenue === 0) {
      return this.createErrorResult('nwc-to-sales', 'نسبة رأس المال العامل إلى المبيعات');
    }

    const ratio = workingCapital / revenue;

    return {
      id: 'nwc-to-sales',
      name: 'نسبة رأس المال العامل إلى المبيعات',
      category: 'liquidity',
      type: 'ratio',
      currentValue: ratio,
      rating: this.rateNWCToSales(ratio),
      trend: this.calculateTrend([ratio], 'contextual'),
      interpretation: `نسبة رأس المال العامل إلى المبيعات ${(ratio * 100).toFixed(1)}% تشير إلى ${
        ratio > 0.15 ? 'كفاءة عالية في إدارة رأس المال' :
        ratio < 0 ? 'ضغوط سيولة تتطلب انتباه فوري' :
        'مستوى طبيعي لإدارة رأس المال'
      }`,
      calculation: {
        formula: 'رأس المال العامل ÷ صافي المبيعات',
        variables: {
          'رأس المال العامل': workingCapital,
          'صافي المبيعات': revenue
        }
      },
      recommendations: [
        ratio < 0 ? 'تحسين إدارة النقدية وتحصيل المستحقات' : '',
        ratio > 0.2 ? 'تحسين كفاءة استخدام رأس المال العامل' : '',
        'مراجعة شروط الائتمان وسياسات التحصيل'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  // Rating methods for each liquidity metric
  private rateCurrentRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 2.5) return 'excellent';
    if (ratio >= 1.5) return 'good';
    if (ratio >= 1.0) return 'average';
    return 'poor';
  }

  private rateQuickRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 1.2) return 'excellent';
    if (ratio >= 0.8) return 'good';
    if (ratio >= 0.5) return 'average';
    return 'poor';
  }

  private rateCashRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 0.3) return 'excellent';
    if (ratio >= 0.15) return 'good';
    if (ratio >= 0.05) return 'average';
    return 'poor';
  }

  private rateOperatingCashFlowRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 0.4) return 'excellent';
    if (ratio >= 0.25) return 'good';
    if (ratio >= 0.1) return 'average';
    return 'poor';
  }

  private rateWorkingCapital(workingCapital: number, revenue: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (workingCapital <= 0) return 'poor';
    const ratio = workingCapital / revenue;
    if (ratio >= 0.2) return 'excellent';
    if (ratio >= 0.1) return 'good';
    if (ratio >= 0.05) return 'average';
    return 'poor';
  }

  private rateWorkingCapitalRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 0.2) return 'excellent';
    if (ratio >= 0.1) return 'good';
    if (ratio >= 0.05) return 'average';
    return 'poor';
  }

  private rateNWCToSales(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 0.15) return 'excellent';
    if (ratio >= 0.1) return 'good';
    if (ratio >= 0.05) return 'average';
    return 'poor';
  }

  // Interpretation methods
  private interpretCurrentRatio(ratio: number): string {
    if (ratio >= 2.5) {
      return `النسبة الجارية ${ratio.toFixed(2)} ممتازة وتشير إلى قدرة قوية جداً على الوفاء بالالتزامات قصيرة الأجل، لكن قد تحتاج لمراجعة كفاءة استخدام الأصول.`;
    } else if (ratio >= 1.5) {
      return `النسبة الجارية ${ratio.toFixed(2)} جيدة وتدل على مستوى سيولة صحي مع قدرة مناسبة على مواجهة الالتزامات قصيرة الأجل.`;
    } else if (ratio >= 1.0) {
      return `النسبة الجارية ${ratio.toFixed(2)} مقبولة لكنها تتطلب مراقبة دقيقة لإدارة السيولة وتحسين الوضع المالي.`;
    } else {
      return `النسبة الجارية ${ratio.toFixed(2)} منخفضة وتشير إلى مخاطر سيولة عالية وصعوبة محتملة في الوفاء بالالتزامات المستحقة.`;
    }
  }

  private interpretQuickRatio(ratio: number): string {
    if (ratio >= 1.2) {
      return `نسبة السيولة السريعة ${ratio.toFixed(2)} ممتازة وتدل على قدرة فائقة على مواجهة الالتزامات الفورية دون الاعتماد على المخزون.`;
    } else if (ratio >= 0.8) {
      return `نسبة السيولة السريعة ${ratio.toFixed(2)} جيدة وتشير إلى سيولة فورية مناسبة لمواجهة الالتزامات العاجلة.`;
    } else if (ratio >= 0.5) {
      return `نسبة السيولة السريعة ${ratio.toFixed(2)} متوسطة، قد تحتاج لتحسين إدارة الأصول السائلة.`;
    } else {
      return `نسبة السيولة السريعة ${ratio.toFixed(2)} ضعيفة وتشير إلى اعتماد كبير على المخزون ومخاطر في السيولة الفورية.`;
    }
  }

  private interpretCashRatio(ratio: number): string {
    return `النسبة النقدية ${ratio.toFixed(3)} تشير إلى أن ${(ratio * 100).toFixed(1)}% من الالتزامات المتداولة مغطاة بالنقدية والاستثمارات قصيرة الأجل.`;
  }

  private interpretOperatingCashFlowRatio(ratio: number): string {
    return `نسبة التدفق النقدي التشغيلي ${ratio.toFixed(2)} تدل على ${ratio > 0 ? 'قدرة' : 'عدم قدرة'} العمليات التشغيلية على توليد نقدية كافية لتغطية الالتزامات المتداولة.`;
  }

  private interpretWorkingCapital(workingCapital: number): string {
    if (workingCapital > 0) {
      return `رأس المال العامل الإيجابي ${this.formatCurrency(workingCapital)} يوفر وسادة مالية جيدة للعمليات التشغيلية اليومية.`;
    } else {
      return `رأس المال العامل السالب ${this.formatCurrency(Math.abs(workingCapital))} يشير إلى ضغوط سيولة وحاجة لإدارة أفضل للأصول والخصوم المتداولة.`;
    }
  }

  private interpretWorkingCapitalRatio(ratio: number): string {
    return `نسبة رأس المال العامل ${(ratio * 100).toFixed(1)}% من إجمالي الأصول تشير إلى ${
      ratio > 0.15 ? 'كفاءة عالية' : ratio < 0 ? 'ضغوط سيولة' : 'مستوى طبيعي'
    } في إدارة رأس المال العامل.`;
  }

  // Add remaining calculation methods for all 20 liquidity metrics...
  // (Continuing with the remaining 12 methods following the same pattern)

  private calculateReceivablesTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const accountsReceivable = statement.balanceSheet.accountsReceivable || 0;
    
    if (accountsReceivable === 0) {
      return this.createErrorResult('receivables-turnover', 'معدل دوران الذمم المدينة');
    }

    const turnover = revenue / accountsReceivable;

    return {
      id: 'receivables-turnover',
      name: 'معدل دوران الذمم المدينة',
      category: 'liquidity',
      type: 'ratio',
      currentValue: turnover,
      rating: turnover >= 12 ? 'excellent' : turnover >= 8 ? 'good' : turnover >= 5 ? 'average' : 'poor',
      interpretation: `معدل دوران الذمم المدينة ${turnover.toFixed(1)} مرة سنوياً يشير إلى ${
        turnover >= 12 ? 'كفاءة عالية جداً' : 
        turnover >= 8 ? 'كفاءة جيدة' : 
        turnover >= 5 ? 'كفاءة متوسطة' : 'بطء'
      } في تحصيل المستحقات.`,
      calculation: {
        formula: 'صافي المبيعات ÷ متوسط الذمم المدينة',
        variables: {
          'صافي المبيعات': revenue,
          'الذمم المدينة': accountsReceivable
        }
      },
      status: 'completed'
    };
  }

  private calculateDaysSalesOutstanding(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const accountsReceivable = statement.balanceSheet.accountsReceivable || 0;
    
    if (revenue === 0) {
      return this.createErrorResult('days-sales-outstanding', 'متوسط فترة التحصيل');
    }

    const dso = (accountsReceivable * 365) / revenue;

    return {
      id: 'days-sales-outstanding',
      name: 'متوسط فترة التحصيل (DSO)',
      category: 'liquidity',
      type: 'number',
      currentValue: dso,
      rating: dso <= 30 ? 'excellent' : dso <= 45 ? 'good' : dso <= 60 ? 'average' : 'poor',
      interpretation: `متوسط فترة التحصيل ${Math.round(dso)} يوم يشير إلى ${
        dso <= 30 ? 'سرعة ممتازة' : 
        dso <= 45 ? 'سرعة جيدة' : 
        dso <= 60 ? 'سرعة متوسطة' : 'بطء'
      } في تحصيل المستحقات من العملاء.`,
      calculation: {
        formula: '(الذمم المدينة × 365) ÷ صافي المبيعات',
        variables: {
          'الذمم المدينة': accountsReceivable,
          'صافي المبيعات': revenue
        }
      },
      status: 'completed'
    };
  }

  // Add the remaining 10 calculation methods following the same pattern...
  // This would include: Inventory Turnover, DIO, Payables Turnover, DPO, 
  // Cash Conversion Cycle, Defensive Interval, Cash Coverage, Liquidity Index,
  // Net Liquid Balance, Current Liabilities Coverage, Short-term Debt Coverage

  private calculateInventoryTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const cogs = statement.incomeStatement.costOfGoodsSold || statement.incomeStatement.totalExpenses || 0;
    const inventory = statement.balanceSheet.inventory || 0;
    
    if (inventory === 0) {
      return this.createErrorResult('inventory-turnover', 'معدل دوران المخزون');
    }

    const turnover = cogs / inventory;

    return {
      id: 'inventory-turnover',
      name: 'معدل دوران المخزون',
      category: 'liquidity',
      type: 'ratio',
      currentValue: turnover,
      rating: turnover >= 8 ? 'excellent' : turnover >= 5 ? 'good' : turnover >= 3 ? 'average' : 'poor',
      interpretation: `معدل دوران المخزون ${turnover.toFixed(1)} مرة سنوياً يدل على ${
        turnover >= 8 ? 'كفاءة عالية جداً' : 
        turnover >= 5 ? 'كفاءة جيدة' : 
        turnover >= 3 ? 'كفاءة متوسطة' : 'بطء'
      } في إدارة المخزون.`,
      calculation: {
        formula: 'تكلفة البضاعة المباعة ÷ متوسط المخزون',
        variables: {
          'تكلفة البضاعة المباعة': cogs,
          'متوسط المخزون': inventory
        }
      },
      status: 'completed'
    };
  }

  // ... Continue with remaining calculations following the same comprehensive pattern

  private calculateCashConversionCycle(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const cogs = statement.incomeStatement.costOfGoodsSold || statement.incomeStatement.totalExpenses || 0;
    const accountsReceivable = statement.balanceSheet.accountsReceivable || 0;
    const inventory = statement.balanceSheet.inventory || 0;
    const accountsPayable = statement.balanceSheet.accountsPayable || 0;

    if (revenue === 0 || cogs === 0) {
      return this.createErrorResult('cash-conversion-cycle', 'دورة التحويل النقدي');
    }

    const dso = (accountsReceivable * 365) / revenue;
    const dio = (inventory * 365) / cogs;
    const dpo = (accountsPayable * 365) / cogs;
    const ccc = dso + dio - dpo;

    return {
      id: 'cash-conversion-cycle',
      name: 'دورة التحويل النقدي',
      category: 'liquidity',
      type: 'number',
      currentValue: ccc,
      rating: ccc <= 30 ? 'excellent' : ccc <= 60 ? 'good' : ccc <= 90 ? 'average' : 'poor',
      interpretation: `دورة التحويل النقدي ${Math.round(ccc)} يوم تشير إلى ${
        ccc <= 30 ? 'كفاءة ممتازة' : 
        ccc <= 60 ? 'كفاءة جيدة' : 
        ccc <= 90 ? 'كفاءة متوسطة' : 'بطء'
      } في تحويل الاستثمارات إلى نقدية.`,
      calculation: {
        formula: 'متوسط فترة التحصيل + متوسط فترة المخزون - متوسط فترة السداد',
        variables: {
          'متوسط فترة التحصيل': Math.round(dso),
          'متوسط فترة المخزون': Math.round(dio),
          'متوسط فترة السداد': Math.round(dpo)
        }
      },
      status: 'completed'
    };
  }

  private getRecommendations(metricType: string, value: number): string[] {
    const recommendations: Record<string, string[]> = {
      'current-ratio': [
        value < 1 ? 'زيادة الأصول المتداولة أو تقليل الالتزامات قصيرة الأجل' : '',
        value > 3 ? 'استثمار الأصول الزائدة في فرص نمو أو توزيعات أرباح' : '',
        'مراقبة منتظمة لمستوى السيولة وتحسين إدارة رأس المال العامل'
      ].filter(Boolean),
      
      'quick-ratio': [
        value < 0.5 ? 'تقليل الاعتماد على المخزون وزيادة الأصول السائلة' : '',
        value < 1 ? 'تحسين سياسات التحصيل وإدارة النقدية' : '',
        'مراجعة مستويات المخزون وتحسين دورانه'
      ].filter(Boolean)
    };

    return recommendations[metricType] || ['مراجعة وتحسين إدارة السيولة بشكل عام'];
  }
}
