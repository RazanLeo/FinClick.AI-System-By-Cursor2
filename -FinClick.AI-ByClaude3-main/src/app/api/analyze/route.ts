import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { createAnalysis, saveFinancialData, createCompany } from '@/lib/api/mongodb';
import { uploadFinancialDocument } from '@/lib/api/supabase';
import { parsePDF } from '@/lib/parsers/pdf-parser';
import { parseExcel } from '@/lib/parsers/excel-parser';
import { extractFinancialDataFromImage } from '@/lib/parsers/ocr-parser';
import { cleanFinancialData, normalizeFinancialData } from '@/lib/parsers/data-cleaner';
import { Company, FinancialStatement } from '@/lib/types';
import { runAllAnalyses } from '@/lib/analysis/analysis-engine';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract company details
    const companyData = JSON.parse(formData.get('company') as string) as Company;
    
    // Extract financial data if provided
    const manualFinancialData = formData.get('financialData');
    const financialStatements: FinancialStatement[] = manualFinancialData 
      ? JSON.parse(manualFinancialData as string)
      : [];
    
    // Process uploaded files
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof File) {
        files.push(value);
      }
    }
    
    // Create company record
    const company = await createCompany({
      userId: 'temp-user-id', // TODO: Get from auth session
      ...companyData
    });
    
    // Create analysis record
    const analysis = await createAnalysis({
      userId: 'temp-user-id',
      companyId: company._id.toString(),
      type: companyData.analysisType || 'comprehensive',
      yearsAnalyzed: Array.from({ length: companyData.yearsToAnalyze }, (_, i) => 
        new Date().getFullYear() - i
      ),
      comparisonLevel: companyData.comparisonLevel,
      language: companyData.language || 'ar'
    });
    
    // Process files asynchronously
    processAnalysisAsync(
      analysis._id.toString(),
      company._id.toString(),
      companyData,
      files,
      financialStatements
    );
    
    return NextResponse.json({
      analysisId: analysis._id.toString(),
      message: 'Analysis started successfully'
    });
    
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to start analysis' },
      { status: 500 }
    );
  }
}

async function processAnalysisAsync(
  analysisId: string,
  companyId: string,
  companyData: Company,
  files: File[],
  manualData: FinancialStatement[]
) {
  try {
    // Process uploaded files
    let extractedData: FinancialStatement[] = [];
    
    if (files.length > 0) {
      extractedData = await processFiles(files, companyId);
    }
    
    // Combine manual and extracted data
    const allFinancialData = [...manualData, ...extractedData];
    
    // Clean and normalize data
    const cleanedResults = allFinancialData.map(data => 
      cleanFinancialData(data)
    );
    
    // Save financial data to database
    for (const result of cleanedResults) {
      await saveFinancialData({
        companyId,
        year: result.data.year,
        balanceSheet: result.data.balanceSheet,
        incomeStatement: result.data.incomeStatement,
        cashFlow: result.data.cashFlowStatement,
        dataQuality: {
          issues: result.issues,
          warnings: result.warnings,
          appliedFixes: result.appliedFixes
        }
      });
    }
    
    // Run all analyses
    const analysisResults = await runAllAnalyses(
      cleanedResults.map(r => r.data),
      companyData,
      analysisId
    );
    
    // Analysis complete - results are saved within runAllAnalyses
    
  } catch (error) {
    console.error('Async analysis error:', error);
    // Update analysis status to failed
    // await updateAnalysis(analysisId, { status: 'failed', error: error.message });
  }
}

async function processFiles(
  files: File[],
  companyId: string
): Promise<FinancialStatement[]> {
  const results: FinancialStatement[] = [];
  
  for (const file of files) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileType = file.type.toLowerCase();
      
      let extractedData: any = null;
      
      // Process based on file type
      if (fileType.includes('pdf')) {
        const pdfResult = await parsePDF(buffer);
        extractedData = pdfResult.extractedData;
      } else if (
        fileType.includes('excel') || 
        fileType.includes('spreadsheet') ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls')
      ) {
        const excelResult = await parseExcel(buffer);
        extractedData = excelResult.extractedFinancialData;
      } else if (fileType.includes('image')) {
        const imageResult = await extractFinancialDataFromImage(
          buffer,
          fileType,
          true
        );
        extractedData = imageResult.extractedData;
      }
      
      // Upload original file to storage
      const uploadResult = await uploadFinancialDocument(
        file,
        'temp-user-id',
        companyId
      );
      
      if (extractedData) {
        // Normalize the extracted data
        const normalized = normalizeFinancialData([extractedData]);
        results.push(...normalized);
      }
      
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }
  }
  
  return results;
}

// GET endpoint to check analysis status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const analysisId = searchParams.get('id');
  
  if (!analysisId) {
    return NextResponse.json(
      { error: 'Analysis ID required' },
      { status: 400 }
    );
  }
  
  try {
    // Get analysis status from database
    // const analysis = await getAnalysis(analysisId);
    
    // Temporary response
    return NextResponse.json({
      id: analysisId,
      status: 'processing',
      progress: 45,
      message: 'Analyzing financial statements...'
    });
    
  } catch (error) {
    console.error('Get analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to get analysis status' },
      { status: 500 }
    );
  }
}
