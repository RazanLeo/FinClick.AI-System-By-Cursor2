import OpenAI from 'openai';
import { FinancialStatement, AnalysisResult } from '@/lib/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface OpenAIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Analyze financial statements using OpenAI GPT
 */
export async function analyzeFinancialStatements(
  financialData: FinancialStatement[],
  analysisType: 'executiveSummary' | 'ratioAnalysis' | 'riskAssessment' | 'forecastAnalysis',
  language: 'ar' | 'en' = 'ar'
): Promise<OpenAIResponse> {
  try {
    const prompt = generateAnalysisPrompt(financialData, analysisType, language);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a senior financial analyst with expertise in ${language === 'ar' ? 'Arabic and English financial analysis' : 'financial analysis'}. 
          Provide detailed, accurate, and professional financial analysis. Always include specific numbers, ratios, and actionable insights.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const analysisResult = completion.choices[0]?.message?.content;
    
    if (!analysisResult) {
      throw new Error('No analysis result received from OpenAI');
    }

    return {
      success: true,
      data: {
        analysis_type: analysisType,
        language: language,
        result: analysisResult,
        timestamp: new Date().toISOString(),
        model: 'gpt-4-turbo-preview'
      }
    };
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Extract financial data from text using OpenAI
 */
export async function extractFinancialDataFromText(
  text: string,
  documentType: string = 'financial_statement'
): Promise<OpenAIResponse> {
  try {
    const prompt = `Extract financial data from the following ${documentType} text and return it in structured JSON format:

Text: ${text}

Please extract:
1. Income Statement data (revenue, expenses, net income, etc.)
2. Balance Sheet data (assets, liabilities, equity, etc.)
3. Cash Flow Statement data (operating, investing, financing cash flows)
4. Any ratios or key metrics mentioned
5. Company information (name, period, currency)

Return the data in a structured JSON format that matches financial statement standards.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a financial data extraction expert. Extract financial information accurately and return it in structured JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 3000,
    });

    const extractedData = completion.choices[0]?.message?.content;
    
    if (!extractedData) {
      throw new Error('No data extracted from OpenAI');
    }

    return {
      success: true,
      data: {
        document_type: documentType,
        extracted_data: extractedData,
        timestamp: new Date().toISOString(),
        model: 'gpt-4-turbo-preview'
      }
    };
  } catch (error) {
    console.error('OpenAI extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate financial insights using OpenAI
 */
export async function generateFinancialInsights(
  financialData: FinancialStatement[],
  language: 'ar' | 'en' = 'ar'
): Promise<OpenAIResponse> {
  try {
    const prompt = `Analyze the following financial data and provide comprehensive insights:

${JSON.stringify(financialData, null, 2)}

Please provide:
1. Key financial trends and patterns
2. Strengths and weaknesses
3. Opportunities and threats
4. Specific recommendations for improvement
5. Risk factors and mitigation strategies

Respond in ${language === 'ar' ? 'Arabic' : 'English'} with detailed, actionable insights.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a senior financial advisor providing comprehensive insights. 
          Be specific, data-driven, and provide actionable recommendations in ${language === 'ar' ? 'Arabic' : 'English'}.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 4000,
    });

    const insights = completion.choices[0]?.message?.content;
    
    if (!insights) {
      throw new Error('No insights generated from OpenAI');
    }

    return {
      success: true,
      data: {
        insights: insights,
        language: language,
        timestamp: new Date().toISOString(),
        model: 'gpt-4-turbo-preview'
      }
    };
  } catch (error) {
    console.error('OpenAI insights error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Compare with industry benchmarks using OpenAI
 */
export async function compareWithIndustryBenchmarks(
  financialData: FinancialStatement[],
  industryData: any,
  comparisonMetrics: string[]
): Promise<OpenAIResponse> {
  try {
    const prompt = `Compare the following company financial data with industry benchmarks:

Company Data: ${JSON.stringify(financialData, null, 2)}
Industry Benchmarks: ${JSON.stringify(industryData, null, 2)}
Metrics to Compare: ${comparisonMetrics.join(', ')}

Please provide:
1. Detailed comparison for each metric
2. Performance ranking (above/below/at benchmark)
3. Competitive position analysis
4. Recommendations for improvement
5. Industry context and trends

Respond in Arabic with specific numbers and percentages.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a financial benchmarking expert. Provide detailed, accurate comparisons with specific numbers and actionable recommendations in Arabic."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const comparison = completion.choices[0]?.message?.content;
    
    if (!comparison) {
      throw new Error('No comparison generated from OpenAI');
    }

    return {
      success: true,
      data: {
        comparison_metrics: comparisonMetrics,
        comparison_result: comparison,
        industry_data: industryData,
        timestamp: new Date().toISOString(),
        model: 'gpt-4-turbo-preview'
      }
    };
  } catch (error) {
    console.error('OpenAI comparison error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Detect financial anomalies using OpenAI
 */
export async function detectFinancialAnomalies(
  financialData: FinancialStatement[]
): Promise<OpenAIResponse> {
  try {
    const prompt = `Analyze the following financial data for anomalies, irregularities, and potential issues:

${JSON.stringify(financialData, null, 2)}

Please identify:
1. Unusual trends or patterns
2. Inconsistencies in financial statements
3. Potential red flags or warning signs
4. Areas requiring further investigation
5. Risk indicators

Provide specific examples with numbers and explain the significance of each anomaly.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a forensic financial analyst specializing in anomaly detection. Be thorough, specific, and provide detailed explanations with numbers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 3000,
    });

    const anomalies = completion.choices[0]?.message?.content;
    
    if (!anomalies) {
      throw new Error('No anomalies detected by OpenAI');
    }

    return {
      success: true,
      data: {
        anomalies: anomalies,
        timestamp: new Date().toISOString(),
        model: 'gpt-4-turbo-preview'
      }
    };
  } catch (error) {
    console.error('OpenAI anomaly detection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate analysis narrative using OpenAI
 */
export async function generateAnalysisNarrative(
  analysisResults: AnalysisResult[],
  language: 'ar' | 'en' = 'ar'
): Promise<OpenAIResponse> {
  try {
    const prompt = `Create a comprehensive financial analysis narrative based on the following results:

${JSON.stringify(analysisResults, null, 2)}

Please create:
1. Executive summary
2. Detailed analysis narrative
3. Key findings and insights
4. Recommendations and action items
5. Conclusion and outlook

Write in ${language === 'ar' ? 'Arabic' : 'English'} with professional tone and specific details.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a senior financial analyst creating comprehensive reports. 
          Write in ${language === 'ar' ? 'Arabic' : 'English'} with professional, clear, and detailed narrative.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 4000,
    });

    const narrative = completion.choices[0]?.message?.content;
    
    if (!narrative) {
      throw new Error('No narrative generated from OpenAI');
    }

    return {
      success: true,
      data: {
        narrative: narrative,
        language: language,
        timestamp: new Date().toISOString(),
        model: 'gpt-4-turbo-preview'
      }
    };
  } catch (error) {
    console.error('OpenAI narrative error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Translate financial content using OpenAI
 */
export async function translateFinancialContent(
  content: string,
  fromLanguage: string,
  toLanguage: string
): Promise<OpenAIResponse> {
  try {
    const prompt = `Translate the following financial content from ${fromLanguage} to ${toLanguage}:

${content}

Please ensure:
1. Accurate translation of financial terms
2. Proper formatting and structure
3. Cultural context appropriateness
4. Professional tone maintenance`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a professional financial translator. 
          Translate accurately while maintaining financial terminology and professional tone from ${fromLanguage} to ${toLanguage}.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 3000,
    });

    const translation = completion.choices[0]?.message?.content;
    
    if (!translation) {
      throw new Error('No translation generated from OpenAI');
    }

    return {
      success: true,
      data: {
        original_content: content,
        translated_content: translation,
        from_language: fromLanguage,
        to_language: toLanguage,
        timestamp: new Date().toISOString(),
        model: 'gpt-4-turbo-preview'
      }
    };
  } catch (error) {
    console.error('OpenAI translation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Create embedding for similarity search using OpenAI
 */
export async function createEmbedding(text: string): Promise<OpenAIResponse> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
    });

    const embedding = response.data[0]?.embedding;
    
    if (!embedding) {
      throw new Error('No embedding created by OpenAI');
    }

    return {
      success: true,
      data: {
        embedding: embedding,
        text: text,
        model: 'text-embedding-3-large',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('OpenAI embedding error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Find similar companies using OpenAI
 */
export async function findSimilarCompanies(
  companyInfo: any,
  similarCompanies: any[]
): Promise<OpenAIResponse> {
  try {
    const prompt = `Find the most similar companies to the following company:

Company Info: ${JSON.stringify(companyInfo, null, 2)}
Available Companies: ${JSON.stringify(similarCompanies, null, 2)}

Please:
1. Rank companies by similarity
2. Explain the similarity factors
3. Provide comparison metrics
4. Suggest benchmarking opportunities`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a financial comparison expert. Find and rank similar companies with detailed explanations and benchmarking suggestions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const similarity = completion.choices[0]?.message?.content;
    
    if (!similarity) {
      throw new Error('No similarity analysis generated from OpenAI');
    }

    return {
      success: true,
      data: {
        company_info: companyInfo,
        similar_companies: similarCompanies,
        similarity_analysis: similarity,
        timestamp: new Date().toISOString(),
        model: 'gpt-4-turbo-preview'
      }
    };
  } catch (error) {
    console.error('OpenAI similarity error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate analysis prompt based on type and language
 */
function generateAnalysisPrompt(
  financialData: FinancialStatement[],
  analysisType: string,
  language: 'ar' | 'en'
): string {
  const dataString = JSON.stringify(financialData, null, 2);
  
  const prompts = {
    executiveSummary: {
      ar: `قم بتحليل البيانات المالية التالية وقدم ملخصاً تنفيذياً شاملاً:

${dataString}

يرجى تضمين:
1. نظرة عامة على الأداء المالي
2. النقاط الرئيسية والقوية
3. التحديات والمخاطر
4. التوصيات الرئيسية
5. التوقعات المستقبلية

قدم تحليلاً مفصلاً بالأرقام والنسب المالية.`,
      en: `Analyze the following financial data and provide a comprehensive executive summary:

${dataString}

Please include:
1. Overall financial performance overview
2. Key strengths and highlights
3. Challenges and risks
4. Main recommendations
5. Future outlook

Provide detailed analysis with specific numbers and financial ratios.`
    },
    ratioAnalysis: {
      ar: `قم بتحليل النسب المالية للبيانات التالية:

${dataString}

يرجى حساب وتحليل:
1. نسب السيولة (النسبة الجارية، النسبة السريعة، نسبة النقد)
2. نسب النشاط (دوران الأصول، دوران المخزون، دوران الذمم المدينة)
3. نسب الرفع المالي (نسبة الدين إلى الأصول، نسبة الدين إلى حقوق الملكية)
4. نسب الربحية (هامش صافي الربح، العائد على الأصول، العائد على حقوق الملكية)
5. نسب السوق (ربحية السهم، مضاعف السعر إلى الربح)

قدم تفسيراً مفصلاً لكل نسبة مع التوصيات.`,
      en: `Analyze the financial ratios for the following data:

${dataString}

Please calculate and analyze:
1. Liquidity ratios (current ratio, quick ratio, cash ratio)
2. Activity ratios (asset turnover, inventory turnover, receivables turnover)
3. Leverage ratios (debt-to-assets, debt-to-equity)
4. Profitability ratios (net profit margin, ROA, ROE)
5. Market ratios (EPS, P/E ratio)

Provide detailed interpretation for each ratio with recommendations.`
    },
    riskAssessment: {
      ar: `قم بتقييم المخاطر المالية للبيانات التالية:

${dataString}

يرجى تقييم:
1. مخاطر السيولة
2. مخاطر الائتمان
3. مخاطر السوق
4. المخاطر التشغيلية
5. المخاطر الاستراتيجية
6. مؤشرات الإنذار المبكر
7. استراتيجيات إدارة المخاطر

قدم تقييماً مفصلاً مع درجات المخاطر والتوصيات.`,
      en: `Assess the financial risks for the following data:

${dataString}

Please evaluate:
1. Liquidity risks
2. Credit risks
3. Market risks
4. Operational risks
5. Strategic risks
6. Early warning indicators
7. Risk management strategies

Provide detailed assessment with risk ratings and recommendations.`
    },
    forecastAnalysis: {
      ar: `قم بتحليل التوقعات المالية للبيانات التالية:

${dataString}

يرجى تقديم:
1. توقعات الإيرادات للسنوات القادمة
2. توقعات التكاليف والمصروفات
3. توقعات التدفق النقدي
4. توقعات النمو والربحية
5. سيناريوهات مختلفة (متفائل، متشائم، واقعي)
6. العوامل المؤثرة على التوقعات
7. التوصيات الاستراتيجية

قدم تحليلاً مفصلاً مع الأرقام المتوقعة.`,
      en: `Provide financial forecasting analysis for the following data:

${dataString}

Please provide:
1. Revenue forecasts for coming years
2. Cost and expense projections
3. Cash flow forecasts
4. Growth and profitability projections
5. Different scenarios (optimistic, pessimistic, realistic)
6. Factors affecting forecasts
7. Strategic recommendations

Provide detailed analysis with projected numbers.`
    }
  };

  return prompts[analysisType as keyof typeof prompts]?.[language] || prompts.executiveSummary[language];
}