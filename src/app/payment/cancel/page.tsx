'use client';

import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentCancelPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-finclick-gold/5 via-finclick-gold/10 to-finclick-gold/5">
      <Header language={language} toggleLanguage={() => {}} showMobileMenu={false} setShowMobileMenu={() => {}} />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Cancel Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex p-6 rounded-full bg-finclick-warning/10 text-finclick-warning mb-6"
              >
                <XCircle className="w-16 h-16" />
              </motion.div>

              {/* Cancel Message */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-finclick-gold mb-4 font-playfair"
              >
                {language === 'ar' ? 'تم إلغاء الدفع' : 'Payment Cancelled'}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-finclick-gold/70 mb-8 font-playfair"
              >
                {language === 'ar'
                  ? 'تم إلغاء عملية الدفع. لم يتم خصم أي مبلغ من حسابك'
                  : 'Payment process has been cancelled. No amount has been charged to your account'
                }
              </motion.p>

              {/* Information Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/90 backdrop-blur-sm border border-finclick-warning/20 rounded-xl p-6 mb-8"
              >
                <h3 className="text-lg font-semibold text-finclick-gold mb-4 font-playfair">
                  {language === 'ar' ? 'معلومات مهمة' : 'Important Information'}
                </h3>
                <div className="space-y-2 text-left">
                  <p className="text-finclick-gold/70 font-playfair">
                    {language === 'ar'
                      ? '• لم يتم خصم أي مبلغ من حسابك'
                      : '• No amount has been charged to your account'
                    }
                  </p>
                  <p className="text-finclick-gold/70 font-playfair">
                    {language === 'ar'
                      ? '• يمكنك المحاولة مرة أخرى في أي وقت'
                      : '• You can try again at any time'
                    }
                  </p>
                  <p className="text-finclick-gold/70 font-playfair">
                    {language === 'ar'
                      ? '• للدعم الفني، يرجى الاتصال بنا'
                      : '• For technical support, please contact us'
                    }
                  </p>
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
                  onClick={() => window.location.href = '/pricing'}
                  className="btn btn-primary btn-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-5 h-5" />
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
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
