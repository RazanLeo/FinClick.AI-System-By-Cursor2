// src/analysis/level1_basic/financial_ratios.ts
import { FinancialData, RatioAnalysisResult } from '../../types/financial';

/**
 * النسب المالية الأساسية
 * Basic Financial Ratios
 * 30 نسبة مالية
 */

export class FinancialRatios {
  private data: FinancialData;

  constructor(data: FinancialData) {
    this.data = data;
  }

  /**
   * نسب السيولة (Liquidity Ratios)
   */
  
  // 1. نسبة التداول (Current Ratio)
  currentRatio(): RatioAnalysisResult {
    const ratio = this.data.balanceSheet.currentAssets / this.data.balanceSheet.currentLiabilities;
    
    return {
      name: 'نسبة التداول',
      englishName: 'Current Ratio',
      value: ratio,
      formula: 'الأصول المتداولة ÷ الالتزامات المتداولة',
      interpretation: this.interpretCurrentRatio(ratio),
      industryBenchmark: 2.0,
      evaluation: this.evaluateRatio(ratio, 2.0, 'higher'),
      recommendations: this.getRecommendationsCurrentRatio(ratio)
    };
  }

  // 2. نسبة السيولة السريعة (Quick Ratio)
  quickRatio(): RatioAnalysisResult {
    const quickAssets = this.data.balanceSheet.currentAssets - this.data.balanceSheet.inventory;
    const ratio = quickAssets / this.data.balanceSheet.currentLiabilities;
    
    return {
      name: 'نسبة السيولة السريعة',
      englishName: 'Quick Ratio',
      value: ratio,
      formula: '(الأصول المتداولة - المخزون) ÷ الالتزامات المتداولة',
      interpretation: this.interpretQuickRatio(ratio),
      industryBenchmark: 1.0,
      evaluation: this.evaluateRatio(ratio, 1.0, 'higher'),
      recommendations: this.getRecommendationsQuickRatio(ratio)
    };
  }

  // 3. نسبة النقدية (Cash Ratio)
  cashRatio(): RatioAnalysisResult {
    const cashAndEquivalents = this.data.balanceSheet.cash + this.data.balanceSheet.marketableSecurities;
    const ratio = cashAndEquivalents / this.data.balanceSheet.currentLiabilities;
    
    return {
      name: 'نسبة النقدية',
      englishName: 'Cash Ratio',
      value: ratio,
      formula: '(النقد + الاستثمارات قصيرة الأجل) ÷ الالتزامات المتداولة',
      interpretation: this.interpretCashRatio(ratio),
      industryBenchmark: 0.2,
      evaluation: this.evaluateRatio(ratio, 0.2, 'higher'),
      recommendations: this.getRecommendationsCashRatio(ratio)
    };
  }

  // 4. نسبة التدفق النقدي التشغيلي (Operating Cash Flow Ratio)
  operatingCashFlowRatio(): RatioAnalysisResult {
    const ratio = this.data.cashFlowStatement.operatingCashFlow / this.data.balanceSheet.currentLiabilities;
    
    return {
      name: 'نسبة التدفق النقدي التشغيلي',
      englishName: 'Operating Cash Flow Ratio',
      value: ratio,
      formula: 'التدفق النقدي التشغيلي ÷ الالتزامات المتداولة',
      interpretation: this.interpretOCFRatio(ratio),
      industryBenchmark: 0.5,
      evaluation: this.evaluateRatio(ratio, 0.5, 'higher'),
      recommendations: this.getRecommendationsOCFRatio(ratio)
    };
  }

  /**
   * نسب النشاط (Activity Ratios)
   */
  
  // 5. معدل دوران المخزون (Inventory Turnover)
  inventoryTurnover(): RatioAnalysisResult {
    const ratio = this.data.incomeStatement.costOfGoodsSold / this.data.balanceSheet.inventory;
    const daysInventory = 365 / ratio;
    
    return {
      name: 'معدل دوران المخزون',
      englishName: 'Inventory Turnover',
      value: ratio,
      additionalMetrics: {
        daysInventory: daysInventory
      },
      formula: 'تكلفة البضاعة المباعة ÷ المخزون',
      interpretation: this.interpretInventoryTurnover(ratio, daysInventory),
      industryBenchmark: 8,
      evaluation: this.evaluateRatio(ratio, 8, 'higher'),
      recommendations: this.getRecommendationsInventoryTurnover(ratio)
    };
  }

  // 6. معدل دوران الذمم المدينة (Receivables Turnover)
  receivablesTurnover(): RatioAnalysisResult {
    const ratio = this.data.incomeStatement.revenue / this.data.balanceSheet.accountsReceivable;
    const daysReceivable = 365 / ratio;
    
    return {
      name: 'معدل دوران الذمم المدينة',
      englishName: 'Receivables Turnover',
      value: ratio,
      additionalMetrics: {
        daysReceivable: daysReceivable
      },
      formula: 'المبيعات ÷ الذمم المدينة',
      interpretation: this.interpretReceivablesTurnover(ratio, daysReceivable),
      industryBenchmark: 12,
      evaluation: this.evaluateRatio(ratio, 12, 'higher'),
      recommendations: this.getRecommendationsReceivablesTurnover(ratio)
    };
  }

  // 7. معدل دوران الذمم الدائنة (Payables Turnover)
  payablesTurnover(): RatioAnalysisResult {
    const ratio = this.data.incomeStatement.costOfGoodsSold / this.data.balanceSheet.accountsPayable;
    const daysPayable = 365 / ratio;
    
    return {
      name: 'معدل دوران الذمم الدائنة',
      englishName: 'Payables Turnover',
      value: ratio,
      additionalMetrics: {
        daysPayable: daysPayable
      },
      formula: 'تكلفة البضاعة المباعة ÷ الذمم الدائنة',
      interpretation: this.interpretPayablesTurnover(ratio, daysPayable),
      industryBenchmark: 10,
      evaluation: this.evaluateRatio(ratio, 10, 'balanced'),
      recommendations: this.getRecommendationsPayablesTurnover(ratio)
    };
  }

  // 8. معدل دوران الأصول (Asset Turnover)
  assetTurnover(): RatioAnalysisResult {
    const ratio = this.data.incomeStatement.revenue / this.data.balanceSheet.totalAssets;
    
    return {
      name: 'معدل دوران الأصول',
      englishName: 'Asset Turnover',
      value: ratio,
      formula: 'المبيعات ÷ إجمالي الأصول',
      interpretation: this.interpretAssetTurnover(ratio),
      industryBenchmark: 1.5,
      evaluation: this.evaluateRatio(ratio, 1.5, 'higher'),
      recommendations: this.getRecommendationsAssetTurnover(ratio)
    };
  }

  // 9. معدل دوران الأصول الثابتة (Fixed Asset Turnover)
  fixedAssetTurnover(): RatioAnalysisResult {
    const ratio = this.data.incomeStatement.revenue / this.data.balanceSheet.propertyPlantEquipment;
    
    return {
      name: 'معدل دوران الأصول الثابتة',
      englishName: 'Fixed Asset Turnover',
      value: ratio,
      formula: 'المبيعات ÷ الأصول الثابتة',
      interpretation: this.interpretFixedAssetTurnover(ratio),
      industryBenchmark: 3.0,
      evaluation: this.evaluateRatio(ratio, 3.0, 'higher'),
      recommendations: this.getRecommendationsFixedAssetTurnover(ratio)
    };
  }

  // 10. دورة التحويل النقدي (Cash Conversion Cycle)
  cashConversionCycle(): RatioAnalysisResult {
    const daysInventory = 365 / (this.data.incomeStatement.costOfGoodsSold / this.data.balanceSheet.inventory);
    const daysReceivable = 365 / (this.data.incomeStatement.revenue / this.data.balanceSheet.accountsReceivable);
    const daysPayable = 365 / (this.data.incomeStatement.costOfGoodsSold / this.data.balanceSheet.accountsPayable);
    
    const cycle = daysInventory + daysReceivable - daysPayable;
    
    return {
      name: 'دورة التحويل النقدي',
      englishName: 'Cash Conversion Cycle',
      value: cycle,
      additionalMetrics: {
        daysInventory,
        daysReceivable,
        daysPayable
      },
      formula: 'أيام المخزون + أيام التحصيل - أيام السداد',
      interpretation: this.interpretCashConversionCycle(cycle),
      industryBenchmark: 45,
      evaluation: this.evaluateRatio(cycle, 45, 'lower'),
      recommendations: this.getRecommendationsCashConversionCycle(cycle)
    };
  }

  /**
   * نسب الربحية (Profitability Ratios)
   */
  
  // 11. هامش الربح الإجمالي (Gross Profit Margin)
  grossProfitMargin(): RatioAnalysisResult {
    const ratio = (this.data.incomeStatement.grossProfit / this.data.incomeStatement.revenue) * 100;
    
    return {
      name: 'هامش الربح الإجمالي',
      englishName: 'Gross Profit Margin',
      value: ratio,
      unit: '%',
      formula: '(الربح الإجمالي ÷ المبيعات) × 100',
      interpretation: this.interpretGrossProfitMargin(ratio),
      industryBenchmark: 30,
      evaluation: this.evaluateRatio(ratio, 30, 'higher'),
      recommendations: this.getRecommendationsGrossProfitMargin(ratio)
    };
  }

  // 12. هامش الربح التشغيلي (Operating Profit Margin)
  operatingProfitMargin(): RatioAnalysisResult {
    const ratio = (this.data.incomeStatement.operatingIncome / this.data.incomeStatement.revenue) * 100;
    
    return {
      name: 'هامش الربح التشغيلي',
      englishName: 'Operating Profit Margin',
      value: ratio,
      unit: '%',
      formula: '(الربح التشغيلي ÷ المبيعات) × 100',
      interpretation: this.interpretOperatingProfitMargin(ratio),
      industryBenchmark: 15,
      evaluation: this.evaluateRatio(ratio, 15, 'higher'),
      recommendations: this.getRecommendationsOperatingProfitMargin(ratio)
    };
  }

  // 13. هامش الربح الصافي (Net Profit Margin)
  netProfitMargin(): RatioAnalysisResult {
    const ratio = (this.data.incomeStatement.netIncome / this.data.incomeStatement.revenue) * 100;
    
    return {
      name: 'هامش الربح الصافي',
      englishName: 'Net Profit Margin',
      value: ratio,
      unit: '%',
      formula: '(صافي الربح ÷ المبيعات) × 100',
      interpretation: this.interpretNetProfitMargin(ratio),
      industryBenchmark: 10,
      evaluation: this.evaluateRatio(ratio, 10, 'higher'),
      recommendations: this.getRecommendationsNetProfitMargin(ratio)
    };
  }

  // 14. العائد على الأصول (Return on Assets - ROA)
  returnOnAssets(): RatioAnalysisResult {
    const ratio = (this.data.incomeStatement.netIncome / this.data.balanceSheet.totalAssets) * 100;
    
    return {
      name: 'العائد على الأصول',
      englishName: 'Return on Assets (ROA)',
      value: ratio,
      unit: '%',
      formula: '(صافي الربح ÷ إجمالي الأصول) × 100',
      interpretation: this.interpretROA(ratio),
      industryBenchmark: 8,
      evaluation: this.evaluateRatio(ratio, 8, 'higher'),
      recommendations: this.getRecommendationsROA(ratio)
    };
  }

  // 15. العائد على حقوق الملكية (Return on Equity - ROE)
  returnOnEquity(): RatioAnalysisResult {
    const ratio = (this.data.incomeStatement.netIncome / this.data.balanceSheet.totalEquity) * 100;
    
    return {
      name: 'العائد على حقوق الملكية',
      englishName: 'Return on Equity (ROE)',
      value: ratio,
      unit: '%',
      formula: '(صافي الربح ÷ حقوق الملكية) × 100',
      interpretation: this.interpretROE(ratio),
      industryBenchmark: 15,
      evaluation: this.evaluateRatio(ratio, 15, 'higher'),
      recommendations: this.getRecommendationsROE(ratio)
    };
  }

  // 16. العائد على رأس المال المستثمر (Return on Invested Capital - ROIC)
  returnOnInvestedCapital(): RatioAnalysisResult {
    const investedCapital = this.data.balanceSheet.totalEquity + 
                           this.data.balanceSheet.longTermDebt;
    const nopat = this.data.incomeStatement.operatingIncome * (1 - this.data.taxRate);
    const ratio = (nopat / investedCapital) * 100;
    
    return {
      name: 'العائد على رأس المال المستثمر',
      englishName: 'Return on Invested Capital (ROIC)',
      value: ratio,
      unit: '%',
      formula: '(الربح التشغيلي بعد الضريبة ÷ رأس المال المستثمر) × 100',
      interpretation: this.interpretROIC(ratio),
      industryBenchmark: 12,
      evaluation: this.evaluateRatio(ratio, 12, 'higher'),
      recommendations: this.getRecommendationsROIC(ratio)
    };
  }

  // 17. ربحية السهم (Earnings Per Share - EPS)
  earningsPerShare(): RatioAnalysisResult {
    const ratio = this.data.incomeStatement.netIncome / this.data.sharesOutstanding;
    
    return {
      name: 'ربحية السهم',
      englishName: 'Earnings Per Share (EPS)',
      value: ratio,
      unit: 'ريال/سهم',
      formula: 'صافي الربح ÷ عدد الأسهم القائمة',
      interpretation: this.interpretEPS(ratio),
      industryBenchmark: null,
      evaluation: 'يعتمد على سعر السهم والصناعة',
      recommendations: this.getRecommendationsEPS(ratio)
    };
  }

  /**
   * نسب الرفع المالي (Leverage Ratios)
   */
  
  // 18. نسبة الدين إلى حقوق الملكية (Debt to Equity Ratio)
  debtToEquityRatio(): RatioAnalysisResult {
    const totalDebt = this.data.balanceSheet.shortTermDebt + this.data.balanceSheet.longTermDebt;
    const ratio = totalDebt / this.data.balanceSheet.totalEquity;
    
    return {
      name: 'نسبة الدين إلى حقوق الملكية',
      englishName: 'Debt to Equity Ratio',
      value: ratio,
      formula: 'إجمالي الديون ÷ حقوق الملكية',
      interpretation: this.interpretDebtToEquity(ratio),
      industryBenchmark: 1.0,
      evaluation: this.evaluateRatio(ratio, 1.0, 'lower'),
      recommendations: this.getRecommendationsDebtToEquity(ratio)
    };
  }

  // 19. نسبة الدين إلى الأصول (Debt to Assets Ratio)
  debtToAssetsRatio(): RatioAnalysisResult {
    const totalDebt = this.data.balanceSheet.shortTermDebt + this.data.balanceSheet.longTermDebt;
    const ratio = totalDebt / this.data.balanceSheet.totalAssets;
    
    return {
      name: 'نسبة الدين إلى الأصول',
      englishName: 'Debt to Assets Ratio',
      value: ratio,
      formula: 'إجمالي الديون ÷ إجمالي الأصول',
      interpretation: this.interpretDebtToAssets(ratio),
      industryBenchmark: 0.5,
      evaluation: this.evaluateRatio(ratio, 0.5, 'lower'),
      recommendations: this.getRecommendationsDebtToAssets(ratio)
    };
  }

  // 20. نسبة تغطية الفائدة (Interest Coverage Ratio)
  interestCoverageRatio(): RatioAnalysisResult {
    const ratio = this.data.incomeStatement.operatingIncome / this.data.incomeStatement.interestExpense;
    
    return {
      name: 'نسبة تغطية الفائدة',
      englishName: 'Interest Coverage Ratio',
      value: ratio,
      formula: 'الربح التشغيلي ÷ مصروف الفائدة',
      interpretation: this.interpretInterestCoverage(ratio),
      industryBenchmark: 3.0,
      evaluation: this.evaluateRatio(ratio, 3.0, 'higher'),
      recommendations: this.getRecommendationsInterestCoverage(ratio)
    };
  }

  // 21. نسبة خدمة الدين (Debt Service Coverage Ratio)
  debtServiceCoverageRatio(): RatioAnalysisResult {
    const ebitda = this.data.incomeStatement.operatingIncome + 
                   this.data.incomeStatement.depreciation + 
                   this.data.incomeStatement.amortization;
    const debtService = this.data.incomeStatement.interestExpense + 
                        this.data.cashFlowStatement.debtRepayment;
    const ratio = ebit
    const ratio = ebitda / debtService;
   
   return {
     name: 'نسبة خدمة الدين',
     englishName: 'Debt Service Coverage Ratio',
     value: ratio,
     formula: 'EBITDA ÷ (الفائدة + أقساط الدين)',
     interpretation: this.interpretDebtServiceCoverage(ratio),
     industryBenchmark: 1.25,
     evaluation: this.evaluateRatio(ratio, 1.25, 'higher'),
     recommendations: this.getRecommendationsDebtServiceCoverage(ratio)
   };
 }

 // 22. مضاعف حقوق الملكية (Equity Multiplier)
 equityMultiplier(): RatioAnalysisResult {
   const ratio = this.data.balanceSheet.totalAssets / this.data.balanceSheet.totalEquity;
   
   return {
     name: 'مضاعف حقوق الملكية',
     englishName: 'Equity Multiplier',
     value: ratio,
     formula: 'إجمالي الأصول ÷ حقوق الملكية',
     interpretation: this.interpretEquityMultiplier(ratio),
     industryBenchmark: 2.0,
     evaluation: this.evaluateRatio(ratio, 2.0, 'balanced'),
     recommendations: this.getRecommendationsEquityMultiplier(ratio)
   };
 }

 /**
  * نسب السوق (Market Ratios)
  */
 
 // 23. نسبة السعر إلى الربحية (Price to Earnings - P/E)
 priceToEarningsRatio(): RatioAnalysisResult {
   const eps = this.data.incomeStatement.netIncome / this.data.sharesOutstanding;
   const ratio = this.data.marketPrice / eps;
   
   return {
     name: 'نسبة السعر إلى الربحية',
     englishName: 'Price to Earnings Ratio (P/E)',
     value: ratio,
     formula: 'سعر السهم ÷ ربحية السهم',
     interpretation: this.interpretPE(ratio),
     industryBenchmark: 20,
     evaluation: this.evaluateRatio(ratio, 20, 'balanced'),
     recommendations: this.getRecommendationsPE(ratio)
   };
 }

 // 24. نسبة السعر إلى القيمة الدفترية (Price to Book - P/B)
 priceToBookRatio(): RatioAnalysisResult {
   const bookValuePerShare = this.data.balanceSheet.totalEquity / this.data.sharesOutstanding;
   const ratio = this.data.marketPrice / bookValuePerShare;
   
   return {
     name: 'نسبة السعر إلى القيمة الدفترية',
     englishName: 'Price to Book Ratio (P/B)',
     value: ratio,
     formula: 'سعر السهم ÷ القيمة الدفترية للسهم',
     interpretation: this.interpretPB(ratio),
     industryBenchmark: 3.0,
     evaluation: this.evaluateRatio(ratio, 3.0, 'balanced'),
     recommendations: this.getRecommendationsPB(ratio)
   };
 }

 // 25. نسبة السعر إلى المبيعات (Price to Sales - P/S)
 priceToSalesRatio(): RatioAnalysisResult {
   const salesPerShare = this.data.incomeStatement.revenue / this.data.sharesOutstanding;
   const ratio = this.data.marketPrice / salesPerShare;
   
   return {
     name: 'نسبة السعر إلى المبيعات',
     englishName: 'Price to Sales Ratio (P/S)',
     value: ratio,
     formula: 'سعر السهم ÷ المبيعات للسهم',
     interpretation: this.interpretPS(ratio),
     industryBenchmark: 2.0,
     evaluation: this.evaluateRatio(ratio, 2.0, 'balanced'),
     recommendations: this.getRecommendationsPS(ratio)
   };
 }

 // 26. عائد الأرباح الموزعة (Dividend Yield)
 dividendYield(): RatioAnalysisResult {
   const dividendPerShare = this.data.cashFlowStatement.dividendsPaid / this.data.sharesOutstanding;
   const ratio = (dividendPerShare / this.data.marketPrice) * 100;
   
   return {
     name: 'عائد الأرباح الموزعة',
     englishName: 'Dividend Yield',
     value: ratio,
     unit: '%',
     formula: '(الأرباح الموزعة للسهم ÷ سعر السهم) × 100',
     interpretation: this.interpretDividendYield(ratio),
     industryBenchmark: 3.0,
     evaluation: this.evaluateRatio(ratio, 3.0, 'balanced'),
     recommendations: this.getRecommendationsDividendYield(ratio)
   };
 }

 // 27. نسبة توزيع الأرباح (Dividend Payout Ratio)
 dividendPayoutRatio(): RatioAnalysisResult {
   const ratio = (this.data.cashFlowStatement.dividendsPaid / this.data.incomeStatement.netIncome) * 100;
   
   return {
     name: 'نسبة توزيع الأرباح',
     englishName: 'Dividend Payout Ratio',
     value: ratio,
     unit: '%',
     formula: '(الأرباح الموزعة ÷ صافي الربح) × 100',
     interpretation: this.interpretPayoutRatio(ratio),
     industryBenchmark: 40,
     evaluation: this.evaluateRatio(ratio, 40, 'balanced'),
     recommendations: this.getRecommendationsPayoutRatio(ratio)
   };
 }

 // 28. نسبة PEG (Price/Earnings to Growth)
 pegRatio(): RatioAnalysisResult {
   const peRatio = this.data.marketPrice / (this.data.incomeStatement.netIncome / this.data.sharesOutstanding);
   const growthRate = this.calculateEarningsGrowthRate();
   const ratio = peRatio / growthRate;
   
   return {
     name: 'نسبة PEG',
     englishName: 'PEG Ratio',
     value: ratio,
     additionalMetrics: {
       peRatio,
       growthRate
     },
     formula: 'نسبة السعر إلى الربحية ÷ معدل نمو الأرباح',
     interpretation: this.interpretPEG(ratio),
     industryBenchmark: 1.0,
     evaluation: this.evaluateRatio(ratio, 1.0, 'lower'),
     recommendations: this.getRecommendationsPEG(ratio)
   };
 }

 // 29. القيمة الدفترية للسهم (Book Value Per Share)
 bookValuePerShare(): RatioAnalysisResult {
   const ratio = this.data.balanceSheet.totalEquity / this.data.sharesOutstanding;
   
   return {
     name: 'القيمة الدفترية للسهم',
     englishName: 'Book Value Per Share',
     value: ratio,
     unit: 'ريال/سهم',
     formula: 'حقوق الملكية ÷ عدد الأسهم القائمة',
     interpretation: this.interpretBookValue(ratio),
     industryBenchmark: null,
     evaluation: 'قارن مع سعر السوق',
     recommendations: this.getRecommendationsBookValue(ratio)
   };
 }

 // 30. نسبة التدفق النقدي الحر إلى حقوق الملكية (FCF to Equity)
 freeCashFlowToEquity(): RatioAnalysisResult {
   const fcf = this.data.cashFlowStatement.operatingCashFlow - 
               this.data.cashFlowStatement.capitalExpenditures;
   const ratio = fcf / this.data.balanceSheet.totalEquity;
   
   return {
     name: 'نسبة التدفق النقدي الحر إلى حقوق الملكية',
     englishName: 'Free Cash Flow to Equity',
     value: ratio,
     formula: 'التدفق النقدي الحر ÷ حقوق الملكية',
     interpretation: this.interpretFCFtoEquity(ratio),
     industryBenchmark: 0.10,
     evaluation: this.evaluateRatio(ratio, 0.10, 'higher'),
     recommendations: this.getRecommendationsFCFtoEquity(ratio)
   };
 }

 /**
  * تحليل جميع النسب المالية
  */
 analyzeAllRatios(): any {
   return {
     liquidityRatios: {
       currentRatio: this.currentRatio(),
       quickRatio: this.quickRatio(),
       cashRatio: this.cashRatio(),
       operatingCashFlowRatio: this.operatingCashFlowRatio()
     },
     activityRatios: {
       inventoryTurnover: this.inventoryTurnover(),
       receivablesTurnover: this.receivablesTurnover(),
       payablesTurnover: this.payablesTurnover(),
       assetTurnover: this.assetTurnover(),
       fixedAssetTurnover: this.fixedAssetTurnover(),
       cashConversionCycle: this.cashConversionCycle()
     },
     profitabilityRatios: {
       grossProfitMargin: this.grossProfitMargin(),
       operatingProfitMargin: this.operatingProfitMargin(),
       netProfitMargin: this.netProfitMargin(),
       returnOnAssets: this.returnOnAssets(),
       returnOnEquity: this.returnOnEquity(),
       returnOnInvestedCapital: this.returnOnInvestedCapital(),
       earningsPerShare: this.earningsPerShare()
     },
     leverageRatios: {
       debtToEquityRatio: this.debtToEquityRatio(),
       debtToAssetsRatio: this.debtToAssetsRatio(),
       interestCoverageRatio: this.interestCoverageRatio(),
       debtServiceCoverageRatio: this.debtServiceCoverageRatio(),
       equityMultiplier: this.equityMultiplier()
     },
     marketRatios: {
       priceToEarningsRatio: this.priceToEarningsRatio(),
       priceToBookRatio: this.priceToBookRatio(),
       priceToSalesRatio: this.priceToSalesRatio(),
       dividendYield: this.dividendYield(),
       dividendPayoutRatio: this.dividendPayoutRatio(),
       pegRatio: this.pegRatio(),
       bookValuePerShare: this.bookValuePerShare(),
       freeCashFlowToEquity: this.freeCashFlowToEquity()
     }
   };
 }

 // Helper Methods
 private evaluateRatio(value: number, benchmark: number, direction: 'higher' | 'lower' | 'balanced'): string {
   if (direction === 'higher') {
     if (value > benchmark * 1.2) return 'ممتاز';
     if (value > benchmark) return 'جيد';
     if (value > benchmark * 0.8) return 'مقبول';
     return 'ضعيف';
   } else if (direction === 'lower') {
     if (value < benchmark * 0.8) return 'ممتاز';
     if (value < benchmark) return 'جيد';
     if (value < benchmark * 1.2) return 'مقبول';
     return 'ضعيف';
   } else {
     const deviation = Math.abs(value - benchmark) / benchmark;
     if (deviation < 0.1) return 'ممتاز';
     if (deviation < 0.2) return 'جيد';
     if (deviation < 0.3) return 'مقبول';
     return 'يحتاج مراجعة';
   }
 }

 private interpretCurrentRatio(ratio: number): string {
   if (ratio > 2.5) return 'سيولة مرتفعة جداً قد تشير إلى عدم كفاءة في استخدام الأصول';
   if (ratio > 1.5) return 'سيولة جيدة تشير إلى قدرة الشركة على سداد التزاماتها قصيرة الأجل';
   if (ratio > 1) return 'سيولة مقبولة ولكن تحتاج لمراقبة';
   return 'سيولة ضعيفة قد تواجه الشركة صعوبات في سداد التزاماتها';
 }

 private getRecommendationsCurrentRatio(ratio: number): string[] {
   const recommendations = [];
   if (ratio > 3) {
     recommendations.push('النظر في استثمار الفائض من الأصول المتداولة');
     recommendations.push('تحسين إدارة رأس المال العامل');
   }
   if (ratio < 1.5) {
     recommendations.push('تحسين تحصيل الذمم المدينة');
     recommendations.push('إعادة جدولة الديون قصيرة الأجل');
     recommendations.push('زيادة رأس المال العامل');
   }
   return recommendations;
 }

 private interpretQuickRatio(ratio: number): string {
   if (ratio > 1.5) return 'قدرة ممتازة على سداد الالتزامات دون الاعتماد على بيع المخزون';
   if (ratio > 1) return 'وضع سيولة جيد';
   if (ratio > 0.8) return 'قد تحتاج الشركة لبيع بعض المخزون لسداد التزاماتها';
   return 'وضع سيولة حرج يتطلب اهتماماً فورياً';
 }

 private getRecommendationsQuickRatio(ratio: number): string[] {
   const recommendations = [];
   if (ratio < 1) {
     recommendations.push('تسريع تحصيل الذمم المدينة');
     recommendations.push('التفاوض على شروط دفع أفضل مع الموردين');
     recommendations.push('النظر في بيع الأصول غير المنتجة');
   }
   return recommendations;
 }

 private interpretCashRatio(ratio: number): string {
   if (ratio > 0.5) return 'مستوى نقدية ممتاز';
   if (ratio > 0.2) return 'مستوى نقدية صحي';
   if (ratio > 0.1) return 'مستوى نقدية مقبول';
   return 'مستوى نقدية منخفض قد يؤثر على العمليات اليومية';
 }

 private getRecommendationsCashRatio(ratio: number): string[] {
   const recommendations = [];
   if (ratio < 0.2) {
     recommendations.push('وضع خطة لزيادة الاحتياطي النقدي');
     recommendations.push('تحسين دورة التحويل النقدي');
   }
   if (ratio > 1) {
     recommendations.push('استثمار الفائض النقدي في أصول منتجة');
   }
   return recommendations;
 }

 private interpretOCFRatio(ratio: number): string {
   if (ratio > 0.5) return 'تدفقات نقدية تشغيلية قوية';
   if (ratio > 0.2) return 'تدفقات نقدية كافية';
   return 'تدفقات نقدية ضعيفة تحتاج لتحسين';
 }

 private getRecommendationsOCFRatio(ratio: number): string[] {
   const recommendations = [];
   if (ratio < 0.2) {
     recommendations.push('تحسين كفاءة العمليات التشغيلية');
     recommendations.push('مراجعة سياسات الائتمان والتحصيل');
   }
   return recommendations;
 }

 private interpretInventoryTurnover(ratio: number, days: number): string {
   return `المخزون يدور ${ratio.toFixed(2)} مرة سنوياً، أي كل ${days.toFixed(0)} يوم`;
 }

 private getRecommendationsInventoryTurnover(ratio: number): string[] {
   const recommendations = [];
   if (ratio < 6) {
     recommendations.push('تحسين إدارة المخزون لتجنب التقادم');
     recommendations.push('مراجعة سياسات الشراء والتخزين');
   }
   if (ratio > 20) {
     recommendations.push('التأكد من توفر مخزون كافٍ لتلبية الطلب');
   }
   return recommendations;
 }

 private interpretReceivablesTurnover(ratio: number, days: number): string {
   return `الذمم المدينة تُحصل ${ratio.toFixed(2)} مرة سنوياً، أي كل ${days.toFixed(0)} يوم`;
 }

 private getRecommendationsReceivablesTurnover(ratio: number): string[] {
   const recommendations = [];
   if (ratio < 12) {
     recommendations.push('تحسين سياسات الائتمان والتحصيل');
     recommendations.push('النظر في خصومات الدفع المبكر');
   }
   return recommendations;
 }

 private interpretPayablesTurnover(ratio: number, days: number): string {
   return `الذمم الدائنة تُسدد ${ratio.toFixed(2)} مرة سنوياً، أي كل ${days.toFixed(0)} يوم`;
 }

 private getRecommendationsPayablesTurnover(ratio: number): string[] {
   const recommendations = [];
   if (ratio > 20) {
     recommendations.push('الاستفادة من شروط الائتمان المتاحة من الموردين');
   }
   return recommendations;
 }

 private interpretAssetTurnover(ratio: number): string {
   return `كل ريال من الأصول يولد ${ratio.toFixed(2)} ريال من المبيعات`;
 }

 private getRecommendationsAssetTurnover(ratio: number): string[] {
   const recommendations = [];
   if (ratio < 1) {
     recommendations.push('تحسين كفاءة استخدام الأصول');
     recommendations.push('التخلص من الأصول غير المنتجة');
   }
   return recommendations;
 }

 private interpretFixedAssetTurnover(ratio: number): string {
   return `كفاءة استخدام الأصول الثابتة ${ratio > 3 ? 'جيدة' : 'تحتاج لتحسين'}`;
 }

 private getRecommendationsFixedAssetTurnover(ratio: number): string[] {
   const recommendations = [];
   if (ratio < 2) {
     recommendations.push('مراجعة الاستثمارات في الأصول الثابتة');
     recommendations.push('تحسين استغلال الطاقة الإنتاجية');
   }
   return recommendations;
 }

 private interpretCashConversionCycle(cycle: number): string {
   if (cycle < 30) return 'دورة تحويل نقدي ممتازة';
   if (cycle < 60) return 'دورة تحويل نقدي جيدة';
   if (cycle < 90) return 'دورة تحويل نقدي مقبولة';
   return 'دورة تحويل نقدي طويلة تحتاج لتحسين';
 }

 private getRecommendationsCashConversionCycle(cycle: number): string[] {
   const recommendations = [];
   if (cycle > 60) {
     recommendations.push('تقليل فترة الاحتفاظ بالمخزون');
     recommendations.push('تسريع تحصيل الذمم المدينة');
     recommendations.push('التفاوض على شروط دفع أفضل مع الموردين');
   }
   return recommendations;
 }

 private interpretGrossProfitMargin(margin: number): string {
   if (margin > 40) return 'هامش ربح إجمالي ممتاز';
   if (margin > 25) return 'هامش ربح إجمالي جيد';
   if (margin > 15) return 'هامش ربح إجمالي مقبول';
   return 'هامش ربح إجمالي ضعيف';
 }

 private getRecommendationsGrossProfitMargin(margin: number): string[] {
   const recommendations = [];
   if (margin < 25) {
     recommendations.push('مراجعة استراتيجية التسعير');
     recommendations.push('تحسين كفاءة الإنتاج وخفض التكاليف');
     recommendations.push('التفاوض مع الموردين للحصول على أسعار أفضل');
   }
   return recommendations;
 }

 private interpretOperatingProfitMargin(margin: number): string {
   if (margin > 20) return 'كفاءة تشغيلية ممتازة';
   if (margin > 10) return 'كفاءة تشغيلية جيدة';
   if (margin > 5) return 'كفاءة تشغيلية مقبولة';
   return 'كفاءة تشغيلية ضعيفة';
 }

 private getRecommendationsOperatingProfitMargin(margin: number): string[] {
   const recommendations = [];
   if (margin < 10) {
     recommendations.push('مراجعة وتخفيض المصروفات التشغيلية');
     recommendations.push('تحسين الكفاءة الإدارية');
     recommendations.push('أتمتة العمليات حيثما أمكن');
   }
   return recommendations;
 }

 private interpretNetProfitMargin(margin: number): string {
   if (margin > 15) return 'ربحية صافية ممتازة';
   if (margin > 8) return 'ربحية صافية جيدة';
   if (margin > 3) return 'ربحية صافية مقبولة';
   return 'ربحية صافية ضعيفة';
 }

 private getRecommendationsNetProfitMargin(margin: number): string[] {
   const recommendations = [];
   if (margin < 5) {
     recommendations.push('وضع خطة شاملة لتحسين الربحية');
     recommendations.push('مراجعة هيكل التكاليف بالكامل');
     recommendations.push('تحسين إدارة الديون وتكاليف التمويل');
   }
   return recommendations;
 }

 private interpretROA(roa: number): string {
   if (roa > 15) return 'استخدام ممتاز للأصول';
   if (roa > 8) return 'استخدام جيد للأصول';
   if (roa > 3) return 'استخدام مقبول للأصول';
   return 'استخدام ضعيف للأصول';
 }

 private getRecommendationsROA(roa: number): string[] {
   const recommendations = [];
   if (roa < 5) {
     recommendations.push('تحسين كفاءة استخدام الأصول');
     recommendations.push('زيادة الإيرادات من الأصول الحالية');
     recommendations.push('التخلص من الأصول غير المربحة');
   }
   return recommendations;
 }

 private interpretROE(roe: number): string {
   if (roe > 20) return 'عائد ممتاز للمساهمين';
   if (roe > 15) return 'عائد جيد للمساهمين';
   if (roe > 10) return 'عائد مقبول للمساهمين';
   return 'عائد ضعيف للمساهمين';
 }

 private getRecommendationsROE(roe: number): string[] {
   const recommendations = [];
   if (roe < 10) {
     recommendations.push('تحسين الربحية الإجمالية');
     recommendations.push('النظر في إعادة هيكلة رأس المال');
     recommendations.push('تحسين كفاءة العمليات');
   }
   return recommendations;
 }

 private interpretROIC(roic: number): string {
   if (roic > 15) return 'عائد ممتاز على رأس المال المستثمر';
   if (roic > 10) return 'عائد جيد على رأس المال المستثمر';
   if (roic > 5) return 'عائد مقبول على رأس المال المستثمر';
   return 'عائد ضعيف على رأس المال المستثمر';
 }

 private getRecommendationsROIC(roic: number): string[] {
   const recommendations = [];
   if (roic < 10) {
     recommendations.push('التركيز على المشاريع ذات العائد المرتفع');
     recommendations.push('تحسين تخصيص رأس المال');
   }
   return recommendations;
 }

 private interpretEPS(eps: number): string {
   return `ربحية السهم ${eps.toFixed(2)} ريال`;
 }

 private getRecommendationsEPS(eps: number): string[] {
   return ['مقارنة مع نمو الأرباح التاريخي', 'تقييم استدامة الأرباح'];
 }

 private interpretDebtToEquity(ratio: number): string {
   if (ratio < 0.5) return 'هيكل رأس مال محافظ';
   if (ratio < 1) return 'هيكل رأس مال متوازن';
   if (ratio < 2) return 'اعتماد معتدل على الديون';
   return 'اعتماد كبير على الديون';
 }

 private getRecommendationsDebtToEquity(ratio: number): string[] {
   const recommendations = [];
   if (ratio > 1.5) {
     recommendations.push('النظر في تخفيض مستوى الديون');
     recommendations.push('تعزيز حقوق الملكية');
   }
   return recommendations;
 }

 private interpretDebtToAssets(ratio: number): string {
   if (ratio < 0.3) return 'مستوى دين منخفض وآمن';
   if (ratio < 0.5) return 'مستوى دين معتدل';
   if (ratio < 0.7) return 'مستوى دين مرتفع نسبياً';
   return 'مستوى دين مرتفع جداً';
 }

 private getRecommendationsDebtToAssets(ratio: number): string[] {
   const recommendations = [];
   if (ratio > 0.6) {
     recommendations.push('وضع خطة لتخفيض الديون');
     recommendations.push('تحسين جودة الأصول');
   }
   return recommendations;
 }

 private interpretInterestCoverage(ratio: number): string {
   if (ratio > 5) return 'قدرة ممتازة على خدمة الديون';
   if (ratio > 3) return 'قدرة جيدة على خدمة الديون';
   if (ratio > 1.5) return 'قدرة مقبولة على خدمة الديون';
   return 'صعوبة في خدمة الديون';
 }

 private getRecommendationsInterestCoverage(ratio: number): string[] {
   const recommendations = [];
   if (ratio < 2) {
     recommendations.push('تحسين الربحية التشغيلية');
     recommendations.push('إعادة هيكلة الديون');
     recommendations.push('البحث عن مصادر تمويل بتكلفة أقل');
   }
   return recommendations;
 }

 private interpretDebtServiceCoverage(ratio: number): string {
   if (ratio > 1.5) return 'قدرة قوية على سداد الديون';
   if (ratio > 1.25) return 'قدرة كافية على سداد الديون';
   if (ratio > 1) return 'قدرة محدودة على سداد الديون';
   return 'خطر عدم القدرة على سداد الديون';
 }

 private getRecommendationsDebtServiceCoverage(ratio: number): string[] {
   const recommendations = [];
   if (ratio < 1.25) {
     recommendations.push('تحسين التدفقات النقدية التشغيلية');
     recommendations.push('إعادة جدولة الديون');
   }
   return recommendations;
 }

 private interpretEquityMultiplier(ratio: number): string {
   const leverage = ratio - 1;
   return `الشركة تستخدم ${leverage.toFixed(2)} ريال من الأصول الممولة بالديون لكل ريال من حقوق الملكية`;
 }

 private getRecommendationsEquityMultiplier(ratio: number): string[] {
   const recommendations = [];
   if (ratio > 3) {
     recommendations.push('مراجعة مستوى الرفع المالي');
   }
   return recommendations;
 }

 private interpretPE(ratio: number): string {
   if (ratio < 10) return 'السهم مقيم بأقل من قيمته أو نمو ضعيف';
   if (ratio < 20) return 'تقييم معقول للسهم';
   if (ratio < 30) return 'توقعات نمو عالية';
   return 'السهم مقيم بأعلى من قيمته أو توقعات نمو استثنائية';
 }

 private getRecommendationsPE(ratio: number): string[] {
   const recommendations = [];
   if (ratio > 30) {
     recommendations.push('التأكد من استدامة معدلات النمو المتوقعة');
   }
   if (ratio < 10) {
     recommendations.push('البحث عن أسباب التقييم المنخفض');
   }
   return recommendations;
 }

 private interpretPB(ratio: number): string {
   if (ratio < 1) return 'السهم يتداول أقل من القيمة الدفترية';
   if (ratio < 3) return 'تقييم معقول مقابل القيمة الدفترية';
   return 'السهم يتداول بعلاوة كبيرة على القيمة الدفترية';
 }

 private getRecommendationsPB(ratio: number): string[] {
   const recommendations = [];
   if (ratio < 1) {
     recommendations.push('التحقق من جودة الأصول وعدم وجود مشاكل خفية');
   }
   return recommendations;
 }

 private interpretPS(ratio: number): string {
   if (ratio < 1) return 'تقييم منخفض مقابل المبيعات';
   if (ratio < 2) return 'تقييم معقول مقابل المبيعات';
   return 'تقييم مرتفع مقابل المبيعات';
 }

 private getRecommendationsPS(ratio: number): string[] {
   const recommendations = [];
   if (ratio > 3) {
     recommendations.push('التأكد من قدرة الشركة على تحويل المبيعات لأرباح');
   }
   return recommendations;
 }

 private interpretDividendYield(yield: number): string {
   if (yield > 5) return 'عائد توزيعات مرتفع';
   if (yield > 3) return 'عائد توزيعات جيد';
   if (yield > 1) return 'عائد توزيعات معتدل';
   return 'عائد توزيعات منخفض';
 }

 private getRecommendationsDividendYield(yield: number): string[] {
   const recommendations = [];
   if (yield > 7) {
     recommendations.push('التحقق من استدامة التوزيعات');
   }
   return recommendations;
 }

 private interpretPayoutRatio(ratio: number): string {
   if (ratio < 30) return 'الشركة تحتفظ بمعظم أرباحها للنمو';
   if (ratio < 60) return 'توازن جيد بين التوزيعات والنمو';
   if (ratio < 80) return 'توزيعات سخية';
   return 'نسبة توزيع عالية جداً قد تؤثر على النمو';
 }

 private getRecommendationsPayoutRatio(ratio: number): string[] {
   const recommendations = [];
   if (ratio > 80) {
     recommendations.push('مراجعة سياسة التوزيعات');
     recommendations.push('التأكد من توفر السيولة الكافية للنمو');
   }
   return recommendations;
 }

 private interpretPEG(ratio: number): string {
   if (ratio < 1) return 'السهم مقيم بأقل من قيمته نسبة للنمو';
   if (ratio < 1.5) return 'تقييم عادل نسبة للنمو';
   return 'السهم مقيم بأعلى من قيمته نسبة للنمو';
 }

 private getRecommendationsPEG(ratio: number): string[] {
   const recommendations = [];
   if (ratio > 2) {
     recommendations.push('إعادة تقييم توقعات النمو');
   }
   return recommendations;
 }

 private interpretBookValue(value: number): string {
   return `القيمة الدفترية للسهم ${value.toFixed(2)} ريال`;
 }

 private getRecommendationsBookValue(value: number): string[] {
   return ['مقارنة مع سعر السوق الحالي', 'تقييم جودة الأصول'];
 }

 private interpretFCFtoEquity(ratio: number): string {
   if (ratio > 0.15) return 'توليد نقدي حر قوي';
   if (ratio > 0.05) return 'توليد نقدي حر جيد';
   return 'توليد نقدي حر ضعيف';
 }

 private getRecommendationsFCFtoEquity(ratio: number): string[] {
   const recommendations = [];
   if (ratio < 0.05) {
     recommendations.push('تحسين كفاءة رأس المال العامل');
     recommendations.push('مراجعة الاستثمارات الرأسمالية');
   }
   return recommendations;
 }

 private calculateEarningsGrowthRate(): number {
   // حساب معدل نمو الأرباح من البيانات التاريخية
   const currentEPS = this.data.incomeStatement.netIncome / this.data.sharesOutstanding;
   const previousEPS = this.data.previousYearIncomeStatement.netIncome / this.data.sharesOutstanding;
   return ((currentEPS - previousEPS) / previousEPS) * 100;
 }
}
