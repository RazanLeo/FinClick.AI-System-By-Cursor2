import { FinancialStatement, AnalysisResult, AnalysisType, AnalysisCategory } from '@/lib/types';
import { calculateGrowthRate, formatPercentage, getRatingFromScore } from '@/lib/utils/helpers';

interface HorizontalAnalysisItem {
  account: string;
  baseYear: number;
  currentYear: number;
  absoluteChange: number;
  percentageChange: number;
  trend: 'increase' | 'decrease' | 'stable';
}

export async function performHorizontalAnalysis(
  statements: FinancialStatement[],
  company: any,
  benchmarks: any
): Promise<AnalysisResult> {
  if (statements.length < 2) {
    return createSingleYearResult();
  }
  
  const baseStatement = statements[0];
  const currentStatement = statements[statements.length - 1];
  
  // Analyze Balance Sheet
  const balanceSheetAnalysis = analyzeBalanceSheetHorizontally(
    baseStatement.balanceSheet,
    currentStatement.balanceSheet,
    baseStatement.year,
    currentStatement.year
  );
  
  // Analyze Income Statement
  const incomeStatementAnalysis = analyzeIncomeStatementHorizontally(
    baseStatement.incomeStatement,
    currentStatement.incomeStatement,
    baseStatement.year,
    currentStatement.year
  );
  
  // Analyze Cash Flow Statement
  const cashFlowAnalysis = analyzeCashFlowHorizontally(
    baseStatement.cashFlowStatement,
    currentStatement.cashFlowStatement,
    baseStatement.year,
    currentStatement.year
  );
  
  // Generate insights
  const insights = generateHorizontalInsights(
    balanceSheetAnalysis,
    incomeStatementAnalysis,
    cashFlowAnalysis,
    benchmarks
  );
  
  // Calculate overall score
  const score = calculateHorizontalScore(
    balanceSheetAnalysis,
    incomeStatementAnalysis,
    cashFlowAnalysis,
    benchmarks
  );
  
  const rating = getRatingFromScore(score);
  
  // Create charts
  const charts = createHorizontalCharts(statements);
  
  return {
    id: 'horizontal-analysis',
    type: AnalysisType.HorizontalAnalysis,
    name: 'التحليل الأفقي',
    nameEn: 'Horizontal Analysis',
    category: AnalysisCategory.StructuralAnalysis,
    definition: 'تحليل يقارن البيانات المالية عبر فترات زمنية مختلفة لتحديد الاتجاهات والتغيرات',
    whatItMeasures: 'معدلات النمو والتغير في البنود المالية عبر الزمن',
    importance: 'يساعد في فهم اتجاهات النمو وتحديد المجالات التي تحتاج إلى تحسين',
    calculation: '(القيمة الحالية - القيمة الأساسية) ÷ القيمة الأساسية × 100',
    result: {
      balanceSheet: balanceSheetAnalysis,
      incomeStatement: incomeStatementAnalysis,
      cashFlow: cashFlowAnalysis,
      summary: createSummaryMetrics(balanceSheetAnalysis, incomeStatementAnalysis, cashFlowAnalysis)
    },
    interpretation: insights.interpretation,
    industryAverage: benchmarks?.horizontalGrowthRates,
    comparisonWithIndustry: insights.comparison,
    benchmarkComparison: insights.benchmarkComparison,
    rating,
    recommendation: insights.recommendation,
    charts,
    detailedAnalysis: insights.detailed,
    risks: insights.risks,
    opportunities: insights.opportunities,
    swot: {
      strengths: insights.strengths,
      weaknesses: insights.weaknesses,
      opportunities: insights.opportunities,
      threats: insights.threats
    }
  };
}

function analyzeBalanceSheetHorizontally(
  baseBS: any,
  currentBS: any,
  baseYear: number,
  currentYear: number
): HorizontalAnalysisItem[] {
  const items: HorizontalAnalysisItem[] = [];
  
  // Assets
  items.push(createAnalysisItem(
    'إجمالي الأصول',
    baseBS.totalAssets,
    currentBS.totalAssets,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'الأصول المتداولة',
    baseBS.currentAssets.totalCurrentAssets,
    currentBS.currentAssets.totalCurrentAssets,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'النقد',
    baseBS.currentAssets.cash,
    currentBS.currentAssets.cash,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'الذمم المدينة',
    baseBS.currentAssets.accountsReceivable,
    currentBS.currentAssets.accountsReceivable,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'المخزون',
    baseBS.currentAssets.inventory,
    currentBS.currentAssets.inventory,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'الأصول الثابتة',
    baseBS.nonCurrentAssets.totalNonCurrentAssets,
    currentBS.nonCurrentAssets.totalNonCurrentAssets,
    baseYear,
    currentYear
  ));
  
  // Liabilities
  items.push(createAnalysisItem(
    'إجمالي الخصوم',
    baseBS.totalLiabilities,
    currentBS.totalLiabilities,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'الخصوم المتداولة',
    baseBS.currentLiabilities.totalCurrentLiabilities,
    currentBS.currentLiabilities.totalCurrentLiabilities,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'الديون طويلة الأجل',
    baseBS.nonCurrentLiabilities.longTermDebt,
    currentBS.nonCurrentLiabilities.longTermDebt,
    baseYear,
    currentYear
  ));
  
  // Equity
  items.push(createAnalysisItem(
    'حقوق الملكية',
    baseBS.shareholdersEquity.totalShareholdersEquity,
    currentBS.shareholdersEquity.totalShareholdersEquity,
    baseYear,
    currentYear
  ));
  
  return items;
}

function analyzeIncomeStatementHorizontally(
  baseIS: any,
  currentIS: any,
  baseYear: number,
  currentYear: number
): HorizontalAnalysisItem[] {
  const items: HorizontalAnalysisItem[] = [];
  
  items.push(createAnalysisItem(
    'الإيرادات',
    baseIS.revenue,
    currentIS.revenue,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'تكلفة المبيعات',
    baseIS.costOfGoodsSold,
    currentIS.costOfGoodsSold,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'إجمالي الربح',
    baseIS.grossProfit,
    currentIS.grossProfit,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'المصروفات التشغيلية',
    baseIS.operatingExpenses.totalOperatingExpenses,
    currentIS.operatingExpenses.totalOperatingExpenses,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'الدخل التشغيلي',
    baseIS.operatingIncome,
    currentIS.operatingIncome,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'صافي الدخل',
    baseIS.netIncome,
    currentIS.netIncome,
    baseYear,
    currentYear
  ));
  
  return items;
}

function analyzeCashFlowHorizontally(
  baseCF: any,
  currentCF: any,
  baseYear: number,
  currentYear: number
): HorizontalAnalysisItem[] {
  const items: HorizontalAnalysisItem[] = [];
  
  items.push(createAnalysisItem(
    'التدفق النقدي التشغيلي',
    baseCF.operatingActivities.netCashFromOperating,
    currentCF.operatingActivities.netCashFromOperating,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'التدفق النقدي الاستثماري',
    baseCF.investingActivities.netCashFromInvesting,
    currentCF.investingActivities.netCashFromInvesting,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'التدفق النقدي التمويلي',
    baseCF.financingActivities.netCashFromFinancing,
    currentCF.financingActivities.netCashFromFinancing,
    baseYear,
    currentYear
  ));
  
  items.push(createAnalysisItem(
    'صافي التغير في النقد',
    baseCF.netChangeInCash,
    currentCF.netChangeInCash,
    baseYear,
    currentYear
  ));
  
  return items;
}

function createAnalysisItem(
  account: string,
  baseValue: number,
  currentValue: number,
  baseYear: number,
  currentYear: number
): HorizontalAnalysisItem {
  const absoluteChange = currentValue - baseValue;
  const percentageChange = baseValue !== 0 ? (absoluteChange / Math.abs(baseValue)) * 100 : 0;
  
  let trend: 'increase' | 'decrease' | 'stable';
  if (Math.abs(percentageChange) < 5) {
    trend = 'stable';
  } else if (percentageChange > 0) {
    trend = 'increase';
  } else {
    trend = 'decrease';
  }
  
  return {
    account,
    baseYear: baseValue,
    currentYear: currentValue,
    absoluteChange,
    percentageChange,
    trend
  };
}

function createSummaryMetrics(
  balanceSheet: HorizontalAnalysisItem[],
  incomeStatement: HorizontalAnalysisItem[],
  cashFlow: HorizontalAnalysisItem[]
): any {
  const revenue = incomeStatement.find(item => item.account === 'الإيرادات');
  const netIncome = incomeStatement.find(item => item.account === 'صافي الدخل');
  const totalAssets = balanceSheet.find(item => item.account === 'إجمالي الأصول');
  const equity = balanceSheet.find(item => item.account === 'حقوق الملكية');
  
  return {
    revenueGrowth: revenue?.percentageChange || 0,
    netIncomeGrowth: netIncome?.percentageChange || 0,
    assetGrowth: totalAssets?.percentageChange || 0,
    equityGrowth: equity?.percentageChange || 0,
    profitabilityTrend: netIncome && revenue && netIncome.percentageChange > revenue.percentageChange 
      ? 'improving' : 'declining'
  };
}

function generateHorizontalInsights(
  balanceSheet: HorizontalAnalysisItem[],
  incomeStatement: HorizontalAnalysisItem[],
  cashFlow: HorizontalAnalysisItem[],
  benchmarks: any
): any {
  const insights = {
    interpretation: '',
    comparison: '',
    benchmarkComparison: {},
    recommendation: '',
    detailed: '',
    risks: [] as string[],
    opportunities: [] as string[],
    strengths: [] as string[],
    weaknesses: [] as string[],
    threats: [] as string[]
  };
  
  const revenue = incomeStatement.find(item => item.account === 'الإيرادات');
  const netIncome = incomeStatement.find(item => item.account === 'صافي الدخل');
  const totalAssets = balanceSheet.find(item => item.account === 'إجمالي الأصول');
  
  // Interpretation
  insights.interpretation = `الإيرادات ${revenue?.trend === 'increase' ? 'نمت' : 'انخفضت'} بنسبة ${formatPercentage(Math.abs(revenue?.percentageChange || 0))}، ` +
    `بينما صافي الدخل ${netIncome?.trend === 'increase' ? 'ارتفع' : 'انخفض'} بنسبة ${formatPercentage(Math.abs(netIncome?.percentageChange || 0))}. ` +
    `إجمالي الأصول ${totalAssets?.trend === 'increase' ? 'زاد' : 'انخفض'} بنسبة ${formatPercentage(Math.abs(totalAssets?.percentageChange || 0))}.`;
  
  // Detailed analysis
  insights.detailed = generateDetailedHorizontalAnalysis(balanceSheet, incomeStatement, cashFlow);
  
  // Risk identification
  if (revenue && revenue.percentageChange < 0) {
    insights.risks.push('انخفاض في الإيرادات يشير إلى تحديات في السوق');
  }
  
  if (netIncome && netIncome.percentageChange < -10) {
    insights.risks.push('تراجع حاد في الربحية');
  }
  
  const debt = balanceSheet.find(item => item.account === 'الديون طويلة الأجل');
  if (debt && debt.percentageChange > 50) {
    insights.risks.push('ارتفاع كبير في مستوى المديونية');
  }
  
  // Opportunities
  const cash = balanceSheet.find(item => item.account === 'النقد');
  if (cash && cash.percentageChange > 20) {
    insights.opportunities.push('تحسن في الوضع النقدي يتيح فرص استثمارية');
  }
  
  // SWOT elements
  if (revenue && revenue.percentageChange > 10) {
    insights.strengths.push('نمو قوي في الإيرادات');
  }
  
  const opCashFlow = cashFlow.find(item => item.account === 'التدفق النقدي التشغيلي');
  if (opCashFlow && opCashFlow.percentageChange > 15) {
    insights.strengths.push('تحسن في التدفقات النقدية التشغيلية');
  }
  
  const inventory = balanceSheet.find(item => item.account === 'المخزون');
  if (inventory && inventory.percentageChange > 50) {
    insights.weaknesses.push('تراكم في المخزون قد يشير إلى بطء المبيعات');
  }
  
  // Recommendations
  insights.recommendation = generateHorizontalRecommendations(balanceSheet, incomeStatement, cashFlow);
  
  return insights;
}

function generateDetailedHorizontalAnalysis(
  balanceSheet: HorizontalAnalysisItem[],
  incomeStatement: HorizontalAnalysisItem[],
  cashFlow: HorizontalAnalysisItem[]
): string {
  let analysis = '## تحليل مفصل للتغيرات عبر الزمن\n\n';
  
  analysis += '### تحليل قائمة الدخل:\n';
  incomeStatement.forEach(item => {
    if (Math.abs(item.percentageChange) > 5) {
      analysis += `- ${item.account}: ${item.trend === 'increase' ? 'ارتفع' : 'انخفض'} بنسبة ${formatPercentage(Math.abs(item.percentageChange))}\n`;
    }
  });
  
  analysis += '\n### تحليل المركز المالي:\n';
  balanceSheet.forEach(item => {
    if (Math.abs(item.percentageChange) > 5) {
      analysis += `- ${item.account}: ${item.trend === 'increase' ? 'ارتفع' : 'انخفض'} بنسبة ${formatPercentage(Math.abs(item.percentageChange))}\n`;
    }
  });
  
  analysis += '\n### تحليل التدفقات النقدية:\n';
  cashFlow.forEach(item => {
    analysis += `- ${item.account}: ${item.absoluteChange > 0 ? 'تحسن' : 'تراجع'} بمقدار ${Math.abs(item.absoluteChange).toLocaleString()}\n`;
  });
  
  return analysis;
}

function calculateHorizontalScore(
  balanceSheet: HorizontalAnalysisItem[],
  incomeStatement: HorizontalAnalysisItem[],
  cashFlow: HorizontalAnalysisItem[],
  benchmarks: any
): number {
  let score = 50; // Base score
  
  const revenue = incomeStatement.find(item => item.account === 'الإيرادات');
  const netIncome = incomeStatement.find(item => item.account === 'صافي الدخل');
  const operatingCF = cashFlow.find(item => item.account === 'التدفق النقدي التشغيلي');
  
  // Revenue growth scoring
  if (revenue) {
    if (revenue.percentageChange > 15) score += 15;
    else if (revenue.percentageChange > 10) score += 10;
    else if (revenue.percentageChange > 5) score += 5;
    else if (revenue.percentageChange < -10) score -= 10;
  }
  
  // Profitability growth scoring
  if (netIncome) {
    if (netIncome.percentageChange > revenue!.percentageChange) score += 10;
    if (netIncome.percentageChange > 20) score += 10;
    else if (netIncome.percentageChange < -20) score -= 10;
  }
  
  // Cash flow scoring
  if (operatingCF && operatingCF.percentageChange > 0) score += 10;
  
  // Asset efficiency
  const totalAssets = balanceSheet.find(item => item.account === 'إجمالي الأصول');
  if (totalAssets && revenue) {
    if (revenue.percentageChange > totalAssets.percentageChange) score += 5;
  }
  
  return Math.min(100, Math.max(0, score));
}

function generateHorizontalRecommendations(
  balanceSheet: HorizontalAnalysisItem[],
  incomeStatement: HorizontalAnalysisItem[],
  cashFlow: HorizontalAnalysisItem[]
): string {
  const recommendations: string[] = [];
  
  const revenue = incomeStatement.find(item => item.account === 'الإيرادات');
  if (revenue && revenue.percentageChange < 5) {
    recommendations.push('تطوير استراتيجيات نمو جديدة لزيادة الإيرادات');
  }
  
  const opExpenses = incomeStatement.find(item => item.account === 'المصروفات التشغيلية');
  const netIncome = incomeStatement.find(item => item.account === 'صافي الدخل');
  if (opExpenses && revenue && opExpenses.percentageChange > revenue.percentageChange) {
    recommendations.push('مراجعة وضبط المصروفات التشغيلية');
  }
  
  const inventory = balanceSheet.find(item => item.account === 'المخزون');
  if (inventory && inventory.percentageChange > 30) {
    recommendations.push('تحسين إدارة المخزون وتسريع دورانه');
  }
  
  const receivables = balanceSheet.find(item => item.account === 'الذمم المدينة');
  if (receivables && receivables.percentageChange > revenue!.percentageChange + 10) {
    recommendations.push('تحسين سياسات التحصيل');
  }
  
  return recommendations.join('، ');
}

function createHorizontalCharts(statements: FinancialStatement[]): any[] {
  const years = statements.map(s => s.year);
  const revenues = statements.map(s => s.incomeStatement.revenue);
  const netIncomes = statements.map(s => s.incomeStatement.netIncome);
  const totalAssets = statements.map(s => s.balanceSheet.totalAssets);
  
  return [
    {
      type: 'line' as const,
      data: {
        labels: years,
        datasets: [
          {
            label: 'الإيرادات',
            data: revenues,
            borderColor: '#D4AF37',
            tension: 0.1
          },
          {
            label: 'صافي الدخل',
            data: netIncomes,
            borderColor: '#2E7D32',
            tension: 0.1
          }
        ]
      },
      options: {
        title: { text: 'تطور الإيرادات والأرباح' }
      }
    },
    {
      type: 'bar' as const,
      data: {
        labels: years,
        datasets: [{
          label: 'إجمالي الأصول',
          data: totalAssets,
          backgroundColor: '#D4AF37'
        }]
      },
      options: {
        title: { text: 'نمو الأصول عبر السنوات' }
      }
    }
  ];
}

function createSingleYearResult(): AnalysisResult {
  return {
    id: 'horizontal-analysis',
    type: AnalysisType.HorizontalAnalysis,
    name: 'التحليل الأفقي',
    nameEn: 'Horizontal Analysis',
    category: AnalysisCategory.StructuralAnalysis,
    definition: 'تحليل يقارن البيانات المالية عبر فترات زمنية مختلفة',
    whatItMeasures: 'معدلات النمو والتغير عبر الزمن',
    importance: 'يساعد في فهم اتجاهات النمو',
    calculation: 'غير متاح - يتطلب بيانات متعددة السنوات',
    result: 'يتطلب التحليل الأفقي بيانات لسنتين على الأقل',
    interpretation: 'لا يمكن إجراء التحليل الأفقي بسنة واحدة فقط',
    rating: 'acceptable' as any,
    recommendation: 'يُنصح بتوفير بيانات مالية لسنوات متعددة لإجراء تحليل أفقي شامل',
    charts: []
  };
}
