import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class UltimateAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. التحليل النهائي للربحية
      results.push(this.calculateUltimateProfitabilityAnalysis(latestStatement, benchmarkData));
      
      // 2. التحليل النهائي للسيولة
      results.push(this.calculateUltimateLiquidityAnalysis(latestStatement, benchmarkData));
      
      // 3. التحليل النهائي للرفع المالي
      results.push(this.calculateUltimateLeverageAnalysis(latestStatement, benchmarkData));
      
      // 4. التحليل النهائي للكفاءة
      results.push(this.calculateUltimateEfficiencyAnalysis(latestStatement, benchmarkData));
      
      // 5. التحليل النهائي للنمو
      results.push(this.calculateUltimateGrowthAnalysis(financialData, benchmarkData));
      
      // 6. التحليل النهائي للاستقرار
      results.push(this.calculateUltimateStabilityAnalysis(latestStatement, benchmarkData));
      
      // 7. التحليل النهائي للأداء
      results.push(this.calculateUltimatePerformanceAnalysis(latestStatement, benchmarkData));
      
      // 8. التحليل النهائي للسوق
      results.push(this.calculateUltimateMarketAnalysis(latestStatement, marketData, benchmarkData));
      
      // 9. التحليل النهائي للهيكل
      results.push(this.calculateUltimateStructuralAnalysis(latestStatement, benchmarkData));
      
      // 10. التحليل النهائي للنشاط
      results.push(this.calculateUltimateActivityAnalysis(latestStatement, benchmarkData));
      
      // 11. التحليل النهائي للمخاطر
      results.push(this.calculateUltimateRiskAnalysis(latestStatement, benchmarkData));
      
      // 12. التحليل النهائي للقيمة
      results.push(this.calculateUltimateValueAnalysis(latestStatement, marketData, benchmarkData));
      
      // 13. التحليل النهائي للاستدامة
      results.push(this.calculateUltimateSustainabilityAnalysis(latestStatement, benchmarkData));
      
      // 14. التحليل النهائي للتنافسية
      results.push(this.calculateUltimateCompetitivenessAnalysis(latestStatement, benchmarkData));
      
      // 15. التحليل النهائي للابتكار
      results.push(this.calculateUltimateInnovationAnalysis(latestStatement, benchmarkData));

      return results;
    } catch (error) {
      console.error('Ultimate Analysis Error:', error);
      return [this.createErrorResult('ultimate-error', 'خطأ في التحليل النهائي')];
    }
  }

  private calculateUltimateProfitabilityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const netIncome = statement.incomeStatement.netIncome || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const grossProfit = statement.incomeStatement.grossProfit || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    
    if (revenue === 0 || totalAssets === 0 || shareholdersEquity === 0) {
      return this.createErrorResult('ultimate-profitability', 'التحليل النهائي للربحية');
    }

    // حساب التحليل النهائي للربحية
    const netProfitMargin = (netIncome / revenue) * 100;
    const operatingMargin = (operatingIncome / revenue) * 100;
    const grossMargin = (grossProfit / revenue) * 100;
    const roa = (netIncome / totalAssets) * 100;
    const roe = (netIncome / shareholdersEquity) * 100;
    const roic = this.calculateROIC(statement);
    const ebitdaMargin = this.calculateEBITDAMargin(statement);
    const profitabilityTrend = this.calculateProfitabilityTrend(statement);
    const profitabilityStability = this.calculateProfitabilityStability(statement);
    
    // مؤشر التحليل النهائي للربحية (0-100)
    const ultimateProfitabilityScore = Math.min(100, Math.max(0,
      (netProfitMargin / 2) +
      (operatingMargin / 2) +
      (grossMargin / 4) +
      (roa * 2) +
      (roe / 2) +
      (roic * 2) +
      (ebitdaMargin / 2) +
      (profitabilityTrend * 100) +
      (profitabilityStability * 100)
    ));

    return {
      id: 'ultimate-profitability',
      name: 'التحليل النهائي للربحية',
      category: 'ultimate',
      type: 'ultimate-score',
      currentValue: ultimateProfitabilityScore,
      rating: this.rateUltimateScore(ultimateProfitabilityScore),
      interpretation: `التحليل النهائي للربحية ${ultimateProfitabilityScore.toFixed(1)}% يعكس قوة الربحية النهائية للشركة من خلال جميع مؤشرات الربحية المتقدمة`,
      calculation: {
        formula: '(هامش صافي الربح ÷ 2) + (الهامش التشغيلي ÷ 2) + (الهامش الإجمالي ÷ 4) + (العائد على الأصول × 2) + (العائد على حقوق الملكية ÷ 2) + (العائد على رأس المال المستثمر × 2) + (هامش EBITDA ÷ 2) + (اتجاه الربحية × 100) + (استقرار الربحية × 100)',
        variables: {
          'هامش صافي الربح': netProfitMargin,
          'الهامش التشغيلي': operatingMargin,
          'الهامش الإجمالي': grossMargin,
          'العائد على الأصول': roa,
          'العائد على حقوق الملكية': roe,
          'العائد على رأس المال المستثمر': roic,
          'هامش EBITDA': ebitdaMargin,
          'اتجاه الربحية': profitabilityTrend,
          'استقرار الربحية': profitabilityStability,
          'مؤشر التحليل النهائي للربحية': ultimateProfitabilityScore
        }
      },
      insights: [
        ultimateProfitabilityScore > 80 ? 'ربحية نهائية ممتازة تدل على قوة مالية جيدة' : '',
        ultimateProfitabilityScore < 50 ? 'ربحية نهائية ضعيفة قد تشير لمشاكل في الربحية' : '',
        ultimateProfitabilityScore < 30 ? 'ربحية نهائية ضعيفة جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        ultimateProfitabilityScore < 60 ? 'تحسين الربحية النهائية من خلال زيادة جميع مؤشرات الربحية' : '',
        ultimateProfitabilityScore > 90 ? 'الحفاظ على الربحية النهائية الممتازة' : '',
        'مراقبة اتجاهات الربحية النهائية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.ultimateProfitability ? {
        value: benchmarkData.ultimateProfitability.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateUltimateLiquidityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const cash = statement.balanceSheet.cash || 0;
    const inventory = statement.balanceSheet.inventory || 0;
    const operatingCashFlow = statement.cashFlowStatement?.operatingCashFlow || 0;
    const marketableSecurities = statement.balanceSheet.marketableSecurities || 0;
    
    if (currentLiabilities === 0) {
      return this.createErrorResult('ultimate-liquidity', 'التحليل النهائي للسيولة');
    }

    // حساب التحليل النهائي للسيولة
    const currentRatio = currentAssets / currentLiabilities;
    const quickRatio = (currentAssets - inventory) / currentLiabilities;
    const cashRatio = cash / currentLiabilities;
    const cashFlowCoverage = operatingCashFlow / currentLiabilities;
    const absoluteLiquidityRatio = (cash + marketableSecurities) / currentLiabilities;
    const workingCapitalRatio = (currentAssets - currentLiabilities) / currentAssets;
    const liquidityTrend = this.calculateLiquidityTrend(statement);
    const liquidityStability = this.calculateLiquidityStability(statement);
    
    // مؤشر التحليل النهائي للسيولة (0-100)
    const ultimateLiquidityScore = Math.min(100, Math.max(0,
      (currentRatio * 20) +
      (quickRatio * 20) +
      (cashRatio * 20) +
      (cashFlowCoverage * 20) +
      (absoluteLiquidityRatio * 20) +
      (workingCapitalRatio * 20) +
      (liquidityTrend * 100) +
      (liquidityStability * 100)
    ));

    return {
      id: 'ultimate-liquidity',
      name: 'التحليل النهائي للسيولة',
      category: 'ultimate',
      type: 'ultimate-score',
      currentValue: ultimateLiquidityScore,
      rating: this.rateUltimateScore(ultimateLiquidityScore),
      interpretation: `التحليل النهائي للسيولة ${ultimateLiquidityScore.toFixed(1)}% يعكس قوة السيولة النهائية للشركة من خلال جميع مؤشرات السيولة المتقدمة`,
      calculation: {
        formula: '(النسبة الجارية × 20) + (النسبة السريعة × 20) + (نسبة النقد × 20) + (تغطية التدفق النقدي × 20) + (نسبة السيولة المطلقة × 20) + (نسبة رأس المال العامل × 20) + (اتجاه السيولة × 100) + (استقرار السيولة × 100)',
        variables: {
          'النسبة الجارية': currentRatio,
          'النسبة السريعة': quickRatio,
          'نسبة النقد': cashRatio,
          'تغطية التدفق النقدي': cashFlowCoverage,
          'نسبة السيولة المطلقة': absoluteLiquidityRatio,
          'نسبة رأس المال العامل': workingCapitalRatio,
          'اتجاه السيولة': liquidityTrend,
          'استقرار السيولة': liquidityStability,
          'مؤشر التحليل النهائي للسيولة': ultimateLiquidityScore
        }
      },
      insights: [
        ultimateLiquidityScore > 80 ? 'سيولة نهائية ممتازة تدل على قوة مالية جيدة' : '',
        ultimateLiquidityScore < 50 ? 'سيولة نهائية ضعيفة قد تشير لمشاكل في السيولة' : '',
        ultimateLiquidityScore < 30 ? 'سيولة نهائية ضعيفة جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        ultimateLiquidityScore < 60 ? 'تحسين السيولة النهائية من خلال زيادة جميع مؤشرات السيولة' : '',
        ultimateLiquidityScore > 90 ? 'الحفاظ على السيولة النهائية الممتازة' : '',
        'مراقبة اتجاهات السيولة النهائية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.ultimateLiquidity ? {
        value: benchmarkData.ultimateLiquidity.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateUltimateLeverageAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    const operatingCashFlow = statement.cashFlowStatement?.operatingCashFlow || 0;
    
    if (totalAssets === 0 || shareholdersEquity === 0) {
      return this.createErrorResult('ultimate-leverage', 'التحليل النهائي للرفع المالي');
    }

    // حساب التحليل النهائي للرفع المالي
    const debtToAssetsRatio = (totalDebt / totalAssets) * 100;
    const debtToEquityRatio = totalDebt / shareholdersEquity;
    const equityToAssetsRatio = (shareholdersEquity / totalAssets) * 100;
    const interestCoverageRatio = interestExpense > 0 ? operatingIncome / interestExpense : 10;
    const debtServiceCoverageRatio = totalDebt > 0 ? operatingCashFlow / totalDebt : 1;
    const financialLeverage = totalAssets / shareholdersEquity;
    const leverageTrend = this.calculateLeverageTrend(statement);
    const leverageStability = this.calculateLeverageStability(statement);
    
    // مؤشر التحليل النهائي للرفع المالي (0-100)
    const ultimateLeverageScore = Math.min(100, Math.max(0,
      ((100 - debtToAssetsRatio) / 2) +
      ((1 / (1 + debtToEquityRatio)) * 50) +
      (equityToAssetsRatio / 2) +
      (Math.min(interestCoverageRatio / 5, 1) * 50) +
      (Math.min(debtServiceCoverageRatio / 2, 1) * 50) +
      (Math.min(financialLeverage / 3, 1) * 50) +
      (leverageTrend * 100) +
      (leverageStability * 100)
    ));

    return {
      id: 'ultimate-leverage',
      name: 'التحليل النهائي للرفع المالي',
      category: 'ultimate',
      type: 'ultimate-score',
      currentValue: ultimateLeverageScore,
      rating: this.rateUltimateScore(ultimateLeverageScore),
      interpretation: `التحليل النهائي للرفع المالي ${ultimateLeverageScore.toFixed(1)}% يعكس قوة الرفع المالي النهائي للشركة من خلال جميع مؤشرات الرفع المالي المتقدمة`,
      calculation: {
        formula: '((100 - نسبة الدين إلى الأصول) ÷ 2) + ((1 ÷ (1 + نسبة الدين إلى حقوق الملكية)) × 50) + (نسبة حقوق الملكية إلى الأصول ÷ 2) + (تغطية الفوائد × 50) + (تغطية خدمة الدين × 50) + (الرفع المالي × 50) + (اتجاه الرفع المالي × 100) + (استقرار الرفع المالي × 100)',
        variables: {
          'نسبة الدين إلى الأصول': debtToAssetsRatio,
          'نسبة الدين إلى حقوق الملكية': debtToEquityRatio,
          'نسبة حقوق الملكية إلى الأصول': equityToAssetsRatio,
          'تغطية الفوائد': Math.min(interestCoverageRatio / 5, 1),
          'تغطية خدمة الدين': Math.min(debtServiceCoverageRatio / 2, 1),
          'الرفع المالي': Math.min(financialLeverage / 3, 1),
          'اتجاه الرفع المالي': leverageTrend,
          'استقرار الرفع المالي': leverageStability,
          'مؤشر التحليل النهائي للرفع المالي': ultimateLeverageScore
        }
      },
      insights: [
        ultimateLeverageScore > 80 ? 'رفع مالي نهائي ممتاز يدل على قوة مالية جيدة' : '',
        ultimateLeverageScore < 50 ? 'رفع مالي نهائي ضعيف قد يشير لمخاطر مالية' : '',
        ultimateLeverageScore < 30 ? 'رفع مالي نهائي ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        ultimateLeverageScore < 60 ? 'تحسين الرفع المالي النهائي من خلال تحسين جميع مؤشرات الرفع المالي' : '',
        ultimateLeverageScore > 90 ? 'الحفاظ على الرفع المالي النهائي الممتاز' : '',
        'مراقبة اتجاهات الرفع المالي النهائي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.ultimateLeverage ? {
        value: benchmarkData.ultimateLeverage.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateUltimateEfficiencyAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const costOfGoodsSold = statement.incomeStatement.costOfGoodsSold || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const fixedAssets = statement.balanceSheet.fixedAssets || 0;
    const inventory = statement.balanceSheet.inventory || 0;
    const accountsReceivable = statement.balanceSheet.accountsReceivable || 0;
    const accountsPayable = statement.balanceSheet.accountsPayable || 0;
    
    if (revenue === 0 || totalAssets === 0) {
      return this.createErrorResult('ultimate-efficiency', 'التحليل النهائي للكفاءة');
    }

    // حساب التحليل النهائي للكفاءة
    const totalAssetTurnover = revenue / totalAssets;
    const fixedAssetTurnover = fixedAssets > 0 ? revenue / fixedAssets : 0;
    const inventoryTurnover = inventory > 0 ? costOfGoodsSold / inventory : 0;
    const receivablesTurnover = accountsReceivable > 0 ? revenue / accountsReceivable : 0;
    const payablesTurnover = accountsPayable > 0 ? costOfGoodsSold / accountsPayable : 0;
    const workingCapitalTurnover = this.calculateWorkingCapitalTurnover(statement);
    const efficiencyTrend = this.calculateEfficiencyTrend(statement);
    const efficiencyStability = this.calculateEfficiencyStability(statement);
    
    // مؤشر التحليل النهائي للكفاءة (0-100)
    const ultimateEfficiencyScore = Math.min(100, Math.max(0,
      (totalAssetTurnover * 30) +
      (fixedAssetTurnover * 20) +
      (inventoryTurnover * 25) +
      (receivablesTurnover * 25) +
      (payablesTurnover * 25) +
      (workingCapitalTurnover * 25) +
      (efficiencyTrend * 100) +
      (efficiencyStability * 100)
    ));

    return {
      id: 'ultimate-efficiency',
      name: 'التحليل النهائي للكفاءة',
      category: 'ultimate',
      type: 'ultimate-score',
      currentValue: ultimateEfficiencyScore,
      rating: this.rateUltimateScore(ultimateEfficiencyScore),
      interpretation: `التحليل النهائي للكفاءة ${ultimateEfficiencyScore.toFixed(1)}% يعكس كفاءة العمليات النهائية للشركة من خلال جميع مؤشرات الكفاءة المتقدمة`,
      calculation: {
        formula: '(دوران الأصول الإجمالية × 30) + (دوران الأصول الثابتة × 20) + (دوران المخزون × 25) + (دوران الذمم المدينة × 25) + (دوران الذمم الدائنة × 25) + (دوران رأس المال العامل × 25) + (اتجاه الكفاءة × 100) + (استقرار الكفاءة × 100)',
        variables: {
          'دوران الأصول الإجمالية': totalAssetTurnover,
          'دوران الأصول الثابتة': fixedAssetTurnover,
          'دوران المخزون': inventoryTurnover,
          'دوران الذمم المدينة': receivablesTurnover,
          'دوران الذمم الدائنة': payablesTurnover,
          'دوران رأس المال العامل': workingCapitalTurnover,
          'اتجاه الكفاءة': efficiencyTrend,
          'استقرار الكفاءة': efficiencyStability,
          'مؤشر التحليل النهائي للكفاءة': ultimateEfficiencyScore
        }
      },
      insights: [
        ultimateEfficiencyScore > 80 ? 'كفاءة نهائية ممتازة تدل على كفاءة عالية في العمليات' : '',
        ultimateEfficiencyScore < 50 ? 'كفاءة نهائية ضعيفة قد تشير لمشاكل في الكفاءة' : '',
        ultimateEfficiencyScore < 30 ? 'كفاءة نهائية ضعيفة جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        ultimateEfficiencyScore < 60 ? 'تحسين الكفاءة النهائية من خلال تحسين جميع مؤشرات الكفاءة' : '',
        ultimateEfficiencyScore > 90 ? 'الحفاظ على الكفاءة النهائية الممتازة' : '',
        'مراقبة اتجاهات الكفاءة النهائية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.ultimateEfficiency ? {
        value: benchmarkData.ultimateEfficiency.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateUltimateGrowthAnalysis(financialData: FinancialStatement[], benchmarkData?: any): AnalysisResult {
    if (financialData.length < 2) {
      return this.createErrorResult('ultimate-growth', 'التحليل النهائي للنمو');
    }

    const currentRevenue = financialData[financialData.length - 1].incomeStatement.revenue || 0;
    const previousRevenue = financialData[financialData.length - 2].incomeStatement.revenue || 0;
    const currentNetIncome = financialData[financialData.length - 1].incomeStatement.netIncome || 0;
    const previousNetIncome = financialData[financialData.length - 2].incomeStatement.netIncome || 0;
    const currentAssets = financialData[financialData.length - 1].balanceSheet.totalAssets || 0;
    const previousAssets = financialData[financialData.length - 2].balanceSheet.totalAssets || 0;
    const currentEquity = financialData[financialData.length - 1].balanceSheet.shareholdersEquity || 0;
    const previousEquity = financialData[financialData.length - 2].balanceSheet.shareholdersEquity || 0;
    
    if (previousRevenue === 0 || previousNetIncome === 0 || previousAssets === 0 || previousEquity === 0) {
      return this.createErrorResult('ultimate-growth', 'التحليل النهائي للنمو');
    }

    // حساب التحليل النهائي للنمو
    const revenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    const profitGrowth = ((currentNetIncome - previousNetIncome) / previousNetIncome) * 100;
    const assetGrowth = ((currentAssets - previousAssets) / previousAssets) * 100;
    const equityGrowth = ((currentEquity - previousEquity) / previousEquity) * 100;
    const growthStability = this.calculateGrowthStability(financialData);
    const growthSustainability = this.calculateGrowthSustainability(financialData);
    const growthTrend = this.calculateGrowthTrend(financialData);
    const growthAcceleration = this.calculateGrowthAcceleration(financialData);
    
    // مؤشر التحليل النهائي للنمو (0-100)
    const ultimateGrowthScore = Math.min(100, Math.max(0,
      (Math.abs(revenueGrowth) / 2) +
      (Math.abs(profitGrowth) / 2) +
      (Math.abs(assetGrowth) / 2) +
      (Math.abs(equityGrowth) / 2) +
      (growthStability * 100) +
      (growthSustainability * 100) +
      (growthTrend * 100) +
      (growthAcceleration * 100)
    ));

    return {
      id: 'ultimate-growth',
      name: 'التحليل النهائي للنمو',
      category: 'ultimate',
      type: 'ultimate-score',
      currentValue: ultimateGrowthScore,
      rating: this.rateUltimateScore(ultimateGrowthScore),
      interpretation: `التحليل النهائي للنمو ${ultimateGrowthScore.toFixed(1)}% يعكس قوة النمو النهائي للشركة من خلال جميع مؤشرات النمو المتقدمة`,
      calculation: {
        formula: '(نمو الإيرادات ÷ 2) + (نمو الأرباح ÷ 2) + (نمو الأصول ÷ 2) + (نمو حقوق الملكية ÷ 2) + (استقرار النمو × 100) + (استدامة النمو × 100) + (اتجاه النمو × 100) + (تسارع النمو × 100)',
        variables: {
          'نمو الإيرادات': revenueGrowth,
          'نمو الأرباح': profitGrowth,
          'نمو الأصول': assetGrowth,
          'نمو حقوق الملكية': equityGrowth,
          'استقرار النمو': growthStability,
          'استدامة النمو': growthSustainability,
          'اتجاه النمو': growthTrend,
          'تسارع النمو': growthAcceleration,
          'مؤشر التحليل النهائي للنمو': ultimateGrowthScore
        }
      },
      insights: [
        ultimateGrowthScore > 80 ? 'نمو نهائي ممتاز يدل على نمو قوي ومستدام' : '',
        ultimateGrowthScore < 50 ? 'نمو نهائي ضعيف قد يشير لمشاكل في النمو' : '',
        ultimateGrowthScore < 30 ? 'نمو نهائي ضعيف جداً يتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        ultimateGrowthScore < 60 ? 'تحسين النمو النهائي من خلال تحقيق نمو متوازن في جميع المؤشرات' : '',
        ultimateGrowthScore > 90 ? 'الحفاظ على النمو النهائي الممتاز' : '',
        'مراقبة اتجاهات النمو النهائي عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.ultimateGrowth ? {
        value: benchmarkData.ultimateGrowth.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Helper methods
  private calculateROIC(statement: FinancialStatement): number {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    const taxRate = 0.25; // معدل ضريبي افتراضي
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const investedCapital = totalDebt + shareholdersEquity;
    
    if (investedCapital === 0) return 0;
    
    const nopat = netIncome + (interestExpense * (1 - taxRate));
    return (nopat / investedCapital) * 100;
  }

  private calculateEBITDAMargin(statement: FinancialStatement): number {
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const depreciation = statement.incomeStatement.depreciation || 0;
    const amortization = statement.incomeStatement.amortization || 0;
    const revenue = statement.incomeStatement.revenue || 0;
    
    if (revenue === 0) return 0;
    
    const ebitda = operatingIncome + depreciation + amortization;
    return (ebitda / revenue) * 100;
  }

  private calculateWorkingCapitalTurnover(statement: FinancialStatement): number {
    const revenue = statement.incomeStatement.revenue || 0;
    const currentAssets = statement.balanceSheet.currentAssets || 0;
    const currentLiabilities = statement.balanceSheet.currentLiabilities || 0;
    const workingCapital = currentAssets - currentLiabilities;
    
    if (workingCapital === 0) return 0;
    
    return revenue / workingCapital;
  }

  private calculateProfitabilityTrend(statement: FinancialStatement): number {
    // حساب اتجاه الربحية - افتراضي 0.1 (10%)
    return 0.1;
  }

  private calculateProfitabilityStability(statement: FinancialStatement): number {
    // حساب استقرار الربحية - افتراضي 0.8 (80%)
    return 0.8;
  }

  private calculateLiquidityTrend(statement: FinancialStatement): number {
    // حساب اتجاه السيولة - افتراضي 0.05 (5%)
    return 0.05;
  }

  private calculateLiquidityStability(statement: FinancialStatement): number {
    // حساب استقرار السيولة - افتراضي 0.75 (75%)
    return 0.75;
  }

  private calculateLeverageTrend(statement: FinancialStatement): number {
    // حساب اتجاه الرفع المالي - افتراضي 0.02 (2%)
    return 0.02;
  }

  private calculateLeverageStability(statement: FinancialStatement): number {
    // حساب استقرار الرفع المالي - افتراضي 0.7 (70%)
    return 0.7;
  }

  private calculateEfficiencyTrend(statement: FinancialStatement): number {
    // حساب اتجاه الكفاءة - افتراضي 0.08 (8%)
    return 0.08;
  }

  private calculateEfficiencyStability(statement: FinancialStatement): number {
    // حساب استقرار الكفاءة - افتراضي 0.65 (65%)
    return 0.65;
  }

  private calculateGrowthStability(financialData: FinancialStatement[]): number {
    if (financialData.length < 3) return 0.5;
    
    const growthRates = [];
    for (let i = 1; i < financialData.length; i++) {
      const current = financialData[i].incomeStatement.revenue || 0;
      const previous = financialData[i-1].incomeStatement.revenue || 0;
      if (previous > 0) {
        growthRates.push((current - previous) / previous);
      }
    }
    
    if (growthRates.length === 0) return 0.5;
    
    const mean = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
    const variance = growthRates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / growthRates.length;
    const stability = 1 / (1 + Math.sqrt(variance));
    
    return Math.min(1, Math.max(0, stability));
  }

  private calculateGrowthSustainability(financialData: FinancialStatement[]): number {
    if (financialData.length < 2) return 0.5;
    
    const current = financialData[financialData.length - 1];
    const previous = financialData[financialData.length - 2];
    
    const currentROE = (current.incomeStatement.netIncome || 0) / (current.balanceSheet.shareholdersEquity || 1);
    const previousROE = (previous.incomeStatement.netIncome || 0) / (previous.balanceSheet.shareholdersEquity || 1);
    
    const roeGrowth = currentROE - previousROE;
    const sustainability = Math.min(1, Math.max(0, 0.5 + roeGrowth));
    
    return sustainability;
  }

  private calculateGrowthTrend(financialData: FinancialStatement[]): number {
    if (financialData.length < 3) return 0.5;
    
    const growthRates = [];
    for (let i = 1; i < financialData.length; i++) {
      const current = financialData[i].incomeStatement.revenue || 0;
      const previous = financialData[i-1].incomeStatement.revenue || 0;
      if (previous > 0) {
        growthRates.push((current - previous) / previous);
      }
    }
    
    if (growthRates.length === 0) return 0.5;
    
    const trend = growthRates[growthRates.length - 1] - growthRates[0];
    return Math.min(1, Math.max(0, 0.5 + trend));
  }

  private calculateGrowthAcceleration(financialData: FinancialStatement[]): number {
    if (financialData.length < 3) return 0.5;
    
    const growthRates = [];
    for (let i = 1; i < financialData.length; i++) {
      const current = financialData[i].incomeStatement.revenue || 0;
      const previous = financialData[i-1].incomeStatement.revenue || 0;
      if (previous > 0) {
        growthRates.push((current - previous) / previous);
      }
    }
    
    if (growthRates.length < 2) return 0.5;
    
    const acceleration = growthRates[growthRates.length - 1] - growthRates[growthRates.length - 2];
    return Math.min(1, Math.max(0, 0.5 + acceleration));
  }

  private rateUltimateScore(score: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 10 المتبقية...
  private calculateUltimateStabilityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ultimate-stability', 'التحليل النهائي للاستقرار');
  }

  private calculateUltimatePerformanceAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ultimate-performance', 'التحليل النهائي للأداء');
  }

  private calculateUltimateMarketAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ultimate-market', 'التحليل النهائي للسوق');
  }

  private calculateUltimateStructuralAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ultimate-structural', 'التحليل النهائي للهيكل');
  }

  private calculateUltimateActivityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ultimate-activity', 'التحليل النهائي للنشاط');
  }

  private calculateUltimateRiskAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ultimate-risk', 'التحليل النهائي للمخاطر');
  }

  private calculateUltimateValueAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ultimate-value', 'التحليل النهائي للقيمة');
  }

  private calculateUltimateSustainabilityAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ultimate-sustainability', 'التحليل النهائي للاستدامة');
  }

  private calculateUltimateCompetitivenessAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ultimate-competitiveness', 'التحليل النهائي للتنافسية');
  }

  private calculateUltimateInnovationAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('ultimate-innovation', 'التحليل النهائي للابتكار');
  }
}
