'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Presentation,
  Image,
  Mail,
  Share2,
  Settings,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { AnalysisResult, Company } from '@/lib/types';
import toast from 'react-hot-toast';

interface ReportGeneratorProps {
  analysisResults: AnalysisResult[];
  company: Company;
  onReportGenerated?: (reportId: string) => void;
}

interface ReportOptions {
  format: 'pdf' | 'excel' | 'word' | 'powerpoint' | 'html';
  language: 'ar' | 'en';
  includeCharts: boolean;
  includeRawData: boolean;
  includeBenchmarks: boolean;
  includeRecommendations: boolean;
  includeExecutiveSummary: boolean;
  template: 'standard' | 'executive' | 'detailed' | 'presentation';
  branding: boolean;
  watermark: boolean;
}

const reportFormats = [
  {
    format: 'pdf',
    label: 'تقرير PDF',
    icon: FileText,
    description: 'تقرير مفصل جاهز للطباعة والمشاركة',
    color: 'text-red-500'
  },
  {
    format: 'excel',
    label: 'ملف Excel',
    icon: FileSpreadsheet,
    description: 'جداول بيانات تفاعلية مع المعادلات',
    color: 'text-green-500'
  },
  {
    format: 'word',
    label: 'مستند Word',
    icon: FileText,
    description: 'تقرير قابل للتحرير والتخصيص',
    color: 'text-blue-500'
  },
  {
    format: 'powerpoint',
    label: 'عرض PowerPoint',
    icon: Presentation,
    description: 'عرض تقديمي جاهز للاجتماعات',
    color: 'text-orange-500'
  },
  {
    format: 'html',
    label: 'صفحة ويب',
    icon: Image,
    description: 'تقرير تفاعلي لنشره على الويب',
    color: 'text-purple-500'
  }
];

const reportTemplates = [
  {
    id: 'standard',
    name: 'قياسي',
    description: 'تقرير شامل يحتوي على جميع التحليلات'
  },
  {
    id: 'executive',
    name: 'تنفيذي',
    description: 'ملخص موجز للإدارة العليا'
  },
  {
    id: 'detailed',
    name: 'مفصل',
    description: 'تقرير تحليلي مفصل للمختصين'
  },
  {
    id: 'presentation',
    name: 'عرض تقديمي',
    description: 'مصمم للعروض والاجتماعات'
  }
];

export default function ReportGenerator({ 
  analysisResults, 
  company, 
  onReportGenerated 
}: ReportGeneratorProps) {
  const [options, setOptions] = useState<ReportOptions>({
    format: 'pdf',
    language: 'ar',
    includeCharts: true,
    includeRawData: false,
    includeBenchmarks: true,
    includeRecommendations: true,
    includeExecutiveSummary: true,
    template: 'standard',
    branding: true,
    watermark: false
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedReports, setGeneratedReports] = useState<Array<{
    id: string;
    format: string;
    url: string;
    createdAt: string;
  }>>([]);

  const updateOption = (key: keyof ReportOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateReport = async () => {
    if (!analysisResults.length) {
      toast.error('لا توجد نتائج تحليل لإنشاء التقرير');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisResults,
          company,
          options
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error('فشل في إنشاء التقرير');
      }

      const result = await response.json();
      
      const newReport = {
        id: result.reportId,
        format: options.format,
        url: result.downloadUrl,
        createdAt: new Date().toISOString()
      };

      setGeneratedReports(prev => [newReport, ...prev]);
      
      if (onReportGenerated) {
        onReportGenerated(result.reportId);
      }

      // Auto download
      if (result.downloadUrl) {
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `${company.name}_التحليل_المالي_${new Date().toLocaleDateString('ar-SA')}.${options.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success('تم إنشاء التقرير بنجاح');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('فشل في إنشاء التقرير');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const shareReport = async (report: any) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `تقرير التحليل المالي - ${company.name}`,
          text: `تقرير التحليل المالي الشامل لشركة ${company.name}`,
          url: report.url
        });
      } else {
        await navigator.clipboard.writeText(report.url);
        toast.success('تم نسخ رابط التقرير');
      }
    } catch (error) {
      console.error('Error sharing report:', error);
      toast.error('فشل في مشاركة التقرير');
    }
  };

  const sendReportByEmail = async (report: any) => {
    try {
      const response = await fetch('/api/reports/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: report.id,
          recipientEmail: '', // Will be handled by email modal
          company: company.name
        }),
      });

      if (response.ok) {
        toast.success('تم إرسال التقرير بالبريد الإلكتروني');
      } else {
        throw new Error('فشل في الإرسال');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('فشل في إرسال التقرير');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-finclick-gold mb-2">إنشاء التقارير</h2>
        <p className="text-finclick-gold/60">
          إنشاء تقارير مخصصة من نتائج التحليل المالي
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Report Options */}
        <div className="xl:col-span-2 space-y-6">
          {/* Format Selection */}
          <div className="bg-finclick-dark-light/50 rounded-2xl p-6 border border-finclick-gold/20">
            <h3 className="text-xl font-semibold text-finclick-gold mb-4">اختر صيغة التقرير</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <motion.div
                    key={format.format}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      options.format === format.format
                        ? 'border-finclick-gold bg-finclick-gold/10'
                        : 'border-finclick-gold/20 hover:border-finclick-gold/40'
                    }`}
                    onClick={() => updateOption('format', format.format)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-6 h-6 ${format.color}`} />
                      <h4 className="font-medium text-white">{format.label}</h4>
                    </div>
                    <p className="text-sm text-white/70">{format.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Template Selection */}
          <div className="bg-finclick-dark-light/50 rounded-2xl p-6 border border-finclick-gold/20">
            <h3 className="text-xl font-semibold text-finclick-gold mb-4">اختر قالب التقرير</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    options.template === template.id
                      ? 'border-finclick-gold bg-finclick-gold/10'
                      : 'border-finclick-gold/20 hover:border-finclick-gold/40'
                  }`}
                  onClick={() => updateOption('template', template.id)}
                >
                  <h4 className="font-medium text-white mb-2">{template.name}</h4>
                  <p className="text-sm text-white/70">{template.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Content Options */}
          <div className="bg-finclick-dark-light/50 rounded-2xl p-6 border border-finclick-gold/20">
            <h3 className="text-xl font-semibold text-finclick-gold mb-4">محتوى التقرير</h3>
            <div className="space-y-4">
              {[
                { key: 'includeExecutiveSummary', label: 'الملخص التنفيذي', description: 'نظرة عامة على أداء الشركة' },
                { key: 'includeCharts', label: 'الرسوم البيانية', description: 'مخططات وجداول بيانية توضيحية' },
                { key: 'includeBenchmarks', label: 'المقارنات المعيارية', description: 'مقارنة مع متوسطات الصناعة' },
                { key: 'includeRecommendations', label: 'التوصيات', description: 'توصيات واستراتيجيات مقترحة' },
                { key: 'includeRawData', label: 'البيانات الخام', description: 'جداول البيانات المالية المفصلة' }
              ].map((option) => (
                <div key={option.key} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={option.key}
                    checked={options[option.key as keyof ReportOptions] as boolean}
                    onChange={(e) => updateOption(option.key as keyof ReportOptions, e.target.checked)}
                    className="mt-1 w-4 h-4 text-finclick-gold bg-transparent border-finclick-gold/40 rounded focus:ring-finclick-gold focus:ring-2"
                  />
                  <div>
                    <label htmlFor={option.key} className="text-white font-medium cursor-pointer">
                      {option.label}
                    </label>
                    <p className="text-sm text-white/60">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language & Branding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-finclick-dark-light/50 rounded-2xl p-6 border border-finclick-gold/20">
              <h3 className="text-xl font-semibold text-finclick-gold mb-4">اللغة</h3>
              <div className="space-y-3">
                {[
                  { value: 'ar', label: 'العربية' },
                  { value: 'en', label: 'English' }
                ].map((lang) => (
                  <div key={lang.value} className="flex items-center gap-3">
                    <input
                      type="radio"
                      id={`lang-${lang.value}`}
                      name="language"
                      value={lang.value}
                      checked={options.language === lang.value}
                      onChange={(e) => updateOption('language', e.target.value)}
                      className="w-4 h-4 text-finclick-gold bg-transparent border-finclick-gold/40 focus:ring-finclick-gold focus:ring-2"
                    />
                    <label htmlFor={`lang-${lang.value}`} className="text-white cursor-pointer">
                      {lang.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-finclick-dark-light/50 rounded-2xl p-6 border border-finclick-gold/20">
              <h3 className="text-xl font-semibold text-finclick-gold mb-4">التخصيص</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="branding"
                    checked={options.branding}
                    onChange={(e) => updateOption('branding', e.target.checked)}
                    className="mt-1 w-4 h-4 text-finclick-gold bg-transparent border-finclick-gold/40 rounded focus:ring-finclick-gold focus:ring-2"
                  />
                  <div>
                    <label htmlFor="branding" className="text-white font-medium cursor-pointer">
                      العلامة التجارية
                    </label>
                    <p className="text-sm text-white/60">إضافة شعار FinClick.AI</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="watermark"
                    checked={options.watermark}
                    onChange={(e) => updateOption('watermark', e.target.checked)}
                    className="mt-1 w-4 h-4 text-finclick-gold bg-transparent border-finclick-gold/40 rounded focus:ring-finclick-gold focus:ring-2"
                  />
                  <div>
                    <label htmlFor="watermark" className="text-white font-medium cursor-pointer">
                      علامة مائية
                    </label>
                    <p className="text-sm text-white/60">إضافة علامة مائية للحماية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generation & History */}
        <div className="space-y-6">
          {/* Generate Button */}
          <div className="bg-finclick-dark-light/50 rounded-2xl p-6 border border-finclick-gold/20">
            <h3 className="text-xl font-semibold text-finclick-gold mb-4">إنشاء التقرير</h3>
            
            {isGenerating && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-finclick-gold/80 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري إنشاء التقرير...
                </div>
                <div className="w-full bg-finclick-dark-light rounded-full h-2">
                  <div 
                    className="bg-finclick-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-finclick-gold/60 mt-1">{progress}%</div>
              </div>
            )}

            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="btn btn-primary w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  إنشاء التقرير
                </>
              )}
            </button>

            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-400 text-sm font-medium">معلومة مهمة</p>
                  <p className="text-blue-400/80 text-xs mt-1">
                    قد يستغرق إنشاء التقرير المفصل عدة دقائق حسب كمية البيانات
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Reports History */}
          {generatedReports.length > 0 && (
            <div className="bg-finclick-dark-light/50 rounded-2xl p-6 border border-finclick-gold/20">
              <h3 className="text-xl font-semibold text-finclick-gold mb-4">التقارير المنشأة</h3>
              <div className="space-y-3">
                {generatedReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-finclick-dark-light/50 rounded-lg p-4 border border-finclick-gold/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-white font-medium text-sm">
                          {report.format.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-finclick-gold/60 text-xs">
                        {new Date(report.createdAt).toLocaleString('ar-SA')}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <a
                        href={report.url}
                        download
                        className="btn-sm bg-finclick-gold/20 hover:bg-finclick-gold/30 text-finclick-gold flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        تحميل
                      </a>
                      <button
                        onClick={() => shareReport(report)}
                        className="btn-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 flex items-center gap-1"
                      >
                        <Share2 className="w-4 h-4" />
                        مشاركة
                      </button>
                      <button
                        onClick={() => sendReportByEmail(report)}
                        className="btn-sm bg-green-500/20 hover:bg-green-500/30 text-green-400 flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4" />
                        إرسال
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Report Summary */}
          <div className="bg-finclick-dark-light/50 rounded-2xl p-6 border border-finclick-gold/20">
            <h3 className="text-xl font-semibold text-finclick-gold mb-4">ملخص المحتوى</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">عدد التحليلات:</span>
                <span className="text-finclick-gold font-bold">{analysisResults.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">الشركة:</span>
                <span className="text-finclick-gold font-medium">{company.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">تاريخ التحليل:</span>
                <span className="text-finclick-gold">{new Date().toLocaleDateString('ar-SA')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">صيغة التقرير:</span>
                <span className="text-finclick-gold uppercase">{options.format}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
