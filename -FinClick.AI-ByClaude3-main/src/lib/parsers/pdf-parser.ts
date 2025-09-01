import pdfParse from 'pdf-parse';
import { extractFinancialDataFromText } from '@/lib/api/openai';

export interface ParsedPDFResult {
  text: string;
  numPages: number;
  info: any;
  metadata: any;
  extractedData?: any;
}

export async function parsePDF(buffer: Buffer): Promise<ParsedPDFResult> {
  try {
    const data = await pdfParse(buffer);
    
    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata,
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export async function extractFinancialDataFromPDF(
  buffer: Buffer,
  useAI: boolean = true
): Promise<any> {
  try {
    // First, parse the PDF to get text
    const parsedPDF = await parsePDF(buffer);
    
    if (!parsedPDF.text || parsedPDF.text.trim().length === 0) {
      throw new Error('No text found in PDF');
    }
    
    // If AI extraction is enabled, use OpenAI to extract structured data
    if (useAI) {
      const extractedData = await extractFinancialDataFromText(
        parsedPDF.text,
        'pdf_financial_statement'
      );
      
      return {
        ...parsedPDF,
        extractedData
      };
    }
    
    // Otherwise, use pattern matching to extract data
    return {
      ...parsedPDF,
      extractedData: extractDataUsingPatterns(parsedPDF.text)
    };
  } catch (error) {
    console.error('Financial data extraction error:', error);
    throw error;
  }
}

function extractDataUsingPatterns(text: string): any {
  const data: any = {
    balanceSheet: {},
    incomeStatement: {},
    cashFlow: {},
    metadata: {}
  };
  
  // Extract company name
  const companyNameMatch = text.match(/(?:Company|الشركة|شركة)\s*[:：]\s*([^\n]+)/i);
  if (companyNameMatch) {
    data.metadata.companyName = companyNameMatch[1].trim();
  }
  
  // Extract period/year
  const yearMatch = text.match(/(?:Year|السنة|العام)\s*[:：]\s*(\d{4})/i);
  if (yearMatch) {
    data.metadata.year = parseInt(yearMatch[1]);
  }
  
  // Extract currency
  const currencyMatch = text.match(/(?:Currency|العملة)\s*[:：]\s*([A-Z]{3})/i);
  if (currencyMatch) {
    data.metadata.currency = currencyMatch[1];
  }
  
  // Balance Sheet patterns
  const balanceSheetPatterns = [
    { key: 'totalAssets', patterns: [/Total Assets\s*[:：]\s*([\d,]+)/i, /إجمالي الأصول\s*[:：]\s*([\d,]+)/] },
    { key: 'currentAssets', patterns: [/Current Assets\s*[:：]\s*([\d,]+)/i, /الأصول المتداولة\s*[:：]\s*([\d,]+)/] },
    { key: 'cash', patterns: [/Cash\s*[:：]\s*([\d,]+)/i, /النقد\s*[:：]\s*([\d,]+)/] },
    { key: 'accountsReceivable', patterns: [/Accounts Receivable\s*[:：]\s*([\d,]+)/i, /الذمم المدينة\s*[:：]\s*([\d,]+)/] },
    { key: 'inventory', patterns: [/Inventory\s*[:：]\s*([\d,]+)/i, /المخزون\s*[:：]\s*([\d,]+)/] },
    { key: 'totalLiabilities', patterns: [/Total Liabilities\s*[:：]\s*([\d,]+)/i, /إجمالي الخصوم\s*[:：]\s*([\d,]+)/] },
    { key: 'currentLiabilities', patterns: [/Current Liabilities\s*[:：]\s*([\d,]+)/i, /الخصوم المتداولة\s*[:：]\s*([\d,]+)/] },
    { key: 'longTermDebt', patterns: [/Long[- ]?term Debt\s*[:：]\s*([\d,]+)/i, /الديون طويلة الأجل\s*[:：]\s*([\d,]+)/] },
    { key: 'shareholdersEquity', patterns: [/Shareholders'? Equity\s*[:：]\s*([\d,]+)/i, /حقوق المساهمين\s*[:：]\s*([\d,]+)/] }
  ];
  
  // Income Statement patterns
  const incomeStatementPatterns = [
    { key: 'revenue', patterns: [/(?:Total )?Revenue\s*[:：]\s*([\d,]+)/i, /الإيرادات\s*[:：]\s*([\d,]+)/] },
    { key: 'costOfGoodsSold', patterns: [/Cost of Goods Sold\s*[:：]\s*([\d,]+)/i, /تكلفة البضاعة المباعة\s*[:：]\s*([\d,]+)/] },
    { key: 'grossProfit', patterns: [/Gross Profit\s*[:：]\s*([\d,]+)/i, /إجمالي الربح\s*[:：]\s*([\d,]+)/] },
    { key: 'operatingExpenses', patterns: [/Operating Expenses\s*[:：]\s*([\d,]+)/i, /المصروفات التشغيلية\s*[:：]\s*([\d,]+)/] },
    { key: 'operatingIncome', patterns: [/Operating Income\s*[:：]\s*([\d,]+)/i, /الدخل التشغيلي\s*[:：]\s*([\d,]+)/] },
    { key: 'netIncome', patterns: [/Net Income\s*[:：]\s*([\d,]+)/i, /صافي الدخل\s*[:：]\s*([\d,]+)/] }
  ];
  
  // Cash Flow patterns
  const cashFlowPatterns = [
    { key: 'operatingCashFlow', patterns: [/Operating Cash Flow\s*[:：]\s*([\d,]+)/i, /التدفق النقدي التشغيلي\s*[:：]\s*([\d,]+)/] },
    { key: 'investingCashFlow', patterns: [/Investing Cash Flow\s*[:：]\s*([\d,]+)/i, /التدفق النقدي الاستثماري\s*[:：]\s*([\d,]+)/] },
    { key: 'financingCashFlow', patterns: [/Financing Cash Flow\s*[:：]\s*([\d,]+)/i, /التدفق النقدي التمويلي\s*[:：]\s*([\d,]+)/] },
    { key: 'netCashFlow', patterns: [/Net Cash Flow\s*[:：]\s*([\d,]+)/i, /صافي التدفق النقدي\s*[:：]\s*([\d,]+)/] }
  ];
  
  // Extract balance sheet data
  balanceSheetPatterns.forEach(({ key, patterns }) => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        data.balanceSheet[key] = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }
  });
  
  // Extract income statement data
  incomeStatementPatterns.forEach(({ key, patterns }) => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        data.incomeStatement[key] = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }
  });
  
  // Extract cash flow data
  cashFlowPatterns.forEach(({ key, patterns }) => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        data.cashFlow[key] = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }
  });
  
  return data;
}

export async function parseBatchPDFs(files: File[]): Promise<ParsedPDFResult[]> {
  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const buffer = await file.arrayBuffer();
        const result = await extractFinancialDataFromPDF(Buffer.from(buffer));
        return {
          ...result,
          fileName: file.name,
          fileSize: file.size,
          success: true
        };
      } catch (error) {
        return {
          fileName: file.name,
          fileSize: file.size,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    })
  );
  
  return results;
}

// Table extraction from PDF
export function extractTablesFromText(text: string): any[] {
  const tables: any[] = [];
  const lines = text.split('\n');
  
  let currentTable: string[][] = [];
  let inTable = false;
  
  for (const line of lines) {
    // Detect table rows (containing multiple numbers or pipe separators)
    const hasMultipleNumbers = (line.match(/\d+[\s,.]?\d*/g) || []).length >= 3;
    const hasPipes = line.includes('|');
    const hasTabs = line.includes('\t');
    
    if (hasMultipleNumbers || hasPipes || hasTabs) {
      if (!inTable) {
        inTable = true;
        currentTable = [];
      }
      
      // Split the line into cells
      let cells: string[];
      if (hasPipes) {
        cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      } else if (hasTabs) {
        cells = line.split('\t').map(cell => cell.trim());
      } else {
        // Use regex to split by multiple spaces
        cells = line.split(/\s{2,}/).map(cell => cell.trim());
      }
      
      if (cells.length > 1) {
        currentTable.push(cells);
      }
    } else if (inTable && line.trim() === '') {
      // End of table
      if (currentTable.length > 1) {
        tables.push(processTable(currentTable));
      }
      inTable = false;
      currentTable = [];
    }
  }
  
  // Handle last table if exists
  if (currentTable.length > 1) {
    tables.push(processTable(currentTable));
  }
  
  return tables;
}

function processTable(rawTable: string[][]): any {
  if (rawTable.length < 2) return null;
  
  // Assume first row is header
  const headers = rawTable[0];
  const data = rawTable.slice(1);
  
  return {
    headers,
    rows: data,
    data: data.map(row => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    })
  };
}
