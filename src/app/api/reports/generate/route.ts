import { NextRequest, NextResponse } from 'next/server';
import { ReportGenerator } from '@/lib/reports/ReportGenerator';
import { AnalysisResult, Company } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      analysisResults, 
      company, 
      format, 
      settings = {} 
    } = body;

    // Validate required fields
    if (!analysisResults || !company || !format) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: analysisResults, company, format' },
        { status: 400 }
      );
    }

    // Validate format
    const supportedFormats = ['pdf', 'excel', 'word', 'powerpoint', 'html'];
    if (!supportedFormats.includes(format.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: `Unsupported format. Supported formats: ${supportedFormats.join(', ')}` },
        { status: 400 }
      );
    }

    // Create report generator
    const reportGenerator = new ReportGenerator();
    
    // Prepare report data
    const reportData = {
      analysisResults: analysisResults as AnalysisResult[],
      company: company as Company,
      settings: {
        language: settings.language || 'ar',
        includeCharts: settings.includeCharts !== false,
        includeRawData: settings.includeRawData || false,
        includeBenchmarks: settings.includeBenchmarks !== false,
        includeRecommendations: settings.includeRecommendations !== false,
        includeExecutiveSummary: settings.includeExecutiveSummary !== false,
        template: settings.template || 'standard',
        branding: settings.branding !== false,
        watermark: settings.watermark || false,
        compression: settings.compression || 'standard'
      }
    };

    // Generate report based on format
    let buffer: Buffer;
    let mimeType: string;
    let fileExtension: string;

    switch (format.toLowerCase()) {
      case 'pdf':
        buffer = await reportGenerator.generatePDF(reportData);
        mimeType = 'application/pdf';
        fileExtension = 'pdf';
        break;
      
      case 'excel':
        buffer = await reportGenerator.generateExcel(reportData);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
        break;
      
      case 'word':
        buffer = await reportGenerator.generateWord(reportData);
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileExtension = 'docx';
        break;
      
      case 'powerpoint':
        buffer = await reportGenerator.generatePowerPoint(reportData);
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        fileExtension = 'pptx';
        break;
      
      case 'html':
        buffer = await reportGenerator.generateHTML(reportData);
        mimeType = 'text/html';
        fileExtension = 'html';
        break;
      
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `FinClick_${company.name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`;

    // Return file as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Report generation failed' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to get supported formats and settings
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      supportedFormats: ['pdf', 'excel', 'word', 'powerpoint', 'html'],
      defaultSettings: {
        language: 'ar',
        includeCharts: true,
        includeRawData: false,
        includeBenchmarks: true,
        includeRecommendations: true,
        includeExecutiveSummary: true,
        template: 'standard',
        branding: true,
        watermark: false,
        compression: 'standard'
      },
      templates: ['standard', 'executive', 'detailed', 'presentation'],
      languages: ['ar', 'en']
    }
  });
}
