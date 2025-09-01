'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  Building2,
  Globe,
  Star,
  ArrowRight,
  Filter,
  Download,
  Share2,
  Zap,
  Target,
  Eye,
  Settings
} from 'lucide-react';
import { AnalysisResult, Company, ExecutiveSummary } from '@/lib/types';
import { formatCurrency, formatPercentage, getRatingColor } from '@/lib/utils/helpers';
import { ANALYSIS_CATEGORIES } from '@/lib/constants/analysis';
import Chart from '@/components/ui/Chart';
import Gauge from '@/components/ui/Gauge';
import AnalysisGrid from '@/components/analysis/AnalysisGrid';
import ExportOptions from '@/components/reports/ExportOptions';

interface AnalysisDashboardProps {
  analysisResults: AnalysisResult[];
  company: Company;
  executiveSummary: ExecutiveSummary;
  isLoading?: boolean;
}

interface DashboardFilters {
  category: string;
  rating: string;
  trend: string;
  timeframe: string;
}

const defaultFilters: DashboardFilters = {
  category: 'all',
  rating: 'all',
  trend: 'all',
  timeframe: 'current'
};

export default function AnalysisDashboard({
  analysisResults,
  company,
  executiveSummary,
  isLoading = false
}: AnalysisDashboardProps) {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'cards'>('grid');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [showExportModal, setShowExportModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    if (analysisResults.length > 0) {
      calculateDashboardStats();
    }
  }, [analysisResults]);

  const calculateDashboardStats = () => {
    const stats = {
      totalAnalyses: analysisResults.length,
      completedAnalyses: analysisResults.filter(a => a.status === 'completed').length,
      excellentRating: analysisResults.filter(a => a.rating === 'excellent').length,
      goodRating: analysisResults.filter(a => a.rating === 'good').length,
      averageRating: analysisResults.filter(a => a.rating === 'average').length,
      poorRating: analysisResults.filter(a => a.rating === 'poor').length,
      positivesTrends: analysisResults.filter(a => a.trend === 'up').length,
      negativeTrends: analysisResults.filter(a => a.trend === 'down').length,
      stableTrends: analysisResults.filter(a => a.trend === 'stable').length,
      riskAnalyses: analysisResults.filter(a => a.riskAssessment?.overallRisk === 'high').length,
      categoryDistribution: Object.keys(ANALYSIS_CATEGORIES).map(category => ({
        category,
        count: analysisResults.filter(a => a.category === category).length,
        percentage: (analysisResults.filter(a => a.category === category).length / analysisResults.length) * 100
      }))
    };

    setDashboardStats(stats);
  };

  const filteredResults = analysisResults.filter(analysis => {
    if (filters.category !== 'all' && analysis.category !== filters.category) return false;
    if (filters.rating !== 'all' && analysis.rating !== filters.rating) return false;
    if (filters.trend !== 'all' && analysis.trend !== filters.trend) return false;
    return true;
  });

  const updateFilter = (key: keyof DashboardFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const getOverallHealthScore = () => {
    if (!dashboardStats) return 0;
    
    const excellentWeight = dashboardStats.excellentRating * 100;
    const goodWeight = dashboardStats.goodRating * 80;
    const averageWeight = dashboardStats.averageRating * 60;
    const poorWeight = dashboardStats.poorRating * 30;
    
    const totalWeighted = excellentWeight + goodWeight + averageWeight + poorWeight;
    return Math.round(totalWeighted / dashboardStats.totalAnalyses);
  };

  const renderKPICards = () => {
    if (!dashboardStats) return null;

    const kpis = [
      {
        label: 'إجمالي التحليلات',
        value: dashboardStats.totalAnalyses,
        icon: BarChart3,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20'
      },
      {
        label: 'النتائج الممتازة',
        value: dashboardStats.excellentRating,
        percentage: Math.round((dashboardStats.excellentRating / dashboardStats.totalAnalyses) * 100),
        icon: Star,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20'
      },
      {
        label: 'الاتجاهات الإيجابية',
        value: dashboardStats.positivesTrends,
        percentage: Math.round((dashboardStats.positivesTrends / dashboardStats.totalAnalyses) * 100),
        icon: TrendingUp,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20'
      },
      {
        label: 'التحليلات عالية المخاطر',
        value: dashboardStats.riskAnalyses,
        percentage: Math.round((dashboardStats.riskAnalyses / dashboardStats.totalAnalyses) * 100),
        icon: AlertTriangle,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${kpi.bgColor} rounded-2xl p-6 border ${kpi.borderColor}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${kpi.bgColor} border ${kpi.borderColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                {kpi.percentage !== undefined && (
                  <span className={`text-sm font-medium ${kpi.color}`}>
                    {kpi.percentage}%
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">{kpi.value}</div>
                <div className={`text-sm ${kpi.color}/80`}>{kpi.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderOverallHealth = () => {
    const healthScore = getOverallHealthScore();
    
    return (
      <div className="bg-gradient-to-r from-finclick-dark-light/50 to-finclick-dark-light/20 rounded-2xl p-6 border border-finclick-gold/20 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-finclick-gold">الصحة المالية العامة</h3>
          <div className="flex items-center gap-2 text-finclick-gold/60 text-sm">
            <Clock className="w-4 h-4" />
            آخر تحديث: {new Date().toLocaleString('ar-SA')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <Gauge
              data={{
                value: healthScore,
                max: 100,
                label: 'درجة الصحة المالية'
              }}
              size={200}
            />
            <div className="text-center mt-4">
              <div className="text-3xl font-bold text-finclick-gold">{healthScore}/100</div>
              <div className="text-finclick-gold/60">
                {healthScore >= 90 ? 'ممتاز' :
                 healthScore >= 75 ? 'جيد جداً' :
                 healthScore >= 60 ? 'جيد' :
                 healthScore >= 40 ? 'متوسط' : 'يحتاج تحسين'}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-finclick-gold mb-4">توزيع التقييمات</h4>
              <div className="space-y-3">
                {[
                  { label: 'ممتاز', value: dashboardStats?.excellentRating || 0, color: 'bg-green-500' },
                  { label: 'جيد', value: dashboardStats?.goodRating || 0, color: 'bg-blue-500' },
                  { label: 'متوسط', value: dashboardStats?.averageRating || 0, color: 'bg-yellow-500' },
                  { label: 'ضعيف', value: dashboardStats?.poorRating || 0, color: 'bg-red-500' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${item.color}`} />
                    <span className="text-white/80 w-16">{item.label}</span>
                    <div className="flex-1 bg-finclick-dark-light rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-1000`}
                        style={{ 
                          width: `${dashboardStats ? (item.value / dashboardStats.totalAnalyses) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-white font-medium w-8">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-finclick-gold mb-4">النقاط الرئيسية</h4>
              <div className="space-y-2">
                {executiveSummary.keyPoints?.slice(0, 3).map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-finclick-gold rounded-full mt-2 flex-shrink-0" />
                    <span className="text-white/90 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryOverview = () => {
    if (!dashboardStats) return null;

    const categoryChartData = {
      labels: dashboardStats.categoryDistribution.map(cat => 
        ANALYSIS_CATEGORIES[cat.category as keyof typeof ANALYSIS_CATEGORIES] || cat.category
      ),
      datasets: [{
        data: dashboardStats.categoryDistribution.map(cat => cat.count),
        backgroundColor: [
          '#10B981', '#3B82F6', '#F59E0B', '#EF4444',
          '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
        ],
        borderColor: '#D4AF37',
        borderWidth: 2
      }]
    };

    return (
      <div className="bg-gradient-to-r from-finclick-dark-light/50 to-finclick-dark-light/20 rounded-2xl p-6 border border-finclick-gold/20 mb-8">
        <h3 className="text-xl font-semibold text-finclick-gold mb-6">توزيع فئات التحليل</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <Chart
              config={{
                type: 'doughnut',
                data: categoryChartData,
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: '#D4AF37',
                        padding: 20,
                        usePointStyle: true
                      }
                    }
                  }
                }
              }}
              height={300}
            />
          </div>

          <div className="space-y-4">
            {dashboardStats.categoryDistribution.map((cat, index) => (
              <div key={cat.category} className="flex items-center justify-between p-4 bg-finclick-dark-light/30 rounded-lg border border-finclick-gold/10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: categoryChartData.datasets[0].backgroundColor[index] }}
                  />
                  <span className="text-white font-medium">
                    {ANALYSIS_CATEGORIES[cat.category as keyof typeof ANALYSIS_CATEGORIES] || cat.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-finclick-gold font-bold">{cat.count}</div>
                  <div className="text-finclick-gold/60 text-sm">{cat.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFilters = () => (
    <div className="bg-finclick-dark-light/50 rounded-2xl p-6 border border-finclick-gold/20 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-finclick-gold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          تصفية النتائج
        </h3>
        <button
          onClick={resetFilters}
          className="text-finclick-gold/60 hover:text-finclick-gold text-sm"
        >
          إعادة تعيين
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-finclick-gold/80 mb-2">الفئة</label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="select w-full"
          >
            <option value="all">جميع الفئات</option>
            {Object.entries(ANALYSIS_CATEGORIES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-finclick-gold/80 mb-2">التقييم</label>
          <select
            value={filters.rating}
            onChange={(e) => updateFilter('rating', e.target.value)}
            className="select w-full"
          >
            <option value="all">جميع التقييمات</option>
            <option value="excellent">ممتاز</option>
            <option value="good">جيد</option>
            <option value="average">متوسط</option>
            <option value="poor">ضعيف</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-finclick-gold/80 mb-2">الاتجاه</label>
          <select
            value={filters.trend}
            onChange={(e) => updateFilter('trend', e.target.value)}
            className="select w-full"
          >
            <option value="all">جميع الاتجاهات</option>
            <option value="up">تصاعدي</option>
            <option value="down">تنازلي</option>
            <option value="stable">مستقر</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-finclick-gold/80 mb-2">العرض</label>
          <div className="flex gap-2">
            {[
              { mode: 'grid', icon: BarChart3 },
              { mode: 'list', icon: Users },
              { mode: 'cards', icon: Building2 }
            ].map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`flex-1 p-2 rounded-lg border transition-all ${
                  viewMode === mode
                    ? 'border-finclick-gold bg-finclick-gold/20 text-finclick-gold'
                    : 'border-finclick-gold/20 text-finclick-gold/60 hover:border-finclick-gold/40'
                }`}
              >
                <Icon className="w-5 h-5 mx-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredResults.length !== analysisResults.length && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-blue-400 text-sm">
            <Eye className="w-4 h-4" />
            عرض {filteredResults.length} من أصل {analysisResults.length} تحليل
          </div>
        </div>
      )}
    </div>
  );

  const renderQuickActions = () => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-finclick-gold">لوحة التحليل</h2>
        <div className="flex items-center gap-2 text-finclick-gold/60 text-sm">
          <Building2 className="w-4 h-4" />
          {company.name}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowExportModal(true)}
          className="btn btn-outline flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          تصدير التقرير
        </button>
        
        <button
          className="btn btn-primary flex items-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          مشاركة النتائج
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-finclick-gold/20 rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-finclick-dark-light/50 rounded-2xl" />
            ))}
          </div>
          <div className="h-64 bg-finclick-dark-light/50 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {renderQuickActions()}
      {renderKPICards()}
      {renderOverallHealth()}
      {renderCategoryOverview()}
      {renderFilters()}
      
      <div className="bg-finclick-dark-light/50 rounded-2xl p-6 border border-finclick-gold/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-finclick-gold">تفاصيل التحليلات</h3>
          <div className="text-finclick-gold/60 text-sm">
            {filteredResults.length} تحليل
          </div>
        </div>

        <AnalysisGrid 
          analyses={filteredResults}
          viewMode={viewMode}
          onAnalysisSelect={(analysis) => {
            // Handle analysis selection - could navigate to detailed view
            console.log('Selected analysis:', analysis.name);
          }}
        />
      </div>

      <ExportOptions
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        analysisResults={analysisResults}
        company={company}
      />
    </div>
  );
}
