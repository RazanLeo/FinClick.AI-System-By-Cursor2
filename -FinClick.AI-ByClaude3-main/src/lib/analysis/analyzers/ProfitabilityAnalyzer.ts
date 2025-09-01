import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class ProfitabilityAnalyzer extends BaseAnalyzer {
  async analyze(
    financialData: FinancialStatement[],
    companyData: Company,
    marketData?: any,
    benchmarkData?: any
  ): Promise<AnalysisResult[]> {
    
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. هامش الربح الإجمالي
      results.push(this.calculateGrossProfitMargin(latestStatement, benchmarkData));

      // 2. هامش الربح التشغيلي  
      results.push(this.calculateOperatingProfitMargin(latestStatement, benchmarkData));

      // 3. هامش الربح الصافي
      results.push(this.calculateNetProfitMargin(latestStatement, benchmarkData));

      // 4. العائد على الأصول (ROA)
      results.push(this.calculateROA(latestStatement, benchmarkData));

      // 5. العائد على حقوق الملكية (ROE)
      results.push(this.calculateROE(latestStatement, benchmarkData));

      // 6. العائد على الاستثمار (ROI)
      results.push(this.calculateROI(latestStatement, benchmarkData));

      // 7. العائد على رأس المال المستثمر (ROIC)
      results.push(this.calculateROIC(latestStatement, benchmarkData));

      // 8. هامش الربح قبل الفوائد والضرائب (EBITDA)
      results.push(this.calculateEBITDAMargin(latestStatement, benchmarkData));

      // 9. نسبة تغطية الفوائد
      results.push(this.calculateInterestCoverageRatio(latestStatement, benchmarkData));

      // 10. العائد على المبيعات
      results.push(this.calculateReturnOnSales(latestStatement, benchmarkData));

      // 11. العائد على رأس المال العامل
      results.push(this.calculateROWC(latestStatement, benchmarkData));

      // 12. هامش الربح التشغيلي المعدل
      results.push(this.calculateAdjustedOperatingMargin(latestStatement, benchmarkData));

      // 13. نسبة الأرباح المحتجزة
      results.push(this.calculateRetainedEarningsRatio(latestStatement, benchmarkData));

      // 14. معدل نمو الأرباح المستدام
      results.push(this.calculateSustainableGrowthRate(latestStatement, benchmarkData));

      // 15. العائد على الأصول المتداولة
      results.push(this.calculateReturnOnCurrentAssets(latestStatement, benchmarkData));

      // 16. العائد على الأصول الثابتة
      results.push(this.calculateReturnOnFixedAssets(latestStatement, benchmarkData));

      // 17. نسبة التشغيل
      results.push(this.calculateOperatingRatio(latestStatement, benchmarkData));

      // 18. هامش المساهمة
      results.push(this.calculateContributionMargin(latestStatement, benchmarkData));

      // 19. نقطة التعادل
      results.push(this.calculateBreakEvenPoint(latestStatement, benchmarkData));

      // 20. هامش الأمان
      results.push(this.calculateMarginOfSafety(latestStatement, benchmarkData));

      // 21. الرافعة التشغيلية
      results.push(this.calculateOperatingLeverage(latestStatement, benchmarkData));

      // 22. كفاءة الأصول
      results.push(this.calculateAssetEfficiency(latestStatement, benchmarkData));

      // 23. العائد الاقتصادي المضاف (EVA)
      results.push(this.calculateEVA(latestStatement, benchmarkData));

      // 24. العائد على الاستثمار المعدل (ROIC)
      results.push(this.calculateAdjustedROIC(latestStatement, benchmarkData));

      // 25. نسبة الربحية الإجمالية
      results.push(this.calculateOverallProfitability(latestStatement, benchmarkData));

      return results;

    } catch (error) {
      console.error('Profitability Analysis Error:', error);
      return [{
        id: 'profitability-error',
        name: 'خطأ في تحليل الربحية',
        category: 'profitability',
        currentValue: 0,
        rating: 'poor',
        interpretation: 'فشل في حساب مؤشرات الربحية',
        status: 'error'
      }];
    }
  }

  private calculateGrossProfitMargin(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const cogs = statement.incomeStatement.costOfGoodsSold || 0;
    
    if (revenue === 0) {
      return this.createErrorResult('gross-profit-margin', 'هامش الربح الإجمالي');
    }

    const grossProfit = revenue - cogs;
    const margin = grossProfit / revenue;

    return {
      id: 'gross-profit-margin',
      name: 'هامش الربح الإجمالي',
      category: 'profitability',
      type: 'percentage',
      currentValue: margin,
      rating: this.rateGrossProfitMargin(margin),
      trend: this.calculateTrend([margin], 'up_is_better'),
      interpretation: this.interpretGrossProfitMargin(margin),
      calculation: {
        formula: '(الإيرادات - تكلفة البضاعة المباعة) ÷ الإيرادات',
        variables: {
          'الإيرادات': revenue,
          'تكلفة البضاعة المباعة': cogs,
          'الربح الإجمالي': grossProfit
        }
      },
      insights: [
        margin > 0.4 ? 'هامش ربح إجمالي ممتاز يشير إلى قوة التسعير والكفاءة التشغيلية' : '',
        margin < 0.2 ? 'هامش ربح إجمالي منخفض يتطلب مراجعة التكاليف والتسعير' : '',
        margin > 0.6 ? 'هامش ربح إجمالي استثنائي قد يشير إلى ميزة تنافسية قوية' : ''
      ].filter(Boolean),
      recommendations: [
        margin < 0.2 ? 'مراجعة استراتيجية التسعير وتحسين كفاءة الإنتاج' : '',
        margin < 0.3 ? 'تحليل هيكل التكاليف والبحث عن فرص توفير' : '',
        'مراقبة هوامش الربح مقارنة بالمنافسين في الصناعة'
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
    const operatingIncome = statement.incomeStatement.operatingIncome || 
                           ((statement.incomeStatement.revenue || 0) - (statement.incomeStatement.totalExpenses || 0));
    
    if (revenue === 0) {
      return this.createErrorResult('operating-profit-margin', 'هامش الربح التشغيلي');
    }

    const margin = operatingIncome / revenue;

    return {
      id: 'operating-profit-margin',
      name: 'هامش الربح التشغيلي',
      category: 'profitability',
      type: 'percentage',
      currentValue: margin,
      rating: this.rateOperatingProfitMargin(margin),
      trend: this.calculateTrend([margin], 'up_is_better'),
      interpretation: this.interpretOperatingProfitMargin(margin),
      calculation: {
        formula: 'الربح التشغيلي ÷ الإيرادات',
        variables: {
          'الربح التشغيلي': operatingIncome,
          'الإيرادات': revenue
        }
      },
      insights: [
        margin > 0.15 ? 'كفاءة تشغيلية ممتازة في إدارة التكاليف والعمليات' : '',
        margin < 0.05 ? 'ضعف في الكفاءة التشغيلية يتطلب تحسين العمليات' : '',
        operatingIncome < 0 ? 'خسائر تشغيلية تتطلب إعادة هيكلة العمليات' : ''
      ].filter(Boolean),
      recommendations: [
        margin < 0.05 ? 'مراجعة شاملة للتكاليف التشغيلية وتحسين الكفاءة' : '',
        margin < 0.1 ? 'تحسين العمليات وتقليل النفقات الإدارية' : '',
        'مقارنة الأداء التشغيلي مع أفضل الممارسات في الصناعة'
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
      return this.createErrorResult('net-profit-margin', 'هامش الربح الصافي');
    }

    const margin = netIncome / revenue;

    return {
      id: 'net-profit-margin',
      name: 'هامش الربح الصافي',
      category: 'profitability',
      type: 'percentage',
      currentValue: margin,
      rating: this.rateNetProfitMargin(margin),
      trend: this.calculateTrend([margin], 'up_is_better'),
      interpretation: this.interpretNetProfitMargin(margin),
      calculation: {
        formula: 'صافي الربح ÷ الإيرادات',
        variables: {
          'صافي الربح': netIncome,
          'الإيرادات': revenue
        }
      },
      insights: [
        margin > 0.1 ? 'ربحية صافية ممتازة تعكس إدارة مالية فعالة' : '',
        margin < 0.03 ? 'هامش ربح صافي ضعيف يحتاج لتحسين شامل' : '',
        netIncome < 0 ? 'خسائر صافية تتطلب مراجعة استراتيجية شاملة' : ''
      ].filter(Boolean),
      recommendations: [
        margin < 0.05 ? 'مراجعة شاملة للاستراتيجية المالية والتشغيلية' : '',
        netIncome < 0 ? 'إعادة هيكلة العمليات وتقليل التكاليف' : '',
        'تحسين إدارة الضرائب والتكاليف المالية'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.netProfitMargin ? {
        value: benchmarkData.netProfitMargin.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateROA(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('roa', 'العائد على الأصول (ROA)');
    }

    const roa = netIncome / totalAssets;

    return {
      id: 'roa',
      name: 'العائد على الأصول (ROA)',
      category: 'profitability',
      type: 'percentage',
      currentValue: roa,
      rating: this.rateROA(roa),
      trend: this.calculateTrend([roa], 'up_is_better'),
      interpretation: this.interpretROA(roa),
      calculation: {
        formula: 'صافي الربح ÷ إجمالي الأصول',
        variables: {
          'صافي الربح': netIncome,
          'إجمالي الأصول': totalAssets
        }
      },
      insights: [
        roa > 0.1 ? 'كفاءة ممتازة في استغلال الأصول لتوليد الأرباح' : '',
        roa < 0.02 ? 'ضعف في كفاءة استخدام الأصول' : '',
        roa > 0.15 ? 'أداء استثنائي في إدارة الأصول' : ''
      ].filter(Boolean),
      recommendations: [
        roa < 0.05 ? 'تحسين كفاءة استخدام الأصول وزيادة الإنتاجية' : '',
        roa < 0.02 ? 'مراجعة محفظة الأصول والتخلص من غير المربح' : '',
        'تحسين معدل دوران الأصول وهوامش الربح'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.roa ? {
        value: benchmarkData.roa.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateROE(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    
    if (shareholdersEquity === 0) {
      return this.createErrorResult('roe', 'العائد على حقوق الملكية (ROE)');
    }

    const roe = netIncome / shareholdersEquity;

    return {
      id: 'roe',
      name: 'العائد على حقوق الملكية (ROE)',
      category: 'profitability',
      type: 'percentage',
      currentValue: roe,
      rating: this.rateROE(roe),
      trend: this.calculateTrend([roe], 'up_is_better'),
      interpretation: this.interpretROE(roe),
      calculation: {
        formula: 'صافي الربح ÷ حقوق المساهمين',
        variables: {
          'صافي الربح': netIncome,
          'حقوق المساهمين': shareholdersEquity
        }
      },
      insights: [
        roe > 0.15 ? 'عائد ممتاز على استثمارات المساهمين' : '',
        roe < 0.05 ? 'عائد ضعيف لا يلبي توقعات المساهمين' : '',
        roe > 0.25 ? 'عائد استثنائي قد يشير لفرص نمو أو مخاطر عالية' : ''
      ].filter(Boolean),
      recommendations: [
        roe < 0.1 ? 'تحسين الربحية أو مراجعة هيكل رأس المال' : '',
        roe < 0.05 ? 'إعادة النظر في الاستراتيجية الاستثمارية' : '',
        'مراقبة العائد مقارنة بتكلفة رأس المال'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.roe ? {
        value: benchmarkData.roe.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateROI(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const totalInvestment = (statement.balanceSheet.totalAssets || 0) - (statement.balanceSheet.currentLiabilities || 0);
    
    if (totalInvestment === 0) {
      return this.createErrorResult('roi', 'العائد على الاستثمار (ROI)');
    }

    const roi = netIncome / totalInvestment;

    return {
      id: 'roi',
      name: 'العائد على الاستثمار (ROI)',
      category: 'profitability',
      type: 'percentage',
      currentValue: roi,
      rating: this.rateROI(roi),
      trend: this.calculateTrend([roi], 'up_is_better'),
      interpretation: `العائد على الاستثمار ${(roi * 100).toFixed(2)}% يشير إلى ${
        roi > 0.12 ? 'كفاءة عالية جداً' : 
        roi > 0.08 ? 'كفاءة جيدة' : 
        roi > 0.04 ? 'كفاءة متوسطة' : 'ضعف'
      } في استغلال الاستثمارات.`,
      calculation: {
        formula: 'صافي الربح ÷ إجمالي الاستثمار',
        variables: {
          'صافي الربح': netIncome,
          'إجمالي الاستثمار': totalInvestment
        }
      },
      recommendations: [
        roi < 0.06 ? 'مراجعة قرارات الاستثمار وتحسين العائد' : '',
        roi < 0.04 ? 'إعادة تقييم المشاريع الاستثمارية الحالية' : '',
        'مقارنة العائد مع الاستثمارات البديلة'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateROIC(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const nopat = this.calculateNOPAT(statement);
    const investedCapital = this.calculateInvestedCapital(statement);
    
    if (investedCapital === 0) {
      return this.createErrorResult('roic', 'العائد على رأس المال المستثمر (ROIC)');
    }

    const roic = nopat / investedCapital;

    return {
      id: 'roic',
      name: 'العائد على رأس المال المستثمر (ROIC)',
      category: 'profitability',
      type: 'percentage',
      currentValue: roic,
      rating: this.rateROIC(roic),
      trend: this.calculateTrend([roic], 'up_is_better'),
      interpretation: `ROIC بنسبة ${(roic * 100).toFixed(2)}% يدل على ${
        roic > 0.15 ? 'كفاءة استثنائية' : 
        roic > 0.1 ? 'كفاءة جيدة' : 
        roic > 0.05 ? 'كفاءة متوسطة' : 'ضعف'
      } في استخدام رأس المال المستثمر.`,
      calculation: {
        formula: 'صافي الربح التشغيلي بعد الضرائب ÷ رأس المال المستثمر',
        variables: {
          'NOPAT': nopat,
          'رأس المال المستثمر': investedCapital
        }
      },
      recommendations: [
        roic < 0.08 ? 'تحسين كفاءة استخدام رأس المال وزيادة الربحية' : '',
        roic < 0.05 ? 'مراجعة القرارات الاستثمارية الاستراتيجية' : '',
        'مقارنة ROIC مع تكلفة رأس المال (WACC)'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateEBITDAMargin(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const depreciation = statement.incomeStatement.depreciation || 0;
    const amortization = statement.incomeStatement.amortization || 0;
    
    if (revenue === 0) {
      return this.createErrorResult('ebitda-margin', 'هامش EBITDA');
    }

    const ebitda = operatingIncome + depreciation + amortization;
    const margin = ebitda / revenue;

    return {
      id: 'ebitda-margin',
      name: 'هامش الربح قبل الفوائد والضرائب والاستهلاك (EBITDA)',
      category: 'profitability',
      type: 'percentage',
      currentValue: margin,
      rating: this.rateEBITDAMargin(margin),
      trend: this.calculateTrend([margin], 'up_is_better'),
      interpretation: `هامش EBITDA بنسبة ${(margin * 100).toFixed(1)}% يشير إلى ${
        margin > 0.2 ? 'أداء نقدي ممتاز' : 
        margin > 0.15 ? 'أداء نقدي جيد' : 
        margin > 0.1 ? 'أداء نقدي متوسط' : 'ضعف في الأداء النقدي'
      } من العمليات الأساسية.`,
      calculation: {
        formula: '(الربح التشغيلي + الاستهلاك + الإطفاء) ÷ الإيرادات',
        variables: {
          'الربح التشغيلي': operatingIncome,
          'الاستهلاك': depreciation,
          'الإطفاء': amortization,
          'EBITDA': ebitda,
          'الإيرادات': revenue
        }
      },
      recommendations: [
        margin < 0.1 ? 'تحسين الكفاءة التشغيلية وتقليل التكاليف' : '',
        margin < 0.15 ? 'مراجعة استراتيجية التسعير والتكاليف' : '',
        'مراقبة الاتجاه الزمني لهامش EBITDA'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateInterestCoverageRatio(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    
    if (interestExpense === 0) {
      return {
        id: 'interest-coverage-ratio',
        name: 'نسبة تغطية الفوائد',
        category: 'profitability',
        type: 'ratio',
        currentValue: Infinity,
        rating: 'excellent',
        interpretation: 'الشركة لا تتحمل أي فوائد على الديون مما يشير إلى قوة مالية ممتازة',
        status: 'completed'
      };
    }

    const ratio = operatingIncome / interestExpense;

    return {
      id: 'interest-coverage-ratio',
      name: 'نسبة تغطية الفوائد',
      category: 'profitability',
      type: 'ratio',
      currentValue: ratio,
      rating: this.rateInterestCoverageRatio(ratio),
      trend: this.calculateTrend([ratio], 'up_is_better'),
      interpretation: `نسبة تغطية الفوائد ${ratio.toFixed(2)} تشير إلى ${
        ratio > 5 ? 'قدرة ممتازة' : 
        ratio > 2.5 ? 'قدرة جيدة' : 
        ratio > 1.5 ? 'قدرة متوسطة' : 'قدرة ضعيفة'
      } على تغطية فوائد الديون.`,
      calculation: {
        formula: 'الربح التشغيلي ÷ مصروفات الفوائد',
        variables: {
          'الربح التشغيلي': operatingIncome,
          'مصروفات الفوائد': interestExpense
        }
      },
      recommendations: [
        ratio < 2 ? 'تقليل مستوى المديونية أو تحسين الربحية التشغيلية' : '',
        ratio < 1.5 ? 'مراجعة فورية لهيكل الديون والتمويل' : '',
        'مراقبة مستوى الفوائد مع تغيرات أسعار الفائدة'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  // Continue with remaining profitability calculations...
  private calculateReturnOnSales(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const revenue = statement.incomeStatement.revenue || 0;
    
    if (revenue === 0) {
      return this.createErrorResult('return-on-sales', 'العائد على المبيعات');
    }

    const ros = netIncome / revenue;

    return {
      id: 'return-on-sales',
      name: 'العائد على المبيعات',
      category: 'profitability',
      type: 'percentage',
      currentValue: ros,
      rating: this.rateReturnOnSales(ros),
      interpretation: `العائد على المبيعات ${(ros * 100).toFixed(2)}% يعكس كفاءة تحويل المبيعات إلى أرباح صافية`,
      calculation: {
        formula: 'صافي الربح ÷ صافي المبيعات',
        variables: {
          'صافي الربح': netIncome,
          'صافي المبيعات': revenue
        }
      },
      status: 'completed'
    };
  }

  // Helper methods for calculations
  private calculateNOPAT(statement: FinancialStatement): number {
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const taxRate = this.calculateTaxRate(statement);
    return operatingIncome * (1 - taxRate);
  }

  private calculateInvestedCapital(statement: FinancialStatement): number {
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const cash = statement.balanceSheet.cash || 0;
    return totalAssets - currentLiabilities - cash;
  }

  private calculateTaxRate(statement: FinancialStatement): number {
    const preIncome = statement.incomeStatement.incomeBeforeTaxes || statement.incomeStatement.netIncome || 0;
    const netIncome = statement.incomeStatement.netIncome || 0;
    if (preIncome === 0) return 0.25; // Default tax rate
    return Math.max(0, (preIncome - netIncome) / preIncome);
  }

  // Rating methods for profitability metrics
  private rateGrossProfitMargin(margin: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (margin >= 0.5) return 'excellent';
    if (margin >= 0.3) return 'good';
    if (margin >= 0.15) return 'average';
    return 'poor';
  }

  private rateOperatingProfitMargin(margin: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (margin >= 0.15) return 'excellent';
    if (margin >= 0.1) return 'good';
    if (margin >= 0.05) return 'average';
    return 'poor';
  }

  private rateNetProfitMargin(margin: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (margin >= 0.1) return 'excellent';
    if (margin >= 0.07) return 'good';
    if (margin >= 0.03) return 'average';
    return 'poor';
  }

  private rateROA(roa: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (roa >= 0.15) return 'excellent';
    if (roa >= 0.08) return 'good';
    if (roa >= 0.03) return 'average';
    return 'poor';
  }

  private rateROE(roe: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (roe >= 0.2) return 'excellent';
    if (roe >= 0.15) return 'good';
    if (roe >= 0.08) return 'average';
    return 'poor';
  }

  private rateROI(roi: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (roi >= 0.12) return 'excellent';
    if (roi >= 0.08) return 'good';
    if (roi >= 0.04) return 'average';
    return 'poor';
  }

  private rateROIC(roic: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (roic >= 0.15) return 'excellent';
    if (roic >= 0.1) return 'good';
    if (roic >= 0.05) return 'average';
    return 'poor';
  }

  private rateEBITDAMargin(margin: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (margin >= 0.25) return 'excellent';
    if (margin >= 0.15) return 'good';
    if (margin >= 0.08) return 'average';
    return 'poor';
  }

  private rateInterestCoverageRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ratio >= 8) return 'excellent';
    if (ratio >= 4) return 'good';
    if (ratio >= 2) return 'average';
    return 'poor';
  }

  private rateReturnOnSales(ros: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ros >= 0.1) return 'excellent';
    if (ros >= 0.07) return 'good';
    if (ros >= 0.03) return 'average';
    return 'poor';
  }

  // Interpretation methods
  private interpretGrossProfitMargin(margin: number): string {
    if (margin >= 0.5) {
      return `هامش الربح الإجمالي ${(margin * 100).toFixed(1)}% ممتاز ويشير إلى قوة تسعيرية عالية وكفاءة في التكاليف المباشرة.`;
    } else if (margin >= 0.3) {
      return `هامش الربح الإجمالي ${(margin * 100).toFixed(1)}% جيد ويدل على إدارة فعالة للتكاليف والتسعير.`;
    } else if (margin >= 0.15) {
      return `هامش الربح الإجمالي ${(margin * 100).toFixed(1)}% متوسط وقد يحتاج لتحسين التكاليف أو التسعير.`;
    } else {
      return `هامش الربح الإجمالي ${(margin * 100).toFixed(1)}% ضعيف ويتطلب مراجعة فورية لاستراتيجية التكاليف والتسعير.`;
    }
  }

  private interpretOperatingProfitMargin(margin: number): string {
    return `هامش الربح التشغيلي ${(margin * 100).toFixed(2)}% يعكس ${
      margin > 0.15 ? 'كفاءة تشغيلية عالية' : 
      margin > 0.1 ? 'كفاءة تشغيلية جيدة' : 
      margin > 0.05 ? 'كفاءة تشغيلية متوسطة' : 
      'ضعف في الكفاءة التشغيلية'
    } في إدارة العمليات والتكاليف.`;
  }

  private interpretNetProfitMargin(margin: number): string {
    return `هامش الربح الصافي ${(margin * 100).toFixed(2)}% يشير إلى ${
      margin > 0.1 ? 'ربحية نهائية ممتازة' : 
      margin > 0.05 ? 'ربحية نهائية جيدة' : 
      margin > 0.02 ? 'ربحية نهائية متوسطة' : 
      margin <= 0 ? 'خسائر تتطلب إجراءات عاجلة' : 'ربحية ضعيفة'
    } بعد احتساب جميع التكاليف.`;
  }

  private interpretROA(roa: number): string {
    return `العائد على الأصول ${(roa * 100).toFixed(2)}% يدل على ${
      roa > 0.15 ? 'كفاءة استثنائية' : 
      roa > 0.08 ? 'كفاءة جيدة' : 
      roa > 0.03 ? 'كفاءة متوسطة' : 'ضعف'
    } في استغلال الأصول لتوليد الأرباح.`;
  }

  private interpretROE(roe: number): string {
    return `العائد على حقوق الملكية ${(roe * 100).toFixed(2)}% يعكس ${
      roe > 0.2 ? 'عائد استثنائي' : 
      roe > 0.15 ? 'عائد ممتاز' : 
      roe > 0.08 ? 'عائد مقبول' : 'عائد غير مرضي'
    } للمساهمين على استثماراتهم.`;
  }

  // Add remaining 16 calculation methods following the same comprehensive pattern...
  // Including: ROWC, Adjusted Operating Margin, Retained Earnings Ratio, 
  // Sustainable Growth Rate, Return on Current Assets, Return on Fixed Assets,
  // Operating Ratio, Contribution Margin, Break-Even Point, Margin of Safety,
  // Operating Leverage, Asset Efficiency, EVA, Adjusted ROIC, Overall Profitability
}
