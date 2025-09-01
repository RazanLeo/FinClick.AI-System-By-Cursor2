'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Eye,
  Share2,
  Search,
  Filter,
  Calendar,
  BarChart3,
  TrendingUp,
  Brain,
  Calculator,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Users,
  DollarSign,
  PieChart,
  LineChart,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  RefreshCw,
  Settings,
  HelpCircle,
  BookOpen,
  Image,
  Upload,
  ExternalLink,
  Link,
  Mail,
  Phone,
  MapPin,
  Globe,
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
  SpaceXAIAI,
  Trash2,
  Edit,
  Copy,
  Archive,
  Tag,
  Bookmark,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkX,
  BookmarkCheck,
  BookmarkStar,
  BookmarkHeart,
  BookmarkPlus2,
  BookmarkMinus2,
  BookmarkX2,
  BookmarkCheck2,
  BookmarkStar2,
  BookmarkHeart2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Report {
  id: string;
  title: string;
  englishTitle: string;
  companyName: string;
  englishCompanyName: string;
  analysisType: string;
  englishAnalysisType: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  accuracy: number;
  pages: number;
  fileSize: string;
  format: 'pdf' | 'excel' | 'word' | 'powerpoint';
  isBookmarked: boolean;
  tags: string[];
  englishTags: string[];
}

export default function ReportsPage() {
  const { language, toggleLanguage } = useLanguage();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const reports: Report[] = [
    {
      id: '1',
      title: 'تحليل مالي شامل - شركة أرامكو',
      englishTitle: 'Comprehensive Financial Analysis - Aramco',
      companyName: 'شركة أرامكو',
      englishCompanyName: 'Aramco',
      analysisType: 'التحليل الأساسي',
      englishAnalysisType: 'Basic Analysis',
      date: '2024-01-15',
      status: 'completed',
      accuracy: 98.5,
      pages: 45,
      fileSize: '2.3 MB',
      format: 'pdf',
      isBookmarked: true,
      tags: ['تحليل أساسي', 'شركة نفط', 'سعودية'],
      englishTags: ['Basic Analysis', 'Oil Company', 'Saudi']
    },
    {
      id: '2',
      title: 'تحليل متقدم - بنك الراجحي',
      englishTitle: 'Advanced Analysis - Al Rajhi Bank',
      companyName: 'بنك الراجحي',
      englishCompanyName: 'Al Rajhi Bank',
      analysisType: 'التحليل المتقدم',
      englishAnalysisType: 'Advanced Analysis',
      date: '2024-01-14',
      status: 'completed',
      accuracy: 97.2,
      pages: 67,
      fileSize: '3.1 MB',
      format: 'excel',
      isBookmarked: false,
      tags: ['تحليل متقدم', 'بنك', 'مالية'],
      englishTags: ['Advanced Analysis', 'Bank', 'Finance']
    },
    {
      id: '3',
      title: 'تحليل متخصص - شركة سابك',
      englishTitle: 'Specialized Analysis - SABIC',
      companyName: 'شركة سابك',
      englishCompanyName: 'SABIC',
      analysisType: 'التحليل المتخصص',
      englishAnalysisType: 'Specialized Analysis',
      date: '2024-01-13',
      status: 'pending',
      accuracy: 0,
      pages: 0,
      fileSize: '0 MB',
      format: 'pdf',
      isBookmarked: false,
      tags: ['تحليل متخصص', 'كيميائية', 'صناعية'],
      englishTags: ['Specialized Analysis', 'Chemical', 'Industrial']
    },
    {
      id: '4',
      title: 'تحليل أساسي - شركة الاتصالات السعودية',
      englishTitle: 'Basic Analysis - Saudi Telecom',
      companyName: 'شركة الاتصالات السعودية',
      englishCompanyName: 'Saudi Telecom',
      analysisType: 'التحليل الأساسي',
      englishAnalysisType: 'Basic Analysis',
      date: '2024-01-12',
      status: 'completed',
      accuracy: 99.1,
      pages: 38,
      fileSize: '1.8 MB',
      format: 'word',
      isBookmarked: true,
      tags: ['تحليل أساسي', 'اتصالات', 'تقنية'],
      englishTags: ['Basic Analysis', 'Telecom', 'Technology']
    },
    {
      id: '5',
      title: 'تحليل متقدم - شركة الكهرباء السعودية',
      englishTitle: 'Advanced Analysis - Saudi Electricity',
      companyName: 'شركة الكهرباء السعودية',
      englishCompanyName: 'Saudi Electricity',
      analysisType: 'التحليل المتقدم',
      englishAnalysisType: 'Advanced Analysis',
      date: '2024-01-11',
      status: 'completed',
      accuracy: 96.8,
      pages: 52,
      fileSize: '2.7 MB',
      format: 'powerpoint',
      isBookmarked: false,
      tags: ['تحليل متقدم', 'كهرباء', 'خدمات'],
      englishTags: ['Advanced Analysis', 'Electricity', 'Services']
    },
    {
      id: '6',
      title: 'تحليل متخصص - شركة معادن',
      englishTitle: 'Specialized Analysis - Maaden',
      companyName: 'شركة معادن',
      englishCompanyName: 'Maaden',
      analysisType: 'التحليل المتخصص',
      englishAnalysisType: 'Specialized Analysis',
      date: '2024-01-10',
      status: 'completed',
      accuracy: 95.3,
      pages: 78,
      fileSize: '4.2 MB',
      format: 'pdf',
      isBookmarked: true,
      tags: ['تحليل متخصص', 'تعدين', 'موارد طبيعية'],
      englishTags: ['Specialized Analysis', 'Mining', 'Natural Resources']
    }
  ];

  const filters = [
    { id: 'all', name: language === 'ar' ? 'الكل' : 'All', count: reports.length },
    { id: 'completed', name: language === 'ar' ? 'مكتمل' : 'Completed', count: reports.filter(r => r.status === 'completed').length },
    { id: 'pending', name: language === 'ar' ? 'قيد الانتظار' : 'Pending', count: reports.filter(r => r.status === 'pending').length },
    { id: 'bookmarked', name: language === 'ar' ? 'المحفوظة' : 'Bookmarked', count: reports.filter(r => r.isBookmarked).length }
  ];

  const sortOptions = [
    { value: 'date', label: language === 'ar' ? 'التاريخ' : 'Date' },
    { value: 'accuracy', label: language === 'ar' ? 'الدقة' : 'Accuracy' },
    { value: 'pages', label: language === 'ar' ? 'عدد الصفحات' : 'Pages' },
    { value: 'company', label: language === 'ar' ? 'الشركة' : 'Company' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-finclick-success';
      case 'pending': return 'text-finclick-warning';
      case 'failed': return 'text-finclick-error';
      default: return 'text-finclick-gold';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return FileText;
      case 'excel': return BarChart3;
      case 'word': return FileText;
      case 'powerpoint': return FileText;
      default: return FileText;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'pdf': return 'text-finclick-error';
      case 'excel': return 'text-finclick-success';
      case 'word': return 'text-finclick-info';
      case 'powerpoint': return 'text-finclick-warning';
      default: return 'text-finclick-gold';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = (language === 'ar' ? report.title : report.englishTitle)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      (language === 'ar' ? report.companyName : report.englishCompanyName)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'completed' && report.status === 'completed') ||
      (activeFilter === 'pending' && report.status === 'pending') ||
      (activeFilter === 'bookmarked' && report.isBookmarked);
    
    return matchesSearch && matchesFilter;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'accuracy':
        return b.accuracy - a.accuracy;
      case 'pages':
        return b.pages - a.pages;
      case 'company':
        return (language === 'ar' ? a.companyName : a.englishCompanyName)
          .localeCompare(language === 'ar' ? b.companyName : b.englishCompanyName);
      default:
        return 0;
    }
  });

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
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-finclick-gold mb-2 font-playfair">
                  {language === 'ar' ? 'التقارير' : 'Reports'}
                </h1>
                <p className="text-finclick-gold/70 font-playfair">
                  {language === 'ar'
                    ? 'جميع التقارير المالية والتحليلات السابقة'
                    : 'All financial reports and previous analyses'
                  }
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="btn btn-primary btn-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {language === 'ar' ? 'تقرير جديد' : 'New Report'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-finclick-gold/50" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'البحث في التقارير...' : 'Search reports...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-finclick-gold/30 rounded-lg bg-white/50 text-finclick-gold font-playfair focus:border-finclick-gold focus:outline-none"
                />
              </div>

              {/* Filter */}
              <div>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-finclick-gold/30 rounded-lg bg-white/50 text-finclick-gold font-playfair focus:border-finclick-gold focus:outline-none"
                >
                  {filters.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {filter.name} ({filter.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-finclick-gold/30 rounded-lg bg-white/50 text-finclick-gold font-playfair focus:border-finclick-gold focus:outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Reports Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {sortedReports.map((report, index) => {
              const StatusIcon = getStatusIcon(report.status);
              const FormatIcon = getFormatIcon(report.format);
              
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg hover:border-finclick-gold transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-finclick-gold/10 ${getFormatColor(report.format)}`}>
                        <FormatIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
                          {language === 'ar' ? report.title : report.englishTitle}
                        </h3>
                        <p className="text-sm text-finclick-gold/70 font-playfair">
                          {language === 'ar' ? report.companyName : report.englishCompanyName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                        className="p-1 rounded hover:bg-finclick-gold/10 transition-all duration-300"
                      >
                        {selectedReport === report.id ? (
                          <ChevronUp className="w-4 h-4 text-finclick-gold" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-finclick-gold" />
                        )}
                      </button>
                      <button className="p-1 rounded hover:bg-finclick-gold/10 transition-all duration-300">
                        {report.isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-finclick-gold" />
                        ) : (
                          <BookmarkPlus className="w-4 h-4 text-finclick-gold" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-finclick-gold/5 rounded-lg">
                      <p className="text-sm text-finclick-gold/70 font-playfair">
                        {language === 'ar' ? 'التاريخ' : 'Date'}
                      </p>
                      <p className="font-semibold text-finclick-gold font-playfair">
                        {new Date(report.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-finclick-gold/5 rounded-lg">
                      <p className="text-sm text-finclick-gold/70 font-playfair">
                        {language === 'ar' ? 'الدقة' : 'Accuracy'}
                      </p>
                      <p className="font-semibold text-finclick-gold font-playfair">
                        {report.status === 'completed' ? `${report.accuracy}%` : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${getStatusColor(report.status)}/10`}>
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(report.status)}`} />
                      </div>
                      <span className={`text-sm font-medium ${getStatusColor(report.status)}`}>
                        {language === 'ar' 
                          ? (report.status === 'completed' ? 'مكتمل' : report.status === 'pending' ? 'قيد الانتظار' : 'فشل')
                          : (report.status === 'completed' ? 'Completed' : report.status === 'pending' ? 'Pending' : 'Failed')
                        }
                      </span>
                    </div>
                    <div className="text-sm text-finclick-gold/70 font-playfair">
                      {report.pages} {language === 'ar' ? 'صفحة' : 'pages'} • {report.fileSize}
                    </div>
                  </div>

                  {selectedReport === report.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-finclick-gold/20"
                    >
                      <div className="mb-4">
                        <h4 className="font-semibold text-finclick-gold mb-2 font-playfair">
                          {language === 'ar' ? 'العلامات:' : 'Tags:'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(language === 'ar' ? report.tags : report.englishTags).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-finclick-gold/10 text-finclick-gold text-xs rounded-full font-playfair"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 btn btn-primary btn-sm flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          {language === 'ar' ? 'عرض' : 'View'}
                        </button>
                        <button className="flex-1 btn btn-outline btn-sm flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          {language === 'ar' ? 'تحميل' : 'Download'}
                        </button>
                        <button className="p-2 rounded-lg bg-finclick-gold/10 text-finclick-gold hover:bg-finclick-gold/20 transition-all duration-300">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {selectedReport !== report.id && (
                    <div className="flex gap-2">
                      <button className="flex-1 btn btn-primary btn-sm flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        {language === 'ar' ? 'عرض' : 'View'}
                      </button>
                      <button className="flex-1 btn btn-outline btn-sm flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        {language === 'ar' ? 'تحميل' : 'Download'}
                      </button>
                      <button className="p-2 rounded-lg bg-finclick-gold/10 text-finclick-gold hover:bg-finclick-gold/20 transition-all duration-300">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg text-center">
              <FileText className="w-8 h-8 text-finclick-gold mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                {reports.length}
              </h3>
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'إجمالي التقارير' : 'Total Reports'}
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg text-center">
              <CheckCircle className="w-8 h-8 text-finclick-success mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                {reports.filter(r => r.status === 'completed').length}
              </h3>
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'التقارير المكتملة' : 'Completed Reports'}
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg text-center">
              <BookmarkCheck className="w-8 h-8 text-finclick-warning mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                {reports.filter(r => r.isBookmarked).length}
              </h3>
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'التقارير المحفوظة' : 'Bookmarked Reports'}
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg text-center">
              <Target className="w-8 h-8 text-finclick-error mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                {Math.round(reports.filter(r => r.status === 'completed').reduce((acc, r) => acc + r.accuracy, 0) / reports.filter(r => r.status === 'completed').length)}%
              </h3>
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'متوسط الدقة' : 'Average Accuracy'}
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
