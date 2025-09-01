'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Zap, 
  Shield, 
  Globe, 
  Users,
  Award,
  Clock,
  Download,
  MessageSquare,
  BarChart3,
  Brain,
  Database,
  Cpu,
  Target,
  TrendingUp,
  DollarSign,
  CreditCard,
  Wallet,
  Apple
} from 'lucide-react';

interface PricingSectionProps {
  language: 'ar' | 'en';
}

const PricingSection: React.FC<PricingSectionProps> = ({ language }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'guest',
      name: language === 'ar' ? 'زائر' : 'Guest',
      description: language === 'ar' 
        ? 'للتعرف على النظام والميزات الأساسية'
        : 'To explore the system and basic features',
      price: {
        monthly: 0,
        annual: 0
      },
      features: [
        language === 'ar' ? '3 تحليلات مجانية' : '3 Free Analyses',
        language === 'ar' ? 'الأدوات المجانية' : 'Free Tools',
        language === 'ar' ? 'تقارير أساسية' : 'Basic Reports',
        language === 'ar' ? 'دعم البريد الإلكتروني' : 'Email Support',
        language === 'ar' ? 'وصول محدود للبيانات' : 'Limited Data Access'
      ],
      limitations: [
        language === 'ar' ? 'لا يوجد تحليل متقدم' : 'No Advanced Analysis',
        language === 'ar' ? 'لا يوجد تصدير' : 'No Export',
        language === 'ar' ? 'لا يوجد دعم فني' : 'No Technical Support'
      ],
      icon: Users,
      color: 'text-finclick-gold',
      popular: false,
      buttonText: language === 'ar' ? 'ابدأ مجاناً' : 'Start Free',
      buttonVariant: 'outline' as const
    },
    {
      id: 'basic',
      name: language === 'ar' ? 'أساسي' : 'Basic',
      description: language === 'ar' 
        ? 'للأفراد والشركات الصغيرة'
        : 'For individuals and small businesses',
      price: {
        monthly: 99,
        annual: 990
      },
      features: [
        language === 'ar' ? '50 تحليل شهرياً' : '50 Analyses per Month',
        language === 'ar' ? 'جميع الأدوات المجانية' : 'All Free Tools',
        language === 'ar' ? 'تقارير مفصلة' : 'Detailed Reports',
        language === 'ar' ? 'تصدير PDF و Excel' : 'PDF & Excel Export',
        language === 'ar' ? 'دعم فني أساسي' : 'Basic Technical Support',
        language === 'ar' ? 'تحليل أساسي' : 'Basic Analysis',
        language === 'ar' ? 'مقارنة مع الصناعة' : 'Industry Comparison'
      ],
      limitations: [
        language === 'ar' ? 'لا يوجد تحليل متقدم' : 'No Advanced Analysis',
        language === 'ar' ? 'لا يوجد محاكاة' : 'No Simulations'
      ],
      icon: BarChart3,
      color: 'text-finclick-success',
      popular: false,
      buttonText: language === 'ar' ? 'اختر الأساسي' : 'Choose Basic',
      buttonVariant: 'primary' as const
    },
    {
      id: 'professional',
      name: language === 'ar' ? 'احترافي' : 'Professional',
      description: language === 'ar' 
        ? 'للشركات المتوسطة والمحللين الماليين'
        : 'For medium companies and financial analysts',
      price: {
        monthly: 299,
        annual: 2990
      },
      features: [
        language === 'ar' ? 'تحليلات غير محدودة' : 'Unlimited Analyses',
        language === 'ar' ? 'جميع أنواع التحليل' : 'All Analysis Types',
        language === 'ar' ? 'تحليل متقدم' : 'Advanced Analysis',
        language === 'ar' ? 'محاكاة إحصائية' : 'Statistical Simulations',
        language === 'ar' ? 'تقارير مخصصة' : 'Custom Reports',
        language === 'ar' ? 'تصدير جميع الصيغ' : 'All Export Formats',
        language === 'ar' ? 'دعم فني متقدم' : 'Advanced Technical Support',
        language === 'ar' ? 'API الوصول' : 'API Access',
        language === 'ar' ? 'تدريب مجاني' : 'Free Training'
      ],
      limitations: [],
      icon: Crown,
      color: 'text-finclick-warning',
      popular: true,
      buttonText: language === 'ar' ? 'اختر الاحترافي' : 'Choose Professional',
      buttonVariant: 'primary' as const
    },
    {
      id: 'enterprise',
      name: language === 'ar' ? 'مؤسسات' : 'Enterprise',
      description: language === 'ar' 
        ? 'للشركات الكبيرة والمؤسسات المالية'
        : 'For large companies and financial institutions',
      price: {
        monthly: 999,
        annual: 9990
      },
      features: [
        language === 'ar' ? 'جميع الميزات' : 'All Features',
        language === 'ar' ? 'تحليل متخصص' : 'Specialized Analysis',
        language === 'ar' ? 'محاكاة مونت كارلو' : 'Monte Carlo Simulation',
        language === 'ar' ? 'تحليل المخاطر المتقدم' : 'Advanced Risk Analysis',
        language === 'ar' ? 'تقارير مخصصة كاملة' : 'Full Custom Reports',
        language === 'ar' ? 'دعم فني مخصص' : 'Dedicated Technical Support',
        language === 'ar' ? 'مدير حساب مخصص' : 'Dedicated Account Manager',
        language === 'ar' ? 'تدريب شامل' : 'Comprehensive Training',
        language === 'ar' ? 'تكامل مخصص' : 'Custom Integration',
        language === 'ar' ? 'أمان متقدم' : 'Advanced Security'
      ],
      limitations: [],
      icon: Shield,
      color: 'text-finclick-error',
      popular: false,
      buttonText: language === 'ar' ? 'اتصل بنا' : 'Contact Us',
      buttonVariant: 'primary' as const
    }
  ];

  const paymentMethods = [
    { name: 'MADA', icon: CreditCard, color: 'text-green-600' },
    { name: 'PayPal', icon: Wallet, color: 'text-blue-600' },
    { name: 'Visa', icon: CreditCard, color: 'text-blue-800' },
    { name: 'Mastercard', icon: CreditCard, color: 'text-red-600' },
    { name: 'Apple Pay', icon: Apple, color: 'text-black' }
  ];

  const getAnnualDiscount = (monthlyPrice: number) => {
    const annualPrice = monthlyPrice * 12;
    const discountedPrice = annualPrice * 0.9; // 10% discount
    return Math.round(annualPrice - discountedPrice);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-finclick-gold/5 via-finclick-gold/10 to-finclick-gold/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-finclick-gold mb-4 font-playfair">
            {language === 'ar' ? 'خطط الاشتراك' : 'Subscription Plans'}
          </h2>
          <p className="text-xl text-finclick-gold/70 max-w-3xl mx-auto font-playfair mb-8">
            {language === 'ar' 
              ? 'اختر الخطة المناسبة لاحتياجاتك. جميع الخطط تشمل دعم فني متقدم وضمان استرداد الأموال'
              : 'Choose the plan that fits your needs. All plans include advanced technical support and money-back guarantee'
            }
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium transition-colors ${
              billingCycle === 'monthly' ? 'text-finclick-gold' : 'text-finclick-gold/50'
            }`}>
              {language === 'ar' ? 'شهري' : 'Monthly'}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                billingCycle === 'annual' ? 'bg-finclick-gold' : 'bg-finclick-gold/30'
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: billingCycle === 'annual' ? 32 : 4 }}
                transition={{ duration: 0.3 }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${
              billingCycle === 'annual' ? 'text-finclick-gold' : 'text-finclick-gold/50'
            }`}>
              {language === 'ar' ? 'سنوي' : 'Annual'}
            </span>
            {billingCycle === 'annual' && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-finclick-success/20 text-finclick-success text-xs font-medium rounded-full"
              >
                {language === 'ar' ? 'خصم 10%' : '10% OFF'}
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${
                plan.popular ? 'lg:scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-2 bg-finclick-gold text-white text-sm font-medium rounded-full">
                    {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                  </span>
                </div>
              )}
              
              <div className={`p-6 bg-white/90 backdrop-blur-sm border rounded-xl h-full transition-all duration-300 ${
                plan.popular 
                  ? 'border-finclick-gold shadow-lg' 
                  : 'border-finclick-gold/20 hover:border-finclick-gold hover:shadow-lg'
              }`}>
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-lg bg-finclick-gold/10 ${plan.color} mb-4`}>
                    <plan.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-finclick-gold font-playfair mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-finclick-gold/70 font-playfair mb-4">
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl font-bold text-finclick-gold font-playfair">
                        {formatPrice(plan.price[billingCycle])}
                      </span>
                      {plan.price[billingCycle] > 0 && (
                        <span className="text-sm text-finclick-gold/70 font-playfair">
                          /{language === 'ar' ? 'شهر' : 'month'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'annual' && plan.price.monthly > 0 && (
                      <p className="text-sm text-finclick-success font-playfair">
                        {language === 'ar' ? 'توفير' : 'Save'} {formatPrice(getAnnualDiscount(plan.price.monthly))}
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-finclick-gold font-playfair">
                    {language === 'ar' ? 'المميزات:' : 'Features:'}
                  </h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-finclick-success flex-shrink-0" />
                      <span className="text-sm text-finclick-gold/80 font-playfair">
                        {feature}
                      </span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="font-semibold text-finclick-gold font-playfair mt-4">
                        {language === 'ar' ? 'القيود:' : 'Limitations:'}
                      </h4>
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-center gap-2">
                          <X className="w-4 h-4 text-finclick-error flex-shrink-0" />
                          <span className="text-sm text-finclick-gold/60 font-playfair">
                            {limitation}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Action Button */}
                <motion.button
                  className={`w-full btn ${plan.buttonVariant} flex items-center justify-center gap-2`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-8"
        >
          <h3 className="text-lg font-semibold text-finclick-gold mb-4 font-playfair">
            {language === 'ar' ? 'طرق الدفع المدعومة:' : 'Supported Payment Methods:'}
          </h3>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-2 px-3 py-2 bg-white/80 border border-finclick-gold/20 rounded-lg"
              >
                <method.icon className={`w-5 h-5 ${method.color}`} />
                <span className="text-sm text-finclick-gold font-playfair">
                  {method.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm border border-finclick-gold/20 rounded-xl">
            <Shield className="w-8 h-8 text-finclick-success mx-auto mb-3" />
            <h4 className="font-semibold text-finclick-gold mb-2 font-playfair">
              {language === 'ar' ? 'ضمان استرداد الأموال' : 'Money-Back Guarantee'}
            </h4>
            <p className="text-sm text-finclick-gold/70 font-playfair">
              {language === 'ar' 
                ? '30 يوم ضمان استرداد الأموال بالكامل'
                : '30-day full money-back guarantee'
              }
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm border border-finclick-gold/20 rounded-xl">
            <Clock className="w-8 h-8 text-finclick-warning mx-auto mb-3" />
            <h4 className="font-semibold text-finclick-gold mb-2 font-playfair">
              {language === 'ar' ? 'دعم فني 24/7' : '24/7 Technical Support'}
            </h4>
            <p className="text-sm text-finclick-gold/70 font-playfair">
              {language === 'ar' 
                ? 'دعم فني متاح على مدار الساعة'
                : 'Technical support available 24/7'
              }
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm border border-finclick-gold/20 rounded-xl">
            <Award className="w-8 h-8 text-finclick-error mx-auto mb-3" />
            <h4 className="font-semibold text-finclick-gold mb-2 font-playfair">
              {language === 'ar' ? 'شهادات معتمدة' : 'Certified & Secure'}
            </h4>
            <p className="text-sm text-finclick-gold/70 font-playfair">
              {language === 'ar' 
                ? 'شهادات أمان معتمدة دولياً'
                : 'Internationally certified security'
              }
            </p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <h3 className="text-2xl font-bold text-finclick-gold mb-4 font-playfair">
            {language === 'ar' ? 'ابدأ رحلة التحليل المالي المتقدم اليوم' : 'Start Your Advanced Financial Analysis Journey Today'}
          </h3>
          <p className="text-lg text-finclick-gold/70 mb-6 font-playfair">
            {language === 'ar' 
              ? 'انضم إلى آلاف المحللين الماليين المحترفين'
              : 'Join thousands of professional financial analysts'
            }
          </p>
          <motion.button
            className="btn btn-primary btn-lg flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Crown className="w-5 h-5" />
            {language === 'ar' ? 'ابدأ الاشتراك الآن' : 'Start Subscription Now'}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
