'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Calendar, 
  Globe, 
  TrendingUp,
  AlertTriangle,
  Target,
  Shield,
  ChevronRight,
  Download
} from 'lucide-react';
import { ExecutiveSummary as ExecutiveSummaryType } from '@/lib/types';
import { RATING_CONFIG } from '@/lib/utils/constants';
import { formatDate } from '@/lib/utils/helpers';

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryType;
  company: any;
}

export default function ExecutiveSummary({ data, company }: ExecutiveSummaryProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="card p-8">
        <h1 className="text-3xl font-bold text-finclick-gold mb-6">
          الملخص التنفيذي للتحليل المالي
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard
            icon={<Building2 className="w-5 h-5" />}
            label="اسم الشركة"
            value={company.name}
          />
          <InfoCard
            icon={<Calendar className="w-5 h-5" />}
            label="تاريخ التحليل"
            value={formatDate(new Date())}
          />
          <InfoCard
            icon={<Globe className="w-5 h-5" />}
            label="نطاق المقارنة"
            value={getComparisonLevelLabel(company.comparisonLevel)}
          />
          <InfoCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="عدد التحليلات"
            value="181 تحليل"
          />
        </div>
      </motion.div>

      {/* Overall Rating */}
      <motion.div variants={itemVariants} className="card p-8">
        <h2 className="text-2xl font-bold text-finclick-gold mb-6">
          التقييم العام
        </h2>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <OverallRatingDisplay rating={data.overview.overallRatings} />
          </div>
          <div className="flex-1">
            <RatingDistribution distribution={data.overview.overallRatings.distribution} />
          </div>
        </div>
      </motion.div>

      {/* Key Insights */}
      <motion.div variants={itemVariants} className="card p-8">
        <h2 className="text-2xl font-bold text-finclick-gold mb-6">
          الرؤى الرئيسية
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.keyInsights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-finclick-gold mt-0.5" />
              <p className="text-finclick-gold/80">{insight}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* SWOT Analysis */}
      <motion.div variants={itemVariants} className="card p-8">
        <h2 className="text-2xl font-bold text-finclick-gold mb-6">
          تحليل SWOT
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SWOTQuadrant
            title="نقاط القوة"
            items={data.swotAnalysis.strengths}
            color="text-green-500"
            bgColor="bg-green-500/10"
          />
          <SWOTQuadrant
            title="نقاط الضعف"
            items={data.swotAnalysis.weaknesses}
            color="text-red-500"
            bgColor="bg-red-500/10"
          />
          <SWOTQuadrant
            title="الفرص"
            items={data.swotAnalysis.opportunities}
            color="text-blue-500"
            bgColor="bg-blue-500/10"
          />
          <SWOTQuadrant
            title="التهديدات"
            items={data.swotAnalysis.threats}
            color="text-orange-500"
            bgColor="bg-orange-500/10"
          />
        </div>
      </motion.div>

      {/* Risks */}
      <motion.div variants={itemVariants} className="card p-8">
        <h2 className="text-2xl font-bold text-finclick-gold mb-6 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          المخاطر الرئيسية
        </h2>
        
        <div className="space-y-3">
          {data.risks.map((risk, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg">
              <Shield className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-finclick-gold/80">{risk}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={itemVariants} className="card p-8">
        <h2 className="text-2xl font-bold text-finclick-gold mb-6 flex items-center gap-2">
          <Target className="w-6 h-6" />
          التوصيات الاستراتيجية
        </h2>
        
        <div className="space-y-6">
          <RecommendationSection
            title="لأصحاب الشركات والمدراء"
            recommendations={data.recommendations.forOwners}
            icon="👔"
          />
          <RecommendationSection
            title="للبنوك والمؤسسات المالية"
            recommendations={data.recommendations.forBanks}
            icon="🏦"
          />
          <RecommendationSection
            title="للمستثمرين"
            recommendations={data.recommendations.forInvestors}
            icon="📈"
          />
          <RecommendationSection
            title="للمقيّمين الماليين"
            recommendations={data.recommendations.forValuators}
            icon="🔍"
          />
          <RecommendationSection
            title="لجميع المهتمين"
            recommendations={data.recommendations.forOthers}
            icon="🌐"
          />
        </div>
      </motion.div>

      {/* Summary Table */}
      <motion.div variants={itemVariants} className="card p-8">
        <h2 className="text-2xl font-bold text-finclick-gold mb-6">
          جدول ملخص النتائج
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-finclick-gold/20">
                <th className="text-right py-3 px-4">#</th>
                <th className="text-right py-3 px-4">اسم التحليل</th>
                <th className="text-right py-3 px-4">النتيجة</th>
                <th className="text-right py-3 px-4">متوسط الصناعة</th>
                <th className="text-right py-3 px-4">التقييم</th>
                <th className="text-right py-3 px-4">التوصية</th>
              </tr>
            </thead>
            <tbody>
              {data.summaryTable.slice(0, 10).map((row, index) => (
                <tr key={index} className="border-b border-finclick-gold/10 hover:bg-finclick-gold/5">
                  <td className="py-3 px-4">{row.number}</td>
                  <td className="py-3 px-4">{row.analysisName}</td>
                  <td className="py-3 px-4 font-mono">{formatResult(row.result)}</td>
                  <td className="py-3 px-4 font-mono">{row.industryAverage}</td>
                  <td className="py-3 px-4">
                    <RatingBadge rating={row.rating} />
                  </td>
                  <td className="py-3 px-4 text-sm">{row.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.summaryTable.length > 10 && (
          <p className="text-center mt-4 text-finclick-gold/60">
            وغيرها {data.summaryTable.length - 10} تحليل إضافي...
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

// Helper Components
function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-finclick-gold/10 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-finclick-gold/60">{label}</p>
        <p className="font-semibold text-finclick-gold">{value}</p>
      </div>
    </div>
  );
}

function OverallRatingDisplay({ rating }: { rating: any }) {
  const getRatingLabel = (avg: number) => {
    if (avg >= 4.5) return 'ممتاز';
    if (avg >= 3.5) return 'جيد جداً';
    if (avg >= 2.5) return 'جيد';
    if (avg >= 1.5) return 'مقبول';
    return 'ضعيف';
  };
  
  const label = getRatingLabel(rating.average);
  const config = RATING_CONFIG[label === 'جيد جداً' ? 'veryGood' : label.toLowerCase()] || RATING_CONFIG.good;
  
  return (
    <div className="text-center">
      <div className="text-6xl mb-2">{config.icon}</div>
      <h3 className="text-2xl font-bold" style={{ color: config.color }}>
        {label}
      </h3>
      <p className="text-finclick-gold/60">
        متوسط التقييم: {rating.average.toFixed(2)} من 5
      </p>
    </div>
  );
}

function RatingDistribution({ distribution }: { distribution: any }) {
  const total = Object.values(distribution).reduce((sum: number, val: any) => sum + val, 0);
  
  return (
    <div className="space-y-2">
      {Object.entries(distribution).map(([key, value]) => {
        const config = RATING_CONFIG[key as keyof typeof RATING_CONFIG];
        const percentage = ((value as number) / total) * 100;
        
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="w-20 text-sm">{config.label.ar}</span>
            <div className="flex-1 h-6 bg-finclick-gold/10 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: config.color
                }}
              />
            </div>
            <span className="w-12 text-sm text-right">{value}</span>
          </div>
        );
      })}
    </div>
  );
}

function SWOTQuadrant({ 
  title, 
  items, 
  color, 
  bgColor 
}: { 
  title: string; 
  items: string[]; 
  color: string;
  bgColor: string;
}) {
  return (
    <div className={`p-4 rounded-lg ${bgColor}`}>
      <h3 className={`font-bold mb-3 ${color}`}>{title}</h3>
      <ul className="space-y-2">
        {items.slice(0, 5).map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className={`${color} mt-1`}>•</span>
            <span className="text-sm text-finclick-gold/80">{item}</span>
          </li>
        ))}
        {items.length > 5 && (
          <li className="text-sm text-finclick-gold/60">
            و{items.length - 5} عناصر أخرى...
          </li>
        )}
      </ul>
    </div>
  );
}

function RecommendationSection({ 
  title, 
  recommendations, 
  icon 
}: { 
  title: string; 
  recommendations: string[]; 
  icon: string;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-finclick-gold mb-3 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        {title}
      </h3>
      <ul className="space-y-2 mr-8">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-finclick-gold/60 mt-0.5" />
            <span className="text-finclick-gold/80">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RatingBadge({ rating }: { rating: string }) {
  const config = RATING_CONFIG[rating as keyof typeof RATING_CONFIG] || RATING_CONFIG.good;
  
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: config.bgColor,
        color: config.color
      }}
    >
      {config.label.ar}
    </span>
  );
}

// Helper Functions
function getComparisonLevelLabel(level: string): string {
  const labels: { [key: string]: string } = {
    local: 'محلي (السعودية)',
    gcc: 'دول الخليج',
    arab: 'الدول العربية',
    asia: 'آسيا',
    africa: 'أفريقيا',
    europe: 'أوروبا',
    northAmerica: 'أمريكا الشمالية',
    southAmerica: 'أمريكا الجنوبية',
    australia: 'أستراليا',
    global: 'عالمي'
  };
  
  return labels[level] || level;
}

function formatResult(result: any): string {
  if (typeof result === 'number') {
    if (Math.abs(result) < 1) {
      return (result * 100).toFixed(2) + '%';
    }
    return result.toLocaleString('ar-SA', { maximumFractionDigits: 2 });
  }
  return result.toString();
}
