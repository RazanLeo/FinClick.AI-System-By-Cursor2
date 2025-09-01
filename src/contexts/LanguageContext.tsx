'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'ar' | 'en';
  toggleLanguage: () => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.services': 'الخدمات',
    'nav.pricing': 'الأسعار',
    'nav.contact': 'تواصل معنا',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.dashboard': 'لوحة التحكم',
    'nav.analysis': 'التحليل',
    'nav.reports': 'التقارير',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',

    // Hero Section
    'hero.title': 'FinClick.AI',
    'hero.subtitle': 'ثورة ونقلة نوعية في عالم التحليل المالي',
    'hero.description': 'نظام يقلب الدنيا رأساً على عقب ويقلب كل الموازين',
    'hero.description2': 'منصة ونظام شامل يغنيك عن أي مدير أو محلل أو خبير مالي',
    'hero.startAnalysis': 'ابدأ التحليل الآن',
    'hero.discoverMore': 'اكتشف المزيد',

    // Features
    'features.title': 'لماذا FinClick.AI؟',
    'features.subtitle': 'ثورة ونقلة نوعية في عالم التحليل المالي',
    'features.servesAll': 'يخدم كل مستفيدي التحليل المالي',
    'features.aiPowered': 'يقوم على الذكاء الاصطناعي المتطور',
    'features.allTypes': 'يقدم جميع أنواع التحليل المالي',
    'features.cloudBased': 'بيئة سحابية متاحة في أي مكان',
    'features.userFriendly': 'واجهة واضحة واحترافية',
    'features.fast': 'السرعة - تحليل في ثوانٍ',
    'features.accurate': 'الدقة والكفاءة المتناهية',
    'features.secure': 'أمان عالي المستوى',
    'features.superAnalyst': 'محلل مالي فائق',
    'features.reports': 'تقارير تفصيلية وعروض تقديمية',
    'features.comparisons': 'مقارنات على جميع مستويات العالم',
    'features.quality': 'جودة عالمية معتمدة',

    // Steps
    'steps.title': 'خطوات استخدام النظام',
    'steps.subtitle': '3 خطوات بسيطة للحصول على تحليل شامل',
    'step1.title': 'أرفق قوائمك',
    'step1.description': 'ارفع قوائمك المالية بأي صيغة لمدة تصل إلى 10 سنوات',
    'step2.title': 'حدد خيارات التحليل',
    'step2.description': 'اختر اللغة، القطاع، النشاط، مستوى المقارنة ونوع التحليل',
    'step3.title': 'اضغط زر التحليل',
    'step3.description': 'اضغط زراً واحداً واحصل على تحليل شامل!',

    // Analysis Types
    'analysisTypes.title': 'أنواع التحليل المالي',
    'analysisTypes.subtitle': '181+ نوع تحليل مالي شامل من الكلاسيكي إلى الذكاء الاصطناعي',
    'analysisTypes.basic': 'التحليل المالي الأساسي/الكلاسيكي',
    'analysisTypes.intermediate': 'التحليل المالي المتوسط',
    'analysisTypes.advanced': 'التحليل المالي المتقدم',
    'analysisTypes.complex': 'التحليل المالي المعقد والمتطور',
    'analysisTypes.ai': 'التحليل المالي بالذكاء الاصطناعي',
    'analysisTypes.comprehensive': 'التحليل الشامل',

    // Free Tools
    'tools.title': 'أدوات مجانية',
    'tools.news': 'الأخبار المالية الحية',
    'tools.calendar': 'التقويم الاقتصادي',
    'tools.calculator': 'حاسبة السعر العادل للسهم',
    'tools.roi': 'حاسبة العائد على الاستثمار',
    'tools.pe': 'حاسبة نسبة السعر للأرباح',
    'tools.inflation': 'حاسبة التضخم',
    'tools.sentiment': 'مؤشر مزاج السوق التفاعلي',
    'tools.chatbot': 'بوت GPT المالي المجاني',

    // Testimonials
    'testimonials.title': 'ماذا يقول عملاؤنا',
    'testimonials.subtitle': 'آراء عملائنا المميزين',

    // Pricing
    'pricing.title': 'أسعار الاشتراكات',
    'pricing.subtitle': 'خطط مرنة تناسب جميع الاحتياجات',
    'pricing.monthly': 'الخطة الشهرية',
    'pricing.annual': 'الخطة السنوية',
    'pricing.monthlyPrice': '5,000 ر.س',
    'pricing.annualPrice': '54,000 ر.س',
    'pricing.annualOriginal': '60,000 ر.س',
    'pricing.discount': 'خصم 10%',
    'pricing.save': 'وفر 6,000 ر.س',
    'pricing.perMonth': 'شهرياً',
    'pricing.perYear': 'سنوياً',
    'pricing.bestValue': 'الأفضل قيمة',
    'pricing.subscribe': 'اشترك الآن',
    'pricing.paymentMethods': 'طرق الدفع المتاحة',

    // Forms
    'form.uploadFiles': 'رفع القوائم المالية',
    'form.companyData': 'بيانات الشركة',
    'form.dataSummary': 'ملخص البيانات',
    'form.next': 'التالي',
    'form.previous': 'السابق',
    'form.startAnalysis': 'بدء التحليل الذكي',
    'form.analyzing': 'جاري التحليل...',
    'form.companyName': 'اسم الشركة',
    'form.sector': 'القطاع',
    'form.activity': 'النشاط',
    'form.legalEntity': 'الكيان القانوني',
    'form.yearsToAnalyze': 'سنوات التحليل',
    'form.comparisonLevel': 'مستوى المقارنة',
    'form.analysisType': 'نوع التحليل',
    'form.language': 'اللغة',

    // Messages
    'message.filesUploaded': 'تم رفع {count} ملف بنجاح',
    'message.dataEntered': 'تم إدخال البيانات المالية بنجاح',
    'message.analysisStarted': 'بدأ التحليل بنجاح!',
    'message.error': 'حدث خطأ',
    'message.pleaseEnterCompany': 'يرجى إدخال تفاصيل الشركة',
    'message.pleaseUploadFiles': 'يرجى رفع الملفات أو إدخال البيانات المالية',
    'message.analysisFailed': 'فشل في بدء التحليل',

    // Footer
    'footer.contact': 'التواصل والدعم',
    'footer.office': 'المكتب: المملكة العربية السعودية، جدة',
    'footer.email': 'البريد الإلكتروني: finclick.ai@gmail.com',
    'footer.phone': 'الهاتف: 00966544827213',
    'footer.whatsapp': 'واتساب: 00966544827213',
    'footer.telegram': 'تلغرام: 00966544827213',
    'footer.legalPolicies': 'السياسات القانونية',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الاستخدام',
    'footer.security': 'الأمان',
    'footer.compliance': 'الامتثال',
    'footer.intellectualProperty': 'سياسة حقوق الملكية الفكرية',
    'footer.payment': 'سياسة الدفع والاشتراك',
    'footer.system': 'النظام',
    'footer.features': 'مميزات النظام',
    'footer.analysisTypes': 'أنواع التحليل',
    'footer.subscriptions': 'الاشتراكات والأسعار',
    'footer.manual': 'كتيب النظام',
    'footer.faq': 'الأسئلة الشائعة',
    'footer.company': 'الشركة',
    'footer.vision': 'الرؤية والرسالة والأهداف',
    'footer.events': 'الفعاليات',
    'footer.blog': 'المدونة/الأخبار',
    'footer.media': 'الإعلام',
    'footer.jobs': 'الوظائف',
    'footer.copyright': 'FinClick.AI 2025 جميع الحقوق محفوظة',
    'footer.madeIn': 'صنع في المملكة العربية السعودية',

    // Market Data
    'market.ticker': 'مؤشرات السوق المباشرة',
    'market.tasi': 'تاسي',
    'market.saudi': 'السوق السعودي',
    'market.gulf': 'الخليج',
    'market.arab': 'العربي',
    'market.asia': 'آسيا',
    'market.africa': 'أفريقيا',
    'market.europe': 'أوروبا',
    'market.america': 'أمريكا',
    'market.australia': 'أستراليا',
    'market.global': 'عالمي',

    // Status
    'status.excellent': 'ممتاز',
    'status.good': 'جيد',
    'status.average': 'متوسط',
    'status.poor': 'ضعيف',
    'status.positive': 'إيجابي',
    'status.negative': 'سلبي',
    'status.neutral': 'محايد',
    'status.high': 'عالي',
    'status.medium': 'متوسط',
    'status.low': 'منخفض',

    // Common
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.ok': 'موافق',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.view': 'عرض',
    'common.download': 'تحميل',
    'common.print': 'طباعة',
    'common.share': 'مشاركة',
    'common.copy': 'نسخ',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.refresh': 'تحديث',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.warning': 'تحذير',
    'common.info': 'معلومات',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.analysis': 'Analysis',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',

    // Hero Section
    'hero.title': 'FinClick.AI',
    'hero.subtitle': 'Revolutionary Intelligent Financial Analysis System',
    'hero.description': 'A system that turns the world upside down and changes all the rules',
    'hero.description2': 'A comprehensive platform and system that replaces any financial manager, analyst or expert',
    'hero.startAnalysis': 'Start Analysis Now',
    'hero.discoverMore': 'Discover More',

    // Features
    'features.title': 'Why FinClick.AI?',
    'features.subtitle': 'Revolution and Qualitative Leap in Financial Analysis',
    'features.servesAll': 'Serves all financial analysis beneficiaries',
    'features.aiPowered': 'Based on Advanced Artificial Intelligence',
    'features.allTypes': 'Provides all types of financial analysis',
    'features.cloudBased': 'Cloud environment accessible anywhere',
    'features.userFriendly': 'Clear professional interface',
    'features.fast': 'Speed - Analysis in seconds',
    'features.accurate': 'Ultimate precision and efficiency',
    'features.secure': 'High-level Security',
    'features.superAnalyst': 'Super financial analyst',
    'features.reports': 'Detailed reports and presentations',
    'features.comparisons': 'Comparisons at all levels of the world',
    'features.quality': 'Certified global quality',

    // Steps
    'steps.title': 'System Usage Steps',
    'steps.subtitle': '3 simple steps to get comprehensive analysis',
    'step1.title': 'Upload Your Statements',
    'step1.description': 'Upload your financial statements in any format for up to 10 years',
    'step2.title': 'Select Analysis Options',
    'step2.description': 'Choose language, sector, activity, comparison level and analysis type',
    'step3.title': 'Click Analysis Button',
    'step3.description': 'Click one button and get comprehensive analysis!',

    // Analysis Types
    'analysisTypes.title': 'Types of Financial Analysis',
    'analysisTypes.subtitle': '181+ comprehensive financial analysis types from classical to AI',
    'analysisTypes.basic': 'Basic/Classical Financial Analysis',
    'analysisTypes.intermediate': 'Intermediate Financial Analysis',
    'analysisTypes.advanced': 'Advanced Financial Analysis',
    'analysisTypes.complex': 'Complex & Sophisticated Analysis',
    'analysisTypes.ai': 'AI-Powered Financial Analysis',
    'analysisTypes.comprehensive': 'Comprehensive Analysis',

    // Free Tools
    'tools.title': 'Free Tools',
    'tools.news': 'Live Financial News',
    'tools.calendar': 'Economic Calendar',
    'tools.calculator': 'Fair Stock Price Calculator',
    'tools.roi': 'ROI Calculator',
    'tools.pe': 'P/E Ratio Calculator',
    'tools.inflation': 'Inflation Calculator',
    'tools.sentiment': 'Interactive Market Sentiment',
    'tools.chatbot': 'Free Financial GPT Bot',

    // Testimonials
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': 'Our distinguished clients opinions',

    // Pricing
    'pricing.title': 'Subscription Pricing',
    'pricing.subtitle': 'Flexible plans that suit all needs',
    'pricing.monthly': 'Monthly Plan',
    'pricing.annual': 'Annual Plan',
    'pricing.monthlyPrice': '5,000 SAR',
    'pricing.annualPrice': '54,000 SAR',
    'pricing.annualOriginal': '60,000 SAR',
    'pricing.discount': '10% Discount',
    'pricing.save': 'Save 6,000 SAR',
    'pricing.perMonth': 'per month',
    'pricing.perYear': 'annually',
    'pricing.bestValue': 'Best Value',
    'pricing.subscribe': 'Subscribe Now',
    'pricing.paymentMethods': 'Available Payment Methods',

    // Forms
    'form.uploadFiles': 'Upload Financial Statements',
    'form.companyData': 'Company Data',
    'form.dataSummary': 'Data Summary',
    'form.next': 'Next',
    'form.previous': 'Previous',
    'form.startAnalysis': 'Start Smart Analysis',
    'form.analyzing': 'Analyzing...',
    'form.companyName': 'Company Name',
    'form.sector': 'Sector',
    'form.activity': 'Activity',
    'form.legalEntity': 'Legal Entity',
    'form.yearsToAnalyze': 'Years to Analyze',
    'form.comparisonLevel': 'Comparison Level',
    'form.analysisType': 'Analysis Type',
    'form.language': 'Language',

    // Messages
    'message.filesUploaded': '{count} files uploaded successfully',
    'message.dataEntered': 'Financial data entered successfully',
    'message.analysisStarted': 'Analysis started successfully!',
    'message.error': 'An error occurred',
    'message.pleaseEnterCompany': 'Please enter company details',
    'message.pleaseUploadFiles': 'Please upload files or enter financial data',
    'message.analysisFailed': 'Failed to start analysis',

    // Footer
    'footer.contact': 'Contact & Support',
    'footer.office': 'Office: Kingdom of Saudi Arabia, Jeddah',
    'footer.email': 'Email: finclick.ai@gmail.com',
    'footer.phone': 'Phone: 00966544827213',
    'footer.whatsapp': 'WhatsApp: 00966544827213',
    'footer.telegram': 'Telegram: 00966544827213',
    'footer.legalPolicies': 'Legal Policies',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    'footer.security': 'Security',
    'footer.compliance': 'Compliance',
    'footer.intellectualProperty': 'Intellectual Property Policy',
    'footer.payment': 'Payment & Subscription Policy',
    'footer.system': 'System',
    'footer.features': 'System Features',
    'footer.analysisTypes': 'Analysis Types',
    'footer.subscriptions': 'Subscriptions & Pricing',
    'footer.manual': 'System Manual',
    'footer.faq': 'FAQ',
    'footer.company': 'Company',
    'footer.vision': 'Vision, Mission & Objectives',
    'footer.events': 'Events',
    'footer.blog': 'Blog/News',
    'footer.media': 'Media',
    'footer.jobs': 'Jobs',
    'footer.copyright': 'FinClick.AI 2025 All Rights Reserved',
    'footer.madeIn': 'Made in Kingdom of Saudi Arabia',

    // Market Data
    'market.ticker': 'Live Market Indicators',
    'market.tasi': 'TASI',
    'market.saudi': 'Saudi Market',
    'market.gulf': 'Gulf',
    'market.arab': 'Arab',
    'market.asia': 'Asia',
    'market.africa': 'Africa',
    'market.europe': 'Europe',
    'market.america': 'America',
    'market.australia': 'Australia',
    'market.global': 'Global',

    // Status
    'status.excellent': 'Excellent',
    'status.good': 'Good',
    'status.average': 'Average',
    'status.poor': 'Poor',
    'status.positive': 'Positive',
    'status.negative': 'Negative',
    'status.neutral': 'Neutral',
    'status.high': 'High',
    'status.medium': 'Medium',
    'status.low': 'Low',

    // Common
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.download': 'Download',
    'common.print': 'Print',
    'common.share': 'Share',
    'common.copy': 'Copy',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.refresh': 'Refresh',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // Get language from localStorage or default to Arabic
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Update document direction
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update document direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const value: LanguageContextType = {
    language,
    toggleLanguage,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
