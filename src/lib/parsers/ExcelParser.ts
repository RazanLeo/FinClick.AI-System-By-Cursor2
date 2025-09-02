import { ParsedFinancialData, ParseOptions } from './FileParser';
import { FinancialStatement } from '@/lib/types';
import * as XLSX from 'xlsx';

export class ExcelParser {
  /**
   * Parse Excel file and extract financial data
   */
  async parse(
    fileBuffer: Buffer,
    fileName: string,
    options: ParseOptions = {}
  ): Promise<ParsedFinancialData> {
    try {
      // Parse Excel file
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('No sheets found in Excel file');
      }

      const financialData: FinancialStatement[] = [];
      
      // Process each sheet
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const parsedSheet = this.parseSheet(sheetData, sheetName, options);
        if (parsedSheet) {
          financialData.push(parsedSheet);
        }
      }

      if (financialData.length === 0) {
        throw new Error('No financial data found in Excel file');
      }

      return {
        success: true,
        data: financialData,
        metadata: {
          fileName,
          fileType: 'excel',
          fileSize: fileBuffer.length,
          pages: workbook.SheetNames.length,
          extractedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Excel parsing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Excel parsing failed',
        metadata: {
          fileName,
          fileType: 'excel',
          fileSize: fileBuffer.length,
          extractedAt: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Parse individual sheet data
   */
  private parseSheet(
    sheetData: any[][],
    sheetName: string,
    options: ParseOptions
  ): FinancialStatement | null {
    try {
      // Detect sheet type and parse accordingly
      const sheetType = this.detectSheetType(sheetData, sheetName);
      
      switch (sheetType) {
        case 'income_statement':
          return this.parseIncomeStatementSheet(sheetData, options);
        case 'balance_sheet':
          return this.parseBalanceSheetSheet(sheetData, options);
        case 'cash_flow':
          return this.parseCashFlowSheet(sheetData, options);
        case 'combined':
          return this.parseCombinedSheet(sheetData, options);
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error parsing sheet ${sheetName}:`, error);
      return null;
    }
  }

  /**
   * Detect the type of financial statement sheet
   */
  private detectSheetType(sheetData: any[][], sheetName: string): string {
    const name = sheetName.toLowerCase();
    const data = sheetData.flat().join(' ').toLowerCase();
    
    // Check sheet name
    if (name.includes('income') || name.includes('profit') || name.includes('p&l') || name.includes('دخل')) {
      return 'income_statement';
    }
    if (name.includes('balance') || name.includes('position') || name.includes('ميزانية')) {
      return 'balance_sheet';
    }
    if (name.includes('cash') || name.includes('flow') || name.includes('نقد')) {
      return 'cash_flow';
    }
    
    // Check content
    if (data.includes('revenue') || data.includes('sales') || data.includes('إيرادات') || data.includes('مبيعات')) {
      return 'income_statement';
    }
    if (data.includes('assets') || data.includes('liabilities') || data.includes('أصول') || data.includes('التزامات')) {
      return 'balance_sheet';
    }
    if (data.includes('operating cash flow') || data.includes('التدفق النقدي')) {
      return 'cash_flow';
    }
    
    // If multiple types detected, return combined
    const types = [];
    if (data.includes('revenue') || data.includes('إيرادات')) types.push('income');
    if (data.includes('assets') || data.includes('أصول')) types.push('balance');
    if (data.includes('cash flow') || data.includes('تدفق نقدي')) types.push('cash');
    
    return types.length > 1 ? 'combined' : 'unknown';
  }

  /**
   * Parse income statement sheet
   */
  private parseIncomeStatementSheet(
    sheetData: any[][],
    options: ParseOptions
  ): FinancialStatement {
    const incomeStatement: any = {};
    const period = this.extractPeriod(sheetData) || options.year || new Date().getFullYear();
    const companyName = this.extractCompanyName(sheetData) || options.companyName || 'Unknown Company';
    const currency = options.currency || 'SAR';

    // Find data rows
    const dataRows = this.findDataRows(sheetData);
    
    for (const row of dataRows) {
      const label = this.cleanLabel(row[0]);
      const value = this.parseValue(row[1]);
      
      if (value !== null) {
        // Map common income statement items
        const mapping = this.getIncomeStatementMapping();
        const mappedKey = mapping[label];
        if (mappedKey) {
          incomeStatement[mappedKey] = value;
        }
      }
    }

    return {
      period,
      currency,
      companyName,
      incomeStatement,
      balanceSheet: {},
      cashFlowStatement: {},
      notes: []
    };
  }

  /**
   * Parse balance sheet sheet
   */
  private parseBalanceSheetSheet(
    sheetData: any[][],
    options: ParseOptions
  ): FinancialStatement {
    const balanceSheet: any = {};
    const period = this.extractPeriod(sheetData) || options.year || new Date().getFullYear();
    const companyName = this.extractCompanyName(sheetData) || options.companyName || 'Unknown Company';
    const currency = options.currency || 'SAR';

    // Find data rows
    const dataRows = this.findDataRows(sheetData);
    
    for (const row of dataRows) {
      const label = this.cleanLabel(row[0]);
      const value = this.parseValue(row[1]);
      
      if (value !== null) {
        // Map common balance sheet items
        const mapping = this.getBalanceSheetMapping();
        const mappedKey = mapping[label];
        if (mappedKey) {
          balanceSheet[mappedKey] = value;
        }
      }
    }

    return {
      period,
      currency,
      companyName,
      incomeStatement: {},
      balanceSheet,
      cashFlowStatement: {},
      notes: []
    };
  }

  /**
   * Parse cash flow statement sheet
   */
  private parseCashFlowSheet(
    sheetData: any[][],
    options: ParseOptions
  ): FinancialStatement {
    const cashFlowStatement: any = {};
    const period = this.extractPeriod(sheetData) || options.year || new Date().getFullYear();
    const companyName = this.extractCompanyName(sheetData) || options.companyName || 'Unknown Company';
    const currency = options.currency || 'SAR';

    // Find data rows
    const dataRows = this.findDataRows(sheetData);
    
    for (const row of dataRows) {
      const label = this.cleanLabel(row[0]);
      const value = this.parseValue(row[1]);
      
      if (value !== null) {
        // Map common cash flow items
        const mapping = this.getCashFlowMapping();
        const mappedKey = mapping[label];
        if (mappedKey) {
          cashFlowStatement[mappedKey] = value;
        }
      }
    }

    return {
      period,
      currency,
      companyName,
      incomeStatement: {},
      balanceSheet: {},
      cashFlowStatement,
      notes: []
    };
  }

  /**
   * Parse combined financial statements sheet
   */
  private parseCombinedSheet(
    sheetData: any[][],
    options: ParseOptions
  ): FinancialStatement {
    const incomeStatement: any = {};
    const balanceSheet: any = {};
    const cashFlowStatement: any = {};
    
    const period = this.extractPeriod(sheetData) || options.year || new Date().getFullYear();
    const companyName = this.extractCompanyName(sheetData) || options.companyName || 'Unknown Company';
    const currency = options.currency || 'SAR';

    // Find data rows
    const dataRows = this.findDataRows(sheetData);
    
    for (const row of dataRows) {
      const label = this.cleanLabel(row[0]);
      const value = this.parseValue(row[1]);
      
      if (value !== null) {
        // Try to map to all statement types
        const incomeMapping = this.getIncomeStatementMapping();
        const balanceMapping = this.getBalanceSheetMapping();
        const cashFlowMapping = this.getCashFlowMapping();
        
        if (incomeMapping[label]) {
          incomeStatement[incomeMapping[label]] = value;
        }
        if (balanceMapping[label]) {
          balanceSheet[balanceMapping[label]] = value;
        }
        if (cashFlowMapping[label]) {
          cashFlowStatement[cashFlowMapping[label]] = value;
        }
      }
    }

    return {
      period,
      currency,
      companyName,
      incomeStatement,
      balanceSheet,
      cashFlowStatement,
      notes: []
    };
  }

  /**
   * Find rows containing financial data
   */
  private findDataRows(sheetData: any[][]): any[][] {
    const dataRows: any[][] = [];
    
    for (const row of sheetData) {
      if (row && row.length >= 2) {
        const label = row[0];
        const value = row[1];
        
        // Check if this looks like a financial data row
        if (this.isFinancialDataRow(label, value)) {
          dataRows.push(row);
        }
      }
    }
    
    return dataRows;
  }

  /**
   * Check if a row contains financial data
   */
  private isFinancialDataRow(label: any, value: any): boolean {
    if (!label || typeof label !== 'string') return false;
    if (value === null || value === undefined) return false;
    
    const cleanLabel = label.toLowerCase().trim();
    const cleanValue = String(value).trim();
    
    // Skip empty or header rows
    if (cleanLabel === '' || cleanValue === '') return false;
    if (cleanLabel.includes('total') && !cleanValue.match(/\d/)) return false;
    
    // Check if value looks like a number
    const numericValue = this.parseValue(value);
    if (numericValue === null) return false;
    
    // Check if label looks like a financial item
    const financialKeywords = [
      'revenue', 'sales', 'income', 'profit', 'loss', 'expense', 'cost',
      'assets', 'liabilities', 'equity', 'debt', 'cash', 'inventory',
      'receivable', 'payable', 'depreciation', 'amortization',
      'إيرادات', 'مبيعات', 'دخل', 'ربح', 'خسارة', 'مصروف', 'تكلفة',
      'أصول', 'التزامات', 'حقوق', 'دين', 'نقد', 'مخزون', 'مدين', 'دائن'
    ];
    
    return financialKeywords.some(keyword => cleanLabel.includes(keyword));
  }

  /**
   * Clean and normalize label text
   */
  private cleanLabel(label: any): string {
    if (!label) return '';
    return String(label).trim().toLowerCase();
  }

  /**
   * Parse value to number
   */
  private parseValue(value: any): number | null {
    if (value === null || value === undefined) return null;
    
    // Handle different value types
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remove common formatting
      const cleaned = value.replace(/[,\s]/g, '').replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? null : parsed;
    }
    
    return null;
  }

  /**
   * Extract period/year from sheet data
   */
  private extractPeriod(sheetData: any[][]): number | null {
    const flatData = sheetData.flat().join(' ');
    const yearMatch = flatData.match(/(\d{4})/);
    return yearMatch ? parseInt(yearMatch[1]) : null;
  }

  /**
   * Extract company name from sheet data
   */
  private extractCompanyName(sheetData: any[][]): string | null {
    // Look for company name in first few rows
    for (let i = 0; i < Math.min(5, sheetData.length); i++) {
      const row = sheetData[i];
      if (row && row[0] && typeof row[0] === 'string') {
        const cell = row[0].trim();
        if (cell.length > 3 && cell.length < 100 && !cell.match(/^\d+$/)) {
          return cell;
        }
      }
    }
    return null;
  }

  /**
   * Get income statement field mapping
   */
  private getIncomeStatementMapping(): { [key: string]: string } {
    return {
      'revenue': 'revenue',
      'sales': 'revenue',
      'total revenue': 'revenue',
      'إيرادات': 'revenue',
      'مبيعات': 'revenue',
      'cost of goods sold': 'costOfGoodsSold',
      'cogs': 'costOfGoodsSold',
      'تكلفة البضاعة المباعة': 'costOfGoodsSold',
      'gross profit': 'grossProfit',
      'الربح الإجمالي': 'grossProfit',
      'operating expenses': 'operatingExpenses',
      'المصروفات التشغيلية': 'operatingExpenses',
      'operating income': 'operatingIncome',
      'الدخل التشغيلي': 'operatingIncome',
      'interest expense': 'interestExpense',
      'مصروفات الفوائد': 'interestExpense',
      'net income': 'netIncome',
      'صافي الربح': 'netIncome',
      'depreciation': 'depreciation',
      'إهلاك': 'depreciation',
      'amortization': 'amortization',
      'مخصصات': 'amortization'
    };
  }

  /**
   * Get balance sheet field mapping
   */
  private getBalanceSheetMapping(): { [key: string]: string } {
    return {
      'current assets': 'currentAssets',
      'الأصول المتداولة': 'currentAssets',
      'cash': 'cash',
      'النقد': 'cash',
      'accounts receivable': 'accountsReceivable',
      'الذمم المدينة': 'accountsReceivable',
      'inventory': 'inventory',
      'المخزون': 'inventory',
      'total assets': 'totalAssets',
      'إجمالي الأصول': 'totalAssets',
      'current liabilities': 'currentLiabilities',
      'الالتزامات المتداولة': 'currentLiabilities',
      'accounts payable': 'accountsPayable',
      'الذمم الدائنة': 'accountsPayable',
      'long term debt': 'longTermDebt',
      'الديون طويلة الأجل': 'longTermDebt',
      'shareholders equity': 'shareholdersEquity',
      'حقوق الملكية': 'shareholdersEquity',
      'total equity': 'shareholdersEquity',
      'إجمالي حقوق الملكية': 'shareholdersEquity'
    };
  }

  /**
   * Get cash flow statement field mapping
   */
  private getCashFlowMapping(): { [key: string]: string } {
    return {
      'operating cash flow': 'operatingCashFlow',
      'التدفق النقدي التشغيلي': 'operatingCashFlow',
      'investing cash flow': 'investingCashFlow',
      'التدفق النقدي الاستثماري': 'investingCashFlow',
      'financing cash flow': 'financingCashFlow',
      'التدفق النقدي التمويلي': 'financingCashFlow',
      'net cash flow': 'netCashFlow',
      'صافي التدفق النقدي': 'netCashFlow',
      'capital expenditures': 'capitalExpenditures',
      'النفقات الرأسمالية': 'capitalExpenditures'
    };
  }
}
