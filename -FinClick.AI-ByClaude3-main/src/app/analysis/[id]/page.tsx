'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  Home,
  Share2,
  Printer
} from 'lucide-react';
import ExecutiveSummary from '@/components/analysis/ExecutiveSummary';
import AnalysisGrid from '@/components/analysis/AnalysisGrid';
import { AnalysisResult, ExecutiveSummary as ExecutiveSummaryType } from '@/lib/types';
import toast from 'react-hot-toast';

interface AnalysisData {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  company: any;
  results?: AnalysisResult[];
  executiveSummary?: ExecutiveSummaryType;
  error?: string;
}

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.id as string;
  
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

  useEffect(() => {
    if (analysisId) {
      fetchAnalysisData();
      const interval = setInterval(() => {
        if (analysisData?.status === 'processing') {
          fetchAnalysisData();
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [analysisId, analysisData?.status]);

  const fetchAnalysisData = async () => {
    try {
      const response = await fetch(`/api/analysis/${analysisId}`);
      if (!response.ok) throw new Error('Failed to fetch analysis');
      
      const data = await response.json();
      setAnalysisData(data);
      
      if (data.status === 'completed') {
        setLoading(false);
      } else if (data.status === 'failed') {
        setLoading(false);
        toast.error(data.error || 'فشل التحليل');
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setLoading(false);
      toast.error('خطأ في جلب نتائج التحليل');
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'word' | 'ppt') => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId, format })
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finclick-analysis-${analysisId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('تم تصدير التقرير بنجاح');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('فشل في تصدير التقرير');
    }
  };

  if (loading || analysisData?.status === 'processing') {
    return <LoadingScreen progress={analysisData?.progress || 0} />;
  }

  if (analysisData?.status === 'failed') {
    return <ErrorScreen error={analysisData.error} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-finclick-gold/20 sticky top-0 bg-black z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image 
                src="/logo.png" 
                alt="FinClick.AI" 
                width={150} 
                height={45}
                priority
              />
              <div className="border-r border-finclick-gold/20 h-8 mx-2" />
              <h1 className="text-xl font-bold text-finclick-gold">
                تحليل شركة {analysisData?.company?.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Export Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('pdf')}
                  className="btn btn-sm flex items-center gap-2"
                  title="تصدير PDF"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="btn btn-sm flex items-center gap-2"
                  title="تصدير Excel"
                >
                  <FileText className="w-4 h-4" />
                  Excel
                </button>
                <button
                  onClick={() => handleExport('word')}
                  className="btn btn-sm flex items-center gap-2"
                  title="تصدير Word"
                >
                  <FileText className="w-4 h-4" />
                  Word
                </button>
                <button
                  onClick={() => handleExport('ppt')}
                  className="btn btn-sm flex items-center gap-2"
                  title="تصدير PowerPoint"
                >
                  <FileText className="w-4 h-4" />
                  PPT
                </button>
              </div>
              
              <div className="border-r border-finclick-gold/20 h-8" />
              
              {/* Action Buttons */}
              <button
                onClick={() => window.print()}
                className="btn btn-sm"
                title="طباعة"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => {/* Share functionality */}}
                className="btn btn-sm"
                title="مشاركة"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/')}
                className="btn btn-sm"
                title="الرئيسية"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <div className="bg-black/50 border-b border-finclick-gold/10 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('summary')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'summary' 
                    ? 'bg-finclick-gold text-black' 
                    : 'bg-finclick-gold/10 text-finclick-gold hover:bg-finclick-gold/20'
                }`}
              >
                الملخص التنفيذي
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'detailed' 
                    ? 'bg-finclick-gold text-black' 
                    : 'bg-finclick-gold/10 text-finclick-gold hover:bg-finclick-gold/20'
                }`}
              >
                التحليل المفصل
              </button>
            </div>

            {/* Category Filter */}
            {viewMode === 'detailed' && (
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-finclick-gold/20 text-finclick-gold'
                      : 'text-finclick-gold/60 hover:text-finclick-gold'
                  }`}
                >
                  جميع التحليلات (181)
                </button>
                <button
                  onClick={() => setSelectedCategory('structural')}
                  className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${
                    selectedCategory === 'structural'
                      ? 'bg-finclick-gold/20 text-finclick-gold'
                      : 'text-finclick-gold/60 hover:text-finclick-gold'
                  }`}
                >
                  التحليل الهيكلي (15)
                </button>
                <button
                  onClick={() => setSelectedCategory('ratios')}
                  className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${
                    selectedCategory === 'ratios'
                      ? 'bg-finclick-gold/20 text-finclick-gold'
                      : 'text-finclick-gold/60 hover:text-finclick-gold'
                  }`}
                >
                  النسب المالية (30)
                </button>
                <button
                  onClick={() => setSelectedCategory('flow')}
                  className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${
                    selectedCategory === 'flow'
                      ? 'bg-finclick-gold/20 text-finclick-gold'
                      : 'text-finclick-gold/60 hover:text-finclick-gold'
                  }`}
                >
                  تحليلات التدفق (10)
                </button>
                {/* Add more category buttons */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {viewMode === 'summary' && analysisData?.executiveSummary && (
          <ExecutiveSummary 
            data={analysisData.executiveSummary}
            company={analysisData.company}
          />
        )}
        
        {viewMode === 'detailed' && analysisData?.results && (
          <AnalysisGrid 
            results={analysisData.results}
            selectedCategory={selectedCategory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-finclick-gold/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-finclick-gold/60">
            تم إنشاء هذا التحليل بواسطة FinClick.AI - {new Date().toLocaleDateString('ar-SA')}
          </p>
        </div>
      </footer>
    </div>
  );
}

// Loading Screen Component
function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Image 
          src="/logo.png" 
          alt="FinClick.AI" 
          width={200} 
          height={60}
          className="mx-auto mb-8"
        />
        
        <div className="mb-8">
          <Loader2 className="w-16 h-16 text-finclick-gold animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-finclick-gold mb-2">
            جاري تحليل البيانات المالية...
          </h2>
          <p className="text-finclick-gold/60">
            يتم الآن تنفيذ 181 نوع من التحليل المالي المتقدم
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-96 mx-auto">
          <div className="flex justify-between text-sm text-finclick-gold/60 mb-2">
            <span>التقدم</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-finclick-gold/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-finclick-gold"
            />
          </div>
        </div>
        
        {/* Analysis Steps */}
        <div className="mt-8 space-y-2">
          <AnalysisStep 
            completed={progress > 10} 
            active={progress <= 10}
            text="استخراج البيانات المالية"
          />
          <AnalysisStep 
            completed={progress > 30} 
            active={progress > 10 && progress <= 30}
            text="جلب معايير الصناعة"
          />
          <AnalysisStep 
            completed={progress > 60} 
            active={progress > 30 && progress <= 60}
            text="تنفيذ التحليلات المالية"
          />
          <AnalysisStep 
            completed={progress > 90} 
            active={progress > 60 && progress <= 90}
            text="إعداد التقارير والتوصيات"
          />
        </div>
      </motion.div>
    </div>
  );
}

function AnalysisStep({ 
  completed, 
  active, 
  text 
}: { 
  completed: boolean; 
  active: boolean; 
  text: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${
      completed ? 'text-green-500' : active ? 'text-finclick-gold' : 'text-finclick-gold/40'
    }`}>
      {completed ? (
        <CheckCircle className="w-5 h-5" />
      ) : active ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-current" />
      )}
      <span>{text}</span>
    </div>
  );
}

// Error Screen Component
function ErrorScreen({ error }: { error?: string }) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-finclick-gold mb-2">
          حدث خطأ في التحليل
        </h2>
        <p className="text-finclick-gold/60 mb-8">
          {error || 'نأسف، حدث خطأ أثناء معالجة التحليل المالي'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="btn btn-primary"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}
