'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Calendar,
  TrendingUp,
  DollarSign,
  BarChart3,
  Brain,
  Bot,
  Activity,
  ArrowRight,
  Download,
  Share2,
  Copy,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Star,
  Users,
  Target,
  PieChart,
  LineChart,
  Zap,
  Shield,
  Globe,
  Database,
  Cpu,
  Crown,
  Play,
  Pause,
  RefreshCw,
  Settings,
  HelpCircle,
  BookOpen,
  FileText,
  Image,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Link,
  Mail,
  Phone,
  MapPin,
  Globe as GlobeIcon,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Gitlab,
  Bitbucket,
  Slack,
  Discord,
  Telegram,
  WhatsApp,
  Skype,
  Zoom,
  Teams,
  Google,
  Apple,
  Microsoft,
  Amazon,
  Netflix,
  Spotify,
  Uber,
  Airbnb,
  Tesla,
  SpaceX,
  OpenAI,
  Anthropic,
  GoogleAI,
  Meta,
  AppleAI,
  MicrosoftAI,
  AmazonAI,
  NetflixAI,
  SpotifyAI,
  UberAI,
  AirbnbAI,
  TeslaAI,
  SpaceXAI,
  OpenAIAI,
  AnthropicAI,
  GoogleAIAI,
  MetaAI,
  AppleAIAI,
  MicrosoftAIAI,
  AmazonAIAI,
  NetflixAIAI,
  SpotifyAIAI,
  UberAIAI,
  AirbnbAIAI,
  TeslaAIAI,
  SpaceXAIAI
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Tool {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  englishDescription: string;
  icon: any;
  color: string;
  category: string;
  isActive: boolean;
  features: string[];
  englishFeatures: string[];
}

export default function ToolsPage() {
  const { language, toggleLanguage } = useLanguage();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const tools: Tool[] = [
    {
      id: 'economic-calendar',
      title: 'التقويم الاقتصادي',
      englishTitle: 'Economic Calendar',
      description: 'تقويم شامل للأحداث الاقتصادية العالمية مع تحليل التأثير على الأسواق',
      englishDescription: 'Comprehensive calendar of global economic events with market impact analysis',
      icon: Calendar,
      color: 'text-finclick-success',
      category: 'market',
      isActive: true,
      features: [
        'أحداث اقتصادية عالمية',
        'تحليل تأثير السوق',
        'تنبيهات فورية',
        'تصفية حسب البلد والقطاع'
      ],
      englishFeatures: [
        'Global economic events',
        'Market impact analysis',
        'Real-time alerts',
        'Filter by country and sector'
      ]
    },
    {
      id: 'fair-stock-price',
      title: 'حاسبة السعر العادل للسهم',
      englishTitle: 'Fair Stock Price Calculator',
      description: 'حساب السعر العادل للسهم باستخدام نماذج التقييم المتقدمة',
      englishDescription: 'Calculate fair stock price using advanced valuation models',
      icon: DollarSign,
      color: 'text-finclick-warning',
      category: 'valuation',
      isActive: true,
      features: [
        'نموذج خصم التدفقات النقدية',
        'نموذج مضاعف الأرباح',
        'نموذج الأصول الصافية',
        'مقارنة مع السعر الحالي'
      ],
      englishFeatures: [
        'Discounted Cash Flow model',
        'Price-to-Earnings model',
        'Net Asset Value model',
        'Comparison with current price'
      ]
    },
    {
      id: 'roi-calculator',
      title: 'حاسبة العائد على الاستثمار',
      englishTitle: 'ROI Calculator',
      description: 'حساب العائد على الاستثمار مع تحليل المخاطر والسيناريوهات المختلفة',
      englishDescription: 'Calculate return on investment with risk analysis and different scenarios',
      icon: TrendingUp,
      color: 'text-finclick-error',
      category: 'investment',
      isActive: true,
      features: [
        'حساب العائد الأساسي',
        'تحليل المخاطر',
        'سيناريوهات متعددة',
        'مقارنة الاستثمارات'
      ],
      englishFeatures: [
        'Basic return calculation',
        'Risk analysis',
        'Multiple scenarios',
        'Investment comparison'
      ]
    },
    {
      id: 'pe-ratio',
      title: 'حاسبة نسبة السعر إلى الربح',
      englishTitle: 'P/E Ratio Calculator',
      description: 'حساب وتحليل نسبة السعر إلى الربح مع مقارنة الصناعة',
      englishDescription: 'Calculate and analyze Price-to-Earnings ratio with industry comparison',
      icon: BarChart3,
      color: 'text-finclick-info',
      category: 'valuation',
      isActive: true,
      features: [
        'حساب النسبة الأساسية',
        'مقارنة الصناعة',
        'تحليل الاتجاه',
        'توقعات المستقبل'
      ],
      englishFeatures: [
        'Basic ratio calculation',
        'Industry comparison',
        'Trend analysis',
        'Future projections'
      ]
    },
    {
      id: 'inflation-calculator',
      title: 'حاسبة التضخم',
      englishTitle: 'Inflation Calculator',
      description: 'حساب تأثير التضخم على القوة الشرائية والقيم المستقبلية',
      englishDescription: 'Calculate inflation impact on purchasing power and future values',
      icon: Activity,
      color: 'text-finclick-success',
      category: 'economic',
      isActive: true,
      features: [
        'حساب القوة الشرائية',
        'توقعات التضخم',
        'تأثير الاستثمارات',
        'مقارنة الفترات الزمنية'
      ],
      englishFeatures: [
        'Purchasing power calculation',
        'Inflation projections',
        'Investment impact',
        'Time period comparison'
      ]
    },
    {
      id: 'market-sentiment',
      title: 'مؤشر معنويات السوق التفاعلي',
      englishTitle: 'Interactive Market Sentiment',
      description: 'تحليل معنويات السوق باستخدام الذكاء الاصطناعي والبيانات الضخمة',
      englishDescription: 'Analyze market sentiment using AI and big data',
      icon: Brain,
      color: 'text-finclick-warning',
      category: 'market',
      isActive: true,
      features: [
        'تحليل الذكاء الاصطناعي',
        'بيانات وسائل التواصل',
        'مؤشرات معنويات السوق',
        'تنبؤات الاتجاه'
      ],
      englishFeatures: [
        'AI analysis',
        'Social media data',
        'Market sentiment indicators',
        'Trend predictions'
      ]
    },
    {
      id: 'financial-gpt',
      title: 'روبوت الذكاء الاصطناعي المالي',
      englishTitle: 'Financial GPT Bot',
      description: 'روبوت ذكي للإجابة على الأسئلة المالية والتحليل المتقدم',
      englishDescription: 'Intelligent bot for financial questions and advanced analysis',
      icon: Bot,
      color: 'text-finclick-error',
      category: 'ai',
      isActive: true,
      features: [
        'أسئلة مالية ذكية',
        'تحليل متقدم',
        'توصيات استثمارية',
        'تعلم مستمر'
      ],
      englishFeatures: [
        'Smart financial questions',
        'Advanced analysis',
        'Investment recommendations',
        'Continuous learning'
      ]
    }
  ];

  const categories = [
    { id: 'all', name: language === 'ar' ? 'الكل' : 'All', count: tools.length },
    { id: 'market', name: language === 'ar' ? 'السوق' : 'Market', count: tools.filter(t => t.category === 'market').length },
    { id: 'valuation', name: language === 'ar' ? 'التقييم' : 'Valuation', count: tools.filter(t => t.category === 'valuation').length },
    { id: 'investment', name: language === 'ar' ? 'الاستثمار' : 'Investment', count: tools.filter(t => t.category === 'investment').length },
    { id: 'economic', name: language === 'ar' ? 'الاقتصاد' : 'Economic', count: tools.filter(t => t.category === 'economic').length },
    { id: 'ai', name: language === 'ar' ? 'الذكاء الاصطناعي' : 'AI', count: tools.filter(t => t.category === 'ai').length }
  ];

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-finclick-gold/5 via-finclick-gold/10 to-finclick-gold/5">
      <Header
        language={language}
        toggleLanguage={toggleLanguage}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-finclick-gold mb-4 font-playfair">
              {language === 'ar' ? 'الأدوات المالية المجانية' : 'Free Financial Tools'}
            </h1>
            <p className="text-xl text-finclick-gold/70 max-w-3xl mx-auto font-playfair">
              {language === 'ar'
                ? 'مجموعة شاملة من الأدوات المالية المجانية لمساعدتك في اتخاذ قرارات استثمارية ذكية'
                : 'Comprehensive collection of free financial tools to help you make smart investment decisions'
              }
            </p>
          </motion.div>

          {/* Categories Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-finclick-gold text-black'
                      : 'bg-white/80 backdrop-blur-sm border border-finclick-gold/20 text-finclick-gold hover:border-finclick-gold'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg hover:border-finclick-gold transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-finclick-gold/10 ${tool.color}`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    {tool.isActive && (
                      <div className="w-2 h-2 bg-finclick-success rounded-full"></div>
                    )}
                    <button className="p-1 rounded hover:bg-finclick-gold/10 transition-all duration-300">
                      {selectedTool === tool.id ? (
                        <ChevronUp className="w-4 h-4 text-finclick-gold" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-finclick-gold" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-finclick-gold mb-2 font-playfair">
                  {language === 'ar' ? tool.title : tool.englishTitle}
                </h3>
                <p className="text-sm text-finclick-gold/70 font-playfair mb-4">
                  {language === 'ar' ? tool.description : tool.englishDescription}
                </p>

                {selectedTool === tool.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-finclick-gold/20"
                  >
                    <h4 className="font-semibold text-finclick-gold mb-3 font-playfair">
                      {language === 'ar' ? 'المميزات:' : 'Features:'}
                    </h4>
                    <ul className="space-y-2">
                      {(language === 'ar' ? tool.features : tool.englishFeatures).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-finclick-gold/70 font-playfair">
                          <CheckCircle className="w-4 h-4 text-finclick-success mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 btn btn-primary btn-sm flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        {language === 'ar' ? 'استخدم الآن' : 'Use Now'}
                      </button>
                      <button className="p-2 rounded-lg bg-finclick-gold/10 text-finclick-gold hover:bg-finclick-gold/20 transition-all duration-300">
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {selectedTool !== tool.id && (
                  <div className="flex gap-2">
                    <button className="flex-1 btn btn-primary btn-sm flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      {language === 'ar' ? 'استخدم الآن' : 'Use Now'}
                    </button>
                    <button className="p-2 rounded-lg bg-finclick-gold/10 text-finclick-gold hover:bg-finclick-gold/20 transition-all duration-300">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-2xl p-8 shadow-lg"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-finclick-gold mb-4 font-playfair">
                {language === 'ar' ? 'مميزات الأدوات المجانية' : 'Free Tools Features'}
              </h2>
              <p className="text-xl text-finclick-gold/70 max-w-3xl mx-auto font-playfair">
                {language === 'ar'
                  ? 'جميع الأدوات مجانية بالكامل ومتاحة للاستخدام الفوري'
                  : 'All tools are completely free and available for immediate use'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Zap,
                  title: language === 'ar' ? 'سرعة فائقة' : 'Lightning Fast',
                  description: language === 'ar' ? 'نتائج فورية ودقيقة' : 'Instant and accurate results'
                },
                {
                  icon: Shield,
                  title: language === 'ar' ? 'أمان متقدم' : 'Advanced Security',
                  description: language === 'ar' ? 'حماية كاملة للبيانات' : 'Complete data protection'
                },
                {
                  icon: Globe,
                  title: language === 'ar' ? 'دعم عالمي' : 'Global Support',
                  description: language === 'ar' ? 'متاح في جميع أنحاء العالم' : 'Available worldwide'
                },
                {
                  icon: Brain,
                  title: language === 'ar' ? 'ذكاء اصطناعي' : 'Artificial Intelligence',
                  description: language === 'ar' ? 'تحليل ذكي متقدم' : 'Advanced intelligent analysis'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-finclick-gold/5 rounded-xl"
                >
                  <div className="inline-flex p-3 rounded-lg bg-finclick-gold/10 text-finclick-gold mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-finclick-gold mb-2 font-playfair">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-finclick-gold/70 font-playfair">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <h2 className="text-3xl font-bold text-finclick-gold mb-4 font-playfair">
              {language === 'ar' ? 'جاهز لبدء رحلة التحليل المالي؟' : 'Ready to Start Your Financial Analysis Journey?'}
            </h2>
            <p className="text-xl text-finclick-gold/70 max-w-3xl mx-auto mb-8 font-playfair">
              {language === 'ar'
                ? 'انضم إلى آلاف المحللين الماليين المحترفين واكتشف قوة الذكاء الاصطناعي في التحليل المالي'
                : 'Join thousands of professional financial analysts and discover the power of AI in financial analysis'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary btn-lg flex items-center gap-2">
                <Crown className="w-5 h-5" />
                {language === 'ar' ? 'ابدأ التحليل الآن' : 'Start Analysis Now'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="btn btn-outline btn-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                {language === 'ar' ? 'تعرف على المزيد' : 'Learn More'}
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
