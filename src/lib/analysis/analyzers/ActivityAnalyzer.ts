import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class ActivityAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. معدل دوران المخزون
      results.push(this.calculateInventoryTurnover(latestStatement, benchmarkData));
      
      // 2. معدل دوران الذمم المدينة
      results.push(this.calculateReceivablesTurnover(latestStatement, benchmarkData));
      
      // 3. معدل دوران الذمم الدائنة
      results.push(this.calculatePayablesTurnover(latestStatement, benchmarkData));
      
      // 4. معدل دوران الأصول الثابتة
      results.push(this.calculateFixedAssetTurnover(latestStatement, benchmarkData));
      
      // 5. معدل دوران إجمالي الأصول
      results.push(this.calculateTotalAssetTurnover(latestStatement, benchmarkData));
      
      // 6. معدل دوران رأس المال العامل
      results.push(this.calculateWorkingCapitalTurnover(latestStatement, benchmarkData));
      
      // 7. معدل دوران حقوق الملكية
      results.push(this.calculateEquityTurnover(latestStatement, benchmarkData));
      
      // 8. معدل دوران الأصول المتداولة
      results.push(this.calculateCurrentAssetTurnover(latestStatement, benchmarkData));
      
      // 9. معدل دوران الأصول غير المتداولة
      results.push(this.calculateNonCurrentAssetTurnover(latestStatement, benchmarkData));
      
      // 10. معدل دوران الأصول الملموسة
      results.push(this.calculateTangibleAssetTurnover(latestStatement, benchmarkData));
      
      // 11. معدل دوران الأصول غير الملموسة
      results.push(this.calculateIntangibleAssetTurnover(latestStatement, benchmarkData));
      
      // 12. معدل دوران الأصول الاستثمارية
      results.push(this.calculateInvestmentAssetTurnover(latestStatement, benchmarkData));
      
      // 13. معدل دوران الأصول المالية
      results.push(this.calculateFinancialAssetTurnover(latestStatement, benchmarkData));
      
      // 14. معدل دوران الأصول التشغيلية
      results.push(this.calculateOperatingAssetTurnover(latestStatement, benchmarkData));
      
      // 15. معدل دوران الأصول الصافية
      results.push(this.calculateNetAssetTurnover(latestStatement, benchmarkData));

      return results;
    } catch (error) {
      console.error('Activity Analysis Error:', error);
      return [this.createErrorResult('activity-error', 'خطأ في تحليل النشاط')];
    }
  }

  private calculateInventoryTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const costOfGoodsSold = statement.incomeStatement.costOfGoodsSold || 0;
    const averageInventory = statement.balanceSheet.inventory || 0;
    
    if (averageInventory === 0) {
      return this.createErrorResult('inventory-turnover', 'معدل دوران المخزون');
    }

    const inventoryTurnover = costOfGoodsSold / averageInventory;
    const daysInInventory = 365 / inventoryTurnover;

    return {
      id: 'inventory-turnover',
      name: 'معدل دوران المخزون',
      category: 'activity',
      type: 'ratio',
      currentValue: inventoryTurnover,
      rating: this.rateInventoryTurnover(inventoryTurnover),
      interpretation: `معدل دوران المخزون ${inventoryTurnover.toFixed(2)} يعني أن المخزون يتم بيعه ${inventoryTurnover.toFixed(1)} مرة في السنة، أي كل ${daysInInventory.toFixed(0)} يوم`,
      calculation: {
        formula: 'تكلفة البضاعة المباعة ÷ متوسط المخزون',
        variables: {
          'تكلفة البضاعة المباعة': costOfGoodsSold,
          'متوسط المخزون': averageInventory,
          'أيام المخزون': daysInInventory
        }
      },
      insights: [
        inventoryTurnover > 6 ? 'دوران ممتاز للمخزون يدل على كفاءة عالية في إدارة المخزون' : '',
        inventoryTurnover < 2 ? 'دوران بطيء للمخزون قد يشير لمشاكل في المبيعات أو إدارة المخزون' : '',
        inventoryTurnover > 12 ? 'دوران سريع جداً قد يشير لنقص في المخزون' : ''
      ].filter(Boolean),
      recommendations: [
        inventoryTurnover < 3 ? 'تحسين إدارة المخزون وتقليل المخزون الراكد' : '',
        inventoryTurnover > 10 ? 'التأكد من توفر المخزون الكافي لتلبية الطلب' : '',
        'مراقبة اتجاهات دوران المخزون عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.inventoryTurnover ? {
        value: benchmarkData.inventoryTurnover.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateReceivablesTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const averageReceivables = statement.balanceSheet.accountsReceivable || 0;
    
    if (averageReceivables === 0) {
      return this.createErrorResult('receivables-turnover', 'معدل دوران الذمم المدينة');
    }

    const receivablesTurnover = revenue / averageReceivables;
    const daysSalesOutstanding = 365 / receivablesTurnover;

    return {
      id: 'receivables-turnover',
      name: 'معدل دوران الذمم المدينة',
      category: 'activity',
      type: 'ratio',
      currentValue: receivablesTurnover,
      rating: this.rateReceivablesTurnover(receivablesTurnover),
      interpretation: `معدل دوران الذمم المدينة ${receivablesTurnover.toFixed(2)} يعني أن الذمم المدينة يتم تحصيلها ${receivablesTurnover.toFixed(1)} مرة في السنة، أي كل ${daysSalesOutstanding.toFixed(0)} يوم`,
      calculation: {
        formula: 'الإيرادات ÷ متوسط الذمم المدينة',
        variables: {
          'الإيرادات': revenue,
          'متوسط الذمم المدينة': averageReceivables,
          'أيام التحصيل': daysSalesOutstanding
        }
      },
      insights: [
        receivablesTurnover > 8 ? 'دوران ممتاز للذمم المدينة يدل على كفاءة عالية في التحصيل' : '',
        receivablesTurnover < 4 ? 'دوران بطيء للذمم المدينة قد يشير لمشاكل في التحصيل' : '',
        receivablesTurnover > 15 ? 'دوران سريع جداً قد يشير لسياسة ائتمان صارمة' : ''
      ].filter(Boolean),
      recommendations: [
        receivablesTurnover < 5 ? 'تحسين سياسات التحصيل وتقليل فترة التحصيل' : '',
        receivablesTurnover > 12 ? 'مراجعة سياسة الائتمان للتأكد من عدم فقدان العملاء' : '',
        'مراقبة اتجاهات دوران الذمم المدينة عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.receivablesTurnover ? {
        value: benchmarkData.receivablesTurnover.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculatePayablesTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const costOfGoodsSold = statement.incomeStatement.costOfGoodsSold || 0;
    const averagePayables = statement.balanceSheet.accountsPayable || 0;
    
    if (averagePayables === 0) {
      return this.createErrorResult('payables-turnover', 'معدل دوران الذمم الدائنة');
    }

    const payablesTurnover = costOfGoodsSold / averagePayables;
    const daysPayableOutstanding = 365 / payablesTurnover;

    return {
      id: 'payables-turnover',
      name: 'معدل دوران الذمم الدائنة',
      category: 'activity',
      type: 'ratio',
      currentValue: payablesTurnover,
      rating: this.ratePayablesTurnover(payablesTurnover),
      interpretation: `معدل دوران الذمم الدائنة ${payablesTurnover.toFixed(2)} يعني أن الذمم الدائنة يتم سدادها ${payablesTurnover.toFixed(1)} مرة في السنة، أي كل ${daysPayableOutstanding.toFixed(0)} يوم`,
      calculation: {
        formula: 'تكلفة البضاعة المباعة ÷ متوسط الذمم الدائنة',
        variables: {
          'تكلفة البضاعة المباعة': costOfGoodsSold,
          'متوسط الذمم الدائنة': averagePayables,
          'أيام السداد': daysPayableOutstanding
        }
      },
      insights: [
        payablesTurnover > 6 ? 'دوران ممتاز للذمم الدائنة يدل على كفاءة عالية في إدارة المدفوعات' : '',
        payablesTurnover < 3 ? 'دوران بطيء للذمم الدائنة قد يشير لمشاكل في السيولة' : '',
        payablesTurnover > 12 ? 'دوران سريع جداً قد يشير لسياسة دفع صارمة' : ''
      ].filter(Boolean),
      recommendations: [
        payablesTurnover < 4 ? 'تحسين إدارة المدفوعات وتقليل فترة السداد' : '',
        payablesTurnover > 10 ? 'مراجعة سياسة الدفع للتأكد من عدم فقدان الموردين' : '',
        'مراقبة اتجاهات دوران الذمم الدائنة عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.payablesTurnover ? {
        value: benchmarkData.payablesTurnover.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateFixedAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const fixedAssets = statement.balanceSheet.fixedAssets || 0;
    
    if (fixedAssets === 0) {
      return this.createErrorResult('fixed-asset-turnover', 'معدل دوران الأصول الثابتة');
    }

    const fixedAssetTurnover = revenue / fixedAssets;

    return {
      id: 'fixed-asset-turnover',
      name: 'معدل دوران الأصول الثابتة',
      category: 'activity',
      type: 'ratio',
      currentValue: fixedAssetTurnover,
      rating: this.rateFixedAssetTurnover(fixedAssetTurnover),
      interpretation: `معدل دوران الأصول الثابتة ${fixedAssetTurnover.toFixed(2)} يعني أن كل ريال من الأصول الثابتة يولد ${fixedAssetTurnover.toFixed(2)} ريال من الإيرادات`,
      calculation: {
        formula: 'الإيرادات ÷ الأصول الثابتة',
        variables: {
          'الإيرادات': revenue,
          'الأصول الثابتة': fixedAssets
        }
      },
      insights: [
        fixedAssetTurnover > 2 ? 'كفاءة ممتازة في استخدام الأصول الثابتة' : '',
        fixedAssetTurnover < 1 ? 'كفاءة منخفضة في استخدام الأصول الثابتة' : '',
        fixedAssetTurnover > 5 ? 'كفاءة عالية جداً قد تشير لاستثمارات قليلة' : ''
      ].filter(Boolean),
      recommendations: [
        fixedAssetTurnover < 1.5 ? 'تحسين كفاءة استخدام الأصول الثابتة أو تقليل الاستثمارات' : '',
        fixedAssetTurnover > 4 ? 'مراجعة الاستثمارات في الأصول الثابتة' : '',
        'مراقبة اتجاهات دوران الأصول الثابتة عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.fixedAssetTurnover ? {
        value: benchmarkData.fixedAssetTurnover.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateTotalAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('total-asset-turnover', 'معدل دوران إجمالي الأصول');
    }

    const totalAssetTurnover = revenue / totalAssets;

    return {
      id: 'total-asset-turnover',
      name: 'معدل دوران إجمالي الأصول',
      category: 'activity',
      type: 'ratio',
      currentValue: totalAssetTurnover,
      rating: this.rateTotalAssetTurnover(totalAssetTurnover),
      interpretation: `معدل دوران إجمالي الأصول ${totalAssetTurnover.toFixed(2)} يعني أن كل ريال من الأصول يولد ${totalAssetTurnover.toFixed(2)} ريال من الإيرادات`,
      calculation: {
        formula: 'الإيرادات ÷ إجمالي الأصول',
        variables: {
          'الإيرادات': revenue,
          'إجمالي الأصول': totalAssets
        }
      },
      insights: [
        totalAssetTurnover > 1.5 ? 'كفاءة ممتازة في استخدام الأصول' : '',
        totalAssetTurnover < 0.8 ? 'كفاءة منخفضة في استخدام الأصول' : '',
        totalAssetTurnover > 3 ? 'كفاءة عالية جداً قد تشير لاستثمارات قليلة' : ''
      ].filter(Boolean),
      recommendations: [
        totalAssetTurnover < 1 ? 'تحسين كفاءة استخدام الأصول أو تقليل الاستثمارات' : '',
        totalAssetTurnover > 2.5 ? 'مراجعة الاستثمارات في الأصول' : '',
        'مراقبة اتجاهات دوران الأصول عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.totalAssetTurnover ? {
        value: benchmarkData.totalAssetTurnover.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Helper methods for rating
  private rateInventoryTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 6) return 'excellent';
    if (turnover >= 4) return 'good';
    if (turnover >= 2) return 'average';
    return 'poor';
  }

  private rateReceivablesTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 8) return 'excellent';
    if (turnover >= 6) return 'good';
    if (turnover >= 4) return 'average';
    return 'poor';
  }

  private ratePayablesTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 6) return 'excellent';
    if (turnover >= 4) return 'good';
    if (turnover >= 3) return 'average';
    return 'poor';
  }

  private rateFixedAssetTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 2) return 'excellent';
    if (turnover >= 1.5) return 'good';
    if (turnover >= 1) return 'average';
    return 'poor';
  }

  private rateTotalAssetTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 1.5) return 'excellent';
    if (turnover >= 1.2) return 'good';
    if (turnover >= 0.8) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 10 المتبقية...
  private calculateWorkingCapitalTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('working-capital-turnover', 'معدل دوران رأس المال العامل');
  }

  private calculateEquityTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('equity-turnover', 'معدل دوران حقوق الملكية');
  }

  private calculateCurrentAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('current-asset-turnover', 'معدل دوران الأصول المتداولة');
  }

  private calculateNonCurrentAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('non-current-asset-turnover', 'معدل دوران الأصول غير المتداولة');
  }

  private calculateTangibleAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('tangible-asset-turnover', 'معدل دوران الأصول الملموسة');
  }

  private calculateIntangibleAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('intangible-asset-turnover', 'معدل دوران الأصول غير الملموسة');
  }

  private calculateInvestmentAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('investment-asset-turnover', 'معدل دوران الأصول الاستثمارية');
  }

  private calculateFinancialAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('financial-asset-turnover', 'معدل دوران الأصول المالية');
  }

  private calculateOperatingAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('operating-asset-turnover', 'معدل دوران الأصول التشغيلية');
  }

  private calculateNetAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('net-asset-turnover', 'معدل دوران الأصول الصافية');
  }
}
