import Tesseract from 'tesseract.js';
import { analyzeFinancialDocument } from '@/lib/api/gemini';

export interface OCRResult {
  text: string;
  confidence: number;
  blocks: any[];
  language: string;
  extractedData?: any;
}

export async function performOCR(
  imageBuffer: Buffer,
  language: string = 'ara+eng'
): Promise<OCRResult> {
  try {
    const worker = await Tesseract.createWorker();
    
    await worker.loadLanguage(language);
    await worker.initialize(language);
    
    const { data } = await worker.recognize(imageBuffer);
    
    await worker.terminate();
    
    return {
      text: data.text,
      confidence: data.confidence,
      blocks: data.blocks || [],
      language: language
    };
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Failed to perform OCR on image');
  }
}

export async function extractFinancialDataFromImage(
  imageBuffer: Buffer,
  mimeType: string,
  useAI: boolean = true
): Promise<any> {
  try {
    if (useAI) {
      // Use Gemini Vision for better accuracy with financial documents
      const aiResult = await analyzeFinancialDocument(imageBuffer, mimeType);
      return {
        method: 'ai_vision',
        ...aiResult
      };
    }
    
    // Fallback to traditional OCR
    const ocrResult = await performOCR(imageBuffer);
    
    // Extract financial data from OCR text
    const extractedData = extractFinancialDataFromOCRText(ocrResult.text);
    
    return {
      method: 'ocr',
      ...ocrResult,
      extractedData
    };
  } catch (error) {
    console.error('Financial data extraction from image error:', error);
    throw error;
  }
}

function extractFinancialDataFromOCRText(text: string): any {
  const data: any = {
    numbers: [],
    accounts: [],
    metadata: {}
  };
  
  // Clean up text
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Extract all numbers with optional currency symbols
  const numberPattern = /(?:[\$€£¥₹﷼]?\s*)?([\d,]+(?:\.\d{2})?)\s*(?:[\$€£¥₹﷼]?)/g;
  let match;
  
  while ((match = numberPattern.exec(cleanText)) !== null) {
    const value = parseFloat(match[1].replace(/,/g, ''));
    if (!isNaN(value)) {
      data.numbers.push({
        value,
        originalText: match[0],
        position: match.index
      });
    }
  }
  
  // Common account patterns in Arabic and English
  const accountPatterns = [
    // Assets
    { pattern: /(?:total\s+)?assets?/i, type: 'asset', key: 'totalAssets' },
    { pattern: /(?:إجمالي\s+)?الأصول/i, type: 'asset', key: 'totalAssets' },
    { pattern: /current\s+assets?/i, type: 'asset', key: 'currentAssets' },
    { pattern: /الأصول\s+المتداولة/i, type: 'asset', key: 'currentAssets' },
    { pattern: /cash/i, type: 'asset', key: 'cash' },
    { pattern: /النقد|نقدية/i, type: 'asset', key: 'cash' },
    { pattern: /accounts?\s+receivable/i, type: 'asset', key: 'accountsReceivable' },
    { pattern: /ذمم\s+مدينة|المدينون/i, type: 'asset', key: 'accountsReceivable' },
    { pattern: /inventory/i, type: 'asset', key: 'inventory' },
    { pattern: /المخزون|البضاعة/i, type: 'asset', key: 'inventory' },
    
    // Liabilities
    { pattern: /(?:total\s+)?liabilities/i, type: 'liability', key: 'totalLiabilities' },
    { pattern: /(?:إجمالي\s+)?الخصوم|الالتزامات/i, type: 'liability', key: 'totalLiabilities' },
    { pattern: /current\s+liabilities/i, type: 'liability', key: 'currentLiabilities' },
    { pattern: /الخصوم\s+المتداولة/i, type: 'liability', key: 'currentLiabilities' },
    { pattern: /accounts?\s+payable/i, type: 'liability', key: 'accountsPayable' },
    { pattern: /ذمم\s+دائنة|الدائنون/i, type: 'liability', key: 'accountsPayable' },
    
    // Equity
    { pattern: /shareholders?\s+equity/i, type: 'equity', key: 'shareholdersEquity' },
    { pattern: /حقوق\s+المساهمين|حقوق\s+الملكية/i, type: 'equity', key: 'shareholdersEquity' },
    
    // Income Statement
    { pattern: /(?:total\s+)?revenue|sales/i, type: 'income', key: 'revenue' },
    { pattern: /الإيرادات|المبيعات/i, type: 'income', key: 'revenue' },
    { pattern: /cost\s+of\s+goods?\s+sold|cogs/i, type: 'income', key: 'costOfGoodsSold' },
    { pattern: /تكلفة\s+البضاعة\s+المباعة/i, type: 'income', key: 'costOfGoodsSold' },
    { pattern: /gross\s+profit/i, type: 'income', key: 'grossProfit' },
    { pattern: /إجمالي\s+الربح|مجمل\s+الربح/i, type: 'income', key: 'grossProfit' },
    { pattern: /net\s+(?:income|profit)/i, type: 'income', key: 'netIncome' },
    { pattern: /صافي\s+الدخل|صافي\s+الربح/i, type: 'income', key: 'netIncome' }
  ];
  
  // Find accounts and associated values
  accountPatterns.forEach(({ pattern, type, key }) => {
    const accountMatch = cleanText.match(pattern);
    if (accountMatch) {
      const position = accountMatch.index || 0;
      
      // Find the closest number after this account
      let closestNumber = null;
      let minDistance = Infinity;
      
      data.numbers.forEach((num: any) => {
        if (num.position > position) {
          const distance = num.position - position;
          if (distance < minDistance && distance < 50) { // Within 50 characters
            minDistance = distance;
            closestNumber = num.value;
          }
        }
      });
      
      if (closestNumber !== null) {
        data.accounts.push({
          type,
          key,
          value: closestNumber,
          originalText: accountMatch[0]
        });
      }
    }
  });
  
  // Extract metadata
  const yearMatch = cleanText.match(/(?:20\d{2}|19\d{2})/);
  if (yearMatch) {
    data.metadata.year = parseInt(yearMatch[0]);
  }
  
  const currencyPatterns = [
    { pattern: /SAR|ريال\s*سعودي/, currency: 'SAR' },
    { pattern: /USD|\$|دولار/, currency: 'USD' },
    { pattern: /EUR|€|يورو/, currency: 'EUR' },
    { pattern: /GBP|£|جنيه/, currency: 'GBP' }
  ];
  
  currencyPatterns.forEach(({ pattern, currency }) => {
    if (cleanText.match(pattern)) {
      data.metadata.currency = currency;
    }
  });
  
  return data;
}

export async function processBatchImages(
  files: File[]
): Promise<OCRResult[]> {
  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const buffer = await file.arrayBuffer();
        const result = await extractFinancialDataFromImage(
          Buffer.from(buffer),
          file.type,
          true // Use AI for better accuracy
        );
        
        return {
          ...result,
          fileName: file.name,
          fileSize: file.size,
          success: true
        };
      } catch (error) {
        return {
          text: '',
          confidence: 0,
          blocks: [],
          language: '',
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

// Enhanced OCR with preprocessing
export async function enhancedOCR(
  imageBuffer: Buffer,
  options: {
    preprocess?: boolean;
    language?: string;
    dpi?: number;
  } = {}
): Promise<OCRResult> {
  const {
    preprocess = true,
    language = 'ara+eng',
    dpi = 300
  } = options;
  
  try {
    let processedBuffer = imageBuffer;
    
    if (preprocess) {
      // Note: In a real implementation, you would use image processing libraries
      // like sharp or jimp to preprocess the image
      // processedBuffer = await preprocessImage(imageBuffer, { dpi });
    }
    
    const result = await performOCR(processedBuffer, language);
    
    // Post-process the text to fix common OCR errors
    result.text = postProcessOCRText(result.text);
    
    return result;
  } catch (error) {
    console.error('Enhanced OCR error:', error);
    throw error;
  }
}

function postProcessOCRText(text: string): string {
  // Fix common OCR errors
  let fixedText = text;
  
  // Fix common number confusions
  fixedText = fixedText.replace(/[oO]/g, '0'); // O to 0
  fixedText = fixedText.replace(/[lI]/g, '1'); // l or I to 1
  fixedText = fixedText.replace(/[sS]\s*(?=\d)/g, '5'); // S to 5 when followed by digits
  
  // Fix spacing issues
  fixedText = fixedText.replace(/(\d)\s+(\d{3})/g, '$1,$2'); // Add commas to thousands
  fixedText = fixedText.replace(/\s+/g, ' '); // Normalize whitespace
  
  // Fix common Arabic OCR issues
  fixedText = fixedText.replace(/ـ/g, ''); // Remove Arabic tatweel
  
  return fixedText.trim();
}

// Table detection and extraction from images
export async function extractTablesFromImage(
  imageBuffer: Buffer,
  mimeType: string
): Promise<any[]> {
  try {
    // Use Gemini Vision for table extraction
    const prompt = `
      Extract all tables from this financial document image.
      For each table:
      1. Identify headers
      2. Extract all rows and columns
      3. Preserve the structure
      4. Return as structured JSON
    `;
    
    const result = await analyzeFinancialDocument(imageBuffer, mimeType);
    
    if (result.tables) {
      return result.tables;
    }
    
    // Fallback to OCR-based table extraction
    const ocrResult = await performOCR(imageBuffer);
    return extractTablesFromOCRBlocks(ocrResult.blocks);
  } catch (error) {
    console.error('Table extraction error:', error);
    return [];
  }
}

function extractTablesFromOCRBlocks(blocks: any[]): any[] {
  // Group blocks by vertical position (rows)
  const rows: any[] = [];
  
  blocks.forEach(block => {
    const y = block.bbox.y0;
    let row = rows.find(r => Math.abs(r.y - y) < 10); // 10px tolerance
    
    if (!row) {
      row = { y, blocks: [] };
      rows.push(row);
    }
    
    row.blocks.push(block);
  });
  
  // Sort rows by vertical position
  rows.sort((a, b) => a.y - b.y);
  
  // Sort blocks within each row by horizontal position
  rows.forEach(row => {
    row.blocks.sort((a: any, b: any) => a.bbox.x0 - b.bbox.x0);
  });
  
  // Convert to table structure
  const table = rows.map(row => 
    row.blocks.map((block: any) => block.text.trim())
  );
  
  return [{ rows: table }];
}
