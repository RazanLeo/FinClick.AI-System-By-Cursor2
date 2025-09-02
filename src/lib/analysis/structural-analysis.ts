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
 * تقييم هيكل رأس المال
 */
function evaluateCapitalStructure(capitalStructure: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم نسبة حقوق الملكية
  if (capitalStructure.equityRatio >= 60) {
    score += 2;
  } else if (capitalStructure.equityRatio >= 40) {
    score += 1;
  }

  // تقييم نسبة الديون
  if (capitalStructure.debtRatio <= 40) {
    score += 2;
  } else if (capitalStructure.debtRatio <= 60) {
    score += 1;
  }

  // تقييم نسبة الدين إلى حقوق الملكية
  if (capitalStructure.debtToEquityRatio <= 0.5) {
    score += 2;
  } else if (capitalStructure.debtToEquityRatio <= 1.0) {
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
  interpretation = `هيكل رأس المال ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (capitalStructure.equityRatio < 40) {
    interpretation += 'نسبة حقوق الملكية منخفضة مما قد يؤثر على الاستقرار المالي. ';
  }

  if (capitalStructure.debtRatio > 60) {
    interpretation += 'نسبة الديون مرتفعة مما قد يؤثر على المخاطر المالية. ';
  }

  if (capitalStructure.debtToEquityRatio > 1.0) {
    interpretation += 'نسبة الدين إلى حقوق الملكية مرتفعة مما قد يؤثر على الملاءة المالية. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * توليد التوصيات لهيكل رأس المال
 */
function generateCapitalStructureRecommendations(capitalStructure: any): string[] {
  const recommendations: string[] = [];

  if (capitalStructure.equityRatio < 40) {
    recommendations.push('زيادة نسبة حقوق الملكية لتحسين الاستقرار المالي');
  }

  if (capitalStructure.debtRatio > 60) {
    recommendations.push('تقليل نسبة الديون لتقليل المخاطر المالية');
  }

  if (capitalStructure.debtToEquityRatio > 1.0) {
    recommendations.push('تحسين نسبة الدين إلى حقوق الملكية لتحسين الملاءة المالية');
  }

  return recommendations;
}

/**
 * تحديد المخاطر لهيكل رأس المال
 */
function identifyCapitalStructureRisks(capitalStructure: any): string[] {
  const risks: string[] = [];

  if (capitalStructure.equityRatio < 40) {
    risks.push('انخفاض نسبة حقوق الملكية قد يؤثر على الاستقرار المالي');
  }

  if (capitalStructure.debtRatio > 60) {
    risks.push('ارتفاع نسبة الديون قد يؤثر على المخاطر المالية');
  }

  if (capitalStructure.debtToEquityRatio > 1.0) {
    risks.push('ارتفاع نسبة الدين إلى حقوق الملكية قد يؤثر على الملاءة المالية');
  }

  return risks;
}

/**
 * توليد التوقعات لهيكل رأس المال
 */
function generateCapitalStructurePredictions(capitalStructure: any): string[] {
  const predictions: string[] = [];

  if (capitalStructure.equityRatio < 40) {
    predictions.push('من المتوقع أن تتحسن نسبة حقوق الملكية في المستقبل');
  }

  if (capitalStructure.debtRatio > 60) {
    predictions.push('من المتوقع أن تتحسن نسبة الديون في المستقبل');
  }

  if (capitalStructure.debtToEquityRatio > 1.0) {
    predictions.push('من المتوقع أن تتحسن نسبة الدين إلى حقوق الملكية في المستقبل');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل رأس المال
 */
function performCapitalStructureSWOT(capitalStructure: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (capitalStructure.equityRatio >= 60) {
    swot.strengths.push('نسبة حقوق الملكية عالية');
  }

  if (capitalStructure.debtRatio <= 40) {
    swot.strengths.push('نسبة الديون منخفضة');
  }

  if (capitalStructure.debtToEquityRatio <= 0.5) {
    swot.strengths.push('نسبة الدين إلى حقوق الملكية منخفضة');
  }

  if (capitalStructure.equityRatio < 40) {
    swot.weaknesses.push('نسبة حقوق الملكية منخفضة');
  }

  if (capitalStructure.debtRatio > 60) {
    swot.weaknesses.push('نسبة الديون مرتفعة');
  }

  if (capitalStructure.debtToEquityRatio > 1.0) {
    swot.weaknesses.push('نسبة الدين إلى حقوق الملكية مرتفعة');
  }

  swot.opportunities.push('تحسين هيكل رأس المال');
  swot.opportunities.push('تحسين نسبة حقوق الملكية');
  swot.opportunities.push('تحسين نسبة الديون');

  swot.threats.push('تغيرات في هيكل رأس المال');
  swot.threats.push('تغيرات في نسبة حقوق الملكية');
  swot.threats.push('تغيرات في نسبة الديون');

  return swot;
}

/**
 * تقييم هيكل الأصول
 */
function evaluateAssetStructure(assetStructure: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم نسبة الأصول المتداولة
  if (assetStructure.currentAssetsRatio >= 20 && assetStructure.currentAssetsRatio <= 40) {
    score += 2;
  } else if (assetStructure.currentAssetsRatio > 40) {
    score += 1;
  }

  // تقييم نسبة السيولة
  if (assetStructure.liquidityRatio >= 15) {
    score += 2;
  } else if (assetStructure.liquidityRatio >= 10) {
    score += 1;
  }

  // تقييم نسبة الأصول الثابتة
  if (assetStructure.fixedAssetsRatio >= 30 && assetStructure.fixedAssetsRatio <= 60) {
    score += 2;
  } else if (assetStructure.fixedAssetsRatio > 60) {
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
  interpretation = `هيكل الأصول ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (assetStructure.currentAssetsRatio > 40) {
    interpretation += 'الأصول المتداولة مرتفعة نسبياً مما قد يؤثر على الربحية. ';
  }

  if (assetStructure.liquidityRatio < 10) {
    interpretation += 'نسبة السيولة منخفضة مما قد يؤثر على المرونة المالية. ';
  }

  if (assetStructure.fixedAssetsRatio > 60) {
    interpretation += 'الأصول الثابتة مرتفعة مما قد يؤثر على المرونة التشغيلية. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * توليد التوصيات لهيكل الأصول
 */
function generateAssetStructureRecommendations(assetStructure: any): string[] {
  const recommendations: string[] = [];

  if (assetStructure.currentAssetsRatio > 40) {
    recommendations.push('تحسين إدارة الأصول المتداولة لزيادة الكفاءة');
  }

  if (assetStructure.liquidityRatio < 10) {
    recommendations.push('زيادة نسبة السيولة لتحسين المرونة المالية');
  }

  if (assetStructure.fixedAssetsRatio > 60) {
    recommendations.push('تحسين هيكل الأصول الثابتة لزيادة المرونة التشغيلية');
  }

  return recommendations;
}

/**
 * تحديد المخاطر لهيكل الأصول
 */
function identifyAssetStructureRisks(assetStructure: any): string[] {
  const risks: string[] = [];

  if (assetStructure.currentAssetsRatio > 40) {
    risks.push('ارتفاع الأصول المتداولة قد يؤثر على الربحية');
  }

  if (assetStructure.liquidityRatio < 10) {
    risks.push('انخفاض نسبة السيولة قد يؤثر على المرونة المالية');
  }

  if (assetStructure.fixedAssetsRatio > 60) {
    risks.push('ارتفاع الأصول الثابتة قد يؤثر على المرونة التشغيلية');
  }

  return risks;
}

/**
 * توليد التوقعات لهيكل الأصول
 */
function generateAssetStructurePredictions(assetStructure: any): string[] {
  const predictions: string[] = [];

  if (assetStructure.currentAssetsRatio > 40) {
    predictions.push('من المتوقع أن تتحسن إدارة الأصول المتداولة في المستقبل');
  }

  if (assetStructure.liquidityRatio < 10) {
    predictions.push('من المتوقع أن تتحسن نسبة السيولة في المستقبل');
  }

  if (assetStructure.fixedAssetsRatio > 60) {
    predictions.push('من المتوقع أن تتحسن هيكل الأصول الثابتة في المستقبل');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل الأصول
 */
function performAssetStructureSWOT(assetStructure: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (assetStructure.currentAssetsRatio >= 20 && assetStructure.currentAssetsRatio <= 40) {
    swot.strengths.push('هيكل الأصول المتداولة متوازن');
  }

  if (assetStructure.liquidityRatio >= 15) {
    swot.strengths.push('نسبة السيولة عالية');
  }

  if (assetStructure.fixedAssetsRatio >= 30 && assetStructure.fixedAssetsRatio <= 60) {
    swot.strengths.push('هيكل الأصول الثابتة متوازن');
  }

  if (assetStructure.currentAssetsRatio > 40) {
    swot.weaknesses.push('الأصول المتداولة مرتفعة');
  }

  if (assetStructure.liquidityRatio < 10) {
    swot.weaknesses.push('نسبة السيولة منخفضة');
  }

  if (assetStructure.fixedAssetsRatio > 60) {
    swot.weaknesses.push('الأصول الثابتة مرتفعة');
  }

  swot.opportunities.push('تحسين هيكل الأصول');
  swot.opportunities.push('تحسين إدارة الأصول المتداولة');
  swot.opportunities.push('تحسين نسبة السيولة');

  swot.threats.push('تغيرات في هيكل الأصول');
  swot.threats.push('تغيرات في الأصول المتداولة');
  swot.threats.push('تغيرات في الأصول الثابتة');

  return swot;
}

/**
 * تقييم هيكل الخصوم
 */
function evaluateLiabilityStructure(liabilityStructure: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم نسبة الخصوم المتداولة
  if (liabilityStructure.currentLiabilitiesRatio <= 30) {
    score += 2;
  } else if (liabilityStructure.currentLiabilitiesRatio <= 50) {
    score += 1;
  }

  // تقييم نسبة الديون الإجمالية
  if (liabilityStructure.totalDebtRatio <= 40) {
    score += 2;
  } else if (liabilityStructure.totalDebtRatio <= 60) {
    score += 1;
  }

  // تقييم نسبة الديون طويلة الأجل
  if (liabilityStructure.longTermDebtRatio <= 30) {
    score += 2;
  } else if (liabilityStructure.longTermDebtRatio <= 50) {
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
  interpretation = `هيكل الخصوم ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (liabilityStructure.currentLiabilitiesRatio > 50) {
    interpretation += 'الخصوم المتداولة مرتفعة مما قد يؤثر على السيولة. ';
  }

  if (liabilityStructure.totalDebtRatio > 60) {
    interpretation += 'نسبة الديون الإجمالية مرتفعة مما قد يؤثر على المخاطر المالية. ';
  }

  if (liabilityStructure.longTermDebtRatio > 50) {
    interpretation += 'الديون طويلة الأجل مرتفعة مما قد يؤثر على المرونة المالية. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * توليد التوصيات لهيكل الخصوم
 */
function generateLiabilityStructureRecommendations(liabilityStructure: any): string[] {
  const recommendations: string[] = [];

  if (liabilityStructure.currentLiabilitiesRatio > 50) {
    recommendations.push('تحسين إدارة الخصوم المتداولة لتقليل المخاطر');
  }

  if (liabilityStructure.totalDebtRatio > 60) {
    recommendations.push('تقليل نسبة الديون الإجمالية لتقليل المخاطر المالية');
  }

  if (liabilityStructure.longTermDebtRatio > 50) {
    recommendations.push('تحسين هيكل الديون طويلة الأجل لزيادة المرونة المالية');
  }

  return recommendations;
}

/**
 * تحديد المخاطر لهيكل الخصوم
 */
function identifyLiabilityStructureRisks(liabilityStructure: any): string[] {
  const risks: string[] = [];

  if (liabilityStructure.currentLiabilitiesRatio > 50) {
    risks.push('ارتفاع الخصوم المتداولة قد يؤثر على السيولة');
  }

  if (liabilityStructure.totalDebtRatio > 60) {
    risks.push('ارتفاع نسبة الديون الإجمالية قد يؤثر على المخاطر المالية');
  }

  if (liabilityStructure.longTermDebtRatio > 50) {
    risks.push('ارتفاع الديون طويلة الأجل قد يؤثر على المرونة المالية');
  }

  return risks;
}

/**
 * توليد التوقعات لهيكل الخصوم
 */
function generateLiabilityStructurePredictions(liabilityStructure: any): string[] {
  const predictions: string[] = [];

  if (liabilityStructure.currentLiabilitiesRatio > 50) {
    predictions.push('من المتوقع أن تتحسن إدارة الخصوم المتداولة في المستقبل');
  }

  if (liabilityStructure.totalDebtRatio > 60) {
    predictions.push('من المتوقع أن تتحسن نسبة الديون الإجمالية في المستقبل');
  }

  if (liabilityStructure.longTermDebtRatio > 50) {
    predictions.push('من المتوقع أن تتحسن هيكل الديون طويلة الأجل في المستقبل');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل الخصوم
 */
function performLiabilityStructureSWOT(liabilityStructure: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (liabilityStructure.currentLiabilitiesRatio <= 30) {
    swot.strengths.push('الخصوم المتداولة منخفضة');
  }

  if (liabilityStructure.totalDebtRatio <= 40) {
    swot.strengths.push('نسبة الديون الإجمالية منخفضة');
  }

  if (liabilityStructure.longTermDebtRatio <= 30) {
    swot.strengths.push('الديون طويلة الأجل منخفضة');
  }

  if (liabilityStructure.currentLiabilitiesRatio > 50) {
    swot.weaknesses.push('الخصوم المتداولة مرتفعة');
  }

  if (liabilityStructure.totalDebtRatio > 60) {
    swot.weaknesses.push('نسبة الديون الإجمالية مرتفعة');
  }

  if (liabilityStructure.longTermDebtRatio > 50) {
    swot.weaknesses.push('الديون طويلة الأجل مرتفعة');
  }

  swot.opportunities.push('تحسين هيكل الخصوم');
  swot.opportunities.push('تحسين إدارة الخصوم المتداولة');
  swot.opportunities.push('تحسين نسبة الديون الإجمالية');

  swot.threats.push('تغيرات في هيكل الخصوم');
  swot.threats.push('تغيرات في الخصوم المتداولة');
  swot.threats.push('تغيرات في الديون طويلة الأجل');

  return swot;
}

/**
 * حساب معدل نمو حقوق الملكية
 */
function calculateEquityGrowthRate(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;
  
  const latestEquity = statements[statements.length - 1].balanceSheet?.totalEquity || 0;
  const previousEquity = statements[statements.length - 2].balanceSheet?.totalEquity || 0;
  
  if (previousEquity === 0) return 0;
  
  return ((latestEquity - previousEquity) / previousEquity) * 100;
}

/**
 * تقييم هيكل حقوق الملكية
 */
function evaluateEquityStructure(equityStructure: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم نسبة حقوق الملكية
  if (equityStructure.equityRatio >= 60) {
    score += 2;
  } else if (equityStructure.equityRatio >= 40) {
    score += 1;
  }

  // تقييم نسبة الأرباح المحتجزة
  if (equityStructure.retainedEarningsRatio >= 20) {
    score += 2;
  } else if (equityStructure.retainedEarningsRatio >= 10) {
    score += 1;
  }

  // تقييم معدل النمو
  if (equityStructure.equityGrowthRate >= 10) {
    score += 2;
  } else if (equityStructure.equityGrowthRate >= 5) {
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
  interpretation = `هيكل حقوق الملكية ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (equityStructure.equityRatio < 40) {
    interpretation += 'نسبة حقوق الملكية منخفضة مما قد يؤثر على الاستقرار المالي. ';
  }

  if (equityStructure.retainedEarningsRatio < 10) {
    interpretation += 'نسبة الأرباح المحتجزة منخفضة مما قد يؤثر على النمو. ';
  }

  if (equityStructure.equityGrowthRate < 5) {
    interpretation += 'معدل نمو حقوق الملكية منخفض مما قد يؤثر على التوسع. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * توليد التوصيات لهيكل حقوق الملكية
 */
function generateEquityStructureRecommendations(equityStructure: any): string[] {
  const recommendations: string[] = [];

  if (equityStructure.equityRatio < 40) {
    recommendations.push('زيادة نسبة حقوق الملكية لتحسين الاستقرار المالي');
  }

  if (equityStructure.retainedEarningsRatio < 10) {
    recommendations.push('زيادة نسبة الأرباح المحتجزة لتحسين النمو');
  }

  if (equityStructure.equityGrowthRate < 5) {
    recommendations.push('تحسين معدل نمو حقوق الملكية لتحسين التوسع');
  }

  return recommendations;
}

/**
 * تحديد المخاطر لهيكل حقوق الملكية
 */
function identifyEquityStructureRisks(equityStructure: any): string[] {
  const risks: string[] = [];

  if (equityStructure.equityRatio < 40) {
    risks.push('انخفاض نسبة حقوق الملكية قد يؤثر على الاستقرار المالي');
  }

  if (equityStructure.retainedEarningsRatio < 10) {
    risks.push('انخفاض نسبة الأرباح المحتجزة قد يؤثر على النمو');
  }

  if (equityStructure.equityGrowthRate < 5) {
    risks.push('انخفاض معدل نمو حقوق الملكية قد يؤثر على التوسع');
  }

  return risks;
}

/**
 * توليد التوقعات لهيكل حقوق الملكية
 */
function generateEquityStructurePredictions(equityStructure: any): string[] {
  const predictions: string[] = [];

  if (equityStructure.equityRatio < 40) {
    predictions.push('من المتوقع أن تتحسن نسبة حقوق الملكية في المستقبل');
  }

  if (equityStructure.retainedEarningsRatio < 10) {
    predictions.push('من المتوقع أن تتحسن نسبة الأرباح المحتجزة في المستقبل');
  }

  if (equityStructure.equityGrowthRate < 5) {
    predictions.push('من المتوقع أن يتحسن معدل نمو حقوق الملكية في المستقبل');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل حقوق الملكية
 */
function performEquityStructureSWOT(equityStructure: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (equityStructure.equityRatio >= 60) {
    swot.strengths.push('نسبة حقوق الملكية عالية');
  }

  if (equityStructure.retainedEarningsRatio >= 20) {
    swot.strengths.push('نسبة الأرباح المحتجزة عالية');
  }

  if (equityStructure.equityGrowthRate >= 10) {
    swot.strengths.push('معدل نمو حقوق الملكية عالي');
  }

  if (equityStructure.equityRatio < 40) {
    swot.weaknesses.push('نسبة حقوق الملكية منخفضة');
  }

  if (equityStructure.retainedEarningsRatio < 10) {
    swot.weaknesses.push('نسبة الأرباح المحتجزة منخفضة');
  }

  if (equityStructure.equityGrowthRate < 5) {
    swot.weaknesses.push('معدل نمو حقوق الملكية منخفض');
  }

  swot.opportunities.push('تحسين هيكل حقوق الملكية');
  swot.opportunities.push('تحسين نسبة الأرباح المحتجزة');
  swot.opportunities.push('تحسين معدل النمو');

  swot.threats.push('تغيرات في هيكل حقوق الملكية');
  swot.threats.push('تغيرات في نسبة الأرباح المحتجزة');
  swot.threats.push('تغيرات في معدل النمو');

  return swot;
}

/**
 * حساب معدل نمو الإيرادات
 */
function calculateRevenueGrowthRate(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;
  
  const latestRevenue = statements[statements.length - 1].incomeStatement?.totalRevenue || 0;
  const previousRevenue = statements[statements.length - 2].incomeStatement?.totalRevenue || 0;
  
  if (previousRevenue === 0) return 0;
  
  return ((latestRevenue - previousRevenue) / previousRevenue) * 100;
}

/**
 * حساب استقرار الإيرادات
 */
function calculateRevenueStability(statements: FinancialStatement[]): number {
  if (statements.length < 3) return 0;
  
  const revenues = statements.map(stmt => stmt.incomeStatement?.totalRevenue || 0);
  const mean = revenues.reduce((sum, rev) => sum + rev, 0) / revenues.length;
  const variance = revenues.reduce((sum, rev) => sum + Math.pow(rev - mean, 2), 0) / revenues.length;
  const standardDeviation = Math.sqrt(variance);
  
  return mean > 0 ? (standardDeviation / mean) * 100 : 0;
}

/**
 * تقييم هيكل الإيرادات
 */
function evaluateRevenueStructure(revenueStructure: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم نسبة الإيرادات التشغيلية
  if (revenueStructure.operatingRevenueRatio >= 80) {
    score += 2;
  } else if (revenueStructure.operatingRevenueRatio >= 60) {
    score += 1;
  }

  // تقييم معدل النمو
  if (revenueStructure.revenueGrowthRate >= 10) {
    score += 2;
  } else if (revenueStructure.revenueGrowthRate >= 5) {
    score += 1;
  }

  // تقييم الاستقرار
  if (revenueStructure.revenueStability <= 15) {
    score += 2;
  } else if (revenueStructure.revenueStability <= 25) {
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
  interpretation = `هيكل الإيرادات ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (revenueStructure.operatingRevenueRatio < 60) {
    interpretation += 'نسبة الإيرادات التشغيلية منخفضة مما قد يؤثر على الاستقرار. ';
  }

  if (revenueStructure.revenueGrowthRate < 5) {
    interpretation += 'معدل نمو الإيرادات منخفض مما قد يؤثر على التوسع. ';
  }

  if (revenueStructure.revenueStability > 25) {
    interpretation += 'استقرار الإيرادات منخفض مما قد يؤثر على التخطيط. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * توليد التوصيات لهيكل الإيرادات
 */
function generateRevenueStructureRecommendations(revenueStructure: any): string[] {
  const recommendations: string[] = [];

  if (revenueStructure.operatingRevenueRatio < 60) {
    recommendations.push('زيادة نسبة الإيرادات التشغيلية لتحسين الاستقرار');
  }

  if (revenueStructure.revenueGrowthRate < 5) {
    recommendations.push('تحسين معدل نمو الإيرادات لتحسين التوسع');
  }

  if (revenueStructure.revenueStability > 25) {
    recommendations.push('تحسين استقرار الإيرادات لتحسين التخطيط');
  }

  return recommendations;
}

/**
 * تحديد المخاطر لهيكل الإيرادات
 */
function identifyRevenueStructureRisks(revenueStructure: any): string[] {
  const risks: string[] = [];

  if (revenueStructure.operatingRevenueRatio < 60) {
    risks.push('انخفاض نسبة الإيرادات التشغيلية قد يؤثر على الاستقرار');
  }

  if (revenueStructure.revenueGrowthRate < 5) {
    risks.push('انخفاض معدل نمو الإيرادات قد يؤثر على التوسع');
  }

  if (revenueStructure.revenueStability > 25) {
    risks.push('انخفاض استقرار الإيرادات قد يؤثر على التخطيط');
  }

  return risks;
}

/**
 * توليد التوقعات لهيكل الإيرادات
 */
function generateRevenueStructurePredictions(revenueStructure: any): string[] {
  const predictions: string[] = [];

  if (revenueStructure.operatingRevenueRatio < 60) {
    predictions.push('من المتوقع أن تتحسن نسبة الإيرادات التشغيلية في المستقبل');
  }

  if (revenueStructure.revenueGrowthRate < 5) {
    predictions.push('من المتوقع أن يتحسن معدل نمو الإيرادات في المستقبل');
  }

  if (revenueStructure.revenueStability > 25) {
    predictions.push('من المتوقع أن يتحسن استقرار الإيرادات في المستقبل');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل الإيرادات
 */
function performRevenueStructureSWOT(revenueStructure: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (revenueStructure.operatingRevenueRatio >= 80) {
    swot.strengths.push('نسبة الإيرادات التشغيلية عالية');
  }

  if (revenueStructure.revenueGrowthRate >= 10) {
    swot.strengths.push('معدل نمو الإيرادات عالي');
  }

  if (revenueStructure.revenueStability <= 15) {
    swot.strengths.push('استقرار الإيرادات عالي');
  }

  if (revenueStructure.operatingRevenueRatio < 60) {
    swot.weaknesses.push('نسبة الإيرادات التشغيلية منخفضة');
  }

  if (revenueStructure.revenueGrowthRate < 5) {
    swot.weaknesses.push('معدل نمو الإيرادات منخفض');
  }

  if (revenueStructure.revenueStability > 25) {
    swot.weaknesses.push('استقرار الإيرادات منخفض');
  }

  swot.opportunities.push('تحسين هيكل الإيرادات');
  swot.opportunities.push('تحسين نسبة الإيرادات التشغيلية');
  swot.opportunities.push('تحسين معدل النمو');

  swot.threats.push('تغيرات في هيكل الإيرادات');
  swot.threats.push('تغيرات في نسبة الإيرادات التشغيلية');
  swot.threats.push('تغيرات في معدل النمو');

  return swot;
}

/**
 * حساب معدل نمو المصروفات
 */
function calculateExpenseGrowthRate(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;
  
  const latestExpenses = statements[statements.length - 1].incomeStatement?.operatingExpenses || 0;
  const previousExpenses = statements[statements.length - 2].incomeStatement?.operatingExpenses || 0;
  
  if (previousExpenses === 0) return 0;
  
  return ((latestExpenses - previousExpenses) / previousExpenses) * 100;
}

/**
 * حساب كفاءة المصروفات
 */
function calculateExpenseEfficiency(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;
  
  const latestStatement = statements[statements.length - 1];
  const revenue = latestStatement.incomeStatement?.totalRevenue || 0;
  const expenses = latestStatement.incomeStatement?.operatingExpenses || 0;
  
  if (revenue === 0) return 0;
  
  return ((revenue - expenses) / revenue) * 100;
}

/**
 * تقييم هيكل المصروفات
 */
function evaluateExpenseStructure(expenseStructure: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم نسبة تكلفة البضاعة المباعة
  if (expenseStructure.costOfGoodsSoldRatio <= 60) {
    score += 2;
  } else if (expenseStructure.costOfGoodsSoldRatio <= 70) {
    score += 1;
  }

  // تقييم نسبة المصروفات التشغيلية
  if (expenseStructure.operatingExpensesRatio <= 20) {
    score += 2;
  } else if (expenseStructure.operatingExpensesRatio <= 30) {
    score += 1;
  }

  // تقييم كفاءة المصروفات
  if (expenseStructure.expenseEfficiency >= 20) {
    score += 2;
  } else if (expenseStructure.expenseEfficiency >= 10) {
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
  interpretation = `هيكل المصروفات ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (expenseStructure.costOfGoodsSoldRatio > 70) {
    interpretation += 'نسبة تكلفة البضاعة المباعة مرتفعة مما قد يؤثر على الربحية. ';
  }

  if (expenseStructure.operatingExpensesRatio > 30) {
    interpretation += 'نسبة المصروفات التشغيلية مرتفعة مما قد يؤثر على الكفاءة. ';
  }

  if (expenseStructure.expenseEfficiency < 10) {
    interpretation += 'كفاءة المصروفات منخفضة مما قد يؤثر على الربحية. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * توليد التوصيات لهيكل المصروفات
 */
function generateExpenseStructureRecommendations(expenseStructure: any): string[] {
  const recommendations: string[] = [];

  if (expenseStructure.costOfGoodsSoldRatio > 70) {
    recommendations.push('تحسين نسبة تكلفة البضاعة المباعة لتحسين الربحية');
  }

  if (expenseStructure.operatingExpensesRatio > 30) {
    recommendations.push('تحسين نسبة المصروفات التشغيلية لتحسين الكفاءة');
  }

  if (expenseStructure.expenseEfficiency < 10) {
    recommendations.push('تحسين كفاءة المصروفات لتحسين الربحية');
  }

  return recommendations;
}

/**
 * تحديد المخاطر لهيكل المصروفات
 */
function identifyExpenseStructureRisks(expenseStructure: any): string[] {
  const risks: string[] = [];

  if (expenseStructure.costOfGoodsSoldRatio > 70) {
    risks.push('ارتفاع نسبة تكلفة البضاعة المباعة قد يؤثر على الربحية');
  }

  if (expenseStructure.operatingExpensesRatio > 30) {
    risks.push('ارتفاع نسبة المصروفات التشغيلية قد يؤثر على الكفاءة');
  }

  if (expenseStructure.expenseEfficiency < 10) {
    risks.push('انخفاض كفاءة المصروفات قد يؤثر على الربحية');
  }

  return risks;
}

/**
 * توليد التوقعات لهيكل المصروفات
 */
function generateExpenseStructurePredictions(expenseStructure: any): string[] {
  const predictions: string[] = [];

  if (expenseStructure.costOfGoodsSoldRatio > 70) {
    predictions.push('من المتوقع أن تتحسن نسبة تكلفة البضاعة المباعة في المستقبل');
  }

  if (expenseStructure.operatingExpensesRatio > 30) {
    predictions.push('من المتوقع أن تتحسن نسبة المصروفات التشغيلية في المستقبل');
  }

  if (expenseStructure.expenseEfficiency < 10) {
    predictions.push('من المتوقع أن تتحسن كفاءة المصروفات في المستقبل');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل المصروفات
 */
function performExpenseStructureSWOT(expenseStructure: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (expenseStructure.costOfGoodsSoldRatio <= 60) {
    swot.strengths.push('نسبة تكلفة البضاعة المباعة منخفضة');
  }

  if (expenseStructure.operatingExpensesRatio <= 20) {
    swot.strengths.push('نسبة المصروفات التشغيلية منخفضة');
  }

  if (expenseStructure.expenseEfficiency >= 20) {
    swot.strengths.push('كفاءة المصروفات عالية');
  }

  if (expenseStructure.costOfGoodsSoldRatio > 70) {
    swot.weaknesses.push('نسبة تكلفة البضاعة المباعة مرتفعة');
  }

  if (expenseStructure.operatingExpensesRatio > 30) {
    swot.weaknesses.push('نسبة المصروفات التشغيلية مرتفعة');
  }

  if (expenseStructure.expenseEfficiency < 10) {
    swot.weaknesses.push('كفاءة المصروفات منخفضة');
  }

  swot.opportunities.push('تحسين هيكل المصروفات');
  swot.opportunities.push('تحسين نسبة تكلفة البضاعة المباعة');
  swot.opportunities.push('تحسين نسبة المصروفات التشغيلية');

  swot.threats.push('تغيرات في هيكل المصروفات');
  swot.threats.push('تغيرات في نسبة تكلفة البضاعة المباعة');
  swot.threats.push('تغيرات في نسبة المصروفات التشغيلية');

  return swot;
}

/**
 * حساب جودة التدفق النقدي
 */
function calculateCashFlowQuality(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;
  
  const latestStatement = statements[statements.length - 1];
  const operatingCashFlow = latestStatement.cashFlowStatement?.operatingCashFlow || 0;
  const netIncome = latestStatement.incomeStatement?.netProfit || 0;
  
  if (netIncome === 0) return 0;
  
  return (operatingCashFlow / netIncome) * 100;
}

/**
 * حساب استقرار التدفق النقدي
 */
function calculateCashFlowStability(statements: FinancialStatement[]): number {
  if (statements.length < 3) return 0;
  
  const cashFlows = statements.map(stmt => stmt.cashFlowStatement?.operatingCashFlow || 0);
  const mean = cashFlows.reduce((sum, cf) => sum + cf, 0) / cashFlows.length;
  const variance = cashFlows.reduce((sum, cf) => sum + Math.pow(cf - mean, 2), 0) / cashFlows.length;
  const standardDeviation = Math.sqrt(variance);
  
  return mean > 0 ? (standardDeviation / mean) * 100 : 0;
}

/**
 * تقييم هيكل التدفق النقدي التشغيلي
 */
function evaluateOperatingCashFlowStructure(operatingCashFlowStructure: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم نسبة التدفق النقدي التشغيلي
  if (operatingCashFlowStructure.operatingCashFlowRatio >= 100) {
    score += 2;
  } else if (operatingCashFlowStructure.operatingCashFlowRatio >= 80) {
    score += 1;
  }

  // تقييم جودة التدفق النقدي
  if (operatingCashFlowStructure.cashFlowQuality >= 100) {
    score += 2;
  } else if (operatingCashFlowStructure.cashFlowQuality >= 80) {
    score += 1;
  }

  // تقييم استقرار التدفق النقدي
  if (operatingCashFlowStructure.cashFlowStability <= 20) {
    score += 2;
  } else if (operatingCashFlowStructure.cashFlowStability <= 30) {
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
  interpretation = `هيكل التدفق النقدي التشغيلي ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (operatingCashFlowStructure.operatingCashFlowRatio < 80) {
    interpretation += 'نسبة التدفق النقدي التشغيلي منخفضة مما قد يؤثر على السيولة. ';
  }

  if (operatingCashFlowStructure.cashFlowQuality < 80) {
    interpretation += 'جودة التدفق النقدي منخفضة مما قد يؤثر على الربحية. ';
  }

  if (operatingCashFlowStructure.cashFlowStability > 30) {
    interpretation += 'استقرار التدفق النقدي منخفض مما قد يؤثر على التخطيط. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * توليد التوصيات لهيكل التدفق النقدي التشغيلي
 */
function generateOperatingCashFlowStructureRecommendations(operatingCashFlowStructure: any): string[] {
  const recommendations: string[] = [];

  if (operatingCashFlowStructure.operatingCashFlowRatio < 80) {
    recommendations.push('تحسين نسبة التدفق النقدي التشغيلي لتحسين السيولة');
  }

  if (operatingCashFlowStructure.cashFlowQuality < 80) {
    recommendations.push('تحسين جودة التدفق النقدي لتحسين الربحية');
  }

  if (operatingCashFlowStructure.cashFlowStability > 30) {
    recommendations.push('تحسين استقرار التدفق النقدي لتحسين التخطيط');
  }

  return recommendations;
}

/**
 * تحديد المخاطر لهيكل التدفق النقدي التشغيلي
 */
function identifyOperatingCashFlowStructureRisks(operatingCashFlowStructure: any): string[] {
  const risks: string[] = [];

  if (operatingCashFlowStructure.operatingCashFlowRatio < 80) {
    risks.push('انخفاض نسبة التدفق النقدي التشغيلي قد يؤثر على السيولة');
  }

  if (operatingCashFlowStructure.cashFlowQuality < 80) {
    risks.push('انخفاض جودة التدفق النقدي قد يؤثر على الربحية');
  }

  if (operatingCashFlowStructure.cashFlowStability > 30) {
    risks.push('انخفاض استقرار التدفق النقدي قد يؤثر على التخطيط');
  }

  return risks;
}

/**
 * توليد التوقعات لهيكل التدفق النقدي التشغيلي
 */
function generateOperatingCashFlowStructurePredictions(operatingCashFlowStructure: any): string[] {
  const predictions: string[] = [];

  if (operatingCashFlowStructure.operatingCashFlowRatio < 80) {
    predictions.push('من المتوقع أن تتحسن نسبة التدفق النقدي التشغيلي في المستقبل');
  }

  if (operatingCashFlowStructure.cashFlowQuality < 80) {
    predictions.push('من المتوقع أن تتحسن جودة التدفق النقدي في المستقبل');
  }

  if (operatingCashFlowStructure.cashFlowStability > 30) {
    predictions.push('من المتوقع أن يتحسن استقرار التدفق النقدي في المستقبل');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل التدفق النقدي التشغيلي
 */
function performOperatingCashFlowStructureSWOT(operatingCashFlowStructure: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (operatingCashFlowStructure.operatingCashFlowRatio >= 100) {
    swot.strengths.push('نسبة التدفق النقدي التشغيلي عالية');
  }

  if (operatingCashFlowStructure.cashFlowQuality >= 100) {
    swot.strengths.push('جودة التدفق النقدي عالية');
  }

  if (operatingCashFlowStructure.cashFlowStability <= 20) {
    swot.strengths.push('استقرار التدفق النقدي عالي');
  }

  if (operatingCashFlowStructure.operatingCashFlowRatio < 80) {
    swot.weaknesses.push('نسبة التدفق النقدي التشغيلي منخفضة');
  }

  if (operatingCashFlowStructure.cashFlowQuality < 80) {
    swot.weaknesses.push('جودة التدفق النقدي منخفضة');
  }

  if (operatingCashFlowStructure.cashFlowStability > 30) {
    swot.weaknesses.push('استقرار التدفق النقدي منخفض');
  }

  swot.opportunities.push('تحسين هيكل التدفق النقدي التشغيلي');
  swot.opportunities.push('تحسين نسبة التدفق النقدي التشغيلي');
  swot.opportunities.push('تحسين جودة التدفق النقدي');

  swot.threats.push('تغيرات في هيكل التدفق النقدي التشغيلي');
  swot.threats.push('تغيرات في نسبة التدفق النقدي التشغيلي');
  swot.threats.push('تغيرات في جودة التدفق النقدي');

  return swot;
}

/**
 * تحليل هيكل رأس المال
 */
async function analyzeCapitalStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.balanceSheet) {
    return createErrorResult('تحليل هيكل رأس المال', 'بيانات الميزانية العمومية غير متوفرة');
  }

  const balanceSheet = latestStatement.balanceSheet;
  const totalAssets = balanceSheet.totalAssets || 0;
  const totalEquity = balanceSheet.totalEquity || 0;
  const longTermDebt = balanceSheet.longTermDebt || 0;
  const shortTermDebt = balanceSheet.shortTermDebt || 0;

  // حساب هيكل رأس المال
  const capitalStructure = {
    equityRatio: totalEquity / totalAssets * 100,
    debtRatio: (longTermDebt + shortTermDebt) / totalAssets * 100,
    longTermDebtRatio: longTermDebt / totalAssets * 100,
    shortTermDebtRatio: shortTermDebt / totalAssets * 100,
    debtToEquityRatio: (longTermDebt + shortTermDebt) / totalEquity * 100
  };

  // تقييم الهيكل
  const evaluation = evaluateCapitalStructure(capitalStructure);

  return {
    id: 'capital-structure',
    name: 'تحليل هيكل رأس المال',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل رأس المال وتوزيع حقوق الملكية والديون',
    results: {
      capitalStructure,
      evaluation
    },
    charts: [
      {
        type: 'pie',
        title: 'هيكل رأس المال',
        data: [
          { label: 'حقوق الملكية', value: capitalStructure.equityRatio },
          { label: 'الديون طويلة الأجل', value: capitalStructure.longTermDebtRatio },
          { label: 'الديون قصيرة الأجل', value: capitalStructure.shortTermDebtRatio }
        ]
      }
    ],
    recommendations: generateCapitalStructureRecommendations(capitalStructure),
    risks: identifyCapitalStructureRisks(capitalStructure),
    predictions: generateCapitalStructurePredictions(capitalStructure),
    swot: performCapitalStructureSWOT(capitalStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
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
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.balanceSheet) {
    return createErrorResult('تحليل هيكل الأصول', 'بيانات الميزانية العمومية غير متوفرة');
  }

  const balanceSheet = latestStatement.balanceSheet;
  const totalAssets = balanceSheet.totalAssets || 0;
  const currentAssets = balanceSheet.currentAssets || 0;
  const nonCurrentAssets = balanceSheet.nonCurrentAssets || 0;
  const fixedAssets = balanceSheet.fixedAssets || 0;
  const intangibleAssets = balanceSheet.intangibleAssets || 0;
  const inventory = balanceSheet.inventory || 0;
  const accountsReceivable = balanceSheet.accountsReceivable || 0;
  const cash = balanceSheet.cash || 0;

  // حساب هيكل الأصول
  const assetStructure = {
    currentAssetsRatio: currentAssets / totalAssets * 100,
    nonCurrentAssetsRatio: nonCurrentAssets / totalAssets * 100,
    fixedAssetsRatio: fixedAssets / totalAssets * 100,
    intangibleAssetsRatio: intangibleAssets / totalAssets * 100,
    inventoryRatio: inventory / totalAssets * 100,
    accountsReceivableRatio: accountsReceivable / totalAssets * 100,
    cashRatio: cash / totalAssets * 100,
    liquidityRatio: (cash + accountsReceivable) / totalAssets * 100
  };

  // تقييم الهيكل
  const evaluation = evaluateAssetStructure(assetStructure);

  return {
    id: 'asset-structure',
    name: 'تحليل هيكل الأصول',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل الأصول وتوزيع الأصول المتداولة وغير المتداولة',
    results: {
      assetStructure,
      evaluation
    },
    charts: [
      {
        type: 'pie',
        title: 'توزيع الأصول',
        data: [
          { label: 'الأصول المتداولة', value: assetStructure.currentAssetsRatio },
          { label: 'الأصول غير المتداولة', value: assetStructure.nonCurrentAssetsRatio }
        ]
      },
      {
        type: 'bar',
        title: 'تفصيل الأصول المتداولة',
        data: [
          { label: 'النقدية', value: assetStructure.cashRatio },
          { label: 'الذمم المدينة', value: assetStructure.accountsReceivableRatio },
          { label: 'المخزون', value: assetStructure.inventoryRatio }
        ]
      }
    ],
    recommendations: generateAssetStructureRecommendations(assetStructure),
    risks: identifyAssetStructureRisks(assetStructure),
    predictions: generateAssetStructurePredictions(assetStructure),
    swot: performAssetStructureSWOT(assetStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
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
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.balanceSheet) {
    return createErrorResult('تحليل هيكل الخصوم', 'بيانات الميزانية العمومية غير متوفرة');
  }

  const balanceSheet = latestStatement.balanceSheet;
  const totalAssets = balanceSheet.totalAssets || 0;
  const currentLiabilities = balanceSheet.currentLiabilities || 0;
  const nonCurrentLiabilities = balanceSheet.nonCurrentLiabilities || 0;
  const longTermDebt = balanceSheet.longTermDebt || 0;
  const shortTermDebt = balanceSheet.shortTermDebt || 0;
  const accountsPayable = balanceSheet.accountsPayable || 0;
  const accruedExpenses = balanceSheet.accruedExpenses || 0;

  // حساب هيكل الخصوم
  const liabilityStructure = {
    currentLiabilitiesRatio: currentLiabilities / totalAssets * 100,
    nonCurrentLiabilitiesRatio: nonCurrentLiabilities / totalAssets * 100,
    longTermDebtRatio: longTermDebt / totalAssets * 100,
    shortTermDebtRatio: shortTermDebt / totalAssets * 100,
    accountsPayableRatio: accountsPayable / totalAssets * 100,
    accruedExpensesRatio: accruedExpenses / totalAssets * 100,
    totalDebtRatio: (longTermDebt + shortTermDebt) / totalAssets * 100
  };

  // تقييم الهيكل
  const evaluation = evaluateLiabilityStructure(liabilityStructure);

  return {
    id: 'liability-structure',
    name: 'تحليل هيكل الخصوم',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل الخصوم وتوزيع الخصوم المتداولة وغير المتداولة',
    results: {
      liabilityStructure,
      evaluation
    },
    charts: [
      {
        type: 'pie',
        title: 'توزيع الخصوم',
        data: [
          { label: 'الخصوم المتداولة', value: liabilityStructure.currentLiabilitiesRatio },
          { label: 'الخصوم غير المتداولة', value: liabilityStructure.nonCurrentLiabilitiesRatio }
        ]
      },
      {
        type: 'bar',
        title: 'تفصيل الخصوم المتداولة',
        data: [
          { label: 'الديون قصيرة الأجل', value: liabilityStructure.shortTermDebtRatio },
          { label: 'الذمم الدائنة', value: liabilityStructure.accountsPayableRatio },
          { label: 'المصروفات المستحقة', value: liabilityStructure.accruedExpensesRatio }
        ]
      }
    ],
    recommendations: generateLiabilityStructureRecommendations(liabilityStructure),
    risks: identifyLiabilityStructureRisks(liabilityStructure),
    predictions: generateLiabilityStructurePredictions(liabilityStructure),
    swot: performLiabilityStructureSWOT(liabilityStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
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
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.balanceSheet) {
    return createErrorResult('تحليل هيكل حقوق الملكية', 'بيانات الميزانية العمومية غير متوفرة');
  }

  const balanceSheet = latestStatement.balanceSheet;
  const totalAssets = balanceSheet.totalAssets || 0;
  const totalEquity = balanceSheet.totalEquity || 0;
  const shareCapital = balanceSheet.shareCapital || 0;
  const retainedEarnings = balanceSheet.retainedEarnings || 0;
  const otherEquity = balanceSheet.otherEquity || 0;
  const treasuryStock = balanceSheet.treasuryStock || 0;

  // حساب هيكل حقوق الملكية
  const equityStructure = {
    equityRatio: totalEquity / totalAssets * 100,
    shareCapitalRatio: shareCapital / totalAssets * 100,
    retainedEarningsRatio: retainedEarnings / totalAssets * 100,
    otherEquityRatio: otherEquity / totalAssets * 100,
    treasuryStockRatio: treasuryStock / totalAssets * 100,
    equityGrowthRate: calculateEquityGrowthRate(statements)
  };

  // تقييم الهيكل
  const evaluation = evaluateEquityStructure(equityStructure);

  return {
    id: 'equity-structure',
    name: 'تحليل هيكل حقوق الملكية',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل حقوق الملكية وتوزيع مكونات حقوق الملكية',
    results: {
      equityStructure,
      evaluation
    },
    charts: [
      {
        type: 'pie',
        title: 'توزيع حقوق الملكية',
        data: [
          { label: 'رأس المال', value: equityStructure.shareCapitalRatio },
          { label: 'الأرباح المحتجزة', value: equityStructure.retainedEarningsRatio },
          { label: 'حقوق الملكية الأخرى', value: equityStructure.otherEquityRatio }
        ]
      },
      {
        type: 'line',
        title: 'نمو حقوق الملكية',
        data: statements.map((stmt, index) => ({
          label: `السنة ${index + 1}`,
          value: stmt.balanceSheet?.totalEquity || 0
        }))
      }
    ],
    recommendations: generateEquityStructureRecommendations(equityStructure),
    risks: identifyEquityStructureRisks(equityStructure),
    predictions: generateEquityStructurePredictions(equityStructure),
    swot: performEquityStructureSWOT(equityStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
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
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.incomeStatement) {
    return createErrorResult('تحليل هيكل الإيرادات', 'بيانات قائمة الدخل غير متوفرة');
  }

  const incomeStatement = latestStatement.incomeStatement;
  const totalRevenue = incomeStatement.totalRevenue || 0;
  const operatingRevenue = incomeStatement.operatingRevenue || 0;
  const nonOperatingRevenue = incomeStatement.nonOperatingRevenue || 0;
  const otherRevenue = incomeStatement.otherRevenue || 0;

  // حساب هيكل الإيرادات
  const revenueStructure = {
    operatingRevenueRatio: operatingRevenue / totalRevenue * 100,
    nonOperatingRevenueRatio: nonOperatingRevenue / totalRevenue * 100,
    otherRevenueRatio: otherRevenue / totalRevenue * 100,
    revenueGrowthRate: calculateRevenueGrowthRate(statements),
    revenueStability: calculateRevenueStability(statements)
  };

  // تقييم الهيكل
  const evaluation = evaluateRevenueStructure(revenueStructure);

  return {
    id: 'revenue-structure',
    name: 'تحليل هيكل الإيرادات',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل الإيرادات وتوزيع مصادر الإيرادات',
    results: {
      revenueStructure,
      evaluation
    },
    charts: [
      {
        type: 'pie',
        title: 'توزيع الإيرادات',
        data: [
          { label: 'الإيرادات التشغيلية', value: revenueStructure.operatingRevenueRatio },
          { label: 'الإيرادات غير التشغيلية', value: revenueStructure.nonOperatingRevenueRatio },
          { label: 'الإيرادات الأخرى', value: revenueStructure.otherRevenueRatio }
        ]
      },
      {
        type: 'line',
        title: 'نمو الإيرادات',
        data: statements.map((stmt, index) => ({
          label: `السنة ${index + 1}`,
          value: stmt.incomeStatement?.totalRevenue || 0
        }))
      }
    ],
    recommendations: generateRevenueStructureRecommendations(revenueStructure),
    risks: identifyRevenueStructureRisks(revenueStructure),
    predictions: generateRevenueStructurePredictions(revenueStructure),
    swot: performRevenueStructureSWOT(revenueStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
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
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.incomeStatement) {
    return createErrorResult('تحليل هيكل المصروفات', 'بيانات قائمة الدخل غير متوفرة');
  }

  const incomeStatement = latestStatement.incomeStatement;
  const totalRevenue = incomeStatement.totalRevenue || 0;
  const costOfGoodsSold = incomeStatement.costOfGoodsSold || 0;
  const operatingExpenses = incomeStatement.operatingExpenses || 0;
  const sellingExpenses = incomeStatement.sellingExpenses || 0;
  const administrativeExpenses = incomeStatement.administrativeExpenses || 0;
  const otherExpenses = incomeStatement.otherExpenses || 0;

  // حساب هيكل المصروفات
  const expenseStructure = {
    costOfGoodsSoldRatio: costOfGoodsSold / totalRevenue * 100,
    operatingExpensesRatio: operatingExpenses / totalRevenue * 100,
    sellingExpensesRatio: sellingExpenses / totalRevenue * 100,
    administrativeExpensesRatio: administrativeExpenses / totalRevenue * 100,
    otherExpensesRatio: otherExpenses / totalRevenue * 100,
    expenseGrowthRate: calculateExpenseGrowthRate(statements),
    expenseEfficiency: calculateExpenseEfficiency(statements)
  };

  // تقييم الهيكل
  const evaluation = evaluateExpenseStructure(expenseStructure);

  return {
    id: 'expense-structure',
    name: 'تحليل هيكل المصروفات',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل المصروفات وتوزيع أنواع المصروفات',
    results: {
      expenseStructure,
      evaluation
    },
    charts: [
      {
        type: 'pie',
        title: 'توزيع المصروفات',
        data: [
          { label: 'تكلفة البضاعة المباعة', value: expenseStructure.costOfGoodsSoldRatio },
          { label: 'المصروفات التشغيلية', value: expenseStructure.operatingExpensesRatio },
          { label: 'المصروفات الأخرى', value: expenseStructure.otherExpensesRatio }
        ]
      },
      {
        type: 'bar',
        title: 'تفصيل المصروفات التشغيلية',
        data: [
          { label: 'مصروفات البيع', value: expenseStructure.sellingExpensesRatio },
          { label: 'مصروفات الإدارة', value: expenseStructure.administrativeExpensesRatio }
        ]
      }
    ],
    recommendations: generateExpenseStructureRecommendations(expenseStructure),
    risks: identifyExpenseStructureRisks(expenseStructure),
    predictions: generateExpenseStructurePredictions(expenseStructure),
    swot: performExpenseStructureSWOT(expenseStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
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
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.cashFlowStatement) {
    return createErrorResult('تحليل هيكل التدفق النقدي التشغيلي', 'بيانات قائمة التدفق النقدي غير متوفرة');
  }

  const cashFlowStatement = latestStatement.cashFlowStatement;
  const operatingCashFlow = cashFlowStatement.operatingCashFlow || 0;
  const netIncome = latestStatement.incomeStatement?.netProfit || 0;
  const depreciation = cashFlowStatement.depreciation || 0;
  const workingCapitalChange = cashFlowStatement.workingCapitalChange || 0;

  // حساب هيكل التدفق النقدي التشغيلي
  const operatingCashFlowStructure = {
    operatingCashFlowRatio: operatingCashFlow / Math.abs(netIncome) * 100,
    depreciationRatio: depreciation / Math.abs(operatingCashFlow) * 100,
    workingCapitalChangeRatio: workingCapitalChange / Math.abs(operatingCashFlow) * 100,
    cashFlowQuality: calculateCashFlowQuality(statements),
    cashFlowStability: calculateCashFlowStability(statements)
  };

  // تقييم الهيكل
  const evaluation = evaluateOperatingCashFlowStructure(operatingCashFlowStructure);

  return {
    id: 'operating-cash-flow-structure',
    name: 'تحليل هيكل التدفق النقدي التشغيلي',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل التدفق النقدي التشغيلي ومكوناته',
    results: {
      operatingCashFlowStructure,
      evaluation
    },
    charts: [
      {
        type: 'bar',
        title: 'مكونات التدفق النقدي التشغيلي',
        data: [
          { label: 'صافي الدخل', value: netIncome },
          { label: 'الإهلاك', value: depreciation },
          { label: 'تغير رأس المال العامل', value: workingCapitalChange },
          { label: 'التدفق النقدي التشغيلي', value: operatingCashFlow }
        ]
      },
      {
        type: 'line',
        title: 'نمو التدفق النقدي التشغيلي',
        data: statements.map((stmt, index) => ({
          label: `السنة ${index + 1}`,
          value: stmt.cashFlowStatement?.operatingCashFlow || 0
        }))
      }
    ],
    recommendations: generateOperatingCashFlowStructureRecommendations(operatingCashFlowStructure),
    risks: identifyOperatingCashFlowStructureRisks(operatingCashFlowStructure),
    predictions: generateOperatingCashFlowStructurePredictions(operatingCashFlowStructure),
    swot: performOperatingCashFlowStructureSWOT(operatingCashFlowStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
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
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.cashFlowStatement) {
    return createErrorResult('تحليل هيكل التدفق النقدي الاستثماري', 'بيانات قائمة التدفق النقدي غير متوفرة');
  }

  const cashFlowStatement = latestStatement.cashFlowStatement;
  const investingCashFlow = cashFlowStatement.investingCashFlow || 0;
  const capitalExpenditures = cashFlowStatement.capitalExpenditures || 0;
  const assetPurchases = cashFlowStatement.assetPurchases || 0;
  const assetSales = cashFlowStatement.assetSales || 0;
  const investmentPurchases = cashFlowStatement.investmentPurchases || 0;
  const investmentSales = cashFlowStatement.investmentSales || 0;

  // حساب هيكل التدفق النقدي الاستثماري
  const investingCashFlowStructure = {
    investingCashFlowRatio: investingCashFlow / Math.abs(investingCashFlow) * 100,
    capitalExpendituresRatio: capitalExpenditures / Math.abs(investingCashFlow) * 100,
    assetPurchasesRatio: assetPurchases / Math.abs(investingCashFlow) * 100,
    assetSalesRatio: assetSales / Math.abs(investingCashFlow) * 100,
    investmentPurchasesRatio: investmentPurchases / Math.abs(investingCashFlow) * 100,
    investmentSalesRatio: investmentSales / Math.abs(investingCashFlow) * 100,
    investmentEfficiency: calculateInvestmentEfficiency(statements),
    investmentGrowth: calculateInvestmentGrowth(statements)
  };

  // تقييم الهيكل
  const evaluation = evaluateInvestingCashFlowStructure(investingCashFlowStructure);

  return {
    id: 'investing-cash-flow-structure',
    name: 'تحليل هيكل التدفق النقدي الاستثماري',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل التدفق النقدي الاستثماري ومكوناته',
    results: {
      investingCashFlowStructure,
      evaluation
    },
    charts: [
      {
        type: 'bar',
        title: 'مكونات التدفق النقدي الاستثماري',
        data: [
          { label: 'الاستثمارات الرأسمالية', value: capitalExpenditures },
          { label: 'شراء الأصول', value: assetPurchases },
          { label: 'بيع الأصول', value: assetSales },
          { label: 'شراء الاستثمارات', value: investmentPurchases },
          { label: 'بيع الاستثمارات', value: investmentSales }
        ]
      },
      {
        type: 'line',
        title: 'نمو التدفق النقدي الاستثماري',
        data: statements.map((stmt, index) => ({
          label: `السنة ${index + 1}`,
          value: stmt.cashFlowStatement?.investingCashFlow || 0
        }))
      }
    ],
    recommendations: generateInvestingCashFlowStructureRecommendations(investingCashFlowStructure),
    risks: identifyInvestingCashFlowStructureRisks(investingCashFlowStructure),
    predictions: generateInvestingCashFlowStructurePredictions(investingCashFlowStructure),
    swot: performInvestingCashFlowStructureSWOT(investingCashFlowStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
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
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.cashFlowStatement) {
    return createErrorResult('تحليل هيكل التدفق النقدي التمويلي', 'بيانات قائمة التدفق النقدي غير متوفرة');
  }

  const cashFlowStatement = latestStatement.cashFlowStatement;
  const financingCashFlow = cashFlowStatement.financingCashFlow || 0;
  const debtIssuance = cashFlowStatement.debtIssuance || 0;
  const debtRepayment = cashFlowStatement.debtRepayment || 0;
  const equityIssuance = cashFlowStatement.equityIssuance || 0;
  const dividendPayments = cashFlowStatement.dividendPayments || 0;
  const shareRepurchases = cashFlowStatement.shareRepurchases || 0;

  // حساب هيكل التدفق النقدي التمويلي
  const financingCashFlowStructure = {
    financingCashFlowRatio: financingCashFlow / Math.abs(financingCashFlow) * 100,
    debtIssuanceRatio: debtIssuance / Math.abs(financingCashFlow) * 100,
    debtRepaymentRatio: debtRepayment / Math.abs(financingCashFlow) * 100,
    equityIssuanceRatio: equityIssuance / Math.abs(financingCashFlow) * 100,
    dividendPaymentsRatio: dividendPayments / Math.abs(financingCashFlow) * 100,
    shareRepurchasesRatio: shareRepurchases / Math.abs(financingCashFlow) * 100,
    financingEfficiency: calculateFinancingEfficiency(statements),
    financingStability: calculateFinancingStability(statements)
  };

  // تقييم الهيكل
  const evaluation = evaluateFinancingCashFlowStructure(financingCashFlowStructure);

  return {
    id: 'financing-cash-flow-structure',
    name: 'تحليل هيكل التدفق النقدي التمويلي',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل التدفق النقدي التمويلي ومكوناته',
    results: {
      financingCashFlowStructure,
      evaluation
    },
    charts: [
      {
        type: 'bar',
        title: 'مكونات التدفق النقدي التمويلي',
        data: [
          { label: 'إصدار الديون', value: debtIssuance },
          { label: 'سداد الديون', value: debtRepayment },
          { label: 'إصدار الأسهم', value: equityIssuance },
          { label: 'توزيعات الأرباح', value: dividendPayments },
          { label: 'إعادة شراء الأسهم', value: shareRepurchases }
        ]
      },
      {
        type: 'line',
        title: 'نمو التدفق النقدي التمويلي',
        data: statements.map((stmt, index) => ({
          label: `السنة ${index + 1}`,
          value: stmt.cashFlowStatement?.financingCashFlow || 0
        }))
      }
    ],
    recommendations: generateFinancingCashFlowStructureRecommendations(financingCashFlowStructure),
    risks: identifyFinancingCashFlowStructureRisks(financingCashFlowStructure),
    predictions: generateFinancingCashFlowStructurePredictions(financingCashFlowStructure),
    swot: performFinancingCashFlowStructureSWOT(financingCashFlowStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

/**
 * تحليل هيكل رأس المال العامل
 */
async function analyzeWorkingCapitalStructure(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.balanceSheet) {
    return createErrorResult('تحليل هيكل رأس المال العامل', 'بيانات الميزانية العمومية غير متوفرة');
  }

  const balanceSheet = latestStatement.balanceSheet;
  const currentAssets = balanceSheet.currentAssets || 0;
  const currentLiabilities = balanceSheet.currentLiabilities || 0;
  const workingCapital = currentAssets - currentLiabilities;
  const cash = balanceSheet.cash || 0;
  const accountsReceivable = balanceSheet.accountsReceivable || 0;
  const inventory = balanceSheet.inventory || 0;
  const accountsPayable = balanceSheet.accountsPayable || 0;
  const shortTermDebt = balanceSheet.shortTermDebt || 0;

  // حساب هيكل رأس المال العامل
  const workingCapitalStructure = {
    workingCapital,
    currentAssets,
    currentLiabilities,
    cashRatio: cash / currentAssets * 100,
    accountsReceivableRatio: accountsReceivable / currentAssets * 100,
    inventoryRatio: inventory / currentAssets * 100,
    accountsPayableRatio: accountsPayable / currentLiabilities * 100,
    shortTermDebtRatio: shortTermDebt / currentLiabilities * 100,
    workingCapitalTurnover: calculateWorkingCapitalTurnover(statements),
    workingCapitalEfficiency: calculateWorkingCapitalEfficiency(statements)
  };

  // تقييم الهيكل
  const evaluation = evaluateWorkingCapitalStructure(workingCapitalStructure);

  return {
    id: 'working-capital-structure',
    name: 'تحليل هيكل رأس المال العامل',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل رأس المال العامل ومكوناته',
    results: {
      workingCapitalStructure,
      evaluation
    },
    charts: [
      {
        type: 'bar',
        title: 'مكونات الأصول المتداولة',
        data: [
          { label: 'النقدية', value: cash },
          { label: 'الذمم المدينة', value: accountsReceivable },
          { label: 'المخزون', value: inventory },
          { label: 'أصول متداولة أخرى', value: currentAssets - cash - accountsReceivable - inventory }
        ]
      },
      {
        type: 'bar',
        title: 'مكونات الخصوم المتداولة',
        data: [
          { label: 'الذمم الدائنة', value: accountsPayable },
          { label: 'الديون قصيرة الأجل', value: shortTermDebt },
          { label: 'خصوم متداولة أخرى', value: currentLiabilities - accountsPayable - shortTermDebt }
        ]
      }
    ],
    recommendations: generateWorkingCapitalStructureRecommendations(workingCapitalStructure),
    risks: identifyWorkingCapitalStructureRisks(workingCapitalStructure),
    predictions: generateWorkingCapitalStructurePredictions(workingCapitalStructure),
    swot: performWorkingCapitalStructureSWOT(workingCapitalStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
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
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.balanceSheet) {
    return createErrorResult('تحليل هيكل الاستثمارات', 'بيانات الميزانية العمومية غير متوفرة');
  }

  const balanceSheet = latestStatement.balanceSheet;
  const totalAssets = balanceSheet.totalAssets || 0;
  const fixedAssets = balanceSheet.fixedAssets || 0;
  const investments = balanceSheet.investments || 0;
  const intangibleAssets = balanceSheet.intangibleAssets || 0;
  const otherAssets = balanceSheet.otherAssets || 0;

  // حساب هيكل الاستثمارات
  const investmentStructure = {
    totalAssets,
    fixedAssets,
    investments,
    intangibleAssets,
    otherAssets,
    fixedAssetsRatio: fixedAssets / totalAssets * 100,
    investmentsRatio: investments / totalAssets * 100,
    intangibleAssetsRatio: intangibleAssets / totalAssets * 100,
    otherAssetsRatio: otherAssets / totalAssets * 100,
    investmentEfficiency: calculateInvestmentEfficiency(statements),
    investmentGrowth: calculateInvestmentGrowth(statements)
  };

  // تقييم الهيكل
  const evaluation = evaluateInvestmentStructure(investmentStructure);

  return {
    id: 'investment-structure',
    name: 'تحليل هيكل الاستثمارات',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل الاستثمارات ومكوناته',
    results: {
      investmentStructure,
      evaluation
    },
    charts: [
      {
        type: 'pie',
        title: 'توزيع الاستثمارات',
        data: [
          { label: 'الأصول الثابتة', value: fixedAssets },
          { label: 'الاستثمارات', value: investments },
          { label: 'الأصول غير الملموسة', value: intangibleAssets },
          { label: 'أصول أخرى', value: otherAssets }
        ]
      },
      {
        type: 'line',
        title: 'نمو الاستثمارات',
        data: statements.map((stmt, index) => ({
          label: `السنة ${index + 1}`,
          value: stmt.balanceSheet?.totalAssets || 0
        }))
      }
    ],
    recommendations: generateInvestmentStructureRecommendations(investmentStructure),
    risks: identifyInvestmentStructureRisks(investmentStructure),
    predictions: generateInvestmentStructurePredictions(investmentStructure),
    swot: performInvestmentStructureSWOT(investmentStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
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
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.balanceSheet) {
    return createErrorResult('تحليل هيكل التمويل', 'بيانات الميزانية العمومية غير متوفرة');
  }

  const balanceSheet = latestStatement.balanceSheet;
  const totalLiabilities = balanceSheet.totalLiabilities || 0;
  const totalEquity = balanceSheet.totalEquity || 0;
  const longTermDebt = balanceSheet.longTermDebt || 0;
  const shortTermDebt = balanceSheet.shortTermDebt || 0;
  const accountsPayable = balanceSheet.accountsPayable || 0;
  const otherLiabilities = balanceSheet.otherLiabilities || 0;

  // حساب هيكل التمويل
  const financingStructure = {
    totalLiabilities,
    totalEquity,
    longTermDebt,
    shortTermDebt,
    accountsPayable,
    otherLiabilities,
    debtToEquityRatio: totalEquity > 0 ? totalLiabilities / totalEquity : 0,
    longTermDebtRatio: longTermDebt / totalLiabilities * 100,
    shortTermDebtRatio: shortTermDebt / totalLiabilities * 100,
    accountsPayableRatio: accountsPayable / totalLiabilities * 100,
    otherLiabilitiesRatio: otherLiabilities / totalLiabilities * 100,
    financingEfficiency: calculateFinancingEfficiency(statements),
    financingStability: calculateFinancingStability(statements)
  };

  // تقييم الهيكل
  const evaluation = evaluateFinancingStructure(financingStructure);

  return {
    id: 'financing-structure',
    name: 'تحليل هيكل التمويل',
    category: 'structural-analysis',
    description: 'تحليل شامل لهيكل التمويل ومكوناته',
    results: {
      financingStructure,
      evaluation
    },
    charts: [
      {
        type: 'pie',
        title: 'توزيع التمويل',
        data: [
          { label: 'الديون طويلة الأجل', value: longTermDebt },
          { label: 'الديون قصيرة الأجل', value: shortTermDebt },
          { label: 'الذمم الدائنة', value: accountsPayable },
          { label: 'خصوم أخرى', value: otherLiabilities }
        ]
      },
      {
        type: 'bar',
        title: 'مقارنة الديون وحقوق الملكية',
        data: [
          { label: 'إجمالي الخصوم', value: totalLiabilities },
          { label: 'إجمالي حقوق الملكية', value: totalEquity }
        ]
      }
    ],
    recommendations: generateFinancingStructureRecommendations(financingStructure),
    risks: identifyFinancingStructureRisks(financingStructure),
    predictions: generateFinancingStructurePredictions(financingStructure),
    swot: performFinancingStructureSWOT(financingStructure),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

/**
 * تقييم هيكل التدفق النقدي الاستثماري
 */
function evaluateInvestingCashFlowStructure(structure: any): any {
  const score = Math.min(100, Math.max(0, 
    (structure.investingCashFlowRatio * 0.2) +
    (structure.capitalExpendituresRatio * 0.2) +
    (structure.assetPurchasesRatio * 0.15) +
    (structure.assetSalesRatio * 0.15) +
    (structure.investmentPurchasesRatio * 0.15) +
    (structure.investmentSalesRatio * 0.15)
  ));

  let rating = 'ضعيف';
  let interpretation = 'هيكل التدفق النقدي الاستثماري يحتاج إلى تحسين';

  if (score >= 80) {
    rating = 'ممتاز';
    interpretation = 'هيكل التدفق النقدي الاستثماري ممتاز ومتوازن';
  } else if (score >= 70) {
    rating = 'جيد جداً';
    interpretation = 'هيكل التدفق النقدي الاستثماري جيد جداً';
  } else if (score >= 60) {
    rating = 'جيد';
    interpretation = 'هيكل التدفق النقدي الاستثماري جيد';
  } else if (score >= 50) {
    rating = 'متوسط';
    interpretation = 'هيكل التدفق النقدي الاستثماري متوسط';
  }

  return {
    score,
    rating,
    interpretation,
    overallRating: rating
  };
}

/**
 * توليد توصيات هيكل التدفق النقدي الاستثماري
 */
function generateInvestingCashFlowStructureRecommendations(structure: any): string[] {
  const recommendations = [];

  if (structure.capitalExpendituresRatio > 60) {
    recommendations.push('زيادة الاستثمارات الرأسمالية لتحسين الإنتاجية');
  }

  if (structure.assetSalesRatio > 30) {
    recommendations.push('مراجعة استراتيجية بيع الأصول');
  }

  if (structure.investmentPurchasesRatio > 40) {
    recommendations.push('تنويع محفظة الاستثمارات');
  }

  if (structure.investmentEfficiency < 50) {
    recommendations.push('تحسين كفاءة الاستثمارات');
  }

  if (structure.investmentGrowth < 10) {
    recommendations.push('زيادة معدل نمو الاستثمارات');
  }

  return recommendations;
}

/**
 * تحديد مخاطر هيكل التدفق النقدي الاستثماري
 */
function identifyInvestingCashFlowStructureRisks(structure: any): string[] {
  const risks = [];

  if (structure.capitalExpendituresRatio > 80) {
    risks.push('مخاطر الإفراط في الاستثمارات الرأسمالية');
  }

  if (structure.assetSalesRatio > 50) {
    risks.push('مخاطر بيع الأصول الأساسية');
  }

  if (structure.investmentPurchasesRatio > 60) {
    risks.push('مخاطر التركيز على الاستثمارات');
  }

  if (structure.investmentEfficiency < 30) {
    risks.push('مخاطر انخفاض كفاءة الاستثمارات');
  }

  return risks;
}

/**
 * توليد توقعات هيكل التدفق النقدي الاستثماري
 */
function generateInvestingCashFlowStructurePredictions(structure: any): string[] {
  const predictions = [];

  if (structure.capitalExpendituresRatio > 50) {
    predictions.push('توقع زيادة الإنتاجية في المستقبل');
  }

  if (structure.assetPurchasesRatio > 40) {
    predictions.push('توقع نمو الأصول الثابتة');
  }

  if (structure.investmentPurchasesRatio > 30) {
    predictions.push('توقع نمو محفظة الاستثمارات');
  }

  if (structure.investmentGrowth > 15) {
    predictions.push('توقع نمو قوي في الاستثمارات');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل التدفق النقدي الاستثماري
 */
function performInvestingCashFlowStructureSWOT(structure: any): any {
  return {
    strengths: [
      'هيكل استثماري متوازن',
      'تنويع في الاستثمارات',
      'كفاءة في استخدام الأصول'
    ],
    weaknesses: [
      'اعتماد كبير على الاستثمارات الرأسمالية',
      'محدودية بيع الأصول',
      'تركيز على استثمارات محددة'
    ],
    opportunities: [
      'فرص استثمارية جديدة',
      'توسع في الأسواق',
      'تحسين كفاءة الاستثمارات'
    ],
    threats: [
      'تقلبات السوق',
      'منافسة شديدة',
      'تغيرات في البيئة الاستثمارية'
    ]
  };
}

/**
 * حساب كفاءة الاستثمارات
 */
function calculateInvestmentEfficiency(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;
  
  const latestStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];
  
  const currentInvestingCashFlow = latestStatement.cashFlowStatement?.investingCashFlow || 0;
  const previousInvestingCashFlow = previousStatement.cashFlowStatement?.investingCashFlow || 0;
  
  if (previousInvestingCashFlow === 0) return 0;
  
  return ((currentInvestingCashFlow - previousInvestingCashFlow) / Math.abs(previousInvestingCashFlow)) * 100;
}

/**
 * حساب نمو الاستثمارات
 */
function calculateInvestmentGrowth(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;
  
  const latestStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];
  
  const currentInvestingCashFlow = latestStatement.cashFlowStatement?.investingCashFlow || 0;
  const previousInvestingCashFlow = previousStatement.cashFlowStatement?.investingCashFlow || 0;
  
  if (previousInvestingCashFlow === 0) return 0;
  
  return ((currentInvestingCashFlow - previousInvestingCashFlow) / Math.abs(previousInvestingCashFlow)) * 100;
}

/**
 * تقييم هيكل التدفق النقدي التمويلي
 */
function evaluateFinancingCashFlowStructure(structure: any): any {
  const score = Math.min(100, Math.max(0, 
    (structure.financingCashFlowRatio * 0.2) +
    (structure.debtIssuanceRatio * 0.2) +
    (structure.debtRepaymentRatio * 0.2) +
    (structure.equityIssuanceRatio * 0.15) +
    (structure.dividendPaymentsRatio * 0.15) +
    (structure.shareRepurchasesRatio * 0.1)
  ));

  let rating = 'ضعيف';
  let interpretation = 'هيكل التدفق النقدي التمويلي يحتاج إلى تحسين';

  if (score >= 80) {
    rating = 'ممتاز';
    interpretation = 'هيكل التدفق النقدي التمويلي ممتاز ومتوازن';
  } else if (score >= 70) {
    rating = 'جيد جداً';
    interpretation = 'هيكل التدفق النقدي التمويلي جيد جداً';
  } else if (score >= 60) {
    rating = 'جيد';
    interpretation = 'هيكل التدفق النقدي التمويلي جيد';
  } else if (score >= 50) {
    rating = 'متوسط';
    interpretation = 'هيكل التدفق النقدي التمويلي متوسط';
  }

  return {
    score,
    rating,
    interpretation,
    overallRating: rating
  };
}

/**
 * توليد توصيات هيكل التدفق النقدي التمويلي
 */
function generateFinancingCashFlowStructureRecommendations(structure: any): string[] {
  const recommendations = [];

  if (structure.debtIssuanceRatio > 60) {
    recommendations.push('مراجعة استراتيجية إصدار الديون');
  }

  if (structure.debtRepaymentRatio > 50) {
    recommendations.push('تحسين جدولة سداد الديون');
  }

  if (structure.equityIssuanceRatio > 40) {
    recommendations.push('تنويع مصادر التمويل');
  }

  if (structure.dividendPaymentsRatio > 30) {
    recommendations.push('مراجعة سياسة توزيع الأرباح');
  }

  if (structure.financingEfficiency < 50) {
    recommendations.push('تحسين كفاءة التمويل');
  }

  return recommendations;
}

/**
 * تحديد مخاطر هيكل التدفق النقدي التمويلي
 */
function identifyFinancingCashFlowStructureRisks(structure: any): string[] {
  const risks = [];

  if (structure.debtIssuanceRatio > 80) {
    risks.push('مخاطر الإفراط في إصدار الديون');
  }

  if (structure.debtRepaymentRatio > 70) {
    risks.push('مخاطر ضغط سداد الديون');
  }

  if (structure.equityIssuanceRatio > 60) {
    risks.push('مخاطر التخفيف من قيمة الأسهم');
  }

  if (structure.financingStability < 30) {
    risks.push('مخاطر عدم استقرار التمويل');
  }

  return risks;
}

/**
 * توليد توقعات هيكل التدفق النقدي التمويلي
 */
function generateFinancingCashFlowStructurePredictions(structure: any): string[] {
  const predictions = [];

  if (structure.debtIssuanceRatio > 50) {
    predictions.push('توقع زيادة الرفع المالي');
  }

  if (structure.debtRepaymentRatio > 40) {
    predictions.push('توقع تحسن الوضع المالي');
  }

  if (structure.equityIssuanceRatio > 30) {
    predictions.push('توقع نمو رأس المال');
  }

  if (structure.financingEfficiency > 70) {
    predictions.push('توقع تحسن كفاءة التمويل');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل التدفق النقدي التمويلي
 */
function performFinancingCashFlowStructureSWOT(structure: any): any {
  return {
    strengths: [
      'هيكل تمويلي متوازن',
      'تنويع في مصادر التمويل',
      'كفاءة في إدارة التمويل'
    ],
    weaknesses: [
      'اعتماد كبير على الديون',
      'محدودية مصادر التمويل',
      'ضغط سداد الديون'
    ],
    opportunities: [
      'فرص تمويلية جديدة',
      'تحسين شروط التمويل',
      'تنويع مصادر التمويل'
    ],
    threats: [
      'تقلبات أسعار الفائدة',
      'صعوبة الحصول على التمويل',
      'تغيرات في البيئة التمويلية'
    ]
  };
}

/**
 * حساب كفاءة التمويل
 */
function calculateFinancingEfficiency(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;
  
  const latestStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];
  
  const currentFinancingCashFlow = latestStatement.cashFlowStatement?.financingCashFlow || 0;
  const previousFinancingCashFlow = previousStatement.cashFlowStatement?.financingCashFlow || 0;
  
  if (previousFinancingCashFlow === 0) return 0;
  
  return ((currentFinancingCashFlow - previousFinancingCashFlow) / Math.abs(previousFinancingCashFlow)) * 100;
}

/**
 * حساب استقرار التمويل
 */
function calculateFinancingStability(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;
  
  const financingCashFlows = statements.map(stmt => stmt.cashFlowStatement?.financingCashFlow || 0);
  const mean = financingCashFlows.reduce((sum, val) => sum + val, 0) / financingCashFlows.length;
  const variance = financingCashFlows.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / financingCashFlows.length;
  const standardDeviation = Math.sqrt(variance);
  
  return mean !== 0 ? (1 - (standardDeviation / Math.abs(mean))) * 100 : 0;
}

/**
 * تقييم هيكل رأس المال العامل
 */
function evaluateWorkingCapitalStructure(structure: any): any {
  const score = Math.min(100, Math.max(0, 
    (structure.cashRatio * 0.2) +
    (structure.accountsReceivableRatio * 0.2) +
    (structure.inventoryRatio * 0.2) +
    (structure.accountsPayableRatio * 0.15) +
    (structure.shortTermDebtRatio * 0.15) +
    (structure.workingCapitalTurnover * 0.1)
  ));

  let rating = 'ضعيف';
  let interpretation = 'هيكل رأس المال العامل يحتاج إلى تحسين';

  if (score >= 80) {
    rating = 'ممتاز';
    interpretation = 'هيكل رأس المال العامل ممتاز ومتوازن';
  } else if (score >= 70) {
    rating = 'جيد جداً';
    interpretation = 'هيكل رأس المال العامل جيد جداً';
  } else if (score >= 60) {
    rating = 'جيد';
    interpretation = 'هيكل رأس المال العامل جيد';
  } else if (score >= 50) {
    rating = 'متوسط';
    interpretation = 'هيكل رأس المال العامل متوسط';
  }

  return {
    score,
    rating,
    interpretation,
    overallRating: rating
  };
}

/**
 * توليد توصيات هيكل رأس المال العامل
 */
function generateWorkingCapitalStructureRecommendations(structure: any): string[] {
  const recommendations = [];

  if (structure.cashRatio < 10) {
    recommendations.push('زيادة النقدية لتحسين السيولة');
  }

  if (structure.accountsReceivableRatio > 50) {
    recommendations.push('تحسين إدارة الذمم المدينة');
  }

  if (structure.inventoryRatio > 40) {
    recommendations.push('تحسين إدارة المخزون');
  }

  if (structure.accountsPayableRatio > 60) {
    recommendations.push('مراجعة سياسة الدفع للذمم الدائنة');
  }

  if (structure.workingCapitalTurnover < 2) {
    recommendations.push('تحسين دوران رأس المال العامل');
  }

  return recommendations;
}

/**
 * تحديد مخاطر هيكل رأس المال العامل
 */
function identifyWorkingCapitalStructureRisks(structure: any): string[] {
  const risks = [];

  if (structure.cashRatio < 5) {
    risks.push('مخاطر نقص السيولة');
  }

  if (structure.accountsReceivableRatio > 60) {
    risks.push('مخاطر عدم تحصيل الذمم المدينة');
  }

  if (structure.inventoryRatio > 50) {
    risks.push('مخاطر ركود المخزون');
  }

  if (structure.shortTermDebtRatio > 70) {
    risks.push('مخاطر ضغط الديون قصيرة الأجل');
  }

  return risks;
}

/**
 * توليد توقعات هيكل رأس المال العامل
 */
function generateWorkingCapitalStructurePredictions(structure: any): string[] {
  const predictions = [];

  if (structure.cashRatio > 20) {
    predictions.push('توقع تحسن السيولة');
  }

  if (structure.accountsReceivableRatio < 30) {
    predictions.push('توقع تحسن تحصيل الذمم المدينة');
  }

  if (structure.inventoryRatio < 25) {
    predictions.push('توقع تحسن إدارة المخزون');
  }

  if (structure.workingCapitalTurnover > 3) {
    predictions.push('توقع تحسن دوران رأس المال العامل');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل رأس المال العامل
 */
function performWorkingCapitalStructureSWOT(structure: any): any {
  return {
    strengths: [
      'هيكل رأس المال العامل متوازن',
      'سيولة جيدة',
      'إدارة فعالة للمخزون'
    ],
    weaknesses: [
      'اعتماد كبير على الذمم المدينة',
      'محدودية النقدية',
      'ضغط الديون قصيرة الأجل'
    ],
    opportunities: [
      'تحسين إدارة المخزون',
      'تحسين تحصيل الذمم المدينة',
      'تنويع مصادر التمويل'
    ],
    threats: [
      'تقلبات السوق',
      'صعوبة تحصيل الذمم',
      'زيادة تكلفة التمويل'
    ]
  };
}

/**
 * حساب دوران رأس المال العامل
 */
function calculateWorkingCapitalTurnover(statements: FinancialStatement[]): number {
  if (statements.length < 1) return 0;
  
  const latestStatement = statements[statements.length - 1];
  const revenue = latestStatement.incomeStatement?.revenue || 0;
  const currentAssets = latestStatement.balanceSheet?.currentAssets || 0;
  const currentLiabilities = latestStatement.balanceSheet?.currentLiabilities || 0;
  const workingCapital = currentAssets - currentLiabilities;
  
  return workingCapital > 0 ? revenue / workingCapital : 0;
}

/**
 * حساب كفاءة رأس المال العامل
 */
function calculateWorkingCapitalEfficiency(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;
  
  const latestStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];
  
  const currentWorkingCapital = (latestStatement.balanceSheet?.currentAssets || 0) - (latestStatement.balanceSheet?.currentLiabilities || 0);
  const previousWorkingCapital = (previousStatement.balanceSheet?.currentAssets || 0) - (previousStatement.balanceSheet?.currentLiabilities || 0);
  
  if (previousWorkingCapital === 0) return 0;
  
  return ((currentWorkingCapital - previousWorkingCapital) / Math.abs(previousWorkingCapital)) * 100;
}

/**
 * تقييم هيكل الاستثمارات
 */
function evaluateInvestmentStructure(structure: any): any {
  const score = Math.min(100, Math.max(0, 
    (structure.fixedAssetsRatio * 0.3) +
    (structure.investmentsRatio * 0.25) +
    (structure.intangibleAssetsRatio * 0.2) +
    (structure.otherAssetsRatio * 0.15) +
    (structure.investmentEfficiency * 0.1)
  ));

  let rating = 'ضعيف';
  let interpretation = 'هيكل الاستثمارات يحتاج إلى تحسين';

  if (score >= 80) {
    rating = 'ممتاز';
    interpretation = 'هيكل الاستثمارات ممتاز ومتوازن';
  } else if (score >= 70) {
    rating = 'جيد جداً';
    interpretation = 'هيكل الاستثمارات جيد جداً';
  } else if (score >= 60) {
    rating = 'جيد';
    interpretation = 'هيكل الاستثمارات جيد';
  } else if (score >= 50) {
    rating = 'متوسط';
    interpretation = 'هيكل الاستثمارات متوسط';
  }

  return {
    score,
    rating,
    interpretation,
    overallRating: rating
  };
}

/**
 * توليد توصيات هيكل الاستثمارات
 */
function generateInvestmentStructureRecommendations(structure: any): string[] {
  const recommendations = [];

  if (structure.fixedAssetsRatio > 70) {
    recommendations.push('تنويع الاستثمارات في الأصول الثابتة');
  }

  if (structure.investmentsRatio < 10) {
    recommendations.push('زيادة الاستثمارات المالية');
  }

  if (structure.intangibleAssetsRatio > 30) {
    recommendations.push('مراجعة استراتيجية الاستثمار في الأصول غير الملموسة');
  }

  if (structure.otherAssetsRatio > 20) {
    recommendations.push('تحسين إدارة الأصول الأخرى');
  }

  if (structure.investmentEfficiency < 50) {
    recommendations.push('تحسين كفاءة الاستثمارات');
  }

  return recommendations;
}

/**
 * تحديد مخاطر هيكل الاستثمارات
 */
function identifyInvestmentStructureRisks(structure: any): string[] {
  const risks = [];

  if (structure.fixedAssetsRatio > 80) {
    risks.push('مخاطر التركيز على الأصول الثابتة');
  }

  if (structure.investmentsRatio > 50) {
    risks.push('مخاطر التركيز على الاستثمارات المالية');
  }

  if (structure.intangibleAssetsRatio > 40) {
    risks.push('مخاطر التركيز على الأصول غير الملموسة');
  }

  if (structure.investmentEfficiency < 30) {
    risks.push('مخاطر انخفاض كفاءة الاستثمارات');
  }

  return risks;
}

/**
 * توليد توقعات هيكل الاستثمارات
 */
function generateInvestmentStructurePredictions(structure: any): string[] {
  const predictions = [];

  if (structure.fixedAssetsRatio > 50) {
    predictions.push('توقع نمو الإنتاجية');
  }

  if (structure.investmentsRatio > 20) {
    predictions.push('توقع نمو العوائد المالية');
  }

  if (structure.intangibleAssetsRatio > 15) {
    predictions.push('توقع نمو القيمة المعنوية');
  }

  if (structure.investmentGrowth > 15) {
    predictions.push('توقع نمو قوي في الاستثمارات');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل الاستثمارات
 */
function performInvestmentStructureSWOT(structure: any): any {
  return {
    strengths: [
      'هيكل استثماري متوازن',
      'تنويع في الاستثمارات',
      'كفاءة في استخدام الأصول'
    ],
    weaknesses: [
      'اعتماد كبير على الأصول الثابتة',
      'محدودية الاستثمارات المالية',
      'تركيز على استثمارات محددة'
    ],
    opportunities: [
      'فرص استثمارية جديدة',
      'توسع في الأسواق',
      'تحسين كفاءة الاستثمارات'
    ],
    threats: [
      'تقلبات السوق',
      'منافسة شديدة',
      'تغيرات في البيئة الاستثمارية'
    ]
  };
}

/**
 * تقييم هيكل التمويل
 */
function evaluateFinancingStructure(structure: any): any {
  const score = Math.min(100, Math.max(0, 
    (structure.debtToEquityRatio * 0.3) +
    (structure.longTermDebtRatio * 0.25) +
    (structure.shortTermDebtRatio * 0.2) +
    (structure.accountsPayableRatio * 0.15) +
    (structure.otherLiabilitiesRatio * 0.1)
  ));

  let rating = 'ضعيف';
  let interpretation = 'هيكل التمويل يحتاج إلى تحسين';

  if (score >= 80) {
    rating = 'ممتاز';
    interpretation = 'هيكل التمويل ممتاز ومتوازن';
  } else if (score >= 70) {
    rating = 'جيد جداً';
    interpretation = 'هيكل التمويل جيد جداً';
  } else if (score >= 60) {
    rating = 'جيد';
    interpretation = 'هيكل التمويل جيد';
  } else if (score >= 50) {
    rating = 'متوسط';
    interpretation = 'هيكل التمويل متوسط';
  }

  return {
    score,
    rating,
    interpretation,
    overallRating: rating
  };
}

/**
 * توليد توصيات هيكل التمويل
 */
function generateFinancingStructureRecommendations(structure: any): string[] {
  const recommendations = [];

  if (structure.debtToEquityRatio > 2) {
    recommendations.push('تقليل نسبة الديون إلى حقوق الملكية');
  }

  if (structure.longTermDebtRatio > 60) {
    recommendations.push('مراجعة استراتيجية الديون طويلة الأجل');
  }

  if (structure.shortTermDebtRatio > 40) {
    recommendations.push('تحسين إدارة الديون قصيرة الأجل');
  }

  if (structure.accountsPayableRatio > 30) {
    recommendations.push('مراجعة سياسة الدفع للذمم الدائنة');
  }

  if (structure.financingEfficiency < 50) {
    recommendations.push('تحسين كفاءة التمويل');
  }

  return recommendations;
}

/**
 * تحديد مخاطر هيكل التمويل
 */
function identifyFinancingStructureRisks(structure: any): string[] {
  const risks = [];

  if (structure.debtToEquityRatio > 3) {
    risks.push('مخاطر الإفراط في الرفع المالي');
  }

  if (structure.longTermDebtRatio > 70) {
    risks.push('مخاطر ضغط الديون طويلة الأجل');
  }

  if (structure.shortTermDebtRatio > 50) {
    risks.push('مخاطر ضغط الديون قصيرة الأجل');
  }

  if (structure.financingStability < 30) {
    risks.push('مخاطر عدم استقرار التمويل');
  }

  return risks;
}

/**
 * توليد توقعات هيكل التمويل
 */
function generateFinancingStructurePredictions(structure: any): string[] {
  const predictions = [];

  if (structure.debtToEquityRatio < 1) {
    predictions.push('توقع تحسن الوضع المالي');
  }

  if (structure.longTermDebtRatio < 40) {
    predictions.push('توقع تحسن هيكل التمويل');
  }

  if (structure.shortTermDebtRatio < 30) {
    predictions.push('توقع تحسن السيولة');
  }

  if (structure.financingEfficiency > 70) {
    predictions.push('توقع تحسن كفاءة التمويل');
  }

  return predictions;
}

/**
 * تحليل SWOT لهيكل التمويل
 */
function performFinancingStructureSWOT(structure: any): any {
  return {
    strengths: [
      'هيكل تمويلي متوازن',
      'تنويع في مصادر التمويل',
      'كفاءة في إدارة التمويل'
    ],
    weaknesses: [
      'اعتماد كبير على الديون',
      'محدودية مصادر التمويل',
      'ضغط سداد الديون'
    ],
    opportunities: [
      'فرص تمويلية جديدة',
      'تحسين شروط التمويل',
      'تنويع مصادر التمويل'
    ],
    threats: [
      'تقلبات أسعار الفائدة',
      'صعوبة الحصول على التمويل',
      'تغيرات في البيئة التمويلية'
    ]
  };
}
