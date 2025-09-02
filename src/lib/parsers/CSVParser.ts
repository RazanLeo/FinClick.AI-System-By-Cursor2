import { ParsedFinancialData, ParseOptions } from './FileParser';
import { FinancialStatement } from '@/lib/types';

export class CSVParser {
  /**
   * Parse CSV file and extract financial data
   */
  async parse(
    fileBuffer: Buffer,
    fileName: string,
    options: ParseOptions = {}
  ): Promise<ParsedFinancialData> {
    try {
      // Convert buffer to string
      const csvContent = fileBuffer.toString('utf-8');
      
      if (!csvContent) {
        throw new Error('Empty CSV file');
      }

      // Parse CSV content
      const csvData = this.parseCSV(csvContent);
      
      if (csvData.length === 0) {
        throw new Error('No data found in CSV file');
      }

      // Extract financial data from CSV
      const financialData = this.extractFinancialDataFromCSV(csvData, options);
      
      return {
        success: true,
        data: financialData,
        metadata: {
          fileName,
          fileType: 'csv',
          fileSize: fileBuffer.length,
          pages: 1, // CSV files are typically single page
          extractedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('CSV parsing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'CSV parsing failed',
        metadata: {
          fileName,
          fileType: 'csv',
          fileSize: fileBuffer.length,
          extractedAt: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Parse CSV content into array of rows
   */
  private parseCSV(content: string): string[][] {
    const rows: string[][] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.trim()) {
        const row = this.parseCSVLine(line);
        if (row.length > 0) {
          rows.push(row);
        }
      }
    }
    
    return rows;
  }

  /**
   * Parse a single CSV line handling quotes and commas
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current.trim());
    
    return result;
  }

  /**
   * Extract financial data from CSV rows
   */
  private extractFinancialDataFromCSV(
    csvData: string[][],
    options: ParseOptions
  ): FinancialStatement[] {
    const financialData: FinancialStatement[] = [];
    
    // Detect CSV structure
    const structure = this.detectCSVStructure(csvData);
    
    switch (structure.type) {
      case 'key_value':
        financialData.push(this.parseKeyValueCSV(csvData, options));
        break;
      case 'tabular':
        financialData.push(this.parseTabularCSV(csvData, options));
        break;
      case 'multi_period':
        financialData.push(...this.parseMultiPeriodCSV(csvData, options));
        break;
      default:
        // Try to parse as key-value as fallback
        financialData.push(this.parseKeyValueCSV(csvData, options));
    }
    
    return financialData;
  }

  /**
   * Detect CSV structure type
   */
  private detectCSVStructure(csvData: string[][]): { type: string; confidence: number } {
    if (csvData.length === 0) return { type: 'unknown', confidence: 0 };
    
    const firstRow = csvData[0];
    const secondRow = csvData[1] || [];
    
    // Check for key-value structure (2 columns: label, value)
    if (firstRow.length === 2 && secondRow.length === 2) {
      const hasNumericValues = csvData.slice(0, 5).some(row => 
        row.length === 2 && this.isNumeric(row[1])
      );
      if (hasNumericValues) {
        return { type: 'key_value', confidence: 0.9 };
      }
    }
    
    // Check for tabular structure (multiple columns with headers)
    if (firstRow.length > 2) {
      const hasHeaders = firstRow.some(cell => 
        typeof cell === 'string' && 
        cell.toLowerCase().includes('account') || 
        cell.toLowerCase().includes('item') ||
        cell.toLowerCase().includes('حساب') ||
        cell.toLowerCase().includes('بند')
      );
      if (hasHeaders) {
        return { type: 'tabular', confidence: 0.8 };
      }
    }
    
    // Check for multi-period structure (years as columns)
    const hasYearColumns = firstRow.some(cell => 
      typeof cell === 'string' && 
      /^\d{4}$/.test(cell.trim())
    );
    if (hasYearColumns) {
      return { type: 'multi_period', confidence: 0.7 };
    }
    
    return { type: 'unknown', confidence: 0 };
  }

  /**
   * Parse key-value CSV structure
   */
  private parseKeyValueCSV(
    csvData: string[][],
    options: ParseOptions
  ): FinancialStatement {
    const incomeStatement: any = {};
    const balanceSheet: any = {};
    const cashFlowStatement: any = {};
    
    const period = options.year || new Date().getFullYear();
    const companyName = options.companyName || 'Unknown Company';
    const currency = options.currency || 'SAR';
    
    for (const row of csvData) {
      if (row.length >= 2) {
        const label = row[0].trim().toLowerCase();
        const value = this.parseValue(row[1]);
        
        if (value !== null) {
          // Map to appropriate statement
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
   * Parse tabular CSV structure
   */
  private parseTabularCSV(
    csvData: string[][],
    options: ParseOptions
  ): FinancialStatement {
    const incomeStatement: any = {};
    const balanceSheet: any = {};
    const cashFlowStatement: any = {};
    
    const period = options.year || new Date().getFullYear();
    const companyName = options.companyName || 'Unknown Company';
    const currency = options.currency || 'SAR';
    
    // Assume first row is headers
    const headers = csvData[0] || [];
    const dataRows = csvData.slice(1);
    
    for (const row of dataRows) {
      if (row.length >= 2) {
        const label = row[0].trim().toLowerCase();
        const value = this.parseValue(row[1]);
        
        if (value !== null) {
          // Map to appropriate statement
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
   * Parse multi-period CSV structure
   */
  private parseMultiPeriodCSV(
    csvData: string[][],
    options: ParseOptions
  ): FinancialStatement[] {
    const financialStatements: FinancialStatement[] = [];
    
    if (csvData.length === 0) return financialStatements;
    
    const headers = csvData[0] || [];
    const yearColumns = headers
      .map((header, index) => ({ header: header.trim(), index }))
      .filter(({ header }) => /^\d{4}$/.test(header));
    
    const companyName = options.companyName || 'Unknown Company';
    const currency = options.currency || 'SAR';
    
    for (const { header: year, index } of yearColumns) {
      const period = parseInt(year);
      const incomeStatement: any = {};
      const balanceSheet: any = {};
      const cashFlowStatement: any = {};
      
      // Process data rows
      for (let i = 1; i < csvData.length; i++) {
        const row = csvData[i];
        if (row && row.length > index) {
          const label = row[0].trim().toLowerCase();
          const value = this.parseValue(row[index]);
          
          if (value !== null) {
            // Map to appropriate statement
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
      }
      
      financialStatements.push({
        period,
        currency,
        companyName,
        incomeStatement,
        balanceSheet,
        cashFlowStatement,
        notes: []
      });
    }
    
    return financialStatements;
  }

  /**
   * Parse value to number
   */
  private parseValue(value: string): number | null {
    if (!value || value.trim() === '') return null;
    
    // Remove common formatting
    const cleaned = value.replace(/[,\s]/g, '').replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Check if value is numeric
   */
  private isNumeric(value: string): boolean {
    return this.parseValue(value) !== null;
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
      'مخصصات': 'amortization',
      'ebitda': 'ebitda',
      'إيبيدا': 'ebitda'
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
      'cash and cash equivalents': 'cash',
      'accounts receivable': 'accountsReceivable',
      'الذمم المدينة': 'accountsReceivable',
      'receivables': 'accountsReceivable',
      'inventory': 'inventory',
      'المخزون': 'inventory',
      'property plant equipment': 'propertyPlantEquipment',
      'المباني والمعدات': 'propertyPlantEquipment',
      'ppe': 'propertyPlantEquipment',
      'total assets': 'totalAssets',
      'إجمالي الأصول': 'totalAssets',
      'current liabilities': 'currentLiabilities',
      'الالتزامات المتداولة': 'currentLiabilities',
      'accounts payable': 'accountsPayable',
      'الذمم الدائنة': 'accountsPayable',
      'payables': 'accountsPayable',
      'long term debt': 'longTermDebt',
      'الديون طويلة الأجل': 'longTermDebt',
      'long-term debt': 'longTermDebt',
      'total liabilities': 'totalLiabilities',
      'إجمالي الالتزامات': 'totalLiabilities',
      'shareholders equity': 'shareholdersEquity',
      'حقوق الملكية': 'shareholdersEquity',
      'equity': 'shareholdersEquity',
      'total equity': 'shareholdersEquity',
      'إجمالي حقوق الملكية': 'shareholdersEquity',
      'share capital': 'shareCapital',
      'رأس المال': 'shareCapital',
      'capital': 'shareCapital',
      'retained earnings': 'retainedEarnings',
      'الأرباح المحتجزة': 'retainedEarnings'
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
      'النفقات الرأسمالية': 'capitalExpenditures',
      'capex': 'capitalExpenditures',
      'dividends paid': 'dividendsPaid',
      'الأرباح المدفوعة': 'dividendsPaid',
      'dividends': 'dividendsPaid'
    };
  }
}
