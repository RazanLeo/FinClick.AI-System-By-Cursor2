import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Document as DocxDocument, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from 'docx';
import { AnalysisResult, Company } from '@/lib/types';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/helpers';
import { ANALYSIS_CATEGORIES } from '@/lib/constants/analysis';

export interface ReportSettings {
  language?: 'ar' | 'en';
  includeCharts?: boolean;
  includeRawData?: boolean;
  includeBenchmarks?: boolean;
  includeRecommendations?: boolean;
  includeExecutiveSummary?: boolean;
  template?: 'standard' | 'executive' | 'detailed' | 'presentation';
  branding?: boolean;
  watermark?: boolean;
  compression?: 'high' | 'standard' | 'low';
}

export interface ReportData {
  analysisResults: AnalysisResult[];
  company: Company;
  settings: ReportSettings;
}

export class ReportGenerator {
  private defaultSettings: ReportSettings = {
    language: 'ar',
    includeCharts: true,
    includeRawData: false,
    includeBenchmarks: true,
    includeRecommendations: true,
    includeExecutiveSummary: true,
    template: 'standard',
    branding: true,
    watermark: false,
    compression: 'standard'
  };

  async generatePDF(data: ReportData): Promise<Buffer> {
    const settings = { ...this.defaultSettings, ...data.settings };
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      font: settings.language === 'ar' ? 'Times-Roman' : 'Helvetica'
    });

    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    // Header
    this.addPDFHeader(doc, data.company, settings);

    // Executive Summary
    if (settings.includeExecutiveSummary) {
      this.addPDFExecutiveSummary(doc, data, settings);
    }

    // Analysis Results
    this.addPDFAnalysisResults(doc, data.analysisResults, settings);

    // Benchmarks
    if (settings.includeBenchmarks) {
      this.addPDFBenchmarks(doc, data.analysisResults, settings);
    }

    // Recommendations
    if (settings.includeRecommendations) {
      this.addPDFRecommendations(doc, data.analysisResults, settings);
    }

    // Raw Data
    if (settings.includeRawData) {
      this.addPDFRawData(doc, data.analysisResults, settings);
    }

    // Footer
    this.addPDFFooter(doc, data.company, settings);

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
    });
  }

  async generateExcel(data: ReportData): Promise<Buffer> {
    const settings = { ...this.defaultSettings, ...data.settings };
    const workbook = new ExcelJS.Workbook();

    // Company Information
    workbook.creator = 'FinClick.AI';
    workbook.lastModifiedBy = 'FinClick.AI';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Executive Summary Sheet
    if (settings.includeExecutiveSummary) {
      this.addExcelExecutiveSummary(workbook, data, settings);
    }

    // Analysis Results Sheet
    this.addExcelAnalysisResults(workbook, data.analysisResults, settings);

    // Category Breakdown Sheets
    const categories = [...new Set(data.analysisResults.map(a => a.category))];
    categories.forEach(category => {
      this.addExcelCategorySheet(
        workbook, 
        category, 
        data.analysisResults.filter(a => a.category === category),
        settings
      );
    });

    // Benchmarks Sheet
    if (settings.includeBenchmarks) {
      this.addExcelBenchmarks(workbook, data.analysisResults, settings);
    }

    // Raw Data Sheet
    if (settings.includeRawData) {
      this.addExcelRawData(workbook, data.analysisResults, settings);
    }

    // Charts Sheet
    if (settings.includeCharts) {
      this.addExcelCharts(workbook, data.analysisResults, settings);
    }

    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  async generateWord(data: ReportData): Promise<Buffer> {
    const settings = { ...this.defaultSettings, ...data.settings };
    
    const doc = new DocxDocument({
      sections: [{
        properties: {},
        children: [
          // Title Page
          new Paragraph({
            children: [
              new TextRun({
                text: settings.language === 'ar' 
                  ? `تقرير التحليل المالي - ${data.company.name}`
                  : `Financial Analysis Report - ${data.company.name}`,
                bold: true,
                size: 32,
                font: settings.language === 'ar' ? 'Arial Unicode MS' : 'Arial'
              })
            ],
            alignment: settings.language === 'ar' ? 'center' : 'center'
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: new Date().toLocaleDateString(settings.language === 'ar' ? 'ar-SA' : 'en-US'),
                size: 24
              })
            ],
            alignment: 'center'
          }),

          // Executive Summary
          ...this.generateWordExecutiveSummary(data, settings),

          // Analysis Results
          ...this.generateWordAnalysisResults(data.analysisResults, settings),

          // Recommendations
          ...(settings.includeRecommendations ? this.generateWordRecommendations(data.analysisResults, settings) : [])
        ]
      }]
    });

    return await Packer.toBuffer(doc);
  }

  async generatePowerPoint(data: ReportData): Promise<Buffer> {
    // For PowerPoint generation, we would typically use a library like officegen
    // Since it's complex to implement fully here, we'll create a simplified version
    // that generates an HTML-based presentation that can be converted to PowerPoint
    
    const settings = { ...this.defaultSettings, ...data.settings };
    const htmlContent = this.generatePresentationHTML(data, settings);
    
    // Convert HTML to buffer (in a real implementation, you'd use a proper PPT library)
    return Buffer.from(htmlContent, 'utf8');
  }

  async generateHTML(data: ReportData): Promise<Buffer> {
    const settings = { ...this.defaultSettings, ...data.settings };
    const htmlContent = this.generateInteractiveHTML(data, settings);
    return Buffer.from(htmlContent, 'utf8');
  }

  private addPDFHeader(doc: PDFKit.PDFDocument, company: Company, settings: ReportSettings) {
    // Company Logo placeholder
    if (settings.branding) {
      doc.fontSize(12).text('FinClick.AI', 50, 50);
    }

    // Title
    doc.fontSize(20)
       .text(
         settings.language === 'ar' 
           ? `تقرير التحليل المالي - ${company.name}`
           : `Financial Analysis Report - ${company.name}`,
         50, 100
       );

    // Date
    doc.fontSize(12)
       .text(
         new Date().toLocaleDateString(settings.language === 'ar' ? 'ar-SA' : 'en-US'),
         50, 130
       );

    doc.moveDown(2);
  }

  private addPDFExecutiveSummary(doc: PDFKit.PDFDocument, data: ReportData, settings: ReportSettings) {
    doc.fontSize(16)
       .text(settings.language === 'ar' ? 'الملخص التنفيذي' : 'Executive Summary')
       .moveDown();

    doc.fontSize(12)
       .text(
         settings.language === 'ar'
           ? `تم إجراء تحليل مالي شامل لشركة ${data.company.name} يتضمن ${data.analysisResults.length} مؤشر مالي مختلف.`
           : `Comprehensive financial analysis for ${data.company.name} including ${data.analysisResults.length} different financial metrics.`
       )
       .moveDown();

    // Key metrics summary
    const excellentCount = data.analysisResults.filter(a => a.rating === 'excellent').length;
    const goodCount = data.analysisResults.filter(a => a.rating === 'good').length;
    const averageCount = data.analysisResults.filter(a => a.rating === 'average').length;
    const poorCount = data.analysisResults.filter(a => a.rating === 'poor').length;

    doc.text(
      settings.language === 'ar'
        ? `النتائج: ${excellentCount} ممتاز، ${goodCount} جيد، ${averageCount} متوسط، ${poorCount} ضعيف`
        : `Results: ${excellentCount} Excellent, ${goodCount} Good, ${averageCount} Average, ${poorCount} Poor`
    );

    doc.moveDown(2);
  }

  private addPDFAnalysisResults(doc: PDFKit.PDFDocument, results: AnalysisResult[], settings: ReportSettings) {
    doc.fontSize(16)
       .text(settings.language === 'ar' ? 'نتائج التحليل' : 'Analysis Results')
       .moveDown();

    results.forEach((result, index) => {
      if (index > 0 && index % 3 === 0) {
        doc.addPage();
      }

      doc.fontSize(14)
         .text(`${result.name}`)
         .fontSize(12)
         .text(`${settings.language === 'ar' ? 'القيمة:' : 'Value:'} ${this.formatValue(result.currentValue, result.type)}`)
         .text(`${settings.language === 'ar' ? 'التقييم:' : 'Rating:'} ${result.rating}`)
         .text(`${settings.language === 'ar' ? 'الاتجاه:' : 'Trend:'} ${result.trend || 'N/A'}`)
         .moveDown();

      if (result.interpretation) {
        doc.text(`${settings.language === 'ar' ? 'التفسير:' : 'Interpretation:'} ${result.interpretation}`)
           .moveDown();
      }
    });
  }

  private addPDFBenchmarks(doc: PDFKit.PDFDocument, results: AnalysisResult[], settings: ReportSettings) {
    doc.addPage()
       .fontSize(16)
       .text(settings.language === 'ar' ? 'المقارنات المعيارية' : 'Benchmark Comparisons')
       .moveDown();

    const benchmarkResults = results.filter(r => r.industryBenchmark || r.peerComparison);
    
    benchmarkResults.forEach(result => {
      doc.fontSize(14).text(result.name).moveDown(0.5);
      
      if (result.industryBenchmark) {
        doc.fontSize(12)
           .text(`${settings.language === 'ar' ? 'متوسط الصناعة:' : 'Industry Average:'} ${this.formatValue(result.industryBenchmark.value, result.type)}`)
           .moveDown();
      }
    });
  }

  private addPDFRecommendations(doc: PDFKit.PDFDocument, results: AnalysisResult[], settings: ReportSettings) {
    doc.addPage()
       .fontSize(16)
       .text(settings.language === 'ar' ? 'التوصيات' : 'Recommendations')
       .moveDown();

    const recommendationsResults = results.filter(r => r.recommendations && r.recommendations.length > 0);
    
    recommendationsResults.forEach(result => {
      doc.fontSize(14).text(result.name).moveDown(0.5);
      
      result.recommendations?.forEach(rec => {
        doc.fontSize(12).text(`• ${rec}`).moveDown(0.3);
      });
      
      doc.moveDown();
    });
  }

  private addPDFRawData(doc: PDFKit.PDFDocument, results: AnalysisResult[], settings: ReportSettings) {
    doc.addPage()
       .fontSize(16)
       .text(settings.language === 'ar' ? 'البيانات الخام' : 'Raw Data')
       .moveDown();

    results.forEach(result => {
      doc.fontSize(12)
         .text(`${result.name}: ${this.formatValue(result.currentValue, result.type)}`)
         .moveDown(0.3);
    });
  }

  private addPDFFooter(doc: PDFKit.PDFDocument, company: Company, settings: ReportSettings) {
    if (settings.branding) {
      doc.fontSize(10)
         .text(
           settings.language === 'ar'
             ? 'تم إنشاء هذا التقرير بواسطة FinClick.AI - منصة التحليل المالي الذكي'
             : 'Generated by FinClick.AI - Intelligent Financial Analysis Platform',
           50,
           doc.page.height - 50
         );
    }

    if (settings.watermark) {
      // Add watermark
      doc.opacity(0.1)
         .fontSize(48)
         .text('FinClick.AI', 200, 400, { align: 'center' })
         .opacity(1);
    }
  }

  private addExcelExecutiveSummary(workbook: ExcelJS.Workbook, data: ReportData, settings: ReportSettings) {
    const worksheet = workbook.addWorksheet(
      settings.language === 'ar' ? 'الملخص التنفيذي' : 'Executive Summary'
    );

    // Headers
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = `${data.company.name} - Financial Analysis Summary`;
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Summary statistics
    const stats = this.calculateSummaryStats(data.analysisResults);
    let row = 3;

    Object.entries(stats).forEach(([key, value]) => {
      worksheet.getCell(`A${row}`).value = key;
      worksheet.getCell(`B${row}`).value = value;
      row++;
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 20;
    });
  }

  private addExcelAnalysisResults(workbook: ExcelJS.Workbook, results: AnalysisResult[], settings: ReportSettings) {
    const worksheet = workbook.addWorksheet(
      settings.language === 'ar' ? 'نتائج التحليل' : 'Analysis Results'
    );

    // Headers
    const headers = settings.language === 'ar'
      ? ['اسم التحليل', 'الفئة', 'القيمة الحالية', 'التقييم', 'الاتجاه', 'التفسير']
      : ['Analysis Name', 'Category', 'Current Value', 'Rating', 'Trend', 'Interpretation'];

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(1, index + 1);
      cell.value = header;
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD4AF37' } };
    });

    // Data
    results.forEach((result, index) => {
      const row = index + 2;
      worksheet.getCell(row, 1).value = result.name;
      worksheet.getCell(row, 2).value = ANALYSIS_CATEGORIES[result.category as keyof typeof ANALYSIS_CATEGORIES] || result.category;
      worksheet.getCell(row, 3).value = this.formatValue(result.currentValue, result.type);
      worksheet.getCell(row, 4).value = result.rating;
      worksheet.getCell(row, 5).value = result.trend || 'N/A';
      worksheet.getCell(row, 6).value = result.interpretation || '';
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 25;
    });
  }

  private addExcelCategorySheet(
    workbook: ExcelJS.Workbook, 
    category: string, 
    results: AnalysisResult[], 
    settings: ReportSettings
  ) {
    const categoryName = ANALYSIS_CATEGORIES[category as keyof typeof ANALYSIS_CATEGORIES] || category;
    const worksheet = workbook.addWorksheet(categoryName.substring(0, 31)); // Excel sheet name limit

    // Similar structure to main analysis results but filtered by category
    this.addExcelAnalysisResults(workbook, results, settings);
  }

  private addExcelBenchmarks(workbook: ExcelJS.Workbook, results: AnalysisResult[], settings: ReportSettings) {
    const worksheet = workbook.addWorksheet(
      settings.language === 'ar' ? 'المقارنات المعيارية' : 'Benchmarks'
    );

    const benchmarkResults = results.filter(r => r.industryBenchmark || r.peerComparison);
    
    // Implementation for benchmark data in Excel format
    const headers = ['Analysis', 'Company Value', 'Industry Average', 'Difference', 'Percentile'];
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(1, index + 1);
      cell.value = header;
      cell.font = { bold: true };
    });

    benchmarkResults.forEach((result, index) => {
      const row = index + 2;
      worksheet.getCell(row, 1).value = result.name;
      worksheet.getCell(row, 2).value = this.formatValue(result.currentValue, result.type);
      worksheet.getCell(row, 3).value = result.industryBenchmark ? 
        this.formatValue(result.industryBenchmark.value, result.type) : 'N/A';
      // Add more benchmark calculations as needed
    });
  }

  private addExcelRawData(workbook: ExcelJS.Workbook, results: AnalysisResult[], settings: ReportSettings) {
    const worksheet = workbook.addWorksheet(
      settings.language === 'ar' ? 'البيانات الخام' : 'Raw Data'
    );

    // Raw data implementation
    worksheet.getCell('A1').value = 'Metric';
    worksheet.getCell('B1').value = 'Value';
    
    results.forEach((result, index) => {
      const row = index + 2;
      worksheet.getCell(row, 1).value = result.name;
      worksheet.getCell(row, 2).value = result.currentValue;
    });
  }

  private addExcelCharts(workbook: ExcelJS.Workbook, results: AnalysisResult[], settings: ReportSettings) {
    const worksheet = workbook.addWorksheet(
      settings.language === 'ar' ? 'الرسوم البيانية' : 'Charts'
    );

    // Chart implementation would go here
    // ExcelJS supports chart creation but it's quite complex
    worksheet.getCell('A1').value = 'Charts will be implemented in future versions';
  }

  private generateWordExecutiveSummary(data: ReportData, settings: ReportSettings): Paragraph[] {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: settings.language === 'ar' ? 'الملخص التنفيذي' : 'Executive Summary',
            bold: true,
            size: 32
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Analysis of ${data.company.name} including ${data.analysisResults.length} financial metrics.`
          })
        ]
      })
    ];
  }

  private generateWordAnalysisResults(results: AnalysisResult[], settings: ReportSettings): Paragraph[] {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: settings.language === 'ar' ? 'نتائج التحليل' : 'Analysis Results',
            bold: true,
            size: 28
          })
        ]
      })
    ];

    results.forEach(result => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: result.name,
              bold: true
            }),
            new TextRun({
              text: ` - ${this.formatValue(result.currentValue, result.type)} (${result.rating})`
            })
          ]
        })
      );

      if (result.interpretation) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: result.interpretation
              })
            ]
          })
        );
      }
    });

    return paragraphs;
  }

  private generateWordRecommendations(results: AnalysisResult[], settings: ReportSettings): Paragraph[] {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: settings.language === 'ar' ? 'التوصيات' : 'Recommendations',
            bold: true,
            size: 28
          })
        ]
      })
    ];

    const recommendationsResults = results.filter(r => r.recommendations && r.recommendations.length > 0);
    
    recommendationsResults.forEach(result => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: result.name,
              bold: true
            })
          ]
        })
      );

      result.recommendations?.forEach(rec => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${rec}`
              })
            ]
          })
        );
      });
    });

    return paragraphs;
  }

  private generatePresentationHTML(data: ReportData, settings: ReportSettings): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${data.company.name} Financial Analysis</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .slide { page-break-after: always; min-height: 800px; padding: 40px; }
        .title { font-size: 2em; margin-bottom: 20px; }
        .content { font-size: 1.2em; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="slide">
        <h1 class="title">${data.company.name} Financial Analysis</h1>
        <div class="content">
            <p>Comprehensive analysis including ${data.analysisResults.length} financial metrics</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
    </div>
    
    <div class="slide">
        <h2 class="title">Executive Summary</h2>
        <div class="content">
            <p>Key findings from the financial analysis...</p>
        </div>
    </div>
    
    ${data.analysisResults.map(result => `
        <div class="slide">
            <h2 class="title">${result.name}</h2>
            <div class="content">
                <p><strong>Current Value:</strong> ${this.formatValue(result.currentValue, result.type)}</p>
                <p><strong>Rating:</strong> ${result.rating}</p>
                ${result.interpretation ? `<p><strong>Interpretation:</strong> ${result.interpretation}</p>` : ''}
            </div>
        </div>
    `).join('')}
</body>
</html>`;
  }

  private generateInteractiveHTML(data: ReportData, settings: ReportSettings): string {
    return `
<!DOCTYPE html>
<html lang="${settings.language || 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.company.name} - Financial Analysis Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #f1f5f9;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: rgba(212, 175, 55, 0.1);
            border-radius: 1rem;
            border: 1px solid rgba(212, 175, 55, 0.2);
        }
        .title {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: #d4af37;
        }
        .subtitle {
            font-size: 1.2rem;
            color: #cbd5e1;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        .card {
            background: rgba(30, 41, 59, 0.5);
            border-radius: 1rem;
            padding: 1.5rem;
            border: 1px solid rgba(212, 175, 55, 0.2);
        }
        .card-title {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: #d4af37;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        .metric-value {
            font-weight: bold;
            color: #10b981;
        }
        .rating {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: bold;
        }
        .rating-excellent { background: #10b981; color: white; }
        .rating-good { background: #3b82f6; color: white; }
        .rating-average { background: #f59e0b; color: white; }
        .rating-poor { background: #ef4444; color: white; }
        .footer {
            text-align: center;
            margin-top: 3rem;
            padding: 2rem;
            color: #64748b;
            border-top: 1px solid rgba(212, 175, 55, 0.2);
        }
        @media print {
            body { background: white; color: black; }
            .card { border: 1px solid #ddd; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1 class="title">${data.company.name}</h1>
            <p class="subtitle">Financial Analysis Report - ${new Date().toLocaleDateString()}</p>
        </header>
        
        <main>
            <div class="grid">
                ${data.analysisResults.map(result => `
                    <div class="card">
                        <h3 class="card-title">${result.name}</h3>
                        <div class="metric">
                            <span>Current Value:</span>
                            <span class="metric-value">${this.formatValue(result.currentValue, result.type)}</span>
                        </div>
                        <div class="metric">
                            <span>Rating:</span>
                            <span class="rating rating-${result.rating}">${result.rating}</span>
                        </div>
                        ${result.trend ? `
                        <div class="metric">
                            <span>Trend:</span>
                            <span>${result.trend}</span>
                        </div>
                        ` : ''}
                        ${result.interpretation ? `
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(212, 175, 55, 0.2);">
                            <p style="margin: 0; font-size: 0.9rem; color: #cbd5e1;">${result.interpretation}</p>
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </main>
        
        <footer class="footer">
            ${settings.branding ? '<p>Generated by FinClick.AI - Intelligent Financial Analysis Platform</p>' : ''}
            <p>Report generated on ${new Date().toLocaleString()}</p>
        </footer>
    </div>
</body>
</html>`;
  }

  private formatValue(value: number | string, type?: string): string {
    if (typeof value === 'string') return value;
    
    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'ratio':
        return `${formatNumber(value)}:1`;
      default:
        return formatNumber(value);
    }
  }

  private calculateSummaryStats(results: AnalysisResult[]) {
    return {
      'Total Analyses': results.length,
      'Excellent Results': results.filter(r => r.rating === 'excellent').length,
      'Good Results': results.filter(r => r.rating === 'good').length,
      'Average Results': results.filter(r => r.rating === 'average').length,
      'Poor Results': results.filter(r => r.rating === 'poor').length,
      'Positive Trends': results.filter(r => r.trend === 'up').length,
      'Negative Trends': results.filter(r => r.trend === 'down').length,
      'Stable Trends': results.filter(r => r.trend === 'stable').length
    };
  }
}
