'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  MessageSquare,
  Bot,
  Download,
  Share2,
  Settings,
  Zap,
  Target,
  PieChart,
  LineChart,
  Activity,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FreeToolsProps {
  language: 'ar' | 'en';
}

const FreeTools: React.FC<FreeToolsProps> = ({ language }) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [calculatorData, setCalculatorData] = useState({
    fairPrice: { currentPrice: 0, eps: 0, growthRate: 0, riskFreeRate: 0 },
    roi: { initialInvestment: 0, finalValue: 0, timePeriod: 0 },
    peRatio: { stockPrice: 0, earningsPerShare: 0 },
    inflation: { initialAmount: 0, inflationRate: 0, years: 0 }
  });

  const tools = [
    {
      id: 'economic-calendar',
      title: language === 'ar' ? 'التقويم الاقتصادي' : 'Economic Calendar',
      description: language === 'ar' 
        ? 'تتبع الأحداث الاقتصادية المهمة والتقارير المالية'
        : 'Track important economic events and financial reports',
      icon: Calendar,
      color: 'text-finclick-success'
    },
    {
      id: 'fair-price-calculator',
      title: language === 'ar' ? 'حاسبة السعر العادل' : 'Fair Stock Price Calculator',
      description: language === 'ar' 
        ? 'احسب السعر العادل للسهم بناءً على نموذج التقييم'
        : 'Calculate fair stock price based on valuation model',
      icon: Target,
      color: 'text-finclick-info'
    },
    {
      id: 'roi-calculator',
      title: language === 'ar' ? 'حاسبة العائد على الاستثمار' : 'ROI Calculator',
      description: language === 'ar' 
        ? 'احسب العائد على الاستثمار ومعدل النمو السنوي'
        : 'Calculate return on investment and annual growth rate',
      icon: TrendingUp,
      color: 'text-finclick-warning'
    },
    {
      id: 'pe-ratio-calculator',
      title: language === 'ar' ? 'حاسبة نسبة السعر إلى الأرباح' : 'P/E Ratio Calculator',
      description: language === 'ar' 
        ? 'احسب نسبة السعر إلى الأرباح وتقييم السهم'
        : 'Calculate price-to-earnings ratio and stock valuation',
      icon: BarChart3,
      color: 'text-finclick-error'
    },
    {
      id: 'inflation-calculator',
      title: language === 'ar' ? 'حاسبة التضخم' : 'Inflation Calculator',
      description: language === 'ar' 
        ? 'احسب تأثير التضخم على القوة الشرائية'
        : 'Calculate inflation impact on purchasing power',
      icon: PieChart,
      color: 'text-finclick-gold'
    },
    {
      id: 'market-sentiment',
      title: language === 'ar' ? 'مؤشرات السوق التفاعلية' : 'Interactive Market Sentiment',
      description: language === 'ar' 
        ? 'تحليل مشاعر السوق والمؤشرات الفنية'
        : 'Analyze market sentiment and technical indicators',
      icon: Activity,
      color: 'text-finclick-success'
    },
    {
      id: 'financial-gpt',
      title: language === 'ar' ? 'روبوت الذكاء المالي' : 'Financial GPT Bot',
      description: language === 'ar' 
        ? 'احصل على إجابات ذكية لأسئلتك المالية'
        : 'Get intelligent answers to your financial questions',
      icon: Bot,
      color: 'text-finclick-info'
    }
  ];

  const calculateFairPrice = () => {
    const { currentPrice, eps, growthRate, riskFreeRate } = calculatorData.fairPrice;
    if (eps <= 0 || growthRate < 0) return 0;
    
    // Simple DCF model
    const discountRate = riskFreeRate + 0.05; // 5% risk premium
    const fairPrice = eps * (1 + growthRate) / (discountRate - growthRate);
    return Math.max(0, fairPrice);
  };

  const calculateROI = () => {
    const { initialInvestment, finalValue, timePeriod } = calculatorData.roi;
    if (initialInvestment <= 0 || timePeriod <= 0) return { roi: 0, cagr: 0 };
    
    const roi = ((finalValue - initialInvestment) / initialInvestment) * 100;
    const cagr = Math.pow(finalValue / initialInvestment, 1 / timePeriod) - 1;
    return { roi, cagr: cagr * 100 };
  };

  const calculatePERatio = () => {
    const { stockPrice, earningsPerShare } = calculatorData.peRatio;
    if (earningsPerShare <= 0) return 0;
    return stockPrice / earningsPerShare;
  };

  const calculateInflation = () => {
    const { initialAmount, inflationRate, years } = calculatorData.inflation;
    if (inflationRate < 0 || years < 0) return 0;
    
    const futureValue = initialAmount * Math.pow(1 + inflationRate / 100, years);
    return futureValue;
  };

  const renderToolContent = (toolId: string) => {
    switch (toolId) {
      case 'economic-calendar':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-finclick-gold font-playfair">
              {language === 'ar' ? 'التقويم الاقتصادي' : 'Economic Calendar'}
            </h3>
            <div className="grid gap-4">
              {[
                { date: '2024-01-15', event: language === 'ar' ? 'تقرير التضخم الأمريكي' : 'US Inflation Report', impact: 'High' },
                { date: '2024-01-18', event: language === 'ar' ? 'اجتماع البنك المركزي الأوروبي' : 'ECB Meeting', impact: 'Medium' },
                { date: '2024-01-22', event: language === 'ar' ? 'تقرير أرباح الشركات' : 'Corporate Earnings Report', impact: 'High' },
                { date: '2024-01-25', event: language === 'ar' ? 'مؤشر ثقة المستهلك' : 'Consumer Confidence Index', impact: 'Medium' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-finclick-gold/5 border border-finclick-gold/20 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-finclick-gold font-playfair">{item.event}</p>
                    <p className="text-sm text-finclick-gold/70 font-playfair">{item.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.impact === 'High' ? 'bg-finclick-error/20 text-finclick-error' :
                    item.impact === 'Medium' ? 'bg-finclick-warning/20 text-finclick-warning' :
                    'bg-finclick-success/20 text-finclick-success'
                  }`}>
                    {item.impact}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'fair-price-calculator':
        const fairPrice = calculateFairPrice();
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-finclick-gold font-playfair">
              {language === 'ar' ? 'حاسبة السعر العادل' : 'Fair Stock Price Calculator'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'السعر الحالي' : 'Current Price'}
                </label>
                <input
                  type="number"
                  value={calculatorData.fairPrice.currentPrice}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    fairPrice: { ...prev.fairPrice, currentPrice: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'ربح السهم' : 'EPS'}
                </label>
                <input
                  type="number"
                  value={calculatorData.fairPrice.eps}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    fairPrice: { ...prev.fairPrice, eps: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'معدل النمو (%)' : 'Growth Rate (%)'}
                </label>
                <input
                  type="number"
                  value={calculatorData.fairPrice.growthRate}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    fairPrice: { ...prev.fairPrice, growthRate: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'معدل الخالي من المخاطر (%)' : 'Risk-Free Rate (%)'}
                </label>
                <input
                  type="number"
                  value={calculatorData.fairPrice.riskFreeRate}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    fairPrice: { ...prev.fairPrice, riskFreeRate: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="p-4 bg-finclick-gold/10 border border-finclick-gold/20 rounded-lg">
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'السعر العادل المقدر:' : 'Estimated Fair Price:'}
              </p>
              <p className="text-2xl font-bold text-finclick-gold font-playfair">
                ${fairPrice.toFixed(2)}
              </p>
            </div>
          </div>
        );

      case 'roi-calculator':
        const roiResult = calculateROI();
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-finclick-gold font-playfair">
              {language === 'ar' ? 'حاسبة العائد على الاستثمار' : 'ROI Calculator'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'الاستثمار الأولي' : 'Initial Investment'}
                </label>
                <input
                  type="number"
                  value={calculatorData.roi.initialInvestment}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    roi: { ...prev.roi, initialInvestment: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'القيمة النهائية' : 'Final Value'}
                </label>
                <input
                  type="number"
                  value={calculatorData.roi.finalValue}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    roi: { ...prev.roi, finalValue: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'الفترة الزمنية (سنوات)' : 'Time Period (Years)'}
                </label>
                <input
                  type="number"
                  value={calculatorData.roi.timePeriod}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    roi: { ...prev.roi, timePeriod: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-finclick-gold/10 border border-finclick-gold/20 rounded-lg">
                <p className="text-sm text-finclick-gold/70 font-playfair">ROI</p>
                <p className="text-2xl font-bold text-finclick-gold font-playfair">
                  {roiResult.roi.toFixed(2)}%
                </p>
              </div>
              <div className="p-4 bg-finclick-gold/10 border border-finclick-gold/20 rounded-lg">
                <p className="text-sm text-finclick-gold/70 font-playfair">
                  {language === 'ar' ? 'معدل النمو السنوي المركب' : 'CAGR'}
                </p>
                <p className="text-2xl font-bold text-finclick-gold font-playfair">
                  {roiResult.cagr.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        );

      case 'pe-ratio-calculator':
        const peRatio = calculatePERatio();
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-finclick-gold font-playfair">
              {language === 'ar' ? 'حاسبة نسبة السعر إلى الأرباح' : 'P/E Ratio Calculator'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'سعر السهم' : 'Stock Price'}
                </label>
                <input
                  type="number"
                  value={calculatorData.peRatio.stockPrice}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    peRatio: { ...prev.peRatio, stockPrice: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'ربح السهم' : 'Earnings Per Share'}
                </label>
                <input
                  type="number"
                  value={calculatorData.peRatio.earningsPerShare}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    peRatio: { ...prev.peRatio, earningsPerShare: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="p-4 bg-finclick-gold/10 border border-finclick-gold/20 rounded-lg">
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'نسبة السعر إلى الأرباح:' : 'P/E Ratio:'}
              </p>
              <p className="text-2xl font-bold text-finclick-gold font-playfair">
                {peRatio.toFixed(2)}
              </p>
              <p className="text-sm text-finclick-gold/70 font-playfair mt-2">
                {peRatio > 25 ? (language === 'ar' ? 'تقييم مرتفع' : 'High Valuation') :
                 peRatio > 15 ? (language === 'ar' ? 'تقييم معتدل' : 'Moderate Valuation') :
                 (language === 'ar' ? 'تقييم منخفض' : 'Low Valuation')}
              </p>
            </div>
          </div>
        );

      case 'inflation-calculator':
        const inflationResult = calculateInflation();
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-finclick-gold font-playfair">
              {language === 'ar' ? 'حاسبة التضخم' : 'Inflation Calculator'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'المبلغ الأولي' : 'Initial Amount'}
                </label>
                <input
                  type="number"
                  value={calculatorData.inflation.initialAmount}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    inflation: { ...prev.inflation, initialAmount: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'معدل التضخم (%)' : 'Inflation Rate (%)'}
                </label>
                <input
                  type="number"
                  value={calculatorData.inflation.inflationRate}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    inflation: { ...prev.inflation, inflationRate: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-finclick-gold font-playfair">
                  {language === 'ar' ? 'عدد السنوات' : 'Number of Years'}
                </label>
                <input
                  type="number"
                  value={calculatorData.inflation.years}
                  onChange={(e) => setCalculatorData(prev => ({
                    ...prev,
                    inflation: { ...prev.inflation, years: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="p-4 bg-finclick-gold/10 border border-finclick-gold/20 rounded-lg">
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'القيمة المستقبلية:' : 'Future Value:'}
              </p>
              <p className="text-2xl font-bold text-finclick-gold font-playfair">
                ${inflationResult.toFixed(2)}
              </p>
            </div>
          </div>
        );

      case 'market-sentiment':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-finclick-gold font-playfair">
              {language === 'ar' ? 'مؤشرات السوق التفاعلية' : 'Interactive Market Sentiment'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-finclick-gold font-playfair">
                  {language === 'ar' ? 'مؤشرات السوق' : 'Market Indicators'}
                </h4>
                {[
                  { name: language === 'ar' ? 'مؤشر الخوف والجشع' : 'Fear & Greed Index', value: 65, status: 'Greed' },
                  { name: language === 'ar' ? 'مؤشر التذبذب' : 'Volatility Index', value: 18, status: 'Low' },
                  { name: language === 'ar' ? 'مؤشر القوة النسبية' : 'RSI', value: 58, status: 'Neutral' },
                  { name: language === 'ar' ? 'مؤشر التداول' : 'Trading Volume', value: 85, status: 'High' }
                ].map((indicator, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-finclick-gold font-playfair">{indicator.name}</span>
                      <span className="text-finclick-gold/70 font-playfair">{indicator.value}</span>
                    </div>
                    <div className="w-full bg-finclick-gold/20 rounded-full h-2">
                      <div 
                        className="bg-finclick-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${indicator.value}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-finclick-gold/70 font-playfair">{indicator.status}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-finclick-gold font-playfair">
                  {language === 'ar' ? 'تحليل المشاعر' : 'Sentiment Analysis'}
                </h4>
                <div className="space-y-3">
                  {[
                    { sentiment: language === 'ar' ? 'إيجابي' : 'Positive', percentage: 45 },
                    { sentiment: language === 'ar' ? 'محايد' : 'Neutral', percentage: 35 },
                    { sentiment: language === 'ar' ? 'سلبي' : 'Negative', percentage: 20 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-20 text-sm text-finclick-gold font-playfair">
                        {item.sentiment}
                      </div>
                      <div className="flex-1 bg-finclick-gold/20 rounded-full h-3">
                        <div 
                          className="bg-finclick-gold h-3 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-sm text-finclick-gold/70 font-playfair">
                        {item.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'financial-gpt':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-finclick-gold font-playfair">
              {language === 'ar' ? 'روبوت الذكاء المالي' : 'Financial GPT Bot'}
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-finclick-gold/5 border border-finclick-gold/20 rounded-lg">
                <p className="text-sm text-finclick-gold/70 font-playfair mb-2">
                  {language === 'ar' ? 'اسأل أي سؤال مالي:' : 'Ask any financial question:'}
                </p>
                <textarea
                  className="w-full p-3 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold resize-none"
                  rows={3}
                  placeholder={language === 'ar' ? 'مثال: ما هو الفرق بين الأسهم والسندات؟' : 'Example: What is the difference between stocks and bonds?'}
                />
                <div className="flex justify-end mt-2">
                  <motion.button
                    className="btn btn-primary flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bot className="w-4 h-4" />
                    {language === 'ar' ? 'اسأل' : 'Ask'}
                  </motion.button>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-finclick-gold font-playfair">
                  {language === 'ar' ? 'الأسئلة الشائعة:' : 'Frequently Asked Questions:'}
                </h4>
                {[
                  language === 'ar' ? 'كيف أحسب العائد على الاستثمار؟' : 'How do I calculate ROI?',
                  language === 'ar' ? 'ما هو الفرق بين التحليل الأساسي والفني؟' : 'What is the difference between fundamental and technical analysis?',
                  language === 'ar' ? 'كيف أبدأ في الاستثمار؟' : 'How do I start investing?',
                  language === 'ar' ? 'ما هي أفضل استراتيجيات إدارة المخاطر؟' : 'What are the best risk management strategies?'
                ].map((question, index) => (
                  <motion.button
                    key={index}
                    className="w-full text-left p-3 bg-finclick-gold/5 border border-finclick-gold/20 rounded-lg hover:bg-finclick-gold/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <p className="text-finclick-gold font-playfair">{question}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
            {language === 'ar' ? 'الأدوات المجانية' : 'Free Tools'}
          </h2>
          <p className="text-xl text-finclick-gold/70 max-w-3xl mx-auto font-playfair">
            {language === 'ar' 
              ? 'مجموعة شاملة من الأدوات المالية المجانية لمساعدتك في اتخاذ قرارات استثمارية ذكية'
              : 'A comprehensive suite of free financial tools to help you make smart investment decisions'
            }
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
            >
              <div className="p-6 bg-white/80 backdrop-blur-sm border border-finclick-gold/20 rounded-xl hover:bg-white hover:border-finclick-gold transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-finclick-gold/10 ${tool.color}`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-finclick-gold/70 font-playfair">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-finclick-gold/50 font-playfair">
                    {language === 'ar' ? 'انقر للاستخدام' : 'Click to use'}
                  </span>
                  <Zap className="w-4 h-4 text-finclick-gold/50 group-hover:text-finclick-gold transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active Tool Content */}
        <AnimatePresence>
          {activeTool && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg"
            >
              {renderToolContent(activeTool)}
              
              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-finclick-gold/20">
                <motion.button
                  className="btn flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  {language === 'ar' ? 'تحميل النتائج' : 'Download Results'}
                </motion.button>
                <motion.button
                  className="btn flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-4 h-4" />
                  {language === 'ar' ? 'مشاركة' : 'Share'}
                </motion.button>
                <motion.button
                  onClick={() => setActiveTool(null)}
                  className="btn btn-outline flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FreeTools;
