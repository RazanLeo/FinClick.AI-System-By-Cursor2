import { NextRequest, NextResponse } from 'next/server';
import { ReportGenerator } from '@/lib/reports/ReportGenerator';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      format, 
      analysisResults, 
      company, 
      settings,
      userId 
    } = body;

    // Validate required data
    if (!format || !analysisResults || !company) {
      return NextResponse.json(
        { error: 'Missing required export data' },
        { status: 400 }
      );
    }

    // Validate format
    const supportedFormats = ['pdf', 'excel', 'word', 'powerpoint', 'html'];
    if (!supportedFormats.includes(format)) {
      return NextResponse.json(
        { error: 'Unsupported export format' },
        { status: 400 }
      );
    }

    // Create export ID
    const exportId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize report generator
    const reportGenerator = new ReportGenerator();

    // Generate report based on format
    let reportBuffer: Buffer;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'pdf':
        reportBuffer = await reportGenerator.generatePDF({
          analysisResults,
          company,
          settings: settings || {}
        });
        filename = `${company.name}_financial_analysis_${new Date().toISOString().split('T')[0]}.pdf`;
        mimeType = 'application/pdf';
        break;

      case 'excel':
        reportBuffer = await reportGenerator.generateExcel({
          analysisResults,
          company,
          settings: settings || {}
        });
        filename = `${company.name}_financial_analysis_${new Date().toISOString().split('T')[0]}.xlsx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;

      case 'word':
        reportBuffer = await reportGenerator.generateWord({
          analysisResults,
          company,
          settings: settings || {}
        });
        filename = `${company.name}_financial_analysis_${new Date().toISOString().split('T')[0]}.docx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;

      case 'powerpoint':
        reportBuffer = await reportGenerator.generatePowerPoint({
          analysisResults,
          company,
          settings: settings || {}
        });
        filename = `${company.name}_financial_analysis_${new Date().toISOString().split('T')[0]}.pptx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;

      case 'html':
        reportBuffer = await reportGenerator.generateHTML({
          analysisResults,
          company,
          settings: settings || {}
        });
        filename = `${company.name}_financial_analysis_${new Date().toISOString().split('T')[0]}.html`;
        mimeType = 'text/html';
        break;

      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(`exports/${exportId}/${filename}`, reportBuffer, {
        contentType: mimeType,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload report');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('reports')
      .getPublicUrl(`exports/${exportId}/${filename}`);

    // Save export record
    const { error: saveError } = await supabase
      .from('report_exports')
      .insert([
        {
          id: exportId,
          user_id: userId,
          company_name: company.name,
          format,
          filename,
          file_url: urlData.publicUrl,
          settings,
          file_size: reportBuffer.length,
          created_at: new Date().toISOString()
        }
      ]);

    if (saveError) {
      console.error('Save export record error:', saveError);
      // Don't fail the request if we can't save the record
    }

    return NextResponse.json({
      success: true,
      exportId,
      downloadUrl: urlData.publicUrl,
      filename,
      fileSize: reportBuffer.length,
      format
    });

  } catch (error) {
    console.error('Export API Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Export failed',
        details: 'Failed to generate or export report'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user's export history
    const { data: exports, error } = await supabase
      .from('report_exports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Fetch exports error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch export history' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      exports: exports || []
    });

  } catch (error) {
    console.error('Get Exports API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
