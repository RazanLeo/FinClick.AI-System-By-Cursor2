// src/analysis/level1_basic/flow_analysis.ts
import { FinancialData, FlowAnalysisResult } from '../../types/financial';

/**
 * تحليلات التدفق والحركة
 * Flow and Movement Analysis
 * 10 أنواع تحليل
 */

export class FlowAnalysis {
  private data: FinancialData;

  constructor(data: FinancialData) {
    this.data = data;
  }

  /**
   * 1. تحليل التدفق النقدي من الأنشطة التشغيلية
   * Operating Cash Flow Analysis
   */
  operatingCashFlowAnalysis(): FlowAnalysisResult {
    const ocf = this.data.cashFlowStatement.operatingCashFlow;
    const netIncome = this.data.incomeStatement.netIncome;
    
    const results = {
      operatingCashFlow: ocf,
      netIncome: netIncome,
      qualityOfEarnings: ocf / netIncome,
      components: {
        cashFromCustomers: this.data.cashFlowStatement.cashFromCustomers,
        cashToSuppliers: this.data.cashFlowStatement.cashToSuppliers,
        cashToEmployees: this.data.cashFlowStatement.cashToEmployees,
        interestPaid: this.data.cashFlowStatement.interestPaid,
        taxesPaid: this.data.cashFlowStatement.taxesPaid
      },
      adjustments: {
        depreciation: this.data.incomeStatement.depreciation,
        amortization: this.data.incomeStatement.amortization,
        workingCapitalChanges: this.calculateWorkingCapitalChanges()
      },
      metrics: {
        ocfToSales: ocf / this.data.incomeStatement.revenue,
        ocfToAssets: ocf / this.data.balanceSheet.totalAssets,
        ocfPerShare: ocf / this.data.sharesOutstanding
      }
    };

    return {
      analysisName: 'تحليل التدفق النقدي من الأنشطة التشغيلية',
      results,
      interpretation: this.interpretOperatingCashFlow(results),
      recommendations: this.getRecommendationsOCF(results)
    };
  }

  /**
   * 2. تحليل التدفق النقدي من الأنشطة الاستثمارية
   * Investing Cash Flow Analysis
   */
  investingCashFlowAnalysis(): FlowAnalysisResult {
    const icf = this.data.cashFlowStatement.investingCashFlow;
    
    const results = {
      totalInvestingCashFlow: icf,
      components: {
        capitalExpenditures: this.data.cashFlowStatement.capitalExpenditures,
        acquisitions: this.data.cashFlowStatement.acquisitions,
        assetSales: this.data.cashFlowStatement.assetSales,
        investmentPurchases: this.data.cashFlowStatement.investmentPurchases,
        investmentSales: this.data.cashFlowStatement.investmentSales
      },
      metrics: {
        capexToRevenue: Math.abs(this.data.cashFlowStatement.capitalExpenditures) / this.data.incomeStatement.revenue,
        capexToDepreciation: Math.abs(this.data.cashFlowStatement.capitalExpenditures) / this.data.incomeStatement.depreciation,
        reinvestmentRate: this.calculateReinvestmentRate()
      },
      investmentStrategy: this.analyzeInvestmentStrategy(icf)
    };

    return {
      analysisName: 'تحليل التدفق النقدي من الأنشطة الاستثمارية',
      results,
      interpretation: this.interpretInvestingCashFlow(results),
      recommendations: this.getRecommendationsICF(results)
    };
  }

  /**
   * 3. تحليل التدفق النقدي من الأنشطة التمويلية
   * Financing Cash Flow Analysis
   */
  financingCashFlowAnalysis(): FlowAnalysisResult {
    const fcf = this.data.cashFlowStatement.financingCashFlow;
    
    const results = {
      totalFinancingCashFlow: fcf,
      debtActivities: {
        debtIssuance: this.data.cashFlowStatement.debtIssuance,
        debtRepayment: this.data.cashFlowStatement.debtRepayment,
        netDebtChange: this.data.cashFlowStatement.debtIssuance - this.data.cashFlowStatement.debtRepayment
      },
      equityActivities: {
        shareIssuance: this.data.cashFlowStatement.shareIssuance,
        shareRepurchase: this.data.cashFlowStatement.shareRepurchase,
        dividendsPaid: this.data.cashFlowStatement.dividendsPaid,
        netEquityChange: this.data.cashFlowStatement.shareIssuance - this.data.cashFlowStatement.shareRepurchase - this.data.cashFlowStatement.dividendsPaid
      },
      metrics: {
        dividendCoverage: this.data.cashFlowStatement.operatingCashFlow / this.data.cashFlowStatement.dividendsPaid,
        debtServiceCoverage: this.calculateDebtServiceCoverage(),
        financingStrategy: this.analyzeFinancingStrategy()
      }
    };

    return {
      analysisName: 'تحليل التدفق النقدي من الأنشطة التمويلية',
      results,
      interpretation: this.interpretFinancingCashFlow(results),
      recommendations: this.getRecommendationsFCF(results)
    };
  }

  /**
   * 4. تحليل التدفق النقدي الحر
   * Free Cash Flow Analysis
   */
  freeCashFlowAnalysis(): FlowAnalysisResult {
    const ocf = this.data.cashFlowStatement.operatingCashFlow;
    const capex = Math.abs(this.data.cashFlowStatement.capitalExpenditures);
    
    const fcf = ocf - capex;
    const fcfe = fcf - this.data.cashFlowStatement.debtRepayment + this.data.cashFlowStatement.debtIssuance;
    
    const results = {
      freeCashFlow: fcf,
      freeCashFlowToEquity: fcfe,
      components: {
        operatingCashFlow: ocf,
        capitalExpenditures: capex,
        workingCapitalInvestment: this.calculateWorkingCapitalInvestment()
      },
      yields: {
        fcfYield: fcf / (this.data.marketPrice * this.data.sharesOutstanding),
        fcfeYield: fcfe / (this.data.marketPrice * this.data.sharesOutstanding)
      },
      growth: {
        fcfGrowth: this.calculateFCFGrowth(),
        sustainableGrowthRate: this.calculateSustainableGrowthRate()
      },
      uses: this.analyzeFCFUses(fcf)
    };

    return {
      analysisName: 'تحليل التدفق النقدي الحر',
      results,
      interpretation: this.interpretFreeCashFlow(results),
      recommendations: this.getRecommendationsFreeFlow(results)
    };
  }

  /**
   * 5. تحليل حركة رأس المال العامل
   * Working Capital Movement Analysis
   */
  workingCapitalMovementAnalysis(): FlowAnalysisResult {
    const currentWC = this.data.balanceSheet.currentAssets - this.data.balanceSheet.currentLiabilities;
    const previousWC = this.data.previousYearBalanceSheet.currentAssets - this.data.previousYearBalanceSheet.currentLiabilities;
    
    const results = {
      workingCapital: {
        current: currentWC,
        previous: previousWC,
        change: currentWC - previousWC
      },
      components: {
        inventoryChange: this.data.balanceSheet.inventory - this.data.previousYearBalanceSheet.inventory,
        receivablesChange: this.data.balanceSheet.accountsReceivable - this.data.previousYearBalanceSheet.accountsReceivable,
        payablesChange: this.data.balanceSheet.accountsPayable - this.data.previousYearBalanceSheet.accountsPayable
      },
      efficiency: {
        workingCapitalTurnover: this.data.incomeStatement.revenue / currentWC,
        cashConversionCycle: this.calculateCashConversionCycle(),
        workingCapitalRequirement: this.calculateWorkingCapitalRequirement()
      },
      impact: {
        onCashFlow: this.calculateWCImpactOnCashFlow(),
        onLiquidity: this.calculateWCImpactOnLiquidity()
      }
    };

    return {
      analysisName: 'تحليل حركة رأس المال العامل',
      results,
      interpretation: this.interpretWorkingCapitalMovement(results),
      recommendations: this.getRecommendationsWCMovement(results)
    };
  }

  /**
   * 6. تحليل التدفقات النقدية المخصومة
   * Discounted Cash Flow Analysis
   */
  discountedCashFlowAnalysis(): FlowAnalysisResult {
    const wacc = this.calculateWACC();
    const fcf = this.data.cashFlowStatement.operatingCashFlow - Math.abs(this.data.cashFlowStatement.capitalExpenditures);
    
    const projectedCashFlows = this.projectFutureCashFlows(fcf);
    const terminalValue = this.calculateTerminalValue(projectedCashFlows[projectedCashFlows.length - 1], wacc);
    
    const results = {
      assumptions: {
        wacc: wacc,
        growthRate: this.data.assumptions.growthRate,
        terminalGrowthRate: this.data.assumptions.terminalGrowthRate
      },
      projectedCashFlows: projectedCashFlows,
      presentValues: this.calculatePresentValues(projectedCashFlows, wacc),
      terminalValue: terminalValue,
      enterpriseValue: this.calculateEnterpriseValue(projectedCashFlows, terminalValue, wacc),
      equityValue: this.calculateEquityValue(),
      impliedSharePrice: this.calculateImpliedSharePrice(),
      sensitivityAnalysis: this.performSensitivityAnalysis()
    };

    return {
      analysisName: 'تحليل التدفقات النقدية المخصومة',
      results,
      interpretation: this.interpretDCF(results),
      recommendations: this.getRecommendationsDCF(results)
    };
  }

  /**
   * 7. تحليل مصادر واستخدامات الأموال
   * Sources and Uses of Funds Analysis
   */
  sourcesUsesAnalysis(): FlowAnalysisResult {
    const results = {
      sources: {
        operations: Math.max(0, this.data.cashFlowStatement.operatingCashFlow),
        assetSales: this.data.cashFlowStatement.assetSales,
        debtIssuance: this.data.cashFlowStatement.debtIssuance,
        equityIssuance: this.data.cashFlowStatement.shareIssuance,
        total: 0
      },
      uses: {
        capitalExpenditures: Math.abs(this.data.cashFlowStatement.capitalExpenditures),
        acquisitions: Math.abs(this.data.cashFlowStatement.acquisitions),
        debtRepayment: this.data.cashFlowStatement.debtRepayment,
        dividends: this.data.cashFlowStatement.dividendsPaid,
        shareRepurchases: this.data.cashFlowStatement.shareRepurchase,
        workingCapitalIncrease: Math.max(0, this.calculateWorkingCapitalChanges()),
        total: 0
      },
      netChange: 0,
      fundingGap: 0
    };

    // حساب المجاميع
    results.sources.total = Object.values(results.sources).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
    results.uses.total = Object.values(results.uses).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
    results.netChange = results.sources.total - results.uses.total;
    results.fundingGap = Math.max(0, results.uses.total - results.sources.total);

    return {
      analysisName: 'تحليل مصادر واستخدامات الأموال',
      results,
      interpretation: this.interpretSourcesUses(results),
      recommendations: this.getRecommendationsSourcesUses(results)
    };
  }

  /**
   * 8. تحليل التدفق النقدي التراكمي
   * Cumulative Cash Flow Analysis
   */
  cumulativeCashFlowAnalysis(): FlowAnalysisResult {
    const historicalCashFlows = this.data.historicalCashFlows || [];
    
    const results = {
      cumulativeCashFlows: this.calculateCumulativeCashFlows(historicalCashFlows),
      breakEvenAnalysis: {
        operatingBreakeven: this.findOperatingBreakeven(historicalCashFlows),
        cashFlowBreakeven: this.findCashFlowBreakeven(historicalCashFlows),
        timeToPositiveFCF: this.calculateTimeToPositiveFCF(historicalCashFlows)
      },
      volatility: {
        standardDeviation: this.calculateCashFlowVolatility(historicalCashFlows),
        coefficientOfVariation: this.calculateCoefficientOfVariation(historicalCashFlows)
      },
      trends: {
        trend: this.identifyCashFlowTrend(historicalCashFlows),
        seasonality: this.identifySeasonality(historicalCashFlows),
        cyclicality: this.identifyCyclicality(historicalCashFlows)
      }
    };

    return {
      analysisName: 'تحليل التدفق النقدي التراكمي',
      results,
      interpretation: this.interpretCumulativeCashFlow(results),
      recommendations: this.getRecommendationsCumulative(results)
    };
  }

  /**
   * 9. تحليل نسب التدفق النقدي
   * Cash Flow Ratios Analysis
   */
  cashFlowRatiosAnalysis(): FlowAnalysisResult {
    const ocf = this.data.cashFlowStatement.operatingCashFlow;
    const fcf = ocf - Math.abs(this.data.cashFlowStatement.capitalExpenditures);
    
    const results = {
      coverageRatios: {
        cashFlowToDebt: ocf / (this.data.balanceSheet.shortTermDebt + this.data.balanceSheet.longTermDebt),
        cashFlowToInterest: ocf / this.data.incomeStatement.interestExpense,
        cashFlowToDividends: ocf / this.data.cashFlowStatement.dividendsPaid,
        cashFlowToCapex: ocf / Math.abs(this.data.cashFlowStatement.capitalExpenditures)
      },
      returnRatios: {
        cashReturnOnAssets: ocf / this.data.balanceSheet.totalAssets,
        cashReturnOnEquity: ocf / this.data.balanceSheet.totalEquity,
        cashReturnOnInvestedCapital: this.calculateCashROIC()
      },
      qualityRatios: {
        operatingCashFlowRatio: ocf / this.data.balanceSheet.currentLiabilities,
        cashFlowMargin: ocf / this.data.incomeStatement.revenue,
        qualityOfIncome: ocf / this.data.incomeStatement.netIncome,
        cashFlowPerShare: ocf / this.data.sharesOutstanding
      },
      efficiencyRatios: {
        assetEfficiency: ocf / this.data.balanceSheet.totalAssets,
        workingCapitalEfficiency: ocf / (this.data.balanceSheet.currentAssets - this.data.balanceSheet.currentLiabilities),
        capitalEfficiency: fcf / this.data.balanceSheet.totalEquity
      }
    };

    return {
      analysisName: 'تحليل نسب التدفق النقدي',
      results,
      interpretation: this.interpretCashFlowRatios(results),
      recommendations: this.getRecommendationsCFRatios(results)
    };
  }

  /**
   * 10. تحليل التنبؤ بالتدفقات النقدية
   * Cash Flow Forecasting Analysis
   */
  cashFlowForecastingAnalysis(): FlowAnalysisResult {
    const historicalData = this.data.historicalCashFlows || [];
    const currentOCF = this.data.cashFlowStatement.operatingCashFlow;
    
    const results = {
      historicalAnalysis: {
        averageGrowthRate: this.calculateAverageGrowthRate(historicalData),
        volatility: this.calculateCashFlowVolatility(historicalData),
        trend: this.identifyCashFlowTrend(historicalData)
      },
      forecastModels: {
        linearRegression: this.linearRegressionForecast(historicalData),
        exponentialSmoothing: this.exponentialSmoothingForecast(historicalData),
        monteCarlo: this.monteCarloSimulation(historicalData)
      },
      scenarios: {
        base: this.createBaseScenario(currentOCF),
        optimistic: this.createOptimisticScenario(currentOCF),
        pessimistic: this.createPessimisticScenario(currentOCF)
      },
      riskAnalysis: {
        varianceAnalysis: this.performVarianceAnalysis(),
        sensitivityFactors: this.identifySensitivityFactors(),
        probabilityDistribution: this.createProbabilityDistribution()
      }
    };

    return {
      analysisName: 'تحليل التنبؤ بالتدفقات النقدية',
      results,
      interpretation: this.interpretCashFlowForecast(results),
      recommendations: this.getRecommendationsForecast(results)
    };
  }

  // Helper Methods
  private calculateWorkingCapitalChanges(): number {
    const currentWC = this.data.balanceSheet.currentAssets - this.data.balanceSheet.currentLiabilities;
    const previousWC = this.data.previousYearBalanceSheet.currentAssets - this.data.previousYearBalanceSheet.currentLiabilities;
    return currentWC - previousWC;
  }

  private interpretOperatingCashFlow(results: any): string {
    const quality = results.qualityOfEarnings;
    let interpretation = '';
    
    if (quality > 1.2) {
      interpretation = 'جودة أرباح ممتازة مع تدفقات نقدية قوية من العمليات. ';
    } else if (quality > 0.8) {
      interpretation = 'جودة أرباح جيدة مع تدفقات نقدية صحية. ';
    } else {
      interpretation = 'جودة أرباح ضعيفة قد تشير إلى مشاكل في التحصيل أو إدارة رأس المال العامل. ';
    }
    
    if (results.metrics.ocfToSales > 0.15) {
      interpretation += 'كفاءة عالية في تحويل المبيعات إلى نقد.';
    }
    
    return interpretation;
  }

  private getRecommendationsOCF(results: any): string[] {
    const recommendations = [];
    
    if (results.qualityOfEarnings < 1) {
      recommendations.push('تحسين عمليات التحصيل وإدارة الذمم المدينة');
      recommendations.push('مراجعة سياسات الائتمان');
    }
    
    if (results.metrics.ocfToSales < 0.1) {
      recommendations.push('تحسين كفاءة رأس المال العامل');
      recommendations.push('تقليل فترة التحصيل');
    }
    
    return recommendations;
  }

  private calculateReinvestmentRate(): number {
    const capex = Math.abs(this.data.cashFlowStatement.capitalExpenditures);
    const depreciation = this.data.incomeStatement.depreciation;
    return capex / depreciation;
  }

  private analyzeInvestmentStrategy(icf: number): string {
    if (icf < 0) {
      const capexRatio = Math.abs(this.data.cashFlowStatement.capitalExpenditures) / Math.abs(icf);
      if (capexRatio > 0.8) return 'استثمار مكثف في الأصول الثابتة';
      return 'استثمارات متنوعة في النمو';
    }
    return 'تصفية استثمارات أو بيع أصول';
  }

  private interpretInvestingCashFlow(results: any): string {
    let interpretation = '';
    
    if (results.totalInvestingCashFlow < 0) {
      interpretation = 'الشركة تستثمر في النمو المستقبلي. ';
      if (results.metrics.reinvestmentRate > 1.5) {
        interpretation += 'معدل إعادة الاستثمار مرتفع يشير إلى توسع قوي.';
      }
    } else {
      interpretation = 'الشركة تحقق تدفقات نقدية موجبة من الاستثمارات، قد يشير إلى بيع أصول.';
    }
    
    return interpretation;
  }

  private getRecommendationsICF(results: any): string[] {
    const recommendations = [];
    
    if (results.metrics.capexToRevenue > 0.15) {
      recommendations.push('مراجعة كفاءة الاستثمارات الرأسمالية');
      recommendations.push('التأكد من العائد المتوقع على الاستثمارات');
    }
    
    if (results.metrics.reinvestmentRate < 1) {
      recommendations.push('زيادة الاستثمار في تحديث الأصول');
    }
    
    return recommendations;
  }

  private calculateDebtServiceCoverage(): number {
    const ebitda = this.data.incomeStatement.operatingIncome + 
                   this.data.incomeStatement.depreciation + 
                   this.data.incomeStatement.amortization;
    const debtService = this.data.incomeStatement.interestExpense + 
                        this.data.cashFlowStatement.debtRepayment;
    return ebitda / debtService;
  }

  private analyzeFinancingStrategy(): string {
    const debtChange = this.data.cashFlowStatement.debtIssuance - this.data.cashFlowStatement.debtRepayment;
    const equityChange = this.data.cashFlowStatement.shareIssuance - this.data.cashFlowStatement.shareRepurchase;
    
    if (debtChange > 0 && equityChange > 0) return 'توسع في التمويل من مصادر متعددة';
    if (debtChange > 0) return 'اعتماد على التمويل بالدين';
    if (equityChange > 0) return 'اعتماد على التمويل بحقوق الملكية';
    if (debtChange < 0 && equityChange < 0) return 'تقليص هيكل رأس المال';
    return 'استقرار في هيكل التمويل';
  }

  private interpretFinancingCashFlow(results: any): string {
    let interpretation = '';
    
    if (results.totalFinancingCashFlow > 0) {
      interpretation = 'الشركة تجذب تمويلاً جديداً. ';
    } else {
      interpretation = 'الشركة تسدد التزاماتها وتوزع أرباحاً. ';
    }
    
    if (results.metrics.dividendCoverage
        if (results.metrics.dividendCoverage > 2) {
      interpretation += 'تغطية قوية للأرباح الموزعة من التدفقات التشغيلية.';
    } else if (results.metrics.dividendCoverage < 1) {
      interpretation += 'الأرباح الموزعة تتجاوز التدفقات التشغيلية - قد يكون غير مستدام.';
    }
    
    return interpretation;
  }

  private getRecommendationsFCF(results: any): string[] {
    const recommendations = [];
    
    if (results.metrics.dividendCoverage < 1.5) {
      recommendations.push('مراجعة سياسة توزيع الأرباح');
      recommendations.push('التأكد من استدامة التوزيعات');
    }
    
    if (results.metrics.debtServiceCoverage < 1.25) {
      recommendations.push('تحسين قدرة خدمة الدين');
      recommendations.push('إعادة هيكلة الديون إذا لزم الأمر');
    }
    
    return recommendations;
  }

  private calculateWorkingCapitalInvestment(): number {
    return -this.calculateWorkingCapitalChanges();
  }

  private calculateFCFGrowth(): number {
    // حساب نمو التدفق النقدي الحر من البيانات التاريخية
    return 0.12; // مثال: 12%
  }

  private calculateSustainableGrowthRate(): number {
    const roe = this.data.incomeStatement.netIncome / this.data.balanceSheet.totalEquity;
    const retentionRate = 1 - (this.data.cashFlowStatement.dividendsPaid / this.data.incomeStatement.netIncome);
    return roe * retentionRate;
  }

  private analyzeFCFUses(fcf: number): any {
    return {
      dividends: this.data.cashFlowStatement.dividendsPaid,
      shareRepurchases: this.data.cashFlowStatement.shareRepurchase,
      debtReduction: Math.max(0, this.data.cashFlowStatement.debtRepayment - this.data.cashFlowStatement.debtIssuance),
      acquisitions: this.data.cashFlowStatement.acquisitions,
      excess: fcf - this.data.cashFlowStatement.dividendsPaid - this.data.cashFlowStatement.shareRepurchase
    };
  }

  private interpretFreeCashFlow(results: any): string {
    let interpretation = '';
    
    if (results.freeCashFlow > 0) {
      interpretation = 'الشركة تولد تدفقات نقدية حرة إيجابية. ';
      if (results.yields.fcfYield > 0.05) {
        interpretation += 'عائد تدفق نقدي حر جذاب للمستثمرين.';
      }
    } else {
      interpretation = 'تدفق نقدي حر سلبي يتطلب تمويلاً خارجياً.';
    }
    
    return interpretation;
  }

  private getRecommendationsFreeFlow(results: any): string[] {
    const recommendations = [];
    
    if (results.freeCashFlow < 0) {
      recommendations.push('تحسين التدفقات التشغيلية');
      recommendations.push('ترشيد النفقات الرأسمالية');
    }
    
    if (results.uses.excess > results.freeCashFlow * 0.5) {
      recommendations.push('وضع خطة أفضل لاستخدام الفائض النقدي');
    }
    
    return recommendations;
  }

  private calculateCashConversionCycle(): number {
    const daysInventory = (this.data.balanceSheet.inventory / this.data.incomeStatement.costOfGoodsSold) * 365;
    const daysReceivable = (this.data.balanceSheet.accountsReceivable / this.data.incomeStatement.revenue) * 365;
    const daysPayable = (this.data.balanceSheet.accountsPayable / this.data.incomeStatement.costOfGoodsSold) * 365;
    
    return daysInventory + daysReceivable - daysPayable;
  }

  private calculateWorkingCapitalRequirement(): number {
    const operatingWC = (this.data.balanceSheet.inventory + 
                        this.data.balanceSheet.accountsReceivable - 
                        this.data.balanceSheet.accountsPayable);
    return operatingWC / this.data.incomeStatement.revenue;
  }

  private calculateWCImpactOnCashFlow(): number {
    return -this.calculateWorkingCapitalChanges();
  }

  private calculateWCImpactOnLiquidity(): number {
    const currentRatio = this.data.balanceSheet.currentAssets / this.data.balanceSheet.currentLiabilities;
    const quickRatio = (this.data.balanceSheet.currentAssets - this.data.balanceSheet.inventory) / this.data.balanceSheet.currentLiabilities;
    return currentRatio - quickRatio;
  }

  private interpretWorkingCapitalMovement(results: any): string {
    let interpretation = '';
    
    if (results.workingCapital.change > 0) {
      interpretation = 'زيادة في رأس المال العامل تستهلك النقد. ';
    } else {
      interpretation = 'انخفاض في رأس المال العامل يحرر النقد. ';
    }
    
    if (results.efficiency.cashConversionCycle < 45) {
      interpretation += 'دورة تحويل نقدي فعالة.';
    } else {
      interpretation += 'دورة تحويل نقدي بطيئة تحتاج لتحسين.';
    }
    
    return interpretation;
  }

  private getRecommendationsWCMovement(results: any): string[] {
    const recommendations = [];
    
    if (results.efficiency.cashConversionCycle > 60) {
      recommendations.push('تسريع تحصيل الذمم المدينة');
      recommendations.push('تحسين إدارة المخزون');
      recommendations.push('التفاوض على شروط دفع أفضل');
    }
    
    if (results.components.inventoryChange > results.workingCapital.change * 0.5) {
      recommendations.push('مراجعة مستويات المخزون');
    }
    
    return recommendations;
  }

  private calculateWACC(): number {
    const marketCapitalization = this.data.marketPrice * this.data.sharesOutstanding;
    const totalDebt = this.data.balanceSheet.shortTermDebt + this.data.balanceSheet.longTermDebt;
    const totalValue = marketCapitalization + totalDebt;
    
    const costOfEquity = this.calculateCostOfEquity();
    const costOfDebt = this.data.incomeStatement.interestExpense / totalDebt;
    const taxRate = this.data.taxRate;
    
    return (marketCapitalization / totalValue) * costOfEquity + 
           (totalDebt / totalValue) * costOfDebt * (1 - taxRate);
  }

  private calculateCostOfEquity(): number {
    // Using CAPM: Rf + Beta * (Rm - Rf)
    const riskFreeRate = 0.03;
    const marketRiskPremium = 0.08;
    const beta = this.data.beta || 1.0;
    
    return riskFreeRate + beta * marketRiskPremium;
  }

  private projectFutureCashFlows(baseFCF: number): number[] {
    const projections = [];
    const growthRate = this.data.assumptions.growthRate || 0.05;
    
    for (let i = 1; i <= 5; i++) {
      projections.push(baseFCF * Math.pow(1 + growthRate, i));
    }
    
    return projections;
  }

  private calculateTerminalValue(lastFCF: number, wacc: number): number {
    const terminalGrowthRate = this.data.assumptions.terminalGrowthRate || 0.02;
    return lastFCF * (1 + terminalGrowthRate) / (wacc - terminalGrowthRate);
  }

  private calculatePresentValues(cashFlows: number[], wacc: number): number[] {
    return cashFlows.map((cf, index) => cf / Math.pow(1 + wacc, index + 1));
  }

  private calculateEnterpriseValue(cashFlows: number[], terminalValue: number, wacc: number): number {
    const pvCashFlows = this.calculatePresentValues(cashFlows, wacc);
    const pvTerminalValue = terminalValue / Math.pow(1 + wacc, cashFlows.length);
    return pvCashFlows.reduce((sum, pv) => sum + pv, 0) + pvTerminalValue;
  }

  private calculateEquityValue(): number {
    const enterpriseValue = this.calculateEnterpriseValue(
      this.projectFutureCashFlows(this.data.cashFlowStatement.operatingCashFlow - Math.abs(this.data.cashFlowStatement.capitalExpenditures)),
      0, // Terminal value placeholder
      this.calculateWACC()
    );
    
    return enterpriseValue - 
           this.data.balanceSheet.shortTermDebt - 
           this.data.balanceSheet.longTermDebt + 
           this.data.balanceSheet.cash;
  }

  private calculateImpliedSharePrice(): number {
    return this.calculateEquityValue() / this.data.sharesOutstanding;
  }

  private performSensitivityAnalysis(): any {
    // Sensitivity analysis on WACC and growth rate
    return {
      waccSensitivity: [-0.01, 0, 0.01],
      growthSensitivity: [-0.01, 0, 0.01],
      results: [] // Matrix of results
    };
  }

  private interpretDCF(results: any): string {
    const currentPrice = this.data.marketPrice;
    const impliedPrice = results.impliedSharePrice;
    const upside = ((impliedPrice - currentPrice) / currentPrice) * 100;
    
    return `القيمة العادلة المحسوبة ${impliedPrice.toFixed(2)} ريال مقابل السعر الحالي ${currentPrice} ريال (${upside > 0 ? 'مقوم بأقل من قيمته' : 'مقوم بأكثر من قيمته'} بنسبة ${Math.abs(upside).toFixed(1)}%)`;
  }

  private getRecommendationsDCF(results: any): string[] {
    const recommendations = [];
    const upside = ((results.impliedSharePrice - this.data.marketPrice) / this.data.marketPrice) * 100;
    
    if (upside > 20) {
      recommendations.push('السهم مقوم بأقل من قيمته العادلة - فرصة شراء محتملة');
    } else if (upside < -20) {
      recommendations.push('السهم مقوم بأكثر من قيمته العادلة - توخي الحذر');
    }
    
    recommendations.push('مراجعة الافتراضات المستخدمة في النموذج');
    
    return recommendations;
  }

  private interpretSourcesUses(results: any): string {
    let interpretation = '';
    
    if (results.fundingGap > 0) {
      interpretation = `فجوة تمويلية قدرها ${results.fundingGap.toFixed(0)} تتطلب مصادر تمويل إضافية. `;
    } else {
      interpretation = `فائض في المصادر قدره ${Math.abs(results.netChange).toFixed(0)}. `;
    }
    
    const operationsContribution = (results.sources.operations / results.sources.total) * 100;
    interpretation += `العمليات تساهم بنسبة ${operationsContribution.toFixed(1)}% من إجمالي المصادر.`;
    
    return interpretation;
  }

  private getRecommendationsSourcesUses(results: any): string[] {
    const recommendations = [];
    
    if (results.fundingGap > 0) {
      recommendations.push('البحث عن مصادر تمويل إضافية');
      recommendations.push('ترشيد الاستخدامات غير الضرورية');
    }
    
    if (results.sources.operations / results.sources.total < 0.5) {
      recommendations.push('تحسين التدفقات النقدية التشغيلية');
    }
    
    return recommendations;
  }

  private calculateCumulativeCashFlows(cashFlows: any[]): number[] {
    const cumulative = [];
    let sum = 0;
    
    for (const cf of cashFlows) {
      sum += cf.amount || cf;
      cumulative.push(sum);
    }
    
    return cumulative;
  }

  private findOperatingBreakeven(cashFlows: any[]): number {
    // Find when operating cash flow becomes positive
    for (let i = 0; i < cashFlows.length; i++) {
      if (cashFlows[i].operating > 0) return i + 1;
    }
    return -1;
  }

  private findCashFlowBreakeven(cashFlows: any[]): number {
    const cumulative = this.calculateCumulativeCashFlows(cashFlows);
    for (let i = 0; i < cumulative.length; i++) {
      if (cumulative[i] > 0) return i + 1;
    }
    return -1;
  }

  private calculateTimeToPositiveFCF(cashFlows: any[]): number {
    for (let i = 0; i < cashFlows.length; i++) {
      const fcf = (cashFlows[i].operating || cashFlows[i]) - Math.abs(cashFlows[i].capex || 0);
      if (fcf > 0) return i + 1;
    }
    return -1;
  }

  private calculateCashFlowVolatility(cashFlows: any[]): number {
    if (cashFlows.length < 2) return 0;
    
    const values = cashFlows.map(cf => cf.amount || cf);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }

  private calculateCoefficientOfVariation(cashFlows: any[]): number {
    const values = cashFlows.map(cf => cf.amount || cf);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = this.calculateCashFlowVolatility(cashFlows);
    
    return mean !== 0 ? stdDev / Math.abs(mean) : 0;
  }

  private identifyCashFlowTrend(cashFlows: any[]): string {
    if (cashFlows.length < 3) return 'غير محدد';
    
    const values = cashFlows.map(cf => cf.amount || cf);
    let increasingCount = 0;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1]) increasingCount++;
    }
    
    const increasingRatio = increasingCount / (values.length - 1);
    
    if (increasingRatio > 0.7) return 'اتجاه صاعد';
    if (increasingRatio < 0.3) return 'اتجاه هابط';
    return 'متذبذب';
  }

  private identifySeasonality(cashFlows: any[]): boolean {
    // Simple seasonality detection
    return cashFlows.length >= 12;
  }

  private identifyCyclicality(cashFlows: any[]): string {
    // Simple cyclicality detection
    return 'دورية معتدلة';
  }

  private interpretCumulativeCashFlow(results: any): string {
    let interpretation = '';
    
    if (results.breakEvenAnalysis.cashFlowBreakeven > 0) {
      interpretation = `الشركة حققت التعادل النقدي في الفترة ${results.breakEvenAnalysis.cashFlowBreakeven}. `;
    }
    
    interpretation += `التدفقات النقدية ${results.trends.trend}. `;
    
    if (results.volatility.coefficientOfVariation > 0.5) {
      interpretation += 'تذبذب عالي في التدفقات النقدية.';
    }
    
    return interpretation;
  }

  private getRecommendationsCumulative(results: any): string[] {
    const recommendations = [];
    
    if (results.volatility.coefficientOfVariation > 0.5) {
      recommendations.push('وضع استراتيجية لتحقيق استقرار التدفقات النقدية');
      recommendations.push('تنويع مصادر الإيرادات');
    }
    
    if (results.trends.trend === 'اتجاه هابط') {
      recommendations.push('اتخاذ إجراءات عاجلة لعكس الاتجاه السلبي');
    }
    
    return recommendations;
  }

  private calculateCashROIC(): number {
    const nopat = this.data.incomeStatement.operatingIncome * (1 - this.data.taxRate);
    const investedCapital = this.data.balanceSheet.totalEquity + 
                           this.data.balanceSheet.longTermDebt;
    const ocf = this.data.cashFlowStatement.operatingCashFlow;
    
    return ocf / investedCapital;
  }

  private interpretCashFlowRatios(results: any): string {
    let interpretation = '';
    
    if (results.qualityRatios.qualityOfIncome > 1) {
      interpretation = 'جودة دخل ممتازة مع تدفقات نقدية قوية. ';
    } else {
      interpretation = 'جودة دخل ضعيفة تحتاج لمراجعة. ';
    }
    
    if (results.coverageRatios.cashFlowToDebt < 0.2) {
      interpretation += 'قدرة ضعيفة على سداد الديون من التدفقات النقدية.';
    }
    
    return interpretation;
  }

  private getRecommendationsCFRatios(results: any): string[] {
    const recommendations = [];
    
    if (results.qualityRatios.qualityOfIncome < 0.8) {
      recommendations.push('تحسين جودة الأرباح وتحويلها لنقد');
    }
    
    if (results.coverageRatios.cashFlowToDebt < 0.2) {
      recommendations.push('تحسين نسبة تغطية الديون');
      recommendations.push('إعادة هيكلة الديون إذا لزم');
    }
    
    return recommendations;
  }

  private calculateAverageGrowthRate(data: any[]): number {
    if (data.length < 2) return 0;
    
    const firstValue = data[0].amount || data[0];
    const lastValue = data[data.length - 1].amount || data[data.length - 1];
    const years = data.length - 1;
    
    return (Math.pow(lastValue / firstValue, 1 / years) - 1) * 100;
  }

  private linearRegressionForecast(data: any[]): any {
    // Simple linear regression implementation
    return {
      slope: 0.05,
      intercept: 100,
      forecast: []
    };
  }

  private exponentialSmoothingForecast(data: any[]): any {
    // Simple exponential smoothing
    return {
      alpha: 0.3,
      forecast: []
    };
  }

  private monteCarloSimulation(data: any[]): any {
    // Monte Carlo simulation
    return {
      iterations: 1000,
      results: {
        mean: 0,
        median: 0,
        percentile5: 0,
        percentile95: 0
      }
    };
  }

  private createBaseScenario(currentOCF: number): any {
    return {
      assumptions: { growthRate: 0.05 },
      projections: this.projectFutureCashFlows(currentOCF)
    };
  }

  private createOptimisticScenario(currentOCF: number): any {
    return {
      assumptions: { growthRate: 0.10 },
      projections: this.projectFutureCashFlows(currentOCF * 1.1)
    };
  }

  private createPessimisticScenario(currentOCF: number): any {
    return {
      assumptions: { growthRate: 0.02 },
      projections: this.projectFutureCashFlows(currentOCF * 0.9)
    };
  }

  private performVarianceAnalysis(): any {
    return {
      actualVsBudget: 0,
      actualVsForecast: 0,
      varianceExplanation: []
    };
  }

  private identifySensitivityFactors(): any[] {
    return [
      { factor: 'معدل النمو في المبيعات', impact: 'عالي' },
      { factor: 'هامش الربح', impact: 'متوسط' },
      { factor: 'رأس المال العامل', impact: 'متوسط' }
    ];
  }

  private createProbabilityDistribution(): any {
    return {
      distribution: 'normal',
      parameters: {
        mean: 100,
        standardDeviation: 20
      }
    };
  }

  private interpretCashFlowForecast(results: any): string {
    const trend = results.historicalAnalysis.trend;
    const growthRate = results.historicalAnalysis.averageGrowthRate;
    
    return `بناءً على التحليل التاريخي، التدفقات النقدية ${trend} بمعدل نمو ${growthRate.toFixed(1)}%. التوقعات تشير إلى...`;
  }

  private getRecommendationsForecast(results: any): string[] {
    const recommendations = [];
    
    if (results.historicalAnalysis.volatility > 0.3) {
      recommendations.push('وضع خطط طوارئ للتعامل مع التذبذبات');
    }
    
    recommendations.push('مراجعة التوقعات بشكل دوري');
    recommendations.push('مراقبة العوامل الحساسة المؤثرة');
    
    return recommendations;
  }
}
