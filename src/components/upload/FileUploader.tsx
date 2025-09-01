'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  X, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { FinancialStatement } from '@/types';

interface FileUploaderProps {
  onFilesUploaded: (files: File[]) => void;
  onManualInput: (data: FinancialStatement[]) => void;
  language: 'ar' | 'en';
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesUploaded, 
  onManualInput, 
  language 
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showManualInput, setShowManualInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Validate file types
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    const validFiles = acceptedFiles.filter(file => 
      validTypes.includes(file.type) || file.name.match(/\.(pdf|xlsx|xls|doc|docx|jpg|jpeg|png)$/i)
    );

    if (validFiles.length !== acceptedFiles.length) {
      toast.error(
        language === 'ar' 
          ? 'بعض الملفات غير مدعومة. يرجى رفع ملفات PDF أو Excel أو Word أو صور فقط.'
          : 'Some files are not supported. Please upload only PDF, Excel, Word files or images.'
      );
    }

    if (validFiles.length > 10) {
      toast.error(
        language === 'ar' 
          ? 'يمكن رفع 10 ملفات كحد أقصى'
          : 'Maximum 10 files can be uploaded'
      );
      return;
    }

    setUploadedFiles(prev => {
      const newFiles = [...prev, ...validFiles];
      if (newFiles.length > 10) {
        toast.error(
          language === 'ar' 
            ? 'يمكن رفع 10 ملفات كحد أقصى'
            : 'Maximum 10 files can be uploaded'
        );
        return prev;
      }
      return newFiles;
    });

    toast.success(
      language === 'ar' 
        ? `تم رفع ${validFiles.length} ملف بنجاح`
        : `${validFiles.length} files uploaded successfully`
    );
  }, [language]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 10,
    multiple: true
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success(
      language === 'ar' ? 'تم حذف الملف' : 'File removed'
    );
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <FileText className="w-6 h-6 text-finclick-error" />;
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return <FileText className="w-6 h-6 text-finclick-success" />;
    if (file.type.includes('word') || file.type.includes('document')) return <FileText className="w-6 h-6 text-finclick-info" />;
    if (file.type.includes('image')) return <Image className="w-6 h-6 text-finclick-warning" />;
    return <File className="w-6 h-6 text-finclick-gold" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleManualInput = () => {
    // Simulate manual input data
    const mockData: FinancialStatement[] = [
      {
        year: 2024,
        balanceSheet: {
          currentAssets: {
            cashAndCashEquivalents: 1000000,
            shortTermInvestments: 500000,
            accountsReceivable: 800000,
            inventory: 1200000,
            prepaidExpenses: 100000,
            otherCurrentAssets: 200000
          },
          nonCurrentAssets: {
            propertyPlantEquipment: 5000000,
            accumulatedDepreciation: -1000000,
            intangibleAssets: 500000,
            goodwill: 300000,
            longTermInvestments: 1000000,
            otherNonCurrentAssets: 200000
          },
          currentLiabilities: {
            accountsPayable: 600000,
            shortTermDebt: 400000,
            accruedExpenses: 200000,
            deferredRevenue: 100000,
            otherCurrentLiabilities: 100000
          },
          nonCurrentLiabilities: {
            longTermDebt: 2000000,
            deferredTaxLiabilities: 300000,
            pensionLiabilities: 200000,
            otherNonCurrentLiabilities: 100000
          },
          equity: {
            commonStock: 1000000,
            additionalPaidInCapital: 500000,
            retainedEarnings: 3000000,
            treasuryStock: -200000,
            otherComprehensiveIncome: 100000
          }
        },
        incomeStatement: {
          revenue: {
            salesRevenue: 8000000,
            serviceRevenue: 2000000,
            otherRevenue: 500000
          },
          costOfGoodsSold: 5000000,
          grossProfit: 5500000,
          operatingExpenses: {
            sellingExpenses: 1000000,
            generalAndAdministrative: 800000,
            researchAndDevelopment: 500000,
            depreciationAndAmortization: 400000
          },
          operatingIncome: 2800000,
          nonOperatingIncome: {
            interestIncome: 100000,
            dividendIncome: 50000,
            gainOnSaleOfAssets: 0,
            otherIncome: 25000
          },
          nonOperatingExpenses: {
            interestExpense: 200000,
            lossOnSaleOfAssets: 0,
            otherExpenses: 25000
          },
          incomeBeforeTax: 2650000,
          incomeTaxExpense: 662500,
          netIncome: 1987500
        },
        cashFlowStatement: {
          operatingActivities: {
            netIncome: 1987500,
            depreciationAndAmortization: 400000,
            changesInWorkingCapital: {
              accountsReceivable: -100000,
              inventory: -200000,
              accountsPayable: 50000,
              accruedExpenses: 25000
            },
            otherOperatingCashFlows: -50000
          },
          investingActivities: {
            capitalExpenditures: -800000,
            acquisitions: 0,
            salesOfAssets: 100000,
            purchasesOfInvestments: -300000,
            salesOfInvestments: 150000,
            otherInvestingCashFlows: -50000
          },
          financingActivities: {
            issuanceOfDebt: 500000,
            repaymentOfDebt: -300000,
            issuanceOfEquity: 0,
            repurchaseOfEquity: -100000,
            dividendsPaid: -500000,
            otherFinancingCashFlows: 0
          }
        }
      }
    ];

    onManualInput(mockData);
    toast.success(
      language === 'ar' 
        ? 'تم إدخال البيانات المالية بنجاح'
        : 'Financial data entered successfully'
    );
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast.error(
        language === 'ar' 
          ? 'يرجى رفع ملفات أولاً'
          : 'Please upload files first'
      );
      return;
    }

    setIsProcessing(true);
    
    // Simulate file processing
    setTimeout(() => {
      onFilesUploaded(uploadedFiles);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-finclick-gold bg-finclick-gold/10' 
              : 'border-finclick-gold/30 hover:border-finclick-gold hover:bg-finclick-gold/5'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-finclick-gold" />
          <h3 className="text-lg font-semibold mb-2 text-finclick-gold font-playfair">
            {language === 'ar' ? 'اسحب وأفلت الملفات هنا' : 'Drag & drop files here'}
          </h3>
          <p className="text-finclick-gold/70 mb-4 font-playfair">
            {language === 'ar' 
              ? 'أو انقر لاختيار الملفات (PDF, Excel, Word, صور)'
              : 'Or click to select files (PDF, Excel, Word, images)'
            }
          </p>
          <p className="text-sm text-finclick-gold/50 font-playfair">
            {language === 'ar' 
              ? 'الحد الأقصى: 10 ملفات، كل ملف حتى 50 ميجابايت'
              : 'Maximum: 10 files, each up to 50MB'
            }
          </p>
        </div>
      </motion.div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
              {language === 'ar' ? 'الملفات المرفوعة:' : 'Uploaded Files:'}
            </h3>
            <div className="grid gap-3">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-finclick-gold/10 border border-finclick-gold/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="font-semibold text-finclick-gold font-playfair">
                        {file.name}
                      </p>
                      <p className="text-sm text-finclick-gold/70 font-playfair">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                      className="p-1 text-finclick-gold hover:text-finclick-gold-light transition-colors"
                      title={language === 'ar' ? 'عرض الملف' : 'View file'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-finclick-error hover:text-finclick-error/80 transition-colors"
                      title={language === 'ar' ? 'حذف الملف' : 'Remove file'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          onClick={processFiles}
          disabled={uploadedFiles.length === 0 || isProcessing}
          className="flex-1 btn btn-primary flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isProcessing ? (
            <>
              <div className="spinner w-5 h-5"></div>
              {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              {language === 'ar' ? 'معالجة الملفات' : 'Process Files'}
            </>
          )}
        </motion.button>

        <motion.button
          onClick={() => setShowManualInput(!showManualInput)}
          className="flex-1 btn flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileText className="w-5 h-5" />
          {language === 'ar' ? 'إدخال يدوي' : 'Manual Input'}
        </motion.button>
      </div>

      {/* Manual Input Section */}
      <AnimatePresence>
        {showManualInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-finclick-gold/5 border border-finclick-gold/20 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-4 text-finclick-gold font-playfair">
              {language === 'ar' ? 'إدخال البيانات المالية يدوياً' : 'Manual Financial Data Entry'}
            </h3>
            <p className="text-finclick-gold/70 mb-4 font-playfair">
              {language === 'ar' 
                ? 'يمكنك إدخال البيانات المالية مباشرة في النظام'
                : 'You can enter financial data directly into the system'
              }
            </p>
            <motion.button
              onClick={handleManualInput}
              className="btn btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5" />
              {language === 'ar' ? 'تحميل نموذج البيانات' : 'Download Data Template'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Type Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-4 bg-finclick-gold/5 border border-finclick-gold/20 rounded-lg"
      >
        <h4 className="font-semibold mb-2 text-finclick-gold font-playfair">
          {language === 'ar' ? 'الملفات المدعومة:' : 'Supported Files:'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-finclick-gold/70 font-playfair">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-finclick-error" />
            <span>PDF Documents</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-finclick-success" />
            <span>Excel Files (.xlsx, .xls)</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-finclick-info" />
            <span>Word Documents (.doc, .docx)</span>
          </div>
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-finclick-warning" />
            <span>Images (.jpg, .jpeg, .png)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FileUploader;
