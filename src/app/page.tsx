'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  Brain,
  Zap,
  Shield,
  Globe,
  Users,
  TrendingUp,
  Award,
  Clock,
  Download,
  MessageSquare,
  BarChart3,
  Cpu,
  Database,
  Target,
  DollarSign,
  Crown,
  Activity,
  FileText,
  Image,
  Upload,
  Calculator,
  Bot,
  Calendar,
  PieChart,
  LineChart,
  Building,
  ChevronDown
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveMarketTicker from '@/components/LiveMarketTicker';
import FreeTools from '@/components/FreeTools';
import AnalysisTypes from '@/components/AnalysisTypes';
import Testimonials from '@/components/Testimonials';
import PricingSection from '@/components/PricingSection';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { language, toggleLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: language === 'ar' ? 'ذكاء اصطناعي متقدم' : 'Advanced AI',
      description: language === 'ar'
        ? 'محاكاة إحصائية متقدمة وتحليل ذكي للبيانات'
        : 'Advanced statistical simulation and intelligent data analysis'
    },
    {
      icon: Zap,
      title: language === 'ar' ? 'سرعة فائقة' : 'Lightning Fast',
      description: language === 'ar'
        ? 'معالجة فورية للبيانات وتقارير فورية'
        : 'Instant data processing and real-time reports'
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'أمان متقدم' : 'Advanced Security',
      description: language === 'ar'
        ? 'حماية متقدمة للبيانات وتشفير آمن'
        : 'Advanced data protection and secure encryption'
    },
    {
      icon: Globe,
      title: language === 'ar' ? 'دعم متعدد اللغات' : 'Multi-Language',
      description: language === 'ar'
        ? 'دعم كامل للعربية والإنجليزية'
        : 'Full support for Arabic and English'
    }
  ];

  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: language === 'ar' ? 'مستخدم نشط' : 'Active Users'
    },
    {
      icon: BarChart3,
      value: '181+',
      label: language === 'ar' ? 'نوع تحليل' : 'Analysis Types'
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: language === 'ar' ? 'معدل الرضا' : 'Satisfaction Rate'
    },
    {
      icon: Award,
      value: '50+',
      label: language === 'ar' ? 'جائزة دولية' : 'International Awards'
    }
  ];

  const supportedFormats = [
    { name: 'PDF', icon: FileText, color: 'text-finclick-error' },
    { name: 'Excel', icon: BarChart3, color: 'text-finclick-success' },
    { name: 'Word', icon: FileText, color: 'text-finclick-info' },
    { name: 'Images', icon: Image, color: 'text-finclick-warning' }
  ];

  const analysisCategories = [
    {
      title: language === 'ar' ? 'التحليل الأساسي' : 'Basic Analysis',
      description: language === 'ar'
        ? 'النسب المالية والتحليل الأساسي'
        : 'Financial ratios and fundamental analysis',
      icon: Calculator,
      count: 45,
      color: 'text-finclick-success'
    },
    {
      title: language === 'ar' ? 'التحليل المتقدم' : 'Advanced Analysis',
      description: language === 'ar'
        ? 'التحليل المتقدم والمقارنات'
        : 'Advanced analysis and comparisons',
      icon: TrendingUp,
      count: 67,
      color: 'text-finclick-warning'
    },
    {
      title: language === 'ar' ? 'التحليل المتخصص' : 'Specialized Analysis',
      description: language === 'ar'
        ? 'المحاكاة والتحليل الإحصائي'
        : 'Simulations and statistical analysis',
      icon: Brain,
      count: 69,
      color: 'text-finclick-error'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-finclick-gold/5 via-finclick-gold/10 to-finclick-gold/5">
      <Header
        language={language}
        toggleLanguage={toggleLanguage}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-finclick-gold/10 text-finclick-gold text-sm font-medium rounded-full"
                >
                  <Star className="w-4 h-4 fill-current" />
                  {language === 'ar' ? 'أفضل نظام تحليل مالي في العالم' : 'World\'s Best Financial Analysis System'}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl lg:text-6xl font-bold text-finclick-gold font-playfair leading-tight"
                >
                  {language === 'ar' ? (
                    <>
                      التحليل المالي
                      <br />
                      <span className="text-finclick-gold-light">المتقدم</span>
                    </>
                  ) : (
                    <>
                      Advanced
                      <br />
                      <span className="text-finclick-gold-light">Financial Analysis</span>
                    </>
                  )}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl text-finclick-gold/70 font-playfair leading-relaxed"
                >
                  {language === 'ar'
                    ? 'نظام تحليل مالي ذكي شامل يدعم 181+ نوع تحليل متقدم، محاكاة إحصائية، وتقارير مفصلة مدعومة بالذكاء الاصطناعي'
                    : 'Comprehensive intelligent financial analysis system supporting 181+ advanced analysis types, statistical simulations, and AI-powered detailed reports'
                  }
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  onClick={() => scrollToSection('analysis-types')}
                  className="btn btn-primary btn-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Brain className="w-5 h-5" />
                  {language === 'ar' ? 'ابدأ التحليل الآن' : 'Start Analysis Now'}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  onClick={() => scrollToSection('free-tools')}
                  className="btn btn-outline btn-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  {language === 'ar' ? 'شاهد العرض التوضيحي' : 'Watch Demo'}
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <stat.icon className="w-5 h-5 text-finclick-gold" />
                      <p className="text-2xl font-bold text-finclick-gold font-playfair">
                        {stat.value}
                      </p>
                    </div>
                    <p className="text-sm text-finclick-gold/70 font-playfair">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative bg-white/10 backdrop-blur-sm border border-finclick-gold/20 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  {/* Dashboard Preview */}
                  <div className="bg-gradient-to-br from-finclick-gold/20 to-finclick-gold/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
                        {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                      </h3>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-finclick-success rounded-full"></div>
                        <div className="w-3 h-3 bg-finclick-warning rounded-full"></div>
                        <div className="w-3 h-3 bg-finclick-error rounded-full"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-16 bg-finclick-gold/20 rounded"></div>
                      <div className="h-16 bg-finclick-gold/20 rounded"></div>
                      <div className="h-16 bg-finclick-gold/20 rounded"></div>
                    </div>
                  </div>

                  {/* Analysis Types */}
                  <div className="space-y-3">
                    <h4 className="text-md font-semibold text-finclick-gold font-playfair">
                      {language === 'ar' ? 'أنواع التحليل' : 'Analysis Types'}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {analysisCategories.map((category, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-finclick-gold/10 rounded-lg">
                          <category.icon className={`w-4 h-4 ${category.color}`} />
                          <div>
                            <p className="text-sm font-medium text-finclick-gold font-playfair">
                              {category.title}
                            </p>
                            <p className="text-xs text-finclick-gold/70 font-playfair">
                              {category.count} {language === 'ar' ? 'تحليل' : 'Analyses'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Features */}
                  <div className="space-y-3">
                    <h4 className="text-md font-semibold text-finclick-gold font-playfair">
                      {language === 'ar' ? 'ميزات الذكاء الاصطناعي' : 'AI Features'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: Brain, label: language === 'ar' ? 'تحليل ذكي' : 'Smart Analysis' },
                        { icon: Cpu, label: language === 'ar' ? 'معالجة سريعة' : 'Fast Processing' },
                        { icon: Database, label: language === 'ar' ? 'بيانات ضخمة' : 'Big Data' },
                        { icon: Target, label: language === 'ar' ? 'تنبؤات دقيقة' : 'Accurate Predictions' }
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-finclick-gold/10 rounded text-xs text-finclick-gold font-playfair">
                          <feature.icon className="w-3 h-3" />
                          {feature.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Market Ticker */}
      <LiveMarketTicker language={language} />

      {/* Free Tools Section */}
      <div id="free-tools">
        <FreeTools language={language} />
      </div>

      {/* Analysis Types Section */}
      <div id="analysis-types">
        <AnalysisTypes language={language} />
      </div>

      {/* Testimonials Section */}
      <Testimonials language={language} />

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection language={language} />
      </div>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-finclick-gold mb-4 font-playfair">
              {language === 'ar' ? 'المميزات الرئيسية' : 'Key Features'}
            </h2>
            <p className="text-xl text-finclick-gold/70 max-w-3xl mx-auto font-playfair">
              {language === 'ar'
                ? 'اكتشف قوة النظام المتقدم في التحليل المالي'
                : 'Discover the power of advanced financial analysis system'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white/80 backdrop-blur-sm border border-finclick-gold/20 rounded-xl hover:border-finclick-gold transition-all duration-300"
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
        </div>
      </section>

      {/* Supported Formats */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-finclick-gold mb-4 font-playfair">
              {language === 'ar' ? 'الملفات المدعومة' : 'Supported Formats'}
            </h2>
            <p className="text-xl text-finclick-gold/70 max-w-3xl mx-auto font-playfair">
              {language === 'ar'
                ? 'يدعم النظام جميع أنواع الملفات المالية الشائعة'
                : 'The system supports all common financial file types'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {supportedFormats.map((format, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white/80 backdrop-blur-sm border border-finclick-gold/20 rounded-xl"
              >
                <div className={`inline-flex p-3 rounded-lg bg-finclick-gold/10 ${format.color} mb-4`}>
                  <format.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
                  {format.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-finclick-gold/10 to-finclick-gold/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-finclick-gold mb-4 font-playfair">
              {language === 'ar' ? 'جاهز لبدء رحلة التحليل المالي المتقدم؟' : 'Ready to Start Your Advanced Financial Analysis Journey?'}
            </h2>
            <p className="text-xl text-finclick-gold/70 max-w-3xl mx-auto font-playfair">
              {language === 'ar'
                ? 'انضم إلى آلاف المحللين الماليين المحترفين واكتشف قوة الذكاء الاصطناعي في التحليل المالي'
                : 'Join thousands of professional financial analysts and discover the power of AI in financial analysis'
              }
            </p>
            <motion.button
              onClick={() => scrollToSection('pricing')}
              className="btn btn-primary btn-lg flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown className="w-5 h-5" />
              {language === 'ar' ? 'ابدأ الآن مجاناً' : 'Start Free Today'}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
