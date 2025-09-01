'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Presentation,
  Image,
  Mail,
  Share2,
  Cloud,
  X,
  Check,
  Settings,
  Eye,
  Copy
} from 'lucide-react';
import { AnalysisResult, Company } from '@/lib/types';
import toast from 'react-hot-toast';

interface ExportOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResults: AnalysisResult[];
  company: Company;
  selectedAnalyses?: string[];
}

const exportFormats = [
  {
    id: 'pdf',
    name: 'PDF',
    icon: FileText,
    description: 'تقرير مفصل جاهز للطباعة',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  {
    id: 'excel',
    name: 'Excel',
    icon: FileSpreadsheet,
    description: 'جداول بيانات تفاعلية',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  {
    id: 'word',
    name: 'Word',
    icon: FileText,
    description: 'مستند قابل للتحرير',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    id: 'powerpoint',
    name: 'PowerPoint',
    icon: Presentation,
    description: 'عرض تقديمي احترافي',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20'
  },
  {
    id: 'html',
    name: 'HTML',
    icon: Image,
    description: 'صفحة ويب تفاعلية',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  }
];

const exportOptions = {
  language: ['العربية', 'English'],
  template: [
    { id: 'executive', name: 'تنفيذي', description: 'ملخص موجز للإدارة' },
    { id: 'detailed', name: 'مفصل', description: 'تقرير شامل ومفصل' },
    { id: 'presentation', name: 'عرض', description: 'مصمم للعروض التقديمية' }
  ],
  sections: [
    { id: 'summary', name: 'الملخص التنفيذي', default: true },
    { id: 'charts', name: 'الرسوم البيانية', default: true },
    { id: 'benchmarks', name: 'المقارنات المعيارية', default: true },
    { id: 'recommendations', name: 'التوصيات', default: true },
    { id: 'rawdata', name: 'البيانات الخام', default: false },
    { id: 'appendix', name: 'الملاحق', default: false }
  ]
};

export default function ExportOptions({
  isOpen,
  onClose,
  analysisResults,
  company,
  selectedAnalyses
}: ExportOptionsProps) {
  const [step, setStep] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exportSettings, setExportSettings] = useState({
    language: 'العربية',
    template: 'detailed',
    sections: exportOptions.sections.reduce((acc, section) => ({
      ...acc,
      [section.id]: section.default
    }), {} as Record<string, boolean>),
    includeBranding: true,
    watermark: false,
    compression: 'standard'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const exportData = {
        format: selectedFormat,
        analysisResults: selectedAnalyses 
          ? analysisResults.filter(a => selectedAnalyses.includes(a.id))
          : analysisResults,
        company,
        settings: exportSettings
      };

      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportData),
      });

      clearInterval(interval);
      setExportProgress(100);

      if (!response.ok) {
        throw new Error('فشل في التصدير');
      }

      const result = await response.json();

      // Download file
      if (result.downloadUrl) {
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `${company.name}_financial_analysis_${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success('تم التصدير بنجاح');
      setTimeout(() => {
        onClose();
        setStep(1);
        setExportProgress(0);
      }, 1500);

    } catch (error) {
      console.error('Export error:', error);
      toast.error('فشل في التصدير');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreview = async () => {
    try {
      const response = await fetch('/api/export/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: selectedFormat,
          analysisResults: analysisResults.slice(0, 3), // Preview first 3 analyses
          company,
          settings: exportSettings
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setPreviewUrl(result.previewUrl);
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('فشل في إنشاء المعاينة');
    }
  };

  const updateSetting = (key: string, value: any) => {
    setExportSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSection = (sectionId: string) => {
    setExportSettings(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: !prev.sections[sectionId]
      }
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-finclick-dark rounded-2xl border border-finclick-gold/20 max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-finclick-gold/20">
              <h2 className="text-2xl font-bold text-finclick-gold">تصدير التقرير</h2>
              <button
                onClick={onClose}
                className="btn-icon bg-red-500/20 hover:bg-red-500/30 text-red-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center p-4 border-b border-finclick-gold/20">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= stepNum 
                      ? 'bg-finclick-gold text-black' 
                      : 'bg-finclick-gold/20 text-finclick-gold/60'
                  }`}>
                    {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-0.5 mx-2 transition-all ${
                      step > stepNum ? 'bg-finclick-gold' : 'bg-finclick-gold/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Step 1: Format Selection */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-finclick-gold mb-2">
                      اختر صيغة التصدير
                    </h3>
                    <p className="text-finclick-gold/60">
                      حدد الصيغة المناسبة لاحتياجاتك
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exportFormats.map((format) => {
                      const Icon = format.icon;
                      return (
                        <motion.div
                          key={format.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedFormat === format.id
                              ? `${format.borderColor} ${format.bgColor}`
                              : 'border-finclick-gold/20 hover:border-finclick-gold/40'
                          }`}
                          onClick={() => setSelectedFormat(format.id)}
                        >
                          <div className="text-center space-y-3">
                            <div className={`w-16 h-16 rounded-2xl ${format.bgColor} flex items-center justify-center mx-auto`}>
                              <Icon className={`w-8 h-8 ${format.color}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{format.name}</h4>
                              <p className="text-sm text-white/70">{format.description}</p>
                            </div>
                            {selectedFormat === format.id && (
                              <div className="w-6 h-6 bg-finclick-gold rounded-full flex items-center justify-center mx-auto">
                                <Check className="w-4 h-4 text-black" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Options & Settings */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-finclick-gold mb-2">
                      خيارات التقرير
                    </h3>
                    <p className="text-finclick-gold/60">
                      خصص محتوى وإعدادات التقرير
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Template Selection */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-finclick-gold">قالب التقرير</h4>
                      <div className="space-y-3">
                        {exportOptions.template.map((template) => (
                          <motion.div
                            key={template.id}
                            whileHover={{ scale: 1.01 }}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                              exportSettings.template === template.id
                                ? 'border-finclick-gold bg-finclick-gold/10'
                                : 'border-finclick-gold/20 hover:border-finclick-gold/40'
                            }`}
                            onClick={() => updateSetting('template', template.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-white">{template.name}</h5>
                                <p className="text-sm text-white/70">{template.description}</p>
                              </div>
                              {exportSettings.template === template.id && (
                                <Check className="w-5 h-5 text-finclick-gold" />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-finclick-gold">أقسام التقرير</h4>
                      <div className="space-y-3">
                        {exportOptions.sections.map((section) => (
                          <div
                            key={section.id}
                            className="flex items-center justify-between p-3 bg-finclick-dark-light/30 rounded-lg border border-finclick-gold/10"
                          >
                            <span className="text-white">{section.name}</span>
                            <input
                              type="checkbox"
                              checked={exportSettings.sections[section.id]}
                              onChange={() => toggleSection(section.id)}
                              className="w-4 h-4 text-finclick-gold bg-transparent border-finclick-gold/40 rounded focus:ring-finclick-gold focus:ring-2"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Additional Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-finclick-dark-light/30 rounded-xl p-4 border border-finclick-gold/20">
                      <h5 className="font-medium text-finclick-gold mb-3">اللغة</h5>
                      <select
                        value={exportSettings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        className="select w-full"
                      >
                        {exportOptions.language.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-finclick-dark-light/30 rounded-xl p-4 border border-finclick-gold/20">
                      <h5 className="font-medium text-finclick-gold mb-3">جودة الضغط</h5>
                      <select
                        value={exportSettings.compression}
                        onChange={(e) => updateSetting('compression', e.target.value)}
                        className="select w-full"
                      >
                        <option value="high">عالية</option>
                        <option value="standard">قياسية</option>
                        <option value="low">منخفضة</option>
                      </select>
                    </div>

                    <div className="bg-finclick-dark-light/30 rounded-xl p-4 border border-finclick-gold/20">
                      <h5 className="font-medium text-finclick-gold mb-3">خيارات إضافية</h5>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={exportSettings.includeBranding}
                            onChange={(e) => updateSetting('includeBranding', e.target.checked)}
                            className="w-3 h-3 text-finclick-gold bg-transparent border-finclick-gold/40 rounded focus:ring-finclick-gold focus:ring-1"
                          />
                          <span className="text-white/90">العلامة التجارية</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={exportSettings.watermark}
                            onChange={(e) => updateSetting('watermark', e.target.checked)}
                            className="w-3 h-3 text-finclick-gold bg-transparent border-finclick-gold/40 rounded focus:ring-finclick-gold focus:ring-1"
                          />
                          <span className="text-white/90">علامة مائية</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preview & Export */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-finclick-gold mb-2">
                      معاينة وتصدير
                    </h3>
                    <p className="text-finclick-gold/60">
                      راجع الإعدادات وابدأ التصدير
                    </p>
                  </div>

                  {/* Export Summary */}
                  <div className="bg-finclick-dark-light/50 rounded-xl p-6 border border-finclick-gold/20">
                    <h4 className="text-lg font-semibold text-finclick-gold mb-4">ملخص التصدير</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/80">الصيغة:</span>
                          <span className="text-finclick-gold font-medium uppercase">{selectedFormat}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">القالب:</span>
                          <span className="text-finclick-gold">
                            {exportOptions.template.find(t => t.id === exportSettings.template)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">اللغة:</span>
                          <span className="text-finclick-gold">{exportSettings.language}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/80">عدد التحليلات:</span>
                          <span className="text-finclick-gold font-bold">
                            {selectedAnalyses ? selectedAnalyses.length : analysisResults.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">الأقسام المضمنة:</span>
                          <span className="text-finclick-gold font-bold">
                            {Object.values(exportSettings.sections).filter(Boolean).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">حجم تقديري:</span>
                          <span className="text-finclick-gold">
                            {selectedFormat === 'pdf' ? '5-15 MB' : 
                             selectedFormat === 'excel' ? '2-8 MB' : '3-12 MB'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Section */}
                  {previewUrl && (
                    <div className="bg-finclick-dark-light/50 rounded-xl p-6 border border-finclick-gold/20">
                      <h4 className="text-lg font-semibold text-finclick-gold mb-4">معاينة التقرير</h4>
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <iframe
                          src={previewUrl}
                          className="w-full h-full"
                          title="معاينة التقرير"
                        />
                      </div>
                    </div>
                  )}

                  {/* Export Progress */}
                  {isExporting && (
                    <div className="bg-finclick-dark-light/50 rounded-xl p-6 border border-finclick-gold/20">
                      <div className="text-center space-y-4">
                        <div className="text-finclick-gold font-medium">جاري التصدير...</div>
                        <div className="w-full bg-finclick-dark-light rounded-full h-3">
                          <div 
                            className="bg-finclick-gold h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${exportProgress}%` }}
                          >
                            <span className="text-black text-xs font-medium">
                              {exportProgress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-6 border-t border-finclick-gold/20">
              <div className="flex gap-3">
                {step === 3 && !isExporting && (
                  <button
                    onClick={handlePreview}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    معاينة
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {step > 1 && !isExporting && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="btn btn-outline"
                  >
                    السابق
                  </button>
                )}

                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="btn btn-primary"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {isExporting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        جاري التصدير...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        تصدير الآن
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
