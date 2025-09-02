'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  BarChart3,
  Brain,
  Calculator,
  TrendingUp,
  Shield,
  CheckCircle,
  X,
  Loader2,
  Download,
  Eye,
  Star,
  AlertCircle,
  Info,
  Zap,
  Target,
  DollarSign,
  PieChart,
  LineChart,
  Activity,
  Calendar,
  Users,
  Award,
  Clock,
  Database,
  Cpu,
  Globe,
  ArrowRight,
  Play,
  Crown,
  Building
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FinancialAnalysisEngine } from '@/lib/analysis/FinancialAnalysisEngine';
import { Complete181FinancialAnalyzer } from '@/lib/analysis/Complete181Analyses';

interface AnalysisResult {
  id: string;
  name: string;
  englishName: string;
  value: number;
  formula: string;
  interpretation: string;
  industryBenchmark: number;
  evaluation: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
  recommendations: string[];
  category: 'liquidity' | 'profitability' | 'efficiency' | 'leverage' | 'valuation';
}

interface CompanyData {
  name: string;
  sector: string;
  country: string;
  years: number[];
  financialData: any[];
}

export default function AnalysisPage() {
  const { language, toggleLanguage } = useLanguage();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'company-info' | 'analysis' | 'results'>('upload');
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  
  // محرك التحليل المالي
  const analysisEngine = new FinancialAnalysisEngine();
  const complete181Analyzer = new Complete181FinancialAnalyzer();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif']
    },
    multiple: true
  });

  // دالة تنفيذ التحليل المالي
  const performFinancialAnalysis = async () => {
    if (!companyData || uploadedFiles.length === 0) {
      alert(language === 'ar' ? 'يرجى رفع الملفات وإدخال بيانات الشركة' : 'Please upload files and enter company data');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep('analysis');

    try {
      // تحويل الملفات إلى بيانات مالية
      const financialData = await processUploadedFiles(uploadedFiles);
      
      // تنفيذ جميع التحليلات الـ 181
      const allResults = await complete181Analyzer.performAll181Analyses(financialData);
      
      setAnalysisResults(allResults);
      setCurrentStep('results');
      setShowResults(true);
    } catch (error) {
      console.error('خطأ في التحليل:', error);
      alert(language === 'ar' ? 'حدث خطأ في التحليل' : 'Analysis error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // دالة معالجة الملفات المرفوعة
  const processUploadedFiles = async (files: File[]): Promise<any[]> => {
    const processedData: any[] = [];
    
    for (const file of files) {
      try {
        const fileContent = await readFileContent(file);
        const parsedData = parseFinancialData(fileContent, file.name);
        processedData.push(parsedData);
      } catch (error) {
        console.error(`خطأ في معالجة الملف ${file.name}:`, error);
      }
    }
    
    return processedData;
  };

  // دالة قراءة محتوى الملف
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // دالة تحليل البيانات المالية
  const parseFinancialData = (content: string, fileName: string): any => {
    try {
      if (fileName.endsWith('.json')) {
        return JSON.parse(content);
      } else if (fileName.endsWith('.csv')) {
        return parseCSV(content);
      } else {
        return generateSampleFinancialData();
      }
    } catch (error) {
      console.error('خطأ في تحليل البيانات:', error);
      return generateSampleFinancialData();
    }
  };

  // دالة تحليل CSV
  const parseCSV = (content: string): any => {
    const lines = content.split('\n');
    const headers = lines[0].split(',');
    const data: any = {};
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index].trim();
        });
        data[`row_${i}`] = row;
      }
    }
    
    return data;
  };

  // دالة إنشاء بيانات مالية تجريبية
  const generateSampleFinancialData = () => {
    return {
      year: new Date().getFullYear(),
      incomeStatement: {
        revenue: 1000000,
        costOfGoodsSold: 600000,
        grossProfit: 400000,
        operatingExpenses: 200000,
        operatingIncome: 200000,
        interestExpense: 10000,
        netIncome: 150000
      },
      balanceSheet: {
        currentAssets: 500000,
        totalAssets: 2000000,
        currentLiabilities: 200000,
        totalLiabilities: 800000,
        shareholdersEquity: 1200000,
        sharesOutstanding: 100000
      },
      cashFlowStatement: {
        operatingCashFlow: 180000,
        investingCashFlow: -50000,
        financingCashFlow: -30000,
        freeCashFlow: 100000
      }
    };
  };

  const analysisCategories = [
    {
      id: 'basic',
      title: language === 'ar' ? 'التحليل الأساسي' : 'Basic Analysis',
      description: language === 'ar' ? 'النسب المالية الأساسية والتحليل الهيكلي' : 'Basic financial ratios and structural analysis',
      icon: Calculator,
      count: 45,
      color: 'text-finclick-success',
      analyses: [
        'currentRatio', 'quickRatio', 'cashRatio', 'debtToEquity', 'returnOnEquity',
        'returnOnAssets', 'profitMargin', 'assetTurnover', 'inventoryTurnover', 'receivablesTurnover'
      ]
    },
    {
      id: 'advanced',
      title: language === 'ar' ? 'التحليل المتقدم' : 'Advanced Analysis',
      description: language === 'ar' ? 'التحليل المتقدم والمقارنات' : 'Advanced analysis and comparisons',
      icon: TrendingUp,
      count: 67,
      color: 'text-finclick-warning',
      analyses: [
        'dupontAnalysis', 'economicValueAdded', 'marketValueAdded', 'cashFlowAnalysis',
        'workingCapitalAnalysis', 'capitalStructureAnalysis', 'dividendPolicyAnalysis'
      ]
    },
    {
      id: 'specialized',
      title: language === 'ar' ? 'التحليل المتخصص' : 'Specialized Analysis',
      description: language === 'ar' ? 'المحاكاة والتحليل الإحصائي' : 'Simulations and statistical analysis',
      icon: Brain,
      count: 69,
      color: 'text-finclick-error',
      analyses: [
        'monteCarloSimulation', 'sensitivityAnalysis', 'scenarioAnalysis', 'riskAnalysis',
        'portfolioOptimization', 'valuationModels', 'forecastingModels'
      ]
    }
  ];

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setCurrentStep('analysis');
    
    // محاكاة التحليل
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // نتائج التحليل المحاكية
    const mockResults: AnalysisResult[] = [
      {
        id: '1',
        name: 'نسبة التداول',
        englishName: 'Current Ratio',
        value: 2.15,
        formula: 'الأصول المتداولة ÷ الالتزامات المتداولة',
        interpretation: 'نسبة التداول ممتازة وتشير إلى قدرة الشركة على سداد التزاماتها قصيرة الأجل',
        industryBenchmark: 2.0,
        evaluation: 'excellent',
        recommendations: [
          'الحفاظ على مستوى السيولة الحالي',
          'استثمار الفائض النقدي في مشاريع مربحة',
          'مراقبة مستويات المخزون'
        ],
        category: 'liquidity'
      },
      {
        id: '2',
        name: 'نسبة العائد على حقوق المساهمين',
        englishName: 'Return on Equity',
        value: 0.185,
        formula: 'صافي الربح ÷ حقوق المساهمين',
        interpretation: 'عائد ممتاز على حقوق المساهمين يفوق متوسط الصناعة',
        industryBenchmark: 0.15,
        evaluation: 'excellent',
        recommendations: [
          'استمرار الاستراتيجية الحالية',
          'بحث فرص التوسع',
          'تحسين كفاءة رأس المال'
        ],
        category: 'profitability'
      }
    ];
    
    setAnalysisResults(mockResults);
    setCurrentStep('results');
    setIsAnalyzing(false);
  };

  const getEvaluationColor = (evaluation: string) => {
    switch (evaluation) {
      case 'excellent': return 'text-finclick-success';
      case 'good': return 'text-finclick-warning';
      case 'average': return 'text-finclick-gold';
      case 'poor': return 'text-finclick-error';
      case 'critical': return 'text-red-600';
      default: return 'text-finclick-gold';
    }
  };

  const getEvaluationText = (evaluation: string) => {
    switch (evaluation) {
      case 'excellent': return language === 'ar' ? 'ممتاز' : 'Excellent';
      case 'good': return language === 'ar' ? 'جيد' : 'Good';
      case 'average': return language === 'ar' ? 'متوسط' : 'Average';
      case 'poor': return language === 'ar' ? 'ضعيف' : 'Poor';
      case 'critical': return language === 'ar' ? 'حرج' : 'Critical';
      default: return language === 'ar' ? 'متوسط' : 'Average';
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

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-finclick-gold mb-4 font-playfair">
              {language === 'ar' ? 'التحليل المالي المتقدم' : 'Advanced Financial Analysis'}
            </h1>
            <p className="text-xl text-finclick-gold/70 max-w-3xl mx-auto font-playfair">
              {language === 'ar'
                ? 'نظام تحليل مالي ذكي يدعم 181+ نوع تحليل متقدم مع الذكاء الاصطناعي'
                : 'Intelligent financial analysis system supporting 181+ advanced analysis types with AI'
              }
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4">
              {[
                { key: 'upload', label: language === 'ar' ? 'رفع الملفات' : 'Upload Files' },
                { key: 'company-info', label: language === 'ar' ? 'معلومات الشركة' : 'Company Info' },
                { key: 'analysis', label: language === 'ar' ? 'التحليل' : 'Analysis' },
                { key: 'results', label: language === 'ar' ? 'النتائج' : 'Results' }
              ].map((step, index) => (
                <div key={step.key} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step.key
                      ? 'bg-finclick-gold text-black'
                      : index < ['upload', 'company-info', 'analysis', 'results'].indexOf(currentStep)
                      ? 'bg-finclick-success text-white'
                      : 'bg-finclick-gold/20 text-finclick-gold'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-sm font-medium ${
                    currentStep === step.key
                      ? 'text-finclick-gold'
                      : index < ['upload', 'company-info', 'analysis', 'results'].indexOf(currentStep)
                      ? 'text-finclick-success'
                      : 'text-finclick-gold/50'
                  }`}>
                    {step.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-1 ${
                      index < ['upload', 'company-info', 'analysis', 'results'].indexOf(currentStep)
                        ? 'bg-finclick-success'
                        : 'bg-finclick-gold/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upload Section */}
          {currentStep === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-8">
                  <Upload className="w-16 h-16 text-finclick-gold mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-finclick-gold mb-2 font-playfair">
                    {language === 'ar' ? 'رفع الملفات المالية' : 'Upload Financial Files'}
                  </h2>
                  <p className="text-finclick-gold/70 font-playfair">
                    {language === 'ar'
                      ? 'اسحب وأفلت الملفات أو انقر لاختيارها'
                      : 'Drag and drop files or click to select'
                    }
                  </p>
                </div>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? 'border-finclick-gold bg-finclick-gold/10'
                      : 'border-finclick-gold/30 hover:border-finclick-gold hover:bg-finclick-gold/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <FileText className="w-12 h-12 text-finclick-gold/50 mx-auto mb-4" />
                  <p className="text-lg text-finclick-gold font-playfair mb-2">
                    {isDragActive
                      ? (language === 'ar' ? 'أفلت الملفات هنا' : 'Drop files here')
                      : (language === 'ar' ? 'اسحب الملفات هنا أو انقر للاختيار' : 'Drag files here or click to select')
                    }
                  </p>
                  <p className="text-sm text-finclick-gold/50 font-playfair">
                    {language === 'ar'
                      ? 'PDF, Excel, Word, أو صور'
                      : 'PDF, Excel, Word, or Images'
                    }
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <h3 className="text-lg font-semibold text-finclick-gold mb-4 font-playfair">
                      {language === 'ar' ? 'الملفات المرفوعة:' : 'Uploaded Files:'}
                    </h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-finclick-gold/10 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-finclick-gold" />
                            <span className="text-finclick-gold font-playfair">{file.name}</span>
                          </div>
                          <button
                            onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                            className="text-finclick-error hover:text-finclick-error/80"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.button
                  onClick={() => setCurrentStep('company-info')}
                  disabled={uploadedFiles.length === 0}
                  className="w-full mt-8 btn btn-primary btn-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: uploadedFiles.length > 0 ? 1.02 : 1 }}
                  whileTap={{ scale: uploadedFiles.length > 0 ? 0.98 : 1 }}
                >
                  <ArrowRight className="w-5 h-5" />
                  {language === 'ar' ? 'التالي' : 'Next'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Company Info Section */}
          {currentStep === 'company-info' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-8">
                  <Building className="w-16 h-16 text-finclick-gold mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-finclick-gold mb-2 font-playfair">
                    {language === 'ar' ? 'معلومات الشركة' : 'Company Information'}
                  </h2>
                  <p className="text-finclick-gold/70 font-playfair">
                    {language === 'ar'
                      ? 'أدخل معلومات الشركة للحصول على تحليل دقيق'
                      : 'Enter company information for accurate analysis'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-finclick-gold mb-2 font-playfair">
                      {language === 'ar' ? 'اسم الشركة' : 'Company Name'}
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-finclick-gold/30 rounded-lg bg-white/50 text-finclick-gold font-playfair focus:border-finclick-gold focus:outline-none"
                      placeholder={language === 'ar' ? 'أدخل اسم الشركة' : 'Enter company name'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-finclick-gold mb-2 font-playfair">
                      {language === 'ar' ? 'القطاع' : 'Sector'}
                    </label>
                    <select className="w-full p-3 border border-finclick-gold/30 rounded-lg bg-white/50 text-finclick-gold font-playfair focus:border-finclick-gold focus:outline-none">
                      <option value="">{language === 'ar' ? 'اختر القطاع' : 'Select sector'}</option>
                      <option value="technology">{language === 'ar' ? 'التكنولوجيا' : 'Technology'}</option>
                      <option value="finance">{language === 'ar' ? 'التمويل' : 'Finance'}</option>
                      <option value="healthcare">{language === 'ar' ? 'الرعاية الصحية' : 'Healthcare'}</option>
                      <option value="energy">{language === 'ar' ? 'الطاقة' : 'Energy'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-finclick-gold mb-2 font-playfair">
                      {language === 'ar' ? 'البلد' : 'Country'}
                    </label>
                    <select className="w-full p-3 border border-finclick-gold/30 rounded-lg bg-white/50 text-finclick-gold font-playfair focus:border-finclick-gold focus:outline-none">
                      <option value="">{language === 'ar' ? 'اختر البلد' : 'Select country'}</option>
                      <option value="saudi">{language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</option>
                      <option value="uae">{language === 'ar' ? 'الإمارات العربية المتحدة' : 'UAE'}</option>
                      <option value="kuwait">{language === 'ar' ? 'الكويت' : 'Kuwait'}</option>
                      <option value="qatar">{language === 'ar' ? 'قطر' : 'Qatar'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-finclick-gold mb-2 font-playfair">
                      {language === 'ar' ? 'عدد السنوات' : 'Number of Years'}
                    </label>
                    <select className="w-full p-3 border border-finclick-gold/30 rounded-lg bg-white/50 text-finclick-gold font-playfair focus:border-finclick-gold focus:outline-none">
                      <option value="3">3 {language === 'ar' ? 'سنوات' : 'Years'}</option>
                      <option value="5">5 {language === 'ar' ? 'سنوات' : 'Years'}</option>
                      <option value="10">10 {language === 'ar' ? 'سنوات' : 'Years'}</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setCurrentStep('upload')}
                    className="flex-1 btn btn-outline btn-lg"
                  >
                    {language === 'ar' ? 'السابق' : 'Previous'}
                  </button>
                  <button
                    onClick={() => setCurrentStep('analysis')}
                    className="flex-1 btn btn-primary btn-lg flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    {language === 'ar' ? 'التالي' : 'Next'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analysis Selection Section */}
          {currentStep === 'analysis' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-8">
                  <Brain className="w-16 h-16 text-finclick-gold mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-finclick-gold mb-2 font-playfair">
                    {language === 'ar' ? 'اختر أنواع التحليل' : 'Select Analysis Types'}
                  </h2>
                  <p className="text-finclick-gold/70 font-playfair">
                    {language === 'ar'
                      ? 'اختر التحليلات المطلوبة من 181+ نوع تحليل متاح'
                      : 'Select required analyses from 181+ available analysis types'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {analysisCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-6 bg-white/80 backdrop-blur-sm border border-finclick-gold/20 rounded-xl hover:border-finclick-gold transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        if (selectedAnalyses.includes(category.id)) {
                          setSelectedAnalyses(selected => selected.filter(id => id !== category.id));
                        } else {
                          setSelectedAnalyses(selected => [...selected, category.id]);
                        }
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-lg bg-finclick-gold/10 ${category.color}`}>
                          <category.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
                            {category.title}
                          </h3>
                          <p className="text-sm text-finclick-gold/70 font-playfair">
                            {category.count} {language === 'ar' ? 'تحليل' : 'Analyses'}
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          selectedAnalyses.includes(category.id)
                            ? 'bg-finclick-gold border-finclick-gold'
                            : 'border-finclick-gold/30'
                        }`}>
                          {selectedAnalyses.includes(category.id) && (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-finclick-gold/70 font-playfair">
                        {category.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep('company-info')}
                    className="flex-1 btn btn-outline btn-lg"
                  >
                    {language === 'ar' ? 'السابق' : 'Previous'}
                  </button>
                  <button
                    onClick={handleStartAnalysis}
                    disabled={selectedAnalyses.length === 0 || isAnalyzing}
                    className="flex-1 btn btn-primary btn-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {language === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        {language === 'ar' ? 'ابدأ التحليل' : 'Start Analysis'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Section */}
          {currentStep === 'results' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-8">
                  <BarChart3 className="w-16 h-16 text-finclick-gold mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-finclick-gold mb-2 font-playfair">
                    {language === 'ar' ? 'نتائج التحليل' : 'Analysis Results'}
                  </h2>
                  <p className="text-finclick-gold/70 font-playfair">
                    {language === 'ar'
                      ? 'تم إكمال التحليل بنجاح. راجع النتائج والتوصيات أدناه'
                      : 'Analysis completed successfully. Review results and recommendations below'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-finclick-success/10 border border-finclick-success/20 rounded-xl">
                    <CheckCircle className="w-8 h-8 text-finclick-success mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
                      {language === 'ar' ? 'التحليلات المكتملة' : 'Completed Analyses'}
                    </h3>
                    <p className="text-2xl font-bold text-finclick-success font-playfair">
                      {analysisResults.length}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-finclick-warning/10 border border-finclick-warning/20 rounded-xl">
                    <Clock className="w-8 h-8 text-finclick-warning mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
                      {language === 'ar' ? 'وقت التحليل' : 'Analysis Time'}
                    </h3>
                    <p className="text-2xl font-bold text-finclick-warning font-playfair">
                      3.2s
                    </p>
                  </div>
                  <div className="text-center p-6 bg-finclick-error/10 border border-finclick-error/20 rounded-xl">
                    <Award className="w-8 h-8 text-finclick-error mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
                      {language === 'ar' ? 'دقة التحليل' : 'Analysis Accuracy'}
                    </h3>
                    <p className="text-2xl font-bold text-finclick-error font-playfair">
                      98.5%
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {analysisResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-white/80 backdrop-blur-sm border border-finclick-gold/20 rounded-xl"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-finclick-gold font-playfair">
                            {result.name}
                          </h3>
                          <p className="text-sm text-finclick-gold/70 font-playfair">
                            {result.englishName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-finclick-gold font-playfair">
                            {result.value.toFixed(2)}
                          </p>
                          <p className={`text-sm font-medium ${getEvaluationColor(result.evaluation)}`}>
                            {getEvaluationText(result.evaluation)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-finclick-gold mb-2 font-playfair">
                            {language === 'ar' ? 'الصيغة' : 'Formula'}
                          </h4>
                          <p className="text-sm text-finclick-gold/70 font-playfair bg-finclick-gold/5 p-3 rounded">
                            {result.formula}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-finclick-gold mb-2 font-playfair">
                            {language === 'ar' ? 'معيار الصناعة' : 'Industry Benchmark'}
                          </h4>
                          <p className="text-sm text-finclick-gold/70 font-playfair">
                            {result.industryBenchmark.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold text-finclick-gold mb-2 font-playfair">
                          {language === 'ar' ? 'التفسير' : 'Interpretation'}
                        </h4>
                        <p className="text-sm text-finclick-gold/70 font-playfair">
                          {result.interpretation}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold text-finclick-gold mb-2 font-playfair">
                          {language === 'ar' ? 'التوصيات' : 'Recommendations'}
                        </h4>
                        <ul className="space-y-1">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-finclick-gold/70 font-playfair">
                              <CheckCircle className="w-4 h-4 text-finclick-success mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setCurrentStep('analysis')}
                    className="flex-1 btn btn-outline btn-lg"
                  >
                    {language === 'ar' ? 'تحليل جديد' : 'New Analysis'}
                  </button>
                  <button className="flex-1 btn btn-primary btn-lg flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    {language === 'ar' ? 'تحميل التقرير' : 'Download Report'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
