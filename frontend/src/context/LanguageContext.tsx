import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Translations> = {
  en: {
    // Header
    'header.home': 'Home',
    'header.dashboard': 'Dashboard',
    'header.analysis': 'Analysis',
    'header.about': 'About',
    'header.features': 'Features',
    'header.pricing': 'Pricing',
    'header.contact': 'Contact',
    'header.login': 'Login',
    'header.register': 'Register',
    'header.logout': 'Logout',
    'header.profile': 'Profile',
    'header.settings': 'Settings',
    'header.language': 'Language',
    'header.arabic': 'Arabic',
    'header.english': 'English',

    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.analysis': 'Financial Analysis',
    'sidebar.forecasting': 'Forecasting',
    'sidebar.reports': 'Reports',
    'sidebar.settings': 'Settings',
    'sidebar.profile': 'Profile',
    'sidebar.logout': 'Logout',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Welcome to your financial analysis dashboard',
    'dashboard.total_revenue': 'Total Revenue',
    'dashboard.total_expenses': 'Total Expenses',
    'dashboard.net_profit': 'Net Profit',
    'dashboard.active_users': 'Active Users',
    'dashboard.from_last_month': 'from last month',
    'dashboard.revenue_vs_expenses': 'Revenue vs Expenses',
    'dashboard.profit_trend': 'Profit Trend',
    'dashboard.chart_placeholder': 'Chart will be displayed here',
    'dashboard.recent_transactions': 'Recent Transactions',
    'dashboard.description': 'Description',
    'dashboard.amount': 'Amount',
    'dashboard.date': 'Date',
    'dashboard.status': 'Status',

    // Home Page
    'home.hero.title': 'Revolutionary Intelligent Financial Analysis System',
    'home.hero.subtitle': '170+ comprehensive financial analysis types powered by advanced AI',
    'home.hero.cta': 'Get Started Free',
    'home.hero.demo': 'Watch Demo',
    'home.stats.users': 'Active Users',
    'home.stats.analyses': 'Analyses Completed',
    'home.stats.companies': 'Companies Analyzed',
    'home.stats.accuracy': 'Accuracy Rate',
    'home.features.title': 'Powerful Features',
    'home.features.ai.title': 'Advanced AI Engine',
    'home.features.ai.description': 'GPT-4, FinBERT, and advanced transformers for intelligent analysis',
    'home.features.analysis.title': '170+ Analysis Types',
    'home.features.analysis.description': 'From basic ratios to advanced portfolio optimization',
    'home.features.documents.title': 'Smart Document Processing',
    'home.features.documents.description': 'PDF, Excel, Word, and image support with OCR',
    'home.features.reports.title': 'Professional Reports',
    'home.features.reports.description': 'Generate Word, PDF, and PowerPoint reports',
    'home.how.title': 'How It Works',
    'home.how.step1': 'Upload your financial documents',
    'home.how.step2': 'Select analysis types',
    'home.how.step3': 'Get AI-powered insights',
    'home.how.step4': 'Download professional reports',
    'home.testimonials.title': 'What Our Users Say',
    'home.testimonials.user1.name': 'Ahmed Al-Rashid',
    'home.testimonials.user1.role': 'Financial Analyst',
    'home.testimonials.user1.comment': 'This system has revolutionized our financial analysis process. We can now analyze companies in minutes instead of weeks.',
    'home.testimonials.user2.name': 'Sarah Johnson',
    'home.testimonials.user2.role': 'Investment Manager',
    'home.testimonials.user2.comment': 'The AI insights are incredibly accurate and the recommendations are actionable. This is a game-changer for investment decisions.',
    'home.cta.title': 'Ready to Transform Your Financial Analysis?',
    'home.cta.subtitle': 'Join thousands of professionals using FinClick.AI',
    'home.cta.button': 'Start Free Trial',

    // Footer
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.careers': 'Careers',
    'footer.press': 'Press',
    'footer.services': 'Services',
    'footer.financial_analysis': 'Financial Analysis',
    'footer.forecasting': 'Forecasting',
    'footer.reporting': 'Reporting',
    'footer.support': 'Support',
    'footer.help_center': 'Help Center',
    'footer.contact': 'Contact Us',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',
    'footer.made_in': 'Made with ❤️ in Saudi Arabia',
  },
  ar: {
    // Header
    'header.home': 'الرئيسية',
    'header.dashboard': 'لوحة التحكم',
    'header.analysis': 'التحليل',
    'header.about': 'حول',
    'header.features': 'المميزات',
    'header.pricing': 'الأسعار',
    'header.contact': 'اتصل بنا',
    'header.login': 'تسجيل الدخول',
    'header.register': 'إنشاء حساب',
    'header.logout': 'تسجيل الخروج',
    'header.profile': 'الملف الشخصي',
    'header.settings': 'الإعدادات',
    'header.language': 'اللغة',
    'header.arabic': 'العربية',
    'header.english': 'الإنجليزية',

    // Sidebar
    'sidebar.dashboard': 'لوحة التحكم',
    'sidebar.analysis': 'التحليل المالي',
    'sidebar.forecasting': 'التنبؤ',
    'sidebar.reports': 'التقارير',
    'sidebar.settings': 'الإعدادات',
    'sidebar.profile': 'الملف الشخصي',
    'sidebar.logout': 'تسجيل الخروج',

    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.subtitle': 'مرحباً بك في لوحة تحكم التحليل المالي',
    'dashboard.total_revenue': 'إجمالي الإيرادات',
    'dashboard.total_expenses': 'إجمالي المصاريف',
    'dashboard.net_profit': 'صافي الربح',
    'dashboard.active_users': 'المستخدمون النشطون',
    'dashboard.from_last_month': 'من الشهر الماضي',
    'dashboard.revenue_vs_expenses': 'الإيرادات مقابل المصاريف',
    'dashboard.profit_trend': 'اتجاه الربح',
    'dashboard.chart_placeholder': 'سيتم عرض الرسم البياني هنا',
    'dashboard.recent_transactions': 'المعاملات الحديثة',
    'dashboard.description': 'الوصف',
    'dashboard.amount': 'المبلغ',
    'dashboard.date': 'التاريخ',
    'dashboard.status': 'الحالة',

    // Home Page
    'home.hero.title': 'نظام التحليل المالي الذكي الثوري',
    'home.hero.subtitle': '170+ نوع تحليل مالي شامل يعمل بالذكاء الاصطناعي المتقدم',
    'home.hero.cta': 'ابدأ مجاناً',
    'home.hero.demo': 'شاهد العرض التوضيحي',
    'home.stats.users': 'مستخدم نشط',
    'home.stats.analyses': 'تحليل مكتمل',
    'home.stats.companies': 'شركة محللة',
    'home.stats.accuracy': 'معدل الدقة',
    'home.features.title': 'مميزات قوية',
    'home.features.ai.title': 'محرك ذكاء اصطناعي متقدم',
    'home.features.ai.description': 'GPT-4 و FinBERT ومحولات متقدمة للتحليل الذكي',
    'home.features.analysis.title': '170+ نوع تحليل',
    'home.features.analysis.description': 'من النسب الأساسية إلى تحسين المحفظة المتقدم',
    'home.features.documents.title': 'معالجة ذكية للمستندات',
    'home.features.documents.description': 'دعم PDF و Excel و Word والصور مع OCR',
    'home.features.reports.title': 'تقارير احترافية',
    'home.features.reports.description': 'إنشاء تقارير Word و PDF و PowerPoint',
    'home.how.title': 'كيف يعمل',
    'home.how.step1': 'ارفع مستنداتك المالية',
    'home.how.step2': 'اختر أنواع التحليل',
    'home.how.step3': 'احصل على رؤى ذكية',
    'home.how.step4': 'حمل التقارير الاحترافية',
    'home.testimonials.title': 'ماذا يقول مستخدمونا',
    'home.testimonials.user1.name': 'أحمد الراشد',
    'home.testimonials.user1.role': 'محلل مالي',
    'home.testimonials.user1.comment': 'هذا النظام قد أحدث ثورة في عملية التحليل المالي لدينا. يمكننا الآن تحليل الشركات في دقائق بدلاً من أسابيع.',
    'home.testimonials.user2.name': 'سارة جونسون',
    'home.testimonials.user2.role': 'مدير استثمار',
    'home.testimonials.user2.comment': 'الرؤى الذكية دقيقة بشكل لا يصدق والتوصيات قابلة للتنفيذ. هذا يغير قواعد اللعبة لقرارات الاستثمار.',
    'home.cta.title': 'هل أنت مستعد لتحويل تحليلك المالي؟',
    'home.cta.subtitle': 'انضم إلى آلاف المحترفين الذين يستخدمون FinClick.AI',
    'home.cta.button': 'ابدأ التجربة المجانية',

    // Footer
    'footer.company': 'الشركة',
    'footer.about': 'حولنا',
    'footer.careers': 'الوظائف',
    'footer.press': 'الصحافة',
    'footer.services': 'الخدمات',
    'footer.financial_analysis': 'التحليل المالي',
    'footer.forecasting': 'التنبؤ',
    'footer.reporting': 'التقارير',
    'footer.support': 'الدعم',
    'footer.help_center': 'مركز المساعدة',
    'footer.contact': 'اتصل بنا',
    'footer.legal': 'القانونية',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',
    'footer.cookies': 'سياسة ملفات تعريف الارتباط',
    'footer.made_in': 'صنع بحب ❤️ في المملكة العربية السعودية',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    return currentTranslations[key] || key;
  };

  const isRTL = language === 'ar';

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : 'font-english'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};
