import { FinancialStatement } from '@/lib/types';
import { PDFParser } from './PDFParser';
import { ExcelParser } from './ExcelParser';
import { WordParser } from './WordParser';
import { ImageParser } from './ImageParser';
import { CSVParser } from './CSVParser';

export interface ParsedFinancialData {
  success: boolean;
  data?: FinancialStatement[];
  error?: string;
  metadata?: {
    fileName: string;
    fileType: string;
    fileSize: number;
    pages?: number;
    extractedAt: string;
  };
}

export interface ParseOptions {
  language?: 'ar' | 'en';
  currency?: string;
  year?: number;
  companyName?: string;
  extractImages?: boolean;
  ocrEnabled?: boolean;
}

export class FileParser {
  private static instance: FileParser;
  private pdfParser: PDFParser;
  private excelParser: ExcelParser;
  private wordParser: WordParser;
  private imageParser: ImageParser;
  private csvParser: CSVParser;

  private constructor() {
    this.pdfParser = new PDFParser();
    this.excelParser = new ExcelParser();
    this.wordParser = new WordParser();
    this.imageParser = new ImageParser();
    this.csvParser = new CSVParser();
  }

  public static getInstance(): FileParser {
    if (!FileParser.instance) {
      FileParser.instance = new FileParser();
    }
    return FileParser.instance;
  }

  /**
   * Parse file based on its type
   */
  async parseFile(
    file: File | Buffer,
    fileName: string,
    options: ParseOptions = {}
  ): Promise<ParsedFinancialData> {
    try {
      const fileType = this.getFileType(fileName);
      const fileBuffer = file instanceof File ? await this.fileToBuffer(file) : file;

      let result: ParsedFinancialData;

      switch (fileType) {
        case 'pdf':
          result = await this.pdfParser.parse(fileBuffer, fileName, options);
          break;
        case 'excel':
          result = await this.excelParser.parse(fileBuffer, fileName, options);
          break;
        case 'word':
          result = await this.wordParser.parse(fileBuffer, fileName, options);
          break;
        case 'image':
          result = await this.imageParser.parse(fileBuffer, fileName, options);
          break;
        case 'csv':
          result = await this.csvParser.parse(fileBuffer, fileName, options);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      return {
        ...result,
        metadata: {
          ...result.metadata,
          extractedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('File parsing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown parsing error',
        metadata: {
          fileName,
          fileType: this.getFileType(fileName),
          fileSize: file instanceof File ? file.size : file.length,
          extractedAt: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Parse multiple files
   */
  async parseMultipleFiles(
    files: Array<{ file: File | Buffer; fileName: string }>,
    options: ParseOptions = {}
  ): Promise<ParsedFinancialData[]> {
    const results = await Promise.allSettled(
      files.map(({ file, fileName }) => this.parseFile(file, fileName, options))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
          metadata: {
            fileName: files[index].fileName,
            fileType: this.getFileType(files[index].fileName),
            fileSize: 0,
            extractedAt: new Date().toISOString()
          }
        };
      }
    });
  }

  /**
   * Get file type from file name
   */
  private getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const typeMap: { [key: string]: string } = {
      'pdf': 'pdf',
      'xlsx': 'excel',
      'xls': 'excel',
      'docx': 'word',
      'doc': 'word',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'bmp': 'image',
      'tiff': 'image',
      'csv': 'csv',
      'txt': 'text'
    };

    return typeMap[extension || ''] || 'unknown';
  }

  /**
   * Convert File to Buffer
   */
  private async fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Validate financial data structure
   */
  validateFinancialData(data: any): boolean {
    try {
      // Basic validation for financial statement structure
      if (!data || typeof data !== 'object') return false;
      
      // Check for required financial statement sections
      const hasIncomeStatement = data.incomeStatement && 
        typeof data.incomeStatement === 'object';
      const hasBalanceSheet = data.balanceSheet && 
        typeof data.balanceSheet === 'object';
      const hasCashFlow = data.cashFlowStatement && 
        typeof data.cashFlowStatement === 'object';

      return hasIncomeStatement || hasBalanceSheet || hasCashFlow;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clean and normalize financial data
   */
  cleanFinancialData(data: any): FinancialStatement {
    const cleaned: FinancialStatement = {
      period: data.period || new Date().getFullYear(),
      currency: data.currency || 'SAR',
      companyName: data.companyName || 'Unknown Company',
      incomeStatement: this.cleanIncomeStatement(data.incomeStatement || {}),
      balanceSheet: this.cleanBalanceSheet(data.balanceSheet || {}),
      cashFlowStatement: this.cleanCashFlowStatement(data.cashFlowStatement || {}),
      notes: data.notes || []
    };

    return cleaned;
  }

  private cleanIncomeStatement(data: any): any {
    return {
      revenue: this.parseNumber(data.revenue),
      costOfGoodsSold: this.parseNumber(data.costOfGoodsSold),
      grossProfit: this.parseNumber(data.grossProfit),
      operatingExpenses: this.parseNumber(data.operatingExpenses),
      operatingIncome: this.parseNumber(data.operatingIncome),
      interestExpense: this.parseNumber(data.interestExpense),
      interestIncome: this.parseNumber(data.interestIncome),
      otherIncome: this.parseNumber(data.otherIncome),
      otherExpenses: this.parseNumber(data.otherExpenses),
      incomeBeforeTax: this.parseNumber(data.incomeBeforeTax),
      taxExpense: this.parseNumber(data.taxExpense),
      netIncome: this.parseNumber(data.netIncome),
      depreciation: this.parseNumber(data.depreciation),
      amortization: this.parseNumber(data.amortization),
      ebitda: this.parseNumber(data.ebitda)
    };
  }

  private cleanBalanceSheet(data: any): any {
    return {
      // Assets
      currentAssets: this.parseNumber(data.currentAssets),
      cash: this.parseNumber(data.cash),
      marketableSecurities: this.parseNumber(data.marketableSecurities),
      accountsReceivable: this.parseNumber(data.accountsReceivable),
      inventory: this.parseNumber(data.inventory),
      otherCurrentAssets: this.parseNumber(data.otherCurrentAssets),
      
      nonCurrentAssets: this.parseNumber(data.nonCurrentAssets),
      propertyPlantEquipment: this.parseNumber(data.propertyPlantEquipment),
      intangibleAssets: this.parseNumber(data.intangibleAssets),
      goodwill: this.parseNumber(data.goodwill),
      otherNonCurrentAssets: this.parseNumber(data.otherNonCurrentAssets),
      
      totalAssets: this.parseNumber(data.totalAssets),
      
      // Liabilities
      currentLiabilities: this.parseNumber(data.currentLiabilities),
      accountsPayable: this.parseNumber(data.accountsPayable),
      shortTermDebt: this.parseNumber(data.shortTermDebt),
      otherCurrentLiabilities: this.parseNumber(data.otherCurrentLiabilities),
      
      nonCurrentLiabilities: this.parseNumber(data.nonCurrentLiabilities),
      longTermDebt: this.parseNumber(data.longTermDebt),
      otherNonCurrentLiabilities: this.parseNumber(data.otherNonCurrentLiabilities),
      
      totalLiabilities: this.parseNumber(data.totalLiabilities),
      
      // Equity
      shareholdersEquity: this.parseNumber(data.shareholdersEquity),
      shareCapital: this.parseNumber(data.shareCapital),
      retainedEarnings: this.parseNumber(data.retainedEarnings),
      otherEquity: this.parseNumber(data.otherEquity),
      sharesOutstanding: this.parseNumber(data.sharesOutstanding)
    };
  }

  private cleanCashFlowStatement(data: any): any {
    return {
      operatingCashFlow: this.parseNumber(data.operatingCashFlow),
      investingCashFlow: this.parseNumber(data.investingCashFlow),
      financingCashFlow: this.parseNumber(data.financingCashFlow),
      netCashFlow: this.parseNumber(data.netCashFlow),
      beginningCash: this.parseNumber(data.beginningCash),
      endingCash: this.parseNumber(data.endingCash),
      capitalExpenditures: this.parseNumber(data.capitalExpenditures),
      dividendsPaid: this.parseNumber(data.dividendsPaid),
      stockRepurchases: this.parseNumber(data.stockRepurchases)
    };
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remove common formatting
      const cleaned = value.replace(/[,\s]/g, '').replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
}

// Export singleton instance
export const fileParser = FileParser.getInstance();
