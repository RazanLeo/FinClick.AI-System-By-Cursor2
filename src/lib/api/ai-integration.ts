import { analyzeFinancialStatements, extractFinancialDataFromText, generateFinancialInsights, compareWithIndustryBenchmarks, detectFinancialAnomalies, generateAnalysisNarrative, translateFinancialContent, createEmbedding, findSimilarCompanies } from './openai';
import { analyzeFinancialDocument, generateAdvancedAnalysis, performPredictiveAnalysis, detectFinancialFraud, optimizeFinancialStructure, generateExecutivePresentation, batchAnalyzeDocuments, analyzeMarketSentiment } from './gemini';
import { FinancialStatement, AnalysisResult, AnalysisOptions } from '@/lib/types';

export interface AIAnalysisRequest {
  financialData: FinancialStatement[];
  analysisType: string;
  language: 'ar' | 'en';
  companyInfo: {
    name: string;
    sector: string;
    activity: string;
    legalEntity: string;
    comparisonLevel: string;
    years: number;
  };
  options?: AnalysisOptions;
}

export interface AIAnalysisResponse {
  success: boolean;
  data?: any;
  error?: string;
  processingTime?: number;
  aiProvider?: string;
}

export class AIAnalysisEngine {
  private static instance: AIAnalysisEngine;
  
  public static getInstance(): AIAnalysisEngine {
    if (!AIAnalysisEngine.instance) {
      AIAnalysisEngine.instance = new AIAnalysisEngine();
    }
    return AIAnalysisEngine.instance;
  }

  /**
   * Main analysis orchestrator - routes to appropriate AI provider
   */
  async performComprehensiveAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const startTime = Date.now();
    
    try {
      // Determine best AI provider based on analysis type
      const provider = this.selectOptimalProvider(request.analysisType);
      
      let result;
      switch (provider) {
        case 'openai':
          result = await this.performOpenAIAnalysis(request);
          break;
        case 'gemini':
          result = await this.performGeminiAnalysis(request);
          break;
        case 'hybrid':
          result = await this.performHybridAnalysis(request);
          break;
        default:
          throw new Error(`Unknown AI provider: ${provider}`);
      }

      return {
        success: true,
        data: result,
        processingTime: Date.now() - startTime,
        aiProvider: provider
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Select optimal AI provider based on analysis type
   */
  private selectOptimalProvider(analysisType: string): 'openai' | 'gemini' | 'hybrid' {
    const openaiTypes = [
      'executive_summary', 'ratio_analysis', 'risk_assessment', 
      'forecast_analysis', 'benchmark_comparison', 'anomaly_detection',
      'narrative_generation', 'translation', 'similarity_search'
    ];
    
    const geminiTypes = [
      'scenario_analysis', 'monte_carlo', 'predictive_analysis',
      'fraud_detection', 'optimization', 'presentation_generation',
      'document_analysis', 'sentiment_analysis', 'batch_processing'
    ];
    
    const hybridTypes = [
      'comprehensive_analysis', 'advanced_modeling', 'statistical_analysis',
      'portfolio_analysis', 'forensic_analysis', 'real_time_analysis'
    ];

    if (openaiTypes.includes(analysisType)) return 'openai';
    if (geminiTypes.includes(analysisType)) return 'gemini';
    if (hybridTypes.includes(analysisType)) return 'hybrid';
    
    return 'openai'; // Default fallback
  }

  /**
   * Perform analysis using OpenAI
   */
  private async performOpenAIAnalysis(request: AIAnalysisRequest): Promise<any> {
    const { financialData, analysisType, language } = request;
    
    switch (analysisType) {
      case 'executive_summary':
        return await analyzeFinancialStatements(financialData, 'executiveSummary', language);
      
      case 'ratio_analysis':
        return await analyzeFinancialStatements(financialData, 'ratioAnalysis', language);
      
      case 'risk_assessment':
        return await analyzeFinancialStatements(financialData, 'riskAssessment', language);
      
      case 'forecast_analysis':
        return await analyzeFinancialStatements(financialData, 'forecastAnalysis', language);
      
      case 'benchmark_comparison':
        // Get industry data from external APIs
        const industryData = await this.getIndustryBenchmarks(request.companyInfo);
        return await compareWithIndustryBenchmarks(
          financialData, 
          industryData, 
          ['profitability', 'liquidity', 'leverage', 'efficiency']
        );
      
      case 'anomaly_detection':
        return await detectFinancialAnomalies(financialData);
      
      case 'narrative_generation':
        const analysisResults = await this.performBasicAnalyses(financialData);
        return await generateAnalysisNarrative(analysisResults, language);
      
      case 'translation':
        return await translateFinancialContent(
          JSON.stringify(financialData), 
          'en', 
          language === 'ar' ? 'ar' : 'en'
        );
      
      case 'similarity_search':
        return await findSimilarCompanies(
          request.companyInfo, 
          await this.getSimilarCompanies(request.companyInfo)
        );
      
      default:
        return await analyzeFinancialStatements(financialData, 'executiveSummary', language);
    }
  }

  /**
   * Perform analysis using Gemini
   */
  private async performGeminiAnalysis(request: AIAnalysisRequest): Promise<any> {
    const { financialData, analysisType, companyInfo } = request;
    
    switch (analysisType) {
      case 'scenario_analysis':
        return await generateAdvancedAnalysis(financialData, 'scenario');
      
      case 'monte_carlo':
        return await generateAdvancedAnalysis(financialData, 'monte_carlo');
      
      case 'predictive_analysis':
        return await performPredictiveAnalysis(financialData, 'financial_forecast', 12);
      
      case 'fraud_detection':
        return await detectFinancialFraud(financialData);
      
      case 'optimization':
        return await optimizeFinancialStructure(
          financialData[0], 
          { regulatory: true, market: true }, 
          ['maximize_roi', 'minimize_risk', 'improve_liquidity']
        );
      
      case 'presentation_generation':
        const analysisResults = await this.performBasicAnalyses(financialData);
        return await generateExecutivePresentation(
          analysisResults, 
          companyInfo, 
          'board'
        );
      
      case 'document_analysis':
        // This would be called with document data
        return await analyzeFinancialDocument(
          Buffer.from(JSON.stringify(financialData)), 
          'application/json'
        );
      
      case 'sentiment_analysis':
        return await analyzeMarketSentiment(
          companyInfo.name, 
          companyInfo.sector
        );
      
      case 'batch_processing':
        return await batchAnalyzeDocuments(
          financialData.map((data, index) => ({
            data: Buffer.from(JSON.stringify(data)),
            mimeType: 'application/json',
            filename: `financial_data_${index}.json`
          }))
        );
      
      default:
        return await generateAdvancedAnalysis(financialData, 'scenario');
    }
  }

  /**
   * Perform hybrid analysis using both AI providers
   */
  private async performHybridAnalysis(request: AIAnalysisRequest): Promise<any> {
    const { financialData, analysisType, language, companyInfo } = request;
    
    // Run parallel analyses on both providers
    const [openaiResult, geminiResult] = await Promise.allSettled([
      this.performOpenAIAnalysis(request),
      this.performGeminiAnalysis(request)
    ]);

    // Combine results intelligently
    const combinedResult = {
      analysis_type: analysisType,
      timestamp: new Date().toISOString(),
      company_info: companyInfo,
      language: language,
      openai_analysis: openaiResult.status === 'fulfilled' ? openaiResult.value : null,
      gemini_analysis: geminiResult.status === 'fulfilled' ? geminiResult.value : null,
      combined_insights: this.combineAnalysisResults(
        openaiResult.status === 'fulfilled' ? openaiResult.value : null,
        geminiResult.status === 'fulfilled' ? geminiResult.value : null
      ),
      confidence_score: this.calculateConfidenceScore(openaiResult, geminiResult),
      recommendations: this.generateHybridRecommendations(
        openaiResult.status === 'fulfilled' ? openaiResult.value : null,
        geminiResult.status === 'fulfilled' ? geminiResult.value : null
      )
    };

    return combinedResult;
  }

  /**
   * Perform basic financial analyses
   */
  private async performBasicAnalyses(financialData: FinancialStatement[]): Promise<AnalysisResult[]> {
    const analyses = await Promise.all([
      analyzeFinancialStatements(financialData, 'executiveSummary', 'ar'),
      analyzeFinancialStatements(financialData, 'ratioAnalysis', 'ar'),
      analyzeFinancialStatements(financialData, 'riskAssessment', 'ar')
    ]);

    return analyses.map((analysis, index) => ({
      id: `analysis_${index}`,
      type: ['executive_summary', 'ratio_analysis', 'risk_assessment'][index],
      result: analysis,
      timestamp: new Date().toISOString(),
      confidence: 0.85
    }));
  }

  /**
   * Get industry benchmarks from external APIs
   */
  private async getIndustryBenchmarks(companyInfo: any): Promise<any> {
    // This would integrate with FMP API or other data providers
    // For now, return mock data
    return {
      sector: companyInfo.sector,
      activity: companyInfo.activity,
      benchmarks: {
        profitability: { roe: 0.15, roa: 0.08, net_margin: 0.12 },
        liquidity: { current_ratio: 2.0, quick_ratio: 1.5, cash_ratio: 0.3 },
        leverage: { debt_to_equity: 0.6, debt_to_assets: 0.4, interest_coverage: 4.0 },
        efficiency: { asset_turnover: 1.2, inventory_turnover: 6.0, receivables_turnover: 8.0 }
      },
      peer_companies: [],
      market_data: {}
    };
  }

  /**
   * Get similar companies for comparison
   */
  private async getSimilarCompanies(companyInfo: any): Promise<any[]> {
    // This would query a database of companies
    // For now, return mock data
    return [
      {
        name: 'Similar Company 1',
        sector: companyInfo.sector,
        activity: companyInfo.activity,
        size: 'medium',
        location: 'Saudi Arabia'
      },
      {
        name: 'Similar Company 2',
        sector: companyInfo.sector,
        activity: companyInfo.activity,
        size: 'large',
        location: 'UAE'
      }
    ];
  }

  /**
   * Combine analysis results from multiple AI providers
   */
  private combineAnalysisResults(openaiResult: any, geminiResult: any): any {
    if (!openaiResult && !geminiResult) return null;
    if (!openaiResult) return geminiResult;
    if (!geminiResult) return openaiResult;

    return {
      key_metrics: {
        ...openaiResult.key_metrics,
        ...geminiResult.key_metrics
      },
      insights: [
        ...(openaiResult.insights || []),
        ...(geminiResult.insights || [])
      ],
      recommendations: [
        ...(openaiResult.recommendations || []),
        ...(geminiResult.recommendations || [])
      ],
      risks: {
        ...openaiResult.risks,
        ...geminiResult.risks
      },
      opportunities: [
        ...(openaiResult.opportunities || []),
        ...(geminiResult.opportunities || [])
      ]
    };
  }

  /**
   * Calculate confidence score based on AI provider results
   */
  private calculateConfidenceScore(openaiResult: PromiseSettledResult<any>, geminiResult: PromiseSettledResult<any>): number {
    let score = 0;
    let count = 0;

    if (openaiResult.status === 'fulfilled') {
      score += 0.6; // OpenAI weight
      count++;
    }

    if (geminiResult.status === 'fulfilled') {
      score += 0.4; // Gemini weight
      count++;
    }

    return count > 0 ? score / count : 0;
  }

  /**
   * Generate hybrid recommendations
   */
  private generateHybridRecommendations(openaiResult: any, geminiResult: any): any[] {
    const recommendations = [];

    if (openaiResult?.recommendations) {
      recommendations.push(...openaiResult.recommendations.map((rec: any) => ({
        ...rec,
        source: 'OpenAI',
        priority: 'high'
      })));
    }

    if (geminiResult?.recommendations) {
      recommendations.push(...geminiResult.recommendations.map((rec: any) => ({
        ...rec,
        source: 'Gemini',
        priority: 'medium'
      })));
    }

    // Remove duplicates and prioritize
    const uniqueRecommendations = recommendations.filter((rec, index, self) =>
      index === self.findIndex(r => r.title === rec.title)
    );

    return uniqueRecommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Extract financial data from various document types
   */
  async extractFinancialData(
    documentData: Buffer,
    mimeType: string,
    documentType: string = 'financial_statement'
  ): Promise<any> {
    try {
      if (mimeType.startsWith('image/')) {
        return await analyzeFinancialDocument(documentData, mimeType);
      } else {
        const text = documentData.toString('utf-8');
        return await extractFinancialDataFromText(text, documentType);
      }
    } catch (error) {
      console.error('Data extraction error:', error);
      throw error;
    }
  }

  /**
   * Perform real-time analysis with live data
   */
  async performRealTimeAnalysis(
    companyInfo: any,
    marketData: any,
    financialData: FinancialStatement[]
  ): Promise<any> {
    const [sentimentAnalysis, benchmarkComparison, predictiveAnalysis] = await Promise.all([
      analyzeMarketSentiment(companyInfo.name, companyInfo.sector),
      this.getIndustryBenchmarks(companyInfo),
      performPredictiveAnalysis(financialData, 'real_time_forecast', 3)
    ]);

    return {
      real_time_analysis: {
        timestamp: new Date().toISOString(),
        market_sentiment: sentimentAnalysis,
        benchmark_comparison: benchmarkComparison,
        predictive_insights: predictiveAnalysis,
        recommendations: this.generateRealTimeRecommendations(
          sentimentAnalysis,
          benchmarkComparison,
          predictiveAnalysis
        )
      }
    };
  }

  /**
   * Generate real-time recommendations
   */
  private generateRealTimeRecommendations(
    sentiment: any,
    benchmarks: any,
    predictions: any
  ): any[] {
    const recommendations = [];

    if (sentiment?.sentiment_score < -50) {
      recommendations.push({
        type: 'risk_management',
        priority: 'high',
        message: 'Negative market sentiment detected. Consider risk mitigation strategies.',
        action: 'Review hedging positions and cash reserves'
      });
    }

    if (predictions?.revenue_growth < 0) {
      recommendations.push({
        type: 'growth_strategy',
        priority: 'high',
        message: 'Revenue decline predicted. Implement growth initiatives.',
        action: 'Develop new revenue streams and cost optimization'
      });
    }

    return recommendations;
  }
}

// Export singleton instance
export const aiAnalysisEngine = AIAnalysisEngine.getInstance();

// Export convenience functions
export async function performAIAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  return await aiAnalysisEngine.performComprehensiveAnalysis(request);
}

export async function extractDocumentData(
  documentData: Buffer,
  mimeType: string,
  documentType?: string
): Promise<any> {
  return await aiAnalysisEngine.extractFinancialData(documentData, mimeType, documentType);
}

export async function performRealTimeAnalysis(
  companyInfo: any,
  marketData: any,
  financialData: FinancialStatement[]
): Promise<any> {
  return await aiAnalysisEngine.performRealTimeAnalysis(companyInfo, marketData, financialData);
}

