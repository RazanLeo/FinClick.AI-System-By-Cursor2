import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    // Fetch analysis from database
    const { data: analysis, error } = await supabase
      .from('financial_analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch analysis' },
        { status: 500 }
      );
    }

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Check if user has access (optional - implement based on your auth system)
    if (userId && analysis.user_id !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Return analysis data with proper structure
    const responseData = {
      id: analysis.id,
      status: analysis.status,
      progress: analysis.progress || 0,
      company: analysis.company_data,
      results: analysis.results?.analysisResults || [],
      executiveSummary: analysis.results?.executiveSummary,
      recommendations: analysis.results?.recommendations,
      aiInsights: analysis.results?.aiInsights,
      metadata: analysis.results?.metadata,
      createdAt: analysis.created_at,
      completedAt: analysis.completed_at,
      error: analysis.error,
      statusMessage: analysis.status_message
    };

    return NextResponse.json({
      success: true,
      ...responseData
    });

  } catch (error) {
    console.error('Get Analysis by ID API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = params.id;
    const body = await request.json();
    const { userId, updates } = body;

    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    // Check if analysis exists and user has access
    const { data: existingAnalysis, error: fetchError } = await supabase
      .from('financial_analyses')
      .select('user_id')
      .eq('id', analysisId)
      .single();

    if (fetchError || !existingAnalysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    if (userId && existingAnalysis.user_id !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update analysis
    const { data: updatedAnalysis, error: updateError } = await supabase
      .from('financial_analyses')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', analysisId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update analysis' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: updatedAnalysis
    });

  } catch (error) {
    console.error('Update Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    // Check if analysis exists and user has access
    const { data: existingAnalysis, error: fetchError } = await supabase
      .from('financial_analyses')
      .select('user_id')
      .eq('id', analysisId)
      .single();

    if (fetchError || !existingAnalysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    if (userId && existingAnalysis.user_id !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Delete analysis
    const { error: deleteError } = await supabase
      .from('financial_analyses')
      .delete()
      .eq('id', analysisId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete analysis' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Analysis deleted successfully'
    });

  } catch (error) {
    console.error('Delete Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
