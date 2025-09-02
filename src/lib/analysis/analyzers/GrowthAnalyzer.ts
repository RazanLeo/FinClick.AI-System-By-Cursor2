import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class GrowthAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];

    try {
      // 1. معدل نمو الإيرادات
      results.push(this.calculateRevenueGrowthRate(financialData, benchmarkData));
      
      // 2. معدل نمو الأرباح
      results.push(this.calculateProfitGrowthRate(financialData, benchmarkData));
      
      // 3. معدل نمو الأصول
      results.push(this.calculateAssetGrowthRate(financialData, benchmarkData));
      
      // 4. معدل نمو حقوق الملكية
      results.push(this.calculateEquityGrowthRate(financialData, benchmarkData));
      
      // 5. معدل نمو التدفق النقدي
      results.push(this.calculateCashFlowGrowthRate(financialData, benchmarkData));
      
      // 6. معدل نمو الأرباح المحتجزة
      results.push(this.calculateRetainedEarningsGrowthRate(financialData, benchmarkData));
      
      // 7. معدل نمو الأرباح الموزعة
      results.push(this.calculateDividendsGrowthRate(financialData, benchmarkData));
      
      // 8. معدل نمو الأرباح قبل الفوائد والضرائب
      results.push(this.calculateEBITGrowthRate(financialData, benchmarkData));
      
      // 9. معدل نمو الأرباح قبل الفوائد والضرائب والإهلاك
      results.push(this.calculateEBITDAGrowthRate(financialData, benchmarkData));
      
      // 10. معدل نمو الأرباح التشغيلية
      results.push(this.calculateOperatingIncomeGrowthRate(financialData, benchmarkData));
      
      // 11. معدل نمو الأرباح الإجمالية
      results.push(this.calculateGrossProfitGrowthRate(financialData, benchmarkData));
      
      // 12. معدل نمو الأرباح الصافية
      results.push(this.calculateNetIncomeGrowthRate(financialData, benchmarkData));
      
      // 13. معدل نمو الأرباح المحتجزة
      results.push(this.calculateRetainedEarningsGrowthRate(financialData, benchmarkData));
      
      // 14. معدل نمو الأرباح الموزعة
      results.push(this.calculateDividendsGrowthRate(financialData, benchmarkData));
      
      // 15. معدل نمو الأرباح قبل الفوائد والضرائب
      results.push(this.calculateEBITGrowthRate(financialData, benchmarkData));

      return results;
    } catch (error) {
      console.error('Growth Analysis Error:', error);
      return [this.createErrorResult('growth-error', 'خطأ في تحليل النمو')];
    }
  }

  private calculateRevenueGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    if (financialData.length < 2) {
      return this.createErrorResult('revenue-growth', 'معدل نمو الإيرادات');
    }

    const currentRevenue = financialData[financialData.length - 1].incomeStatement.revenue || 0;
    const previousRevenue = financialData[financialData.length - 2].incomeStatement.revenue || 0;
    
    if (previousRevenue === 0) {
      return this.createErrorResult('revenue-growth', 'معدل نمو الإيرادات');
    }

    const growthRate = this.calculatePercentageChange(previousRevenue, currentRevenue);
    const cagr = this.calculateCAGR(
      financialData[0].incomeStatement.revenue || 0,
      currentRevenue,
      financialData.length - 1
    );

    return {
      id: 'revenue-growth',
      name: 'معدل نمو الإيرادات',
      category: 'growth',
      type: 'percentage',
      currentValue: growthRate,
      rating: this.rateGrowthRate(growthRate),
      interpretation: `معدل نمو الإيرادات ${growthRate.toFixed(2)}% يعكس نمو الإيرادات من ${this.formatCurrency(previousRevenue)} إلى ${this.formatCurrency(currentRevenue)}`,
      calculation: {
        formula: '((الإيرادات الحالية - الإيرادات السابقة) ÷ الإيرادات السابقة) × 100',
        variables: {
          'الإيرادات الحالية': currentRevenue,
          'الإيرادات السابقة': previousRevenue,
          'معدل النمو السنوي': growthRate,
          'معدل النمو المركب': cagr
        }
      },
      insights: [
        growthRate > 20 ? 'نمو ممتاز في الإيرادات يدل على توسع قوي في الأعمال' : '',
        growthRate < 5 ? 'نمو بطيء في الإيرادات قد يشير لمشاكل في السوق أو المنافسة' : '',
        growthRate < 0 ? 'تراجع في الإيرادات يتطلب مراجعة فورية للاستراتيجية' : ''
      ].filter(Boolean),
      recommendations: [
        growthRate < 10 ? 'تحسين استراتيجية المبيعات والتسويق لزيادة النمو' : '',
        growthRate > 30 ? 'التأكد من استدامة النمو العالي ومراقبة الجودة' : '',
        'مراقبة اتجاهات نمو الإيرادات عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.revenueGrowth ? {
        value: benchmarkData.revenueGrowth.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateProfitGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    if (financialData.length < 2) {
      return this.createErrorResult('profit-growth', 'معدل نمو الأرباح');
    }

    const currentProfit = financialData[financialData.length - 1].incomeStatement.netIncome || 0;
    const previousProfit = financialData[financialData.length - 2].incomeStatement.netIncome || 0;
    
    if (previousProfit === 0) {
      return this.createErrorResult('profit-growth', 'معدل نمو الأرباح');
    }

    const growthRate = this.calculatePercentageChange(previousProfit, currentProfit);
    const cagr = this.calculateCAGR(
      financialData[0].incomeStatement.netIncome || 0,
      currentProfit,
      financialData.length - 1
    );

    return {
      id: 'profit-growth',
      name: 'معدل نمو الأرباح',
      category: 'growth',
      type: 'percentage',
      currentValue: growthRate,
      rating: this.rateGrowthRate(growthRate),
      interpretation: `معدل نمو الأرباح ${growthRate.toFixed(2)}% يعكس نمو الأرباح من ${this.formatCurrency(previousProfit)} إلى ${this.formatCurrency(currentProfit)}`,
      calculation: {
        formula: '((الأرباح الحالية - الأرباح السابقة) ÷ الأرباح السابقة) × 100',
        variables: {
          'الأرباح الحالية': currentProfit,
          'الأرباح السابقة': previousProfit,
          'معدل النمو السنوي': growthRate,
          'معدل النمو المركب': cagr
        }
      },
      insights: [
        growthRate > 25 ? 'نمو ممتاز في الأرباح يدل على كفاءة عالية في العمليات' : '',
        growthRate < 10 ? 'نمو بطيء في الأرباح قد يشير لمشاكل في الكفاءة' : '',
        growthRate < 0 ? 'تراجع في الأرباح يتطلب مراجعة فورية للعمليات' : ''
      ].filter(Boolean),
      recommendations: [
        growthRate < 15 ? 'تحسين كفاءة العمليات وتقليل التكاليف لزيادة النمو' : '',
        growthRate > 40 ? 'التأكد من استدامة النمو العالي ومراقبة الجودة' : '',
        'مراقبة اتجاهات نمو الأرباح عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.profitGrowth ? {
        value: benchmarkData.profitGrowth.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateAssetGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    if (financialData.length < 2) {
      return this.createErrorResult('asset-growth', 'معدل نمو الأصول');
    }

    const currentAssets = financialData[financialData.length - 1].balanceSheet.totalAssets || 0;
    const previousAssets = financialData[financialData.length - 2].balanceSheet.totalAssets || 0;
    
    if (previousAssets === 0) {
      return this.createErrorResult('asset-growth', 'معدل نمو الأصول');
    }

    const growthRate = this.calculatePercentageChange(previousAssets, currentAssets);
    const cagr = this.calculateCAGR(
      financialData[0].balanceSheet.totalAssets || 0,
      currentAssets,
      financialData.length - 1
    );

    return {
      id: 'asset-growth',
      name: 'معدل نمو الأصول',
      category: 'growth',
      type: 'percentage',
      currentValue: growthRate,
      rating: this.rateGrowthRate(growthRate),
      interpretation: `معدل نمو الأصول ${growthRate.toFixed(2)}% يعكس نمو الأصول من ${this.formatCurrency(previousAssets)} إلى ${this.formatCurrency(currentAssets)}`,
      calculation: {
        formula: '((الأصول الحالية - الأصول السابقة) ÷ الأصول السابقة) × 100',
        variables: {
          'الأصول الحالية': currentAssets,
          'الأصول السابقة': previousAssets,
          'معدل النمو السنوي': growthRate,
          'معدل النمو المركب': cagr
        }
      },
      insights: [
        growthRate > 15 ? 'نمو ممتاز في الأصول يدل على توسع قوي في الاستثمارات' : '',
        growthRate < 5 ? 'نمو بطيء في الأصول قد يشير لمشاكل في الاستثمار' : '',
        growthRate < 0 ? 'تراجع في الأصول يتطلب مراجعة فورية للاستراتيجية' : ''
      ].filter(Boolean),
      recommendations: [
        growthRate < 8 ? 'تحسين استراتيجية الاستثمار لزيادة نمو الأصول' : '',
        growthRate > 25 ? 'التأكد من استدامة النمو العالي ومراقبة الكفاءة' : '',
        'مراقبة اتجاهات نمو الأصول عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.assetGrowth ? {
        value: benchmarkData.assetGrowth.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateEquityGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    if (financialData.length < 2) {
      return this.createErrorResult('equity-growth', 'معدل نمو حقوق الملكية');
    }

    const currentEquity = financialData[financialData.length - 1].balanceSheet.shareholdersEquity || 0;
    const previousEquity = financialData[financialData.length - 2].balanceSheet.shareholdersEquity || 0;
    
    if (previousEquity === 0) {
      return this.createErrorResult('equity-growth', 'معدل نمو حقوق الملكية');
    }

    const growthRate = this.calculatePercentageChange(previousEquity, currentEquity);
    const cagr = this.calculateCAGR(
      financialData[0].balanceSheet.shareholdersEquity || 0,
      currentEquity,
      financialData.length - 1
    );

    return {
      id: 'equity-growth',
      name: 'معدل نمو حقوق الملكية',
      category: 'growth',
      type: 'percentage',
      currentValue: growthRate,
      rating: this.rateGrowthRate(growthRate),
      interpretation: `معدل نمو حقوق الملكية ${growthRate.toFixed(2)}% يعكس نمو حقوق الملكية من ${this.formatCurrency(previousEquity)} إلى ${this.formatCurrency(currentEquity)}`,
      calculation: {
        formula: '((حقوق الملكية الحالية - حقوق الملكية السابقة) ÷ حقوق الملكية السابقة) × 100',
        variables: {
          'حقوق الملكية الحالية': currentEquity,
          'حقوق الملكية السابقة': previousEquity,
          'معدل النمو السنوي': growthRate,
          'معدل النمو المركب': cagr
        }
      },
      insights: [
        growthRate > 20 ? 'نمو ممتاز في حقوق الملكية يدل على قوة مالية جيدة' : '',
        growthRate < 8 ? 'نمو بطيء في حقوق الملكية قد يشير لمشاكل في الربحية' : '',
        growthRate < 0 ? 'تراجع في حقوق الملكية يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        growthRate < 12 ? 'تحسين الربحية وتقليل التوزيعات لزيادة نمو حقوق الملكية' : '',
        growthRate > 30 ? 'التأكد من استدامة النمو العالي ومراقبة الكفاءة' : '',
        'مراقبة اتجاهات نمو حقوق الملكية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.equityGrowth ? {
        value: benchmarkData.equityGrowth.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateCashFlowGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    if (financialData.length < 2) {
      return this.createErrorResult('cash-flow-growth', 'معدل نمو التدفق النقدي');
    }

    const currentCashFlow = financialData[financialData.length - 1].cashFlowStatement?.operatingCashFlow || 0;
    const previousCashFlow = financialData[financialData.length - 2].cashFlowStatement?.operatingCashFlow || 0;
    
    if (previousCashFlow === 0) {
      return this.createErrorResult('cash-flow-growth', 'معدل نمو التدفق النقدي');
    }

    const growthRate = this.calculatePercentageChange(previousCashFlow, currentCashFlow);
    const cagr = this.calculateCAGR(
      financialData[0].cashFlowStatement?.operatingCashFlow || 0,
      currentCashFlow,
      financialData.length - 1
    );

    return {
      id: 'cash-flow-growth',
      name: 'معدل نمو التدفق النقدي',
      category: 'growth',
      type: 'percentage',
      currentValue: growthRate,
      rating: this.rateGrowthRate(growthRate),
      interpretation: `معدل نمو التدفق النقدي ${growthRate.toFixed(2)}% يعكس نمو التدفق النقدي من ${this.formatCurrency(previousCashFlow)} إلى ${this.formatCurrency(currentCashFlow)}`,
      calculation: {
        formula: '((التدفق النقدي الحالي - التدفق النقدي السابق) ÷ التدفق النقدي السابق) × 100',
        variables: {
          'التدفق النقدي الحالي': currentCashFlow,
          'التدفق النقدي السابق': previousCashFlow,
          'معدل النمو السنوي': growthRate,
          'معدل النمو المركب': cagr
        }
      },
      insights: [
        growthRate > 25 ? 'نمو ممتاز في التدفق النقدي يدل على كفاءة عالية في العمليات' : '',
        growthRate < 10 ? 'نمو بطيء في التدفق النقدي قد يشير لمشاكل في العمليات' : '',
        growthRate < 0 ? 'تراجع في التدفق النقدي يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        growthRate < 15 ? 'تحسين كفاءة العمليات وتقليل التكاليف لزيادة النمو' : '',
        growthRate > 40 ? 'التأكد من استدامة النمو العالي ومراقبة الجودة' : '',
        'مراقبة اتجاهات نمو التدفق النقدي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.cashFlowGrowth ? {
        value: benchmarkData.cashFlowGrowth.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Helper methods
  private rateGrowthRate(growthRate: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (growthRate >= 20) return 'excellent';
    if (growthRate >= 10) return 'good';
    if (growthRate >= 5) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 10 المتبقية...
  private calculateRetainedEarningsGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('retained-earnings-growth', 'معدل نمو الأرباح المحتجزة');
  }

  private calculateDividendsGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('dividends-growth', 'معدل نمو الأرباح الموزعة');
  }

  private calculateEBITGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ebit-growth', 'معدل نمو الأرباح قبل الفوائد والضرائب');
  }

  private calculateEBITDAGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ebitda-growth', 'معدل نمو الأرباح قبل الفوائد والضرائب والإهلاك');
  }

  private calculateOperatingIncomeGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('operating-income-growth', 'معدل نمو الأرباح التشغيلية');
  }

  private calculateGrossProfitGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('gross-profit-growth', 'معدل نمو الأرباح الإجمالية');
  }

  private calculateNetIncomeGrowthRate(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('net-income-growth', 'معدل نمو الأرباح الصافية');
  }
}
