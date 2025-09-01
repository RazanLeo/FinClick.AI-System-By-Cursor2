'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  AlertCircle,
  CheckCircle,
  Info,
  Target,
  Zap,
  Download,
  Share2,
  Printer,
  Maximize,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';
import { AnalysisResult, FinancialRatio } from '@/lib/types';
import { formatCurrency, formatPercentage, formatNumber, getRatingColor } from '@/lib/utils/helpers';
import { ANALYSIS_CATEGORIES, ANALYSIS_DESCRIPTIONS } from '@/lib/constants/analysis';
import Chart from '@/components/ui/Chart';
import Gauge from '@/components/ui/Gauge';
import toast from 'react-hot-toast';

interface DetailedAnalysisProps {
  analysis: AnalysisResult;
  companyName: string;
  currency: string;
  onExport?: (format: string) => void;
}

export default function DetailedAnalysis({ 
  analysis, 
  companyName, 
  currency,
  onExport 
}: DetailedAnalysisProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${analysis.name} - ${companyName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
                .analysis-section { margin-bottom: 30px; page-break-inside: avoid; }
                .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
                .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
                .chart-container { margin: 20px 0; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f5f5f5; }
                @media print { 
                  .no-print { display: none; }
                  body { color: black !important; }
                }
              </style>
            </head>
            <body>
              <div class="print-header">
                <h1>${analysis.name}</h1>
                <h2>${companyName}</h2>
                <p>تاريخ التحليل: ${new Date().toLocaleDateString('ar-SA')}</p>
              </div>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${analysis.name} - ${companyName}`,
          text: `تحليل مالي مفصل لـ ${analysis.name}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('تم نسخ الرابط بنجاح');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('فشل في المشاركة');
    }
  };

  const renderMetricValue = (value: number | string, type: 'currency' | 'percentage' | 'number' | 'ratio') => {
    if (typeof value === 'string') return value;
    
    switch (type) {
      case 'currency':
        return formatCurrency(value, currency);
      case 'percentage':
        return formatPercentage(value);
      case 'ratio':
        return `${formatNumber(value)}:1`;
      default:
        return formatNumber(value);
    }
  };

  const renderRatingBadge = (rating: string, score?: number) => {
    const ratingColor = getRatingColor(rating);
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${ratingColor}`}>
        <Star className="w-4 h-4" />
        {rating}
        {score && <span className="text-xs">({score}/100)</span>}
      </div>
    );
  };

  const renderTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-yellow-500" />;
    }
  };

  const renderAnalysisChart = () => {
    if (!analysis.chartData) return null;

    const chartConfig = {
      type: analysis.chartType || 'line',
      data: analysis.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${analysis.name} - الاتجاه الزمني`,
            color: '#D4AF37'
          },
          legend: {
            labels: {
              color: '#D4AF37'
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#D4AF37' },
            grid: { color: '#333' }
          },
          y: {
            ticks: { color: '#D4AF37' },
            grid: { color: '#333' }
          }
        }
      }
    };

    return (
      <div className="chart-container bg-gradient-to-br from-finclick-dark-light/50 to-finclick-dark-light/20 rounded-2xl p-6 border border-finclick-gold/20">
        <Chart config={chartConfig} height={300} />
      </div>
    );
  };

  const renderGaugeChart = () => {
    if (!analysis.currentValue || !analysis.benchmark) return null;

    return (
      <div className="flex justify-center my-8">
        <Gauge
          data={{
            value: analysis.currentValue,
            max: Math.max(analysis.benchmark * 2, analysis.currentValue * 1.5),
            target: analysis.benchmark,
            label: analysis.name
          }}
          size={200}
        />
      </div>
    );
  };

  const renderCalculationBreakdown = () => {
    if (!analysis.calculation) return null;

    return (
      <div className="bg-gradient-to-r from-finclick-dark-light/30 to-finclick-dark-light/10 rounded-xl p-6 border border-finclick-gold/20">
        <h4 className="text-lg font-semibold text-finclick-gold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          طريقة الحساب
        </h4>
        <div className="space-y-4">
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
            <div className="text-finclick-gold/80 mb-2">الصيغة:</div>
            <div className="text-white">{analysis.calculation.formula}</div>
          </div>
          
          {analysis.calculation.steps && (
            <div className="space-y-2">
              <div className="text-finclick-gold/80 text-sm font-medium">خطوات الحساب:</div>
              {analysis.calculation.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <span className="bg-finclick-gold/20 text-finclick-gold rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-white/90">{step}</span>
                </div>
              ))}
            </div>
          )}

          {analysis.calculation.variables && (
            <div className="space-y-2">
              <div className="text-finclick-gold/80 text-sm font-medium">المتغيرات:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(analysis.calculation.variables).map(([key, value]) => (
                  <div key={key} className="bg-black/20 rounded-lg p-3">
                    <div className="text-finclick-gold/70 text-xs">{key}</div>
                    <div className="text-white font-medium">{renderMetricValue(value, 'currency')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBenchmarkComparison = () => {
    if (!analysis.industryBenchmark && !analysis.peerComparison) return null;

    return (
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-finclick-gold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          المقارنة المعيارية
        </h4>

        {analysis.industryBenchmark && (
          <div className="bg-gradient-to-r from-blue-900/20 to-blue-900/5 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-blue-400">متوسط الصناعة</h5>
              <span className="text-2xl font-bold text-blue-400">
                {renderMetricValue(analysis.industryBenchmark.value, analysis.type || 'number')}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-white/60">المصدر</div>
                <div className="text-white font-medium">{analysis.industryBenchmark.source}</div>
              </div>
              <div>
                <div className="text-white/60">الفترة</div>
                <div className="text-white font-medium">{analysis.industryBenchmark.period}</div>
              </div>
              <div>
                <div className="text-white/60">عدد الشركات</div>
                <div className="text-white font-medium">{analysis.industryBenchmark.sampleSize} شركة</div>
              </div>
            </div>

            {analysis.industryBenchmark.quartiles && (
              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <div className="text-sm font-medium text-white/80 mb-3">توزيع الصناعة</div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-white/60">الربع الأول</div>
                    <div className="text-white font-medium">
                      {renderMetricValue(analysis.industryBenchmark.quartiles.q1, analysis.type || 'number')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/60">الوسيط</div>
                    <div className="text-white font-medium">
                      {renderMetricValue(analysis.industryBenchmark.quartiles.median, analysis.type || 'number')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/60">الربع الثالث</div>
                    <div className="text-white font-medium">
                      {renderMetricValue(analysis.industryBenchmark.quartiles.q3, analysis.type || 'number')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/60">الأعلى</div>
                    <div className="text-white font-medium">
                      {renderMetricValue(analysis.industryBenchmark.quartiles.max, analysis.type || 'number')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {analysis.peerComparison && analysis.peerComparison.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900/20 to-purple-900/5 rounded-xl p-6 border border-purple-500/20">
            <h5 className="font-medium text-purple-400 mb-4">مقارنة الشركات المماثلة</h5>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left p-3 text-purple-400">الشركة</th>
                    <th className="text-center p-3 text-purple-400">القيمة</th>
                    <th className="text-center p-3 text-purple-400">الترتيب</th>
                    <th className="text-center p-3 text-purple-400">الفرق</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.peerComparison.map((peer, index) => (
                    <tr key={peer.company} className="border-b border-white/5">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {peer.company === companyName && (
                            <Star className="w-4 h-4 text-finclick-gold" />
                          )}
                          <span className={peer.company === companyName ? 'text-finclick-gold font-medium' : 'text-white'}>
                            {peer.company}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-medium text-white">
                        {renderMetricValue(peer.value, analysis.type || 'number')}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          peer.rank <= 3 ? 'bg-green-500/20 text-green-400' :
                          peer.rank <= 7 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          #{peer.rank}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-sm ${
                          peer.difference > 0 ? 'text-green-400' : peer.difference < 0 ? 'text-red-400' : 'text-white/60'
                        }`}>
                          {peer.difference > 0 ? '+' : ''}{formatPercentage(peer.difference)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHistoricalTrend = () => {
    if (!analysis.historicalData || analysis.historicalData.length < 2) return null;

    const trendData = {
      labels: analysis.historicalData.map(d => d.year),
      datasets: [{
        label: analysis.name,
        data: analysis.historicalData.map(d => d.value),
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-finclick-gold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          الاتجاه التاريخي
        </h4>
        
        <div className="bg-gradient-to-br from-finclick-dark-light/50 to-finclick-dark-light/20 rounded-2xl p-6 border border-finclick-gold/20">
          <Chart 
            config={{
              type: 'line',
              data: trendData,
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  x: {
                    ticks: { color: '#D4AF37' },
                    grid: { color: '#333' }
                  },
                  y: {
                    ticks: { color: '#D4AF37' },
                    grid: { color: '#333' }
                  }
                }
              }
            }} 
            height={250} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {analysis.historicalData.slice(-4).map((data, index) => (
            <div key={data.year} className="bg-finclick-dark-light/30 rounded-lg p-4 border border-finclick-gold/10">
              <div className="text-finclick-gold/70 text-sm">{data.year}</div>
              <div className="text-xl font-bold text-white">
                {renderMetricValue(data.value, analysis.type || 'number')}
              </div>
              {index > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {renderTrendIcon(data.value > analysis.historicalData[analysis.historicalData.length - 4 + index - 1].value ? 'up' : 'down')}
                  <span className={`text-xs ${
                    data.value > analysis.historicalData[analysis.historicalData.length - 4 + index - 1].value 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {formatPercentage(
                      (data.value - analysis.historicalData[analysis.historicalData.length - 4 + index - 1].value) / 
                      analysis.historicalData[analysis.historicalData.length - 4 + index - 1].value
                    )}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRiskAssessment = () => {
    if (!analysis.riskAssessment) return null;

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-finclick-gold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          تقييم المخاطر
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-red-900/20 to-red-900/5 rounded-xl p-6 border border-red-500/20">
            <h5 className="font-medium text-red-400 mb-4">المخاطر المحتملة</h5>
            <div className="space-y-3">
              {analysis.riskAssessment.risks.map((risk, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    risk.severity === 'high' ? 'bg-red-500' :
                    risk.severity === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <div className="text-white font-medium text-sm">{risk.type}</div>
                    <div className="text-white/70 text-xs">{risk.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-900/20 to-green-900/5 rounded-xl p-6 border border-green-500/20">
            <h5 className="font-medium text-green-400 mb-4">التخفيف من المخاطر</h5>
            <div className="space-y-3">
              {analysis.riskAssessment.mitigations.map((mitigation, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="text-white/90 text-sm">{mitigation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-finclick-dark-light/30 rounded-xl p-6 border border-finclick-gold/20">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-medium text-finclick-gold">مستوى المخاطر الإجمالي</h5>
            <div className="flex items-center gap-2">
              {renderRatingBadge(analysis.riskAssessment.overallRisk, analysis.riskAssessment.riskScore)}
            </div>
          </div>
          <div className="text-white/80 text-sm leading-relaxed">
            {analysis.riskAssessment.assessment}
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: Activity },
    { id: 'calculation', label: 'طريقة الحساب', icon: Target },
    { id: 'benchmark', label: 'المقارنة المعيارية', icon: BarChart3 },
    { id: 'trend', label: 'الاتجاه التاريخي', icon: TrendingUp },
    { id: 'risk', label: 'تقييم المخاطر', icon: AlertCircle }
  ].filter(tab => {
    switch (tab.id) {
      case 'calculation':
        return !!analysis.calculation;
      case 'benchmark':
        return !!(analysis.industryBenchmark || analysis.peerComparison);
      case 'trend':
        return !!(analysis.historicalData && analysis.historicalData.length >= 2);
      case 'risk':
        return !!analysis.riskAssessment;
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-finclick-gold to-finclick-gold/60 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-finclick-gold">{analysis.name}</h2>
              <p className="text-finclick-gold/60">{ANALYSIS_DESCRIPTIONS[analysis.category]?.[analysis.name] || analysis.description}</p>
            </div>
          </div>

          {/* Current Value & Rating */}
          <div className="flex items-center gap-6 mb-4">
            <div className="bg-finclick-dark-light/50 rounded-xl p-4 border border-finclick-gold/20">
              <div className="text-finclick-gold/70 text-sm mb-1">القيمة الحالية</div>
              <div className="text-3xl font-bold text-white">
                {renderMetricValue(analysis.currentValue, analysis.type || 'number')}
              </div>
            </div>

            {analysis.rating && (
              <div className="bg-finclick-dark-light/50 rounded-xl p-4 border border-finclick-gold/20">
                <div className="text-finclick-gold/70 text-sm mb-1">التقييم</div>
                <div>{renderRatingBadge(analysis.rating, analysis.score)}</div>
              </div>
            )}

            {analysis.trend && (
              <div className="bg-finclick-dark-light/50 rounded-xl p-4 border border-finclick-gold/20">
                <div className="text-finclick-gold/70 text-sm mb-1">الاتجاه</div>
                <div className="flex items-center gap-2">
                  {renderTrendIcon(analysis.trend)}
                  <span className="text-white font-medium">
                    {analysis.trend === 'up' ? 'تصاعدي' : analysis.trend === 'down' ? 'تنازلي' : 'مستقر'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="btn-icon bg-finclick-dark-light/50 hover:bg-finclick-gold/20 border-finclick-gold/20"
            title="مشاركة"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handlePrint}
            className="btn-icon bg-finclick-dark-light/50 hover:bg-finclick-gold/20 border-finclick-gold/20"
            title="طباعة"
          >
            <Printer className="w-5 h-5" />
          </button>
          {onExport && (
            <button
              onClick={() => onExport('pdf')}
              className="btn-icon bg-finclick-dark-light/50 hover:bg-finclick-gold/20 border-finclick-gold/20"
              title="تصدير PDF"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-icon bg-finclick-gold/20 hover:bg-finclick-gold/30 border-finclick-gold/40"
            title={expanded ? 'طي' : 'توسيع'}
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {renderAnalysisChart()}
          {renderGaugeChart()}
        </div>
        
        <div className="space-y-4">
          {/* Key Insights */}
          {analysis.insights && (
            <div className="bg-gradient-to-r from-finclick-dark-light/50 to-finclick-dark-light/20 rounded-xl p-6 border border-finclick-gold/20">
              <h4 className="text-lg font-semibold text-finclick-gold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                الرؤى الرئيسية
              </h4>
              <div className="space-y-3">
                {analysis.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-finclick-gold rounded-full mt-2 flex-shrink-0" />
                    <p className="text-white/90 text-sm leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && (
            <div className="bg-gradient-to-r from-green-900/20 to-green-900/5 rounded-xl p-6 border border-green-500/20">
              <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                التوصيات
              </h4>
              <div className="space-y-3">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/90 text-sm leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-finclick-gold/20">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-finclick-gold/20 text-finclick-gold border-b-2 border-finclick-gold'
                      : 'text-finclick-gold/60 hover:text-finclick-gold hover:bg-finclick-gold/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div ref={printRef}>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {analysis.description && (
                  <div className="bg-finclick-dark-light/30 rounded-xl p-6 border border-finclick-gold/20">
                    <h4 className="text-lg font-semibold text-finclick-gold mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      تعريف المؤشر
                    </h4>
                    <p className="text-white/90 leading-relaxed">{analysis.description}</p>
                    
                    {analysis.interpretation && (
                      <div className="mt-4 pt-4 border-t border-finclick-gold/20">
                        <h5 className="text-finclick-gold/80 font-medium mb-2">تفسير النتائج:</h5>
                        <p className="text-white/80 text-sm leading-relaxed">{analysis.interpretation}</p>
                      </div>
                    )}
                  </div>
                )}

                {analysis.keyMetrics && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analysis.keyMetrics.map((metric, index) => (
                      <div key={index} className="bg-finclick-dark-light/30 rounded-xl p-4 border border-finclick-gold/20">
                        <div className="text-finclick-gold/70 text-sm mb-1">{metric.label}</div>
                        <div className="text-xl font-bold text-white">
                          {renderMetricValue(metric.value, metric.type || 'number')}
                        </div>
                        {metric.change && (
                          <div className="flex items-center gap-1 mt-2">
                            {renderTrendIcon(metric.change > 0 ? 'up' : metric.change < 0 ? 'down' : 'stable')}
                            <span className={`text-sm ${
                              metric.change > 0 ? 'text-green-400' : 
                              metric.change < 0 ? 'text-red-400' : 
                              'text-white/60'
                            }`}>
                              {metric.change > 0 ? '+' : ''}{formatPercentage(metric.change)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calculation' && renderCalculationBreakdown()}
            {activeTab === 'benchmark' && renderBenchmarkComparison()}
            {activeTab === 'trend' && renderHistoricalTrend()}
            {activeTab === 'risk' && renderRiskAssessment()}
          </div>
        </motion.div>
      )}
    </div>
  );
}
