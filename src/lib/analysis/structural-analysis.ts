import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';

/**
 * التحليل الهيكلي للقوائم المالية (15 تحليل)
 * حسب التصنيف المحدد في البرومبت
 */

export async function performStructuralAnalysis(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];

  // 1. تحليل هيكل الميزانية العمومية
  results.push(await analyzeBalanceSheetStructure(statements, companyData, marketData, benchmarkData));

  // 2. تحليل هيكل قائمة الدخل
  results.push(await analyzeIncomeStatementStructure(statements, companyData, marketData, benchmarkData));

  // 3. تحليل هيكل قائمة التدفق النقدي
  results.push(await analyzeCashFlowStructure(statements, companyData, marketData, benchmarkData));

  // 4. تحليل هيكل رأس المال
  results.push(await analyzeCapitalStructure(statements, companyData, marketData, benchmarkData));

  // 5. تحليل هيكل الأصول
  results.push(await analyzeAssetStructure(statements, companyData, marketData, benchmarkData));

  // 6. تحليل هيكل الخصوم
  results.push(await analyzeLiabilityStructure(statements, companyData, marketData, benchmarkData));

  // 7. تحليل هيكل حقوق الملكية
  results.push(await analyzeEquityStructure(statements, companyData, marketData, benchmarkData));

  // 8. تحليل هيكل الإيرادات
  results.push(await analyzeRevenueStructure(statements, companyData, marketData, benchmarkData));

  // 9. تحليل هيكل المصروفات
  results.push(await analyzeExpenseStructure(statements, companyData, marketData, benchmarkData));

  // 10. تحليل هيكل التدفق النقدي التشغيلي
  results.push(await analyzeOperatingCashFlowStructure(statements, companyData, marketData, benchmarkData));

  // 11. تحليل هيكل التدفق النقدي الاستثماري
  results.push(await analyzeInvestingCashFlowStructure(statements, companyData, marketData, benchmarkData));

  // 12. تحليل هيكل التدفق النقدي التمويلي
  results.push(await analyzeFinancingCashFlowStructure(statements, companyData, marketData, benchmarkData));

  // 13. تحليل هيكل العمل
  results.push(await analyzeWorkingCapitalStructure(statements, companyData, marketData, benchmarkData));

  // 14. تحليل هيكل الاستثمارات
  results.push(await analyzeInvestmentStructure(statements, companyData, marketData, benchmarkData));

  // 15. تحليل هيكل التمويل
  results.push(await analyzeFinancingStructure(statements, companyData, marketData, benchmarkData));

  return results;
}

/**
 * تحليل هيكل الميزانية العمومية
 */
async function analyzeBalanceSheetStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.balanceSheet) {
    return createErrorResult('تحليل هيكل الميزانية العمومية', 'بيانات الميزانية العمومية غير متوفرة');
  }

  const balanceSheet = latestStatement.balanceSheet;
  const totalAssets = balanceSheet.totalAssets || 0;
  const totalLiabilities = balanceSheet.totalLiabilities || 0;
  const totalEquity = balanceSheet.totalEquity || 0;

  // حساب النسب الهيكلية
  const assetStructure = {
    currentAssets: (balanceSheet.currentAssets || 0) / totalAssets * 100,
    nonCurrentAssets: (balanceSheet.nonCurrentAssets || 0) / totalAssets * 100,
    fixedAssets: (balanceSheet.fixedAssets || 0) / totalAssets * 100,
    intangibleAssets: (balanceSheet.intangibleAssets || 0) / totalAssets * 100
  };

  const liabilityStructure = {
    currentLiabilities: (balanceSheet.currentLiabilities || 0) / totalAssets * 100,
    nonCurrentLiabilities: (balanceSheet.nonCurrentLiabilities || 0) / totalAssets * 100,
    longTermDebt: (balanceSheet.longTermDebt || 0) / totalAssets * 100
  };

  const equityStructure = {
    equityRatio: totalEquity / totalAssets * 100,
    retainedEarnings: (balanceSheet.retainedEarnings || 0) / totalAssets * 100
  };

  // تقييم الهيكل
  const evaluation = evaluateBalanceSheetStructure(assetStructure, liabilityStructure, equityStructure);

  return {
    id: 'balance-sheet-structure',
    name: 'تحليل هيكل الميزانية العمومية',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل الميزانية العمومية وتوزيع الأصول والخصوم وحقوق الملكية',
    results: {
      assetStructure,
      liabilityStructure,
      equityStructure,
      evaluation
    },
    charts: [
      {
        type: 'pie',
        title: 'توزيع الأصول',
        data: [
          { label: 'الأصول المتداولة', value: assetStructure.currentAssets },
          { label: 'الأصول غير المتداولة', value: assetStructure.nonCurrentAssets }
        ]
      },
      {
        type: 'pie',
        title: 'توزيع الخصوم وحقوق الملكية',
        data: [
          { label: 'الخصوم المتداولة', value: liabilityStructure.currentLiabilities },
          { label: 'الخصوم غير المتداولة', value: liabilityStructure.nonCurrentLiabilities },
          { label: 'حقوق الملكية', value: equityStructure.equityRatio }
        ]
      }
    ],
    recommendations: generateBalanceSheetStructureRecommendations(assetStructure, liabilityStructure, equityStructure),
    risks: identifyBalanceSheetStructureRisks(assetStructure, liabilityStructure, equityStructure),
    predictions: generateBalanceSheetStructurePredictions(assetStructure, liabilityStructure, equityStructure),
    swot: performBalanceSheetStructureSWOT(assetStructure, liabilityStructure, equityStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

/**
 * تحليل هيكل قائمة الدخل
 */
async function analyzeIncomeStatementStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.incomeStatement) {
    return createErrorResult('تحليل هيكل قائمة الدخل', 'بيانات قائمة الدخل غير متوفرة');
  }

  const incomeStatement = latestStatement.incomeStatement;
  const totalRevenue = incomeStatement.totalRevenue || 0;
  const grossProfit = incomeStatement.grossProfit || 0;
  const operatingProfit = incomeStatement.operatingProfit || 0;
  const netProfit = incomeStatement.netProfit || 0;

  // حساب النسب الهيكلية
  const revenueStructure = {
    grossProfitMargin: grossProfit / totalRevenue * 100,
    operatingProfitMargin: operatingProfit / totalRevenue * 100,
    netProfitMargin: netProfit / totalRevenue * 100,
    costOfGoodsSoldRatio: (incomeStatement.costOfGoodsSold || 0) / totalRevenue * 100,
    operatingExpensesRatio: (incomeStatement.operatingExpenses || 0) / totalRevenue * 100
  };

  // تقييم الهيكل
  const evaluation = evaluateIncomeStatementStructure(revenueStructure);

  return {
    id: 'income-statement-structure',
    name: 'تحليل هيكل قائمة الدخل',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل قائمة الدخل وتوزيع الإيرادات والمصروفات',
    results: {
      revenueStructure,
      evaluation
    },
    charts: [
      {
        type: 'bar',
        title: 'هيكل قائمة الدخل',
        data: [
          { label: 'إجمالي الإيرادات', value: totalRevenue },
          { label: 'إجمالي الربح', value: grossProfit },
          { label: 'الربح التشغيلي', value: operatingProfit },
          { label: 'صافي الربح', value: netProfit }
        ]
      }
    ],
    recommendations: generateIncomeStatementStructureRecommendations(revenueStructure),
    risks: identifyIncomeStatementStructureRisks(revenueStructure),
    predictions: generateIncomeStatementStructurePredictions(revenueStructure),
    swot: performIncomeStatementStructureSWOT(revenueStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

/**
 * تحليل هيكل قائمة التدفق النقدي
 */
async function analyzeCashFlowStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.cashFlowStatement) {
    return createErrorResult('تحليل هيكل قائمة التدفق النقدي', 'بيانات قائمة التدفق النقدي غير متوفرة');
  }

  const cashFlowStatement = latestStatement.cashFlowStatement;
  const operatingCashFlow = cashFlowStatement.operatingCashFlow || 0;
  const investingCashFlow = cashFlowStatement.investingCashFlow || 0;
  const financingCashFlow = cashFlowStatement.financingCashFlow || 0;
  const netCashFlow = cashFlowStatement.netCashFlow || 0;

  // حساب النسب الهيكلية
  const cashFlowStructure = {
    operatingCashFlowRatio: operatingCashFlow / Math.abs(netCashFlow) * 100,
    investingCashFlowRatio: investingCashFlow / Math.abs(netCashFlow) * 100,
    financingCashFlowRatio: financingCashFlow / Math.abs(netCashFlow) * 100
  };

  // تقييم الهيكل
  const evaluation = evaluateCashFlowStructure(cashFlowStructure);

  return {
    id: 'cash-flow-structure',
    name: 'تحليل هيكل قائمة التدفق النقدي',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل قائمة التدفق النقدي وتوزيع التدفقات النقدية',
    results: {
      cashFlowStructure,
      evaluation
    },
    charts: [
      {
        type: 'bar',
        title: 'هيكل التدفق النقدي',
        data: [
          { label: 'التدفق النقدي التشغيلي', value: operatingCashFlow },
          { label: 'التدفق النقدي الاستثماري', value: investingCashFlow },
          { label: 'التدفق النقدي التمويلي', value: financingCashFlow },
          { label: 'صافي التدفق النقدي', value: netCashFlow }
        ]
      }
    ],
    recommendations: generateCashFlowStructureRecommendations(cashFlowStructure),
    risks: identifyCashFlowStructureRisks(cashFlowStructure),
    predictions: generateCashFlowStructurePredictions(cashFlowStructure),
    swot: performCashFlowStructureSWOT(cashFlowStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

// باقي الدوال المساعدة...

/**
 * تقييم هيكل الميزانية العمومية
 */
function evaluateBalanceSheetStructure(assetStructure: any, liabilityStructure: any, equityStructure: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم هيكل الأصول
  if (assetStructure.currentAssets >= 20 && assetStructure.currentAssets <= 40) {
    score += 2;
  } else if (assetStructure.currentAssets > 40) {
    score += 1;
  }

  // تقييم هيكل الخصوم
  if (liabilityStructure.currentLiabilities <= 30) {
    score += 2;
  } else if (liabilityStructure.currentLiabilities <= 50) {
    score += 1;
  }

  // تقييم هيكل حقوق الملكية
  if (equityStructure.equityRatio >= 40) {
    score += 2;
  } else if (equityStructure.equityRatio >= 20) {
    score += 1;
  }

  // تحديد التقييم العام
  let overallRating: 'excellent' | 'very-good' | 'good' | 'acceptable' | 'weak';
  if (score >= 5) overallRating = 'excellent';
  else if (score >= 4) overallRating = 'very-good';
  else if (score >= 3) overallRating = 'good';
  else if (score >= 2) overallRating = 'acceptable';
  else overallRating = 'weak';

  // إنشاء التفسير
  interpretation = `هيكل الميزانية العمومية ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (assetStructure.currentAssets > 40) {
    interpretation += 'الأصول المتداولة مرتفعة نسبياً مما قد يؤثر على الربحية. ';
  }

  if (liabilityStructure.currentLiabilities > 50) {
    interpretation += 'الخصوم المتداولة مرتفعة مما قد يؤثر على السيولة. ';
  }

  if (equityStructure.equityRatio < 20) {
    interpretation += 'نسبة حقوق الملكية منخفضة مما قد يؤثر على الاستقرار المالي. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * تقييم هيكل قائمة الدخل
 */
function evaluateIncomeStatementStructure(revenueStructure: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم هامش الربح الإجمالي
  if (revenueStructure.grossProfitMargin >= 30) {
    score += 2;
  } else if (revenueStructure.grossProfitMargin >= 20) {
    score += 1;
  }

  // تقييم هامش الربح التشغيلي
  if (revenueStructure.operatingProfitMargin >= 15) {
    score += 2;
  } else if (revenueStructure.operatingProfitMargin >= 10) {
    score += 1;
  }

  // تقييم هامش صافي الربح
  if (revenueStructure.netProfitMargin >= 10) {
    score += 2;
  } else if (revenueStructure.netProfitMargin >= 5) {
    score += 1;
  }

  // تحديد التقييم العام
  let overallRating: 'excellent' | 'very-good' | 'good' | 'acceptable' | 'weak';
  if (score >= 5) overallRating = 'excellent';
  else if (score >= 4) overallRating = 'very-good';
  else if (score >= 3) overallRating = 'good';
  else if (score >= 2) overallRating = 'acceptable';
  else overallRating = 'weak';

  // إنشاء التفسير
  interpretation = `هيكل قائمة الدخل ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (revenueStructure.grossProfitMargin < 20) {
    interpretation += 'هامش الربح الإجمالي منخفض مما قد يؤثر على الربحية. ';
  }

  if (revenueStructure.operatingProfitMargin < 10) {
    interpretation += 'هامش الربح التشغيلي منخفض مما قد يؤثر على الكفاءة التشغيلية. ';
  }

  if (revenueStructure.netProfitMargin < 5) {
    interpretation += 'هامش صافي الربح منخفض مما قد يؤثر على العائد على الاستثمار. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * تقييم هيكل قائمة التدفق النقدي
 */
function evaluateCashFlowStructure(cashFlowStructure: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم التدفق النقدي التشغيلي
  if (cashFlowStructure.operatingCashFlowRatio >= 60) {
    score += 2;
  } else if (cashFlowStructure.operatingCashFlowRatio >= 40) {
    score += 1;
  }

  // تقييم التدفق النقدي الاستثماري
  if (cashFlowStructure.investingCashFlowRatio <= -20) {
    score += 2;
  } else if (cashFlowStructure.investingCashFlowRatio <= 0) {
    score += 1;
  }

  // تقييم التدفق النقدي التمويلي
  if (cashFlowStructure.financingCashFlowRatio >= -20 && cashFlowStructure.financingCashFlowRatio <= 20) {
    score += 2;
  } else if (cashFlowStructure.financingCashFlowRatio >= -40 && cashFlowStructure.financingCashFlowRatio <= 40) {
    score += 1;
  }

  // تحديد التقييم العام
  let overallRating: 'excellent' | 'very-good' | 'good' | 'acceptable' | 'weak';
  if (score >= 5) overallRating = 'excellent';
  else if (score >= 4) overallRating = 'very-good';
  else if (score >= 3) overallRating = 'good';
  else if (score >= 2) overallRating = 'acceptable';
  else overallRating = 'weak';

  // إنشاء التفسير
  interpretation = `هيكل قائمة التدفق النقدي ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (cashFlowStructure.operatingCashFlowRatio < 40) {
    interpretation += 'التدفق النقدي التشغيلي منخفض مما قد يؤثر على السيولة. ';
  }

  if (cashFlowStructure.investingCashFlowRatio > 0) {
    interpretation += 'التدفق النقدي الاستثماري موجب مما قد يؤثر على النمو. ';
  }

  if (Math.abs(cashFlowStructure.financingCashFlowRatio) > 40) {
    interpretation += 'التدفق النقدي التمويلي مرتفع مما قد يؤثر على الاستقرار المالي. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

// باقي الدوال المساعدة...

/**
 * إنشاء نتيجة خطأ
 */
function createErrorResult(name: string, message: string): AnalysisResult {
  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    category: 'error',
    description: message,
    results: { error: message },
    charts: [],
    recommendations: [],
    risks: [],
    predictions: [],
    swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
    finalEvaluation: {
      rating: 'weak',
      score: 0,
      interpretation: message
    }
  };
}

// باقي الدوال المساعدة...

/**
 * توليد التوصيات لهيكل الميزانية العمومية
 */
function generateBalanceSheetStructureRecommendations(assetStructure: any, liabilityStructure: any, equityStructure: any): string[] {
  const recommendations: string[] = [];

  if (assetStructure.currentAssets > 40) {
    recommendations.push('تحسين إدارة الأصول المتداولة لزيادة الكفاءة');
  }

  if (liabilityStructure.currentLiabilities > 50) {
    recommendations.push('تحسين إدارة الخصوم المتداولة لتقليل المخاطر');
  }

  if (equityStructure.equityRatio < 20) {
    recommendations.push('زيادة نسبة حقوق الملكية لتحسين الاستقرار المالي');
  }

  return recommendations;
}

/**
 * توليد التوصيات لهيكل قائمة الدخل
 */
function generateIncomeStatementStructureRecommendations(revenueStructure: any): string[] {
  const recommendations: string[] = [];

  if (revenueStructure.grossProfitMargin < 20) {
    recommendations.push('تحسين هامش الربح الإجمالي من خلال تحسين التكاليف');
  }

  if (revenueStructure.operatingProfitMargin < 10) {
    recommendations.push('تحسين هامش الربح التشغيلي من خلال تحسين الكفاءة');
  }

  if (revenueStructure.netProfitMargin < 5) {
    recommendations.push('تحسين هامش صافي الربح من خلال تحسين الإدارة');
  }

  return recommendations;
}

/**
 * توليد التوصيات لهيكل قائمة التدفق النقدي
 */
function generateCashFlowStructureRecommendations(cashFlowStructure: any): string[] {
  const recommendations: string[] = [];

  if (cashFlowStructure.operatingCashFlowRatio < 40) {
    recommendations.push('تحسين التدفق النقدي التشغيلي من خلال تحسين الإدارة');
  }

  if (cashFlowStructure.investingCashFlowRatio > 0) {
    recommendations.push('تحسين التدفق النقدي الاستثماري من خلال تحسين الاستثمارات');
  }

  if (Math.abs(cashFlowStructure.financingCashFlowRatio) > 40) {
    recommendations.push('تحسين التدفق النقدي التمويلي من خلال تحسين التمويل');
  }

  return recommendations;
}

// باقي الدوال المساعدة...

/**
 * تحديد المخاطر لهيكل الميزانية العمومية
 */
function identifyBalanceSheetStructureRisks(assetStructure: any, liabilityStructure: any, equityStructure: any): string[] {
  const risks: string[] = [];

  if (assetStructure.currentAssets > 40) {
    risks.push('ارتفاع الأصول المتداولة قد يؤثر على الربحية');
  }

  if (liabilityStructure.currentLiabilities > 50) {
    risks.push('ارتفاع الخصوم المتداولة قد يؤثر على السيولة');
  }

  if (equityStructure.equityRatio < 20) {
    risks.push('انخفاض نسبة حقوق الملكية قد يؤثر على الاستقرار المالي');
  }

  return risks;
}

/**
 * تحديد المخاطر لهيكل قائمة الدخل
 */
function identifyIncomeStatementStructureRisks(revenueStructure: any): string[] {
  const risks: string[] = [];

  if (revenueStructure.grossProfitMargin < 20) {
    risks.push('انخفاض هامش الربح الإجمالي قد يؤثر على الربحية');
  }

  if (revenueStructure.operatingProfitMargin < 10) {
    risks.push('انخفاض هامش الربح التشغيلي قد يؤثر على الكفاءة التشغيلية');
  }

  if (revenueStructure.netProfitMargin < 5) {
    risks.push('انخفاض هامش صافي الربح قد يؤثر على العائد على الاستثمار');
  }

  return risks;
}

/**
 * تحديد المخاطر لهيكل قائمة التدفق النقدي
 */
function identifyCashFlowStructureRisks(cashFlowStructure: any): string[] {
  const risks: string[] = [];

  if (cashFlowStructure.operatingCashFlowRatio < 40) {
    risks.push('انخفاض التدفق النقدي التشغيلي قد يؤثر على السيولة');
  }

  if (cashFlowStructure.investingCashFlowRatio > 0) {
    risks.push('ارتفاع التدفق النقدي الاستثماري قد يؤثر على النمو');
  }

  if (Math.abs(cashFlowStructure.financingCashFlowRatio) > 40) {
    risks.push('ارتفاع التدفق النقدي التمويلي قد يؤثر على الاستقرار المالي');
  }

  return risks;
}

// باقي الدوال المساعدة...

/**
 * توليد التوقعات لهيكل الميزانية العمومية
 */
function generateBalanceSheetStructurePredictions(assetStructure: any, liabilityStructure: any, equityStructure: any): string[] {
  const predictions: string[] = [];

  if (assetStructure.currentAssets > 40) {
    predictions.push('من المتوقع أن تتحسن إدارة الأصول المتداولة في المستقبل');
  }

  if (liabilityStructure.currentLiabilities > 50) {
    predictions.push('من المتوقع أن تتحسن إدارة الخصوم المتداولة في المستقبل');
  }

  if (equityStructure.equityRatio < 20) {
    predictions.push('من المتوقع أن تتحسن نسبة حقوق الملكية في المستقبل');
  }

  return predictions;
}

/**
 * توليد التوقعات لهيكل قائمة الدخل
 */
function generateIncomeStatementStructurePredictions(revenueStructure: any): string[] {
  const predictions: string[] = [];

  if (revenueStructure.grossProfitMargin < 20) {
    predictions.push('من المتوقع أن يتحسن هامش الربح الإجمالي في المستقبل');
  }

  if (revenueStructure.operatingProfitMargin < 10) {
    predictions.push('من المتوقع أن يتحسن هامش الربح التشغيلي في المستقبل');
  }

  if (revenueStructure.netProfitMargin < 5) {
    predictions.push('من المتوقع أن يتحسن هامش صافي الربح في المستقبل');
  }

  return predictions;
}

/**
 * توليد التوقعات لهيكل قائمة التدفق النقدي
 */
function generateCashFlowStructurePredictions(cashFlowStructure: any): string[] {
  const predictions: string[] = [];

  if (cashFlowStructure.operatingCashFlowRatio < 40) {
    predictions.push('من المتوقع أن يتحسن التدفق النقدي التشغيلي في المستقبل');
  }

  if (cashFlowStructure.investingCashFlowRatio > 0) {
    predictions.push('من المتوقع أن يتحسن التدفق النقدي الاستثماري في المستقبل');
  }

  if (Math.abs(cashFlowStructure.financingCashFlowRatio) > 40) {
    predictions.push('من المتوقع أن يتحسن التدفق النقدي التمويلي في المستقبل');
  }

  return predictions;
}

// باقي الدوال المساعدة...

/**
 * تحليل SWOT لهيكل الميزانية العمومية
 */
function performBalanceSheetStructureSWOT(assetStructure: any, liabilityStructure: any, equityStructure: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (assetStructure.currentAssets >= 20 && assetStructure.currentAssets <= 40) {
    swot.strengths.push('هيكل الأصول المتداولة متوازن');
  }

  if (liabilityStructure.currentLiabilities <= 30) {
    swot.strengths.push('الخصوم المتداولة منخفضة');
  }

  if (equityStructure.equityRatio >= 40) {
    swot.strengths.push('نسبة حقوق الملكية عالية');
  }

  if (assetStructure.currentAssets > 40) {
    swot.weaknesses.push('الأصول المتداولة مرتفعة');
  }

  if (liabilityStructure.currentLiabilities > 50) {
    swot.weaknesses.push('الخصوم المتداولة مرتفعة');
  }

  if (equityStructure.equityRatio < 20) {
    swot.weaknesses.push('نسبة حقوق الملكية منخفضة');
  }

  swot.opportunities.push('تحسين هيكل الأصول');
  swot.opportunities.push('تحسين هيكل الخصوم');
  swot.opportunities.push('تحسين هيكل حقوق الملكية');

  swot.threats.push('تغيرات في هيكل الأصول');
  swot.threats.push('تغيرات في هيكل الخصوم');
  swot.threats.push('تغيرات في هيكل حقوق الملكية');

  return swot;
}

/**
 * تحليل SWOT لهيكل قائمة الدخل
 */
function performIncomeStatementStructureSWOT(revenueStructure: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (revenueStructure.grossProfitMargin >= 30) {
    swot.strengths.push('هامش الربح الإجمالي عالي');
  }

  if (revenueStructure.operatingProfitMargin >= 15) {
    swot.strengths.push('هامش الربح التشغيلي عالي');
  }

  if (revenueStructure.netProfitMargin >= 10) {
    swot.strengths.push('هامش صافي الربح عالي');
  }

  if (revenueStructure.grossProfitMargin < 20) {
    swot.weaknesses.push('هامش الربح الإجمالي منخفض');
  }

  if (revenueStructure.operatingProfitMargin < 10) {
    swot.weaknesses.push('هامش الربح التشغيلي منخفض');
  }

  if (revenueStructure.netProfitMargin < 5) {
    swot.weaknesses.push('هامش صافي الربح منخفض');
  }

  swot.opportunities.push('تحسين هامش الربح الإجمالي');
  swot.opportunities.push('تحسين هامش الربح التشغيلي');
  swot.opportunities.push('تحسين هامش صافي الربح');

  swot.threats.push('تغيرات في هامش الربح الإجمالي');
  swot.threats.push('تغيرات في هامش الربح التشغيلي');
  swot.threats.push('تغيرات في هامش صافي الربح');

  return swot;
}

/**
 * تحليل SWOT لهيكل قائمة التدفق النقدي
 */
function performCashFlowStructureSWOT(cashFlowStructure: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (cashFlowStructure.operatingCashFlowRatio >= 60) {
    swot.strengths.push('التدفق النقدي التشغيلي عالي');
  }

  if (cashFlowStructure.investingCashFlowRatio <= -20) {
    swot.strengths.push('التدفق النقدي الاستثماري جيد');
  }

  if (cashFlowStructure.financingCashFlowRatio >= -20 && cashFlowStructure.financingCashFlowRatio <= 20) {
    swot.strengths.push('التدفق النقدي التمويلي متوازن');
  }

  if (cashFlowStructure.operatingCashFlowRatio < 40) {
    swot.weaknesses.push('التدفق النقدي التشغيلي منخفض');
  }

  if (cashFlowStructure.investingCashFlowRatio > 0) {
    swot.weaknesses.push('التدفق النقدي الاستثماري ضعيف');
  }

  if (Math.abs(cashFlowStructure.financingCashFlowRatio) > 40) {
    swot.weaknesses.push('التدفق النقدي التمويلي غير متوازن');
  }

  swot.opportunities.push('تحسين التدفق النقدي التشغيلي');
  swot.opportunities.push('تحسين التدفق النقدي الاستثماري');
  swot.opportunities.push('تحسين التدفق النقدي التمويلي');

  swot.threats.push('تغيرات في التدفق النقدي التشغيلي');
  swot.threats.push('تغيرات في التدفق النقدي الاستثماري');
  swot.threats.push('تغيرات في التدفق النقدي التمويلي');

  return swot;
}

// باقي الدوال المساعدة...

/**
 * تحليل هيكل رأس المال
 */
async function analyzeCapitalStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل رأس المال
  return createErrorResult('تحليل هيكل رأس المال', 'تحت التنفيذ');
}

/**
 * تحليل هيكل الأصول
 */
async function analyzeAssetStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل الأصول
  return createErrorResult('تحليل هيكل الأصول', 'تحت التنفيذ');
}

/**
 * تحليل هيكل الخصوم
 */
async function analyzeLiabilityStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل الخصوم
  return createErrorResult('تحليل هيكل الخصوم', 'تحت التنفيذ');
}

/**
 * تحليل هيكل حقوق الملكية
 */
async function analyzeEquityStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل حقوق الملكية
  return createErrorResult('تحليل هيكل حقوق الملكية', 'تحت التنفيذ');
}

/**
 * تحليل هيكل الإيرادات
 */
async function analyzeRevenueStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل الإيرادات
  return createErrorResult('تحليل هيكل الإيرادات', 'تحت التنفيذ');
}

/**
 * تحليل هيكل المصروفات
 */
async function analyzeExpenseStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل المصروفات
  return createErrorResult('تحليل هيكل المصروفات', 'تحت التنفيذ');
}

/**
 * تحليل هيكل التدفق النقدي التشغيلي
 */
async function analyzeOperatingCashFlowStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل التدفق النقدي التشغيلي
  return createErrorResult('تحليل هيكل التدفق النقدي التشغيلي', 'تحت التنفيذ');
}

/**
 * تحليل هيكل التدفق النقدي الاستثماري
 */
async function analyzeInvestingCashFlowStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل التدفق النقدي الاستثماري
  return createErrorResult('تحليل هيكل التدفق النقدي الاستثماري', 'تحت التنفيذ');
}

/**
 * تحليل هيكل التدفق النقدي التمويلي
 */
async function analyzeFinancingCashFlowStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل التدفق النقدي التمويلي
  return createErrorResult('تحليل هيكل التدفق النقدي التمويلي', 'تحت التنفيذ');
}

/**
 * تحليل هيكل العمل
 */
async function analyzeWorkingCapitalStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل العمل
  return createErrorResult('تحليل هيكل العمل', 'تحت التنفيذ');
}

/**
 * تحليل هيكل الاستثمارات
 */
async function analyzeInvestmentStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل الاستثمارات
  return createErrorResult('تحليل هيكل الاستثمارات', 'تحت التنفيذ');
}

/**
 * تحليل هيكل التمويل
 */
async function analyzeFinancingStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل هيكل التمويل
  return createErrorResult('تحليل هيكل التمويل', 'تحت التنفيذ');
}
