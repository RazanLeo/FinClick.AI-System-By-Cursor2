import * as XLSX from 'xlsx';
import { extractFinancialDataFromText } from '@/lib/api/openai';

export interface ParsedExcelResult {
  sheets: {
    name: string;
    data: any[][];
    jsonData: any[];
  }[];
  metadata: {
    sheetCount: number;
    fileName?: string;
    fileSize?: number;
  };
  extractedFinancialData?: any;
}

export async function parseExcel(buffer: Buffer): Promise<ParsedExcelResult> {
  try {
    // Read the workbook
    const workbook = XLSX.read(buffer, {
      type: 'buffer',
      cellDates: true,
      cellNF: true,
      cellStyles: true,
      cellText: false
    });
    
    const sheets = workbook.SheetNames.map(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to array of arrays
      const data = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: null,
        raw: false
      }) as any[][];
      
      // Convert to JSON with headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        defval: null,
        raw: false
      });
      
      return {
        name: sheetName,
        data,
        jsonData
      };
    });
    
    return {
      sheets,
      metadata: {
        sheetCount: workbook.SheetNames.length
      }
    };
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error('Failed to parse Excel file');
  }
}

export async function extractFinancialDataFromExcel(
  buffer: Buffer,
  useAI: boolean = true
): Promise<any> {
  try {
    const parsedExcel = await parseExcel(buffer);
    
    // Try to identify financial statements in sheets
    const financialData = identifyFinancialStatements(parsedExcel.sheets);
    
    if (useAI && financialData.needsAIProcessing) {
      // Convert sheets to text for AI processing
      const sheetsText = parsedExcel.sheets
        .map(sheet => `Sheet: ${sheet.name}\n${convertSheetToText(sheet.data)}`)
        .join('\n\n');
      
      const aiExtractedData = await extractFinancialDataFromText(
        sheetsText,
        'excel_financial_statements'
      );
      
      return {
        ...parsedExcel,
        extractedFinancialData: mergeFinancialData(financialData, aiExtractedData)
      };
    }
    
    return {
      ...parsedExcel,
      extractedFinancialData: financialData
    };
  } catch (error) {
    console.error('Financial data extraction from Excel error:', error);
    throw error;
  }
}

function identifyFinancialStatements(sheets: any[]): any {
  const financialData: any = {
    balanceSheet: null,
    incomeStatement: null,
    cashFlowStatement: null,
    metadata: {},
    needsAIProcessing: false
  };
  
  sheets.forEach(sheet => {
    const sheetNameLower = sheet.name.toLowerCase();
    const firstRow = sheet.data[0] || [];
    const firstColValues = sheet.data.map(row => row[0]).filter(val => val);
    
    // Check sheet name for statement type
    if (sheetNameLower.includes('balance') || sheetNameLower.includes('مركز') || 
        sheetNameLower.includes('position') || sheetNameLower.includes('assets')) {
      financialData.balanceSheet = processBalanceSheet(sheet);
    } else if (sheetNameLower.includes('income') || sheetNameLower.includes('دخل') ||
               sheetNameLower.includes('profit') || sheetNameLower.includes('p&l')) {
      financialData.incomeStatement = processIncomeStatement(sheet);
    } else if (sheetNameLower.includes('cash') || sheetNameLower.includes('نقد') ||
               sheetNameLower.includes('flow')) {
      financialData.cashFlowStatement = processCashFlowStatement(sheet);
    }
    
    // Extract metadata
    extractMetadataFromSheet(sheet, financialData.metadata);
  });
  
  // Check if we need AI processing
  if (!financialData.balanceSheet && !financialData.incomeStatement && !financialData.cashFlowStatement) {
    financialData.needsAIProcessing = true;
  }
  
  return financialData;
}

function processBalanceSheet(sheet: any): any {
  const balanceSheet: any = {
    assets: {},
    liabilities: {},
    equity: {}
  };
  
  const accountMappings = {
    // Assets
    'cash': ['cash', 'نقد', 'نقدية'],
    'accountsReceivable': ['accounts receivable', 'receivables', 'ذمم مدينة', 'مدينون'],
    'inventory': ['inventory', 'مخزون', 'بضاعة'],
    'currentAssets': ['current assets', 'total current assets', 'أصول متداولة'],
    'ppe': ['property plant equipment', 'ppe', 'ممتلكات ومعدات'],
    'totalAssets': ['total assets', 'إجمالي الأصول', 'مجموع الأصول'],
    
    // Liabilities
    'accountsPayable': ['accounts payable', 'payables', 'ذمم دائنة', 'دائنون'],
    'shortTermDebt': ['short term debt', 'current debt', 'ديون قصيرة'],
    'currentLiabilities': ['current liabilities', 'total current liabilities', 'خصوم متداولة'],
    'longTermDebt': ['long term debt', 'ديون طويلة الأجل'],
    'totalLiabilities': ['total liabilities', 'إجمالي الخصوم', 'مجموع الخصوم'],
    
    // Equity
    'commonStock': ['common stock', 'capital stock', 'رأس المال'],
    'retainedEarnings': ['retained earnings', 'أرباح محتجزة'],
    'totalEquity': ['total equity', 'shareholders equity', 'حقوق الملكية']
  };
  
  // Process each row
  sheet.data.forEach((row: any[], index: number) => {
    if (index === 0) return; // Skip header
    
    const accountName = (row[0] || '').toString().toLowerCase();
    const values = row.slice(1).filter(val => !isNaN(parseFloat(val)));
    
    // Map account names to standard fields
    Object.entries(accountMappings).forEach(([field, patterns]) => {
      if (patterns.some(pattern => accountName.includes(pattern))) {
        const value = values.length > 0 ? parseFloat(values[values.length - 1]) : 0;
        
        if (field in ['cash', 'accountsReceivable', 'inventory', 'currentAssets', 'ppe', 'totalAssets']) {
          balanceSheet.assets[field] = value;
        } else if (field in ['accountsPayable', 'shortTermDebt', 'currentLiabilities', 'longTermDebt', 'totalLiabilities']) {
          balanceSheet.liabilities[field] = value;
        } else {
          balanceSheet.equity[field] = value;
        }
      }
    });
  });
  
  return balanceSheet;
}

function processIncomeStatement(sheet: any): any {
  const incomeStatement: any = {};
  
  const accountMappings = {
    'revenue': ['revenue', 'sales', 'إيرادات', 'مبيعات'],
    'costOfGoodsSold': ['cost of goods sold', 'cogs', 'تكلفة البضاعة المباعة', 'تكلفة المبيعات'],
    'grossProfit': ['gross profit', 'إجمالي الربح', 'مجمل الربح'],
    'operatingExpenses': ['operating expenses', 'opex', 'مصروفات تشغيلية'],
    'operatingIncome': ['operating income', 'ebit', 'الدخل التشغيلي'],
    'interestExpense': ['interest expense', 'مصروفات فوائد'],
    'taxExpense': ['tax expense', 'income tax', 'ضريبة الدخل'],
    'netIncome': ['net income', 'net profit', 'صافي الدخل', 'صافي الربح']
  };
  
  sheet.data.forEach((row: any[], index: number) => {
    if (index === 0) return;
    
    const accountName = (row[0] || '').toString().toLowerCase();
    const values = row.slice(1).filter(val => !isNaN(parseFloat(val)));
    
    Object.entries(accountMappings).forEach(([field, patterns]) => {
      if (patterns.some(pattern => accountName.includes(pattern))) {
        incomeStatement[field] = values.length > 0 ? parseFloat(values[values.length - 1]) : 0;
      }
    });
  });
  
  return incomeStatement;
}

function processCashFlowStatement(sheet: any): any {
  const cashFlow: any = {
    operating: {},
    investing: {},
    financing: {}
  };
  
  const sectionMappings = {
    operating: ['operating activities', 'أنشطة تشغيلية'],
    investing: ['investing activities', 'أنشطة استثمارية'],
    financing: ['financing activities', 'أنشطة تمويلية']
  };
  
  let currentSection = 'operating';
  
  sheet.data.forEach((row: any[], index: number) => {
    if (index === 0) return;
    
    const firstCell = (row[0] || '').toString().toLowerCase();
    const values = row.slice(1).filter(val => !isNaN(parseFloat(val)));
    
    // Check for section headers
    Object.entries(sectionMappings).forEach(([section, patterns]) => {
      if (patterns.some(pattern => firstCell.includes(pattern))) {
        currentSection = section;
      }
    });
    
    // Extract cash flow items
    if (values.length > 0 && firstCell && !firstCell.includes('total')) {
      const value = parseFloat(values[values.length - 1]);
      const key = firstCell.replace(/[^a-zA-Z0-9]/g, '_');
      cashFlow[currentSection][key] = value;
    }
    
    // Look for net cash flow
    if (firstCell.includes('net cash') || firstCell.includes('صافي النقد')) {
      const value = values.length > 0 ? parseFloat(values[values.length - 1]) : 0;
      
      if (firstCell.includes('operating') || firstCell.includes('تشغيل')) {
        cashFlow.operating.netCash = value;
      } else if (firstCell.includes('investing') || firstCell.includes('استثمار')) {
        cashFlow.investing.netCash = value;
      } else if (firstCell.includes('financing') || firstCell.includes('تمويل')) {
        cashFlow.financing.netCash = value;
      }
    }
  });
  
  return cashFlow;
}

function extractMetadataFromSheet(sheet: any, metadata: any): void {
  sheet.data.forEach((row: any[]) => {
    const firstCell = (row[0] || '').toString().toLowerCase();
    const secondCell = row[1] || '';
    
    // Extract company name
    if (firstCell.includes('company') || firstCell.includes('شركة')) {
      metadata.companyName = secondCell.toString();
    }
    
    // Extract year
    if (firstCell.includes('year') || firstCell.includes('سنة') || firstCell.includes('period')) {
      const yearMatch = secondCell.toString().match(/\d{4}/);
      if (yearMatch) {
        metadata.year = parseInt(yearMatch[0]);
      }
    }
    
    // Extract currency
    if (firstCell.includes('currency') || firstCell.includes('عملة')) {
      metadata.currency = secondCell.toString();
    }
  });
  
  // Try to extract year from column headers
  if (!metadata.year && sheet.data.length > 0) {
    sheet.data[0].forEach((header: any) => {
      const yearMatch = header.toString().match(/\d{4}/);
      if (yearMatch) {
        metadata.year = parseInt(yearMatch[0]);
      }
    });
  }
}

function convertSheetToText(data: any[][]): string {
  return data.map(row => row.join('\t')).join('\n');
}

function mergeFinancialData(extractedData: any, aiData: any): any {
  // Merge the manually extracted data with AI-extracted data
  return {
    ...extractedData,
    ...aiData,
    merged: true
  };
}

export async function parseBatchExcelFiles(files: File[]): Promise<ParsedExcelResult[]> {
  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const buffer = await file.arrayBuffer();
        const result = await extractFinancialDataFromExcel(Buffer.from(buffer));
        return {
          ...result,
          metadata: {
            ...result.metadata,
            fileName: file.name,
            fileSize: file.size
          },
          success: true
        };
      } catch (error) {
        return {
          sheets: [],
          metadata: {
            sheetCount: 0,
            fileName: file.name,
            fileSize: file.size
          },
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    })
  );
  
  return results;
}

// Export to Excel
export function createExcelFromFinancialData(financialData: any, fileName: string = 'financial_analysis.xlsx'): Buffer {
  const wb = XLSX.utils.book_new();
  
  // Create Balance Sheet
  if (financialData.balanceSheet) {
    const bsData = [
      ['Balance Sheet', '', ''],
      ['Account', 'Amount', 'Notes'],
      ...Object.entries(financialData.balanceSheet.assets || {}).map(([key, value]) => [key, value, '']),
      ['', '', ''],
      ...Object.entries(financialData.balanceSheet.liabilities || {}).map(([key, value]) => [key, value, '']),
      ['', '', ''],
      ...Object.entries(financialData.balanceSheet.equity || {}).map(([key, value]) => [key, value, ''])
    ];
    
    const bsSheet = XLSX.utils.aoa_to_sheet(bsData);
    XLSX.utils.book_append_sheet(wb, bsSheet, 'Balance Sheet');
  }
  
  // Create Income Statement
  if (financialData.incomeStatement) {
    const isData = [
      ['Income Statement', '', ''],
      ['Account', 'Amount', 'Notes'],
      ...Object.entries(financialData.incomeStatement).map(([key, value]) => [key, value, ''])
    ];
    
    const isSheet = XLSX.utils.aoa_to_sheet(isData);
    XLSX.utils.book_append_sheet(wb, isSheet, 'Income Statement');
  }
  
  // Create Cash Flow Statement
  if (financialData.cashFlow) {
    const cfData = [
      ['Cash Flow Statement', '', ''],
      ['Activity', 'Amount', 'Notes'],
      ['Operating Activities', '', ''],
      ...Object.entries(financialData.cashFlow.operating || {}).map(([key, value]) => ['  ' + key, value, '']),
      ['Investing Activities', '', ''],
      ...Object.entries(financialData.cashFlow.investing || {}).map(([key, value]) => ['  ' + key, value, '']),
      ['Financing Activities', '', ''],
      ...Object.entries(financialData.cashFlow.financing || {}).map(([key, value]) => ['  ' + key, value, ''])
    ];
    
    const cfSheet = XLSX.utils.aoa_to_sheet(cfData);
    XLSX.utils.book_append_sheet(wb, cfSheet, 'Cash Flow');
  }
  
  return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
}
