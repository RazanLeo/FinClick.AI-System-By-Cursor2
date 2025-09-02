import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';

/**
 * تحليلات المقارنة المتقدمة (10 تحليلات)
 * حسب التصنيف المحدد في البرومبت
 */

export async function performComparativeAnalysis(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];

  // 1. تحليل المقارنة مع الشركات المماثلة
  results.push(await analyzePeerComparison(statements, companyData, marketData, benchmarkData));

  // 2. تحليل المقارنة مع معايير الصناعة
  results.push(await analyzeIndustryBenchmarkComparison(statements, companyData, marketData, benchmarkData));

  // 3. تحليل المقارنة مع المنافسين
  results.push(await analyzeCompetitorComparison(statements, companyData, marketData, benchmarkData));

  // 4. تحليل المقارنة مع الشركات الرائدة
  results.push(await analyzeLeaderComparison(statements, companyData, marketData, benchmarkData));

  // 5. تحليل المقارنة مع الشركات الناشئة
  results.push(await analyzeStartupComparison(statements, companyData, marketData, benchmarkData));

  // 6. تحليل المقارنة مع الشركات المتوسطة
  results.push(await analyzeMidSizeComparison(statements, companyData, marketData, benchmarkData));

  // 7. تحليل المقارنة مع الشركات الكبيرة
  results.push(await analyzeLargeCompanyComparison(statements, companyData, marketData, benchmarkData));

  // 8. تحليل المقارنة مع الشركات الصغيرة
  results.push(await analyzeSmallCompanyComparison(statements, companyData, marketData, benchmarkData));

  // 9. تحليل المقارنة مع الشركات المحلية
  results.push(await analyzeLocalCompanyComparison(statements, companyData, marketData, benchmarkData));

  // 10. تحليل المقارنة مع الشركات الدولية
  results.push(await analyzeInternationalCompanyComparison(statements, companyData, marketData, benchmarkData));

  return results;
}

/**
 * تحليل المقارنة مع الشركات المماثلة
 */
async function analyzePeerComparison(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.balanceSheet || !latestStatement.incomeStatement) {
    return createErrorResult('تحليل المقارنة مع الشركات المماثلة', 'بيانات القوائم المالية غير متوفرة');
  }

  const balanceSheet = latestStatement.balanceSheet;
  const incomeStatement = latestStatement.incomeStatement;

  // حساب النسب المالية الأساسية
  const ratios = {
    currentRatio: (balanceSheet.currentAssets || 0) / (balanceSheet.currentLiabilities || 1),
    quickRatio: ((balanceSheet.currentAssets || 0) - (balanceSheet.inventory || 0)) / (balanceSheet.currentLiabilities || 1),
    debtToEquityRatio: (balanceSheet.totalLiabilities || 0) / (balanceSheet.totalEquity || 1),
    returnOnAssets: (incomeStatement.netProfit || 0) / (balanceSheet.totalAssets || 1),
    returnOnEquity: (incomeStatement.netProfit || 0) / (balanceSheet.totalEquity || 1),
    grossProfitMargin: (incomeStatement.grossProfit || 0) / (incomeStatement.totalRevenue || 1),
    operatingProfitMargin: (incomeStatement.operatingProfit || 0) / (incomeStatement.totalRevenue || 1),
    netProfitMargin: (incomeStatement.netProfit || 0) / (incomeStatement.totalRevenue || 1)
  };

  // مقارنة مع الشركات المماثلة
  const peerComparison = {
    currentRatioComparison: compareWithPeers(ratios.currentRatio, 'currentRatio', benchmarkData),
    quickRatioComparison: compareWithPeers(ratios.quickRatio, 'quickRatio', benchmarkData),
    debtToEquityComparison: compareWithPeers(ratios.debtToEquityRatio, 'debtToEquityRatio', benchmarkData),
    returnOnAssetsComparison: compareWithPeers(ratios.returnOnAssets, 'returnOnAssets', benchmarkData),
    returnOnEquityComparison: compareWithPeers(ratios.returnOnEquity, 'returnOnEquity', benchmarkData),
    grossProfitMarginComparison: compareWithPeers(ratios.grossProfitMargin, 'grossProfitMargin', benchmarkData),
    operatingProfitMarginComparison: compareWithPeers(ratios.operatingProfitMargin, 'operatingProfitMargin', benchmarkData),
    netProfitMarginComparison: compareWithPeers(ratios.netProfitMargin, 'netProfitMargin', benchmarkData)
  };

  // تقييم المقارنة
  const evaluation = evaluatePeerComparison(peerComparison);

  return {
    id: 'peer-comparison',
    name: 'تحليل المقارنة مع الشركات المماثلة',
    category: 'comparative-analysis',
    description: 'تحليل شامل للمقارنة مع الشركات المماثلة في نفس القطاع والحجم',
    results: {
      ratios,
      peerComparison,
      evaluation
    },
    charts: [
      {
        type: 'bar',
        title: 'مقارنة النسب المالية مع الشركات المماثلة',
        data: [
          { label: 'النسبة الحالية', value: ratios.currentRatio },
          { label: 'نسبة السيولة السريعة', value: ratios.quickRatio },
          { label: 'نسبة الدين إلى حقوق الملكية', value: ratios.debtToEquityRatio },
          { label: 'العائد على الأصول', value: ratios.returnOnAssets },
          { label: 'العائد على حقوق الملكية', value: ratios.returnOnEquity }
        ]
      }
    ],
    recommendations: generatePeerComparisonRecommendations(peerComparison),
    risks: identifyPeerComparisonRisks(peerComparison),
    predictions: generatePeerComparisonPredictions(peerComparison),
    swot: performPeerComparisonSWOT(peerComparison),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

/**
 * تحليل المقارنة مع معايير الصناعة
 */
async function analyzeIndustryBenchmarkComparison(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  const latestStatement = statements[statements.length - 1];
  
  if (!latestStatement.balanceSheet || !latestStatement.incomeStatement) {
    return createErrorResult('تحليل المقارنة مع معايير الصناعة', 'بيانات القوائم المالية غير متوفرة');
  }

  const balanceSheet = latestStatement.balanceSheet;
  const incomeStatement = latestStatement.incomeStatement;

  // حساب النسب المالية الأساسية
  const ratios = {
    currentRatio: (balanceSheet.currentAssets || 0) / (balanceSheet.currentLiabilities || 1),
    quickRatio: ((balanceSheet.currentAssets || 0) - (balanceSheet.inventory || 0)) / (balanceSheet.currentLiabilities || 1),
    debtToEquityRatio: (balanceSheet.totalLiabilities || 0) / (balanceSheet.totalEquity || 1),
    returnOnAssets: (incomeStatement.netProfit || 0) / (balanceSheet.totalAssets || 1),
    returnOnEquity: (incomeStatement.netProfit || 0) / (balanceSheet.totalEquity || 1),
    grossProfitMargin: (incomeStatement.grossProfit || 0) / (incomeStatement.totalRevenue || 1),
    operatingProfitMargin: (incomeStatement.operatingProfit || 0) / (incomeStatement.totalRevenue || 1),
    netProfitMargin: (incomeStatement.netProfit || 0) / (incomeStatement.totalRevenue || 1)
  };

  // مقارنة مع معايير الصناعة
  const industryComparison = {
    currentRatioComparison: compareWithIndustry(ratios.currentRatio, 'currentRatio', benchmarkData),
    quickRatioComparison: compareWithIndustry(ratios.quickRatio, 'quickRatio', benchmarkData),
    debtToEquityComparison: compareWithIndustry(ratios.debtToEquityRatio, 'debtToEquityRatio', benchmarkData),
    returnOnAssetsComparison: compareWithIndustry(ratios.returnOnAssets, 'returnOnAssets', benchmarkData),
    returnOnEquityComparison: compareWithIndustry(ratios.returnOnEquity, 'returnOnEquity', benchmarkData),
    grossProfitMarginComparison: compareWithIndustry(ratios.grossProfitMargin, 'grossProfitMargin', benchmarkData),
    operatingProfitMarginComparison: compareWithIndustry(ratios.operatingProfitMargin, 'operatingProfitMargin', benchmarkData),
    netProfitMarginComparison: compareWithIndustry(ratios.netProfitMargin, 'netProfitMargin', benchmarkData)
  };

  // تقييم المقارنة
  const evaluation = evaluateIndustryComparison(industryComparison);

  return {
    id: 'industry-benchmark-comparison',
    name: 'تحليل المقارنة مع معايير الصناعة',
    category: 'comparative-analysis',
    description: 'تحليل شامل للمقارنة مع معايير الصناعة والمتوسطات القطاعية',
    results: {
      ratios,
      industryComparison,
      evaluation
    },
    charts: [
      {
        type: 'bar',
        title: 'مقارنة النسب المالية مع معايير الصناعة',
        data: [
          { label: 'النسبة الحالية', value: ratios.currentRatio },
          { label: 'نسبة السيولة السريعة', value: ratios.quickRatio },
          { label: 'نسبة الدين إلى حقوق الملكية', value: ratios.debtToEquityRatio },
          { label: 'العائد على الأصول', value: ratios.returnOnAssets },
          { label: 'العائد على حقوق الملكية', value: ratios.returnOnEquity }
        ]
      }
    ],
    recommendations: generateIndustryComparisonRecommendations(industryComparison),
    risks: identifyIndustryComparisonRisks(industryComparison),
    predictions: generateIndustryComparisonPredictions(industryComparison),
    swot: performIndustryComparisonSWOT(industryComparison),
    finalEvaluation: {
      rating: evaluation.overallRating,
      score: evaluation.score,
      interpretation: evaluation.interpretation
    }
  };
}

// باقي الدوال المساعدة...

/**
 * مقارنة مع الشركات المماثلة
 */
function compareWithPeers(ratio: number, ratioType: string, benchmarkData: any): any {
  if (!benchmarkData || !benchmarkData.peers) {
    return {
      companyValue: ratio,
      peerAverage: 0,
      peerMedian: 0,
      peerPercentile: 50,
      comparison: 'no-data',
      interpretation: 'لا توجد بيانات للمقارنة'
    };
  }

  const peerData = benchmarkData.peers[ratioType];
  if (!peerData) {
    return {
      companyValue: ratio,
      peerAverage: 0,
      peerMedian: 0,
      peerPercentile: 50,
      comparison: 'no-data',
      interpretation: 'لا توجد بيانات للمقارنة'
    };
  }

  const peerAverage = peerData.average || 0;
  const peerMedian = peerData.median || 0;
  const peerPercentile = calculatePercentile(ratio, peerData.values || []);

  let comparison: 'above' | 'below' | 'average' | 'no-data';
  if (ratio > peerAverage * 1.1) {
    comparison = 'above';
  } else if (ratio < peerAverage * 0.9) {
    comparison = 'below';
  } else {
    comparison = 'average';
  }

  let interpretation = '';
  switch (comparison) {
    case 'above':
      interpretation = `النسبة أعلى من متوسط الشركات المماثلة بنسبة ${((ratio - peerAverage) / peerAverage * 100).toFixed(1)}%`;
      break;
    case 'below':
      interpretation = `النسبة أقل من متوسط الشركات المماثلة بنسبة ${((peerAverage - ratio) / peerAverage * 100).toFixed(1)}%`;
      break;
    case 'average':
      interpretation = 'النسبة قريبة من متوسط الشركات المماثلة';
      break;
    default:
      interpretation = 'لا توجد بيانات للمقارنة';
  }

  return {
    companyValue: ratio,
    peerAverage,
    peerMedian,
    peerPercentile,
    comparison,
    interpretation
  };
}

/**
 * مقارنة مع معايير الصناعة
 */
function compareWithIndustry(ratio: number, ratioType: string, benchmarkData: any): any {
  if (!benchmarkData || !benchmarkData.industry) {
    return {
      companyValue: ratio,
      industryAverage: 0,
      industryMedian: 0,
      industryPercentile: 50,
      comparison: 'no-data',
      interpretation: 'لا توجد بيانات للمقارنة'
    };
  }

  const industryData = benchmarkData.industry[ratioType];
  if (!industryData) {
    return {
      companyValue: ratio,
      industryAverage: 0,
      industryMedian: 0,
      industryPercentile: 50,
      comparison: 'no-data',
      interpretation: 'لا توجد بيانات للمقارنة'
    };
  }

  const industryAverage = industryData.average || 0;
  const industryMedian = industryData.median || 0;
  const industryPercentile = calculatePercentile(ratio, industryData.values || []);

  let comparison: 'above' | 'below' | 'average' | 'no-data';
  if (ratio > industryAverage * 1.1) {
    comparison = 'above';
  } else if (ratio < industryAverage * 0.9) {
    comparison = 'below';
  } else {
    comparison = 'average';
  }

  let interpretation = '';
  switch (comparison) {
    case 'above':
      interpretation = `النسبة أعلى من متوسط الصناعة بنسبة ${((ratio - industryAverage) / industryAverage * 100).toFixed(1)}%`;
      break;
    case 'below':
      interpretation = `النسبة أقل من متوسط الصناعة بنسبة ${((industryAverage - ratio) / industryAverage * 100).toFixed(1)}%`;
      break;
    case 'average':
      interpretation = 'النسبة قريبة من متوسط الصناعة';
      break;
    default:
      interpretation = 'لا توجد بيانات للمقارنة';
  }

  return {
    companyValue: ratio,
    industryAverage,
    industryMedian,
    industryPercentile,
    comparison,
    interpretation
  };
}

/**
 * حساب النسبة المئوية
 */
function calculatePercentile(value: number, values: number[]): number {
  if (values.length === 0) return 50;
  
  const sortedValues = [...values].sort((a, b) => a - b);
  const index = sortedValues.findIndex(v => v >= value);
  
  if (index === -1) return 100;
  if (index === 0) return 0;
  
  return (index / sortedValues.length) * 100;
}

/**
 * تقييم مقارنة الشركات المماثلة
 */
function evaluatePeerComparison(peerComparison: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم كل نسبة
  const comparisons = Object.values(peerComparison) as any[];
  let aboveCount = 0;
  let belowCount = 0;
  let averageCount = 0;

  comparisons.forEach(comparison => {
    if (comparison.comparison === 'above') {
      score += 2;
      aboveCount++;
    } else if (comparison.comparison === 'average') {
      score += 1;
      averageCount++;
    } else if (comparison.comparison === 'below') {
      belowCount++;
    }
  });

  // تحديد التقييم العام
  let overallRating: 'excellent' | 'very-good' | 'good' | 'acceptable' | 'weak';
  if (score >= 12) overallRating = 'excellent';
  else if (score >= 8) overallRating = 'very-good';
  else if (score >= 4) overallRating = 'good';
  else if (score >= 2) overallRating = 'acceptable';
  else overallRating = 'weak';

  // إنشاء التفسير
  interpretation = `الأداء المالي ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'} مقارنة بالشركات المماثلة. `;

  if (aboveCount > belowCount) {
    interpretation += `الشركة تتفوق على ${aboveCount} نسبة مالية مقارنة بالشركات المماثلة. `;
  } else if (belowCount > aboveCount) {
    interpretation += `الشركة تحتاج لتحسين ${belowCount} نسبة مالية مقارنة بالشركات المماثلة. `;
  } else {
    interpretation += 'الشركة في مستوى متوسط مقارنة بالشركات المماثلة. ';
  }

  return {
    overallRating,
    score,
    interpretation
  };
}

/**
 * تقييم مقارنة معايير الصناعة
 */
function evaluateIndustryComparison(industryComparison: any): any {
  let score = 0;
  let interpretation = '';

  // تقييم كل نسبة
  const comparisons = Object.values(industryComparison) as any[];
  let aboveCount = 0;
  let belowCount = 0;
  let averageCount = 0;

  comparisons.forEach(comparison => {
    if (comparison.comparison === 'above') {
      score += 2;
      aboveCount++;
    } else if (comparison.comparison === 'average') {
      score += 1;
      averageCount++;
    } else if (comparison.comparison === 'below') {
      belowCount++;
    }
  });

  // تحديد التقييم العام
  let overallRating: 'excellent' | 'very-good' | 'good' | 'acceptable' | 'weak';
  if (score >= 12) overallRating = 'excellent';
  else if (score >= 8) overallRating = 'very-good';
  else if (score >= 4) overallRating = 'good';
  else if (score >= 2) overallRating = 'acceptable';
  else overallRating = 'weak';

  // إنشاء التفسير
  interpretation = `الأداء المالي ${overallRating === 'excellent' ? 'ممتاز' : 
    overallRating === 'very-good' ? 'جيد جداً' : 
    overallRating === 'good' ? 'جيد' : 
    overallRating === 'acceptable' ? 'مقبول' : 'ضعيف'} مقارنة بمعايير الصناعة. `;

  if (aboveCount > belowCount) {
    interpretation += `الشركة تتفوق على ${aboveCount} نسبة مالية مقارنة بمعايير الصناعة. `;
  } else if (belowCount > aboveCount) {
    interpretation += `الشركة تحتاج لتحسين ${belowCount} نسبة مالية مقارنة بمعايير الصناعة. `;
  } else {
    interpretation += 'الشركة في مستوى متوسط مقارنة بمعايير الصناعة. ';
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
 * توليد التوصيات لمقارنة الشركات المماثلة
 */
function generatePeerComparisonRecommendations(peerComparison: any): string[] {
  const recommendations: string[] = [];

  Object.entries(peerComparison).forEach(([key, comparison]: [string, any]) => {
    if (comparison.comparison === 'below') {
      switch (key) {
        case 'currentRatioComparison':
          recommendations.push('تحسين النسبة الحالية من خلال تحسين إدارة الأصول المتداولة');
          break;
        case 'quickRatioComparison':
          recommendations.push('تحسين نسبة السيولة السريعة من خلال تحسين إدارة المخزون');
          break;
        case 'debtToEquityComparison':
          recommendations.push('تحسين نسبة الدين إلى حقوق الملكية من خلال تقليل الديون');
          break;
        case 'returnOnAssetsComparison':
          recommendations.push('تحسين العائد على الأصول من خلال تحسين كفاءة الأصول');
          break;
        case 'returnOnEquityComparison':
          recommendations.push('تحسين العائد على حقوق الملكية من خلال تحسين الربحية');
          break;
        case 'grossProfitMarginComparison':
          recommendations.push('تحسين هامش الربح الإجمالي من خلال تحسين التكاليف');
          break;
        case 'operatingProfitMarginComparison':
          recommendations.push('تحسين هامش الربح التشغيلي من خلال تحسين الكفاءة التشغيلية');
          break;
        case 'netProfitMarginComparison':
          recommendations.push('تحسين هامش صافي الربح من خلال تحسين الإدارة');
          break;
      }
    }
  });

  return recommendations;
}

/**
 * توليد التوصيات لمقارنة معايير الصناعة
 */
function generateIndustryComparisonRecommendations(industryComparison: any): string[] {
  const recommendations: string[] = [];

  Object.entries(industryComparison).forEach(([key, comparison]: [string, any]) => {
    if (comparison.comparison === 'below') {
      switch (key) {
        case 'currentRatioComparison':
          recommendations.push('تحسين النسبة الحالية لتصل إلى مستوى الصناعة');
          break;
        case 'quickRatioComparison':
          recommendations.push('تحسين نسبة السيولة السريعة لتصل إلى مستوى الصناعة');
          break;
        case 'debtToEquityComparison':
          recommendations.push('تحسين نسبة الدين إلى حقوق الملكية لتصل إلى مستوى الصناعة');
          break;
        case 'returnOnAssetsComparison':
          recommendations.push('تحسين العائد على الأصول لتصل إلى مستوى الصناعة');
          break;
        case 'returnOnEquityComparison':
          recommendations.push('تحسين العائد على حقوق الملكية لتصل إلى مستوى الصناعة');
          break;
        case 'grossProfitMarginComparison':
          recommendations.push('تحسين هامش الربح الإجمالي لتصل إلى مستوى الصناعة');
          break;
        case 'operatingProfitMarginComparison':
          recommendations.push('تحسين هامش الربح التشغيلي لتصل إلى مستوى الصناعة');
          break;
        case 'netProfitMarginComparison':
          recommendations.push('تحسين هامش صافي الربح لتصل إلى مستوى الصناعة');
          break;
      }
    }
  });

  return recommendations;
}

// باقي الدوال المساعدة...

/**
 * تحديد المخاطر لمقارنة الشركات المماثلة
 */
function identifyPeerComparisonRisks(peerComparison: any): string[] {
  const risks: string[] = [];

  Object.entries(peerComparison).forEach(([key, comparison]: [string, any]) => {
    if (comparison.comparison === 'below') {
      switch (key) {
        case 'currentRatioComparison':
          risks.push('النسبة الحالية أقل من الشركات المماثلة مما قد يؤثر على السيولة');
          break;
        case 'quickRatioComparison':
          risks.push('نسبة السيولة السريعة أقل من الشركات المماثلة مما قد يؤثر على السيولة');
          break;
        case 'debtToEquityComparison':
          risks.push('نسبة الدين إلى حقوق الملكية أعلى من الشركات المماثلة مما قد يؤثر على الاستقرار المالي');
          break;
        case 'returnOnAssetsComparison':
          risks.push('العائد على الأصول أقل من الشركات المماثلة مما قد يؤثر على الكفاءة');
          break;
        case 'returnOnEquityComparison':
          risks.push('العائد على حقوق الملكية أقل من الشركات المماثلة مما قد يؤثر على الربحية');
          break;
        case 'grossProfitMarginComparison':
          risks.push('هامش الربح الإجمالي أقل من الشركات المماثلة مما قد يؤثر على الربحية');
          break;
        case 'operatingProfitMarginComparison':
          risks.push('هامش الربح التشغيلي أقل من الشركات المماثلة مما قد يؤثر على الكفاءة التشغيلية');
          break;
        case 'netProfitMarginComparison':
          risks.push('هامش صافي الربح أقل من الشركات المماثلة مما قد يؤثر على الربحية');
          break;
      }
    }
  });

  return risks;
}

/**
 * تحديد المخاطر لمقارنة معايير الصناعة
 */
function identifyIndustryComparisonRisks(industryComparison: any): string[] {
  const risks: string[] = [];

  Object.entries(industryComparison).forEach(([key, comparison]: [string, any]) => {
    if (comparison.comparison === 'below') {
      switch (key) {
        case 'currentRatioComparison':
          risks.push('النسبة الحالية أقل من معايير الصناعة مما قد يؤثر على السيولة');
          break;
        case 'quickRatioComparison':
          risks.push('نسبة السيولة السريعة أقل من معايير الصناعة مما قد يؤثر على السيولة');
          break;
        case 'debtToEquityComparison':
          risks.push('نسبة الدين إلى حقوق الملكية أعلى من معايير الصناعة مما قد يؤثر على الاستقرار المالي');
          break;
        case 'returnOnAssetsComparison':
          risks.push('العائد على الأصول أقل من معايير الصناعة مما قد يؤثر على الكفاءة');
          break;
        case 'returnOnEquityComparison':
          risks.push('العائد على حقوق الملكية أقل من معايير الصناعة مما قد يؤثر على الربحية');
          break;
        case 'grossProfitMarginComparison':
          risks.push('هامش الربح الإجمالي أقل من معايير الصناعة مما قد يؤثر على الربحية');
          break;
        case 'operatingProfitMarginComparison':
          risks.push('هامش الربح التشغيلي أقل من معايير الصناعة مما قد يؤثر على الكفاءة التشغيلية');
          break;
        case 'netProfitMarginComparison':
          risks.push('هامش صافي الربح أقل من معايير الصناعة مما قد يؤثر على الربحية');
          break;
      }
    }
  });

  return risks;
}

// باقي الدوال المساعدة...

/**
 * توليد التوقعات لمقارنة الشركات المماثلة
 */
function generatePeerComparisonPredictions(peerComparison: any): string[] {
  const predictions: string[] = [];

  Object.entries(peerComparison).forEach(([key, comparison]: [string, any]) => {
    if (comparison.comparison === 'above') {
      predictions.push(`من المتوقع أن تستمر الشركة في التفوق على الشركات المماثلة في ${key.replace('Comparison', '')}`);
    } else if (comparison.comparison === 'below') {
      predictions.push(`من المتوقع أن تتحسن الشركة في ${key.replace('Comparison', '')} لتصل إلى مستوى الشركات المماثلة`);
    }
  });

  return predictions;
}

/**
 * توليد التوقعات لمقارنة معايير الصناعة
 */
function generateIndustryComparisonPredictions(industryComparison: any): string[] {
  const predictions: string[] = [];

  Object.entries(industryComparison).forEach(([key, comparison]: [string, any]) => {
    if (comparison.comparison === 'above') {
      predictions.push(`من المتوقع أن تستمر الشركة في التفوق على معايير الصناعة في ${key.replace('Comparison', '')}`);
    } else if (comparison.comparison === 'below') {
      predictions.push(`من المتوقع أن تتحسن الشركة في ${key.replace('Comparison', '')} لتصل إلى مستوى معايير الصناعة`);
    }
  });

  return predictions;
}

// باقي الدوال المساعدة...

/**
 * تحليل SWOT لمقارنة الشركات المماثلة
 */
function performPeerComparisonSWOT(peerComparison: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  Object.entries(peerComparison).forEach(([key, comparison]: [string, any]) => {
    if (comparison.comparison === 'above') {
      swot.strengths.push(`تفوق في ${key.replace('Comparison', '')} مقارنة بالشركات المماثلة`);
    } else if (comparison.comparison === 'below') {
      swot.weaknesses.push(`ضعف في ${key.replace('Comparison', '')} مقارنة بالشركات المماثلة`);
    }
  });

  swot.opportunities.push('تحسين الأداء المالي مقارنة بالشركات المماثلة');
  swot.opportunities.push('زيادة الحصة السوقية');
  swot.opportunities.push('تحسين الكفاءة التشغيلية');

  swot.threats.push('منافسة شديدة من الشركات المماثلة');
  swot.threats.push('تغيرات في معايير الصناعة');
  swot.threats.push('تغيرات في الظروف الاقتصادية');

  return swot;
}

/**
 * تحليل SWOT لمقارنة معايير الصناعة
 */
function performIndustryComparisonSWOT(industryComparison: any): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };

  Object.entries(industryComparison).forEach(([key, comparison]: [string, any]) => {
    if (comparison.comparison === 'above') {
      swot.strengths.push(`تفوق في ${key.replace('Comparison', '')} مقارنة بمعايير الصناعة`);
    } else if (comparison.comparison === 'below') {
      swot.weaknesses.push(`ضعف في ${key.replace('Comparison', '')} مقارنة بمعايير الصناعة`);
    }
  });

  swot.opportunities.push('تحسين الأداء المالي مقارنة بمعايير الصناعة');
  swot.opportunities.push('زيادة الحصة السوقية');
  swot.opportunities.push('تحسين الكفاءة التشغيلية');

  swot.threats.push('تغيرات في معايير الصناعة');
  swot.threats.push('تغيرات في الظروف الاقتصادية');
  swot.threats.push('منافسة شديدة في الصناعة');

  return swot;
}

// باقي الدوال المساعدة...

/**
 * تحليل المقارنة مع المنافسين
 */
async function analyzeCompetitorComparison(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل المقارنة مع المنافسين
  return createErrorResult('تحليل المقارنة مع المنافسين', 'تحت التنفيذ');
}

/**
 * تحليل المقارنة مع الشركات الرائدة
 */
async function analyzeLeaderComparison(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل المقارنة مع الشركات الرائدة
  return createErrorResult('تحليل المقارنة مع الشركات الرائدة', 'تحت التنفيذ');
}

/**
 * تحليل المقارنة مع الشركات الناشئة
 */
async function analyzeStartupComparison(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل المقارنة مع الشركات الناشئة
  return createErrorResult('تحليل المقارنة مع الشركات الناشئة', 'تحت التنفيذ');
}

/**
 * تحليل المقارنة مع الشركات المتوسطة
 */
async function analyzeMidSizeComparison(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل المقارنة مع الشركات المتوسطة
  return createErrorResult('تحليل المقارنة مع الشركات المتوسطة', 'تحت التنفيذ');
}

/**
 * تحليل المقارنة مع الشركات الكبيرة
 */
async function analyzeLargeCompanyComparison(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل المقارنة مع الشركات الكبيرة
  return createErrorResult('تحليل المقارنة مع الشركات الكبيرة', 'تحت التنفيذ');
}

/**
 * تحليل المقارنة مع الشركات الصغيرة
 */
async function analyzeSmallCompanyComparison(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل المقارنة مع الشركات الصغيرة
  return createErrorResult('تحليل المقارنة مع الشركات الصغيرة', 'تحت التنفيذ');
}

/**
 * تحليل المقارنة مع الشركات المحلية
 */
async function analyzeLocalCompanyComparison(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل المقارنة مع الشركات المحلية
  return createErrorResult('تحليل المقارنة مع الشركات المحلية', 'تحت التنفيذ');
}

/**
 * تحليل المقارنة مع الشركات الدولية
 */
async function analyzeInternationalCompanyComparison(
  statements: FinancialStatement[], 
  companyData?: Company, 
  marketData?: any, 
  benchmarkData?: any
): Promise<AnalysisResult> {
  // تنفيذ تحليل المقارنة مع الشركات الدولية
  return createErrorResult('تحليل المقارنة مع الشركات الدولية', 'تحت التنفيذ');
}
