import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class LiquidityAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. النسبة الجارية
      results.push(this.calculateCurrentRatio(latestStatement, benchmarkData));

      // 2. النسبة السريعة
      results.push(this.calculateQuickRatio(latestStatement, benchmarkData));

      // 3. نسبة النقد
      results.push(this.calculateCashRatio(latestStatement, benchmarkData));

      // 4. نسبة التدفقات النقدية التشغيلية
      results.push(this.calculateOperatingCashFlowRatio(latestStatement, benchmarkData));

      // 5. نسبة رأس المال العامل
      results.push(this.calculateWorkingCapitalRatio(latestStatement, benchmarkData));

      // 6. نسبة السيولة المطلقة
      results.push(this.calculateAbsoluteLiquidityRatio(latestStatement, benchmarkData));

      // 7. نسبة السيولة النقدية
      results.push(this.calculateCashLiquidityRatio(latestStatement, benchmarkData));

      // 8. نسبة السيولة السريعة
      results.push(this.calculateQuickLiquidityRatio(latestStatement, benchmarkData));
      
      // 9. نسبة السيولة الجارية
      results.push(this.calculateCurrentLiquidityRatio(latestStatement, benchmarkData));
      
      // 10. نسبة السيولة التشغيلية
      results.push(this.calculateOperatingLiquidityRatio(latestStatement, benchmarkData));
      
      // 11. نسبة السيولة المالية
      results.push(this.calculateFinancialLiquidityRatio(latestStatement, benchmarkData));
      
      // 12. نسبة السيولة الاستثمارية
      results.push(this.calculateInvestmentLiquidityRatio(latestStatement, benchmarkData));
      
      // 13. نسبة السيولة الإجمالية
      results.push(this.calculateTotalLiquidityRatio(latestStatement, benchmarkData));
      
      // 14. نسبة السيولة الصافية
      results.push(this.calculateNetLiquidityRatio(latestStatement, benchmarkData));
      
      // 15. نسبة السيولة المتاحة
      results.push(this.calculateAvailableLiquidityRatio(latestStatement, benchmarkData));
      
      // 16. نسبة السيولة المطلوبة
      results.push(this.calculateRequiredLiquidityRatio(latestStatement, benchmarkData));
      
      // 17. نسبة السيولة الفائضة
      results.push(this.calculateExcessLiquidityRatio(latestStatement, benchmarkData));
      
      // 18. نسبة السيولة المثلى
      results.push(this.calculateOptimalLiquidityRatio(latestStatement, benchmarkData));
      
      // 19. نسبة السيولة الدفاعية
      results.push(this.calculateDefensiveLiquidityRatio(latestStatement, benchmarkData));
      
      // 20. نسبة السيولة الهجومية
      results.push(this.calculateOffensiveLiquidityRatio(latestStatement, benchmarkData));

      return results;
    } catch (error) {
      console.error('Liquidity Analysis Error:', error);
      return [this.createErrorResult('liquidity-error', 'خطأ في تحليل السيولة')];
    }
  }

  private calculateCurrentRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    
    if (currentLiabilities === 0) {
      return this.createErrorResult('current-ratio', 'النسبة الجارية');
    }

    const currentRatio = currentAssets / currentLiabilities;

    return {
      id: 'current-ratio',
      name: 'النسبة الجارية',
      category: 'liquidity',
      type: 'ratio',
      currentValue: currentRatio,
      rating: this.rateCurrentRatio(currentRatio),
      interpretation: `النسبة الجارية ${currentRatio.toFixed(2)} تعني أن الشركة تملك ${currentRatio.toFixed(1)} ريال من الأصول المتداولة لكل ريال من الالتزامات المتداولة`,
      calculation: {
        formula: 'الأصول المتداولة ÷ الالتزامات المتداولة',
        variables: {
          'الأصول المتداولة': currentAssets,
          'الالتزامات المتداولة': currentLiabilities
        }
      },
      insights: [
        currentRatio > 2 ? 'سيولة ممتازة تدل على قدرة عالية على الوفاء بالالتزامات قصيرة الأجل' : '',
        currentRatio < 1 ? 'سيولة ضعيفة قد تشير لمشاكل في الوفاء بالالتزامات' : '',
        currentRatio > 3 ? 'سيولة عالية جداً قد تشير لاستثمارات زائدة في الأصول المتداولة' : ''
      ].filter(Boolean),
      recommendations: [
        currentRatio < 1.5 ? 'تحسين السيولة من خلال زيادة الأصول المتداولة أو تقليل الالتزامات' : '',
        currentRatio > 2.5 ? 'مراجعة كفاءة استخدام الأصول المتداولة' : '',
        'مراقبة اتجاهات النسبة الجارية عبر الزمن'
      ].filter(Boolean),
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
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const quickAssets = currentAssets - inventory;
    
    if (currentLiabilities === 0) {
      return this.createErrorResult('quick-ratio', 'النسبة السريعة');
    }

    const quickRatio = quickAssets / currentLiabilities;

    return {
      id: 'quick-ratio',
      name: 'النسبة السريعة',
      category: 'liquidity',
      type: 'ratio',
      currentValue: quickRatio,
      rating: this.rateQuickRatio(quickRatio),
      interpretation: `النسبة السريعة ${quickRatio.toFixed(2)} تعني أن الشركة تملك ${quickRatio.toFixed(1)} ريال من الأصول السريعة لكل ريال من الالتزامات المتداولة`,
      calculation: {
        formula: '(الأصول المتداولة - المخزون) ÷ الالتزامات المتداولة',
        variables: {
          'الأصول المتداولة': currentAssets,
          'المخزون': inventory,
          'الأصول السريعة': quickAssets,
          'الالتزامات المتداولة': currentLiabilities
        }
      },
      insights: [
        quickRatio > 1.5 ? 'سيولة سريعة ممتازة تدل على قدرة عالية على الوفاء بالالتزامات' : '',
        quickRatio < 0.5 ? 'سيولة سريعة ضعيفة قد تشير لمشاكل في الوفاء بالالتزامات' : '',
        quickRatio > 2 ? 'سيولة سريعة عالية جداً قد تشير لاستثمارات زائدة' : ''
      ].filter(Boolean),
      recommendations: [
        quickRatio < 1 ? 'تحسين السيولة السريعة من خلال زيادة الأصول السريعة' : '',
        quickRatio > 1.8 ? 'مراجعة كفاءة استخدام الأصول السريعة' : '',
        'مراقبة اتجاهات النسبة السريعة عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.quickRatio ? {
        value: benchmarkData.quickRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateCashRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const cash = statement.balanceSheet.cash || 0;
    const marketableSecurities = statement.balanceSheet.marketableSecurities || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const cashAndEquivalents = cash + marketableSecurities;
    
    if (currentLiabilities === 0) {
      return this.createErrorResult('cash-ratio', 'نسبة النقد');
    }

    const cashRatio = cashAndEquivalents / currentLiabilities;

    return {
      id: 'cash-ratio',
      name: 'نسبة النقد',
      category: 'liquidity',
      type: 'ratio',
      currentValue: cashRatio,
      rating: this.rateCashRatio(cashRatio),
      interpretation: `نسبة النقد ${cashRatio.toFixed(3)} تعني أن الشركة تملك ${cashRatio.toFixed(3)} ريال من النقدية والأوراق المالية لكل ريال من الالتزامات المتداولة`,
      calculation: {
        formula: '(النقدية + الأوراق المالية قصيرة الأجل) ÷ الالتزامات المتداولة',
        variables: {
          'النقدية': cash,
          'الأوراق المالية قصيرة الأجل': marketableSecurities,
          'النقدية والأوراق المالية': cashAndEquivalents,
          'الالتزامات المتداولة': currentLiabilities
        }
      },
      insights: [
        cashRatio > 0.3 ? 'سيولة نقدية ممتازة تدل على قدرة عالية على الوفاء بالالتزامات' : '',
        cashRatio < 0.1 ? 'سيولة نقدية ضعيفة قد تشير لمشاكل في الوفاء بالالتزامات' : '',
        cashRatio > 0.5 ? 'سيولة نقدية عالية جداً قد تشير لاستثمارات زائدة' : ''
      ].filter(Boolean),
      recommendations: [
        cashRatio < 0.2 ? 'تحسين السيولة النقدية من خلال زيادة النقدية والأوراق المالية' : '',
        cashRatio > 0.4 ? 'مراجعة كفاءة استخدام النقدية والأوراق المالية' : '',
        'مراقبة اتجاهات نسبة النقد عبر الزمن'
      ].filter(Boolean),
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
      return this.createErrorResult('operating-cash-flow-ratio', 'نسبة التدفقات النقدية التشغيلية');
    }

    const operatingCashFlowRatio = operatingCashFlow / currentLiabilities;

    return {
      id: 'operating-cash-flow-ratio',
      name: 'نسبة التدفقات النقدية التشغيلية',
      category: 'liquidity',
      type: 'ratio',
      currentValue: operatingCashFlowRatio,
      rating: this.rateOperatingCashFlowRatio(operatingCashFlowRatio),
      interpretation: `نسبة التدفق النقدي التشغيلي ${operatingCashFlowRatio.toFixed(3)} تعني أن الشركة تولد ${operatingCashFlowRatio.toFixed(3)} ريال من التدفق النقدي التشغيلي لكل ريال من الالتزامات المتداولة`,
      calculation: {
        formula: 'التدفق النقدي التشغيلي ÷ الالتزامات المتداولة',
        variables: {
          'التدفق النقدي التشغيلي': operatingCashFlow,
          'الالتزامات المتداولة': currentLiabilities
        }
      },
      insights: [
        operatingCashFlowRatio > 0.5 ? 'تدفق نقدي تشغيلي ممتاز يدل على قدرة عالية على توليد النقدية' : '',
        operatingCashFlowRatio < 0.2 ? 'تدفق نقدي تشغيلي ضعيف قد يشير لمشاكل في العمليات' : '',
        operatingCashFlowRatio < 0 ? 'تدفق نقدي تشغيلي سلبي يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        operatingCashFlowRatio < 0.3 ? 'تحسين التدفق النقدي التشغيلي من خلال تحسين العمليات' : '',
        operatingCashFlowRatio > 0.8 ? 'مراجعة كفاءة استخدام التدفق النقدي التشغيلي' : '',
        'مراقبة اتجاهات نسبة التدفق النقدي التشغيلي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.operatingCashFlowRatio ? {
        value: benchmarkData.operatingCashFlowRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateWorkingCapitalRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const workingCapital = currentAssets - currentLiabilities;
    
    if (totalAssets === 0) {
      return this.createErrorResult('working-capital-ratio', 'نسبة رأس المال العامل');
    }

    const workingCapitalRatio = workingCapital / totalAssets;

    return {
      id: 'working-capital-ratio',
      name: 'نسبة رأس المال العامل',
      category: 'liquidity',
      type: 'ratio',
      currentValue: workingCapitalRatio,
      rating: this.rateWorkingCapitalRatio(workingCapitalRatio),
      interpretation: `نسبة رأس المال العامل ${workingCapitalRatio.toFixed(3)} تعني أن رأس المال العامل يمثل ${(workingCapitalRatio * 100).toFixed(1)}% من إجمالي الأصول`,
      calculation: {
        formula: '(الأصول المتداولة - الالتزامات المتداولة) ÷ إجمالي الأصول',
        variables: {
          'الأصول المتداولة': currentAssets,
          'الالتزامات المتداولة': currentLiabilities,
          'رأس المال العامل': workingCapital,
          'إجمالي الأصول': totalAssets
        }
      },
      insights: [
        workingCapitalRatio > 0.2 ? 'رأس مال عامل ممتاز يدل على قوة مالية جيدة' : '',
        workingCapitalRatio < 0.1 ? 'رأس مال عامل ضعيف قد يشير لمشاكل في السيولة' : '',
        workingCapitalRatio < 0 ? 'رأس مال عامل سلبي يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        workingCapitalRatio < 0.15 ? 'تحسين رأس المال العامل من خلال زيادة الأصول المتداولة أو تقليل الالتزامات' : '',
        workingCapitalRatio > 0.3 ? 'مراجعة كفاءة استخدام رأس المال العامل' : '',
        'مراقبة اتجاهات نسبة رأس المال العامل عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.workingCapitalRatio ? {
        value: benchmarkData.workingCapitalRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Helper methods for rating
  private rateCurrentRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 2.5) return 'excellent';
    if (ratio >= 1.5) return 'good';
    if (ratio >= 1.0) return 'average';
    return 'poor';
  }

  private rateQuickRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 1.5) return 'excellent';
    if (ratio >= 1.0) return 'good';
    if (ratio >= 0.5) return 'average';
    return 'poor';
  }

  private rateCashRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 0.3) return 'excellent';
    if (ratio >= 0.2) return 'good';
    if (ratio >= 0.1) return 'average';
    return 'poor';
  }

  private rateOperatingCashFlowRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 0.5) return 'excellent';
    if (ratio >= 0.3) return 'good';
    if (ratio >= 0.1) return 'average';
    return 'poor';
  }

  private rateWorkingCapitalRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 0.2) return 'excellent';
    if (ratio >= 0.15) return 'good';
    if (ratio >= 0.1) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 15 المتبقية...
  private calculateAbsoluteLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-liquidity', 'نسبة السيولة المطلقة');
  }

  private calculateCashLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('cash-liquidity', 'نسبة السيولة النقدية');
  }

  private calculateQuickLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('quick-liquidity', 'نسبة السيولة السريعة');
  }

  private calculateCurrentLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('current-liquidity', 'نسبة السيولة الجارية');
  }

  private calculateOperatingLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('operating-liquidity', 'نسبة السيولة التشغيلية');
  }

  private calculateFinancialLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('financial-liquidity', 'نسبة السيولة المالية');
  }

  private calculateInvestmentLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('investment-liquidity', 'نسبة السيولة الاستثمارية');
  }

  private calculateTotalLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('total-liquidity', 'نسبة السيولة الإجمالية');
  }

  private calculateNetLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('net-liquidity', 'نسبة السيولة الصافية');
  }

  private calculateAvailableLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('available-liquidity', 'نسبة السيولة المتاحة');
  }

  private calculateRequiredLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('required-liquidity', 'نسبة السيولة المطلوبة');
  }

  private calculateExcessLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('excess-liquidity', 'نسبة السيولة الفائضة');
  }

  private calculateOptimalLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('optimal-liquidity', 'نسبة السيولة المثلى');
  }

  private calculateDefensiveLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('defensive-liquidity', 'نسبة السيولة الدفاعية');
  }

  private calculateOffensiveLiquidityRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('offensive-liquidity', 'نسبة السيولة الهجومية');
  }
}