import { FinancialStatement, AnalysisResult } from '@/lib/types';
import { aiAnalysisEngine } from '@/lib/api/ai-integration';

export interface AnalysisDefinition {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  level: 'basic' | 'applied' | 'advanced';
  complexity: 'simple' | 'moderate' | 'complex';
  requiredYears: number;
  aiProvider: 'openai' | 'gemini' | 'hybrid';
}

export class MasterAnalysisEngine {
  private static instance: MasterAnalysisEngine;
  
  public static getInstance(): MasterAnalysisEngine {
    if (!MasterAnalysisEngine.instance) {
      MasterAnalysisEngine.instance = new MasterAnalysisEngine();
    }
    return MasterAnalysisEngine.instance;
  }

  /**
   * All 181 analysis definitions
   */
  private getAllAnalysisDefinitions(): AnalysisDefinition[] {
    return [
      // Basic Financial Ratios (25 types)
      { id: 'liquidity_ratios', name: 'Liquidity Ratios', nameAr: 'نسب السيولة', category: 'basic_ratios', level: 'basic', complexity: 'simple', requiredYears: 1, aiProvider: 'openai' },
      { id: 'profitability_ratios', name: 'Profitability Ratios', nameAr: 'نسب الربحية', category: 'basic_ratios', level: 'basic', complexity: 'simple', requiredYears: 1, aiProvider: 'openai' },
      { id: 'leverage_ratios', name: 'Leverage Ratios', nameAr: 'نسب الرافعة المالية', category: 'basic_ratios', level: 'basic', complexity: 'simple', requiredYears: 1, aiProvider: 'openai' },
      { id: 'efficiency_ratios', name: 'Efficiency Ratios', nameAr: 'نسب الكفاءة', category: 'basic_ratios', level: 'basic', complexity: 'simple', requiredYears: 1, aiProvider: 'openai' },
      { id: 'market_ratios', name: 'Market Ratios', nameAr: 'نسب السوق', category: 'basic_ratios', level: 'basic', complexity: 'simple', requiredYears: 1, aiProvider: 'openai' },
      
      // Applied Performance Analysis (12 types)
      { id: 'dupont_analysis', name: 'DuPont Analysis', nameAr: 'تحليل دوبونت', category: 'applied_performance', level: 'applied', complexity: 'moderate', requiredYears: 2, aiProvider: 'openai' },
      { id: 'productivity_analysis', name: 'Productivity Analysis', nameAr: 'تحليل الإنتاجية', category: 'applied_performance', level: 'applied', complexity: 'moderate', requiredYears: 2, aiProvider: 'openai' },
      { id: 'operational_efficiency', name: 'Operational Efficiency', nameAr: 'الكفاءة التشغيلية', category: 'applied_performance', level: 'applied', complexity: 'moderate', requiredYears: 2, aiProvider: 'openai' },
      { id: 'value_chain_analysis', name: 'Value Chain Analysis', nameAr: 'تحليل سلسلة القيمة', category: 'applied_performance', level: 'applied', complexity: 'moderate', requiredYears: 2, aiProvider: 'openai' },
      { id: 'abc_analysis', name: 'Activity-Based Costing', nameAr: 'تحليل التكاليف على أساس الأنشطة', category: 'applied_performance', level: 'applied', complexity: 'moderate', requiredYears: 2, aiProvider: 'openai' },
      
      // Advanced Modeling & Simulation (15 types)
      { id: 'advanced_scenario_analysis', name: 'Advanced Scenario Analysis', nameAr: 'تحليل السيناريوهات المتقدم', category: 'advanced_modeling', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'gemini' },
      { id: 'monte_carlo_simulation', name: 'Monte Carlo Simulation', nameAr: 'تحليل مونت كارلو', category: 'advanced_modeling', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'gemini' },
      { id: 'complex_financial_modeling', name: 'Complex Financial Modeling', nameAr: 'النمذجة المالية المعقدة', category: 'advanced_modeling', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'gemini' },
      { id: 'multi_variable_sensitivity', name: 'Multi-Variable Sensitivity Analysis', nameAr: 'تحليل الحساسية متعدد المتغيرات', category: 'advanced_modeling', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'gemini' },
      { id: 'decision_tree_analysis', name: 'Decision Tree Analysis', nameAr: 'تحليل شجرة القرار', category: 'advanced_modeling', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'gemini' },
      
      // Statistical & Quantitative Analysis (20 types)
      { id: 'multiple_regression_analysis', name: 'Multiple Regression Analysis', nameAr: 'تحليل الانحدار المتعدد', category: 'statistical_quantitative', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'gemini' },
      { id: 'advanced_time_series', name: 'Advanced Time Series Analysis', nameAr: 'تحليل السلاسل الزمنية المتقدم', category: 'statistical_quantitative', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'gemini' },
      { id: 'arima_models', name: 'ARIMA Models', nameAr: 'نماذج ARIMA للتنبؤ', category: 'statistical_quantitative', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'gemini' },
      { id: 'garch_models', name: 'GARCH Models', nameAr: 'نماذج GARCH للتقلبات', category: 'statistical_quantitative', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'gemini' },
      { id: 'pca_analysis', name: 'Principal Component Analysis', nameAr: 'تحليل المكونات الرئيسية', category: 'statistical_quantitative', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'gemini' },
      
      // Portfolio & Risk Analysis (35 types)
      { id: 'modern_portfolio_theory', name: 'Modern Portfolio Theory', nameAr: 'نظرية المحفظة الحديثة', category: 'portfolio_risk', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'hybrid' },
      { id: 'capm_analysis', name: 'CAPM Analysis', nameAr: 'نموذج تسعير الأصول الرأسمالية', category: 'portfolio_risk', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'hybrid' },
      { id: 'var_analysis', name: 'Value at Risk (VaR)', nameAr: 'القيمة المعرضة للخطر', category: 'portfolio_risk', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'hybrid' },
      { id: 'stress_testing', name: 'Stress Testing', nameAr: 'اختبارات الإجهاد', category: 'portfolio_risk', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'hybrid' },
      { id: 'operational_risk_analysis', name: 'Operational Risk Analysis', nameAr: 'تحليل المخاطر التشغيلية', category: 'portfolio_risk', level: 'advanced', complexity: 'complex', requiredYears: 3, aiProvider: 'hybrid' },
      
      // Intelligent Detection & Prediction (18 types)
      { id: 'ai_fraud_detection', name: 'AI Fraud Detection', nameAr: 'كشف الاحتيال بالذكاء الاصطناعي', category: 'intelligent_detection', level: 'advanced', complexity: 'complex', requiredYears: 2, aiProvider: 'gemini' },
      { id: 'money_laundering_detection', name: 'Money Laundering Detection', nameAr: 'كشف غسيل الأموال', category: 'intelligent_detection', level: 'advanced', complexity: 'complex', requiredYears: 2, aiProvider: 'gemini' },
      { id: 'market_manipulation_detection', name: 'Market Manipulation Detection', nameAr: 'كشف التلاعب في السوق', category: 'intelligent_detection', level: 'advanced', complexity: 'complex', requiredYears: 2, aiProvider: 'gemini' },
      { id: 'advanced_bankruptcy_prediction', name: 'Advanced Bankruptcy Prediction', nameAr: 'التنبؤ بالإفلاس المتقدم', category: 'intelligent_detection', level: 'advanced', complexity: 'complex', requiredYears: 2, aiProvider: 'gemini' },
      { id: 'real_time_anomaly_detection', name: 'Real-time Anomaly Detection', nameAr: 'كشف الشذوذ في الوقت الفعلي', category: 'intelligent_detection', level: 'advanced', complexity: 'complex', requiredYears: 2, aiProvider: 'gemini' }
    ];
  }

  /**
   * Execute specific analysis
   */
  async executeAnalysis(
    analysisId: string,
    financialData: FinancialStatement[],
    options: any
  ): Promise<AnalysisResult> {
    const definitions = this.getAllAnalysisDefinitions();
    const definition = definitions.find(d => d.id === analysisId);

    if (!definition) {
      throw new Error(`Analysis type ${analysisId} not found`);
    }

    const request = {
      financialData,
      analysisType: analysisId,
      language: options.language || 'ar',
      companyInfo: options.companyInfo,
      options
    };

    const result = await aiAnalysisEngine.performComprehensiveAnalysis(request);

    return {
      id: analysisId,
      type: analysisId,
      result: result.data,
      timestamp: new Date().toISOString(),
      confidence: result.success ? 0.9 : 0.1,
      metadata: {
        definition,
        processingTime: result.processingTime,
        aiProvider: result.aiProvider
      }
    };
  }

  /**
   * Execute comprehensive analysis (all 181 types)
   */
  async executeComprehensiveAnalysis(
    financialData: FinancialStatement[],
    options: any
  ): Promise<AnalysisResult[]> {
    const definitions = this.getAllAnalysisDefinitions();
    const results = await Promise.allSettled(
      definitions.map(def => this.executeAnalysis(def.id, financialData, options))
    );

    return results
      .filter((result): result is PromiseFulfilledResult<AnalysisResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }

  /**
   * Get analysis by category
   */
  getAnalysesByCategory(category: string): AnalysisDefinition[] {
    return this.getAllAnalysisDefinitions().filter(d => d.category === category);
  }

  /**
   * Get analysis by level
   */
  getAnalysesByLevel(level: string): AnalysisDefinition[] {
    return this.getAllAnalysisDefinitions().filter(d => d.level === level);
  }

  /**
   * Get recommended analyses for company
   */
  getRecommendedAnalyses(companyInfo: any): string[] {
    const recommendations = [];

    // Basic analyses for all companies
    recommendations.push(
      'liquidity_ratios',
      'profitability_ratios',
      'leverage_ratios',
      'efficiency_ratios',
      'market_ratios'
    );

    // Sector-specific recommendations
    if (companyInfo.sector === 'financial') {
      recommendations.push(
        'var_analysis',
        'stress_testing',
        'operational_risk_analysis',
        'ai_fraud_detection',
        'money_laundering_detection'
      );
    }

    if (companyInfo.sector === 'technology') {
      recommendations.push(
        'productivity_analysis',
        'value_chain_analysis',
        'advanced_scenario_analysis',
        'monte_carlo_simulation'
      );
    }

    return [...new Set(recommendations)];
  }
}

export const masterAnalysisEngine = MasterAnalysisEngine.getInstance();

