import { NextRequest, NextResponse } from 'next/server';
import { paytabsIntegration } from '@/lib/payment/paytabs-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId, planType, amount, paymentMethod } = body;

    // Validate required fields
    if (!userId || !planId || !planType || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create payment
    const paymentResponse = await paytabsIntegration.createSubscriptionPayment({
      userId,
      planId,
      planType,
      amount,
      currency: 'SAR',
      paymentMethod: paymentMethod || 'mada'
    });

    if (paymentResponse.success) {
      return NextResponse.json({
        success: true,
        paymentUrl: paymentResponse.paymentUrl,
        transactionId: paymentResponse.transactionId
      });
    } else {
      return NextResponse.json(
        { success: false, error: paymentResponse.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
