import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';

/**
 * تحليلات الأداء والكفاءة (12 تحليل)
 * حسب التصنيف المحدد في البرومبت
 */

export async function performPerformanceAnalysis(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];

  // 1. تحليل أداء الإيرادات
  results.push(await analyzeRevenuePerformance(statements, companyData, marketData, benchmarkData));

  // 2. تحليل أداء التكاليف
  results.push(await analyzeCostPerformance(statements, companyData, marketData, benchmarkData));

  // 3. تحليل أداء الربحية
  results.push(await analyzeProfitabilityPerformance(statements, companyData, marketData, benchmarkData));

  // 4. تحليل أداء السيولة
  results.push(await analyzeLiquidityPerformance(statements, companyData, marketData, benchmarkData));

  // 5. تحليل أداء الكفاءة التشغيلية
  results.push(await analyzeOperationalEfficiencyPerformance(statements, companyData, marketData, benchmarkData));

  // 6. تحليل أداء الكفاءة المالية
  results.push(await analyzeFinancialEfficiencyPerformance(statements, companyData, marketData, benchmarkData));

  // 7. تحليل أداء الكفاءة الاستثمارية
  results.push(await analyzeInvestmentEfficiencyPerformance(statements, companyData, marketData, benchmarkData));

  // 8. تحليل أداء الكفاءة التسويقية
  results.push(await analyzeMarketingEfficiencyPerformance(statements, companyData, marketData, benchmarkData));

  // 9. تحليل أداء الكفاءة الإنتاجية
  results.push(await analyzeProductionEfficiencyPerformance(statements, companyData, marketData, benchmarkData));

  // 10. تحليل أداء الكفاءة الإدارية
  results.push(await analyzeAdministrativeEfficiencyPerformance(statements, companyData, marketData, benchmarkData));

  // 11. تحليل أداء الكفاءة التقنية
  results.push(await analyzeTechnicalEfficiencyPerformance(statements, companyData, marketData, benchmarkData));

  // 12. تحليل أداء الكفاءة الشاملة
  results.push(await analyzeOverallEfficiencyPerformance(statements, companyData, marketData, benchmarkData));

  return results;
}

/**
 * تحليل أداء الإيرادات
 */
async function analyzeRevenuePerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  if (statements.length < 2) {
    return createErrorResult('تحليل أداء الإيرادات', 'يحتاج إلى بيانات سنتين على الأقل');
  }

  const currentStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];

  if (!currentStatement.incomeStatement || !previousStatement.incomeStatement) {
    return createErrorResult('تحليل أداء الإيرادات', 'بيانات قائمة الدخل غير متوفرة');
  }

  const currentRevenue = currentStatement.incomeStatement.totalRevenue || 0;
  const previousRevenue = previousStatement.incomeStatement.totalRevenue || 0;

  // حساب مؤشرات الأداء
  const performanceMetrics = {
    revenueGrowth: previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0,
    revenueGrowthAmount: currentRevenue - previousRevenue,
    averageRevenue: (currentRevenue + previousRevenue) / 2,
    revenueVolatility: calculateRevenueVolatility(statements),
    revenueConsistency: calculateRevenueConsistency(statements)
  };

  // مقارنة مع معايير الصناعة
  const industryComparison = {
    industryAverageGrowth: benchmarkData?.industryAverageRevenueGrowth || 0,
    industryAverageRevenue: benchmarkData?.industryAverageRevenue || 0,
    growthComparison: performanceMetrics.revenueGrowth - (benchmarkData?.industryAverageRevenueGrowth || 0),
    revenueComparison: currentRevenue - (benchmarkData?.industryAverageRevenue || 0)
  };

  // تقييم الأداء
  const evaluation = evaluateRevenuePerformance(performanceMetrics, industryComparison);

  return {
    id: 'revenue-performance',
    name: 'تحليل أداء الإيرادات',
    category: 'performance-analysis',
    description: 'تحليل شامل لأداء الإيرادات ونموها وتطورها',
    results: {
      performanceMetrics,
      industryComparison,
      evaluation
    },
    charts: [
      {
        type: 'line',
        title: 'تطور الإيرادات عبر الفترات',
        data: statements.map((statement, index) => ({
          label: `السنة ${index + 1}`,
          value: statement.incomeStatement?.totalRevenue || 0
        }))
      }
    ],
    recommendations: generateRevenuePerformanceRecommendations(performanceMetrics, industryComparison),
    risks: identifyRevenuePerformanceRisks(performanceMetrics, industryComparison),
    predictions: generateRevenuePerformancePredictions(performanceMetrics, industryComparison),
    swot: performRevenuePerformanceSWOT(performanceMetrics, industryComparison),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

/**
 * تحليل أداء التكاليف
 */
async function analyzeCostPerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  if (statements.length < 2) {
    return createErrorResult('تحليل أداء التكاليف', 'يحتاج إلى بيانات سنتين على الأقل');
  }

  const currentStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];

  if (!currentStatement.incomeStatement || !previousStatement.incomeStatement) {
    return createErrorResult('تحليل أداء التكاليف', 'بيانات قائمة الدخل غير متوفرة');
  }

  const currentCosts = currentStatement.incomeStatement.costOfGoodsSold || 0;
  const previousCosts = previousStatement.incomeStatement.costOfGoodsSold || 0;
  const currentRevenue = currentStatement.incomeStatement.totalRevenue || 0;
  const previousRevenue = previousStatement.incomeStatement.totalRevenue || 0;

  // حساب مؤشرات الأداء
  const performanceMetrics = {
    costGrowth: previousCosts ? ((currentCosts - previousCosts) / previousCosts) * 100 : 0,
    costGrowthAmount: currentCosts - previousCosts,
    costToRevenueRatio: currentRevenue ? (currentCosts / currentRevenue) * 100 : 0,
    previousCostToRevenueRatio: previousRevenue ? (previousCosts / previousRevenue) * 100 : 0,
    costEfficiency: calculateCostEfficiency(statements),
    costControl: calculateCostControl(statements)
  };

  // مقارنة مع معايير الصناعة
  const industryComparison = {
    industryAverageCostRatio: benchmarkData?.industryAverageCostRatio || 0,
    industryAverageCostGrowth: benchmarkData?.industryAverageCostGrowth || 0,
    costRatioComparison: performanceMetrics.costToRevenueRatio - (benchmarkData?.industryAverageCostRatio || 0),
    costGrowthComparison: performanceMetrics.costGrowth - (benchmarkData?.industryAverageCostGrowth || 0)
  };

  // تقييم الأداء
  const evaluation = evaluateCostPerformance(performanceMetrics, industryComparison);

  return {
    id: 'cost-performance',
    name: 'تحليل أداء التكاليف',
    category: 'performance-analysis',
    description: 'تحليل شامل لأداء التكاليف وإدارتها وتطورها',
    results: {
      performanceMetrics,
      industryComparison,
      evaluation
    },
    charts: [
      {
        type: 'line',
        title: 'تطور التكاليف عبر الفترات',
        data: statements.map((statement, index) => ({
          label: `السنة ${index + 1}`,
          value: statement.incomeStatement?.costOfGoodsSold || 0
        }))
      }
    ],
    recommendations: generateCostPerformanceRecommendations(performanceMetrics, industryComparison),
    risks: identifyCostPerformanceRisks(performanceMetrics, industryComparison),
    predictions: generateCostPerformancePredictions(performanceMetrics, industryComparison),
    swot: performCostPerformanceSWOT(performanceMetrics, industryComparison),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

/**
 * تحليل أداء الربحية
 */
async function analyzeProfitabilityPerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  if (statements.length < 2) {
    return createErrorResult('تحليل أداء الربحية', 'يحتاج إلى بيانات سنتين على الأقل');
  }

  const currentStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];

  if (!currentStatement.incomeStatement || !previousStatement.incomeStatement) {
    return createErrorResult('تحليل أداء الربحية', 'بيانات قائمة الدخل غير متوفرة');
  }

  const currentProfit = currentStatement.incomeStatement.netProfit || 0;
  const previousProfit = previousStatement.incomeStatement.netProfit || 0;
  const currentRevenue = currentStatement.incomeStatement.totalRevenue || 0;
  const previousRevenue = previousStatement.incomeStatement.totalRevenue || 0;

  // حساب مؤشرات الأداء
  const performanceMetrics = {
    profitGrowth: previousProfit ? ((currentProfit - previousProfit) / previousProfit) * 100 : 0,
    profitGrowthAmount: currentProfit - previousProfit,
    profitMargin: currentRevenue ? (currentProfit / currentRevenue) * 100 : 0,
    previousProfitMargin: previousRevenue ? (previousProfit / previousRevenue) * 100 : 0,
    profitConsistency: calculateProfitConsistency(statements),
    profitQuality: calculateProfitQuality(statements)
  };

  // مقارنة مع معايير الصناعة
  const industryComparison = {
    industryAverageProfitMargin: benchmarkData?.industryAverageProfitMargin || 0,
    industryAverageProfitGrowth: benchmarkData?.industryAverageProfitGrowth || 0,
    profitMarginComparison: performanceMetrics.profitMargin - (benchmarkData?.industryAverageProfitMargin || 0),
    profitGrowthComparison: performanceMetrics.profitGrowth - (benchmarkData?.industryAverageProfitGrowth || 0)
  };

  // تقييم الأداء
  const evaluation = evaluateProfitabilityPerformance(performanceMetrics, industryComparison);

  return {
    id: 'profitability-performance',
    name: 'تحليل أداء الربحية',
    category: 'performance-analysis',
    description: 'تحليل شامل لأداء الربحية ونموها وتطورها',
    results: {
      performanceMetrics,
      industryComparison,
      evaluation
    },
    charts: [
      {
        type: 'line',
        title: 'تطور الربحية عبر الفترات',
        data: statements.map((statement, index) => ({
          label: `السنة ${index + 1}`,
          value: statement.incomeStatement?.netProfit || 0
        }))
      }
    ],
    recommendations: generateProfitabilityPerformanceRecommendations(performanceMetrics, industryComparison),
    risks: identifyProfitabilityPerformanceRisks(performanceMetrics, industryComparison),
    predictions: generateProfitabilityPerformancePredictions(performanceMetrics, industryComparison),
    swot: performProfitabilityPerformanceSWOT(performanceMetrics, industryComparison),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

// باقي الدوال المساعدة...

/**
 * حساب تقلب الإيرادات
 */
function calculateRevenueVolatility(statements: FinancialStatement[]): number {
  if (statements.length < 3) return 0;

  const revenues = statements.map(s => s.incomeStatement?.totalRevenue || 0);
  const mean = revenues.reduce((sum, rev) => sum + rev, 0) / revenues.length;
  const variance = revenues.reduce((sum, rev) => sum + Math.pow(rev - mean, 2), 0) / revenues.length;
  
  return Math.sqrt(variance) / mean * 100; // معامل التباين كنسبة مئوية
}

/**
 * حساب اتساق الإيرادات
 */
function calculateRevenueConsistency(statements: FinancialStatement[]): number {
  if (statements.length < 3) return 0;

  const revenues = statements.map(s => s.incomeStatement?.totalRevenue || 0);
  let positiveGrowthCount = 0;
  
  for (let i = 1; i < revenues.length; i++) {
    if (revenues[i] > revenues[i-1]) {
      positiveGrowthCount++;
    }
  }
  
  return (positiveGrowthCount / (revenues.length - 1)) * 100;
}

/**
 * حساب كفاءة التكاليف
 */
function calculateCostEfficiency(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;

  const currentStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];

  const currentCosts = currentStatement.incomeStatement?.costOfGoodsSold || 0;
  const previousCosts = previousStatement.incomeStatement?.costOfGoodsSold || 0;
  const currentRevenue = currentStatement.incomeStatement?.totalRevenue || 0;
  const previousRevenue = previousStatement.incomeStatement?.totalRevenue || 0;

  if (previousRevenue === 0) return 0;

  const currentCostRatio = currentRevenue ? currentCosts / currentRevenue : 0;
  const previousCostRatio = previousRevenue ? previousCosts / previousRevenue : 0;

  return previousCostRatio ? ((previousCostRatio - currentCostRatio) / previousCostRatio) * 100 : 0;
}

/**
 * حساب التحكم في التكاليف
 */
function calculateCostControl(statements: FinancialStatement[]): number {
  if (statements.length < 3) return 0;

  const costRatios = statements.map(s => {
    const costs = s.incomeStatement?.costOfGoodsSold || 0;
    const revenue = s.incomeStatement?.totalRevenue || 0;
    return revenue ? costs / revenue : 0;
  });

  const mean = costRatios.reduce((sum, ratio) => sum + ratio, 0) / costRatios.length;
  const variance = costRatios.reduce((sum, ratio) => sum + Math.pow(ratio - mean, 2), 0) / costRatios.length;
  
  return Math.max(0, 100 - (Math.sqrt(variance) / mean * 100)); // كلما قل التباين، زاد التحكم
}

/**
 * حساب اتساق الربحية
 */
function calculateProfitConsistency(statements: FinancialStatement[]): number {
  if (statements.length < 3) return 0;

  const profits = statements.map(s => s.incomeStatement?.netProfit || 0);
  let positiveProfitCount = 0;
  
  profits.forEach(profit => {
    if (profit > 0) {
      positiveProfitCount++;
    }
  });
  
  return (positiveProfitCount / profits.length) * 100;
}

/**
 * حساب جودة الربحية
 */
function calculateProfitQuality(statements: FinancialStatement[]): number {
  if (statements.length < 2) return 0;

  const currentStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];

  const currentProfit = currentStatement.incomeStatement?.netProfit || 0;
  const previousProfit = previousStatement.incomeStatement?.netProfit || 0;
  const currentRevenue = currentStatement.incomeStatement?.totalRevenue || 0;
  const previousRevenue = previousStatement.incomeStatement?.totalRevenue || 0;

  if (previousRevenue === 0) return 0;

  const currentProfitMargin = currentRevenue ? currentProfit / currentRevenue : 0;
  const previousProfitMargin = previousRevenue ? previousProfit / previousRevenue : 0;

  return previousProfitMargin ? ((currentProfitMargin - previousProfitMargin) / previousProfitMargin) * 100 : 0;
}

/**
 * تقييم أداء الإيرادات
 */
function evaluateRevenuePerformance(performanceMetrics: any, industryComparison: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم نمو الإيرادات
  if (performanceMetrics.revenueGrowth > 10) {
    score += 3;
  } else if (performanceMetrics.revenueGrowth > 5) {
    score += 2;
  } else if (performanceMetrics.revenueGrowth > 0) {
    score += 1;
  }

  // تقييم مقارنة مع الصناعة
  if (industryComparison.growthComparison > 5) {
    score += 2;
  } else if (industryComparison.growthComparison > 0) {
    score += 1;
  }

  // تقييم اتساق الإيرادات
  if (performanceMetrics.revenueConsistency > 80) {
    score += 2;
  } else if (performanceMetrics.revenueConsistency > 60) {
    score += 1;
  }

  // تحديد التقييم العام
  let overallRating: 'excellent' | 'very-good' | 'good' | 'acceptable' | 'weak';
  if (score >= 6) overallRating = 'excellent';
  else if (score >= 4) overallRating = 'very-good';
  else if (score >= 3) overallRating = 'good';
  else if (score >= 2) overallRating = 'acceptable';
  else overallRating = 'weak';

  // إنشاء التفسير
  interpretation = `أداء الإيرادات ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (performanceMetrics.revenueGrowth > 0) {
    interpretation += `الإيرادات في نمو بنسبة ${performanceMetrics.revenueGrowth.toFixed(1)}%. `;
  } else {
    interpretation += `الإيرادات في انخفاض بنسبة ${Math.abs(performanceMetrics.revenueGrowth).toFixed(1)}%. `;
  }

  if (industryComparison.growthComparison > 0) {
    interpretation += `النمو أعلى من متوسط الصناعة بنسبة ${industryComparison.growthComparison.toFixed(1)}%. `;
  } else {
    interpretation += `النمو أقل من متوسط الصناعة بنسبة ${Math.abs(industryComparison.growthComparison).toFixed(1)}%. `;
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * تقييم أداء التكاليف
 */
function evaluateCostPerformance(performanceMetrics: any, industryComparison: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم نمو التكاليف (كلما قل النمو، كان أفضل)
  if (performanceMetrics.costGrowth < 0) {
    score += 3;
  } else if (performanceMetrics.costGrowth < 5) {
    score += 2;
  } else if (performanceMetrics.costGrowth < 10) {
    score += 1;
  }

  // تقييم مقارنة مع الصناعة
  if (industryComparison.costRatioComparison < -5) {
    score += 2;
  } else if (industryComparison.costRatioComparison < 0) {
    score += 1;
  }

  // تقييم كفاءة التكاليف
  if (performanceMetrics.costEfficiency > 10) {
    score += 2;
  } else if (performanceMetrics.costEfficiency > 0) {
    score += 1;
  }

  // تحديد التقييم العام
  let overallRating: 'excellent' | 'very-good' | 'good' | 'acceptable' | 'weak';
  if (score >= 6) overallRating = 'excellent';
  else if (score >= 4) overallRating = 'very-good';
  else if (score >= 3) overallRating = 'good';
  else if (score >= 2) overallRating = 'acceptable';
  else overallRating = 'weak';

  // إنشاء التفسير
  interpretation = `أداء التكاليف ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (performanceMetrics.costGrowth < 0) {
    interpretation += `التكاليف في انخفاض بنسبة ${Math.abs(performanceMetrics.costGrowth).toFixed(1)}%. `;
  } else {
    interpretation += `التكاليف في نمو بنسبة ${performanceMetrics.costGrowth.toFixed(1)}%. `;
  }

  if (industryComparison.costRatioComparison < 0) {
    interpretation += `نسبة التكاليف أقل من متوسط الصناعة بنسبة ${Math.abs(industryComparison.costRatioComparison).toFixed(1)}%. `;
  } else {
    interpretation += `نسبة التكاليف أعلى من متوسط الصناعة بنسبة ${industryComparison.costRatioComparison.toFixed(1)}%. `;
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * تقييم أداء الربحية
 */
function evaluateProfitabilityPerformance(performanceMetrics: any, industryComparison: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم نمو الربحية
  if (performanceMetrics.profitGrowth > 20) {
    score += 3;
  } else if (performanceMetrics.profitGrowth > 10) {
    score += 2;
  } else if (performanceMetrics.profitGrowth > 0) {
    score += 1;
  }

  // تقييم مقارنة مع الصناعة
  if (industryComparison.profitMarginComparison > 5) {
    score += 2;
  } else if (industryComparison.profitMarginComparison > 0) {
    score += 1;
  }

  // تقييم اتساق الربحية
  if (performanceMetrics.profitConsistency > 80) {
    score += 2;
  } else if (performanceMetrics.profitConsistency > 60) {
    score += 1;
  }

  // تحديد التقييم العام
  let overallRating: 'excellent' | 'very-good' | 'good' | 'acceptable' | 'weak';
  if (score >= 6) overallRating = 'excellent';
  else if (score >= 4) overallRating = 'very-good';
  else if (score >= 3) overallRating = 'good';
  else if (score >= 2) overallRating = 'acceptable';
  else overallRating = 'weak';

  // إنشاء التفسير
  interpretation = `أداء الربحية ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (performanceMetrics.profitGrowth > 0) {
    interpretation += `الربحية في نمو بنسبة ${performanceMetrics.profitGrowth.toFixed(1)}%. `;
  } else {
    interpretation += `الربحية في انخفاض بنسبة ${Math.abs(performanceMetrics.profitGrowth).toFixed(1)}%. `;
  }

  if (industryComparison.profitMarginComparison > 0) {
    interpretation += `هامش الربح أعلى من متوسط الصناعة بنسبة ${industryComparison.profitMarginComparison.toFixed(1)}%. `;
  } else {
    interpretation += `هامش الربح أقل من متوسط الصناعة بنسبة ${Math.abs(industryComparison.profitMarginComparison).toFixed(1)}%. `;
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
 * توليد التوصيات لأداء الإيرادات
 */
function generateRevenuePerformanceRecommendations(performanceMetrics: any, industryComparison: any): string[] {
  const recommendations: string[] = [];

  if (performanceMetrics.revenueGrowth < 0) {
    recommendations.push('تحسين استراتيجية التسويق لزيادة الإيرادات');
    recommendations.push('تطوير منتجات وخدمات جديدة');
    recommendations.push('تحسين جودة المنتجات والخدمات');
  }

  if (industryComparison.growthComparison < 0) {
    recommendations.push('تحسين الأداء ليتفوق على متوسط الصناعة');
    recommendations.push('مراجعة استراتيجية التسعير');
    recommendations.push('تحسين الكفاءة التشغيلية');
  }

  if (performanceMetrics.revenueConsistency < 60) {
    recommendations.push('تحسين استقرار الإيرادات');
    recommendations.push('تنويع مصادر الإيرادات');
    recommendations.push('تحسين إدارة المخاطر');
  }

  return recommendations;
}

/**
 * توليد التوصيات لأداء التكاليف
 */
function generateCostPerformanceRecommendations(performanceMetrics: any, industryComparison: any): string[] {
  const recommendations: string[] = [];

  if (performanceMetrics.costGrowth > 10) {
    recommendations.push('تحسين إدارة التكاليف');
    recommendations.push('مراجعة عمليات الشراء');
    recommendations.push('تحسين الكفاءة التشغيلية');
  }

  if (industryComparison.costRatioComparison > 5) {
    recommendations.push('تحسين نسبة التكاليف لتصل إلى مستوى الصناعة');
    recommendations.push('مراجعة هيكل التكاليف');
    recommendations.push('تحسين عمليات الإنتاج');
  }

  if (performanceMetrics.costEfficiency < 0) {
    recommendations.push('تحسين كفاءة التكاليف');
    recommendations.push('مراجعة عمليات الإنتاج');
    recommendations.push('تحسين إدارة المخزون');
  }

  return recommendations;
}

/**
 * توليد التوصيات لأداء الربحية
 */
function generateProfitabilityPerformanceRecommendations(performanceMetrics: any, industryComparison: any): string[] {
  const recommendations: string[] = [];

  if (performanceMetrics.profitGrowth < 0) {
    recommendations.push('تحسين استراتيجية الربحية');
    recommendations.push('مراجعة هيكل التكاليف');
    recommendations.push('تحسين الكفاءة التشغيلية');
  }

  if (industryComparison.profitMarginComparison < 0) {
    recommendations.push('تحسين هامش الربح ليصل إلى مستوى الصناعة');
    recommendations.push('مراجعة استراتيجية التسعير');
    recommendations.push('تحسين الكفاءة التشغيلية');
  }

  if (performanceMetrics.profitConsistency < 60) {
    recommendations.push('تحسين استقرار الربحية');
    recommendations.push('تنويع مصادر الإيرادات');
    recommendations.push('تحسين إدارة المخاطر');
  }

  return recommendations;
}

// باقي الدوال المساعدة...

/**
 * تحديد المخاطر لأداء الإيرادات
 */
function identifyRevenuePerformanceRisks(performanceMetrics: any, industryComparison: any): string[] {
  const risks: string[] = [];

  if (performanceMetrics.revenueGrowth < 0) {
    risks.push('انخفاض الإيرادات قد يؤثر على النمو');
  }

  if (industryComparison.growthComparison < -10) {
    risks.push('النمو أقل بكثير من متوسط الصناعة مما قد يؤثر على التنافسية');
  }

  if (performanceMetrics.revenueConsistency < 50) {
    risks.push('عدم استقرار الإيرادات قد يؤثر على التخطيط');
  }

  if (performanceMetrics.revenueVolatility > 30) {
    risks.push('تقلب الإيرادات العالي قد يؤثر على الاستقرار');
  }

  return risks;
}

/**
 * تحديد المخاطر لأداء التكاليف
 */
function identifyCostPerformanceRisks(performanceMetrics: any, industryComparison: any): string[] {
  const risks: string[] = [];

  if (performanceMetrics.costGrowth > 15) {
    risks.push('ارتفاع التكاليف السريع قد يؤثر على الربحية');
  }

  if (industryComparison.costRatioComparison > 10) {
    risks.push('نسبة التكاليف أعلى بكثير من متوسط الصناعة مما قد يؤثر على التنافسية');
  }

  if (performanceMetrics.costEfficiency < -10) {
    risks.push('تراجع كفاءة التكاليف قد يؤثر على الربحية');
  }

  return risks;
}

/**
 * تحديد المخاطر لأداء الربحية
 */
function identifyProfitabilityPerformanceRisks(performanceMetrics: any, industryComparison: any): string[] {
  const risks: string[] = [];

  if (performanceMetrics.profitGrowth < -20) {
    risks.push('انخفاض الربحية السريع قد يؤثر على الاستقرار المالي');
  }

  if (industryComparison.profitMarginComparison < -10) {
    risks.push('هامش الربح أقل بكثير من متوسط الصناعة مما قد يؤثر على التنافسية');
  }

  if (performanceMetrics.profitConsistency < 50) {
    risks.push('عدم استقرار الربحية قد يؤثر على التخطيط');
  }

  return risks;
}

// باقي الدوال المساعدة...

/**
 * توليد التوقعات لأداء الإيرادات
 */
function generateRevenuePerformancePredictions(performanceMetrics: any, industryComparison: any): string[] {
  const predictions: string[] = [];

  if (performanceMetrics.revenueGrowth > 0) {
    predictions.push('من المتوقع أن يستمر نمو الإيرادات في المستقبل');
  } else {
    predictions.push('من المتوقع أن تتحسن الإيرادات في المستقبل');
  }

  if (industryComparison.growthComparison > 0) {
    predictions.push('من المتوقع أن تستمر الشركة في التفوق على متوسط الصناعة');
  } else {
    predictions.push('من المتوقع أن تتحسن الشركة لتصل إلى مستوى الصناعة');
  }

  return predictions;
}

/**
 * توليد التوقعات لأداء التكاليف
 */
function generateCostPerformancePredictions(performanceMetrics: any, industryComparison: any): string[] {
  const predictions: string[] = [];

  if (performanceMetrics.costGrowth < 0) {
    predictions.push('من المتوقع أن يستمر انخفاض التكاليف في المستقبل');
  } else {
    predictions.push('من المتوقع أن تتحسن إدارة التكاليف في المستقبل');
  }

  if (industryComparison.costRatioComparison < 0) {
    predictions.push('من المتوقع أن تستمر الشركة في التفوق على متوسط الصناعة في إدارة التكاليف');
  } else {
    predictions.push('من المتوقع أن تتحسن الشركة لتصل إلى مستوى الصناعة في إدارة التكاليف');
  }

  return predictions;
}

/**
 * توليد التوقعات لأداء الربحية
 */
function generateProfitabilityPerformancePredictions(performanceMetrics: any, industryComparison: any): string[] {
  const predictions: string[] = [];

  if (performanceMetrics.profitGrowth > 0) {
    predictions.push('من المتوقع أن يستمر نمو الربحية في المستقبل');
  } else {
    predictions.push('من المتوقع أن تتحسن الربحية في المستقبل');
  }

  if (industryComparison.profitMarginComparison > 0) {
    predictions.push('من المتوقع أن تستمر الشركة في التفوق على متوسط الصناعة في الربحية');
  } else {
    predictions.push('من المتوقع أن تتحسن الشركة لتصل إلى مستوى الصناعة في الربحية');
  }

  return predictions;
}

// باقي الدوال المساعدة...

/**
 * تحليل SWOT لأداء الإيرادات
 */
function performRevenuePerformanceSWOT(performanceMetrics: any, industryComparison: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (performanceMetrics.revenueGrowth > 0) {
    swot.strengths.push('الإيرادات في نمو');
  }

  if (industryComparison.growthComparison > 0) {
    swot.strengths.push('النمو أعلى من متوسط الصناعة');
  }

  if (performanceMetrics.revenueConsistency > 80) {
    swot.strengths.push('الإيرادات مستقرة');
  }

  if (performanceMetrics.revenueGrowth < 0) {
    swot.weaknesses.push('الإيرادات في انخفاض');
  }

  if (industryComparison.growthComparison < 0) {
    swot.weaknesses.push('النمو أقل من متوسط الصناعة');
  }

  if (performanceMetrics.revenueConsistency < 60) {
    swot.weaknesses.push('الإيرادات غير مستقرة');
  }

  swot.opportunities.push('تحسين استراتيجية التسويق');
  swot.opportunities.push('تطوير منتجات جديدة');
  swot.opportunities.push('زيادة الحصة السوقية');

  swot.threats.push('تغيرات في الطلب');
  swot.threats.push('منافسة شديدة');
  swot.threats.push('تغيرات في الظروف الاقتصادية');

  return swot;
}

/**
 * تحليل SWOT لأداء التكاليف
 */
function performCostPerformanceSWOT(performanceMetrics: any, industryComparison: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (performanceMetrics.costGrowth < 0) {
    swot.strengths.push('التكاليف في انخفاض');
  }

  if (industryComparison.costRatioComparison < 0) {
    swot.strengths.push('نسبة التكاليف أقل من متوسط الصناعة');
  }

  if (performanceMetrics.costEfficiency > 0) {
    swot.strengths.push('كفاءة التكاليف في تحسن');
  }

  if (performanceMetrics.costGrowth > 10) {
    swot.weaknesses.push('التكاليف في نمو سريع');
  }

  if (industryComparison.costRatioComparison > 5) {
    swot.weaknesses.push('نسبة التكاليف أعلى من متوسط الصناعة');
  }

  if (performanceMetrics.costEfficiency < 0) {
    swot.weaknesses.push('كفاءة التكاليف في تراجع');
  }

  swot.opportunities.push('تحسين إدارة التكاليف');
  swot.opportunities.push('تحسين الكفاءة التشغيلية');
  swot.opportunities.push('تحسين عمليات الشراء');

  swot.threats.push('ارتفاع تكاليف المدخلات');
  swot.threats.push('تغيرات في أسعار المواد الخام');
  swot.threats.push('تغيرات في تكاليف العمالة');

  return swot;
}

/**
 * تحليل SWOT لأداء الربحية
 */
function performProfitabilityPerformanceSWOT(performanceMetrics: any, industryComparison: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (performanceMetrics.profitGrowth > 0) {
    swot.strengths.push('الربحية في نمو');
  }

  if (industryComparison.profitMarginComparison > 0) {
    swot.strengths.push('هامش الربح أعلى من متوسط الصناعة');
  }

  if (performanceMetrics.profitConsistency > 80) {
    swot.strengths.push('الربحية مستقرة');
  }

  if (performanceMetrics.profitGrowth < 0) {
    swot.weaknesses.push('الربحية في انخفاض');
  }

  if (industryComparison.profitMarginComparison < 0) {
    swot.weaknesses.push('هامش الربح أقل من متوسط الصناعة');
  }

  if (performanceMetrics.profitConsistency < 60) {
    swot.weaknesses.push('الربحية غير مستقرة');
  }

  swot.opportunities.push('تحسين استراتيجية الربحية');
  swot.opportunities.push('تحسين الكفاءة التشغيلية');
  swot.opportunities.push('تحسين إدارة التكاليف');

  swot.threats.push('تغيرات في الطلب');
  swot.threats.push('منافسة شديدة');
  swot.threats.push('تغيرات في الظروف الاقتصادية');

  return swot;
}

// باقي الدوال المساعدة...

/**
 * تحليل أداء السيولة
 */
async function analyzeLiquidityPerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل أداء السيولة
  return createErrorResult('تحليل أداء السيولة', 'تحت التنفيذ');
}

/**
 * تحليل أداء الكفاءة التشغيلية
 */
async function analyzeOperationalEfficiencyPerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل أداء الكفاءة التشغيلية
  return createErrorResult('تحليل أداء الكفاءة التشغيلية', 'تحت التنفيذ');
}

/**
 * تحليل أداء الكفاءة المالية
 */
async function analyzeFinancialEfficiencyPerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل أداء الكفاءة المالية
  return createErrorResult('تحليل أداء الكفاءة المالية', 'تحت التنفيذ');
}

/**
 * تحليل أداء الكفاءة الاستثمارية
 */
async function analyzeInvestmentEfficiencyPerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل أداء الكفاءة الاستثمارية
  return createErrorResult('تحليل أداء الكفاءة الاستثمارية', 'تحت التنفيذ');
}

/**
 * تحليل أداء الكفاءة التسويقية
 */
async function analyzeMarketingEfficiencyPerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل أداء الكفاءة التسويقية
  return createErrorResult('تحليل أداء الكفاءة التسويقية', 'تحت التنفيذ');
}

/**
 * تحليل أداء الكفاءة الإنتاجية
 */
async function analyzeProductionEfficiencyPerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل أداء الكفاءة الإنتاجية
  return createErrorResult('تحليل أداء الكفاءة الإنتاجية', 'تحت التنفيذ');
}

/**
 * تحليل أداء الكفاءة الإدارية
 */
async function analyzeAdministrativeEfficiencyPerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل أداء الكفاءة الإدارية
  return createErrorResult('تحليل أداء الكفاءة الإدارية', 'تحت التنفيذ');
}

/**
 * تحليل أداء الكفاءة التقنية
 */
async function analyzeTechnicalEfficiencyPerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل أداء الكفاءة التقنية
  return createErrorResult('تحليل أداء الكفاءة التقنية', 'تحت التنفيذ');
}

/**
 * تحليل أداء الكفاءة الشاملة
 */
async function analyzeOverallEfficiencyPerformance(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل أداء الكفاءة الشاملة
  return createErrorResult('تحليل أداء الكفاءة الشاملة', 'تحت التنفيذ');
}
