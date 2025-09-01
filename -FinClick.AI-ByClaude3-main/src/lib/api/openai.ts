import OpenAI from 'openai';
import { FinancialStatement, AnalysisResult } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Financial analysis prompts
const ANALYSIS_PROMPTS = {
  executiveSummary: `
    You are a senior financial analyst. Analyze the provided financial statements and create a comprehensive executive summary in Arabic.
    Include:
    1. Key financial highlights
    2. Performance trends
    3. Main strengths and weaknesses
    4. Critical risks
    5. Strategic recommendations
    
    Format the response in structured JSON with clear sections.
  `,
  
  ratioAnalysis: `
    Calculate and interpret all financial ratios from the provided statements.
    For each ratio, provide:
    1. The calculated value
    2. Industry benchmark comparison
    3. Trend analysis if multiple years available
    4. Interpretation and implications
    5. Recommendations for improvement
  `,
  
  riskAssessment: `
    Perform a comprehensive risk assessment based on the financial data.
    Identify and analyze:
    1. Liquidity risks
    2. Solvency risks
    3. Operational risks
    4. Market risks
    5. Strategic risks
    
    Provide risk ratings and mitigation strategies.
  `,
  
  forecastAnalysis: `
    Based on historical financial data, provide:
    1. Revenue growth projections
    2. Profitability forecasts
    3. Cash flow predictions
    4. Key assumptions used
    5. Scenario analysis (best, base, worst case)
  `
};

export async function analyzeFinancialStatements(
  statements: FinancialStatement[],
  analysisType: string,
  language: 'ar' | 'en' = 'ar'
): Promise<any> {
  try {
    const prompt = ANALYSIS_PROMPTS[analysisType as keyof typeof ANALYSIS_PROMPTS] || ANALYSIS_PROMPTS.executiveSummary;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert financial analyst specializing in comprehensive financial analysis. 
                   Respond in ${language === 'ar' ? 'Arabic' : 'English'}.
                   Provide detailed, actionable insights based on financial data.`
        },
        {
          role: "user",
          content: `${prompt}\n\nFinancial Data:\n${JSON.stringify(statements, null, 2)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw error;
  }
}

export async function extractFinancialDataFromText(
  text: string,
  documentType: string = 'financial_statement'
): Promise<any> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert in extracting financial data from documents.
                   Extract all financial figures and organize them into structured financial statements.
                   Return data in JSON format matching standard financial statement structure.`
        },
        {
          role: "user",
          content: `Extract financial data from this ${documentType}:\n\n${text}`
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('OpenAI extraction error:', error);
    throw error;
  }
}

export async function generateFinancialInsights(
  data: any,
  insightType: string,
  context?: any
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a financial advisor providing clear, actionable insights.
                   Focus on practical recommendations and strategic guidance.`
        },
        {
          role: "user",
          content: `Generate ${insightType} insights for:\n${JSON.stringify(data)}\n\nContext: ${JSON.stringify(context || {})}`
        }
      ],
      temperature: 0.5,
      max_tokens: 2000
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI insights error:', error);
    throw error;
  }
}

export async function compareWithIndustryBenchmarks(
  companyData: any,
  industryData: any,
  metrics: string[]
): Promise<any> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a benchmarking expert comparing company performance against industry standards.
                   Provide detailed comparative analysis with actionable insights.`
        },
        {
          role: "user",
          content: `Compare company metrics with industry benchmarks:
                   Company Data: ${JSON.stringify(companyData)}
                   Industry Benchmarks: ${JSON.stringify(industryData)}
                   Metrics to analyze: ${metrics.join(', ')}`
        }
      ],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('OpenAI benchmark comparison error:', error);
    throw error;
  }
}

export async function detectFinancialAnomalies(
  financialData: any,
  historicalData?: any[]
): Promise<any> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a forensic financial analyst specialized in detecting anomalies and irregularities.
                   Identify potential red flags, unusual patterns, and areas requiring further investigation.`
        },
        {
          role: "user",
          content: `Analyze for anomalies:
                   Current Data: ${JSON.stringify(financialData)}
                   Historical Data: ${JSON.stringify(historicalData || [])}`
        }
      ],
      temperature: 0.2,
      max_tokens: 2500,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('OpenAI anomaly detection error:', error);
    throw error;
  }
}

export async function generateAnalysisNarrative(
  analysisResults: AnalysisResult[],
  language: 'ar' | 'en' = 'ar'
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a financial report writer creating comprehensive analysis narratives.
                   Write in ${language === 'ar' ? 'Arabic' : 'English'}.
                   Make the content professional yet accessible to non-financial readers.`
        },
        {
          role: "user",
          content: `Create a detailed narrative analysis from these results:\n${JSON.stringify(analysisResults)}`
        }
      ],
      temperature: 0.4,
      max_tokens: 4000
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI narrative generation error:', error);
    throw error;
  }
}

export async function translateFinancialContent(
  content: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a professional financial translator.
                   Maintain all financial terminology accuracy and numerical precision.
                   Preserve formatting and structure.`
        },
        {
          role: "user",
          content: `Translate from ${fromLang} to ${toLang}:\n\n${content}`
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    return completion.choices[0]?.message?.content || content;
  } catch (error) {
    console.error('OpenAI translation error:', error);
    return content;
  }
}

// Embedding functions for semantic search
export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('OpenAI embedding error:', error);
    throw error;
  }
}

export async function findSimilarCompanies(
  companyProfile: any,
  candidateProfiles: any[]
): Promise<any[]> {
  try {
    const companyEmbedding = await createEmbedding(JSON.stringify(companyProfile));
    
    const similarities = await Promise.all(
      candidateProfiles.map(async (candidate) => {
        const candidateEmbedding = await createEmbedding(JSON.stringify(candidate));
        const similarity = cosineSimilarity(companyEmbedding, candidateEmbedding);
        return { ...candidate, similarity };
      })
    );

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);
  } catch (error) {
    console.error('OpenAI similarity search error:', error);
    throw error;
  }
}

// Helper function for cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
