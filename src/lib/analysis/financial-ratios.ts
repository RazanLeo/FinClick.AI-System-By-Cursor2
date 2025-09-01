import { FinancialStatement, AnalysisResult, AnalysisType, AnalysisCategory } from '@/lib/types';
import { formatNumber, formatPercentage, getRatingFromScore } from '@/lib/utils/helpers';

// Vertical Analysis
export async function performVerticalAnalysis(
  statements: FinancialStatement[],
  company: any,
  benchmarks: any
): Promise<AnalysisResult> {
  const latestStatement = statements[statements.length - 1];
  const { balanceSheet, incomeStatement } = latestStatement;
  
  // Balance Sheet Vertical Analysis
  const totalAssets = balanceSheet.totalAssets || 1;
  const bsVertical = {
    // Assets
    currentAssetsPercent: (balanceSheet.currentAssets.totalCurrentAssets / totalAssets) * 100,
    cashPercent: (balanceSheet.currentAssets.cash / totalAssets) * 100,
    receivablesPercent: (balanceSheet.currentAssets.accountsReceivable / totalAssets) * 100,
    inventoryPercent: (balanceSheet.currentAssets.inventory / totalAssets) * 100,
    fixedAssetsPercent: (balanceSheet.nonCurrentAssets.totalNonCurrentAssets / totalAssets) * 100,
    
    // Liabilities
    currentLiabilitiesPercent: (balanceSheet.currentLiabilities.totalCurrentLiabilities / totalAssets) * 100,
    longTermDebtPercent: (balanceSheet.nonCurrentLiabilities.longTermDebt / totalAssets) * 100,
    totalLiabilitiesPercent: (balanceSheet.totalLiabilities / totalAssets) * 100,
    
    // Equity
    equityPercent: (balanceSheet.shareholdersEquity.totalShareholdersEquity / totalAssets) * 100
  };
  
  // Income Statement Vertical Analysis
  const revenue = incomeStatement.revenue || 1;
  const isVertical = {
    costOfGoodsSoldPercent: (incomeStatement.costOfGoodsSold / revenue) * 100,
    grossProfitPercent: (incomeStatement.grossProfit / revenue) * 100,
    operatingExpensesPercent: (incomeStatement.operatingExpenses.totalOperatingExpenses / revenue) * 100,
    operatingIncomePercent: (incomeStatement.operatingIncome / revenue) * 100,
    netIncomePercent: (incomeStatement.netIncome / revenue) * 100
  };
  
  // Generate insights
  const insights = generateVerticalAnalysisInsights(bsVertical, isVertical, benchmarks);
  
  // Calculate rating
  const score = calculateVerticalAnalysisScore(bsVertical, isVertical, benchmarks);
  const rating = getRatingFromScore(score);
  
  // Create charts data
  const charts = [
    {
      type: 'pie' as const,
      data: {
        labels: ['الأصول المتداولة', 'الأصول غير المتداولة'],
        datasets: [{
          data: [bsVertical.currentAssetsPercent, bsVertical.fixedAssetsPercent],
          backgroundColor: ['#D4AF37', '#B8981F']
        }]
      },
      options: { title: { text: 'هيكل الأصول' } }
    },
    {
      type: 'bar' as const,
      data: {
        labels: ['تكلفة المبيعات', 'المصروفات التشغيلية', 'صافي الربح'],
        datasets: [{
          label: 'نسبة من الإيرادات',
          data: [isVertical.costOfGoodsSoldPercent, isVertical.operatingExpensesPercent, isVertical.netIncomePercent],
          backgroundColor: ['#D32F2F', '#ED6C02', '#2E7D32']
        }]
      },
      options: { title: { text: 'هيكل الربحية' } }
    }
  ];
  
  return {
    id: 'vertical-analysis',
    type: AnalysisType.VerticalAnalysis,
    name: 'التحليل الرأسي',
    nameEn: 'Vertical Analysis',
    category: AnalysisCategory.StructuralAnalysis,
    definition: 'تحليل يوضح نسبة كل بند من البنود المالية إلى إجمالي القوائم المالية',
    whatItMeasures: 'الأهمية النسبية لكل بند في القوائم المالية',
    importance: 'يساعد في فهم هيكل الأصول والخصوم والإيرادات والمصروفات',
    calculation: 'البند المالي ÷ الإجمالي × 100',
    result: {
      balanceSheet: bsVertical,
      incomeStatement: isVertical
    },
    interpretation: insights.interpretation,
    industryAverage: benchmarks?.verticalAnalysis || null,
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

function generateVerticalAnalysisInsights(
  bsVertical: any,
  isVertical: any,
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
  
  // Interpretation
  insights.interpretation = `الأصول المتداولة تمثل ${formatPercentage(bsVertical.currentAssetsPercent)} من إجمالي الأصول، ` +
    `بينما تكلفة المبيعات تمثل ${formatPercentage(isVertical.costOfGoodsSoldPercent)} من الإيرادات. ` +
    `هامش الربح الصافي ${formatPercentage(isVertical.netIncomePercent)}.`;
  
  // Comparison with benchmarks
  if (benchmarks?.verticalAnalysis) {
    const currentAssetsDiff = bsVertical.currentAssetsPercent - benchmarks.verticalAnalysis.currentAssetsPercent;
    const netMarginDiff = isVertical.netIncomePercent - benchmarks.verticalAnalysis.netIncomePercent;
    
    insights.comparison = `مقارنة بمتوسط الصناعة: ` +
      `الأصول المتداولة ${currentAssetsDiff > 0 ? 'أعلى' : 'أقل'} بـ ${Math.abs(currentAssetsDiff).toFixed(1)}%، ` +
      `هامش الربح ${netMarginDiff > 0 ? 'أفضل' : 'أضعف'} بـ ${Math.abs(netMarginDiff).toFixed(1)}%`;
  }
  
  // Detailed analysis
  insights.detailed = generateDetailedVerticalAnalysis(bsVertical, isVertical);
  
  // Risks
  if (bsVertical.cashPercent < 5) {
    insights.risks.push('نسبة النقد منخفضة جداً مما قد يؤثر على السيولة');
  }
  if (isVertical.netIncomePercent < 5) {
    insights.risks.push('هامش الربح الصافي منخفض');
  }
  if (bsVertical.currentLiabilitiesPercent > bsVertical.currentAssetsPercent) {
    insights.risks.push('الخصوم المتداولة تتجاوز الأصول المتداولة');
  }
  
  // Opportunities
  if (isVertical.operatingExpensesPercent > 20) {
    insights.opportunities.push('فرصة لتحسين كفاءة المصروفات التشغيلية');
  }
  if (bsVertical.inventoryPercent > 30) {
    insights.opportunities.push('إمكانية تحسين إدارة المخزون');
  }
  
  // SWOT elements
  if (isVertical.grossProfitPercent > 40) {
    insights.strengths.push('هامش ربح إجمالي قوي');
  }
  if (bsVertical.equityPercent > 50) {
    insights.strengths.push('هيكل رأس مال قوي');
  }
  
  if (bsVertical.longTermDebtPercent > 40) {
    insights.weaknesses.push('اعتماد كبير على الديون طويلة الأجل');
  }
  
  // Recommendation
  insights.recommendation = generateVerticalAnalysisRecommendation(bsVertical, isVertical);
  
  return insights;
}

function generateDetailedVerticalAnalysis(bsVertical: any, isVertical: any): string {
  let analysis = '## تحليل مفصل لهيكل القوائم المالية\n\n';
  
  analysis += '### هيكل الأصول:\n';
  analysis += `- الأصول المتداولة: ${formatPercentage(bsVertical.currentAssetsPercent)}\n`;
  analysis += `  - النقد: ${formatPercentage(bsVertical.cashPercent)}\n`;
  analysis += `  - الذمم المدينة: ${formatPercentage(bsVertical.receivablesPercent)}\n`;
  analysis += `  - المخزون: ${formatPercentage(bsVertical.inventoryPercent)}\n`;
  analysis += `- الأصول غير المتداولة: ${formatPercentage(bsVertical.fixedAssetsPercent)}\n\n`;
  
  analysis += '### هيكل التمويل:\n';
  analysis += `- حقوق الملكية: ${formatPercentage(bsVertical.equityPercent)}\n`;
  analysis += `- إجمالي الخصوم: ${formatPercentage(bsVertical.totalLiabilitiesPercent)}\n`;
  analysis += `  - خصوم متداولة: ${formatPercentage(bsVertical.currentLiabilitiesPercent)}\n`;
  analysis += `  - ديون طويلة الأجل: ${formatPercentage(bsVertical.longTermDebtPercent)}\n\n`;
  
  analysis += '### هيكل الربحية:\n';
  analysis += `- هامش الربح الإجمالي: ${formatPercentage(isVertical.grossProfitPercent)}\n`;
  analysis += `- نسبة المصروفات التشغيلية: ${formatPercentage(isVertical.operatingExpensesPercent)}\n`;
  analysis += `- هامش الربح التشغيلي: ${formatPercentage(isVertical.operatingIncomePercent)}\n`;
  analysis += `- هامش الربح الصافي: ${formatPercentage(isVertical.netIncomePercent)}\n`;
  
  return analysis;
}

function calculateVerticalAnalysisScore(
  bsVertical: any,
  isVertical: any,
  benchmarks: any
): number {
  let score = 50; // Base score
  
  // Balance sheet scoring
  if (bsVertical.cashPercent >= 10 && bsVertical.cashPercent <= 20) score += 10;
  if (bsVertical.currentAssetsPercent >= 40 && bsVertical.currentAssetsPercent <= 60) score += 10;
  if (bsVertical.equityPercent >= 40) score += 10;
  if (bsVertical.longTermDebtPercent <= 30) score += 10;
  
  // Income statement scoring
  if (isVertical.grossProfitPercent >= 30) score += 5;
  if (isVertical.operatingExpensesPercent <= 20) score += 5;
  if (isVertical.netIncomePercent >= 10) score += 10;
  
  // Benchmark comparison
  if (benchmarks?.verticalAnalysis) {
    if (isVertical.netIncomePercent > benchmarks.verticalAnalysis.netIncomePercent) score += 10;
  }
  
  return Math.min(100, Math.max(0, score));
}

function generateVerticalAnalysisRecommendation(bsVertical: any, isVertical: any): string {
  const recommendations: string[] = [];
  
  if (bsVertical.cashPercent < 5) {
    recommendations.push('زيادة رصيد النقد لتحسين السيولة');
  }
  
  if (bsVertical.inventoryPercent > 30) {
    recommendations.push('تحسين إدارة المخزون لتقليل التكاليف المرتبطة');
  }
  
  if (isVertical.operatingExpensesPercent > 25) {
    recommendations.push('مراجعة وتحسين كفاءة المصروفات التشغيلية');
  }
  
  if (isVertical.netIncomePercent < 5) {
    recommendations.push('وضع استراتيجية لتحسين هوامش الربحية');
  }
  
  if (bsVertical.longTermDebtPercent > 40) {
    recommendations.push('النظر في إعادة هيكلة الديون لتحسين الوضع المالي');
  }
  
  return recommendations.join('، ');
}
