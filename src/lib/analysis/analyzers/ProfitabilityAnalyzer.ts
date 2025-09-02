import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class ProfitabilityAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. هامش الربح الإجمالي
      results.push(this.calculateGrossProfitMargin(latestStatement, benchmarkData));
      
      // 2. هامش الربح التشغيلي
      results.push(this.calculateOperatingProfitMargin(latestStatement, benchmarkData));
      
      // 3. هامش صافي الربح
      results.push(this.calculateNetProfitMargin(latestStatement, benchmarkData));
      
      // 4. العائد على الأصول (ROA)
      results.push(this.calculateReturnOnAssets(latestStatement, benchmarkData));
      
      // 5. العائد على حقوق الملكية (ROE)
      results.push(this.calculateReturnOnEquity(latestStatement, benchmarkData));
      
      // 6. العائد على رأس المال المستثمر (ROIC)
      results.push(this.calculateReturnOnInvestedCapital(latestStatement, benchmarkData));
      
      // 7. العائد على الاستثمار (ROI)
      results.push(this.calculateReturnOnInvestment(latestStatement, benchmarkData));
      
      // 8. هامش المساهمة
      results.push(this.calculateContributionMargin(latestStatement, benchmarkData));
      
      // 9. هامش الأرباح قبل الفوائد والضرائب (EBIT)
      results.push(this.calculateEBITMargin(latestStatement, benchmarkData));
      
      // 10. هامش الأرباح قبل الفوائد والضرائب والإهلاك (EBITDA)
      results.push(this.calculateEBITDAMargin(latestStatement, benchmarkData));
      
      // 11. العائد على رأس المال العامل
      results.push(this.calculateReturnOnWorkingCapital(latestStatement, benchmarkData));
      
      // 12. العائد على الأصول الثابتة
      results.push(this.calculateReturnOnFixedAssets(latestStatement, benchmarkData));
      
      // 13. العائد على المبيعات
      results.push(this.calculateReturnOnSales(latestStatement, benchmarkData));
      
      // 14. العائد على رأس المال المستخدم
      results.push(this.calculateReturnOnCapitalEmployed(latestStatement, benchmarkData));
      
      // 15. العائد على الاستثمارات
      results.push(this.calculateReturnOnInvestments(latestStatement, benchmarkData));
      
      // 16. العائد على الأصول التشغيلية
      results.push(this.calculateReturnOnOperatingAssets(latestStatement, benchmarkData));
      
      // 17. العائد على الأصول غير الملموسة
      results.push(this.calculateReturnOnIntangibleAssets(latestStatement, benchmarkData));
      
      // 18. العائد على الأصول المالية
      results.push(this.calculateReturnOnFinancialAssets(latestStatement, benchmarkData));
      
      // 19. العائد على الأصول الاستثمارية
      results.push(this.calculateReturnOnInvestmentAssets(latestStatement, benchmarkData));
      
      // 20. العائد على الأصول المتداولة
      results.push(this.calculateReturnOnCurrentAssets(latestStatement, benchmarkData));
      
      // 21. العائد على الأصول غير المتداولة
      results.push(this.calculateReturnOnNonCurrentAssets(latestStatement, benchmarkData));
      
      // 22. العائد على الأصول الملموسة
      results.push(this.calculateReturnOnTangibleAssets(latestStatement, benchmarkData));
      
      // 23. العائد على الأصول الصافية
      results.push(this.calculateReturnOnNetAssets(latestStatement, benchmarkData));
      
      // 24. العائد على الأصول الإجمالية
      results.push(this.calculateReturnOnTotalAssets(latestStatement, benchmarkData));
      
      // 25. العائد على الأصول المتاحة
      results.push(this.calculateReturnOnAvailableAssets(latestStatement, benchmarkData));

      return results;
    } catch (error) {
      console.error('Profitability Analysis Error:', error);
      return [this.createErrorResult('profitability-error', 'خطأ في تحليل الربحية')];
    }
  }

  private calculateGrossProfitMargin(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const costOfGoodsSold = statement.incomeStatement.costOfGoodsSold || 0;
    const grossProfit = revenue - costOfGoodsSold;
    
    if (revenue === 0) {
      return this.createErrorResult('gross-profit-margin', 'هامش الربح الإجمالي');
    }

    const grossProfitMargin = (grossProfit / revenue) * 100;

    return {
      id: 'gross-profit-margin',
      name: 'هامش الربح الإجمالي',
      category: 'profitability',
      type: 'percentage',
      currentValue: grossProfitMargin,
      rating: this.rateProfitMargin(grossProfitMargin, 'gross'),
      interpretation: `هامش الربح الإجمالي ${grossProfitMargin.toFixed(2)}% يعني أن الشركة تحتفظ بـ ${grossProfitMargin.toFixed(1)}% من كل ريال مبيعات كربح إجمالي`,
      calculation: {
        formula: '(الربح الإجمالي ÷ الإيرادات) × 100',
        variables: {
          'الربح الإجمالي': grossProfit,
          'الإيرادات': revenue,
          'تكلفة البضاعة المباعة': costOfGoodsSold
        }
      },
      insights: [
        grossProfitMargin > 50 ? 'هامش ربح إجمالي ممتاز يدل على قوة التسعير أو كفاءة التكلفة' : '',
        grossProfitMargin < 20 ? 'هامش ربح إجمالي منخفض قد يشير لمشاكل في التسعير أو ارتفاع التكاليف' : '',
        grossProfitMargin > 70 ? 'هامش ربح إجمالي عالي جداً قد يشير لاحتكار أو ميزة تنافسية قوية' : ''
      ].filter(Boolean),
      recommendations: [
        grossProfitMargin < 25 ? 'مراجعة استراتيجية التسعير وتحسين كفاءة الإنتاج' : '',
        grossProfitMargin > 60 ? 'التأكد من استدامة الميزة التنافسية ومراقبة المنافسين' : '',
        'مقارنة الهامش مع متوسط الصناعة والمنافسين'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.grossProfitMargin ? {
        value: benchmarkData.grossProfitMargin.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateOperatingProfitMargin(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    
    if (revenue === 0) {
      return this.createErrorResult('operating-profit-margin', 'هامش الربح التشغيلي');
    }

    const operatingProfitMargin = (operatingIncome / revenue) * 100;

    return {
      id: 'operating-profit-margin',
      name: 'هامش الربح التشغيلي',
      category: 'profitability',
      type: 'percentage',
      currentValue: operatingProfitMargin,
      rating: this.rateProfitMargin(operatingProfitMargin, 'operating'),
      interpretation: `هامش الربح التشغيلي ${operatingProfitMargin.toFixed(2)}% يعكس كفاءة العمليات التشغيلية للشركة`,
      calculation: {
        formula: '(الربح التشغيلي ÷ الإيرادات) × 100',
        variables: {
          'الربح التشغيلي': operatingIncome,
          'الإيرادات': revenue
        }
      },
      insights: [
        operatingProfitMargin > 15 ? 'كفاءة تشغيلية ممتازة تدل على إدارة جيدة للعمليات' : '',
        operatingProfitMargin < 5 ? 'كفاءة تشغيلية منخفضة تحتاج تحسين في إدارة التكاليف' : '',
        operatingProfitMargin < 0 ? 'خسائر تشغيلية تتطلب مراجعة فورية للعمليات' : ''
      ].filter(Boolean),
      recommendations: [
        operatingProfitMargin < 8 ? 'تحسين كفاءة العمليات وتقليل المصروفات التشغيلية' : '',
        operatingProfitMargin > 25 ? 'التأكد من استدامة الكفاءة التشغيلية العالية' : '',
        'مراقبة الاتجاهات في الهامش التشغيلي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.operatingProfitMargin ? {
        value: benchmarkData.operatingProfitMargin.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateNetProfitMargin(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const netIncome = statement.incomeStatement.netIncome || 0;
    
    if (revenue === 0) {
      return this.createErrorResult('net-profit-margin', 'هامش صافي الربح');
    }

    const netProfitMargin = (netIncome / revenue) * 100;

    return {
      id: 'net-profit-margin',
      name: 'هامش صافي الربح',
      category: 'profitability',
      type: 'percentage',
      currentValue: netProfitMargin,
      rating: this.rateProfitMargin(netProfitMargin, 'net'),
      interpretation: `هامش صافي الربح ${netProfitMargin.toFixed(2)}% يُظهر النسبة المئوية من الإيرادات التي تبقى كربح صافي بعد جميع التكاليف والضرائب`,
      calculation: {
        formula: '(صافي الربح ÷ الإيرادات) × 100',
        variables: {
          'صافي الربح': netIncome,
          'الإيرادات': revenue
        }
      },
      insights: [
        netProfitMargin > 10 ? 'ربحية ممتازة تدل على إدارة مالية قوية' : '',
        netProfitMargin < 3 ? 'ربحية منخفضة تحتاج تحسين في جميع جوانب العمليات' : '',
        netProfitMargin < 0 ? 'خسائر صافية تتطلب تدخل فوري' : ''
      ].filter(Boolean),
      recommendations: [
        netProfitMargin < 5 ? 'تحسين الربحية من خلال زيادة الإيرادات وتقليل التكاليف' : '',
        netProfitMargin > 20 ? 'التأكد من استدامة الربحية العالية' : '',
        'مقارنة الهامش مع المنافسين ومتوسط الصناعة'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.netProfitMargin ? {
        value: benchmarkData.netProfitMargin.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateReturnOnAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('return-on-assets', 'العائد على الأصول (ROA)');
    }

    const roa = (netIncome / totalAssets) * 100;

    return {
      id: 'return-on-assets',
      name: 'العائد على الأصول (ROA)',
      category: 'profitability',
      type: 'percentage',
      currentValue: roa,
      rating: this.rateROA(roa),
      interpretation: `العائد على الأصول ${roa.toFixed(2)}% يُظهر كفاءة الشركة في استخدام أصولها لتوليد الأرباح`,
      calculation: {
        formula: '(صافي الربح ÷ إجمالي الأصول) × 100',
        variables: {
          'صافي الربح': netIncome,
          'إجمالي الأصول': totalAssets
        }
      },
      insights: [
        roa > 15 ? 'كفاءة ممتازة في استخدام الأصول' : '',
        roa < 5 ? 'كفاءة منخفضة في استخدام الأصول تحتاج تحسين' : '',
        roa < 0 ? 'خسائر في استخدام الأصول' : ''
      ].filter(Boolean),
      recommendations: [
        roa < 8 ? 'تحسين كفاءة استخدام الأصول أو تقليل الأصول غير المستخدمة' : '',
        roa > 20 ? 'التأكد من استدامة الكفاءة العالية' : '',
        'مراقبة اتجاهات ROA عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.roa ? {
        value: benchmarkData.roa.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateReturnOnEquity(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    
    if (shareholdersEquity === 0) {
      return this.createErrorResult('return-on-equity', 'العائد على حقوق الملكية (ROE)');
    }

    const roe = (netIncome / shareholdersEquity) * 100;

    return {
      id: 'return-on-equity',
      name: 'العائد على حقوق الملكية (ROE)',
      category: 'profitability',
      type: 'percentage',
      currentValue: roe,
      rating: this.rateROE(roe),
      interpretation: `العائد على حقوق الملكية ${roe.toFixed(2)}% يُظهر العائد الذي يحققه المساهمون على استثماراتهم`,
      calculation: {
        formula: '(صافي الربح ÷ حقوق الملكية) × 100',
        variables: {
          'صافي الربح': netIncome,
          'حقوق الملكية': shareholdersEquity
        }
      },
      insights: [
        roe > 20 ? 'عائد ممتاز للمساهمين يدل على إدارة مالية قوية' : '',
        roe < 10 ? 'عائد منخفض للمساهمين قد يؤثر على جاذبية الاستثمار' : '',
        roe < 0 ? 'خسائر للمساهمين' : ''
      ].filter(Boolean),
      recommendations: [
        roe < 12 ? 'تحسين الربحية أو تقليل حقوق الملكية من خلال إعادة شراء الأسهم' : '',
        roe > 30 ? 'التأكد من استدامة العائد العالي' : '',
        'مقارنة ROE مع متوسط الصناعة والمنافسين'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.roe ? {
        value: benchmarkData.roe.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateReturnOnInvestedCapital(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    const taxRate = 0.25; // معدل ضريبي افتراضي
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const investedCapital = totalDebt + shareholdersEquity;
    
    if (investedCapital === 0) {
      return this.createErrorResult('return-on-invested-capital', 'العائد على رأس المال المستثمر (ROIC)');
    }

    const nopat = netIncome + (interestExpense * (1 - taxRate));
    const roic = (nopat / investedCapital) * 100;

    return {
      id: 'return-on-invested-capital',
      name: 'العائد على رأس المال المستثمر (ROIC)',
      category: 'profitability',
      type: 'percentage',
      currentValue: roic,
      rating: this.rateROIC(roic),
      interpretation: `العائد على رأس المال المستثمر ${roic.toFixed(2)}% يُظهر كفاءة الشركة في استخدام رأس المال المستثمر لتوليد الأرباح`,
      calculation: {
        formula: '(NOPAT ÷ رأس المال المستثمر) × 100',
        variables: {
          'NOPAT': nopat,
          'رأس المال المستثمر': investedCapital,
          'إجمالي الديون': totalDebt,
          'حقوق الملكية': shareholdersEquity
        }
      },
      insights: [
        roic > 15 ? 'كفاءة ممتازة في استخدام رأس المال المستثمر' : '',
        roic < 8 ? 'كفاءة منخفضة في استخدام رأس المال المستثمر' : '',
        roic < 0 ? 'خسائر في استخدام رأس المال المستثمر' : ''
      ].filter(Boolean),
      recommendations: [
        roic < 10 ? 'تحسين كفاءة استخدام رأس المال المستثمر' : '',
        roic > 25 ? 'التأكد من استدامة الكفاءة العالية' : '',
        'مقارنة ROIC مع تكلفة رأس المال'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.roic ? {
        value: benchmarkData.roic.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Helper methods for rating
  private rateProfitMargin(margin: number, type: 'gross' | 'operating' | 'net'): 'excellent' | 'good' | 'average' | 'poor' {
    const thresholds = {
      gross: { excellent: 50, good: 35, average: 20 },
      operating: { excellent: 20, good: 12, average: 6 },
      net: { excellent: 15, good: 8, average: 3 }
    };
    
    const threshold = thresholds[type];
    if (margin >= threshold.excellent) return 'excellent';
    if (margin >= threshold.good) return 'good';
    if (margin >= threshold.average) return 'average';
    return 'poor';
  }

  private rateROA(roa: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (roa >= 15) return 'excellent';
    if (roa >= 10) return 'good';
    if (roa >= 5) return 'average';
    return 'poor';
  }

  private rateROE(roe: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (roe >= 20) return 'excellent';
    if (roe >= 15) return 'good';
    if (roe >= 10) return 'average';
    return 'poor';
  }

  private rateROIC(roic: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (roic >= 15) return 'excellent';
    if (roic >= 10) return 'good';
    if (roic >= 6) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 20 المتبقية...
  private calculateReturnOnInvestment(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-investment', 'العائد على الاستثمار (ROI)');
  }

  private calculateContributionMargin(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('contribution-margin', 'هامش المساهمة');
  }

  private calculateEBITMargin(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ebit-margin', 'هامش الأرباح قبل الفوائد والضرائب (EBIT)');
  }

  private calculateEBITDAMargin(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ebitda-margin', 'هامش الأرباح قبل الفوائد والضرائب والإهلاك (EBITDA)');
  }

  private calculateReturnOnWorkingCapital(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-working-capital', 'العائد على رأس المال العامل');
  }

  private calculateReturnOnFixedAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-fixed-assets', 'العائد على الأصول الثابتة');
  }

  private calculateReturnOnSales(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-sales', 'العائد على المبيعات');
  }

  private calculateReturnOnCapitalEmployed(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-capital-employed', 'العائد على رأس المال المستخدم');
  }

  private calculateReturnOnInvestments(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-investments', 'العائد على الاستثمارات');
  }

  private calculateReturnOnOperatingAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-operating-assets', 'العائد على الأصول التشغيلية');
  }

  private calculateReturnOnIntangibleAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-intangible-assets', 'العائد على الأصول غير الملموسة');
  }

  private calculateReturnOnFinancialAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-financial-assets', 'العائد على الأصول المالية');
  }

  private calculateReturnOnInvestmentAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-investment-assets', 'العائد على الأصول الاستثمارية');
  }

  private calculateReturnOnCurrentAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-current-assets', 'العائد على الأصول المتداولة');
  }

  private calculateReturnOnNonCurrentAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-non-current-assets', 'العائد على الأصول غير المتداولة');
  }

  private calculateReturnOnTangibleAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-tangible-assets', 'العائد على الأصول الملموسة');
  }

  private calculateReturnOnNetAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-net-assets', 'العائد على الأصول الصافية');
  }

  private calculateReturnOnTotalAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-total-assets', 'العائد على الأصول الإجمالية');
  }

  private calculateReturnOnAvailableAssets(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('return-on-available-assets', 'العائد على الأصول المتاحة');
  }
}