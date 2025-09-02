'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentSuccessPage() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const transactionId = searchParams.get('tran_ref');
    const paymentResult = searchParams.get('payment_result');

    if (transactionId && paymentResult === 'A') {
      // Payment successful
      setPaymentDetails({
        transactionId,
        status: 'success',
        amount: searchParams.get('cart_amount'),
        currency: searchParams.get('cart_currency')
      });
    } else {
      // Payment failed
      setPaymentDetails({
        status: 'failed',
        error: searchParams.get('response_message') || 'Payment failed'
      });
    }

    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-finclick-gold/5 via-finclick-gold/10 to-finclick-gold/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finclick-gold mx-auto mb-4"></div>
          <p className="text-finclick-gold font-playfair">
            {language === 'ar' ? 'جاري معالجة الدفع...' : 'Processing payment...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-finclick-gold/5 via-finclick-gold/10 to-finclick-gold/5">
      <Header language={language} toggleLanguage={() => {}} showMobileMenu={false} setShowMobileMenu={() => {}} />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {paymentDetails?.status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex p-6 rounded-full bg-finclick-success/10 text-finclick-success mb-6"
                >
                  <CheckCircle className="w-16 h-16" />
                </motion.div>

                {/* Success Message */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-finclick-gold mb-4 font-playfair"
                >
                  {language === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-finclick-gold/70 mb-8 font-playfair"
                >
                  {language === 'ar'
                    ? 'تم تفعيل اشتراكك بنجاح. يمكنك الآن الوصول إلى جميع ميزات FinClick.AI'
                    : 'Your subscription has been activated successfully. You can now access all FinClick.AI features'
                  }
                </motion.p>

                {/* Payment Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 mb-8"
                >
                  <h3 className="text-lg font-semibold text-finclick-gold mb-4 font-playfair">
                    {language === 'ar' ? 'تفاصيل الدفع' : 'Payment Details'}
                  </h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-finclick-gold/70 font-playfair">
                        {language === 'ar' ? 'رقم المعاملة:' : 'Transaction ID:'}
                      </span>
                      <span className="text-finclick-gold font-playfair font-mono">
                        {paymentDetails.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-finclick-gold/70 font-playfair">
                        {language === 'ar' ? 'المبلغ:' : 'Amount:'}
                      </span>
                      <span className="text-finclick-gold font-playfair">
                        {paymentDetails.amount} {paymentDetails.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-finclick-gold/70 font-playfair">
                        {language === 'ar' ? 'الحالة:' : 'Status:'}
                      </span>
                      <span className="text-finclick-success font-playfair">
                        {language === 'ar' ? 'مكتمل' : 'Completed'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <motion.button
                    onClick={() => window.location.href = '/dashboard'}
                    className="btn btn-primary btn-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                    {language === 'ar' ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
                  </motion.button>

                  <motion.button
                    onClick={() => window.location.href = '/reports'}
                    className="btn btn-outline btn-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5" />
                    {language === 'ar' ? 'تحميل الفاتورة' : 'Download Invoice'}
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                {/* Error Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex p-6 rounded-full bg-finclick-error/10 text-finclick-error mb-6"
                >
                  <CheckCircle className="w-16 h-16" />
                </motion.div>

                {/* Error Message */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-finclick-gold mb-4 font-playfair"
                >
                  {language === 'ar' ? 'فشل في الدفع' : 'Payment Failed'}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-finclick-gold/70 mb-8 font-playfair"
                >
                  {language === 'ar'
                    ? 'حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني'
                    : 'An error occurred while processing the payment. Please try again or contact technical support'
                  }
                </motion.p>

                {/* Error Details */}
                {paymentDetails?.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/90 backdrop-blur-sm border border-finclick-error/20 rounded-xl p-6 mb-8"
                  >
                    <h3 className="text-lg font-semibold text-finclick-gold mb-4 font-playfair">
                      {language === 'ar' ? 'تفاصيل الخطأ' : 'Error Details'}
                    </h3>
                    <p className="text-finclick-error font-playfair">
                      {paymentDetails.error}
                    </p>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <motion.button
                    onClick={() => window.location.href = '/pricing'}
                    className="btn btn-primary btn-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                    {language === 'ar' ? 'المحاولة مرة أخرى' : 'Try Again'}
                  </motion.button>

                  <motion.button
                    onClick={() => window.location.href = '/'}
                    className="btn btn-outline btn-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Home className="w-5 h-5" />
                    {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
