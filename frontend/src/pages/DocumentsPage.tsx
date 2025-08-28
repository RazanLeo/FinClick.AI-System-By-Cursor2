import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  Share2, 
  MoreVertical,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, Button, Input, Alert } from '../components';

const DocumentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // أنواع المستندات المدعومة
  const supportedTypes = [
    { id: 'pdf', name: 'PDF', icon: FileText, color: 'text-red-500', extensions: ['.pdf'] },
    { id: 'excel', name: 'Excel', icon: FileSpreadsheet, color: 'text-green-500', extensions: ['.xlsx', '.xls'] },
    { id: 'word', name: 'Word', icon: FileText, color: 'text-blue-500', extensions: ['.docx', '.doc'] },
    { id: 'image', name: 'Image', icon: FileImage, color: 'text-purple-500', extensions: ['.jpg', '.jpeg', '.png', '.gif'] }
  ];

  // بيانات تجريبية للمستندات
  useEffect(() => {
    const mockDocuments = [
      {
        id: 1,
        name: 'Financial_Report_2024.pdf',
        type: 'pdf',
        size: '2.4 MB',
        uploadedAt: '2024-01-15',
        status: 'processed',
        tags: ['تقرير مالي', '2024', 'شركة'],
        extractedText: 'تم استخراج النص بنجاح',
        analysis: 'تم تحليل المستند'
      },
      {
        id: 2,
        name: 'Balance_Sheet.xlsx',
        type: 'excel',
        size: '1.8 MB',
        uploadedAt: '2024-01-14',
        status: 'processing',
        tags: ['ميزانية', 'أصول', 'خصوم'],
        extractedText: 'جاري المعالجة...',
        analysis: 'جاري التحليل...'
      },
      {
        id: 3,
        name: 'Company_Profile.docx',
        type: 'word',
        size: '3.2 MB',
        uploadedAt: '2024-01-13',
        status: 'processed',
        tags: ['ملف شخصي', 'شركة', 'معلومات'],
        extractedText: 'تم استخراج النص بنجاح',
        analysis: 'تم تحليل المستند'
      },
      {
        id: 4,
        name: 'Chart_Image.png',
        type: 'image',
        size: '856 KB',
        uploadedAt: '2024-01-12',
        status: 'processed',
        tags: ['رسم بياني', 'صورة', 'تحليل'],
        extractedText: 'تم استخراج النص من الصورة',
        analysis: 'تم تحليل الصورة'
      }
    ];
    setDocuments(mockDocuments);
  }, []);

  // معالجة رفع الملفات
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    const fileArray = Array.from(files);
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      // محاكاة رفع الملف
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // إضافة المستند الجديد
      const newDocument = {
        id: Date.now() + i,
        name: file.name,
        type: getFileType(file.name),
        size: formatFileSize(file.size),
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'processing',
        tags: [],
        extractedText: 'جاري المعالجة...',
        analysis: 'جاري التحليل...'
      };

      setDocuments(prev => [newDocument, ...prev]);

      // محاكاة معالجة المستند
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDocument.id 
            ? { ...doc, status: 'processed', extractedText: 'تم استخراج النص بنجاح', analysis: 'تم تحليل المستند' }
            : doc
        ));
      }, 3000);
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  // تحديد نوع الملف
  const getFileType = (filename: string) => {
    const extension = filename.toLowerCase().split('.').pop();
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['xlsx', 'xls'].includes(extension || '')) return 'excel';
    if (['docx', 'doc'].includes(extension || '')) return 'word';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'image';
    return 'unknown';
  };

  // تنسيق حجم الملف
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // معالجة السحب والإفلات
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // تصفية المستندات
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  // حذف مستند
  const deleteDocument = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('documents.pageTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('documents.pageSubtitle')}
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Upload Area */}
        <div className="mb-8">
          <Card className="p-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('documents.uploadTitle')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('documents.uploadSubtitle')}
              </p>
              
              {/* Progress Bar */}
              {isUploading && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isUploading}
                  className="min-w-[120px]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isUploading ? t('documents.uploading') : t('documents.selectFiles')}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png,.gif"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Supported Formats */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {t('documents.supportedFormats')}:
                </p>
                <div className="flex items-center justify-center space-x-4">
                  {supportedTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <type.icon className={`w-5 h-5 ${type.color}`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {type.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder={t('documents.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                fullWidth
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              {t('documents.filters')}
            </Button>
          </div>
        </div>

        {/* Type Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              {t('documents.allTypes')}
            </Button>
            {supportedTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.id)}
              >
                <type.icon className="w-4 h-4 mr-2" />
                {type.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    document.type === 'pdf' ? 'bg-red-100 dark:bg-red-900/20' :
                    document.type === 'excel' ? 'bg-green-100 dark:bg-green-900/20' :
                    document.type === 'word' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    'bg-purple-100 dark:bg-purple-900/20'
                  }`}>
                    {supportedTypes.find(t => t.id === document.type)?.icon && 
                      React.createElement(supportedTypes.find(t => t.id === document.type)!.icon, {
                        className: `w-5 h-5 ${
                          document.type === 'pdf' ? 'text-red-600' :
                          document.type === 'excel' ? 'text-green-600' :
                          document.type === 'word' ? 'text-blue-600' :
                          'text-purple-600'
                        }`
                      })
                    }
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {document.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {document.size} • {document.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Status */}
              <div className="mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  document.status === 'processed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {document.status === 'processed' ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t('documents.processed')}
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      {t('documents.processing')}
                    </>
                  )}
                </span>
              </div>

              {/* Tags */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {document.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteDocument(document.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('documents.noDocuments')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('documents.noDocumentsDesc')}
            </p>
            <Button onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              {t('documents.uploadFirst')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
