import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  CreditCard, 
  Shield, 
  Clock,
  Users,
  BarChart3,
  FileText,
  Download,
  Headphones
} from 'lucide-react';
import { Card, Button, Alert } from '../components';

const SubscriptionPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // خطط الاشتراك
  const plans = [
    {
      id: 'free',
      name: t('subscription.free'),
      price: 0,
      currency: 'SAR',
      period: t('subscription.monthly'),
      description: t('subscription.freeDesc'),
      icon: Star,
      color: 'bg-gray-500',
      features: [
        t('subscription.freeFeature1'),
        t('subscription.freeFeature2'),
        t('subscription.freeFeature3'),
        t('subscription.freeFeature4')
      ],
      limitations: [
        t('subscription.freeLimit1'),
        t('subscription.freeLimit2'),
        t('subscription.freeLimit3')
      ],
      popular: false
    },
    {
      id: 'basic',
      name: t('subscription.basic'),
      price: 99,
      currency: 'SAR',
      period: t('subscription.monthly'),
      description: t('subscription.basicDesc'),
      icon: Zap,
      color: 'bg-blue-500',
      features: [
        t('subscription.basicFeature1'),
        t('subscription.basicFeature2'),
        t('subscription.basicFeature3'),
        t('subscription.basicFeature4'),
        t('subscription.basicFeature5'),
        t('subscription.basicFeature6')
      ],
      limitations: [
        t('subscription.basicLimit1'),
        t('subscription.basicLimit2')
      ],
      popular: false
    },
    {
      id: 'pro',
      name: t('subscription.pro'),
      price: 199,
      currency: 'SAR',
      period: t('subscription.monthly'),
      description: t('subscription.proDesc'),
      icon: Crown,
      color: 'bg-purple-500',
      features: [
        t('subscription.proFeature1'),
        t('subscription.proFeature2'),
        t('subscription.proFeature3'),
        t('subscription.proFeature4'),
        t('subscription.proFeature5'),
        t('subscription.proFeature6'),
        t('subscription.proFeature7'),
        t('subscription.proFeature8')
      ],
      limitations: [],
      popular: true
    },
    {
      id: 'enterprise',
      name: t('subscription.enterprise'),
      price: 499,
      currency: 'SAR',
      period: t('subscription.monthly'),
      description: t('subscription.enterpriseDesc'),
      icon: Crown,
      color: 'bg-yellow-500',
      features: [
        t('subscription.enterpriseFeature1'),
        t('subscription.enterpriseFeature2'),
        t('subscription.enterpriseFeature3'),
        t('subscription.enterpriseFeature4'),
        t('subscription.enterpriseFeature5'),
        t('subscription.enterpriseFeature6'),
        t('subscription.enterpriseFeature7'),
        t('subscription.enterpriseFeature8'),
        t('subscription.enterpriseFeature9')
      ],
      limitations: [],
      popular: false
    }
  ];

  // معالجة الاشتراك
  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);

    // محاكاة عملية الدفع
    setTimeout(() => {
      setIsProcessing(false);
      // هنا سيتم توجيه المستخدم إلى بوابة الدفع
      console.log(`Subscribing to ${planId} plan`);
    }, 2000);
  };

  // مقارنة الخطط
  const comparisonFeatures = [
    {
      name: t('subscription.analysisTypes'),
      free: '5',
      basic: '50',
      pro: '170+',
      enterprise: '170+'
    },
    {
      name: t('subscription.documentsPerMonth'),
      free: '3',
      basic: '25',
      pro: '100',
      enterprise: 'Unlimited'
    },
    {
      name: t('subscription.reportsPerMonth'),
      free: '2',
      basic: '15',
      pro: '50',
      enterprise: 'Unlimited'
    },
    {
      name: t('subscription.aiModels'),
      free: 'Basic',
      basic: 'Standard',
      pro: 'Advanced',
      enterprise: 'Premium'
    },
    {
      name: t('subscription.support'),
      free: 'Email',
      basic: 'Email + Chat',
      pro: 'Priority Support',
      enterprise: '24/7 Dedicated'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('subscription.pageTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('subscription.pageSubtitle')}
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Current Plan Alert */}
        <div className="mb-8">
          <Alert
            type="info"
            title={t('subscription.currentPlan')}
            message={t('subscription.currentPlanDesc')}
          />
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative p-6 ${
                plan.popular ? 'ring-2 ring-purple-500 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {t('subscription.mostPopular')}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`${plan.color} p-3 rounded-full inline-block mb-4`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price === 0 ? t('subscription.free') : plan.price}
                  </span>
                  {plan.price > 0 && (
                    <>
                      <span className="text-gray-600 dark:text-gray-400 text-lg">
                        {plan.currency}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        /{plan.period}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              {plan.limitations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('subscription.limitations')}:
                  </h4>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Subscribe Button */}
              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isProcessing && selectedPlan === plan.id}
                className={`w-full ${
                  plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''
                }`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    {t('subscription.processing')}
                  </>
                ) : plan.id === 'free' ? (
                  t('subscription.currentPlan')
                ) : (
                  t('subscription.subscribe')
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {t('subscription.comparisonTitle')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('subscription.feature')}
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('subscription.free')}
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('subscription.basic')}
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('subscription.pro')}
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('subscription.enterprise')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        {feature.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-center text-gray-600 dark:text-gray-400">
                        {feature.free}
                      </td>
                      <td className="py-3 px-4 text-sm text-center text-gray-600 dark:text-gray-400">
                        {feature.basic}
                      </td>
                      <td className="py-3 px-4 text-sm text-center text-gray-600 dark:text-gray-400">
                        {feature.pro}
                      </td>
                      <td className="py-3 px-4 text-sm text-center text-gray-600 dark:text-gray-400">
                        {feature.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {t('subscription.whyChooseUs')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('subscription.securityTitle')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('subscription.securityDesc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('subscription.speedTitle')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('subscription.speedDesc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('subscription.supportTitle')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('subscription.supportDesc')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {t('subscription.faqTitle')}
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('subscription.faq1Question')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('subscription.faq1Answer')}
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('subscription.faq2Question')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('subscription.faq2Answer')}
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('subscription.faq3Question')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('subscription.faq3Answer')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('subscription.needHelp')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('subscription.contactSupportDesc')}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline">
                <Headphones className="w-4 h-4 mr-2" />
                {t('subscription.contactSupport')}
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                {t('subscription.viewDocumentation')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
