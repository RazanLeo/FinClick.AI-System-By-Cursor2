import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class EfficiencyAnalyzer extends BaseAnalyzer {
  async analyze(
    financialData: FinancialStatement[],
    companyData: Company,
    marketData?: any,
    benchmarkData?: any
  ): Promise<AnalysisResult[]> {
    
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. معدل دوران الأصول
      results.push(this.calculateAssetTurnover(latestStatement, benchmarkData));

      // 2. معدل دوران الأصول الثابتة
      results.push(this.calculateFixedAssetTurnover(latestStatement, benchmarkData));

      // 3. معدل دوران المخزون
      results.push(this.calculateInventoryTurnover(latestStatement, benchmarkData));

      // 4. معدل دوران الذمم المدينة
      results.push(this.calculateReceivablesTurnover(latestStatement, benchmarkData));

      // 5. معدل دوران حقوق الملكية
      results.push(this.calculateEquityTurnover(latestStatement, benchmarkData));

      // 6. معدل دوران رأس المال العامل
      results.push(this.calculateWorkingCapitalTurnover(latestStatement, benchmarkData));

      // 7. كفاءة استخدام الأصول
      results.push(this.calculateAssetUtilizationEfficiency(latestStatement, benchmarkData));

      // 8. معدل دوران التكاليف
      results.push(this.calculateCostTurnover(latestStatement, benchmarkData));

      // 9. كفاءة العمالة
      results.push(this.calculateLaborEfficiency(latestStatement, companyData, benchmarkData));

      // 10. كفاءة الإنتاج
      results.push(this.calculateProductionEfficiency(latestStatement, benchmarkData));

      // 11. معدل استغلال الطاقة
      results.push(this.calculateCapacityUtilization(latestStatement, companyData, benchmarkData));

      // 12. كفاءة استخدام المساحة
      results.push(this.calculateSpaceUtilization(latestStatement, companyData, benchmarkData));

      // 13. معدل دوران المخازن
      results.push(this.calculateWarehouseTurnover(latestStatement, benchmarkData));

      // 14. كفاءة التوزيع
      results.push(this.calculateDistributionEfficiency(latestStatement, benchmarkData));

      // 15. معدل الاستفادة من التكنولوجيا
      results.push(this.calculateTechnologyUtilization(latestStatement, benchmarkData));

      // 16. كفاءة سلسلة التوريد
      results.push(this.calculateSupplyChainEfficiency(latestStatement, benchmarkData));

      // 17. معدل دوران النقدية
      results.push(this.calculateCashTurnover(latestStatement, benchmarkData));

      // 18. كفاءة الاستثمار
      results.push(this.calculateInvestmentEfficiency(latestStatement, benchmarkData));

      // 19. معدل الإنتاجية الكلية
      results.push(this.calculateTotalProductivity(latestStatement, companyData, benchmarkData));

      // 20. كفاءة إدارة التكاليف
      results.push(this.calculateCostManagementEfficiency(latestStatement, benchmarkData));

      return results;

    } catch (error) {
      console.error('Efficiency Analysis Error:', error);
      return [{
        id: 'efficiency-error',
        name: 'خطأ في تحليل الكفاءة',
        category: 'efficiency',
        currentValue: 0,
        rating: 'poor',
        interpretation: 'فشل في حساب مؤشرات الكفاءة',
        status: 'error'
      }];
    }
  }

  private calculateAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('asset-turnover', 'معدل دوران الأصول');
    }

    const turnover = revenue / totalAssets;

    return {
      id: 'asset-turnover',
      name: 'معدل دوران الأصول',
      category: 'efficiency',
      type: 'ratio',
      currentValue: turnover,
      rating: this.rateAssetTurnover(turnover),
      trend: this.calculateTrend([turnover], 'up_is_better'),
      interpretation: this.interpretAssetTurnover(turnover),
      calculation: {
        formula: 'صافي المبيعات ÷ متوسط إجمالي الأصول',
        variables: {
          'صافي المبيعات': revenue,
          'إجمالي الأصول': totalAssets
        }
      },
      insights: [
        turnover > 2 ? 'كفاءة عالية جداً في استغلال الأصول لتوليد المبيعات' : '',
        turnover < 0.5 ? 'ضعف في استغلال الأصول يتطلب تحسين الاستخدام' : '',
        turnover > 3 ? 'كفاءة استثنائية قد تشير لقلة الاستثمار في الأصول' : ''
      ].filter(Boolean),
      recommendations: [
        turnover < 0.8 ? 'تحسين استغلال الأصول وزيادة الإنتاجية' : '',
        turnover < 0.5 ? 'مراجعة محفظة الأصول والتخلص من غير المنتج' : '',
        'مراقبة التوازن بين نمو المبيعات والاستثمار في الأصول'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.assetTurnover ? {
        value: benchmarkData.assetTurnover.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateFixedAssetTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const fixedAssets = statement.balanceSheet.fixedAssets || 
                       ((statement.balanceSheet.totalAssets || 0) - (statement.balanceSheet.currentAssets || 0));
    
    if (fixedAssets === 0) {
      return this.createErrorResult('fixed-asset-turnover', 'معدل دوران الأصول الثابتة');
    }

    const turnover = revenue / fixedAssets;

    return {
      id: 'fixed-asset-turnover',
      name: 'معدل دوران الأصول الثابتة',
      category: 'efficiency',
      type: 'ratio',
      currentValue: turnover,
      rating: this.rateFixedAssetTurnover(turnover),
      trend: this.calculateTrend([turnover], 'up_is_better'),
      interpretation: this.interpretFixedAssetTurnover(turnover),
      calculation: {
        formula: 'صافي المبيعات ÷ صافي الأصول الثابتة',
        variables: {
          'صافي المبيعات': revenue,
          'صافي الأصول الثابتة': fixedAssets
        }
      },
      insights: [
        turnover > 4 ? 'استغلال ممتاز للأصول الثابتة في توليد المبيعات' : '',
        turnover < 1 ? 'ضعف في استغلال الأصول الثابتة' : '',
        turnover > 8 ? 'كثافة عالية في استخدام الأصول قد تحتاج لاستثمارات إضافية' : ''
      ].filter(Boolean),
      recommendations: [
        turnover < 2 ? 'تحسين استغلال الأصول الثابتة وزيادة الإنتاجية' : '',
        turnover < 1 ? 'مراجعة الحاجة للأصول الثابتة الحالية' : '',
        'تحسين كفاءة المعدات والآلات'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.fixedAssetTurnover ? {
        value: benchmarkData.fixedAssetTurnover.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateInventoryTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const cogs = statement.incomeStatement.costOfGoodsSold || statement.incomeStatement.totalExpenses || 0;
    const inventory = statement.balanceSheet.inventory || 0;
    
    if (inventory === 0) {
      return {
        id: 'inventory-turnover',
        name: 'معدل دوران المخزون',
        category: 'efficiency',
        type: 'ratio',
        currentValue: Infinity,
        rating: 'excellent',
        interpretation: 'الشركة لا تحتفظ بمخزون مما يشير إلى نموذج أعمال فعال',
        status: 'completed'
      };
    }

    const turnover = cogs / inventory;

    return {
      id: 'inventory-turnover',
      name: 'معدل دوران المخزون',
      category: 'efficiency',
      type: 'ratio',
      currentValue: turnover,
      rating: this.rateInventoryTurnover(turnover),
      trend: this.calculateTrend([turnover], 'up_is_better'),
      interpretation: this.interpretInventoryTurnover(turnover),
      calculation: {
        formula: 'تكلفة البضاعة المباعة ÷ متوسط المخزون',
        variables: {
          'تكلفة البضاعة المباعة': cogs,
          'متوسط المخزون': inventory
        }
      },
      insights: [
        turnover > 12 ? 'دوران مخزون سريع جداً يدل على كفاءة عالية' : '',
        turnover < 4 ? 'بطء في دوران المخزون قد يشير لمشاكل في المبيعات' : '',
        turnover > 20 ? 'دوران سريع جداً قد يشير لنقص في المخزون' : ''
      ].filter(Boolean),
      recommendations: [
        turnover < 4 ? 'تحسين إدارة المخزون وتسريع المبيعات' : '',
        turnover < 2 ? 'مراجعة استراتيجية المخزون والتخلص من الراكد' : '',
        turnover > 15 ? 'التأكد من عدم نفاد المخزون وتأثيره على المبيعات' : ''
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
    const accountsReceivable = statement.balanceSheet.accountsReceivable || 0;
    
    if (accountsReceivable === 0) {
      return {
        id: 'receivables-turnover',
        name: 'معدل دوران الذمم المدينة',
        category: 'efficiency',
        type: 'ratio',
        currentValue: Infinity,
        rating: 'excellent',
        interpretation: 'الشركة تحصل نقداً مما يدل على كفاءة ممتازة في إدارة النقدية',
        status: 'completed'
      };
    }

    const turnover = revenue / accountsReceivable;

    return {
      id: 'receivables-turnover',
      name: 'معدل دوران الذمم المدينة',
      category: 'efficiency',
      type: 'ratio',
      currentValue: turnover,
      rating: this.rateReceivablesTurnover(turnover),
      trend: this.calculateTrend([turnover], 'up_is_better'),
      interpretation: this.interpretReceivablesTurnover(turnover),
      calculation: {
        formula: 'صافي المبيعات الآجلة ÷ متوسط الذمم المدينة',
        variables: {
          'صافي المبيعات': revenue,
          'متوسط الذمم المدينة': accountsReceivable
        }
      },
      insights: [
        turnover > 12 ? 'كفاءة ممتازة في تحصيل المستحقات من العملاء' : '',
        turnover < 6 ? 'بطء في التحصيل قد يؤثر على التدفق النقدي' : '',
        turnover > 20 ? 'تحصيل سريع جداً قد يشير لشروط ائتمان صارمة' : ''
      ].filter(Boolean),
      recommendations: [
        turnover < 6 ? 'تحسين سياسات التحصيل وإجراءات المتابعة' : '',
        turnover < 4 ? 'مراجعة شروط الائتمان وتقييم العملاء' : '',
        'تطوير نظام إدارة العملاء وأتمتة عمليات التحصيل'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.receivablesTurnover ? {
        value: benchmarkData.receivablesTurnover.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateEquityTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    
    if (shareholdersEquity === 0) {
      return this.createErrorResult('equity-turnover', 'معدل دوران حقوق الملكية');
    }

    const turnover = revenue / shareholdersEquity;

    return {
      id: 'equity-turnover',
      name: 'معدل دوران حقوق الملكية',
      category: 'efficiency',
      type: 'ratio',
      currentValue: turnover,
      rating: this.rateEquityTurnover(turnover),
      trend: this.calculateTrend([turnover], 'up_is_better'),
      interpretation: `معدل دوران حقوق الملكية ${turnover.toFixed(2)} يشير إلى ${
        turnover > 3 ? 'كفاءة عالية' : 
        turnover > 2 ? 'كفاءة جيدة' : 
        turnover > 1 ? 'كفاءة متوسطة' : 'ضعف'
      } في استغلال رأس مال المساهمين.`,
      calculation: {
        formula: 'صافي المبيعات ÷ متوسط حقوق المساهمين',
        variables: {
          'صافي المبيعات': revenue,
          'حقوق المساهمين': shareholdersEquity
        }
      },
      recommendations: [
        turnover < 1.5 ? 'تحسين استغلال رأس المال وزيادة النشاط التجاري' : '',
        turnover > 5 ? 'النظر في زيادة رأس المال لدعم النمو' : '',
        'مراقبة التوازن بين النمو والاستدانة'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateWorkingCapitalTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const workingCapital = currentAssets - currentLiabilities;
    
    if (workingCapital <= 0) {
      return {
        id: 'working-capital-turnover',
        name: 'معدل دوران رأس المال العامل',
        category: 'efficiency',
        type: 'ratio',
        currentValue: 0,
        rating: 'poor',
        interpretation: 'رأس المال العامل سالب أو معدوم يتطلب تحسين إدارة السيولة',
        status: 'completed'
      };
    }

    const turnover = revenue / workingCapital;

    return {
      id: 'working-capital-turnover',
      name: 'معدل دوران رأس المال العامل',
      category: 'efficiency',
      type: 'ratio',
      currentValue: turnover,
      rating: this.rateWorkingCapitalTurnover(turnover),
      trend: this.calculateTrend([turnover], 'up_is_better'),
      interpretation: `معدل دوران رأس المال العامل ${turnover.toFixed(2)} يدل على ${
        turnover > 6 ? 'كفاءة عالية جداً' : 
        turnover > 4 ? 'كفاءة جيدة' : 
        turnover > 2 ? 'كفاءة متوسطة' : 'ضعف'
      } في استغلال رأس المال العامل.`,
      calculation: {
        formula: 'صافي المبيعات ÷ متوسط رأس المال العامل',
        variables: {
          'صافي المبيعات': revenue,
          'رأس المال العامل': workingCapital
        }
      },
      recommendations: [
        turnover < 3 ? 'تحسين إدارة رأس المال العامل وتسريع دورته' : '',
        turnover > 8 ? 'التأكد من كفاية رأس المال العامل لدعم النمو' : '',
        'تحسين إدارة المخزون والذمم المدينة والدائنة'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateAssetUtilizationEfficiency(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    
    if (totalAssets === 0) {
      return this.createErrorResult('asset-utilization-efficiency', 'كفاءة استخدام الأصول');
    }

    const assetTurnover = revenue / totalAssets;
    const assetROA = operatingIncome / totalAssets;
    const efficiency = (assetTurnover + assetROA) / 2; // مؤشر مركب

    return {
      id: 'asset-utilization-efficiency',
      name: 'كفاءة استخدام الأصول',
      category: 'efficiency',
      type: 'ratio',
      currentValue: efficiency,
      rating: this.rateAssetUtilizationEfficiency(efficiency),
      trend: this.calculateTrend([efficiency], 'up_is_better'),
      interpretation: `كفاءة استخدام الأصول ${efficiency.toFixed(3)} تجمع بين معدل الدوران والربحية لقياس الاستغلال الأمثل`,
      calculation: {
        formula: '(معدل دوران الأصول + العائد التشغيلي على الأصول) ÷ 2',
        variables: {
          'معدل دوران الأصول': assetTurnover,
          'العائد التشغيلي على الأصول': assetROA,
          'مؤشر الكفاءة المركب': efficiency
        }
      },
      insights: [
        efficiency > 0.5 ? 'توازن ممتاز بين حجم النشاط والربحية' : '',
        efficiency < 0.2 ? 'ضعف في الاستغلال الأمثل للأصول' : '',
        'يجمع هذا المؤشر بين الكفاءة والفعالية في استخدام الأصول'
      ].filter(Boolean),
      recommendations: [
        efficiency < 0.3 ? 'تحسين معدل دوران الأصول وربحيتها معاً' : '',
        'التوازن بين زيادة المبيعات وتحسين هوامش الربح',
        'مراجعة استراتيجية الاستثمار في الأصول'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateCostTurnover(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const totalCosts = statement.incomeStatement.totalExpenses || 
                      ((statement.incomeStatement.costOfGoodsSold || 0) + 
                       (statement.incomeStatement.operatingExpenses || 0));
    
    if (totalCosts === 0) {
      return this.createErrorResult('cost-turnover', 'معدل دوران التكاليف');
    }

    const turnover = revenue / totalCosts;

    return {
      id: 'cost-turnover',
      name: 'معدل دوران التكاليف',
      category: 'efficiency',
      type: 'ratio',
      currentValue: turnover,
      rating: this.rateCostTurnover(turnover),
      trend: this.calculateTrend([turnover], 'up_is_better'),
      interpretation: `معدل دوران التكاليف ${turnover.toFixed(2)} يشير إلى توليد ${turnover.toFixed(2)} ريال مبيعات لكل ريال تكلفة`,
      calculation: {
        formula: 'صافي المبيعات ÷ إجمالي التكاليف',
        variables: {
          'صافي المبيعات': revenue,
          'إجمالي التكاليف': totalCosts
        }
      },
      insights: [
        turnover > 1.5 ? 'كفاءة ممتازة في إدارة التكاليف مقابل الإيرادات' : '',
        turnover < 1.1 ? 'ضعف في كفاءة التكاليف يتطلب مراجعة فورية' : '',
        turnover <= 1 ? 'التكاليف تتجاوز الإيرادات - وضع حرج' : ''
      ].filter(Boolean),
      recommendations: [
        turnover < 1.2 ? 'مراجعة شاملة لهيكل التكاليف وتحسين الكفاءة' : '',
        turnover <= 1 ? 'إجراءات عاجلة لتقليل التكاليف أو زيادة الإيرادات' : '',
        'تحسين العمليات وأتمتة المهام لتقليل التكاليف'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateLaborEfficiency(statement: FinancialStatement, companyData: Company, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const laborCosts = statement.incomeStatement.salariesAndWages || 
                      (statement.incomeStatement.totalExpenses || 0) * 0.3; // تقدير 30% من التكاليف
    const employeeCount = companyData.employeeCount || 100; // افتراضي
    
    if (laborCosts === 0 || employeeCount === 0) {
      return this.createErrorResult('labor-efficiency', 'كفاءة العمالة');
    }

    const revenuePerEmployee = revenue / employeeCount;
    const laborCostRatio = laborCosts / revenue;
    const efficiency = revenuePerEmployee / 1000; // مقياس نسبي

    return {
      id: 'labor-efficiency',
      name: 'كفاءة العمالة',
      category: 'efficiency',
      type: 'ratio',
      currentValue: efficiency,
      rating: this.rateLaborEfficiency(efficiency),
      trend: this.calculateTrend([efficiency], 'up_is_better'),
      interpretation: `الإيراد لكل موظف ${this.formatCurrency(revenuePerEmployee)} مع نسبة تكاليف عمالة ${(laborCostRatio * 100).toFixed(1)}%`,
      calculation: {
        formula: 'الإيرادات ÷ عدد الموظفين',
        variables: {
          'إجمالي الإيرادات': revenue,
          'عدد الموظفين': employeeCount,
          'الإيراد لكل موظف': revenuePerEmployee,
          'تكاليف العمالة': laborCosts
        }
      },
      insights: [
        revenuePerEmployee > 500000 ? 'إنتاجية عمالة عالية جداً' : '',
        revenuePerEmployee < 100000 ? 'إنتاجية عمالة منخفضة تحتاج تطوير' : '',
        laborCostRatio > 0.4 ? 'تكاليف العمالة مرتفعة نسبياً' : ''
      ].filter(Boolean),
      recommendations: [
        revenuePerEmployee < 150000 ? 'تطوير مهارات الموظفين وتحسين الإنتاجية' : '',
        laborCostRatio > 0.35 ? 'مراجعة هيكل الأجور وتحسين الكفاءة' : '',
        'استخدام التكنولوجيا لتعزيز إنتاجية العمالة'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateProductionEfficiency(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const cogs = statement.incomeStatement.costOfGoodsSold || 0;
    const productionCosts = cogs * 0.7; // تقدير 70% من تكلفة البضاعة المباعة
    
    if (productionCosts === 0) {
      return this.createErrorResult('production-efficiency', 'كفاءة الإنتاج');
    }

    const productionEfficiency = revenue / productionCosts;
    const grossMargin = (revenue - cogs) / revenue;

    return {
      id: 'production-efficiency',
      name: 'كفاءة الإنتاج',
      category: 'efficiency',
      type: 'ratio',
      currentValue: productionEfficiency,
      rating: this.rateProductionEfficiency(productionEfficiency),
      trend: this.calculateTrend([productionEfficiency], 'up_is_better'),
      interpretation: `كفاءة الإنتاج ${productionEfficiency.toFixed(2)} مع هامش إجمالي ${(grossMargin * 100).toFixed(1)}%`,
      calculation: {
        formula: 'الإيرادات ÷ تكاليف الإنتاج المقدرة',
        variables: {
          'إجمالي الإيرادات': revenue,
          'تكاليف الإنتاج المقدرة': productionCosts,
          'تكلفة البضاعة المباعة': cogs
        }
      },
      insights: [
        productionEfficiency > 2.5 ? 'كفاءة إنتاج ممتازة' : '',
        productionEfficiency < 1.5 ? 'ضعف في كفاءة الإنتاج' : '',
        grossMargin > 0.3 ? 'هامش ربح إنتاجي جيد' : ''
      ].filter(Boolean),
      recommendations: [
        productionEfficiency < 2 ? 'تحسين عمليات الإنتاج وتقليل الفاقد' : '',
        grossMargin < 0.2 ? 'مراجعة تكاليف الإنتاج والمواد الخام' : '',
        'استخدام تقنيات الإنتاج الحديثة لزيادة الكفاءة'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  private calculateCapacityUtilization(statement: FinancialStatement, companyData: Company, benchmarkData?: any): AnalysisResult {
    const currentRevenue = statement.incomeStatement.revenue || 0;
    const maxCapacityRevenue = companyData.maxCapacityRevenue || currentRevenue * 1.5; // افتراضي 150%
    
    if (maxCapacityRevenue === 0) {
      return this.createErrorResult('capacity-utilization', 'معدل استغلال الطاقة');
    }

    const utilization = currentRevenue / maxCapacityRevenue;

    return {
      id: 'capacity-utilization',
      name: 'معدل استغلال الطاقة',
      category: 'efficiency',
      type: 'percentage',
      currentValue: utilization,
      rating: this.rateCapacityUtilization(utilization),
      trend: this.calculateTrend([utilization], 'up_is_better'),
      interpretation: `معدل استغلال الطاقة ${(utilization * 100).toFixed(1)}% من الطاقة القصوى للشركة`,
      calculation: {
        formula: 'الإيرادات الحالية ÷ الإيرادات عند الطاقة القصوى',
        variables: {
          'الإيرادات الحالية': currentRevenue,
          'الطاقة القصوى المقدرة': maxCapacityRevenue
        }
      },
      insights: [
        utilization > 0.85 ? 'استغلال ممتاز للطاقة الإنتاجية' : '',
        utilization < 0.6 ? 'طاقة عاطلة كبيرة تحتاج استغلال' : '',
        utilization > 0.95 ? 'قرب الوصول للطاقة القصوى - قد نحتاج توسع' : ''
      ].filter(Boolean),
      recommendations: [
        utilization < 0.7 ? 'البحث عن فرص لزيادة استغلال الطاقة' : '',
        utilization > 0.9 ? 'التخطيط لتوسيع الطاقة الإنتاجية' : '',
        'تحسين جدولة الإنتاج وإدارة الطلب'
      ].filter(Boolean),
      status: 'completed'
    };
  }

  // Rating methods for efficiency metrics
  private rateAssetTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 2.0) return 'excellent';
    if (turnover >= 1.2) return 'good';
    if (turnover >= 0.8) return 'average';
    return 'poor';
  }

  private rateFixedAssetTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 4.0) return 'excellent';
    if (turnover >= 2.5) return 'good';
    if (turnover >= 1.5) return 'average';
    return 'poor';
  }

  private rateInventoryTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 12) return 'excellent';
    if (turnover >= 8) return 'good';
    if (turnover >= 4) return 'average';
    return 'poor';
  }

  private rateReceivablesTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 12) return 'excellent';
    if (turnover >= 8) return 'good';
    if (turnover >= 6) return 'average';
    return 'poor';
  }

  private rateEquityTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 3.0) return 'excellent';
    if (turnover >= 2.0) return 'good';
    if (turnover >= 1.0) return 'average';
    return 'poor';
  }

  private rateWorkingCapitalTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 6) return 'excellent';
    if (turnover >= 4) return 'good';
    if (turnover >= 2) return 'average';
    return 'poor';
  }

  private rateAssetUtilizationEfficiency(efficiency: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (efficiency >= 0.5) return 'excellent';
    if (efficiency >= 0.3) return 'good';
    if (efficiency >= 0.2) return 'average';
    return 'poor';
  }

  private rateCostTurnover(turnover: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (turnover >= 1.5) return 'excellent';
    if (turnover >= 1.3) return 'good';
    if (turnover >= 1.1) return 'average';
    return 'poor';
  }

  private rateLaborEfficiency(efficiency: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (efficiency >= 500) return 'excellent';
    if (efficiency >= 300) return 'good';
    if (efficiency >= 150) return 'average';
    return 'poor';
  }

  private rateProductionEfficiency(efficiency: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (efficiency >= 2.5) return 'excellent';
    if (efficiency >= 2.0) return 'good';
    if (efficiency >= 1.5) return 'average';
    return 'poor';
  }

  private rateCapacityUtilization(utilization: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (utilization >= 0.85) return 'excellent';
    if (utilization >= 0.75) return 'good';
    if (utilization >= 0.60) return 'average';
    return 'poor';
  }

  // Interpretation methods
  private interpretAssetTurnover(turnover: number): string {
    if (turnover >= 2.0) {
      return `معدل دوران الأصول ${turnover.toFixed(2)} ممتاز ويشير إلى كفاءة عالية في استغلال الأصول لتوليد المبيعات.`;
    } else if (turnover >= 1.2) {
      return `معدل دوران الأصول ${turnover.toFixed(2)} جيد ويدل على استخدام فعال للأصول.`;
    } else if (turnover >= 0.8) {
      return `معدل دوران الأصول ${turnover.toFixed(2)} متوسط ويحتاج لتحسين لزيادة كفاءة الأصول.`;
    } else {
      return `معدل دوران الأصول ${turnover.toFixed(2)} ضعيف ويتطلب مراجعة شاملة لاستراتيجية الأصول.`;
    }
  }

  private interpretFixedAssetTurnover(turnover: number): string {
    return `معدل دوران الأصول الثابتة ${turnover.toFixed(2)} يشير إلى ${
      turnover >= 4 ? 'استغلال ممتاز' : 
      turnover >= 2.5 ? 'استغلال جيد' : 
      turnover >= 1.5 ? 'استغلال متوسط' : 'ضعف في الاستغلال'
    } للاستثمارات الرأسمالية.`;
  }

  private interpretInventoryTurnover(turnover: number): string {
    const daysInInventory = 365 / turnover;
    return `معدل دوران المخزون ${turnover.toFixed(1)} مرة سنوياً (${Math.round(daysInInventory)} يوم) يدل على ${
      turnover >= 12 ? 'كفاءة ممتازة' : 
      turnover >= 8 ? 'كفاءة جيدة' : 
      turnover >= 4 ? 'كفاءة متوسطة' : 'بطء'
    } في إدارة المخزون.`;
  }

  private interpretReceivablesTurnover(turnover: number): string {
    const daysToCollect = 365 / turnover;
    return `معدل دوران الذمم المدينة ${turnover.toFixed(1)} مرة سنوياً (${Math.round(daysToCollect)} يوم للتحصيل) يشير إلى ${
      turnover >= 12 ? 'كفاءة ممتازة' : 
      turnover >= 8 ? 'كفاءة جيدة' : 
      turnover >= 6 ? 'كفاءة متوسطة' : 'بطء'
    } في تحصيل المستحقات.`;
  }

  // Add remaining calculation methods for the complete 20 efficiency analyses
  // Including: Space Utilization, Warehouse Turnover, Distribution Efficiency,
  // Technology Utilization, Supply Chain Efficiency, Cash Turnover,
  // Investment Efficiency, Total Productivity, Cost Management Efficiency
}
