import { NextRequest, NextResponse } from 'next/server';
import { paytabsIntegration } from '@/lib/payment/paytabs-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tran_ref, payment_result } = body;

    if (!tran_ref) {
      return NextResponse.json(
        { success: false, error: 'Missing transaction reference' },
        { status: 400 }
      );
    }

    // Verify payment
    const verificationResult = await paytabsIntegration.verifyPaymentCallback(tran_ref);

    if (verificationResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: verificationResult.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
