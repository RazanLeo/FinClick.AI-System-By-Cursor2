import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';

/**
 * التحليل الإحصائي والكمي (20 تحليل)
 * حسب التصنيف المحدد في البرومبت
 */

export async function performStatisticalAnalysis(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];

  // 1. التحليل الإحصائي الوصفي
  results.push(await analyzeDescriptiveStatistics(statements, companyData, marketData, benchmarkData));

  // 2. التحليل الإحصائي الاستنتاجي
  results.push(await analyzeInferentialStatistics(statements, companyData, marketData, benchmarkData));

  // 3. التحليل الإحصائي الارتباطي
  results.push(await analyzeCorrelationStatistics(statements, companyData, marketData, benchmarkData));

  // 4. التحليل الإحصائي الانحداري
  results.push(await analyzeRegressionStatistics(statements, companyData, marketData, benchmarkData));

  // 5. التحليل الإحصائي التبايني
  results.push(await analyzeVarianceStatistics(statements, companyData, marketData, benchmarkData));

  // 6. التحليل الإحصائي التوزيعي
  results.push(await analyzeDistributionStatistics(statements, companyData, marketData, benchmarkData));

  // 7. التحليل الإحصائي الزمني
  results.push(await analyzeTimeSeriesStatistics(statements, companyData, marketData, benchmarkData));

  // 8. التحليل الإحصائي التنبؤي
  results.push(await analyzePredictiveStatistics(statements, companyData, marketData, benchmarkData));

  // 9. التحليل الإحصائي المقارن
  results.push(await analyzeComparativeStatistics(statements, companyData, marketData, benchmarkData));

  // 10. التحليل الإحصائي التصنيفي
  results.push(await analyzeClassificationStatistics(statements, companyData, marketData, benchmarkData));

  // 11. التحليل الإحصائي التجميعي
  results.push(await analyzeClusteringStatistics(statements, companyData, marketData, benchmarkData));

  // 12. التحليل الإحصائي التصنيفي المتقدم
  results.push(await analyzeAdvancedClassificationStatistics(statements, companyData, marketData, benchmarkData));

  // 13. التحليل الإحصائي التجميعي المتقدم
  results.push(await analyzeAdvancedClusteringStatistics(statements, companyData, marketData, benchmarkData));

  // 14. التحليل الإحصائي التنبؤي المتقدم
  results.push(await analyzeAdvancedPredictiveStatistics(statements, companyData, marketData, benchmarkData));

  // 15. التحليل الإحصائي الزمني المتقدم
  results.push(await analyzeAdvancedTimeSeriesStatistics(statements, companyData, marketData, benchmarkData));

  // 16. التحليل الإحصائي الارتباطي المتقدم
  results.push(await analyzeAdvancedCorrelationStatistics(statements, companyData, marketData, benchmarkData));

  // 17. التحليل الإحصائي الانحداري المتقدم
  results.push(await analyzeAdvancedRegressionStatistics(statements, companyData, marketData, benchmarkData));

  // 18. التحليل الإحصائي التبايني المتقدم
  results.push(await analyzeAdvancedVarianceStatistics(statements, companyData, marketData, benchmarkData));

  // 19. التحليل الإحصائي التوزيعي المتقدم
  results.push(await analyzeAdvancedDistributionStatistics(statements, companyData, marketData, benchmarkData));

  // 20. التحليل الإحصائي الشامل
  results.push(await analyzeComprehensiveStatistics(statements, companyData, marketData, benchmarkData));

  return results;
}

/**
 * التحليل الإحصائي الوصفي
 */
async function analyzeDescriptiveStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  if (statements.length < 2) {
    return createErrorResult('التحليل الإحصائي الوصفي', 'يحتاج إلى بيانات سنتين على الأقل');
  }

  // استخراج البيانات المالية
  const revenues = statements.map(s => s.incomeStatement?.totalRevenue || 0);
  const profits = statements.map(s => s.incomeStatement?.netProfit || 0);
  const assets = statements.map(s => s.balanceSheet?.totalAssets || 0);

  // حساب الإحصائيات الوصفية
  const descriptiveStats = {
    revenue: calculateDescriptiveStats(revenues),
    profit: calculateDescriptiveStats(profits),
    assets: calculateDescriptiveStats(assets)
  };

  // تقييم الإحصائيات
  const evaluation = evaluateDescriptiveStatistics(descriptiveStats);

  return {
    id: 'descriptive-statistics',
    name: 'التحليل الإحصائي الوصفي',
    category: 'statistical-analysis',
    description: 'تحليل شامل للإحصائيات الوصفية للبيانات المالية',
    results: {
      descriptiveStats,
      evaluation
    },
    charts: [
      {
        type: 'line',
        title: 'تطور البيانات المالية',
        data: statements.map((statement, index) => ({
          label: `السنة ${index + 1}`,
          value: statement.incomeStatement?.totalRevenue || 0
        }))
      }
    ],
    recommendations: generateDescriptiveStatisticsRecommendations(descriptiveStats),
    risks: identifyDescriptiveStatisticsRisks(descriptiveStats),
    predictions: generateDescriptiveStatisticsPredictions(descriptiveStats),
    swot: performDescriptiveStatisticsSWOT(descriptiveStats),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

// باقي الدوال المساعدة...

/**
 * حساب الإحصائيات الوصفية
 */
function calculateDescriptiveStats(data: number[]): any {
  if (data.length === 0) return {};

  const sorted = [...data].sort((a, b) => a - b);
  const sum = data.reduce((acc, val) => acc + val, 0);
  const mean = sum / data.length;
  const median = sorted.length % 2 === 0 
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  
  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = mean !== 0 ? standardDeviation / mean : 0;
  
  return {
    count: data.length,
    sum,
    mean,
    median,
    mode: findMode(data),
    min: Math.min(...data),
    max: Math.max(...data),
    range: Math.max(...data) - Math.min(...data),
    variance,
    standardDeviation,
    coefficientOfVariation,
    skewness: calculateSkewness(data, mean, standardDeviation),
    kurtosis: calculateKurtosis(data, mean, standardDeviation)
  };
}

/**
 * إيجاد المنوال
 */
function findMode(data: number[]): number {
  const frequency: { [key: number]: number } = {};
  data.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  
  let maxFreq = 0;
  let mode = 0;
  Object.entries(frequency).forEach(([val, freq]) => {
    if (freq > maxFreq) {
      maxFreq = freq;
      mode = Number(val);
    }
  });
  
  return mode;
}

/**
 * حساب الانحراف
 */
function calculateSkewness(data: number[], mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  
  const n = data.length;
  const skewness = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0) / n;
  return skewness;
}

/**
 * حساب التفرطح
 */
function calculateKurtosis(data: number[], mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  
  const n = data.length;
  const kurtosis = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0) / n - 3;
  return kurtosis;
}

/**
 * تقييم الإحصائيات الوصفية
 */
function evaluateDescriptiveStatistics(descriptiveStats: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم استقرار الإيرادات
  if (descriptiveStats.revenue.coefficientOfVariation < 0.2) {
    score += 2;
  } else if (descriptiveStats.revenue.coefficientOfVariation < 0.4) {
    score += 1;
  }

  // تقييم استقرار الأرباح
  if (descriptiveStats.profit.coefficientOfVariation < 0.3) {
    score += 2;
  } else if (descriptiveStats.profit.coefficientOfVariation < 0.6) {
    score += 1;
  }

  // تقييم نمو الأصول
  if (descriptiveStats.assets.mean > 0) {
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
  interpretation = `التحليل الإحصائي الوصفي ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'}. `;

  if (descriptiveStats.revenue.coefficientOfVariation < 0.2) {
    interpretation += 'الإيرادات مستقرة نسبياً. ';
  } else {
    interpretation += 'الإيرادات متقلبة نسبياً. ';
  }

  if (descriptiveStats.profit.coefficientOfVariation < 0.3) {
    interpretation += 'الأرباح مستقرة نسبياً. ';
  } else {
    interpretation += 'الأرباح متقلبة نسبياً. ';
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
 * توليد التوصيات للإحصائيات الوصفية
 */
function generateDescriptiveStatisticsRecommendations(descriptiveStats: any): string[] {
  const recommendations: string[] = [];

  if (descriptiveStats.revenue.coefficientOfVariation > 0.4) {
    recommendations.push('تحسين استقرار الإيرادات من خلال تنويع مصادر الدخل');
  }

  if (descriptiveStats.profit.coefficientOfVariation > 0.6) {
    recommendations.push('تحسين استقرار الأرباح من خلال تحسين إدارة التكاليف');
  }

  if (descriptiveStats.assets.mean <= 0) {
    recommendations.push('تحسين نمو الأصول من خلال زيادة الاستثمارات');
  }

  return recommendations;
}

/**
 * تحديد المخاطر للإحصائيات الوصفية
 */
function identifyDescriptiveStatisticsRisks(descriptiveStats: any): string[] {
  const risks: string[] = [];

  if (descriptiveStats.revenue.coefficientOfVariation > 0.4) {
    risks.push('تقلب الإيرادات العالي قد يؤثر على التخطيط');
  }

  if (descriptiveStats.profit.coefficientOfVariation > 0.6) {
    risks.push('تقلب الأرباح العالي قد يؤثر على الاستقرار المالي');
  }

  if (descriptiveStats.assets.mean <= 0) {
    risks.push('عدم نمو الأصول قد يؤثر على التوسع');
  }

  return risks;
}

/**
 * توليد التوقعات للإحصائيات الوصفية
 */
function generateDescriptiveStatisticsPredictions(descriptiveStats: any): string[] {
  const predictions: string[] = [];

  if (descriptiveStats.revenue.coefficientOfVariation < 0.2) {
    predictions.push('من المتوقع أن تبقى الإيرادات مستقرة في المستقبل');
  } else {
    predictions.push('من المتوقع أن تتحسن استقرار الإيرادات في المستقبل');
  }

  if (descriptiveStats.profit.coefficientOfVariation < 0.3) {
    predictions.push('من المتوقع أن تبقى الأرباح مستقرة في المستقبل');
  } else {
    predictions.push('من المتوقع أن تتحسن استقرار الأرباح في المستقبل');
  }

  return predictions;
}

/**
 * تحليل SWOT للإحصائيات الوصفية
 */
function performDescriptiveStatisticsSWOT(descriptiveStats: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  if (descriptiveStats.revenue.coefficientOfVariation < 0.2) {
    swot.strengths.push('الإيرادات مستقرة');
  } else {
    swot.weaknesses.push('الإيرادات متقلبة');
  }

  if (descriptiveStats.profit.coefficientOfVariation < 0.3) {
    swot.strengths.push('الأرباح مستقرة');
  } else {
    swot.weaknesses.push('الأرباح متقلبة');
  }

  swot.opportunities.push('تحسين استقرار البيانات المالية');
  swot.opportunities.push('تحسين التخطيط المالي');
  swot.opportunities.push('تحسين إدارة المخاطر');

  swot.threats.push('تغيرات في الظروف الاقتصادية');
  swot.threats.push('تغيرات في معايير الصناعة');
  swot.threats.push('تغيرات في أداء الشركة');

  return swot;
}

// باقي الدوال المساعدة...

/**
 * التحليل الإحصائي الاستنتاجي
 */
async function analyzeInferentialStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي الاستنتاجي', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي الارتباطي
 */
async function analyzeCorrelationStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي الارتباطي', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي الانحداري
 */
async function analyzeRegressionStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي الانحداري', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي التبايني
 */
async function analyzeVarianceStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي التبايني', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي التوزيعي
 */
async function analyzeDistributionStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي التوزيعي', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي الزمني
 */
async function analyzeTimeSeriesStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي الزمني', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي التنبؤي
 */
async function analyzePredictiveStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي التنبؤي', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي المقارن
 */
async function analyzeComparativeStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي المقارن', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي التصنيفي
 */
async function analyzeClassificationStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي التصنيفي', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي التجميعي
 */
async function analyzeClusteringStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي التجميعي', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي التصنيفي المتقدم
 */
async function analyzeAdvancedClassificationStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي التصنيفي المتقدم', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي التجميعي المتقدم
 */
async function analyzeAdvancedClusteringStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي التجميعي المتقدم', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي التنبؤي المتقدم
 */
async function analyzeAdvancedPredictiveStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي التنبؤي المتقدم', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي الزمني المتقدم
 */
async function analyzeAdvancedTimeSeriesStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي الزمني المتقدم', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي الارتباطي المتقدم
 */
async function analyzeAdvancedCorrelationStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي الارتباطي المتقدم', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي الانحداري المتقدم
 */
async function analyzeAdvancedRegressionStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي الانحداري المتقدم', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي التبايني المتقدم
 */
async function analyzeAdvancedVarianceStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي التبايني المتقدم', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي التوزيعي المتقدم
 */
async function analyzeAdvancedDistributionStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي التوزيعي المتقدم', 'تحت التنفيذ');
}

/**
 * التحليل الإحصائي الشامل
 */
async function analyzeComprehensiveStatistics(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  return createErrorResult('التحليل الإحصائي الشامل', 'تحت التنفيذ');
}
