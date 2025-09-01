import { NextRequest, NextResponse } from 'next/server';
import { FinancialAnalysisEngine } from '@/lib/analysis/FinancialAnalysisEngine';
import { DataProcessor } from '@/lib/utils/DataProcessor';
import { supabase } from '@/lib/supabase/client';
import { openai } from '@/lib/openai/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      companyData, 
      financialStatements, 
      analysisOptions,
      userId 
    } = body;

    // Validate required data
    if (!companyData || !financialStatements || !analysisOptions) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    // Create analysis session
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Save initial analysis record
    const { error: saveError } = await supabase
      .from('financial_analyses')
      .insert([
        {
          id: analysisId,
          user_id: userId,
          company_data: companyData,
          analysis_options: analysisOptions,
          status: 'processing',
          created_at: new Date().toISOString(),
          progress: 0
        }
      ]);

    if (saveError) {
      console.error('Error saving analysis:', saveError);
      return NextResponse.json(
        { error: 'Failed to create analysis session' },
        { status: 500 }
      );
    }

    // Process analysis asynchronously
    processAnalysisAsync(analysisId, companyData, financialStatements, analysisOptions);

    return NextResponse.json({
      success: true,
      analysisId,
      message: 'Analysis started successfully'
    });

  } catch (error) {
    console.error('Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function processAnalysisAsync(
  analysisId: string,
  companyData: any,
  financialStatements: any[],
  analysisOptions: any
) {
  try {
    // Update progress
    await updateAnalysisProgress(analysisId, 10, 'Initializing analysis engine...');

    // Initialize analysis engine
    const analysisEngine = new FinancialAnalysisEngine();
    
    // Process and validate financial data
    await updateAnalysisProgress(analysisId, 20, 'Processing financial data...');
    const dataProcessor = new DataProcessor();
    const processedData = await dataProcessor.processFinancialStatements(
      financialStatements,
      companyData
    );

    // Fetch market data and benchmarks
    await updateAnalysisProgress(analysisId, 30, 'Fetching market data...');
    const marketData = await fetchMarketData(companyData);
    const benchmarkData = await fetchBenchmarkData(companyData, analysisOptions);

    // Run comprehensive analysis
    await updateAnalysisProgress(analysisId, 40, 'Running financial analysis...');
    const analysisResults = await analysisEngine.performComprehensiveAnalysis({
      companyData,
      financialData: processedData,
      marketData,
      benchmarkData,
      options: analysisOptions
    });

    // Generate AI-powered insights
    await updateAnalysisProgress(analysisId, 70, 'Generating AI insights...');
    const aiInsights = await generateAIInsights(analysisResults, companyData);
    
    // Create executive summary
    await updateAnalysisProgress(analysisId, 85, 'Creating executive summary...');
    const executiveSummary = await generateExecutiveSummary(
      analysisResults,
      aiInsights,
      companyData
    );

    // Generate recommendations
    await updateAnalysisProgress(analysisId, 95, 'Finalizing recommendations...');
    const recommendations = await generateRecommendations(
      analysisResults,
      aiInsights,
      companyData
    );

    // Save final results
    const finalResults = {
      analysisResults: analysisResults,
      executiveSummary,
      recommendations,
      aiInsights,
      metadata: {
        analysisDate: new Date().toISOString(),
        dataPoints: analysisResults.length,
        processingTime: Date.now() - parseInt(analysisId.split('_')[1])
      }
    };

    await supabase
      .from('financial_analyses')
      .update({
        results: finalResults,
        status: 'completed',
        progress: 100,
        completed_at: new Date().toISOString()
      })
      .eq('id', analysisId);

    console.log(`Analysis ${analysisId} completed successfully`);

  } catch (error) {
    console.error(`Analysis ${analysisId} failed:`, error);
    
    await supabase
      .from('financial_analyses')
      .update({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        progress: 0
      })
      .eq('id', analysisId);
  }
}

async function updateAnalysisProgress(
  analysisId: string, 
  progress: number, 
  message: string
) {
  await supabase
    .from('financial_analyses')
    .update({
      progress,
      status_message: message
    })
    .eq('id', analysisId);
}

async function fetchMarketData(companyData: any) {
  try {
    // Use Financial Modeling Prep API
    const fmpApiKey = process.env.FMP_API_KEY;
    if (!fmpApiKey) {
      throw new Error('FMP API key not configured');
    }

    const responses = await Promise.all([
      // Market indices
      fetch(`https://financialmodelingprep.com/api/v3/historical-chart/1hour/%5ESPX?apikey=${fmpApiKey}`),
      // Industry data
      fetch(`https://financialmodelingprep.com/api/v3/sector-performance?apikey=${fmpApiKey}`),
      // Economic indicators
      fetch(`https://financialmodelingprep.com/api/v3/economic?name=GDP&apikey=${fmpApiKey}`)
    ]);

    const [marketIndices, sectorPerformance, economicData] = await Promise.all(
      responses.map(r => r.json())
    );

    return {
      marketIndices: marketIndices.slice(0, 252), // Last 252 trading days
      sectorPerformance,
      economicIndicators: economicData.slice(0, 20),
      fetchedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error fetching market data:', error);
    return {
      marketIndices: [],
      sectorPerformance: [],
      economicIndicators: [],
      error: 'Failed to fetch market data'
    };
  }
}

async function fetchBenchmarkData(companyData: any, analysisOptions: any) {
  try {
    const fmpApiKey = process.env.FMP_API_KEY;
    if (!fmpApiKey) {
      throw new Error('FMP API key not configured');
    }

    // Fetch peer companies data
    const industryCode = companyData.industry || 'technology';
    const peerResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/stock-screener?sector=${industryCode}&limit=20&apikey=${fmpApiKey}`
    );
    const peerData = await peerResponse.json();

    // Fetch industry averages
    const industryResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/industry-average?symbol=${companyData.symbol || 'AAPL'}&apikey=${fmpApiKey}`
    );
    const industryAverages = await industryResponse.json();

    return {
      peerCompanies: peerData.slice(0, 10),
      industryAverages,
      benchmarkRegion: analysisOptions.benchmarkRegion || 'global',
      fetchedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error fetching benchmark data:', error);
    return {
      peerCompanies: [],
      industryAverages: {},
      error: 'Failed to fetch benchmark data'
    };
  }
}

async function generateAIInsights(analysisResults: any[], companyData: any) {
  try {
    const analysisContext = analysisResults.map(result => ({
      name: result.name,
      category: result.category,
      value: result.currentValue,
      rating: result.rating,
      trend: result.trend,
      interpretation: result.interpretation
    }));

    const prompt = `
As a senior financial analyst, analyze the following financial analysis results for ${companyData.name} and provide key insights:

Company: ${companyData.name}
Industry: ${companyData.industry}
Region: ${companyData.region}

Analysis Results Summary:
${JSON.stringify(analysisContext, null, 2)}

Please provide:
1. Top 5 key insights about the company's financial performance
2. Critical areas of concern that need immediate attention
3. Strengths and competitive advantages identified
4. Market positioning assessment
5. Risk factors and their potential impact

Respond in Arabic if the user's language preference is Arabic, otherwise in English.
Keep insights concise, actionable, and based on the data provided.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.3
    });

    const insights = response.choices[0].message?.content || '';
    
    return {
      keyInsights: insights.split('\n').filter(line => line.trim()),
      generatedAt: new Date().toISOString(),
      model: 'gpt-4'
    };

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return {
      keyInsights: ['فشل في تحليل البيانات بالذكاء الاصطناعي'],
      error: 'Failed to generate AI insights'
    };
  }
}

async function generateExecutiveSummary(
  analysisResults: any[],
  aiInsights: any,
  companyData: any
) {
  try {
    const summaryData = {
      companyName: companyData.name,
      analysisDate: new Date().toISOString(),
      totalAnalyses: analysisResults.length,
      overallRating: calculateOverallRating(analysisResults),
      keyMetrics: extractKeyMetrics(analysisResults),
      keyFindings: aiInsights.keyInsights.slice(0, 5),
      criticalIssues: analysisResults
        .filter(a => a.rating === 'poor' || a.riskAssessment?.overallRisk === 'high')
        .map(a => a.name),
      strongPoints: analysisResults
        .filter(a => a.rating === 'excellent')
        .map(a => a.name),
      recommendations: [] // Will be populated by generateRecommendations
    };

    return summaryData;

  } catch (error) {
    console.error('Error generating executive summary:', error);
    return {
      companyName: companyData.name,
      error: 'Failed to generate executive summary'
    };
  }
}

async function generateRecommendations(
  analysisResults: any[],
  aiInsights: any,
  companyData: any
) {
  try {
    const weakAreas = analysisResults.filter(a => 
      a.rating === 'poor' || a.rating === 'average'
    );

    const recommendations = [];

    for (const area of weakAreas) {
      if (area.recommendations && area.recommendations.length > 0) {
        recommendations.push({
          category: area.category,
          metric: area.name,
          priority: area.rating === 'poor' ? 'high' : 'medium',
          recommendations: area.recommendations,
          timeframe: area.rating === 'poor' ? 'immediate' : 'short-term'
        });
      }
    }

    return {
      strategicRecommendations: recommendations,
      generatedAt: new Date().toISOString(),
      totalRecommendations: recommendations.length
    };

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      strategicRecommendations: [],
      error: 'Failed to generate recommendations'
    };
  }
}

function calculateOverallRating(analysisResults: any[]): string {
  const ratings = analysisResults.map(a => a.rating);
  const ratingScores = {
    'excellent': 4,
    'good': 3,
    'average': 2,
    'poor': 1
  };

  const averageScore = ratings.reduce((sum, rating) => 
    sum + (ratingScores[rating as keyof typeof ratingScores] || 2), 0
  ) / ratings.length;

  if (averageScore >= 3.5) return 'excellent';
  if (averageScore >= 2.5) return 'good';
  if (averageScore >= 1.5) return 'average';
  return 'poor';
}

function extractKeyMetrics(analysisResults: any[]) {
  return analysisResults
    .filter(a => ['profitability', 'liquidity', 'efficiency', 'leverage'].includes(a.category))
    .slice(0, 8)
    .map(a => ({
      name: a.name,
      value: a.currentValue,
      rating: a.rating,
      trend: a.trend
    }));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    // Fetch analysis from database
    const { data: analysis, error } = await supabase
      .from('financial_analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (error || !analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Check if user has access (optional - implement based on your auth system)
    if (userId && analysis.user_id !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Get Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
