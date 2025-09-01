import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Get the Gemini Pro model for text generation
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Get the Gemini Pro Vision model for image analysis
const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

export async function analyzeFinancialDocument(
  imageData: Buffer,
  mimeType: string
): Promise<any> {
  try {
    const prompt = `
      Analyze this financial document and extract all financial data.
      Identify:
      1. Document type (balance sheet, income statement, cash flow, etc.)
      2. Company name and period
      3. All financial line items with their values
      4. Currency used
      5. Any notes or important annotations
      
      Return the data in structured JSON format.
    `;

    const imagePart = {
      inlineData: {
        data: imageData.toString('base64'),
        mimeType
      }
    };

    const result = await visionModel.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { rawText: text };
  } catch (error) {
    console.error('Gemini vision analysis error:', error);
    throw error;
  }
}

export async function generateAdvancedAnalysis(
  financialData: any,
  analysisType: string,
  additionalContext?: any
): Promise<any> {
  try {
    const prompts = {
      scenario: `
        Perform advanced scenario analysis on the financial data.
        Create three scenarios: optimistic, realistic, and pessimistic.
        For each scenario, project key financial metrics for the next 3 years.
        Consider industry trends, economic factors, and company-specific risks.
      `,
      
      monte_carlo: `
        Conduct a Monte Carlo simulation analysis on the financial projections.
        Identify key variables and their probability distributions.
        Run 1000 simulations and provide:
        - Probability distribution of outcomes
        - Confidence intervals
        - Risk metrics (VaR, CVaR)
        - Key sensitivity factors
      `,
      
      competitive: `
        Perform a comprehensive competitive analysis.
        Compare the company's financial performance with industry peers.
        Analyze:
        - Market positioning
        - Competitive advantages/disadvantages
        - Strategic opportunities
        - Threat assessment
      `,
      
      sustainability: `
        Analyze the financial sustainability and ESG factors.
        Evaluate:
        - Long-term financial viability
        - Environmental impact and risks
        - Social responsibility metrics
        - Governance quality indicators
        - Sustainability-adjusted financial projections
      `
    };

    const selectedPrompt = prompts[analysisType as keyof typeof prompts] || prompts.scenario;
    
    const fullPrompt = `
      ${selectedPrompt}
      
      Financial Data:
      ${JSON.stringify(financialData, null, 2)}
      
      Additional Context:
      ${JSON.stringify(additionalContext || {}, null, 2)}
      
      Provide a comprehensive analysis with specific numbers, calculations, and actionable insights.
      Format the response as structured JSON.
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { analysis: text };
  } catch (error) {
    console.error('Gemini advanced analysis error:', error);
    throw error;
  }
}

export async function performPredictiveAnalysis(
  historicalData: any[],
  predictionType: string,
  horizon: number = 12
): Promise<any> {
  try {
    const prompt = `
      Perform predictive analysis on the historical financial data.
      
      Prediction Type: ${predictionType}
      Prediction Horizon: ${horizon} months
      
      Historical Data:
      ${JSON.stringify(historicalData, null, 2)}
      
      Use appropriate statistical and machine learning techniques to:
      1. Identify trends and patterns
      2. Detect seasonality and cycles
      3. Generate point forecasts
      4. Provide confidence intervals
      5. Identify key drivers of predictions
      6. Assess prediction reliability
      
      Return structured JSON with predictions, methodology, and confidence metrics.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { predictions: text };
  } catch (error) {
    console.error('Gemini predictive analysis error:', error);
    throw error;
  }
}

export async function detectFinancialFraud(
  financialStatements: any[],
  transactionData?: any[]
): Promise<any> {
  try {
    const prompt = `
      Perform forensic financial analysis to detect potential fraud indicators.
      
      Financial Statements:
      ${JSON.stringify(financialStatements, null, 2)}
      
      ${transactionData ? `Transaction Data Sample:\n${JSON.stringify(transactionData.slice(0, 100), null, 2)}` : ''}
      
      Analyze for:
      1. Benford's Law violations
      2. Unusual journal entries
      3. Round number anomalies
      4. Trend discontinuities
      5. Ratio manipulation indicators
      6. Revenue recognition issues
      7. Expense timing manipulation
      8. Related party transaction red flags
      
      Provide:
      - Fraud risk score (0-100)
      - Specific red flags identified
      - Areas requiring further investigation
      - Recommended forensic procedures
      
      Format as JSON with detailed findings and evidence.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { fraudAnalysis: text };
  } catch (error) {
    console.error('Gemini fraud detection error:', error);
    throw error;
  }
}

export async function optimizeFinancialStructure(
  currentFinancials: any,
  constraints: any,
  objectives: string[]
): Promise<any> {
  try {
    const prompt = `
      Optimize the company's financial structure based on current financials and constraints.
      
      Current Financial Position:
      ${JSON.stringify(currentFinancials, null, 2)}
      
      Constraints:
      ${JSON.stringify(constraints, null, 2)}
      
      Optimization Objectives:
      ${objectives.join(', ')}
      
      Provide recommendations for:
      1. Optimal capital structure (debt/equity mix)
      2. Working capital optimization
      3. Asset allocation improvements
      4. Cost structure optimization
      5. Cash flow management strategies
      6. Investment prioritization
      7. Risk-return trade-offs
      
      Include:
      - Specific numerical recommendations
      - Implementation roadmap
      - Expected impact on key metrics
      - Risk considerations
      
      Format as structured JSON with detailed optimization strategies.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { optimization: text };
  } catch (error) {
    console.error('Gemini optimization error:', error);
    throw error;
  }
}

export async function generateExecutivePresentation(
  analysisResults: any,
  companyInfo: any,
  presentationType: 'board' | 'investor' | 'bank' | 'internal'
): Promise<any> {
  try {
    const prompt = `
      Create an executive presentation based on the financial analysis results.
      
      Presentation Type: ${presentationType}
      Company Info: ${JSON.stringify(companyInfo, null, 2)}
      
      Analysis Results:
      ${JSON.stringify(analysisResults, null, 2)}
      
      Generate a structured presentation with:
      1. Executive summary slide
      2. Key financial highlights
      3. Performance trends visualization descriptions
      4. Comparative analysis
      5. Risk assessment summary
      6. Strategic recommendations
      7. Action plan
      8. Q&A anticipated questions
      
      For each slide provide:
      - Title
      - Key bullet points
      - Suggested visualizations
      - Speaker notes
      - Data to highlight
      
      Tailor the content and tone for the ${presentationType} audience.
      Format as JSON with complete slide deck structure.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { presentation: text };
  } catch (error) {
    console.error('Gemini presentation generation error:', error);
    throw error;
  }
}

// Batch processing for multiple analyses
export async function batchAnalyzeDocuments(
  documents: Array<{ data: Buffer; mimeType: string; filename: string }>
): Promise<any[]> {
  try {
    const results = await Promise.all(
      documents.map(async (doc) => {
        try {
          const analysis = await analyzeFinancialDocument(doc.data, doc.mimeType);
          return {
            filename: doc.filename,
            success: true,
            data: analysis
          };
        } catch (error) {
          return {
            filename: doc.filename,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    return results;
  } catch (error) {
    console.error('Gemini batch processing error:', error);
    throw error;
  }
}

// Real-time market sentiment analysis
export async function analyzeMarketSentiment(
  companyName: string,
  sector: string,
  recentNews?: string[]
): Promise<any> {
  try {
    const prompt = `
      Analyze current market sentiment for ${companyName} in the ${sector} sector.
      
      ${recentNews ? `Recent News Headlines:\n${recentNews.join('\n')}` : ''}
      
      Provide:
      1. Overall sentiment score (-100 to +100)
      2. Key sentiment drivers
      3. Sector-specific factors
      4. Comparison with sector sentiment
      5. Short-term outlook
      6. Potential impact on financial performance
      7. Risk factors from sentiment analysis
      
      Format as JSON with quantitative scores and qualitative insights.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { sentiment: text };
  } catch (error) {
    console.error('Gemini sentiment analysis error:', error);
    throw error;
  }
}
