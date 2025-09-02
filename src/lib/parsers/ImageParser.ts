import { ParsedFinancialData, ParseOptions } from './FileParser';
import { FinancialStatement } from '@/lib/types';
import { analyzeFinancialDocument } from '../api/gemini';

export class ImageParser {
  /**
   * Parse image file and extract financial data using OCR
   */
  async parse(
    fileBuffer: Buffer,
    fileName: string,
    options: ParseOptions = {}
  ): Promise<ParsedFinancialData> {
    try {
      // Determine MIME type from file extension
      const mimeType = this.getMimeType(fileName);
      
      if (!mimeType) {
        throw new Error('Unsupported image format');
      }

      // Use Gemini to analyze the image and extract financial data
      const aiResult = await analyzeFinancialDocument(fileBuffer, mimeType);
      
      if (!aiResult.success) {
        throw new Error(aiResult.error || 'AI analysis failed');
      }

      // Parse the AI result into structured data
      const financialData = this.parseAIResult(aiResult.data?.analysis_result);
      
      return {
        success: true,
        data: financialData,
        metadata: {
          fileName,
          fileType: 'image',
          fileSize: fileBuffer.length,
          pages: 1, // Images are typically single page
          extractedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Image parsing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Image parsing failed',
        metadata: {
          fileName,
          fileType: 'image',
          fileSize: fileBuffer.length,
          extractedAt: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(fileName: string): string | null {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'webp': 'image/webp'
    };

    return mimeTypes[extension || ''] || null;
  }

  /**
   * Parse AI analysis result into structured financial data
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
    const yearMatch = text.match(/(?:year|عام|سنة|fiscal year)[\s:]*(\d{4})/i);
    return yearMatch ? parseInt(yearMatch[1]) : null;
  }

  /**
   * Extract currency from text
   */
  private extractCurrency(text: string): string | null {
    const currencyMatch = text.match(/(?:currency|عملة)[\s:]*([A-Z]{3}|Saudi Riyal|ريال سعودي|SAR)/i);
    if (currencyMatch) {
      const currency = currencyMatch[1];
      if (currency.includes('Saudi') || currency.includes('سعودي') || currency === 'SAR') {
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
    const nameMatch = text.match(/(?:company|شركة|report|تقرير)[\s:]*([^\n\r]+)/i);
    return nameMatch ? nameMatch[1].trim() : null;
  }

  /**
   * Extract income statement data from text
   */
  private extractIncomeStatement(text: string): any {
    const incomeStatement: any = {};
    
    // Extract revenue
    const revenueMatch = text.match(/(?:revenue|إيرادات|المبيعات|sales)[\s:]*([\d,]+)/i);
    if (revenueMatch) incomeStatement.revenue = this.parseNumber(revenueMatch[1]);

    // Extract cost of goods sold
    const cogsMatch = text.match(/(?:cost of goods sold|تكلفة البضاعة المباعة|cogs)[\s:]*([\d,]+)/i);
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
    const netIncMatch = text.match(/(?:net income|صافي الربح|net profit)[\s:]*([\d,]+)/i);
    if (netIncMatch) incomeStatement.netIncome = this.parseNumber(netIncMatch[1]);

    // Extract EBITDA
    const ebitdaMatch = text.match(/(?:ebitda|إيبيدا)[\s:]*([\d,]+)/i);
    if (ebitdaMatch) incomeStatement.ebitda = this.parseNumber(ebitdaMatch[1]);

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
    const cashMatch = text.match(/(?:cash|النقد|cash and cash equivalents)[\s:]*([\d,]+)/i);
    if (cashMatch) balanceSheet.cash = this.parseNumber(cashMatch[1]);

    // Extract accounts receivable
    const arMatch = text.match(/(?:accounts receivable|الذمم المدينة|receivables)[\s:]*([\d,]+)/i);
    if (arMatch) balanceSheet.accountsReceivable = this.parseNumber(arMatch[1]);

    // Extract inventory
    const inventoryMatch = text.match(/(?:inventory|المخزون)[\s:]*([\d,]+)/i);
    if (inventoryMatch) balanceSheet.inventory = this.parseNumber(inventoryMatch[1]);

    // Extract property, plant & equipment
    const ppeMatch = text.match(/(?:property plant equipment|المباني والمعدات|ppe)[\s:]*([\d,]+)/i);
    if (ppeMatch) balanceSheet.propertyPlantEquipment = this.parseNumber(ppeMatch[1]);

    // Extract total assets
    const totalAssetsMatch = text.match(/(?:total assets|إجمالي الأصول)[\s:]*([\d,]+)/i);
    if (totalAssetsMatch) balanceSheet.totalAssets = this.parseNumber(totalAssetsMatch[1]);

    // Extract current liabilities
    const currLiabMatch = text.match(/(?:current liabilities|الالتزامات المتداولة)[\s:]*([\d,]+)/i);
    if (currLiabMatch) balanceSheet.currentLiabilities = this.parseNumber(currLiabMatch[1]);

    // Extract accounts payable
    const apMatch = text.match(/(?:accounts payable|الذمم الدائنة|payables)[\s:]*([\d,]+)/i);
    if (apMatch) balanceSheet.accountsPayable = this.parseNumber(apMatch[1]);

    // Extract long-term debt
    const ltdMatch = text.match(/(?:long.?term debt|الديون طويلة الأجل|long term debt)[\s:]*([\d,]+)/i);
    if (ltdMatch) balanceSheet.longTermDebt = this.parseNumber(ltdMatch[1]);

    // Extract total liabilities
    const totalLiabMatch = text.match(/(?:total liabilities|إجمالي الالتزامات)[\s:]*([\d,]+)/i);
    if (totalLiabMatch) balanceSheet.totalLiabilities = this.parseNumber(totalLiabMatch[1]);

    // Extract shareholders equity
    const equityMatch = text.match(/(?:shareholders.?equity|حقوق الملكية|equity)[\s:]*([\d,]+)/i);
    if (equityMatch) balanceSheet.shareholdersEquity = this.parseNumber(equityMatch[1]);

    // Extract share capital
    const shareCapMatch = text.match(/(?:share capital|رأس المال|capital)[\s:]*([\d,]+)/i);
    if (shareCapMatch) balanceSheet.shareCapital = this.parseNumber(shareCapMatch[1]);

    // Extract retained earnings
    const reMatch = text.match(/(?:retained earnings|الأرباح المحتجزة)[\s:]*([\d,]+)/i);
    if (reMatch) balanceSheet.retainedEarnings = this.parseNumber(reMatch[1]);

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

    // Extract capital expenditures
    const capexMatch = text.match(/(?:capital expenditures|النفقات الرأسمالية|capex)[\s:]*([\d,]+)/i);
    if (capexMatch) cashFlow.capitalExpenditures = this.parseNumber(capexMatch[1]);

    // Extract dividends paid
    const divMatch = text.match(/(?:dividends paid|الأرباح المدفوعة|dividends)[\s:]*([\d,]+)/i);
    if (divMatch) cashFlow.dividendsPaid = this.parseNumber(divMatch[1]);

    return cashFlow;
  }

  /**
   * Parse number from string
   */
  private parseNumber(value: string): number {
    // Remove common formatting and currency symbols
    const cleaned = value.replace(/[,\s]/g, '').replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Validate image format
   */
  private isValidImageFormat(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const validFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'];
    return validFormats.includes(extension || '');
  }

  /**
   * Get image dimensions (mock implementation)
   */
  private getImageDimensions(buffer: Buffer): { width: number; height: number } {
    // Mock implementation - in production, use image processing library
    // This is a rough estimate based on file size
    const sizeInKB = buffer.length / 1024;
    const estimatedWidth = Math.round(Math.sqrt(sizeInKB * 100));
    const estimatedHeight = Math.round(estimatedWidth * 0.75); // Assume 4:3 aspect ratio
    
    return {
      width: Math.max(100, estimatedWidth),
      height: Math.max(100, estimatedHeight)
    };
  }
}
