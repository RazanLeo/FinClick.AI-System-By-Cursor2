'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Brain,
  Activity,
  Calendar,
  Star,
  Award,
  Target,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  Share2,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Zap,
  Shield,
  Globe,
  Database,
  Cpu,
  Target as TargetIcon,
  Crown,
  User,
  LogOut,
  Home,
  BarChart,
  FileBarChart,
  Settings as SettingsIcon,
  HelpCircle,
  Info
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface DashboardStats {
  totalAnalyses: number;
  completedAnalyses: number;
  pendingAnalyses: number;
  accuracy: number;
  totalUsers: number;
  revenue: number;
  growth: number;
}

interface RecentAnalysis {
  id: string;
  companyName: string;
  analysisType: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  accuracy: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  href: string;
}

export default function DashboardPage() {
  const { language, toggleLanguage } = useLanguage();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 1247,
    completedAnalyses: 1189,
    pendingAnalyses: 58,
    accuracy: 98.5,
    totalUsers: 15420,
    revenue: 1250000,
    growth: 23.5
  });

  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([
    {
      id: '1',
      companyName: 'شركة أرامكو',
      analysisType: 'التحليل الأساسي',
      status: 'completed',
      date: '2024-01-15',
      accuracy: 98.5
    },
    {
      id: '2',
      companyName: 'بنك الراجحي',
      analysisType: 'التحليل المتقدم',
      status: 'completed',
      date: '2024-01-14',
      accuracy: 97.2
    },
    {
      id: '3',
      companyName: 'شركة سابك',
      analysisType: 'التحليل المتخصص',
      status: 'pending',
      date: '2024-01-13',
      accuracy: 0
    },
    {
      id: '4',
      companyName: 'شركة الاتصالات السعودية',
      analysisType: 'التحليل الأساسي',
      status: 'completed',
      date: '2024-01-12',
      accuracy: 99.1
    }
  ]);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: language === 'ar' ? 'تحليل جديد' : 'New Analysis',
      description: language === 'ar' ? 'ابدأ تحليل مالي جديد' : 'Start a new financial analysis',
      icon: Plus,
      color: 'text-finclick-success',
      href: '/analysis'
    },
    {
      id: '2',
      title: language === 'ar' ? 'التقارير' : 'Reports',
      description: language === 'ar' ? 'عرض جميع التقارير السابقة' : 'View all previous reports',
      icon: FileBarChart,
      color: 'text-finclick-warning',
      href: '/reports'
    },
    {
      id: '3',
      title: language === 'ar' ? 'الأدوات المجانية' : 'Free Tools',
      description: language === 'ar' ? 'استخدم الأدوات المالية المجانية' : 'Use free financial tools',
      icon: Calculator,
      color: 'text-finclick-error',
      href: '/tools'
    },
    {
      id: '4',
      title: language === 'ar' ? 'الإعدادات' : 'Settings',
      description: language === 'ar' ? 'تخصيص إعدادات الحساب' : 'Customize account settings',
      icon: SettingsIcon,
      color: 'text-finclick-info',
      href: '/settings'
    }
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
          {/* Dashboard Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-finclick-gold mb-2 font-playfair">
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </h1>
                <p className="text-finclick-gold/70 font-playfair">
                  {language === 'ar'
                    ? 'مرحباً بك في نظام التحليل المالي المتقدم'
                    : 'Welcome to the Advanced Financial Analysis System'
                  }
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-finclick-gold/20 hover:border-finclick-gold transition-all duration-300">
                  <Bell className="w-5 h-5 text-finclick-gold" />
                </button>
                <button className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-finclick-gold/20 hover:border-finclick-gold transition-all duration-300">
                  <Settings className="w-5 h-5 text-finclick-gold" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-finclick-success/10 text-finclick-success">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <ArrowUp className="w-5 h-5 text-finclick-success" />
              </div>
              <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                {stats.totalAnalyses.toLocaleString()}
              </h3>
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'إجمالي التحليلات' : 'Total Analyses'}
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-finclick-warning/10 text-finclick-warning">
                  <Users className="w-6 h-6" />
                </div>
                <ArrowUp className="w-5 h-5 text-finclick-warning" />
              </div>
              <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                {stats.totalUsers.toLocaleString()}
              </h3>
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-finclick-error/10 text-finclick-error">
                  <DollarSign className="w-6 h-6" />
                </div>
                <ArrowUp className="w-5 h-5 text-finclick-error" />
              </div>
              <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                ${(stats.revenue / 1000000).toFixed(1)}M
              </h3>
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'الإيرادات' : 'Revenue'}
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-finclick-info/10 text-finclick-info">
                  <Target className="w-6 h-6" />
                </div>
                <ArrowUp className="w-5 h-5 text-finclick-info" />
              </div>
              <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                {stats.accuracy}%
              </h3>
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'دقة التحليل' : 'Analysis Accuracy'}
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-finclick-gold mb-6 font-playfair">
              {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => (
                <motion.div
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg cursor-pointer hover:border-finclick-gold transition-all duration-300"
                >
                  <div className={`p-3 rounded-lg bg-finclick-gold/10 ${action.color} mb-4 w-fit`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-finclick-gold mb-2 font-playfair">
                    {action.title}
                  </h3>
                  <p className="text-sm text-finclick-gold/70 font-playfair">
                    {action.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Analyses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-finclick-gold font-playfair">
                  {language === 'ar' ? 'التحليلات الحديثة' : 'Recent Analyses'}
                </h2>
                <button className="text-finclick-gold hover:text-finclick-gold/80 font-playfair">
                  {language === 'ar' ? 'عرض الكل' : 'View All'}
                </button>
              </div>

              <div className="space-y-4">
                {recentAnalyses.map((analysis) => {
                  const StatusIcon = getStatusIcon(analysis.status);
                  return (
                    <motion.div
                      key={analysis.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-finclick-gold/5 rounded-lg hover:bg-finclick-gold/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${getStatusColor(analysis.status)}/10`}>
                          <StatusIcon className={`w-5 h-5 ${getStatusColor(analysis.status)}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-finclick-gold font-playfair">
                            {analysis.companyName}
                          </h3>
                          <p className="text-sm text-finclick-gold/70 font-playfair">
                            {analysis.analysisType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-finclick-gold/70 font-playfair">
                            {analysis.date}
                          </p>
                          {analysis.status === 'completed' && (
                            <p className="text-sm font-medium text-finclick-success">
                              {analysis.accuracy}% {language === 'ar' ? 'دقة' : 'Accuracy'}
                            </p>
                          )}
                        </div>
                        <button className="p-2 rounded-lg hover:bg-finclick-gold/10 transition-all duration-300">
                          <Eye className="w-4 h-4 text-finclick-gold" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Analysis Growth Chart */}
            <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-finclick-gold mb-4 font-playfair">
                {language === 'ar' ? 'نمو التحليلات' : 'Analysis Growth'}
              </h3>
              <div className="h-64 bg-finclick-gold/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="w-16 h-16 text-finclick-gold/30 mx-auto mb-4" />
                  <p className="text-finclick-gold/50 font-playfair">
                    {language === 'ar' ? 'الرسم البياني سيظهر هنا' : 'Chart will appear here'}
                  </p>
                </div>
              </div>
            </div>

            {/* Analysis Types Distribution */}
            <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-finclick-gold mb-4 font-playfair">
                {language === 'ar' ? 'توزيع أنواع التحليل' : 'Analysis Types Distribution'}
              </h3>
              <div className="h-64 bg-finclick-gold/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="w-16 h-16 text-finclick-gold/30 mx-auto mb-4" />
                  <p className="text-finclick-gold/50 font-playfair">
                    {language === 'ar' ? 'الرسم البياني سيظهر هنا' : 'Chart will appear here'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
