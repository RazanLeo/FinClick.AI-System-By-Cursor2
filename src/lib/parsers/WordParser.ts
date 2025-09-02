import { ParsedFinancialData, ParseOptions } from './FileParser';
import { FinancialStatement } from '@/lib/types';
import { extractFinancialDataFromText } from '../api/openai';

export class WordParser {
  /**
   * Parse Word document and extract financial data
   */
  async parse(
    fileBuffer: Buffer,
    fileName: string,
    options: ParseOptions = {}
  ): Promise<ParsedFinancialData> {
    try {
      // Extract text from Word document
      const extractedText = await this.extractTextFromWord(fileBuffer);
      
      if (!extractedText) {
        throw new Error('Failed to extract text from Word document');
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
          fileType: 'word',
          fileSize: fileBuffer.length,
          pages: this.estimatePages(fileBuffer),
          extractedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Word parsing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Word parsing failed',
        metadata: {
          fileName,
          fileType: 'word',
          fileSize: fileBuffer.length,
          extractedAt: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Extract text from Word document buffer
   * This is a mock implementation - in production, use mammoth or similar
   */
  private async extractTextFromWord(buffer: Buffer): Promise<string> {
    // Mock implementation - replace with actual Word parsing library
    // Example with mammoth:
    // const mammoth = require('mammoth');
    // const result = await mammoth.extractRawText({ buffer });
    // return result.value;
    
    // For now, return mock text
    return `
    Financial Report - Sample Company
    Fiscal Year: 2023
    Currency: Saudi Riyal (SAR)
    
    EXECUTIVE SUMMARY
    The company has shown strong performance in 2023 with significant growth in revenue and profitability.
    
    INCOME STATEMENT
    Revenue: 2,500,000 SAR
    Cost of Goods Sold: 1,500,000 SAR
    Gross Profit: 1,000,000 SAR
    Operating Expenses: 400,000 SAR
    Operating Income: 600,000 SAR
    Interest Expense: 25,000 SAR
    Net Income: 450,000 SAR
    
    BALANCE SHEET
    ASSETS
    Current Assets: 800,000 SAR
    - Cash and Cash Equivalents: 200,000 SAR
    - Accounts Receivable: 300,000 SAR
    - Inventory: 300,000 SAR
    
    Non-Current Assets: 1,200,000 SAR
    - Property, Plant & Equipment: 1,000,000 SAR
    - Intangible Assets: 200,000 SAR
    
    Total Assets: 2,000,000 SAR
    
    LIABILITIES AND EQUITY
    Current Liabilities: 400,000 SAR
    - Accounts Payable: 200,000 SAR
    - Short-term Debt: 200,000 SAR
    
    Non-Current Liabilities: 600,000 SAR
    - Long-term Debt: 600,000 SAR
    
    Total Liabilities: 1,000,000 SAR
    
    Shareholders' Equity: 1,000,000 SAR
    - Share Capital: 500,000 SAR
    - Retained Earnings: 500,000 SAR
    
    CASH FLOW STATEMENT
    Operating Cash Flow: 500,000 SAR
    Investing Cash Flow: -200,000 SAR
    Financing Cash Flow: -100,000 SAR
    Net Cash Flow: 200,000 SAR
    
    NOTES TO FINANCIAL STATEMENTS
    1. The company follows International Financial Reporting Standards (IFRS)
    2. All amounts are in Saudi Riyals unless otherwise stated
    3. The financial statements are prepared on a going concern basis
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
        notes: this.extractNotes(aiData)
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
    const yearMatch = text.match(/(?:year|عام|سنة|fiscal year)[\s:]*(\d{4})/i);
    return yearMatch ? parseInt(yearMatch[1]) : null;
  }

  /**
   * Extract currency from text
   */
  private extractCurrency(text: string): string | null {
    const currencyMatch = text.match(/(?:currency|عملة)[\s:]*([A-Z]{3}|Saudi Riyal|ريال سعودي)/i);
    if (currencyMatch) {
      const currency = currencyMatch[1];
      if (currency.includes('Saudi') || currency.includes('سعودي')) {
        return 'SAR';
      }
      return currency.toUpperCase();
    }
    return null;
  }

  /**
   * Extract company name from text
   */
  private extractCompanyName(text: string): string | null {
    const nameMatch = text.match(/(?:company|شركة|report)[\s:]*([^\n\r]+)/i);
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
    const equityMatch = text.match(/(?:shareholders.?equity|حقوق الملكية)[\s:]*([\d,]+)/i);
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

    // Extract net cash flow
    const netCfMatch = text.match(/(?:net cash flow|صافي التدفق النقدي)[\s:]*([\d,]+)/i);
    if (netCfMatch) cashFlow.netCashFlow = this.parseNumber(netCfMatch[1]);

    return cashFlow;
  }

  /**
   * Extract notes from text
   */
  private extractNotes(text: string): string[] {
    const notes: string[] = [];
    
    // Look for notes section
    const notesMatch = text.match(/(?:notes|ملاحظات)[\s\S]*?(?=\n\n|\n[A-Z]|$)/i);
    if (notesMatch) {
      const notesText = notesMatch[0];
      const noteLines = notesText.split('\n').filter(line => 
        line.trim() && 
        !line.match(/^(notes|ملاحظات)/i) &&
        line.match(/\d+\./)
      );
      
      notes.push(...noteLines.map(line => line.trim()));
    }
    
    return notes;
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
   * Estimate number of pages in Word document
   */
  private estimatePages(buffer: Buffer): number {
    // Mock implementation - in production, use actual Word parsing
    // This is a rough estimate based on file size
    const sizeInMB = buffer.length / (1024 * 1024);
    return Math.max(1, Math.round(sizeInMB * 3));
  }
}
