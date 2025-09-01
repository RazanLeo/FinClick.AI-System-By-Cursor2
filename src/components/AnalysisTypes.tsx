'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart, 
  Activity,
  Calculator,
  Target,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Brain,
  Cpu,
  Database,
  Shield,
  Globe,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';

interface AnalysisTypesProps {
  language: 'ar' | 'en';
}

const AnalysisTypes: React.FC<AnalysisTypesProps> = ({ language }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredAnalysis, setHoveredAnalysis] = useState<string | null>(null);

  const categories = [
    {
      id: 'level1',
      title: language === 'ar' ? 'التحليل الأساسي' : 'Basic Analysis',
      description: language === 'ar' 
        ? 'التحليلات الأساسية والنسب المالية'
        : 'Basic financial ratios and fundamental analysis',
      icon: Calculator,
      color: 'text-finclick-success',
      count: 45
    },
    {
      id: 'level2',
      title: language === 'ar' ? 'التحليل المتقدم' : 'Advanced Analysis',
      description: language === 'ar' 
        ? 'التحليلات المتقدمة والمقارنات'
        : 'Advanced analysis and comparisons',
      icon: TrendingUp,
      color: 'text-finclick-warning',
      count: 67
    },
    {
      id: 'level3',
      title: language === 'ar' ? 'التحليل المتخصص' : 'Specialized Analysis',
      description: language === 'ar' 
        ? 'التحليلات المتخصصة والمحاكاة'
        : 'Specialized analysis and simulations',
      icon: Brain,
      color: 'text-finclick-error',
      count: 69
    }
  ];

  const analysisTypes = {
    level1: [
      {
        id: 'liquidity-ratios',
        title: language === 'ar' ? 'نسب السيولة' : 'Liquidity Ratios',
        description: language === 'ar' 
          ? 'تحليل قدرة الشركة على سداد التزاماتها قصيرة الأجل'
          : 'Analyze company\'s ability to meet short-term obligations',
        icon: Activity,
        features: [
          language === 'ar' ? 'نسبة السيولة الحالية' : 'Current Ratio',
          language === 'ar' ? 'نسبة السيولة السريعة' : 'Quick Ratio',
          language === 'ar' ? 'نسبة النقدية' : 'Cash Ratio',
          language === 'ar' ? 'نسبة رأس المال العامل' : 'Working Capital Ratio'
        ],
        complexity: 1,
        timeEstimate: language === 'ar' ? '5-10 دقائق' : '5-10 minutes'
      },
      {
        id: 'profitability-ratios',
        title: language === 'ar' ? 'نسب الربحية' : 'Profitability Ratios',
        description: language === 'ar' 
          ? 'تقييم قدرة الشركة على تحقيق الأرباح'
          : 'Evaluate company\'s ability to generate profits',
        icon: TrendingUp,
        features: [
          language === 'ar' ? 'هامش الربح الإجمالي' : 'Gross Profit Margin',
          language === 'ar' ? 'هامش الربح التشغيلي' : 'Operating Profit Margin',
          language === 'ar' ? 'هامش الربح الصافي' : 'Net Profit Margin',
          language === 'ar' ? 'العائد على الأصول' : 'Return on Assets (ROA)',
          language === 'ar' ? 'العائد على حقوق الملكية' : 'Return on Equity (ROE)'
        ],
        complexity: 2,
        timeEstimate: language === 'ar' ? '10-15 دقائق' : '10-15 minutes'
      },
      {
        id: 'efficiency-ratios',
        title: language === 'ar' ? 'نسب الكفاءة' : 'Efficiency Ratios',
        description: language === 'ar' 
          ? 'قياس كفاءة استخدام الشركة لأصولها'
          : 'Measure how efficiently the company uses its assets',
        icon: Zap,
        features: [
          language === 'ar' ? 'دوران الأصول' : 'Asset Turnover',
          language === 'ar' ? 'دوران المخزون' : 'Inventory Turnover',
          language === 'ar' ? 'دوران الذمم المدينة' : 'Accounts Receivable Turnover',
          language === 'ar' ? 'دوران الأصول الثابتة' : 'Fixed Asset Turnover'
        ],
        complexity: 2,
        timeEstimate: language === 'ar' ? '8-12 دقائق' : '8-12 minutes'
      },
      {
        id: 'leverage-ratios',
        title: language === 'ar' ? 'نسب الرافعة المالية' : 'Leverage Ratios',
        description: language === 'ar' 
          ? 'تقييم هيكل رأس المال ومستوى الديون'
          : 'Evaluate capital structure and debt levels',
        icon: BarChart3,
        features: [
          language === 'ar' ? 'نسبة الديون إلى الأصول' : 'Debt-to-Assets Ratio',
          language === 'ar' ? 'نسبة الديون إلى حقوق الملكية' : 'Debt-to-Equity Ratio',
          language === 'ar' ? 'نسبة تغطية الفائدة' : 'Interest Coverage Ratio',
          language === 'ar' ? 'نسبة تغطية الخدمة' : 'Debt Service Coverage Ratio'
        ],
        complexity: 2,
        timeEstimate: language === 'ar' ? '10-15 دقائق' : '10-15 minutes'
      }
    ],
    level2: [
      {
        id: 'comparison-analysis',
        title: language === 'ar' ? 'التحليل المقارن' : 'Comparison Analysis',
        description: language === 'ar' 
          ? 'مقارنة الأداء مع المنافسين والصناعة'
          : 'Compare performance with competitors and industry',
        icon: Users,
        features: [
          language === 'ar' ? 'مقارنة مع المنافسين' : 'Competitor Comparison',
          language === 'ar' ? 'مقارنة مع متوسط الصناعة' : 'Industry Average Comparison',
          language === 'ar' ? 'تحليل الاتجاهات' : 'Trend Analysis',
          language === 'ar' ? 'تحليل الحصة السوقية' : 'Market Share Analysis'
        ],
        complexity: 3,
        timeEstimate: language === 'ar' ? '15-25 دقائق' : '15-25 minutes'
      },
      {
        id: 'performance-analysis',
        title: language === 'ar' ? 'تحليل الأداء' : 'Performance Analysis',
        description: language === 'ar' 
          ? 'تقييم شامل لأداء الشركة عبر الزمن'
          : 'Comprehensive evaluation of company performance over time',
        icon: LineChart,
        features: [
          language === 'ar' ? 'تحليل الاتجاهات الزمنية' : 'Time Series Analysis',
          language === 'ar' ? 'تحليل الموسمية' : 'Seasonality Analysis',
          language === 'ar' ? 'تحليل النمو' : 'Growth Analysis',
          language === 'ar' ? 'تحليل التقلبات' : 'Volatility Analysis'
        ],
        complexity: 3,
        timeEstimate: language === 'ar' ? '20-30 دقائق' : '20-30 minutes'
      },
      {
        id: 'valuation-analysis',
        title: language === 'ar' ? 'تحليل التقييم' : 'Valuation Analysis',
        description: language === 'ar' 
          ? 'تقييم القيمة العادلة للشركة'
          : 'Evaluate fair value of the company',
        icon: Target,
        features: [
          language === 'ar' ? 'نموذج التدفقات النقدية المخصومة' : 'Discounted Cash Flow (DCF)',
          language === 'ar' ? 'نموذج الأرباح المخصومة' : 'Discounted Earnings Model',
          language === 'ar' ? 'تحليل الأصول' : 'Asset-Based Valuation',
          language === 'ar' ? 'تحليل السوق' : 'Market-Based Valuation'
        ],
        complexity: 4,
        timeEstimate: language === 'ar' ? '25-40 دقائق' : '25-40 minutes'
      }
    ],
    level3: [
      {
        id: 'statistical-analysis',
        title: language === 'ar' ? 'التحليل الإحصائي' : 'Statistical Analysis',
        description: language === 'ar' 
          ? 'تحليل إحصائي متقدم للبيانات المالية'
          : 'Advanced statistical analysis of financial data',
        icon: Cpu,
        features: [
          language === 'ar' ? 'تحليل الانحدار' : 'Regression Analysis',
          language === 'ar' ? 'تحليل الارتباط' : 'Correlation Analysis',
          language === 'ar' ? 'تحليل التباين' : 'Variance Analysis',
          language === 'ar' ? 'تحليل السلاسل الزمنية' : 'Time Series Analysis'
        ],
        complexity: 5,
        timeEstimate: language === 'ar' ? '30-45 دقائق' : '30-45 minutes'
      },
      {
        id: 'risk-analysis',
        title: language === 'ar' ? 'تحليل المخاطر' : 'Risk Analysis',
        description: language === 'ar' 
          ? 'تقييم شامل للمخاطر المالية'
          : 'Comprehensive assessment of financial risks',
        icon: Shield,
        features: [
          language === 'ar' ? 'تحليل مخاطر السوق' : 'Market Risk Analysis',
          language === 'ar' ? 'تحليل مخاطر الائتمان' : 'Credit Risk Analysis',
          language === 'ar' ? 'تحليل مخاطر التشغيل' : 'Operational Risk Analysis',
          language === 'ar' ? 'تحليل مخاطر السيولة' : 'Liquidity Risk Analysis'
        ],
        complexity: 5,
        timeEstimate: language === 'ar' ? '35-50 دقائق' : '35-50 minutes'
      },
      {
        id: 'scenario-analysis',
        title: language === 'ar' ? 'تحليل السيناريوهات' : 'Scenario Analysis',
        description: language === 'ar' 
          ? 'محاكاة سيناريوهات مختلفة للأداء المستقبلي'
          : 'Simulate different scenarios for future performance',
        icon: Globe,
        features: [
          language === 'ar' ? 'سيناريو متفائل' : 'Optimistic Scenario',
          language === 'ar' ? 'سيناريو متشائم' : 'Pessimistic Scenario',
          language === 'ar' ? 'سيناريو محايد' : 'Base Scenario',
          language === 'ar' ? 'تحليل الحساسية' : 'Sensitivity Analysis'
        ],
        complexity: 4,
        timeEstimate: language === 'ar' ? '40-60 دقائق' : '40-60 minutes'
      },
      {
        id: 'monte-carlo-simulation',
        title: language === 'ar' ? 'محاكاة مونت كارلو' : 'Monte Carlo Simulation',
        description: language === 'ar' 
          ? 'محاكاة إحصائية متقدمة للتنبؤ بالأداء'
          : 'Advanced statistical simulation for performance prediction',
        icon: Database,
        features: [
          language === 'ar' ? 'محاكاة 10,000+ سيناريو' : '10,000+ Scenario Simulation',
          language === 'ar' ? 'تحليل التوزيع الاحتمالي' : 'Probability Distribution Analysis',
          language === 'ar' ? 'تحليل القيم المتطرفة' : 'Outlier Analysis',
          language === 'ar' ? 'تحليل الثقة' : 'Confidence Interval Analysis'
        ],
        complexity: 5,
        timeEstimate: language === 'ar' ? '45-75 دقائق' : '45-75 minutes'
      }
    ]
  };

  const getComplexityStars = (complexity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < complexity ? 'text-finclick-gold fill-current' : 'text-finclick-gold/20'
        }`}
      />
    ));
  };

  const getComplexityText = (complexity: number) => {
    switch (complexity) {
      case 1: return language === 'ar' ? 'سهل' : 'Easy';
      case 2: return language === 'ar' ? 'متوسط' : 'Medium';
      case 3: return language === 'ar' ? 'متقدم' : 'Advanced';
      case 4: return language === 'ar' ? 'متخصص' : 'Expert';
      case 5: return language === 'ar' ? 'خبير' : 'Master';
      default: return '';
    }
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
            {language === 'ar' ? 'أنواع التحليل المالي' : 'Financial Analysis Types'}
          </h2>
          <p className="text-xl text-finclick-gold/70 max-w-4xl mx-auto font-playfair">
            {language === 'ar' 
              ? 'مجموعة شاملة من 181+ نوع تحليل مالي متقدم، من التحليل الأساسي إلى المحاكاة الإحصائية المتقدمة'
              : 'A comprehensive suite of 181+ advanced financial analysis types, from basic analysis to advanced statistical simulations'
            }
          </p>
        </motion.div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`cursor-pointer transition-all duration-300 ${
                selectedCategory === category.id ? 'scale-105' : 'hover:scale-102'
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <div className={`p-6 bg-white/80 backdrop-blur-sm border rounded-xl transition-all duration-300 ${
                selectedCategory === category.id 
                  ? 'border-finclick-gold bg-white shadow-lg' 
                  : 'border-finclick-gold/20 hover:border-finclick-gold hover:bg-white hover:shadow-lg'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-finclick-gold/10 ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
                      {category.title}
                    </h3>
                    <p className="text-sm text-finclick-gold/70 font-playfair">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-finclick-gold/70 font-playfair">
                    {category.count} {language === 'ar' ? 'تحليل' : 'Analyses'}
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${
                    selectedCategory === category.id ? 'rotate-90' : ''
                  }`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analysis Types Grid */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analysisTypes[selectedCategory as keyof typeof analysisTypes]?.map((analysis, index) => (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                    onMouseEnter={() => setHoveredAnalysis(analysis.id)}
                    onMouseLeave={() => setHoveredAnalysis(null)}
                  >
                    <div className="p-6 bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl hover:border-finclick-gold transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-finclick-gold/10 text-finclick-gold">
                          <analysis.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-finclick-gold font-playfair mb-2">
                            {analysis.title}
                          </h3>
                          <p className="text-sm text-finclick-gold/70 font-playfair mb-3">
                            {analysis.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-finclick-gold/60 font-playfair">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {analysis.timeEstimate}
                            </div>
                            <div className="flex items-center gap-1">
                              {getComplexityStars(analysis.complexity)}
                              <span className="ml-1">{getComplexityText(analysis.complexity)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-finclick-gold font-playfair">
                          {language === 'ar' ? 'المميزات:' : 'Features:'}
                        </h4>
                        <div className="grid grid-cols-1 gap-1">
                          {analysis.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-finclick-success" />
                              <span className="text-xs text-finclick-gold/70 font-playfair">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <motion.button
                        className="w-full mt-4 btn btn-primary flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Award className="w-4 h-4" />
                        {language === 'ar' ? 'ابدأ التحليل' : 'Start Analysis'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-6 bg-finclick-gold/10 border border-finclick-gold/20 rounded-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-finclick-gold font-playfair">
                      {analysisTypes[selectedCategory as keyof typeof analysisTypes]?.length}
                    </p>
                    <p className="text-sm text-finclick-gold/70 font-playfair">
                      {language === 'ar' ? 'أنواع التحليل' : 'Analysis Types'}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-finclick-gold font-playfair">
                      {analysisTypes[selectedCategory as keyof typeof analysisTypes]?.reduce((acc, analysis) => acc + analysis.features.length, 0)}
                    </p>
                    <p className="text-sm text-finclick-gold/70 font-playfair">
                      {language === 'ar' ? 'المميزات' : 'Features'}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-finclick-gold font-playfair">
                      {Math.max(...(analysisTypes[selectedCategory as keyof typeof analysisTypes]?.map(a => a.complexity) || [0]))}
                    </p>
                    <p className="text-sm text-finclick-gold/70 font-playfair">
                      {language === 'ar' ? 'أعلى مستوى تعقيد' : 'Max Complexity'}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-finclick-gold font-playfair">
                      {language === 'ar' ? 'AI' : 'AI'}
                    </p>
                    <p className="text-sm text-finclick-gold/70 font-playfair">
                      {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI Powered'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <h3 className="text-2xl font-bold text-finclick-gold mb-4 font-playfair">
            {language === 'ar' ? 'ابدأ رحلة التحليل المالي المتقدم' : 'Start Your Advanced Financial Analysis Journey'}
          </h3>
          <p className="text-lg text-finclick-gold/70 mb-6 font-playfair">
            {language === 'ar' 
              ? 'اكتشف قوة الذكاء الاصطناعي في التحليل المالي'
              : 'Discover the power of AI in financial analysis'
            }
          </p>
          <motion.button
            className="btn btn-primary btn-lg flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Brain className="w-5 h-5" />
            {language === 'ar' ? 'ابدأ التحليل الآن' : 'Start Analysis Now'}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalysisTypes;
