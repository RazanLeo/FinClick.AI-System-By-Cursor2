import { FinancialStatement, AnalysisResult, AnalysisType, AnalysisCategory } from '@/lib/types';
import { formatNumber, getRatingFromScore, getScoreFromRatio } from '@/lib/utils/helpers';

interface FinancialRatio {
  name: string;
  nameEn: string;
  value: number;
  formula: string;
  interpretation: string;
  benchmark?: number;
  rating: string;
}

// Calculate all 30 financial ratios
export async function calculateAllFinancialRatios(
  statements: FinancialStatement[],
  benchmarks: any
): Promise<AnalysisResult[]> {
  const latestStatement = statements[statements.length - 1];
  const results: AnalysisResult[] = [];
  
  // Calculate each ratio category
  const liquidityRatios = calculateLiquidityRatios(latestStatement, benchmarks);
  const activityRatios = calculateActivityRatios(latestStatement, benchmarks);
  const leverageRatios = calculateLeverageRatios(latestStatement, benchmarks);
  const profitabilityRatios = calculateProfitabilityRatios(latestStatement, benchmarks);
  const marketRatios = calculateMarketRatios(latestStatement, benchmarks);
  
  // Convert to AnalysisResult format
  [...liquidityRatios, ...activityRatios, ...leverageRatios, ...profitabilityRatios, ...marketRatios]
    .forEach(ratio => {
      results.push(convertRatioToAnalysisResult(ratio, benchmarks));
    });
  
  return results;
}

// Liquidity Ratios (5 ratios)
function calculateLiquidityRatios(statement: FinancialStatement, benchmarks: any): FinancialRatio[] {
  const { balanceSheet, cashFlowStatement } = statement;
  const ratios: FinancialRatio[] = [];
  
  // 1. Current Ratio
  const currentRatio = balanceSheet.currentAssets.totalCurrentAssets / 
                      (balanceSheet.currentLiabilities.totalCurrentLiabilities || 1);
  ratios.push({
    name: 'النسبة الجارية',
    nameEn: 'Current Ratio',
    value: currentRatio,
    formula: 'الأصول المتداولة ÷ الخصوم المتداولة',
    interpretation: interpretCurrentRatio(currentRatio),
    benchmark: benchmarks?.currentRatio || 2.0,
    rating: getRatingFromCurrentRatio(currentRatio)
  });
  
  // 2. Quick Ratio
  const quickAssets = balanceSheet.currentAssets.totalCurrentAssets - 
                     balanceSheet.currentAssets.inventory;
  const quickRatio = quickAssets / (balanceSheet.currentLiabilities.totalCurrentLiabilities || 1);
  ratios.push({
    name: 'النسبة السريعة',
    nameEn: 'Quick Ratio',
    value: quickRatio,
    formula: '(الأصول المتداولة - المخزون) ÷ الخصوم المتداولة',
    interpretation: interpretQuickRatio(quickRatio),
    benchmark: benchmarks?.quickRatio || 1.0,
    rating: getRatingFromQuickRatio(quickRatio)
  });
  
  // 3. Cash Ratio
  const cashRatio = balanceSheet.currentAssets.cash / 
                   (balanceSheet.currentLiabilities.totalCurrentLiabilities || 1);
  ratios.push({
    name: 'نسبة النقد',
    nameEn: 'Cash Ratio',
    value: cashRatio,
    formula: 'النقد ÷ الخصوم المتداولة',
    interpretation: interpretCashRatio(cashRatio),
    benchmark: benchmarks?.cashRatio || 0.2,
    rating: getRatingFromCashRatio(cashRatio)
  });
  
  // 4. Operating Cash Flow Ratio
  const operatingCashFlowRatio = cashFlowStatement.operatingActivities.netCashFromOperating /
                                (balanceSheet.currentLiabilities.totalCurrentLiabilities || 1);
  ratios.push({
    name: 'نسبة التدفق النقدي التشغيلي',
    nameEn: 'Operating Cash Flow Ratio',
    value: operatingCashFlowRatio,
    formula: 'التدفق النقدي التشغيلي ÷ الخصوم المتداولة',
    interpretation: interpretOperatingCashFlowRatio(operatingCashFlowRatio),
    benchmark: benchmarks?.operatingCashFlowRatio || 0.5,
    rating: getRatingFromOperatingCashFlowRatio(operatingCashFlowRatio)
  });
  
  // 5. Working Capital Ratio
  const workingCapital = balanceSheet.currentAssets.totalCurrentAssets - 
                        balanceSheet.currentLiabilities.totalCurrentLiabilities;
  const workingCapitalRatio = workingCapital / balanceSheet.totalAssets;
  ratios.push({
    name: 'نسبة رأس المال العامل',
    nameEn: 'Working Capital Ratio',
    value: workingCapitalRatio,
    formula: 'رأس المال العامل ÷ إجمالي الأصول',
    interpretation: interpretWorkingCapitalRatio(workingCapitalRatio),
    benchmark: benchmarks?.workingCapitalRatio || 0.2,
    rating: getRatingFromWorkingCapitalRatio(workingCapitalRatio)
  });
  
  return ratios;
}

// Activity/Efficiency Ratios (9 ratios)
function calculateActivityRatios(statement: FinancialStatement, benchmarks: any): FinancialRatio[] {
  const { balanceSheet, incomeStatement } = statement;
  const ratios: FinancialRatio[] = [];
  
  // 6. Inventory Turnover
  const inventoryTurnover = incomeStatement.costOfGoodsSold / 
                           (balanceSheet.currentAssets.inventory || 1);
  ratios.push({
    name: 'معدل دوران المخزون',
    nameEn: 'Inventory Turnover',
    value: inventoryTurnover,
    formula: 'تكلفة البضاعة المباعة ÷ المخزون',
    interpretation: interpretInventoryTurnover(inventoryTurnover),
    benchmark: benchmarks?.inventoryTurnover || 6,
    rating: getRatingFromInventoryTurnover(inventoryTurnover)
  });
  
  // 7. Receivables Turnover
  const receivablesTurnover = incomeStatement.revenue / 
                             (balanceSheet.currentAssets.accountsReceivable || 1);
  ratios.push({
    name: 'معدل دوران الذمم المدينة',
    nameEn: 'Receivables Turnover',
    value: receivablesTurnover,
    formula: 'الإيرادات ÷ الذمم المدينة',
    interpretation: interpretReceivablesTurnover(receivablesTurnover),
    benchmark: benchmarks?.receivablesTurnover || 10,
    rating: getRatingFromReceivablesTurnover(receivablesTurnover)
  });
  
  // 8. Days Receivable
  const daysReceivable = 365 / receivablesTurnover;
  ratios.push({
    name: 'فترة تحصيل الذمم المدينة',
    nameEn: 'Days Receivable',
    value: daysReceivable,
    formula: '365 ÷ معدل دوران الذمم المدينة',
    interpretation: interpretDaysReceivable(daysReceivable),
    benchmark: benchmarks?.daysReceivable || 36,
    rating: getRatingFromDaysReceivable(daysReceivable)
  });
  
  // 9. Payables Turnover
  const payablesTurnover = incomeStatement.costOfGoodsSold / 
                          (balanceSheet.currentLiabilities.accountsPayable || 1);
  ratios.push({
    name: 'معدل دوران الذمم الدائنة',
    nameEn: 'Payables Turnover',
    value: payablesTurnover,
    formula: 'تكلفة البضاعة المباعة ÷ الذمم الدائنة',
    interpretation: interpretPayablesTurnover(payablesTurnover),
    benchmark: benchmarks?.payablesTurnover || 12,
    rating: getRatingFromPayablesTurnover(payablesTurnover)
  });
  
  // 10. Days Payable
  const daysPayable = 365 / payablesTurnover;
  ratios.push({
    name: 'فترة سداد الذمم الدائنة',
    nameEn: 'Days Payable',
    value: daysPayable,
    formula: '365 ÷ معدل دوران الذمم الدائنة',
    interpretation: interpretDaysPayable(daysPayable),
    benchmark: benchmarks?.daysPayable || 30,
    rating: getRatingFromDaysPayable(daysPayable)
  });
  
  // 11. Fixed Asset Turnover
  const fixedAssetTurnover = incomeStatement.revenue / 
                            (balanceSheet.nonCurrentAssets.netPPE || 1);
  ratios.push({
    name: 'معدل دوران الأصول الثابتة',
    nameEn: 'Fixed Asset Turnover',
    value: fixedAssetTurnover,
    formula: 'الإيرادات ÷ صافي الأصول الثابتة',
    interpretation: interpretFixedAssetTurnover(fixedAssetTurnover),
    benchmark: benchmarks?.fixedAssetTurnover || 2,
    rating: getRatingFromFixedAssetTurnover(fixedAssetTurnover)
  });
  
  // 12. Total Asset Turnover
  const totalAssetTurnover = incomeStatement.revenue / balanceSheet.totalAssets;
  ratios.push({
    name: 'معدل دوران إجمالي الأصول',
    nameEn: 'Total Asset Turnover',
    value: totalAssetTurnover,
    formula: 'الإيرادات ÷ إجمالي الأصول',
    interpretation: interpretTotalAssetTurnover(totalAssetTurnover),
    benchmark: benchmarks?.totalAssetTurnover || 1,
    rating: getRatingFromTotalAssetTurnover(totalAssetTurnover)
  });
  
  // 13. Operating Cycle
  const daysInventory = 365 / inventoryTurnover;
  const operatingCycle = daysInventory + daysReceivable;
  ratios.push({
    name: 'دورة التشغيل',
    nameEn: 'Operating Cycle',
    value: operatingCycle,
    formula: 'فترة المخزون + فترة التحصيل',
    interpretation: interpretOperatingCycle(operatingCycle),
    benchmark: benchmarks?.operatingCycle || 90,
    rating: getRatingFromOperatingCycle(operatingCycle)
  });
  
  // 14. Cash Conversion Cycle
  const cashConversionCycle = operatingCycle - daysPayable;
  ratios.push({
    name: 'دورة التحويل النقدي',
    nameEn: 'Cash Conversion Cycle',
    value: cashConversionCycle,
    formula: 'دورة التشغيل - فترة السداد',
    interpretation: interpretCashConversionCycle(cashConversionCycle),
    benchmark: benchmarks?.cashConversionCycle || 60,
    rating: getRatingFromCashConversionCycle(cashConversionCycle)
  });
  
  return ratios;
}

// Leverage Ratios (5 ratios)
function calculateLeverageRatios(statement: FinancialStatement, benchmarks: any): FinancialRatio[] {
  const { balanceSheet, incomeStatement } = statement;
  const ratios: FinancialRatio[] = [];
  
  // 15. Debt to Assets
  const debtToAssets = balanceSheet.totalLiabilities / balanceSheet.totalAssets;
  ratios.push({
    name: 'نسبة الدين إلى الأصول',
    nameEn: 'Debt to Assets',
    value: debtToAssets,
    formula: 'إجمالي الخصوم ÷ إجمالي الأصول',
    interpretation: interpretDebtToAssets(debtToAssets),
    benchmark: benchmarks?.debtToAssets || 0.5,
    rating: getRatingFromDebtToAssets(debtToAssets)
  });
  
  // 16. Debt to Equity
  const debtToEquity = balanceSheet.totalLiabilities / 
                      (balanceSheet.shareholdersEquity.totalShareholdersEquity || 1);
  ratios.push({
    name: 'نسبة الدين إلى حقوق الملكية',
    nameEn: 'Debt to Equity',
    value: debtToEquity,
    formula: 'إجمالي الخصوم ÷ حقوق الملكية',
    interpretation: interpretDebtToEquity(debtToEquity),
    benchmark: benchmarks?.debtToEquity || 1,
    rating: getRatingFromDebtToEquity(debtToEquity)
  });
  
  // 17. Interest Coverage
  const interestExpense = incomeStatement.otherIncomeExpense?.interestExpense || 1;
  const interestCoverage = incomeStatement.operatingIncome / interestExpense;
  ratios.push({
    name: 'نسبة تغطية الفوائد',
    nameEn: 'Interest Coverage',
    value: interestCoverage,
    formula: 'الدخل التشغيلي ÷ مصروفات الفوائد',
    interpretation: interpretInterestCoverage(interestCoverage),
    benchmark: benchmarks?.interestCoverage || 3,
    rating: getRatingFromInterestCoverage(interestCoverage)
  });
  
  // 18. Debt Service Coverage
  const totalDebtService = interestExpense + (balanceSheet.currentLiabilities.currentPortionLongTermDebt || 0);
  const debtServiceCoverage = incomeStatement.operatingIncome / (totalDebtService || 1);
  ratios.push({
    name: 'نسبة تغطية خدمة الدين',
    nameEn: 'Debt Service Coverage',
    value: debtServiceCoverage,
    formula: 'الدخل التشغيلي ÷ خدمة الدين',
    interpretation: interpretDebtServiceCoverage(debtServiceCoverage),
    benchmark: benchmarks?.debtServiceCoverage || 1.25,
    rating: getRatingFromDebtServiceCoverage(debtServiceCoverage)
  });
  
  // 19. Equity Ratio
  const equityRatio = balanceSheet.shareholdersEquity.totalShareholdersEquity / balanceSheet.totalAssets;
  ratios.push({
    name: 'نسبة حقوق الملكية',
    nameEn: 'Equity Ratio',
    value: equityRatio,
    formula: 'حقوق الملكية ÷ إجمالي الأصول',
    interpretation: interpretEquityRatio(equityRatio),
    benchmark: benchmarks?.equityRatio || 0.5,
    rating: getRatingFromEquityRatio(equityRatio)
  });
  
  return ratios;
}

// Profitability Ratios (6 ratios)
function calculateProfitabilityRatios(statement: FinancialStatement, benchmarks: any): FinancialRatio[] {
  const { balanceSheet, incomeStatement } = statement;
  const ratios: FinancialRatio[] = [];
  
  // 20. Gross Profit Margin
  const grossProfitMargin = incomeStatement.grossProfit / incomeStatement.revenue;
  ratios.push({
    name: 'هامش الربح الإجمالي',
    nameEn: 'Gross Profit Margin',
    value: grossProfitMargin,
    formula: 'إجمالي الربح ÷ الإيرادات',
    interpretation: interpretGrossProfitMargin(grossProfitMargin),
    benchmark: benchmarks?.grossProfitMargin || 0.3,
    rating: getRatingFromGrossProfitMargin(grossProfitMargin)
  });
  
  // 21. Operating Profit Margin
  const operatingProfitMargin = incomeStatement.operatingIncome / incomeStatement.revenue;
  ratios.push({
    name: 'هامش الربح التشغيلي',
    nameEn: 'Operating Profit Margin',
    value: operatingProfitMargin,
    formula: 'الدخل التشغيلي ÷ الإيرادات',
    interpretation: interpretOperatingProfitMargin(operatingProfitMargin),
    benchmark: benchmarks?.operatingProfitMargin || 0.15,
    rating: getRatingFromOperatingProfitMargin(operatingProfitMargin)
  });
  
  // 22. Net Profit Margin
  const netProfitMargin = incomeStatement.netIncome / incomeStatement.revenue;
  ratios.push({
    name: 'هامش صافي الربح',
    nameEn: 'Net Profit Margin',
    value: netProfitMargin,
    formula: 'صافي الدخل ÷ الإيرادات',
    interpretation: interpretNetProfitMargin(netProfitMargin),
    benchmark: benchmarks?.netProfitMargin || 0.1,
    rating: getRatingFromNetProfitMargin(netProfitMargin)
  });
  
  // 23. Return on Assets (ROA)
  const returnOnAssets = incomeStatement.netIncome / balanceSheet.totalAssets;
  ratios.push({
    name: 'العائد على الأصول',
    nameEn: 'Return on Assets',
    value: returnOnAssets,
    formula: 'صافي الدخل ÷ إجمالي الأصول',
    interpretation: interpretROA(returnOnAssets),
    benchmark: benchmarks?.returnOnAssets || 0.05,
    rating: getRatingFromROA(returnOnAssets)
  });
  
  // 24. Return on Equity (ROE)
  const returnOnEquity = incomeStatement.netIncome / 
                        (balanceSheet.shareholdersEquity.totalShareholdersEquity || 1);
  ratios.push({
    name: 'العائد على حقوق الملكية',
    nameEn: 'Return on Equity',
    value: returnOnEquity,
    formula: 'صافي الدخل ÷ حقوق الملكية',
    interpretation: interpretROE(returnOnEquity),
    benchmark: benchmarks?.returnOnEquity || 0.15,
    rating: getRatingFromROE(returnOnEquity)
  });
  
  // 25. Return on Invested Capital (ROIC)
  const investedCapital = balanceSheet.shareholdersEquity.totalShareholdersEquity + 
                         balanceSheet.nonCurrentLiabilities.longTermDebt;
  const roic = incomeStatement.operatingIncome * (1 - 0.2) / investedCapital; // Assuming 20% tax rate
  ratios.push({
    name: 'العائد على رأس المال المستثمر',
    nameEn: 'Return on Invested Capital',
    value: roic,
    formula: 'الدخل التشغيلي بعد الضريبة ÷ رأس المال المستثمر',
    interpretation: interpretROIC(roic),
    benchmark: benchmarks?.roic || 0.12,
    rating: getRatingFromROIC(roic)
  });
  
  return ratios;
}

// Market/Valuation Ratios (5 ratios)
function calculateMarketRatios(statement: FinancialStatement, benchmarks: any): FinancialRatio[] {
  const { balanceSheet, incomeStatement } = statement;
  const ratios: FinancialRatio[] = [];
  
  // Note: These require market data which may not be available
  // Using placeholder calculations for demonstration
  
  // 26. Price to Earnings (P/E)
  const eps = incomeStatement.earningsPerShare || (incomeStatement.netIncome / 1000000); // Assume 1M shares
  const marketPrice = eps * 15; // Assume P/E of 15
  const priceEarnings = marketPrice / eps;
  ratios.push({
    name: 'نسبة السعر إلى الأرباح',
    nameEn: 'Price to Earnings Ratio',
    value: priceEarnings,
    formula: 'سعر السهم ÷ ربحية السهم',
    interpretation: interpretPE(priceEarnings),
    benchmark: benchmarks?.priceEarnings || 15,
    rating: getRatingFromPE(priceEarnings)
  });
  
  // 27. Price to Book (P/B)
  const bookValuePerShare = balanceSheet.shareholdersEquity.totalShareholdersEquity / 1000000;
  const priceToBook = marketPrice / bookValuePerShare;
  ratios.push({
    name: 'نسبة السعر إلى القيمة الدفترية',
    nameEn: 'Price to Book Ratio',
    value: priceToBook,
    formula: 'سعر السهم ÷ القيمة الدفترية للسهم',
    interpretation: interpretPB(priceToBook),
    benchmark: benchmarks?.priceToBook || 2,
    rating: getRatingFromPB(priceToBook)
  });
  
  // 28. Dividend Yield
  const dividends = statement.cashFlowStatement.financingActivities.dividendsPaid || 0;
  const dividendPerShare = Math.abs(dividends) / 1000000;
  const dividendYield = dividendPerShare / marketPrice;
  ratios.push({
    name: 'عائد التوزيعات',
    nameEn: 'Dividend Yield',
    value: dividendYield,
    formula: 'التوزيعات للسهم ÷ سعر السهم',
    interpretation: interpretDividendYield(dividendYield),
    benchmark: benchmarks?.dividendYield || 0.03,
    rating: getRatingFromDividendYield(dividendYield)
  });
  
  // 29. Earnings Per Share (EPS)
  ratios.push({
    name: 'ربحية السهم',
    nameEn: 'Earnings Per Share',
    value: eps,
    formula: 'صافي الدخل ÷ عدد الأسهم',
    interpretation: interpretEPS(eps),
    benchmark: benchmarks?.eps || 2,
    rating: getRatingFromEPS(eps)
  });
  
  // 30. Book Value Per Share
  ratios.push({
    name: 'القيمة الدفترية للسهم',
    nameEn: 'Book Value Per Share',
    value: bookValuePerShare,
    formula: 'حقوق الملكية ÷ عدد الأسهم',
    interpretation: interpretBookValue(bookValuePerShare),
    benchmark: benchmarks?.bookValuePerShare || 10,
    rating: getRatingFromBookValue(bookValuePerShare)
  });
  
  return ratios;
}

// Convert ratio to AnalysisResult format
function convertRatioToAnalysisResult(ratio: FinancialRatio, benchmarks: any): AnalysisResult {
  const typeMap: { [key: string]: AnalysisType } = {
    'النسبة الجارية': AnalysisType.CurrentRatio,
    'النسبة السريعة': AnalysisType.QuickRatio,
    'نسبة النقد': AnalysisType.CashRatio,
    // ... map all ratio names to types
  };
  
  return {
    id: ratio.nameEn.toLowerCase().replace(/\s+/g, '-'),
    type: typeMap[ratio.name] || AnalysisType.CurrentRatio,
    name: ratio.name,
    nameEn: ratio.nameEn,
    category: AnalysisCategory.FinancialRatios,
    definition: `نسبة مالية تقيس ${ratio.name}`,
    whatItMeasures: ratio.name,
    importance: `مؤشر مهم لقياس ${ratio.name}`,
    calculation: ratio.formula,
    result: ratio.value,
    interpretation: ratio.interpretation,
    industryAverage: ratio.benchmark,
    comparisonWithIndustry: ratio.benchmark 
      ? `${ratio.value > ratio.benchmark ? 'أعلى' : 'أقل'} من متوسط الصناعة بنسبة ${Math.abs((ratio.value - ratio.benchmark) / ratio.benchmark * 100).toFixed(1)}%`
      : 'لا يوجد معيار للمقارنة',
    rating: ratio.rating as any,
    recommendation: generateRatioRecommendation(ratio),
    charts: [{
      type: 'gauge' as const,
      data: {
        value: ratio.value,
        min: 0,
        max: ratio.benchmark ? ratio.benchmark * 2 : ratio.value * 2,
        target: ratio.benchmark
      }
    }]
  };
}

// Interpretation functions for each ratio
function interpretCurrentRatio(value: number): string {
  if (value >= 2) return 'سيولة ممتازة، الشركة قادرة على تغطية التزاماتها قصيرة الأجل بسهولة';
  if (value >= 1.5) return 'سيولة جيدة، الشركة في وضع مالي مستقر';
  if (value >= 1) return 'سيولة مقبولة، لكن قد تحتاج لتحسين';
  return 'سيولة ضعيفة، قد تواجه الشركة صعوبات في سداد التزاماتها';
}

function interpretQuickRatio(value: number): string {
  if (value >= 1) return 'قدرة ممتازة على سداد الالتزامات دون الاعتماد على المخزون';
  if (value >= 0.8) return 'قدرة جيدة على السداد السريع';
  if (value >= 0.5) return 'قدرة مقبولة لكن تحتاج مراقبة';
  return 'قدرة ضعيفة على السداد السريع، مخاطر سيولة محتملة';
}

function interpretCashRatio(value: number): string {
  if (value >= 0.5) return 'وضع نقدي قوي جداً';
  if (value >= 0.2) return 'وضع نقدي جيد';
  if (value >= 0.1) return 'وضع نقدي مقبول';
  return 'نقص في السيولة النقدية المباشرة';
}

function interpretOperatingCashFlowRatio(value: number): string {
  if (value >= 1) return 'تدفقات نقدية تشغيلية قوية تغطي الالتزامات';
  if (value >= 0.5) return 'تدفقات نقدية جيدة';
  if (value >= 0.2) return 'تدفقات نقدية مقبولة';
  return 'تدفقات نقدية ضعيفة قد تؤثر على السيولة';
}

function interpretWorkingCapitalRatio(value: number): string {
  if (value >= 0.3) return 'رأس مال عامل قوي';
  if (value >= 0.2) return 'رأس مال عامل جيد';
  if (value >= 0.1) return 'رأس مال عامل مقبول';
  return 'نقص في رأس المال العامل';
}

function interpretInventoryTurnover(value: number): string {
  if (value >= 12) return 'إدارة ممتازة للمخزون، دوران سريع جداً';
  if (value >= 6) return 'إدارة جيدة للمخزون';
  if (value >= 4) return 'إدارة مقبولة للمخزون';
  return 'بطء في دوران المخزون قد يؤدي لتكاليف إضافية';
}

function interpretReceivablesTurnover(value: number): string {
  if (value >= 12) return 'تحصيل ممتاز للذمم المدينة';
  if (value >= 8) return 'تحصيل جيد للذمم';
  if (value >= 6) return 'تحصيل مقبول';
  return 'بطء في التحصيل قد يؤثر على السيولة';
}

function interpretDaysReceivable(value: number): string {
  if (value <= 30) return 'فترة تحصيل ممتازة';
  if (value <= 45) return 'فترة تحصيل جيدة';
  if (value <= 60) return 'فترة تحصيل مقبولة';
  return 'فترة تحصيل طويلة تحتاج لتحسين';
}

function interpretPayablesTurnover(value: number): string {
  if (value >= 12) return 'سرعة في سداد الموردين';
  if (value >= 6) return 'معدل سداد جيد';
  if (value >= 4) return 'معدل سداد مقبول';
  return 'بطء في السداد قد يؤثر على العلاقات مع الموردين';
}

function interpretDaysPayable(value: number): string {
  if (value <= 30) return 'سداد سريع للموردين';
  if (value <= 45) return 'فترة سداد معقولة';
  if (value <= 60) return 'استفادة جيدة من الائتمان التجاري';
  return 'فترة سداد طويلة قد تضر بسمعة الشركة';
}

function interpretFixedAssetTurnover(value: number): string {
  if (value >= 3) return 'استخدام فعال جداً للأصول الثابتة';
  if (value >= 2) return 'استخدام جيد للأصول الثابتة';
  if (value >= 1) return 'استخدام مقبول';
  return 'ضعف في استغلال الأصول الثابتة';
}

function interpretTotalAssetTurnover(value: number): string {
  if (value >= 2) return 'كفاءة عالية في استخدام الأصول';
  if (value >= 1) return 'كفاءة جيدة';
  if (value >= 0.5) return 'كفاءة مقبولة';
  return 'ضعف في استغلال الأصول لتوليد الإيرادات';
}

function interpretOperatingCycle(value: number): string {
  if (value <= 60) return 'دورة تشغيل قصيرة وفعالة';
  if (value <= 90) return 'دورة تشغيل جيدة';
  if (value <= 120) return 'دورة تشغيل مقبولة';
  return 'دورة تشغيل طويلة تحتاج لتحسين';
}

function interpretCashConversionCycle(value: number): string {
  if (value <= 30) return 'دورة تحويل نقدي ممتازة';
  if (value <= 60) return 'دورة تحويل نقدي جيدة';
  if (value <= 90) return 'دورة تحويل نقدي مقبولة';
  return 'دورة تحويل نقدي طويلة تؤثر على السيولة';
}

function interpretDebtToAssets(value: number): string {
  if (value <= 0.3) return 'مستوى دين منخفض وآمن';
  if (value <= 0.5) return 'مستوى دين معتدل';
  if (value <= 0.7) return 'مستوى دين مرتفع نسبياً';
  return 'مستوى دين مرتفع جداً يشكل مخاطر';
}

function interpretDebtToEquity(value: number): string {
  if (value <= 0.5) return 'هيكل رأسمال محافظ';
  if (value <= 1) return 'توازن جيد بين الدين وحقوق الملكية';
  if (value <= 2) return 'اعتماد متوسط على الدين';
  return 'اعتماد كبير على الدين';
}

function interpretInterestCoverage(value: number): string {
  if (value >= 5) return 'قدرة ممتازة على سداد الفوائد';
  if (value >= 3) return 'قدرة جيدة على سداد الفوائد';
  if (value >= 1.5) return 'قدرة مقبولة';
  return 'صعوبة في تغطية الفوائد';
}

function interpretDebtServiceCoverage(value: number): string {
  if (value >= 2) return 'قدرة قوية على خدمة الدين';
  if (value >= 1.25) return 'قدرة كافية لخدمة الدين';
  if (value >= 1) return 'قدرة محدودة';
  return 'صعوبة في خدمة الدين';
}

function interpretEquityRatio(value: number): string {
  if (value >= 0.7) return 'قاعدة رأسمالية قوية جداً';
  if (value >= 0.5) return 'قاعدة رأسمالية جيدة';
  if (value >= 0.3) return 'قاعدة رأسمالية مقبولة';
  return 'قاعدة رأسمالية ضعيفة';
}

function interpretGrossProfitMargin(value: number): string {
  if (value >= 0.4) return 'هامش ربح إجمالي ممتاز';
  if (value >= 0.3) return 'هامش ربح إجمالي جيد';
  if (value >= 0.2) return 'هامش ربح إجمالي مقبول';
  return 'هامش ربح إجمالي ضعيف';
}

function interpretOperatingProfitMargin(value: number): string {
  if (value >= 0.2) return 'كفاءة تشغيلية ممتازة';
  if (value >= 0.15) return 'كفاءة تشغيلية جيدة';
  if (value >= 0.1) return 'كفاءة تشغيلية مقبولة';
  return 'ضعف في الكفاءة التشغيلية';
}

function interpretNetProfitMargin(value: number): string {
  if (value >= 0.15) return 'ربحية صافية ممتازة';
  if (value >= 0.1) return 'ربحية صافية جيدة';
  if (value >= 0.05) return 'ربحية صافية مقبولة';
  return 'ربحية صافية ضعيفة';
}

function interpretROA(value: number): string {
  if (value >= 0.1) return 'عائد ممتاز على الأصول';
  if (value >= 0.05) return 'عائد جيد على الأصول';
  if (value >= 0.02) return 'عائد مقبول';
  return 'عائد ضعيف على الأصول';
}

function interpretROE(value: number): string {
  if (value >= 0.2) return 'عائد ممتاز للمساهمين';
  if (value >= 0.15) return 'عائد جيد للمساهمين';
  if (value >= 0.1) return 'عائد مقبول';
  return 'عائد ضعيف للمساهمين';
}

function interpretROIC(value: number): string {
  if (value >= 0.15) return 'عائد ممتاز على رأس المال المستثمر';
  if (value >= 0.12) return 'عائد جيد يفوق تكلفة رأس المال';
  if (value >= 0.08) return 'عائد مقبول';
  return 'عائد ضعيف قد لا يغطي تكلفة رأس المال';
}

function interpretPE(value: number): string {
  if (value <= 10) return 'السهم مقيم بأقل من قيمته';
  if (value <= 20) return 'تقييم معقول للسهم';
  if (value <= 30) return 'تقييم مرتفع نسبياً';
  return 'تقييم مرتفع جداً';
}

function interpretPB(value: number): string {
  if (value <= 1) return 'السهم يتداول أقل من القيمة الدفترية';
  if (value <= 2) return 'تقييم معقول';
  if (value <= 3) return 'تقييم مرتفع';
  return 'تقييم مرتفع جداً';
}

function interpretDividendYield(value: number): string {
  if (value >= 0.05) return 'عائد توزيعات مرتفع';
  if (value >= 0.03) return 'عائد توزيعات جيد';
  if (value >= 0.01) return 'عائد توزيعات منخفض';
  return 'لا توجد توزيعات أو توزيعات ضئيلة';
}

function interpretEPS(value: number): string {
  if (value >= 5) return 'ربحية قوية للسهم';
  if (value >= 2) return 'ربحية جيدة للسهم';
  if (value >= 0) return 'ربحية موجبة';
  return 'خسارة للسهم';
}

function interpretBookValue(value: number): string {
  if (value >= 20) return 'قيمة دفترية قوية';
  if (value >= 10) return 'قيمة دفترية جيدة';
  if (value >= 5) return 'قيمة دفترية مقبولة';
  return 'قيمة دفترية منخفضة';
}

// Rating functions for each ratio
function getRatingFromCurrentRatio(value: number): string {
  if (value >= 2) return 'excellent';
  if (value >= 1.5) return 'veryGood';
  if (value >= 1.2) return 'good';
  if (value >= 1) return 'acceptable';
  return 'weak';
}

function getRatingFromQuickRatio(value: number): string {
  if (value >= 1) return 'excellent';
  if (value >= 0.8) return 'veryGood';
  if (value >= 0.6) return 'good';
  if (value >= 0.4) return 'acceptable';
  return 'weak';
}

function getRatingFromCashRatio(value: number): string {
  if (value >= 0.5) return 'excellent';
  if (value >= 0.3) return 'veryGood';
  if (value >= 0.2) return 'good';
  if (value >= 0.1) return 'acceptable';
  return 'weak';
}

function getRatingFromOperatingCashFlowRatio(value: number): string {
  if (value >= 1) return 'excellent';
  if (value >= 0.7) return 'veryGood';
  if (value >= 0.5) return 'good';
  if (value >= 0.2) return 'acceptable';
  return 'weak';
}

function getRatingFromWorkingCapitalRatio(value: number): string {
  if (value >= 0.3) return 'excellent';
  if (value >= 0.2) return 'veryGood';
  if (value >= 0.15) return 'good';
  if (value >= 0.1) return 'acceptable';
  return 'weak';
}

function getRatingFromInventoryTurnover(value: number): string {
  if (value >= 12) return 'excellent';
  if (value >= 8) return 'veryGood';
  if (value >= 6) return 'good';
  if (value >= 4) return 'acceptable';
  return 'weak';
}

function getRatingFromReceivablesTurnover(value: number): string {
  if (value >= 12) return 'excellent';
  if (value >= 10) return 'veryGood';
  if (value >= 8) return 'good';
  if (value >= 6) return 'acceptable';
  return 'weak';
}

function getRatingFromDaysReceivable(value: number): string {
  if (value <= 30) return 'excellent';
  if (value <= 40) return 'veryGood';
  if (value <= 50) return 'good';
  if (value <= 60) return 'acceptable';
  return 'weak';
}

function getRatingFromPayablesTurnover(value: number): string {
  if (value >= 8 && value <= 12) return 'excellent';
  if (value >= 6 && value <= 15) return 'veryGood';
  if (value >= 4) return 'good';
  if (value >= 3) return 'acceptable';
  return 'weak';
}

function getRatingFromDaysPayable(value: number): string {
  if (value >= 30 && value <= 45) return 'excellent';
  if (value >= 20 && value <= 60) return 'veryGood';
  if (value <= 90) return 'good';
  if (value <= 120) return 'acceptable';
  return 'weak';
}

function getRatingFromFixedAssetTurnover(value: number): string {
  if (value >= 3) return 'excellent';
  if (value >= 2) return 'veryGood';
  if (value >= 1.5) return 'good';
  if (value >= 1) return 'acceptable';
  return 'weak';
}

function getRatingFromTotalAssetTurnover(value: number): string {
  if (value >= 2) return 'excellent';
  if (value >= 1.5) return 'veryGood';
  if (value >= 1) return 'good';
  if (value >= 0.5) return 'acceptable';
  return 'weak';
}

function getRatingFromOperatingCycle(value: number): string {
  if (value <= 60) return 'excellent';
  if (value <= 80) return 'veryGood';
  if (value <= 100) return 'good';
  if (value <= 120) return 'acceptable';
  return 'weak';
}

function getRatingFromCashConversionCycle(value: number): string {
  if (value <= 30) return 'excellent';
  if (value <= 50) return 'veryGood';
  if (value <= 70) return 'good';
  if (value <= 90) return 'acceptable';
  return 'weak';
}

function getRatingFromDebtToAssets(value: number): string {
  if (value <= 0.3) return 'excellent';
  if (value <= 0.4) return 'veryGood';
  if (value <= 0.5) return 'good';
  if (value <= 0.6) return 'acceptable';
  return 'weak';
}

function getRatingFromDebtToEquity(value: number): string {
  if (value <= 0.5) return 'excellent';
  if (value <= 0.8) return 'veryGood';
  if (value <= 1) return 'good';
  if (value <= 1.5) return 'acceptable';
  return 'weak';
}

function getRatingFromInterestCoverage(value: number): string {
  if (value >= 5) return 'excellent';
  if (value >= 3) return 'veryGood';
  if (value >= 2) return 'good';
  if (value >= 1.5) return 'acceptable';
  return 'weak';
}

function getRatingFromDebtServiceCoverage(value: number): string {
  if (value >= 2) return 'excellent';
  if (value >= 1.5) return 'veryGood';
  if (value >= 1.25) return 'good';
  if (value >= 1) return 'acceptable';
  return 'weak';
}

function getRatingFromEquityRatio(value: number): string {
  if (value >= 0.7) return 'excellent';
  if (value >= 0.6) return 'veryGood';
  if (value >= 0.5) return 'good';
  if (value >= 0.3) return 'acceptable';
  return 'weak';
}

function getRatingFromGrossProfitMargin(value: number): string {
  if (value >= 0.4) return 'excellent';
  if (value >= 0.3) return 'veryGood';
  if (value >= 0.25) return 'good';
  if (value >= 0.2) return 'acceptable';
  return 'weak';
}

function getRatingFromOperatingProfitMargin(value: number): string {
  if (value >= 0.2) return 'excellent';
  if (value >= 0.15) return 'veryGood';
  if (value >= 0.1) return 'good';
  if (value >= 0.05) return 'acceptable';
  return 'weak';
}

function getRatingFromNetProfitMargin(value: number): string {
  if (value >= 0.15) return 'excellent';
  if (value >= 0.1) return 'veryGood';
  if (value >= 0.07) return 'good';
  if (value >= 0.05) return 'acceptable';
  return 'weak';
}

function getRatingFromROA(value: number): string {
  if (value >= 0.1) return 'excellent';
  if (value >= 0.07) return 'veryGood';
  if (value >= 0.05) return 'good';
  if (value >= 0.02) return 'acceptable';
  return 'weak';
}

function getRatingFromROE(value: number): string {
  if (value >= 0.2) return 'excellent';
  if (value >= 0.15) return 'veryGood';
  if (value >= 0.12) return 'good';
  if (value >= 0.1) return 'acceptable';
  return 'weak';
}

function getRatingFromROIC(value: number): string {
  if (value >= 0.15) return 'excellent';
  if (value >= 0.12) return 'veryGood';
  if (value >= 0.1) return 'good';
  if (value >= 0.08) return 'acceptable';
  return 'weak';
}

function getRatingFromPE(value: number): string {
  if (value > 0 && value <= 15) return 'excellent';
  if (value <= 20) return 'veryGood';
  if (value <= 25) return 'good';
  if (value <= 30) return 'acceptable';
  return 'weak';
}

function getRatingFromPB(value: number): string {
  if (value > 0 && value <= 1.5) return 'excellent';
  if (value <= 2) return 'veryGood';
  if (value <= 2.5) return 'good';
  if (value <= 3) return 'acceptable';
  return 'weak';
}

function getRatingFromDividendYield(value: number): string {
  if (value >= 0.05) return 'excellent';
  if (value >= 0.04) return 'veryGood';
  if (value >= 0.03) return 'good';
  if (value >= 0.02) return 'acceptable';
  return 'weak';
}

function getRatingFromEPS(value: number): string {
  if (value >= 5) return 'excellent';
  if (value >= 3) return 'veryGood';
  if (value >= 2) return 'good';
  if (value >= 1) return 'acceptable';
  return 'weak';
}

function getRatingFromBookValue(value: number): string {
  if (value >= 20) return 'excellent';
  if (value >= 15) return 'veryGood';
  if (value >= 10) return 'good';
  if (value >= 5) return 'acceptable';
  return 'weak';
}

// Generate recommendations based on ratio
function generateRatioRecommendation(ratio: FinancialRatio): string {
  const recommendations: { [key: string]: { [rating: string]: string } } = {
    'النسبة الجارية': {
      excellent: 'الحفاظ على مستوى السيولة الحالي',
      veryGood: 'مراقبة السيولة بشكل دوري',
      good: 'النظر في تحسين إدارة رأس المال العامل',
      acceptable: 'زيادة الأصول المتداولة أو تقليل الخصوم المتداولة',
      weak: 'اتخاذ إجراءات عاجلة لتحسين السيولة'
    },
    // Add recommendations for all other ratios...
  };
  
  return recommendations[ratio.name]?.[ratio.rating] || 'مراجعة وتحسين هذا المؤشر';
}
