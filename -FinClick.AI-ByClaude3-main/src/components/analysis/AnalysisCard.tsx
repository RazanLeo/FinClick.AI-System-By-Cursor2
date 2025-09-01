'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info,
  ChevronRight,
  Maximize2,
  BarChart2
} from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import { RATING_CONFIG } from '@/lib/utils/constants';
import { formatNumber, formatPercentage } from '@/lib/utils/helpers';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalysisCardProps {
  result: AnalysisResult;
  isExpanded: boolean;
  onExpand: () => void;
  onViewDetails: () => void;
}

export default function AnalysisCard({ 
  result, 
  isExpanded, 
  onExpand, 
  onViewDetails 
}: AnalysisCardProps) {
  const ratingConfig = RATING_CONFIG[result.rating];
  
  const getTrendIcon = () => {
    if (!result.comparisonWithIndustry) return <Minus className="w-5 h-5 text-gray-500" />;
    
    if (result.comparisonWithIndustry.includes('أعلى') || 
        result.comparisonWithIndustry.includes('أفضل')) {
      return <TrendingUp className="w-5 h-5 text-green-500" />;
    } else if (result.comparisonWithIndustry.includes('أقل') || 
               result.comparisonWithIndustry.includes('أضعف')) {
      return <TrendingDown className="w-5 h-5 text-red-500" />;
    }
    
    return <Minus className="w-5 h-5 text-yellow-500" />;
  };

  const formatResultValue = (value: any): string => {
    if (typeof value === 'number') {
      if (Math.abs(value) < 1 && value !== 0) {
        return formatPercentage(value * 100);
      }
      return formatNumber(value);
    }
    if (typeof value === 'object' && value !== null) {
      return 'مركب';
    }
    return value?.toString() || 'غير محدد';
  };

  return (
    <motion.div
      layout
      className={`card hover:shadow-lg transition-all duration-300 ${
        isExpanded ? 'col-span-full' : ''
      }`}
      style={{
        borderColor: isExpanded ? ratingConfig.color : undefined,
        borderWidth: isExpanded ? 2 : 1
      }}
    >
      {/* Card Header */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-finclick-gold mb-1">
              {result.name}
            </h3>
            <p className="text-sm text-finclick-gold/60">
              {result.nameEn}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: ratingConfig.bgColor,
                color: ratingConfig.color
              }}
            >
              {ratingConfig.label.ar}
            </span>
          </div>
        </div>

        {/* Result Value */}
        <div className="mb-4 p-4 bg-finclick-gold/5 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-finclick-gold/60">النتيجة</span>
            <span className="text-2xl font-bold text-finclick-gold">
              {formatResultValue(result.result)}
            </span>
          </div>
          
          {result.industryAverage && (
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-finclick-gold/20">
              <span className="text-sm text-finclick-gold/60">متوسط الصناعة</span>
              <span className="text-lg font-semibold text-finclick-gold/80">
                {formatResultValue(result.industryAverage)}
              </span>
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-finclick-gold/60 mt-0.5" />
            <p className="text-sm text-finclick-gold/80 line-clamp-2">
              {result.interpretation}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onExpand}
            className="btn btn-sm flex-1 flex items-center justify-center gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            {isExpanded ? 'تصغير' : 'توسيع'}
          </button>
          <button
            onClick={onViewDetails}
            className="btn btn-sm btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <ChevronRight className="w-4 h-4" />
            التفاصيل
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-finclick-gold/20"
        >
          <div className="p-6 space-y-6">
            {/* Definition & Measurement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-finclick-gold mb-2">التعريف</h4>
                <p className="text-sm text-finclick-gold/80">{result.definition}</p>
              </div>
              <div>
                <h4 className="font-semibold text-finclick-gold mb-2">ما يقيسه</h4>
                <p className="text-sm text-finclick-gold/80">{result.whatItMeasures}</p>
              </div>
            </div>

            {/* Calculation */}
            <div>
              <h4 className="font-semibold text-finclick-gold mb-2">طريقة الحساب</h4>
              <p className="text-sm text-finclick-gold/80 font-mono bg-finclick-gold/5 p-3 rounded">
                {result.calculation}
              </p>
            </div>

            {/* Charts */}
            {result.charts && result.charts.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-finclick-gold">الرسوم البيانية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.charts.map((chart, index) => (
                    <div key={index} className="bg-finclick-gold/5 p-4 rounded-lg">
                      <ChartRenderer chart={chart} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SWOT Summary */}
            {result.swot && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {result.swot.strengths && result.swot.strengths.length > 0 && (
                  <div className="bg-green-500/10 p-3 rounded-lg">
                    <h5 className="font-semibold text-green-500 mb-2 text-sm">نقاط القوة</h5>
                    <ul className="text-xs text-finclick-gold/70 space-y-1">
                      {result.swot.strengths.slice(0, 3).map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.swot.weaknesses && result.swot.weaknesses.length > 0 && (
                  <div className="bg-red-500/10 p-3 rounded-lg">
                    <h5 className="font-semibold text-red-500 mb-2 text-sm">نقاط الضعف</h5>
                    <ul className="text-xs text-finclick-gold/70 space-y-1">
                      {result.swot.weaknesses.slice(0, 3).map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.swot.opportunities && result.swot.opportunities.length > 0 && (
                  <div className="bg-blue-500/10 p-3 rounded-lg">
                    <h5 className="font-semibold text-blue-500 mb-2 text-sm">الفرص</h5>
                    <ul className="text-xs text-finclick-gold/70 space-y-1">
                      {result.swot.opportunities.slice(0, 3).map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.swot.threats && result.swot.threats.length > 0 && (
                  <div className="bg-orange-500/10 p-3 rounded-lg">
                    <h5 className="font-semibold text-orange-500 mb-2 text-sm">التهديدات</h5>
                    <ul className="text-xs text-finclick-gold/70 space-y-1">
                      {result.swot.threats.slice(0, 3).map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Recommendation */}
            <div className="bg-finclick-gold/10 p-4 rounded-lg">
              <h4 className="font-semibold text-finclick-gold mb-2">التوصية</h4>
              <p className="text-sm text-finclick-gold/80">{result.recommendation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Chart Renderer Component
function ChartRenderer({ chart }: { chart: any }) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#D4AF37',
          font: {
            family: 'Tajawal'
          }
        }
      },
      title: {
        display: chart.options?.title?.text ? true : false,
        text: chart.options?.title?.text || '',
        color: '#D4AF37',
        font: {
          family: 'Tajawal',
          size: 14
        }
      }
    },
    scales: chart.type !== 'pie' && chart.type !== 'radar' ? {
      x: {
        ticks: { color: '#D4AF37' },
        grid: { color: 'rgba(212, 175, 55, 0.1)' }
      },
      y: {
        ticks: { color: '#D4AF37' },
        grid: { color: 'rgba(212, 175, 55, 0.1)' }
      }
    } : undefined
  };

  // Ensure chart data has proper structure
  const chartData = {
    ...chart.data,
    datasets: chart.data.datasets?.map((dataset: any) => ({
      ...dataset,
      borderColor: dataset.borderColor || '#D4AF37',
      backgroundColor: dataset.backgroundColor || 'rgba(212, 175, 55, 0.2)'
    }))
  };

  const renderChart = () => {
    switch (chart.type) {
      case 'line':
        return <Line data={chartData} options={chartOptions} height={200} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} height={200} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} height={200} />;
      case 'radar':
        return <Radar data={chartData} options={chartOptions} height={200} />;
      case 'gauge':
        // Custom gauge implementation
        return <GaugeChart data={chart.data} />;
      default:
        return <div className="text-center text-finclick-gold/60">نوع الرسم غير مدعوم</div>;
    }
  };

  return (
    <div className="h-[200px]">
      {renderChart()}
    </div>
  );
}

// Gauge Chart Component
function GaugeChart({ data }: { data: any }) {
  const percentage = (data.value / (data.max || 100)) * 100;
  const rotation = (percentage * 180) / 100 - 90;
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(212, 175, 55, 0.2)"
          strokeWidth="20"
        />
        
        {/* Value arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="20"
          strokeDasharray={`${percentage * 2.51} 251`}
        />
        
        {/* Needle */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="#D4AF37"
          strokeWidth="3"
          transform={`rotate(${rotation} 100 100)`}
        />
        
        {/* Center dot */}
        <circle cx="100" cy="100" r="5" fill="#D4AF37" />
        
        {/* Value text */}
        <text
          x="100"
          y="90"
          textAnchor="middle"
          fill="#D4AF37"
          fontSize="24"
          fontWeight="bold"
        >
          {data.value.toFixed(1)}
        </text>
        
        {/* Target line if exists */}
        {data.target && (
          <line
            x1="100"
            y1="20"
            x2="100"
            y2="40"
            stroke="#2E7D32"
            strokeWidth="3"
            transform={`rotate(${(data.target / data.max) * 180 - 90} 100 100)`}
          />
        )}
      </svg>
    </div>
  );
}
