import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';

/**
 * تحليلات التدفق والحركة (10 تحليلات)
 * حسب التصنيف المحدد في البرومبت
 */

export async function performFlowAnalysis(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];

  // 1. تحليل تدفق الأصول
  results.push(await analyzeAssetFlow(statements, companyData, marketData, benchmarkData));

  // 2. تحليل تدفق الخصوم
  results.push(await analyzeLiabilityFlow(statements, companyData, marketData, benchmarkData));

  // 3. تحليل تدفق حقوق الملكية
  results.push(await analyzeEquityFlow(statements, companyData, marketData, benchmarkData));

  // 4. تحليل تدفق الإيرادات
  results.push(await analyzeRevenueFlow(statements, companyData, marketData, benchmarkData));

  // 5. تحليل تدفق المصروفات
  results.push(await analyzeExpenseFlow(statements, companyData, marketData, benchmarkData));

  // 6. تحليل تدفق التدفق النقدي
  results.push(await analyzeCashFlowMovement(statements, companyData, marketData, benchmarkData));

  // 7. تحليل تدفق رأس المال العامل
  results.push(await analyzeWorkingCapitalFlow(statements, companyData, marketData, benchmarkData));

  // 8. تحليل تدفق الاستثمارات
  results.push(await analyzeInvestmentFlow(statements, companyData, marketData, benchmarkData));

  // 9. تحليل تدفق التمويل
  results.push(await analyzeFinancingFlow(statements, companyData, marketData, benchmarkData));

  // 10. تحليل تدفق الربحية
  results.push(await analyzeProfitabilityFlow(statements, companyData, marketData, benchmarkData));

  return results;
}

/**
 * تحليل تدفق الأصول
 */
async function analyzeAssetFlow(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  if (statements.length < 2) {
    return createErrorResult('تحليل تدفق الأصول', 'يحتاج إلى بيانات سنتين على الأقل');
  }

  const currentStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];

  if (!currentStatement.balanceSheet || !previousStatement.balanceSheet) {
    return createErrorResult('تحليل تدفق الأصول', 'بيانات الميزانية العمومية غير متوفرة');
  }

  const currentAssets = currentStatement.balanceSheet;
  const previousAssets = previousStatement.balanceSheet;

  // حساب التدفق
  const assetFlow = {
    totalAssetsChange: (currentAssets.totalAssets || 0) - (previousAssets.totalAssets || 0),
    currentAssetsChange: (currentAssets.currentAssets || 0) - (previousAssets.currentAssets || 0),
    nonCurrentAssetsChange: (currentAssets.nonCurrentAssets || 0) - (previousAssets.nonCurrentAssets || 0),
    fixedAssetsChange: (currentAssets.fixedAssets || 0) - (previousAssets.fixedAssets || 0),
    intangibleAssetsChange: (currentAssets.intangibleAssets || 0) - (previousAssets.intangibleAssets || 0)
  };

  // حساب معدلات التغير
  const assetFlowRates = {
    totalAssetsRate: previousAssets.totalAssets ? (assetFlow.totalAssetsChange / previousAssets.totalAssets) * 100 : 0,
    currentAssetsRate: previousAssets.currentAssets ? (assetFlow.currentAssetsChange / previousAssets.currentAssets) * 100 : 0,
    nonCurrentAssetsRate: previousAssets.nonCurrentAssets ? (assetFlow.nonCurrentAssetsChange / previousAssets.nonCurrentAssets) * 100 : 0,
    fixedAssetsRate: previousAssets.fixedAssets ? (assetFlow.fixedAssetsChange / previousAssets.fixedAssets) * 100 : 0,
    intangibleAssetsRate: previousAssets.intangibleAssets ? (assetFlow.intangibleAssetsChange / previousAssets.intangibleAssets) * 100 : 0
  };

  // تقييم التدفق
  const evaluation = evaluateAssetFlow(assetFlow, assetFlowRates);

  return {
    id: 'asset-flow',
    name: 'تحليل تدفق الأصول',
    category: 'flow-analysis',
    description: 'تحليل شامل لتدفق الأصول وتغيراتها عبر الفترات الزمنية',
    results: {
      assetFlow,
      assetFlowRates,
      evaluation
    },
    charts: [
      {
        type: 'line',
        title: 'تدفق الأصول عبر الفترات',
        data: [
          { label: 'إجمالي الأصول', value: assetFlow.totalAssetsChange },
          { label: 'الأصول المتداولة', value: assetFlow.currentAssetsChange },
          { label: 'الأصول غير المتداولة', value: assetFlow.nonCurrentAssetsChange }
        ]
      }
    ],
    recommendations: generateAssetFlowRecommendations(assetFlow, assetFlowRates),
    risks: identifyAssetFlowRisks(assetFlow, assetFlowRates),
    predictions: generateAssetFlowPredictions(assetFlow, assetFlowRates),
    swot: performAssetFlowSWOT(assetFlow, assetFlowRates),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

/**
 * تحليل تدفق الخصوم
 */
async function analyzeLiabilityFlow(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  if (statements.length < 2) {
    return createErrorResult('تحليل تدفق الخصوم', 'يحتاج إلى بيانات سنتين على الأقل');
  }

  const currentStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];

  if (!currentStatement.balanceSheet || !previousStatement.balanceSheet) {
    return createErrorResult('تحليل تدفق الخصوم', 'بيانات الميزانية العمومية غير متوفرة');
  }

  const currentLiabilities = currentStatement.balanceSheet;
  const previousLiabilities = previousStatement.balanceSheet;

  // حساب التدفق
  const liabilityFlow = {
    totalLiabilitiesChange: (currentLiabilities.totalLiabilities || 0) - (previousLiabilities.totalLiabilities || 0),
    currentLiabilitiesChange: (currentLiabilities.currentLiabilities || 0) - (previousLiabilities.currentLiabilities || 0),
    nonCurrentLiabilitiesChange: (currentLiabilities.nonCurrentLiabilities || 0) - (previousLiabilities.nonCurrentLiabilities || 0),
    longTermDebtChange: (currentLiabilities.longTermDebt || 0) - (previousLiabilities.longTermDebt || 0)
  };

  // حساب معدلات التغير
  const liabilityFlowRates = {
    totalLiabilitiesRate: previousLiabilities.totalLiabilities ? (liabilityFlow.totalLiabilitiesChange / previousLiabilities.totalLiabilities) * 100 : 0,
    currentLiabilitiesRate: previousLiabilities.currentLiabilities ? (liabilityFlow.currentLiabilitiesChange / previousLiabilities.currentLiabilities) * 100 : 0,
    nonCurrentLiabilitiesRate: previousLiabilities.nonCurrentLiabilities ? (liabilityFlow.nonCurrentLiabilitiesChange / previousLiabilities.nonCurrentLiabilities) * 100 : 0,
    longTermDebtRate: previousLiabilities.longTermDebt ? (liabilityFlow.longTermDebtChange / previousLiabilities.longTermDebt) * 100 : 0
  };

  // تقييم التدفق
  const evaluation = evaluateLiabilityFlow(liabilityFlow, liabilityFlowRates);

  return {
    id: 'liability-flow',
    name: 'تحليل تدفق الخصوم',
    category: 'flow-analysis',
    description: 'تحليل شامل لتدفق الخصوم وتغيراتها عبر الفترات الزمنية',
    results: {
      liabilityFlow,
      liabilityFlowRates,
      evaluation
    },
    charts: [
      {
        type: 'line',
        title: 'تدفق الخصوم عبر الفترات',
        data: [
          { label: 'إجمالي الخصوم', value: liabilityFlow.totalLiabilitiesChange },
          { label: 'الخصوم المتداولة', value: liabilityFlow.currentLiabilitiesChange },
          { label: 'الخصوم غير المتداولة', value: liabilityFlow.nonCurrentLiabilitiesChange }
        ]
      }
    ],
    recommendations: generateLiabilityFlowRecommendations(liabilityFlow, liabilityFlowRates),
    risks: identifyLiabilityFlowRisks(liabilityFlow, liabilityFlowRates),
    predictions: generateLiabilityFlowPredictions(liabilityFlow, liabilityFlowRates),
    swot: performLiabilityFlowSWOT(liabilityFlow, liabilityFlowRates),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

/**
 * تحليل تدفق حقوق الملكية
 */
async function analyzeEquityFlow(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  if (statements.length < 2) {
    return createErrorResult('تحليل تدفق حقوق الملكية', 'يحتاج إلى بيانات سنتين على الأقل');
  }

  const currentStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];

  if (!currentStatement.balanceSheet || !previousStatement.balanceSheet) {
    return createErrorResult('تحليل تدفق حقوق الملكية', 'بيانات الميزانية العمومية غير متوفرة');
  }

  const currentEquity = currentStatement.balanceSheet;
  const previousEquity = previousStatement.balanceSheet;

  // حساب التدفق
  const equityFlow = {
    totalEquityChange: (currentEquity.totalEquity || 0) - (previousEquity.totalEquity || 0),
    retainedEarningsChange: (currentEquity.retainedEarnings || 0) - (previousEquity.retainedEarnings || 0),
    shareCapitalChange: (currentEquity.shareCapital || 0) - (previousEquity.shareCapital || 0)
  };

  // حساب معدلات التغير
  const equityFlowRates = {
    totalEquityRate: previousEquity.totalEquity ? (equityFlow.totalEquityChange / previousEquity.totalEquity) * 100 : 0,
    retainedEarningsRate: previousEquity.retainedEarnings ? (equityFlow.retainedEarningsChange / previousEquity.retainedEarnings) * 100 : 0,
    shareCapitalRate: previousEquity.shareCapital ? (equityFlow.shareCapitalChange / previousEquity.shareCapital) * 100 : 0
  };

  // تقييم التدفق
  const evaluation = evaluateEquityFlow(equityFlow, equityFlowRates);

  return {
    id: 'equity-flow',
    name: 'تحليل تدفق حقوق الملكية',
    category: 'flow-analysis',
    description: 'تحليل شامل لتدفق حقوق الملكية وتغيراتها عبر الفترات الزمنية',
    results: {
      equityFlow,
      equityFlowRates,
      evaluation
    },
    charts: [
      {
        type: 'line',
        title: 'تدفق حقوق الملكية عبر الفترات',
        data: [
          { label: 'إجمالي حقوق الملكية', value: equityFlow.totalEquityChange },
          { label: 'الأرباح المحتجزة', value: equityFlow.retainedEarningsChange },
          { label: 'رأس المال', value: equityFlow.shareCapitalChange }
        ]
      }
    ],
    recommendations: generateEquityFlowRecommendations(equityFlow, equityFlowRates),
    risks: identifyEquityFlowRisks(equityFlow, equityFlowRates),
    predictions: generateEquityFlowPredictions(equityFlow, equityFlowRates),
    swot: performEquityFlowSWOT(equityFlow, equityFlowRates),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

// باقي الدوال المساعدة...

/**
 * تقييم تدفق الأصول
 */
function evaluateAssetFlow(assetFlow: any, assetFlowRates: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم تغير إجمالي الأصول
  if (assetFlowRates.totalAssetsRate > 0) {
    score += 2;
  } else if (assetFlowRates.totalAssetsRate >= -5) {
    score += 1;
  }

  // تقييم تغير الأصول المتداولة
  if (assetFlowRates.currentAssetsRate > 0) {
    score += 1;
  }

  // تقييم تغير الأصول غير المتداولة
  if (assetFlowRates.nonCurrentAssetsRate > 0) {
    score += 1;
  }

  // تحديد التقييم العام
  let overallRating: 'excellent' | 'very-good' | 'good' | 'acceptable' | 'weak';
  if (score >= 4) overallRating = 'excellent';
  else if (score >= 3) overallRating = 'very-good';
  else if (score >= 2) overallRating = 'good';
  else if (score >= 1) overallRating = 'acceptable';
  else overallRating = 'weak';

  // إنشاء التفسير
  interpretation = `تدفق الأصول ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (assetFlowRates.totalAssetsRate > 0) {
    interpretation += 'إجمالي الأصول في نمو مما يدل على توسع الشركة. ';
  } else if (assetFlowRates.totalAssetsRate < -10) {
    interpretation += 'إجمالي الأصول في انخفاض مما قد يؤثر على النمو. ';
  }

  if (assetFlowRates.currentAssetsRate > 0) {
    interpretation += 'الأصول المتداولة في نمو مما يحسن السيولة. ';
  }

  if (assetFlowRates.nonCurrentAssetsRate > 0) {
    interpretation += 'الأصول غير المتداولة في نمو مما يدل على الاستثمار في الأصول الثابتة. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * تقييم تدفق الخصوم
 */
function evaluateLiabilityFlow(liabilityFlow: any, liabilityFlowRates: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم تغير إجمالي الخصوم
  if (liabilityFlowRates.totalLiabilitiesRate <= 5) {
    score += 2;
  } else if (liabilityFlowRates.totalLiabilitiesRate <= 15) {
    score += 1;
  }

  // تقييم تغير الخصوم المتداولة
  if (liabilityFlowRates.currentLiabilitiesRate <= 10) {
    score += 1;
  }

  // تقييم تغير الخصوم غير المتداولة
  if (liabilityFlowRates.nonCurrentLiabilitiesRate <= 10) {
    score += 1;
  }

  // تحديد التقييم العام
  let overallRating: 'excellent' | 'very-good' | 'good' | 'acceptable' | 'weak';
  if (score >= 4) overallRating = 'excellent';
  else if (score >= 3) overallRating = 'very-good';
  else if (score >= 2) overallRating = 'good';
  else if (score >= 1) overallRating = 'acceptable';
  else overallRating = 'weak';

  // إنشاء التفسير
  interpretation = `تدفق الخصوم ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (liabilityFlowRates.totalLiabilitiesRate <= 5) {
    interpretation += 'إجمالي الخصوم مستقر مما يدل على إدارة مالية جيدة. ';
  } else if (liabilityFlowRates.totalLiabilitiesRate > 20) {
    interpretation += 'إجمالي الخصوم في نمو سريع مما قد يؤثر على الاستقرار المالي. ';
  }

  if (liabilityFlowRates.currentLiabilitiesRate <= 10) {
    interpretation += 'الخصوم المتداولة مستقرة مما يحسن السيولة. ';
  }

  if (liabilityFlowRates.nonCurrentLiabilitiesRate <= 10) {
    interpretation += 'الخصوم غير المتداولة مستقرة مما يدل على إدارة ديون جيدة. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * تقييم تدفق حقوق الملكية
 */
function evaluateEquityFlow(equityFlow: any, equityFlowRates: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم تغير إجمالي حقوق الملكية
  if (equityFlowRates.totalEquityRate > 0) {
    score += 2;
  } else if (equityFlowRates.totalEquityRate >= -5) {
    score += 1;
  }

  // تقييم تغير الأرباح المحتجزة
  if (equityFlowRates.retainedEarningsRate > 0) {
    score += 1;
  }

  // تقييم تغير رأس المال
  if (equityFlowRates.shareCapitalRate >= 0) {
    score += 1;
  }

  // تحديد التقييم العام
  let overallRating: 'excellent' | 'very-good' | 'good' | 'acceptable' | 'weak';
  if (score >= 4) overallRating = 'excellent';
  else if (score >= 3) overallRating = 'very-good';
  else if (score >= 2) overallRating = 'good';
  else if (score >= 1) overallRating = 'acceptable';
  else overallRating = 'weak';

  // إنشاء التفسير
  interpretation = `تدفق حقوق الملكية ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (equityFlowRates.totalEquityRate > 0) {
    interpretation += 'إجمالي حقوق الملكية في نمو مما يدل على قوة مالية. ';
  } else if (equityFlowRates.totalEquityRate < -10) {
    interpretation += 'إجمالي حقوق الملكية في انخفاض مما قد يؤثر على الاستقرار المالي. ';
  }

  if (equityFlowRates.retainedEarningsRate > 0) {
    interpretation += 'الأرباح المحتجزة في نمو مما يدل على ربحية جيدة. ';
  }

  if (equityFlowRates.shareCapitalRate > 0) {
    interpretation += 'رأس المال في نمو مما يدل على توسع في الملكية. ';
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
 * توليد التوصيات لتدفق الأصول
 */
function generateAssetFlowRecommendations(assetFlow: any, assetFlowRates: any): string[] {
  const recommendations: string[] = [];

  if (assetFlowRates.totalAssetsRate < 0) {
    recommendations.push('تحسين إدارة الأصول لزيادة النمو');
  }

  if (assetFlowRates.currentAssetsRate < 0) {
    recommendations.push('تحسين إدارة الأصول المتداولة لزيادة السيولة');
  }

  if (assetFlowRates.nonCurrentAssetsRate < 0) {
    recommendations.push('تحسين إدارة الأصول غير المتداولة لزيادة الاستثمار');
  }

  return recommendations;
}

/**
 * توليد التوصيات لتدفق الخصوم
 */
function generateLiabilityFlowRecommendations(liabilityFlow: any, liabilityFlowRates: any): string[] {
  const recommendations: string[] = [];

  if (liabilityFlowRates.totalLiabilitiesRate > 15) {
    recommendations.push('تحسين إدارة الخصوم لتقليل المخاطر');
  }

  if (liabilityFlowRates.currentLiabilitiesRate > 10) {
    recommendations.push('تحسين إدارة الخصوم المتداولة لتقليل المخاطر');
  }

  if (liabilityFlowRates.nonCurrentLiabilitiesRate > 10) {
    recommendations.push('تحسين إدارة الخصوم غير المتداولة لتقليل المخاطر');
  }

  return recommendations;
}

/**
 * توليد التوصيات لتدفق حقوق الملكية
 */
function generateEquityFlowRecommendations(equityFlow: any, equityFlowRates: any): string[] {
  const recommendations: string[] = [];

  if (equityFlowRates.totalEquityRate < 0) {
    recommendations.push('تحسين إدارة حقوق الملكية لزيادة النمو');
  }

  if (equityFlowRates.retainedEarningsRate < 0) {
    recommendations.push('تحسين إدارة الأرباح المحتجزة لزيادة النمو');
  }

  if (equityFlowRates.shareCapitalRate < 0) {
    recommendations.push('تحسين إدارة رأس المال لزيادة النمو');
  }

  return recommendations;
}

// باقي الدوال المساعدة...

/**
 * تحديد المخاطر لتدفق الأصول
 */
function identifyAssetFlowRisks(assetFlow: any, assetFlowRates: any): string[] {
  const risks: string[] = [];

  if (assetFlowRates.totalAssetsRate < -10) {
    risks.push('انخفاض إجمالي الأصول قد يؤثر على النمو');
  }

  if (assetFlowRates.currentAssetsRate < -10) {
    risks.push('انخفاض الأصول المتداولة قد يؤثر على السيولة');
  }

  if (assetFlowRates.nonCurrentAssetsRate < -10) {
    risks.push('انخفاض الأصول غير المتداولة قد يؤثر على الاستثمار');
  }

  return risks;
}

/**
 * تحديد المخاطر لتدفق الخصوم
 */
function identifyLiabilityFlowRisks(liabilityFlow: any, liabilityFlowRates: any): string[] {
  const risks: string[] = [];

  if (liabilityFlowRates.totalLiabilitiesRate > 20) {
    risks.push('ارتفاع إجمالي الخصوم قد يؤثر على الاستقرار المالي');
  }

  if (liabilityFlowRates.currentLiabilitiesRate > 15) {
    risks.push('ارتفاع الخصوم المتداولة قد يؤثر على السيولة');
  }

  if (liabilityFlowRates.nonCurrentLiabilitiesRate > 15) {
    risks.push('ارتفاع الخصوم غير المتداولة قد يؤثر على الاستقرار المالي');
  }

  return risks;
}

/**
 * تحديد المخاطر لتدفق حقوق الملكية
 */
function identifyEquityFlowRisks(equityFlow: any, equityFlowRates: any): string[] {
  const risks: string[] = [];

  if (equityFlowRates.totalEquityRate < -10) {
    risks.push('انخفاض إجمالي حقوق الملكية قد يؤثر على الاستقرار المالي');
  }

  if (equityFlowRates.retainedEarningsRate < -10) {
    risks.push('انخفاض الأرباح المحتجزة قد يؤثر على النمو');
  }

  if (equityFlowRates.shareCapitalRate < -10) {
    risks.push('انخفاض رأس المال قد يؤثر على النمو');
  }

  return risks;
}

// باقي الدوال المساعدة...

/**
 * توليد التوقعات لتدفق الأصول
 */
function generateAssetFlowPredictions(assetFlow: any, assetFlowRates: any): string[] {
  const predictions: string[] = [];

  if (assetFlowRates.totalAssetsRate > 0) {
    predictions.push('من المتوقع أن يستمر نمو إجمالي الأصول في المستقبل');
  }

  if (assetFlowRates.currentAssetsRate > 0) {
    predictions.push('من المتوقع أن يستمر نمو الأصول المتداولة في المستقبل');
  }

  if (assetFlowRates.nonCurrentAssetsRate > 0) {
    predictions.push('من المتوقع أن يستمر نمو الأصول غير المتداولة في المستقبل');
  }

  return predictions;
}

/**
 * توليد التوقعات لتدفق الخصوم
 */
function generateLiabilityFlowPredictions(liabilityFlow: any, liabilityFlowRates: any): string[] {
  const predictions: string[] = [];

  if (liabilityFlowRates.totalLiabilitiesRate <= 5) {
    predictions.push('من المتوقع أن تبقى الخصوم مستقرة في المستقبل');
  }

  if (liabilityFlowRates.currentLiabilitiesRate <= 10) {
    predictions.push('من المتوقع أن تبقى الخصوم المتداولة مستقرة في المستقبل');
  }

  if (liabilityFlowRates.nonCurrentLiabilitiesRate <= 10) {
    predictions.push('من المتوقع أن تبقى الخصوم غير المتداولة مستقرة في المستقبل');
  }

  return predictions;
}

/**
 * توليد التوقعات لتدفق حقوق الملكية
 */
function generateEquityFlowPredictions(equityFlow: any, equityFlowRates: any): string[] {
  const predictions: string[] = [];

  if (equityFlowRates.totalEquityRate > 0) {
    predictions.push('من المتوقع أن يستمر نمو إجمالي حقوق الملكية في المستقبل');
  }

  if (equityFlowRates.retainedEarningsRate > 0) {
    predictions.push('من المتوقع أن يستمر نمو الأرباح المحتجزة في المستقبل');
  }

  if (equityFlowRates.shareCapitalRate > 0) {
    predictions.push('من المتوقع أن يستمر نمو رأس المال في المستقبل');
  }

  return predictions;
}

// باقي الدوال المساعدة...

/**
 * تحليل SWOT لتدفق الأصول
 */
function performAssetFlowSWOT(assetFlow: any, assetFlowRates: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (assetFlowRates.totalAssetsRate > 0) {
    swot.strengths.push('إجمالي الأصول في نمو');
  }

  if (assetFlowRates.currentAssetsRate > 0) {
    swot.strengths.push('الأصول المتداولة في نمو');
  }

  if (assetFlowRates.nonCurrentAssetsRate > 0) {
    swot.strengths.push('الأصول غير المتداولة في نمو');
  }

  if (assetFlowRates.totalAssetsRate < 0) {
    swot.weaknesses.push('إجمالي الأصول في انخفاض');
  }

  if (assetFlowRates.currentAssetsRate < 0) {
    swot.weaknesses.push('الأصول المتداولة في انخفاض');
  }

  if (assetFlowRates.nonCurrentAssetsRate < 0) {
    swot.weaknesses.push('الأصول غير المتداولة في انخفاض');
  }

  swot.opportunities.push('تحسين إدارة الأصول');
  swot.opportunities.push('زيادة الاستثمار في الأصول');
  swot.opportunities.push('تحسين كفاءة الأصول');

  swot.threats.push('تغيرات في قيمة الأصول');
  swot.threats.push('تغيرات في هيكل الأصول');
  swot.threats.push('تغيرات في إدارة الأصول');

  return swot;
}

/**
 * تحليل SWOT لتدفق الخصوم
 */
function performLiabilityFlowSWOT(liabilityFlow: any, liabilityFlowRates: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (liabilityFlowRates.totalLiabilitiesRate <= 5) {
    swot.strengths.push('إجمالي الخصوم مستقر');
  }

  if (liabilityFlowRates.currentLiabilitiesRate <= 10) {
    swot.strengths.push('الخصوم المتداولة مستقرة');
  }

  if (liabilityFlowRates.nonCurrentLiabilitiesRate <= 10) {
    swot.strengths.push('الخصوم غير المتداولة مستقرة');
  }

  if (liabilityFlowRates.totalLiabilitiesRate > 20) {
    swot.weaknesses.push('إجمالي الخصوم في نمو سريع');
  }

  if (liabilityFlowRates.currentLiabilitiesRate > 15) {
    swot.weaknesses.push('الخصوم المتداولة في نمو سريع');
  }

  if (liabilityFlowRates.nonCurrentLiabilitiesRate > 15) {
    swot.weaknesses.push('الخصوم غير المتداولة في نمو سريع');
  }

  swot.opportunities.push('تحسين إدارة الخصوم');
  swot.opportunities.push('تقليل المخاطر المالية');
  swot.opportunities.push('تحسين هيكل التمويل');

  swot.threats.push('تغيرات في قيمة الخصوم');
  swot.threats.push('تغيرات في هيكل الخصوم');
  swot.threats.push('تغيرات في إدارة الخصوم');

  return swot;
}

/**
 * تحليل SWOT لتدفق حقوق الملكية
 */
function performEquityFlowSWOT(equityFlow: any, equityFlowRates: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (equityFlowRates.totalEquityRate > 0) {
    swot.strengths.push('إجمالي حقوق الملكية في نمو');
  }

  if (equityFlowRates.retainedEarningsRate > 0) {
    swot.strengths.push('الأرباح المحتجزة في نمو');
  }

  if (equityFlowRates.shareCapitalRate > 0) {
    swot.strengths.push('رأس المال في نمو');
  }

  if (equityFlowRates.totalEquityRate < 0) {
    swot.weaknesses.push('إجمالي حقوق الملكية في انخفاض');
  }

  if (equityFlowRates.retainedEarningsRate < 0) {
    swot.weaknesses.push('الأرباح المحتجزة في انخفاض');
  }

  if (equityFlowRates.shareCapitalRate < 0) {
    swot.weaknesses.push('رأس المال في انخفاض');
  }

  swot.opportunities.push('تحسين إدارة حقوق الملكية');
  swot.opportunities.push('زيادة الأرباح المحتجزة');
  swot.opportunities.push('تحسين هيكل رأس المال');

  swot.threats.push('تغيرات في قيمة حقوق الملكية');
  swot.threats.push('تغيرات في هيكل حقوق الملكية');
  swot.threats.push('تغيرات في إدارة حقوق الملكية');

  return swot;
}

// باقي الدوال المساعدة...

/**
 * تحليل تدفق الإيرادات
 */
async function analyzeRevenueFlow(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل تدفق الإيرادات
  return createErrorResult('تحليل تدفق الإيرادات', 'تحت التنفيذ');
}

/**
 * تحليل تدفق المصروفات
 */
async function analyzeExpenseFlow(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل تدفق المصروفات
  return createErrorResult('تحليل تدفق المصروفات', 'تحت التنفيذ');
}

/**
 * تحليل تدفق التدفق النقدي
 */
async function analyzeCashFlowMovement(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل تدفق التدفق النقدي
  return createErrorResult('تحليل تدفق التدفق النقدي', 'تحت التنفيذ');
}

/**
 * تحليل تدفق رأس المال العامل
 */
async function analyzeWorkingCapitalFlow(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل تدفق رأس المال العامل
  return createErrorResult('تحليل تدفق رأس المال العامل', 'تحت التنفيذ');
}

/**
 * تحليل تدفق الاستثمارات
 */
async function analyzeInvestmentFlow(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل تدفق الاستثمارات
  return createErrorResult('تحليل تدفق الاستثمارات', 'تحت التنفيذ');
}

/**
 * تحليل تدفق التمويل
 */
async function analyzeFinancingFlow(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل تدفق التمويل
  return createErrorResult('تحليل تدفق التمويل', 'تحت التنفيذ');
}

/**
 * تحليل تدفق الربحية
 */
async function analyzeProfitabilityFlow(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل تدفق الربحية
  return createErrorResult('تحليل تدفق الربحية', 'تحت التنفيذ');
}
