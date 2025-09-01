'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FileText, 
  Upload, 
  X, 
  Check,
  Image as ImageIcon,
  FileSpreadsheet,
  FileScan,
  Keyboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ManualInput from './ManualInput';
import { FinancialStatement } from '@/lib/types';

interface FileUploaderProps {
  onFilesUploaded: (files: File[]) => void;
  onManualInput: (data: FinancialStatement[]) => void;
}

export default function FileUploader({ onFilesUploaded, onManualInput }: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [inputMode, setInputMode] = useState<'upload' | 'manual'>('upload');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, 10);
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);
  }, [uploadedFiles, onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    maxFiles: 10,
    multiple: true
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) 
      return <FileSpreadsheet className="w-5 h-5" />;
    if (fileType.includes('word')) return <FileText className="w-5 h-5" />;
    if (fileType.includes('image')) return <ImageIcon className="w-5 h-5" />;
    return <FileScan className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setInputMode('upload')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            inputMode === 'upload' 
              ? 'bg-finclick-gold text-black' 
              : 'bg-finclick-gold/10 text-finclick-gold hover:bg-finclick-gold/20'
          }`}
        >
          <Upload className="w-5 h-5" />
          رفع الملفات
        </button>
        <button
          onClick={() => setInputMode('manual')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            inputMode === 'manual' 
              ? 'bg-finclick-gold text-black' 
              : 'bg-finclick-gold/10 text-finclick-gold hover:bg-finclick-gold/20'
          }`}
        >
          <Keyboard className="w-5 h-5" />
          إدخال يدوي
        </button>
      </div>

      {inputMode === 'upload' ? (
        <>
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-300
              ${isDragActive 
                ? 'border-finclick-gold bg-finclick-gold/10' 
                : 'border-finclick-gold/40 hover:border-finclick-gold hover:bg-finclick-gold/5'
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 mx-auto mb-4 text-finclick-gold/60" />
            {isDragActive ? (
              <p className="text-lg font-medium text-finclick-gold">
                أفلت الملفات هنا...
              </p>
            ) : (
              <>
                <p className="text-lg font-medium text-finclick-gold mb-2">
                  اسحب وأفلت الملفات هنا، أو انقر للاختيار
                </p>
                <p className="text-sm text-finclick-gold/60">
                  يمكن رفع حتى 10 ملفات (PDF, Excel, Word, صور)
                </p>
              </>
            )}
          </div>

          {/* File Format Icons */}
          <div className="flex justify-center gap-8 py-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-finclick-gold/10 rounded-lg">
                <FileText className="w-6 h-6 text-finclick-gold" />
              </div>
              <span className="text-xs text-finclick-gold/60">PDF</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-finclick-gold/10 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-finclick-gold" />
              </div>
              <span className="text-xs text-finclick-gold/60">Excel</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-finclick-gold/10 rounded-lg">
                <FileText className="w-6 h-6 text-finclick-gold" />
              </div>
              <span className="text-xs text-finclick-gold/60">Word</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-finclick-gold/10 rounded-lg">
                <ImageIcon className="w-6 h-6 text-finclick-gold" />
              </div>
              <span className="text-xs text-finclick-gold/60">صور</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-finclick-gold/10 rounded-lg">
                <FileScan className="w-6 h-6 text-finclick-gold" />
              </div>
              <span className="text-xs text-finclick-gold/60">مسح ضوئي</span>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-finclick-gold mb-3">
                الملفات المرفوعة ({uploadedFiles.length}/10)
              </h3>
              <AnimatePresence>
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between p-3 bg-finclick-gold/5 rounded-lg border border-finclick-gold/20"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div className="text-sm">
                        <p className="font-medium text-finclick-gold">
                          {file.name}
                        </p>
                        <p className="text-finclick-gold/60">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-finclick-gold/10 rounded transition-colors"
                      >
                        <X className="w-5 h-5 text-finclick-gold/60 hover:text-finclick-gold" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      ) : (
        <ManualInput onSubmit={onManualInput} />
      )}
    </div>
  );
}
