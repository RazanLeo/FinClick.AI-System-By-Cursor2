import { AuthSystem } from '@/lib/auth/auth-system';

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

export interface SubscriptionPayment {
  userId: string;
  planId: string;
  planType: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  paymentMethod: 'mada' | 'visa' | 'mastercard' | 'paypal' | 'apple_pay';
}

export class PayTabsIntegration {
  private static instance: PayTabsIntegration;
  private readonly authSystem: AuthSystem;
  
  // PayTabs API Configuration
  private readonly PAYTABS_API_URL = 'https://secure.paytabs.sa/payment/request';
  private readonly PAYTABS_PROFILE_ID = process.env.PAYTABS_PROFILE_ID!;
  private readonly PAYTABS_SERVER_KEY = process.env.PAYTABS_SERVER_KEY!;
  private readonly PAYTABS_CLIENT_KEY = process.env.PAYTABS_CLIENT_KEY!;
  
  private constructor() {
    this.authSystem = AuthSystem.getInstance();
  }
  
  public static getInstance(): PayTabsIntegration {
    if (!PayTabsIntegration.instance) {
      PayTabsIntegration.instance = new PayTabsIntegration();
    }
    return PayTabsIntegration.instance;
  }

  /**
   * Create payment request for subscription
   */
  async createSubscriptionPayment(payment: SubscriptionPayment): Promise<PaymentResponse> {
    try {
      const orderId = `finclick_${payment.userId}_${Date.now()}`;
      
      const paymentRequest: PaymentRequest = {
        amount: payment.amount,
        currency: 'SAR',
        orderId: orderId,
        customerEmail: await this.getUserEmail(payment.userId),
        customerName: await this.getUserName(payment.userId),
        description: `FinClick.AI ${payment.planType} subscription`,
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancel`
      };

      const paytabsResponse = await this.createPayTabsPayment(paymentRequest);
      
      if (paytabsResponse.success) {
        // Store payment session
        await this.storePaymentSession({
          userId: payment.userId,
          planId: payment.planId,
          planType: payment.planType,
          amount: payment.amount,
          orderId: orderId,
          transactionId: paytabsResponse.transactionId,
          status: 'pending'
        });
      }

      return paytabsResponse;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed'
      };
    }
  }

  /**
   * Create PayTabs payment request
   */
  private async createPayTabsPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paytabsData = {
        profile_id: this.PAYTABS_PROFILE_ID,
        tran_type: 'sale',
        tran_class: 'ecom',
        cart_id: request.orderId,
        cart_currency: request.currency,
        cart_amount: request.amount,
        cart_description: request.description,
        paypage_lang: 'ar',
        customer_details: {
          name: request.customerName,
          email: request.customerEmail,
          phone: request.customerPhone || '',
          street1: request.customerAddress || '',
          city: 'Riyadh',
          state: 'Riyadh',
          country: 'SA',
          zip: '12345'
        },
        shipping_details: {
          name: request.customerName,
          email: request.customerEmail,
          phone: request.customerPhone || '',
          street1: request.customerAddress || '',
          city: 'Riyadh',
          state: 'Riyadh',
          country: 'SA',
          zip: '12345'
        },
        return: request.returnUrl,
        callback: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback`
      };

      const response = await fetch(this.PAYTABS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.PAYTABS_SERVER_KEY
        },
        body: JSON.stringify(paytabsData)
      });

      const result = await response.json();

      if (result.response_code === '4000') {
        return {
          success: true,
          paymentUrl: result.redirect_url,
          transactionId: result.tran_ref
        };
      } else {
        return {
          success: false,
          error: result.response_message || 'Payment creation failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment request failed'
      };
    }
  }

  /**
   * Verify payment callback
   */
  async verifyPaymentCallback(transactionId: string): Promise<{
    success: boolean;
    paymentSession?: any;
    error?: string;
  }> {
    try {
      const verifyUrl = 'https://secure.paytabs.sa/payment/query';
      
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.PAYTABS_SERVER_KEY
        },
        body: JSON.stringify({
          profile_id: this.PAYTABS_PROFILE_ID,
          tran_ref: transactionId
        })
      });

      const result = await response.json();

      if (result.response_code === '4000' && result.payment_result?.response_status === 'A') {
        // Payment successful
        const paymentSession = await this.getPaymentSession(transactionId);
        
        if (paymentSession) {
          // Activate subscription
          await this.activateSubscription(paymentSession);
          
          return {
            success: true,
            paymentSession
          };
        }
      }

      return {
        success: false,
        error: 'Payment verification failed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed'
      };
    }
  }

  /**
   * Get supported payment methods
   */
  getSupportedPaymentMethods(): Array<{
    id: string;
    name: string;
    nameAr: string;
    icon: string;
    enabled: boolean;
  }> {
    return [
      {
        id: 'mada',
        name: 'MADA',
        nameAr: 'مدى',
        icon: '💳',
        enabled: true
      },
      {
        id: 'visa',
        name: 'Visa',
        nameAr: 'فيزا',
        icon: '💳',
        enabled: true
      },
      {
        id: 'mastercard',
        name: 'Mastercard',
        nameAr: 'ماستركارد',
        icon: '💳',
        enabled: true
      },
      {
        id: 'paypal',
        name: 'PayPal',
        nameAr: 'باي بال',
        icon: '💰',
        enabled: true
      },
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        nameAr: 'آبل باي',
        icon: '🍎',
        enabled: true
      }
    ];
  }

  /**
   * Helper methods
   */
  private async getUserEmail(userId: string): Promise<string> {
    const userResponse = await this.authSystem.getCurrentUser();
    return userResponse.user?.email || '';
  }

  private async getUserName(userId: string): Promise<string> {
    const userResponse = await this.authSystem.getCurrentUser();
    return userResponse.user?.name || '';
  }

  private async storePaymentSession(session: any): Promise<void> {
    // Store in database or cache
    // Implementation depends on your database setup
  }

  private async getPaymentSession(transactionId: string): Promise<any> {
    // Retrieve from database or cache
    // Implementation depends on your database setup
    return null;
  }

  private async activateSubscription(paymentSession: any): Promise<void> {
    await this.authSystem.createSubscription(
      paymentSession.userId,
      paymentSession.planId,
      {
        transactionId: paymentSession.transactionId,
        amount: paymentSession.amount,
        currency: 'SAR',
        paymentMethod: paymentSession.paymentMethod
      }
    );
  }
}

// Export singleton instance
export const paytabsIntegration = PayTabsIntegration.getInstance();
