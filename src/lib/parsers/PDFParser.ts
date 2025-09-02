import { ParsedFinancialData, ParseOptions } from './FileParser';
import { FinancialStatement } from '@/lib/types';
import { extractFinancialDataFromText } from '../api/openai';
import { analyzeFinancialDocument } from '../api/gemini';

export class PDFParser {
  /**
   * Parse PDF file and extract financial data
   */
  async parse(
    fileBuffer: Buffer,
    fileName: string,
    options: ParseOptions = {}
  ): Promise<ParsedFinancialData> {
    try {
      // For now, we'll use a mock implementation
      // In a real implementation, you would use libraries like pdf-parse or pdf2pic
      const extractedText = await this.extractTextFromPDF(fileBuffer);
      
      if (!extractedText) {
        throw new Error('Failed to extract text from PDF');
      }

      // Use AI to extract and structure financial data
      const aiResult = await extractFinancialDataFromText(extractedText, 'financial_statement');
      
      if (!aiResult.success) {
        throw new Error(aiResult.error || 'AI extraction failed');
      }

      // Parse the AI result into structured data
      const financialData = this.parseAIResult(aiResult.data?.extracted_data);
      
      return {
        success: true,
        data: financialData,
        metadata: {
          fileName,
          fileType: 'pdf',
          fileSize: fileBuffer.length,
          pages: this.estimatePages(fileBuffer),
          extractedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('PDF parsing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF parsing failed',
        metadata: {
          fileName,
          fileType: 'pdf',
          fileSize: fileBuffer.length,
          extractedAt: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Extract text from PDF buffer
   * This is a mock implementation - in production, use pdf-parse or similar
   */
  private async extractTextFromPDF(buffer: Buffer): Promise<string> {
    // Mock implementation - replace with actual PDF parsing library
    // Example with pdf-parse:
    // const pdf = require('pdf-parse');
    // const data = await pdf(buffer);
    // return data.text;
    
    // For now, return mock text
    return `
    Financial Statement - Sample Company
    Year: 2023
    Currency: SAR
    
    Income Statement:
    Revenue: 1,000,000
    Cost of Goods Sold: 600,000
    Gross Profit: 400,000
    Operating Expenses: 200,000
    Operating Income: 200,000
    Interest Expense: 10,000
    Net Income: 150,000
    
    Balance Sheet:
    Current Assets: 500,000
    Cash: 100,000
    Accounts Receivable: 200,000
    Inventory: 200,000
    Total Assets: 1,000,000
    Current Liabilities: 300,000
    Long-term Debt: 200,000
    Shareholders Equity: 500,000
    `;
  }

  /**
   * Parse AI extraction result into structured financial data
   */
  private parseAIResult(aiData: string): FinancialStatement[] {
    try {
      // Try to parse as JSON first
      if (aiData.startsWith('{') || aiData.startsWith('[')) {
        const parsed = JSON.parse(aiData);
        return Array.isArray(parsed) ? parsed : [parsed];
      }

      // If not JSON, create a basic structure from the text
      const financialStatement: FinancialStatement = {
        period: this.extractYear(aiData) || new Date().getFullYear(),
        currency: this.extractCurrency(aiData) || 'SAR',
        companyName: this.extractCompanyName(aiData) || 'Unknown Company',
        incomeStatement: this.extractIncomeStatement(aiData),
        balanceSheet: this.extractBalanceSheet(aiData),
        cashFlowStatement: this.extractCashFlowStatement(aiData),
        notes: []
      };

      return [financialStatement];
    } catch (error) {
      console.error('Error parsing AI result:', error);
      // Return empty structure if parsing fails
      return [{
        period: new Date().getFullYear(),
        currency: 'SAR',
        companyName: 'Unknown Company',
        incomeStatement: {},
        balanceSheet: {},
        cashFlowStatement: {},
        notes: []
      }];
    }
  }

  /**
   * Extract year from text
   */
  private extractYear(text: string): number | null {
    const yearMatch = text.match(/(?:year|عام|سنة)[\s:]*(\d{4})/i);
    return yearMatch ? parseInt(yearMatch[1]) : null;
  }

  /**
   * Extract currency from text
   */
  private extractCurrency(text: string): string | null {
    const currencyMatch = text.match(/(?:currency|عملة)[\s:]*([A-Z]{3})/i);
    return currencyMatch ? currencyMatch[1] : null;
  }

  /**
   * Extract company name from text
   */
  private extractCompanyName(text: string): string | null {
    const nameMatch = text.match(/(?:company|شركة)[\s:]*([^\n\r]+)/i);
    return nameMatch ? nameMatch[1].trim() : null;
  }

  /**
   * Extract income statement data from text
   */
  private extractIncomeStatement(text: string): any {
    const incomeStatement: any = {};
    
    // Extract revenue
    const revenueMatch = text.match(/(?:revenue|إيرادات|المبيعات)[\s:]*([\d,]+)/i);
    if (revenueMatch) incomeStatement.revenue = this.parseNumber(revenueMatch[1]);

    // Extract cost of goods sold
    const cogsMatch = text.match(/(?:cost of goods sold|تكلفة البضاعة المباعة)[\s:]*([\d,]+)/i);
    if (cogsMatch) incomeStatement.costOfGoodsSold = this.parseNumber(cogsMatch[1]);

    // Extract gross profit
    const grossProfitMatch = text.match(/(?:gross profit|الربح الإجمالي)[\s:]*([\d,]+)/i);
    if (grossProfitMatch) incomeStatement.grossProfit = this.parseNumber(grossProfitMatch[1]);

    // Extract operating expenses
    const opExpMatch = text.match(/(?:operating expenses|المصروفات التشغيلية)[\s:]*([\d,]+)/i);
    if (opExpMatch) incomeStatement.operatingExpenses = this.parseNumber(opExpMatch[1]);

    // Extract operating income
    const opIncMatch = text.match(/(?:operating income|الدخل التشغيلي)[\s:]*([\d,]+)/i);
    if (opIncMatch) incomeStatement.operatingIncome = this.parseNumber(opIncMatch[1]);

    // Extract interest expense
    const intExpMatch = text.match(/(?:interest expense|مصروفات الفوائد)[\s:]*([\d,]+)/i);
    if (intExpMatch) incomeStatement.interestExpense = this.parseNumber(intExpMatch[1]);

    // Extract net income
    const netIncMatch = text.match(/(?:net income|صافي الربح)[\s:]*([\d,]+)/i);
    if (netIncMatch) incomeStatement.netIncome = this.parseNumber(netIncMatch[1]);

    return incomeStatement;
  }

  /**
   * Extract balance sheet data from text
   */
  private extractBalanceSheet(text: string): any {
    const balanceSheet: any = {};
    
    // Extract current assets
    const currAssetsMatch = text.match(/(?:current assets|الأصول المتداولة)[\s:]*([\d,]+)/i);
    if (currAssetsMatch) balanceSheet.currentAssets = this.parseNumber(currAssetsMatch[1]);

    // Extract cash
    const cashMatch = text.match(/(?:cash|النقد)[\s:]*([\d,]+)/i);
    if (cashMatch) balanceSheet.cash = this.parseNumber(cashMatch[1]);

    // Extract accounts receivable
    const arMatch = text.match(/(?:accounts receivable|الذمم المدينة)[\s:]*([\d,]+)/i);
    if (arMatch) balanceSheet.accountsReceivable = this.parseNumber(arMatch[1]);

    // Extract inventory
    const inventoryMatch = text.match(/(?:inventory|المخزون)[\s:]*([\d,]+)/i);
    if (inventoryMatch) balanceSheet.inventory = this.parseNumber(inventoryMatch[1]);

    // Extract total assets
    const totalAssetsMatch = text.match(/(?:total assets|إجمالي الأصول)[\s:]*([\d,]+)/i);
    if (totalAssetsMatch) balanceSheet.totalAssets = this.parseNumber(totalAssetsMatch[1]);

    // Extract current liabilities
    const currLiabMatch = text.match(/(?:current liabilities|الالتزامات المتداولة)[\s:]*([\d,]+)/i);
    if (currLiabMatch) balanceSheet.currentLiabilities = this.parseNumber(currLiabMatch[1]);

    // Extract long-term debt
    const ltdMatch = text.match(/(?:long.?term debt|الديون طويلة الأجل)[\s:]*([\d,]+)/i);
    if (ltdMatch) balanceSheet.longTermDebt = this.parseNumber(ltdMatch[1]);

    // Extract shareholders equity
    const equityMatch = text.match(/(?:shareholders equity|حقوق الملكية)[\s:]*([\d,]+)/i);
    if (equityMatch) balanceSheet.shareholdersEquity = this.parseNumber(equityMatch[1]);

    return balanceSheet;
  }

  /**
   * Extract cash flow statement data from text
   */
  private extractCashFlowStatement(text: string): any {
    const cashFlow: any = {};
    
    // Extract operating cash flow
    const opCfMatch = text.match(/(?:operating cash flow|التدفق النقدي التشغيلي)[\s:]*([\d,]+)/i);
    if (opCfMatch) cashFlow.operatingCashFlow = this.parseNumber(opCfMatch[1]);

    // Extract investing cash flow
    const invCfMatch = text.match(/(?:investing cash flow|التدفق النقدي الاستثماري)[\s:]*([\d,]+)/i);
    if (invCfMatch) cashFlow.investingCashFlow = this.parseNumber(invCfMatch[1]);

    // Extract financing cash flow
    const finCfMatch = text.match(/(?:financing cash flow|التدفق النقدي التمويلي)[\s:]*([\d,]+)/i);
    if (finCfMatch) cashFlow.financingCashFlow = this.parseNumber(finCfMatch[1]);

    return cashFlow;
  }

  /**
   * Parse number from string
   */
  private parseNumber(value: string): number {
    const cleaned = value.replace(/[,\s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Estimate number of pages in PDF
   */
  private estimatePages(buffer: Buffer): number {
    // Mock implementation - in production, use actual PDF parsing
    // This is a rough estimate based on file size
    const sizeInMB = buffer.length / (1024 * 1024);
    return Math.max(1, Math.round(sizeInMB * 2));
  }
}
