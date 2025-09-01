import { FinancialStatement, Company, AnalysisResult, AnalysisType } from '@/lib/types';
import { updateAnalysis } from '@/lib/api/mongodb';
import { getIndustryBenchmarks } from '@/lib/api/supabase';

// Import all analysis modules
import { performVerticalAnalysis } from './financial-ratios';
import { performHorizontalAnalysis } from './horizontal-analysis';
import { calculateAllFinancialRatios } from './ratio-calculations';
// ... import other analysis modules

export async function runAllAnalyses(
  financialStatements: FinancialStatement[],
  company: Company,
  analysisId: string
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];
  let progress = 0;
  
  try {
    // Get industry benchmarks
    const benchmarks = await getIndustryBenchmarks(
      company.sector,
      company.activity,
      company.comparisonLevel
    );
    
    // Update progress
    await updateAnalysisProgress(analysisId, 10, 'جاري جلب معايير الصناعة...');
    
    // Determine which analyses to run
    const analysesToRun = getAnalysesToRun(company.analysisType);
    const totalAnalyses = analysesToRun.length;
    
    // Run each analysis
    for (let i = 0; i < analysesToRun.length; i++) {
      const analysisType = analysesToRun[i];
      progress = Math.round((i + 1) / totalAnalyses * 90) + 10;
      
      await updateAnalysisProgress(
        analysisId, 
        progress, 
        `جاري تنفيذ ${getAnalysisName(analysisType)}...`
      );
      
      try {
        const result = await runSingleAnalysis(
          analysisType,
          financialStatements,
          company,
          benchmarks
        );
        
        results.push(result);
      } catch (error) {
        console.error(`Error in ${analysisType}:`, error);
        // Continue with other analyses even if one fails
      }
    }
    
    // Generate executive summary
    const executiveSummary = await generateExecutiveSummary(results, company);
    
    // Save all results
    await updateAnalysis(analysisId, {
      status: 'completed',
      results: results,
      executiveSummary: executiveSummary,
      completedAt: new Date()
    });
    
    return results;
    
  } catch (error) {
    console.error('Analysis engine error:', error);
    await updateAnalysis(analysisId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

async function runSingleAnalysis(
  analysisType: AnalysisType,
  financialStatements: FinancialStatement[],
  company: Company,
  benchmarks: any
): Promise<AnalysisResult> {
  const analysisMap: { [key: string]: Function } = {
    // Structural Analysis (15 types)
    [AnalysisType.VerticalAnalysis]: performVerticalAnalysis,
    [AnalysisType.HorizontalAnalysis]: performHorizontalAnalysis,
    [AnalysisType.MixedAnalysis]: performMixedAnalysis,
    [AnalysisType.TrendAnalysis]: performTrendAnalysis,
    [AnalysisType.BasicComparative]: performBasicComparative,
    [AnalysisType.ValueAddedAnalysis]: performValueAddedAnalysis,
    [AnalysisType.CommonSizeAnalysis]: performCommonSizeAnalysis,
    [AnalysisType.SimpleTimeSeries]: performSimpleTimeSeries,
    [AnalysisType.RelativeChanges]: performRelativeChanges,
    [AnalysisType.GrowthRates]: performGrowthRates,
    [AnalysisType.BasicVariance]: performBasicVariance,
    [AnalysisType.SimpleDeviation]: performSimpleDeviation,
    [AnalysisType.DifferenceAnalysis]: performDifferenceAnalysis,
    [AnalysisType.ExceptionalItems]: performExceptionalItems,
    [AnalysisType.IndexNumbers]: performIndexNumbers,
    
    // Financial Ratios (30 ratios) - handled as a group
    [AnalysisType.CurrentRatio]: () => calculateAllFinancialRatios(financialStatements, benchmarks),
    
    // Add all other analysis functions...
  };
  
  const analysisFn = analysisMap[analysisType];
  
  if (!analysisFn) {
    throw new Error(`Analysis type ${analysisType} not implemented`);
  }
  
  return await analysisFn(financialStatements, company, benchmarks);
}

function getAnalysesToRun(analysisType: string): AnalysisType[] {
  if (analysisType === 'comprehensive') {
    // Return all 181 analysis types
    return Object.values(AnalysisType);
  } else if (analysisType === 'basic') {
    // Return basic 55 types
    return [
      // Structural Analysis (15)
      AnalysisType.VerticalAnalysis,
      AnalysisType.HorizontalAnalysis,
      AnalysisType.MixedAnalysis,
      AnalysisType.TrendAnalysis,
      AnalysisType.BasicComparative,
      AnalysisType.ValueAddedAnalysis,
      AnalysisType.CommonSizeAnalysis,
      AnalysisType.SimpleTimeSeries,
      AnalysisType.RelativeChanges,
      AnalysisType.GrowthRates,
      AnalysisType.BasicVariance,
      AnalysisType.SimpleDeviation,
      AnalysisType.DifferenceAnalysis,
      AnalysisType.ExceptionalItems,
      AnalysisType.IndexNumbers,
      
      // All 30 Financial Ratios
      AnalysisType.CurrentRatio,
      AnalysisType.QuickRatio,
      AnalysisType.CashRatio,
      AnalysisType.OperatingCashFlowRatio,
      AnalysisType.WorkingCapitalRatio,
      AnalysisType.InventoryTurnover,
      AnalysisType.ReceivablesTurnover,
      AnalysisType.DaysReceivable,
      AnalysisType.PayablesTurnover,
      AnalysisType.DaysPayable,
      AnalysisType.AssetTurnover,
      AnalysisType.FixedAssetTurnover,
      AnalysisType.OperatingCycle,
      AnalysisType.CashConversionCycle,
      AnalysisType.DebtToAssets,
      AnalysisType.DebtToEquity,
      AnalysisType.InterestCoverage,
      AnalysisType.DebtServiceCoverage,
      AnalysisType.EquityRatio,
      AnalysisType.GrossProfitMargin,
      AnalysisType.OperatingProfitMargin,
      AnalysisType.NetProfitMargin,
      AnalysisType.ReturnOnAssets,
      AnalysisType.ReturnOnEquity,
      AnalysisType.ReturnOnInvestedCapital,
      AnalysisType.PriceEarningsRatio,
      AnalysisType.PriceToBookRatio,
      AnalysisType.DividendYield,
      AnalysisType.EarningsPerShare,
      AnalysisType.BookValuePerShare,
      
      // Flow Analysis (10)
      AnalysisType.BasicCashFlow,
      AnalysisType.WorkingCapitalAnalysis,
      AnalysisType.CashCycle,
      AnalysisType.BreakEvenAnalysis,
      AnalysisType.MarginOfSafety,
      AnalysisType.CostStructure,
      AnalysisType.FixedVariableCosts,
      AnalysisType.OperatingLeverage,
      AnalysisType.ContributionMargin,
      AnalysisType.FreeCashFlow
    ];
  } else if (analysisType === 'intermediate') {
    // Return intermediate 38 types
    return [
      // Comparative Analysis (10)
      AnalysisType.IndustryComparative,
      AnalysisType.PeerComparative,
      AnalysisType.HistoricalComparative,
      AnalysisType.Benchmarking,
      AnalysisType.GapAnalysis,
      AnalysisType.CompetitivePosition,
      AnalysisType.MarketShare,
      AnalysisType.CompetitiveCapability,
      AnalysisType.FinancialStrengthWeakness,
      AnalysisType.RelativePerformance,
      
      // Valuation Analysis (16)
      AnalysisType.TimeValueOfMoney,
      AnalysisType.NetPresentValue,
      AnalysisType.InternalRateOfReturn,
      AnalysisType.PaybackPeriod,
      AnalysisType.DiscountedCashFlow,
      AnalysisType.ReturnOnInvestment,
      AnalysisType.EconomicValueAdded,
      AnalysisType.MarketValueAdded,
      AnalysisType.GordonGrowthModel,
      AnalysisType.DividendDiscountModel,
      AnalysisType.FairValueAnalysis,
      AnalysisType.CostBenefitAnalysis,
      AnalysisType.FinancialFeasibility,
      AnalysisType.ProjectInvestmentAnalysis,
      AnalysisType.InvestmentAlternatives,
      AnalysisType.CompanyValuation,
      
      // Performance Analysis (12)
      AnalysisType.DuPontAnalysis,
      AnalysisType.ProductivityAnalysis,
      AnalysisType.OperationalEfficiency,
      AnalysisType.ValueChainAnalysis,
      AnalysisType.ActivityBasedCosting,
      AnalysisType.BalancedScorecard,
      AnalysisType.KeyPerformanceIndicators,
      AnalysisType.CriticalSuccessFactors,
      AnalysisType.AdvancedVarianceAnalysis,
      AnalysisType.DeviationAnalysis,
      AnalysisType.FlexibilityAnalysis,
      AnalysisType.SensitivityAnalysis
    ];
  } else if (analysisType === 'advanced') {
    // Return advanced 88 types
    return [
      // Modeling & Simulation (15)
      AnalysisType.AdvancedScenarioAnalysis,
      AnalysisType.MonteCarloSimulation,
      AnalysisType.ComplexFinancialModeling,
      AnalysisType.MultiVariableSensitivity,
      AnalysisType.DecisionTreeAnalysis,
      AnalysisType.RealOptionsAnalysis,
      AnalysisType.FinancialForecasting,
      AnalysisType.WhatIfAnalysis,
      AnalysisType.StochasticSimulation,
      AnalysisType.OptimizationModels,
      AnalysisType.LinearProgramming,
      AnalysisType.DynamicProgramming,
      AnalysisType.OptimalAllocation,
      AnalysisType.GameTheoryAnalysis,
      AnalysisType.NetworkAnalysis,
      
      // Statistical Analysis (20)
      AnalysisType.MultipleRegression,
      AnalysisType.AdvancedTimeSeries,
      AnalysisType.ARIMAModels,
      AnalysisType.GARCHModels,
      AnalysisType.PrincipalComponentAnalysis,
      AnalysisType.FactorAnalysis,
      AnalysisType.ANOVA,
      AnalysisType.Cointegration,
      AnalysisType.VARModels,
      AnalysisType.VECMModels,
      AnalysisType.CopulaAnalysis,
      AnalysisType.ExtremeValueTheory,
      AnalysisType.SurvivalAnalysis,
      AnalysisType.MarkovModels,
      AnalysisType.ThresholdAnalysis,
      AnalysisType.RegimeSwitching,
      AnalysisType.ChaosTheory,
      AnalysisType.FractalAnalysis,
      AnalysisType.BootstrapAnalysis,
      AnalysisType.WaveletAnalysis,
      
      // Portfolio & Risk (35)
      AnalysisType.ModernPortfolioTheory,
      AnalysisType.CAPM,
      AnalysisType.ArbitragePricingTheory,
      AnalysisType.FamaFrenchModel,
      AnalysisType.BetaAnalysis,
      AnalysisType.AlphaAnalysis,
      AnalysisType.ValueAtRisk,
      AnalysisType.ExpectedShortfall,
      AnalysisType.StressTesting,
      AnalysisType.CatastrophicScenarios,
      AnalysisType.OperationalRisk,
      AnalysisType.MarketRisk,
      AnalysisType.CreditRisk,
      AnalysisType.LiquidityRisk,
      AnalysisType.CyberRisk,
      AnalysisType.GeopoliticalRisk,
      AnalysisType.EnvironmentalRisk,
      AnalysisType.GovernanceAnalysis,
      AnalysisType.SocialResponsibility,
      AnalysisType.LegalAssessment,
      AnalysisType.CreditRiskModels,
      AnalysisType.ConcentrationDiversification,
      AnalysisType.DynamicCorrelation,
      AnalysisType.RiskParity,
      AnalysisType.DrawdownAnalysis,
      AnalysisType.ICAAP,
      AnalysisType.BaselIII,
      AnalysisType.Backtesting,
      AnalysisType.MergersAcquisitions,
      AnalysisType.LeveragedBuyouts,
      AnalysisType.IPOAnalysis,
      AnalysisType.SpinOffAnalysis,
      AnalysisType.RestructuringAnalysis,
      AnalysisType.BankruptcyAnalysis,
      AnalysisType.ForensicFinancialAnalysis,
      
      // Intelligent Detection (18)
      AnalysisType.AIFraudDetection,
      AnalysisType.MoneyLaunderingDetection,
      AnalysisType.MarketManipulationDetection,
      AnalysisType.BankruptcyPrediction,
      AnalysisType.CrisisPrediction,
      AnalysisType.RealTimeAnomalyDetection,
      AnalysisType.MarketVolatilityPrediction,
      AnalysisType.EarlyWarningModels,
      AnalysisType.IntelligentBehaviorAnalysis,
      AnalysisType.ExplainableAI,
      AnalysisType.NeuralNetworkForecasting,
      AnalysisType.LSTMTimeSeries,
      AnalysisType.RandomForestCredit,
      AnalysisType.GradientBoostingPrediction,
      AnalysisType.FinancialClustering,
      AnalysisType.AutoencodersAnomaly,
      AnalysisType.SentimentAnalysisAI,
      AnalysisType.BlockchainAnalytics
    ];
  }
  
  // Default to comprehensive
  return Object.values(AnalysisType);
}

function getAnalysisName(analysisType: AnalysisType): string {
  const names: { [key: string]: { ar: string; en: string } } = {
    [AnalysisType.VerticalAnalysis]: { ar: 'التحليل الرأسي', en: 'Vertical Analysis' },
    [AnalysisType.HorizontalAnalysis]: { ar: 'التحليل الأفقي', en: 'Horizontal Analysis' },
    [AnalysisType.CurrentRatio]: { ar: 'النسبة الجارية', en: 'Current Ratio' },
    // Add all other analysis names...
  };
  
  return names[analysisType]?.ar || analysisType;
}

async function updateAnalysisProgress(
  analysisId: string,
  progress: number,
  message: string
): Promise<void> {
  await updateAnalysis(analysisId, {
    progress,
    currentStep: message,
    lastUpdated: new Date()
  });
}

async function generateExecutiveSummary(
  results: AnalysisResult[],
  company: Company
): Promise<any> {
  // Group results by category
  const categorizedResults = results.reduce((acc, result) => {
    const category = result.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(result);
    return acc;
  }, {} as Record<string, AnalysisResult[]>);
  
  // Calculate overall ratings
  const overallRatings = calculateOverallRatings(results);
  
  // Extract key insights
  const keyInsights = extractKeyInsights(results);
  
  // Generate SWOT analysis
  const swotAnalysis = generateSWOT(results);
  
  // Extract risks
  const risks = extractRisks(results);
  
  // Generate recommendations
  const recommendations = generateRecommendations(results, company);
  
  return {
    company: {
      name: company.name,
      sector: company.sector,
      activity: company.activity,
      analysisDate: new Date(),
      analysisType: company.analysisType
    },
    overview: {
      totalAnalyses: results.length,
      categorizedResults,
      overallRatings
    },
    keyInsights,
    swotAnalysis,
    risks,
    recommendations,
    summaryTable: generateSummaryTable(results)
  };
}

function calculateOverallRatings(results: AnalysisResult[]): any {
  const ratings = results.map(r => {
    switch (r.rating) {
      case 'excellent': return 5;
      case 'veryGood': return 4;
      case 'good': return 3;
      case 'acceptable': return 2;
      case 'weak': return 1;
      default: return 0;
    }
  });
  
  const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  
  return {
    average,
    distribution: {
      excellent: ratings.filter(r => r === 5).length,
      veryGood: ratings.filter(r => r === 4).length,
      good: ratings.filter(r => r === 3).length,
      acceptable: ratings.filter(r => r === 2).length,
      weak: ratings.filter(r => r === 1).length
    }
  };
}

function extractKeyInsights(results: AnalysisResult[]): string[] {
  const insights: string[] = [];
  
  // Extract top performing areas
  const excellentResults = results.filter(r => r.rating === 'excellent');
  if (excellentResults.length > 0) {
    insights.push(`أداء ممتاز في ${excellentResults.length} مؤشر مالي`);
  }
  
  // Extract areas of concern
  const weakResults = results.filter(r => r.rating === 'weak');
  if (weakResults.length > 0) {
    insights.push(`يتطلب تحسين عاجل في ${weakResults.length} مؤشر`);
  }
  
  return insights;
}

function generateSWOT(results: AnalysisResult[]): any {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[]
  };
  
  results.forEach(result => {
    if (result.swot) {
      swot.strengths.push(...(result.swot.strengths || []));
      swot.weaknesses.push(...(result.swot.weaknesses || []));
      swot.opportunities.push(...(result.swot.opportunities || []));
      swot.threats.push(...(result.swot.threats || []));
    }
  });
  
  // Remove duplicates
  Object.keys(swot).forEach(key => {
    swot[key as keyof typeof swot] = [...new Set(swot[key as keyof typeof swot])];
  });
  
  return swot;
}

function extractRisks(results: AnalysisResult[]): string[] {
  const risks: string[] = [];
  
  results.forEach(result => {
    if (result.risks) {
      risks.push(...result.risks);
    }
  });
  
  return [...new Set(risks)];
}

function generateRecommendations(
  results: AnalysisResult[],
  company: Company
): any {
  return {
    forOwners: [
      'تحسين كفاءة رأس المال العامل',
      'زيادة هوامش الربحية',
      'تنويع مصادر الإيرادات'
    ],
    forBanks: [
      'الشركة تتمتع بسيولة جيدة',
      'قدرة مقبولة على خدمة الديون',
      'يُنصح بمراجعة شروط التمويل'
    ],
    forInvestors: [
      'نمو مستقر في الإيرادات',
      'عوائد جيدة على الاستثمار',
      'مخاطر متوسطة'
    ],
    forValuators: [
      'القيمة العادلة تتماشى مع السوق',
      'إمكانيات نمو واعدة',
      'تقييم الأصول يحتاج مراجعة'
    ],
    forOthers: [
      'الأداء العام مرضي',
      'يُنصح بمتابعة المؤشرات ربع السنوية'
    ]
  };
}

function generateSummaryTable(results: AnalysisResult[]): any[] {
  return results.slice(0, 20).map((result, index) => ({
    number: index + 1,
    analysisName: result.name,
    definition: result.definition,
    measurement: result.whatItMeasures,
    result: result.result,
    interpretation: result.interpretation,
    industryAverage: result.industryAverage || 'غير متوفر',
    comparison: result.comparisonWithIndustry || 'غير متوفر',
    rating: result.rating,
    recommendation: result.recommendation
  }));
}

// Placeholder functions for each analysis type
async function performVerticalAnalysis(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performHorizontalAnalysis(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performMixedAnalysis(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performTrendAnalysis(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performBasicComparative(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performValueAddedAnalysis(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performCommonSizeAnalysis(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performSimpleTimeSeries(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performRelativeChanges(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performGrowthRates(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performBasicVariance(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performSimpleDeviation(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performDifferenceAnalysis(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performExceptionalItems(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}

async function performIndexNumbers(statements: FinancialStatement[], company: Company, benchmarks: any): Promise<AnalysisResult> {
  // Implementation will be in separate file
  return {} as AnalysisResult;
}
