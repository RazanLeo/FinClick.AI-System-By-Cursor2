// Core Types for FinClick.AI

export interface User {
  id: string;
  email: string;
  name?: string;
  company?: string;
  role: 'user' | 'admin';
  subscription: 'free' | 'pro' | 'enterprise';
}

export interface Company {
  id?: string;
  name: string;
  nameEn?: string;
  sector: string;
  activity: string;
  legalEntity: string;
  country: string;
  yearsToAnalyze: number;
  comparisonLevel: ComparisonLevel;
}

export type ComparisonLevel = 
  | 'local'      // Saudi Arabia
  | 'gcc'        // Gulf Countries
  | 'arab'       // Arab Countries
  | 'asia'       // Asian Countries
  | 'africa'     // African Countries
  | 'europe'     // European Countries
  | 'northAmerica' // North American Countries
  | 'southAmerica' // South American Countries
  | 'australia'   // Australian Countries
  | 'global';     // Global

export interface FinancialStatement {
  year: number;
  balanceSheet: BalanceSheet;
  incomeStatement: IncomeStatement;
  cashFlowStatement: CashFlowStatement;
  notes?: any;
}

export interface BalanceSheet {
  // Assets
  currentAssets: {
    cash: number;
    marketableSecurities?: number;
    accountsReceivable: number;
    inventory: number;
    prepaidExpenses?: number;
    otherCurrentAssets?: number;
    totalCurrentAssets: number;
  };
  nonCurrentAssets: {
    propertyPlantEquipment: number;
    accumulatedDepreciation?: number;
    netPPE: number;
    intangibleAssets?: number;
    goodwill?: number;
    longTermInvestments?: number;
    otherNonCurrentAssets?: number;
    totalNonCurrentAssets: number;
  };
  totalAssets: number;
  
  // Liabilities
  currentLiabilities: {
    accountsPayable: number;
    shortTermDebt?: number;
    currentPortionLongTermDebt?: number;
    accruedExpenses?: number;
    deferredRevenue?: number;
    otherCurrentLiabilities?: number;
    totalCurrentLiabilities: number;
  };
  nonCurrentLiabilities: {
    longTermDebt: number;
    deferredTaxLiabilities?: number;
    otherNonCurrentLiabilities?: number;
    totalNonCurrentLiabilities: number;
  };
  totalLiabilities: number;
  
  // Equity
  shareholdersEquity: {
    commonStock: number;
    preferredStock?: number;
    additionalPaidInCapital?: number;
    retainedEarnings: number;
    treasuryStock?: number;
    accumulatedOtherComprehensiveIncome?: number;
    totalShareholdersEquity: number;
  };
  totalLiabilitiesAndEquity: number;
}

export interface IncomeStatement {
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  operatingExpenses: {
    sellingGeneralAdmin: number;
    researchDevelopment?: number;
    depreciation?: number;
    amortization?: number;
    otherOperating?: number;
    totalOperatingExpenses: number;
  };
  operatingIncome: number;
  otherIncomeExpense?: {
    interestIncome?: number;
    interestExpense?: number;
    otherIncome?: number;
    otherExpense?: number;
    totalOtherIncomeExpense: number;
  };
  incomeBeforeTax: number;
  incomeTaxExpense: number;
  netIncome: number;
  earningsPerShare?: number;
  dilutedEarningsPerShare?: number;
  shares?: number;
}

export interface CashFlowStatement {
  operatingActivities: {
    netIncome: number;
    depreciation: number;
    amortization?: number;
    stockBasedCompensation?: number;
    deferredIncomeTax?: number;
    changeInWorkingCapital: {
      accountsReceivable: number;
      inventory: number;
      accountsPayable: number;
      otherWorkingCapital?: number;
    };
    otherOperating?: number;
    netCashFromOperating: number;
  };
  investingActivities: {
    capitalExpenditures: number;
    acquisitions?: number;
    purchaseOfInvestments?: number;
    saleOfInvestments?: number;
    otherInvesting?: number;
    netCashFromInvesting: number;
  };
  financingActivities: {
    debtIssued?: number;
    debtRepayment?: number;
    commonStockIssued?: number;
    commonStockRepurchased?: number;
    dividendsPaid?: number;
    otherFinancing?: number;
    netCashFromFinancing: number;
  };
  netChangeInCash: number;
  cashBeginningPeriod: number;
  cashEndPeriod: number;
}

export interface AnalysisResult {
  id: string;
  type: AnalysisType;
  name: string;
  nameEn: string;
  category: AnalysisCategory;
  definition: string;
  whatItMeasures: string;
  importance: string;
  calculation: string;
  result: number | string | any;
  interpretation: string;
  industryAverage?: number;
  comparisonWithIndustry?: string;
  benchmarkComparison?: any;
  rating: 'excellent' | 'veryGood' | 'good' | 'acceptable' | 'weak';
  recommendation: string;
  charts?: ChartData[];
  detailedAnalysis?: string;
  risks?: string[];
  opportunities?: string[];
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'radar' | 'scatter' | 'area';
  data: any;
  options?: any;
}

export enum AnalysisCategory {
  // Level 1: Basic Classical Analysis
  StructuralAnalysis = 'structural',
  FinancialRatios = 'ratios',
  FlowAnalysis = 'flow',
  
  // Level 2: Applied Intermediate Analysis
  ComparativeAnalysis = 'comparative',
  ValuationAnalysis = 'valuation',
  PerformanceAnalysis = 'performance',
  
  // Level 3: Advanced Analysis
  ModelingSimulation = 'modeling',
  StatisticalAnalysis = 'statistical',
  PortfolioRisk = 'portfolio',
  IntelligentDetection = 'detection'
}

export enum AnalysisType {
  // Structural Analysis (15 types)
  VerticalAnalysis = 'vertical',
  HorizontalAnalysis = 'horizontal',
  MixedAnalysis = 'mixed',
  TrendAnalysis = 'trend',
  BasicComparative = 'basicComparative',
  ValueAddedAnalysis = 'valueAdded',
  CommonSizeAnalysis = 'commonSize',
  SimpleTimeSeries = 'simpleTimeSeries',
  RelativeChanges = 'relativeChanges',
  GrowthRates = 'growthRates',
  BasicVariance = 'basicVariance',
  SimpleDeviation = 'simpleDeviation',
  DifferenceAnalysis = 'difference',
  ExceptionalItems = 'exceptionalItems',
  IndexNumbers = 'indexNumbers',
  
  // Financial Ratios (30 ratios)
  CurrentRatio = 'currentRatio',
  QuickRatio = 'quickRatio',
  CashRatio = 'cashRatio',
  OperatingCashFlowRatio = 'operatingCashFlowRatio',
  WorkingCapitalRatio = 'workingCapitalRatio',
  InventoryTurnover = 'inventoryTurnover',
  ReceivablesTurnover = 'receivablesTurnover',
  DaysReceivable = 'daysReceivable',
  PayablesTurnover = 'payablesTurnover',
  DaysPayable = 'daysPayable',
  AssetTurnover = 'assetTurnover',
  FixedAssetTurnover = 'fixedAssetTurnover',
  OperatingCycle = 'operatingCycle',
  CashConversionCycle = 'cashConversionCycle',
  DebtToAssets = 'debtToAssets',
  DebtToEquity = 'debtToEquity',
  InterestCoverage = 'interestCoverage',
  DebtServiceCoverage = 'debtServiceCoverage',
  EquityRatio = 'equityRatio',
  GrossProfitMargin = 'grossProfitMargin',
  OperatingProfitMargin = 'operatingProfitMargin',
  NetProfitMargin = 'netProfitMargin',
  ReturnOnAssets = 'returnOnAssets',
  ReturnOnEquity = 'returnOnEquity',
  ReturnOnInvestedCapital = 'returnOnInvestedCapital',
  PriceEarningsRatio = 'priceEarningsRatio',
  PriceToBookRatio = 'priceToBookRatio',
  DividendYield = 'dividendYield',
  EarningsPerShare = 'earningsPerShare',
  BookValuePerShare = 'bookValuePerShare',
  
  // Flow and Movement Analysis (10 types)
  BasicCashFlow = 'basicCashFlow',
  WorkingCapitalAnalysis = 'workingCapitalAnalysis',
  CashCycle = 'cashCycle',
  BreakEvenAnalysis = 'breakEven',
  MarginOfSafety = 'marginOfSafety',
  CostStructure = 'costStructure',
  FixedVariableCosts = 'fixedVariableCosts',
  OperatingLeverage = 'operatingLeverage',
  ContributionMargin = 'contributionMargin',
  FreeCashFlow = 'freeCashFlow',
  
  // Advanced Comparative Analysis (10 types)
  IndustryComparative = 'industryComparative',
  PeerComparative = 'peerComparative',
  HistoricalComparative = 'historicalComparative',
  Benchmarking = 'benchmarking',
  GapAnalysis = 'gapAnalysis',
  CompetitivePosition = 'competitivePosition',
  MarketShare = 'marketShare',
  CompetitiveCapability = 'competitiveCapability',
  FinancialStrengthWeakness = 'financialStrengthWeakness',
  RelativePerformance = 'relativePerformance',
  
  // Valuation and Investment Analysis (16 types)
  TimeValueOfMoney = 'timeValueOfMoney',
  NetPresentValue = 'netPresentValue',
  InternalRateOfReturn = 'internalRateOfReturn',
  PaybackPeriod = 'paybackPeriod',
  DiscountedCashFlow = 'discountedCashFlow',
  ReturnOnInvestment = 'returnOnInvestment',
  EconomicValueAdded = 'economicValueAdded',
  MarketValueAdded = 'marketValueAdded',
  GordonGrowthModel = 'gordonGrowthModel',
  DividendDiscountModel = 'dividendDiscountModel',
  FairValueAnalysis = 'fairValueAnalysis',
  CostBenefitAnalysis = 'costBenefitAnalysis',
  FinancialFeasibility = 'financialFeasibility',
  ProjectInvestmentAnalysis = 'projectInvestmentAnalysis',
  InvestmentAlternatives = 'investmentAlternatives',
  CompanyValuation = 'companyValuation',
  
  // Performance and Efficiency Analysis (12 types)
  DuPontAnalysis = 'duPontAnalysis',
  ProductivityAnalysis = 'productivityAnalysis',
  OperationalEfficiency = 'operationalEfficiency',
  ValueChainAnalysis = 'valueChainAnalysis',
  ActivityBasedCosting = 'activityBasedCosting',
  BalancedScorecard = 'balancedScorecard',
  KeyPerformanceIndicators = 'keyPerformanceIndicators',
  CriticalSuccessFactors = 'criticalSuccessFactors',
  AdvancedVarianceAnalysis = 'advancedVarianceAnalysis',
  DeviationAnalysis = 'deviationAnalysis',
  FlexibilityAnalysis = 'flexibilityAnalysis',
  SensitivityAnalysis = 'sensitivityAnalysis',
  
  // Modeling and Simulation (15 types)
  AdvancedScenarioAnalysis = 'advancedScenarioAnalysis',
  MonteCarloSimulation = 'monteCarloSimulation',
  ComplexFinancialModeling = 'complexFinancialModeling',
  MultiVariableSensitivity = 'multiVariableSensitivity',
  DecisionTreeAnalysis = 'decisionTreeAnalysis',
  RealOptionsAnalysis = 'realOptionsAnalysis',
  FinancialForecasting = 'financialForecasting',
  WhatIfAnalysis = 'whatIfAnalysis',
  StochasticSimulation = 'stochasticSimulation',
  OptimizationModels = 'optimizationModels',
  LinearProgramming = 'linearProgramming',
  DynamicProgramming = 'dynamicProgramming',
  OptimalAllocation = 'optimalAllocation',
  GameTheoryAnalysis = 'gameTheoryAnalysis',
  NetworkAnalysis = 'networkAnalysis',
  
  // Statistical and Quantitative Analysis (20 types)
  MultipleRegression = 'multipleRegression',
  AdvancedTimeSeries = 'advancedTimeSeries',
  ARIMAModels = 'arimaModels',
  GARCHModels = 'garchModels',
  PrincipalComponentAnalysis = 'principalComponentAnalysis',
  FactorAnalysis = 'factorAnalysis',
  ANOVA = 'anova',
  Cointegration = 'cointegration',
  VARModels = 'varModels',
  VECMModels = 'vecmModels',
  CopulaAnalysis = 'copulaAnalysis',
  ExtremeValueTheory = 'extremeValueTheory',
  SurvivalAnalysis = 'survivalAnalysis',
  MarkovModels = 'markovModels',
  ThresholdAnalysis = 'thresholdAnalysis',
  RegimeSwitching = 'regimeSwitching',
  ChaosTheory = 'chaosTheory',
  FractalAnalysis = 'fractalAnalysis',
  BootstrapAnalysis = 'bootstrapAnalysis',
  WaveletAnalysis = 'waveletAnalysis',
  
  // Portfolio and Risk Analysis (35 types)
  ModernPortfolioTheory = 'modernPortfolioTheory',
  CAPM = 'capm',
  ArbitragePricingTheory = 'arbitragePricingTheory',
  FamaFrenchModel = 'famaFrenchModel',
  BetaAnalysis = 'betaAnalysis',
  AlphaAnalysis = 'alphaAnalysis',
  ValueAtRisk = 'valueAtRisk',
  ExpectedShortfall = 'expectedShortfall',
  StressTesting = 'stressTesting',
  CatastrophicScenarios = 'catastrophicScenarios',
  OperationalRisk = 'operationalRisk',
  MarketRisk = 'marketRisk',
  CreditRisk = 'creditRisk',
  LiquidityRisk = 'liquidityRisk',
  CyberRisk = 'cyberRisk',
  GeopoliticalRisk = 'geopoliticalRisk',
  EnvironmentalRisk = 'environmentalRisk',
  GovernanceAnalysis = 'governanceAnalysis',
  SocialResponsibility = 'socialResponsibility',
  LegalAssessment = 'legalAssessment',
  CreditRiskModels = 'creditRiskModels',
  ConcentrationDiversification = 'concentrationDiversification',
  DynamicCorrelation = 'dynamicCorrelation',
  RiskParity = 'riskParity',
  DrawdownAnalysis = 'drawdownAnalysis',
  ICAAP = 'icaap',
  BaselIII = 'baselIII',
  Backtesting = 'backtesting',
  MergersAcquisitions = 'mergersAcquisitions',
  LeveragedBuyouts = 'leveragedBuyouts',
  IPOAnalysis = 'ipoAnalysis',
  SpinOffAnalysis = 'spinOffAnalysis',
  RestructuringAnalysis = 'restructuringAnalysis',
  BankruptcyAnalysis = 'bankruptcyAnalysis',
  ForensicFinancialAnalysis = 'forensicFinancialAnalysis',
  
  // Intelligent Detection and Prediction (18 types)
  AIFraudDetection = 'aiFraudDetection',
  MoneyLaunderingDetection = 'moneyLaunderingDetection',
  MarketManipulationDetection = 'marketManipulationDetection',
  BankruptcyPrediction = 'bankruptcyPrediction',
  CrisisPrediction = 'crisisPrediction',
  RealTimeAnomalyDetection = 'realTimeAnomalyDetection',
  MarketVolatilityPrediction = 'marketVolatilityPrediction',
  EarlyWarningModels = 'earlyWarningModels',
  IntelligentBehaviorAnalysis = 'intelligentBehaviorAnalysis',
  ExplainableAI = 'explainableAI',
  NeuralNetworkForecasting = 'neuralNetworkForecasting',
  LSTMTimeSeries = 'lstmTimeSeries',
  RandomForestCredit = 'randomForestCredit',
  GradientBoostingPrediction = 'gradientBoostingPrediction',
  FinancialClustering = 'financialClustering',
  AutoencodersAnomaly = 'autoencodersAnomaly',
  SentimentAnalysisAI = 'sentimentAnalysisAI',
  BlockchainAnalytics = 'blockchainAnalytics'
}

export interface AnalysisRequest {
  company: Company;
  financialStatements: FinancialStatement[];
  analysisTypes: AnalysisType[] | 'comprehensive';
  language: 'ar' | 'en';
}

export interface ExecutiveSummary {
  company: Company;
  date: string;
  analysisType: string;
  summaryTable: SummaryTableRow[];
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  risks: string[];
  forecasts: string[];
  recommendations: {
    forOwners: string[];
    forBanks: string[];
    forInvestors: string[];
    forValuators: string[];
    forOthers: string[];
  };
}

export interface SummaryTableRow {
  number: number;
  analysisName: string;
  definition: string;
  measurement: string;
  result: string | number;
  interpretation: string;
  industryAverage: string | number;
  comparison: string;
  benchmarkComparison: string;
  competitorComparison: string;
  rating: 'excellent' | 'veryGood' | 'good' | 'acceptable' | 'weak';
  recommendation: string;
}

export interface Report {
  format: 'word' | 'excel' | 'pdf' | 'ppt';
  content: any;
  language: 'ar' | 'en';
}

// Sectors and Activities
export const SECTORS = {
  energy: 'الطاقة والموارد الطبيعية',
  materials: 'المواد الأساسية والكيماويات',
  mining: 'التعدين والمعادن',
  manufacturing: 'الصناعات التحويلية',
  food: 'الأغذية والمشروبات',
  agriculture: 'الزراعة والثروة الحيوانية',
  fishing: 'الصيد والموارد البحرية',
  financial: 'القطاع المالي والمصرفي',
  realEstate: 'العقارات والإنشاءات',
  retail: 'التجارة والتجزئة',
  transport: 'النقل واللوجستيات',
  telecom: 'الاتصالات وتكنولوجيا المعلومات',
  ai: 'الذكاء الاصطناعي والتعلم الآلي',
  healthcare: 'الرعاية الصحية',
  education: 'التعليم والتدريب',
  tourism: 'السياحة والضيافة',
  media: 'الإعلام والترفيه',
  professional: 'الخدمات المهنية والاستشارية',
  personal: 'الخدمات الشخصية والمجتمعية',
  defense: 'الدفاع والأمن',
  space: 'الفضاء والأقمار الصناعية',
  environment: 'البيئة والاستدامة',
  robotics: 'الروبوتات والأتمتة',
  government: 'القطاع الحكومي والعام',
  nonprofit: 'القطاع غير الربحي والخيري',
  creative: 'الاقتصاد الإبداعي',
  emerging: 'القطاعات الناشئة والمستقبلية'
};

export const LEGAL_ENTITIES = {
  simplifiedJointStock: 'شركة مساهمة مبسطة',
  partnership: 'شركة تضامن',
  limitedPartnership: 'شركة توصية بسيطة',
  limitedLiability: 'شركة ذات مسؤولية محدودة',
  singlePerson: 'شركة الشخص الواحد',
  publicJointStock: 'شركة مساهمة عامة',
  privateJointStock: 'شركة مساهمة خاصة',
  holdingCompany: 'الشركة القابضة',
  subsidiary: 'الشركة التابعة',
  nonprofit: 'منظمة غير ربحية',
  cooperative: 'جمعية تعاونية',
  foundation: 'مؤسسة',
  stateOwned: 'شركة مملوكة للدولة',
  multinational: 'شركة متعددة الجنسيات',
  professional: 'شركة مهنية'
};
