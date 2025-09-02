import { AnalysisResult, FinancialStatement } from '@/lib/types';

export interface ReportOptions {
  language: 'ar' | 'en';
  format: 'pdf' | 'excel' | 'powerpoint' | 'html';
  companyInfo: {
    name: string;
    sector: string;
    activity: string;
    legalEntity: string;
  };
}

export interface GeneratedReport {
  id: string;
  title: string;
  titleAr: string;
  executiveSummary: string;
  executiveSummaryAr: string;
  sections: any[];
  recommendations: string[];
  recommendationsAr: string[];
  metadata: {
    generatedAt: string;
    companyInfo: any;
    analysisTypes: string[];
    totalPages: number;
    language: string;
  };
}

export class SimpleReportGenerator {
  private static instance: SimpleReportGenerator;
  
  public static getInstance(): SimpleReportGenerator {
    if (!SimpleReportGenerator.instance) {
      SimpleReportGenerator.instance = new SimpleReportGenerator();
    }
    return SimpleReportGenerator.instance;
  }

  /**
   * Generate comprehensive financial report
   */
  async generateComprehensiveReport(
    analysisResults: AnalysisResult[],
    financialData: FinancialStatement[],
    options: ReportOptions
  ): Promise<GeneratedReport> {
    const reportId = `report_${Date.now()}`;
    
    const report: GeneratedReport = {
      id: reportId,
      title: `Financial Analysis Report - ${options.companyInfo.name}`,
      titleAr: `تقرير التحليل المالي - ${options.companyInfo.name}`,
      executiveSummary: this.generateExecutiveSummary(analysisResults, financialData, options),
      executiveSummaryAr: this.generateExecutiveSummaryAr(analysisResults, financialData, options),
      sections: this.generateSections(analysisResults, financialData, options),
      recommendations: this.generateRecommendations(analysisResults, financialData, options),
      recommendationsAr: this.generateRecommendationsAr(analysisResults, financialData, options),
      metadata: {
        generatedAt: new Date().toISOString(),
        companyInfo: options.companyInfo,
        analysisTypes: analysisResults.map(r => r.type),
        totalPages: this.calculateTotalPages(analysisResults),
        language: options.language
      }
    };

    return report;
  }

  /**
   * Generate executive summary
   */
  private generateExecutiveSummary(
    analysisResults: AnalysisResult[],
    financialData: FinancialStatement[],
    options: ReportOptions
  ): string {
    const latestData = financialData[financialData.length - 1];
    const totalAnalyses = analysisResults.length;
    
    return `
      This comprehensive financial analysis report for ${options.companyInfo.name} provides detailed insights into the company's financial performance, position, and prospects. The analysis covers ${totalAnalyses} different analytical dimensions, providing a holistic view of the company's financial health.

      Key highlights include:
      - Revenue: ${latestData.incomeStatement.revenue.salesRevenue.toLocaleString()}
      - Net Income: ${latestData.incomeStatement.netIncome.toLocaleString()}
      - Total Assets: ${this.calculateTotalAssets(latestData).toLocaleString()}
      - Analysis Confidence: ${this.calculateAverageConfidence(analysisResults)}%

      The company operates in the ${options.companyInfo.sector} sector with ${options.companyInfo.activity} as its primary activity. This analysis provides strategic recommendations for improving financial performance and managing risks.
    `;
  }

  /**
   * Generate executive summary in Arabic
   */
  private generateExecutiveSummaryAr(
    analysisResults: AnalysisResult[],
    financialData: FinancialStatement[],
    options: ReportOptions
  ): string {
    const latestData = financialData[financialData.length - 1];
    const totalAnalyses = analysisResults.length;
    
    return `
      يقدم هذا التقرير الشامل للتحليل المالي لشركة ${options.companyInfo.name} رؤى مفصلة حول الأداء المالي للشركة ووضعها وآفاقها المستقبلية. يغطي التحليل ${totalAnalyses} أبعاد تحليلية مختلفة، مما يوفر رؤية شاملة لصحة الشركة المالية.

      أبرز النقاط تشمل:
      - الإيرادات: ${latestData.incomeStatement.revenue.salesRevenue.toLocaleString()}
      - صافي الدخل: ${latestData.incomeStatement.netIncome.toLocaleString()}
      - إجمالي الأصول: ${this.calculateTotalAssets(latestData).toLocaleString()}
      - ثقة التحليل: ${this.calculateAverageConfidence(analysisResults)}%

      تعمل الشركة في قطاع ${options.companyInfo.sector} مع ${options.companyInfo.activity} كنشاطها الأساسي. يوفر هذا التحليل توصيات استراتيجية لتحسين الأداء المالي وإدارة المخاطر.
    `;
  }

  /**
   * Generate report sections
   */
  private generateSections(
    analysisResults: AnalysisResult[],
    financialData: FinancialStatement[],
    options: ReportOptions
  ): any[] {
    return [
      {
        id: 'company_overview',
        title: 'Company Overview',
        titleAr: 'نظرة عامة على الشركة',
        content: this.generateCompanyOverview(financialData, options),
        contentAr: this.generateCompanyOverviewAr(financialData, options),
        order: 1
      },
      {
        id: 'financial_performance',
        title: 'Financial Performance',
        titleAr: 'الأداء المالي',
        content: this.generateFinancialPerformance(analysisResults, financialData, options),
        contentAr: this.generateFinancialPerformanceAr(analysisResults, financialData, options),
        order: 2
      },
      {
        id: 'ratio_analysis',
        title: 'Ratio Analysis',
        titleAr: 'تحليل النسب',
        content: this.generateRatioAnalysis(analysisResults, financialData, options),
        contentAr: this.generateRatioAnalysisAr(analysisResults, financialData, options),
        order: 3
      },
      {
        id: 'risk_assessment',
        title: 'Risk Assessment',
        titleAr: 'تقييم المخاطر',
        content: this.generateRiskAssessment(analysisResults, financialData, options),
        contentAr: this.generateRiskAssessmentAr(analysisResults, financialData, options),
        order: 4
      }
    ];
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    analysisResults: AnalysisResult[],
    financialData: FinancialStatement[],
    options: ReportOptions
  ): string[] {
    return [
      'Improve working capital management to enhance liquidity position',
      'Consider debt restructuring to optimize capital structure',
      'Implement cost reduction initiatives to improve profitability',
      'Diversify revenue streams to reduce business risk',
      'Enhance operational efficiency through technology adoption',
      'Strengthen risk management framework',
      'Develop strategic partnerships for market expansion',
      'Invest in research and development for innovation'
    ];
  }

  /**
   * Generate recommendations in Arabic
   */
  private generateRecommendationsAr(
    analysisResults: AnalysisResult[],
    financialData: FinancialStatement[],
    options: ReportOptions
  ): string[] {
    return [
      'تحسين إدارة رأس المال العامل لتعزيز الوضع السيولة',
      'النظر في إعادة هيكلة الديون لتحسين هيكل رأس المال',
      'تنفيذ مبادرات خفض التكاليف لتحسين الربحية',
      'تنويع مصادر الإيرادات لتقليل مخاطر الأعمال',
      'تعزيز الكفاءة التشغيلية من خلال تبني التكنولوجيا',
      'تعزيز إطار إدارة المخاطر',
      'تطوير شراكات استراتيجية لتوسيع السوق',
      'الاستثمار في البحث والتطوير للابتكار'
    ];
  }

  // Helper methods
  private calculateTotalAssets(data: FinancialStatement): number {
    const current = Object.values(data.balanceSheet.currentAssets).reduce((sum, val) => sum + val, 0);
    const nonCurrent = Object.values(data.balanceSheet.nonCurrentAssets).reduce((sum, val) => sum + val, 0);
    return current + nonCurrent;
  }

  private calculateAverageConfidence(analysisResults: AnalysisResult[]): number {
    if (analysisResults.length === 0) return 0;
    const totalConfidence = analysisResults.reduce((sum, result) => sum + result.confidence, 0);
    return Math.round((totalConfidence / analysisResults.length) * 100);
  }

  private calculateTotalPages(analysisResults: AnalysisResult[]): number {
    return Math.max(10, Math.ceil(analysisResults.length / 5));
  }

  private generateCompanyOverview(financialData: FinancialStatement[], options: ReportOptions): string {
    const latestData = financialData[financialData.length - 1];
    return `
      <h2>Company Overview</h2>
      <p><strong>Company Name:</strong> ${options.companyInfo.name}</p>
      <p><strong>Sector:</strong> ${options.companyInfo.sector}</p>
      <p><strong>Activity:</strong> ${options.companyInfo.activity}</p>
      <p><strong>Legal Entity:</strong> ${options.companyInfo.legalEntity}</p>
      
      <h3>Financial Highlights (${latestData.year})</h3>
      <ul>
        <li>Total Revenue: ${latestData.incomeStatement.revenue.salesRevenue.toLocaleString()}</li>
        <li>Net Income: ${latestData.incomeStatement.netIncome.toLocaleString()}</li>
        <li>Total Assets: ${this.calculateTotalAssets(latestData).toLocaleString()}</li>
      </ul>
    `;
  }

  private generateCompanyOverviewAr(financialData: FinancialStatement[], options: ReportOptions): string {
    const latestData = financialData[financialData.length - 1];
    return `
      <h2>نظرة عامة على الشركة</h2>
      <p><strong>اسم الشركة:</strong> ${options.companyInfo.name}</p>
      <p><strong>القطاع:</strong> ${options.companyInfo.sector}</p>
      <p><strong>النشاط:</strong> ${options.companyInfo.activity}</p>
      <p><strong>الكيان القانوني:</strong> ${options.companyInfo.legalEntity}</p>
      
      <h3>أبرز المؤشرات المالية (${latestData.year})</h3>
      <ul>
        <li>إجمالي الإيرادات: ${latestData.incomeStatement.revenue.salesRevenue.toLocaleString()}</li>
        <li>صافي الدخل: ${latestData.incomeStatement.netIncome.toLocaleString()}</li>
        <li>إجمالي الأصول: ${this.calculateTotalAssets(latestData).toLocaleString()}</li>
      </ul>
    `;
  }

  private generateFinancialPerformance(analysisResults: AnalysisResult[], financialData: FinancialStatement[], options: ReportOptions): string {
    return `
      <h2>Financial Performance Analysis</h2>
      <p>This section provides a comprehensive analysis of the company's financial performance across multiple metrics.</p>
      
      <h3>Key Performance Indicators</h3>
      <ul>
        <li>Revenue Growth: ${this.calculateRevenueGrowth(financialData)}%</li>
        <li>Profit Margin: ${this.calculateProfitMargin(financialData[financialData.length - 1])}%</li>
        <li>Return on Assets: ${this.calculateROA(financialData[financialData.length - 1])}%</li>
        <li>Return on Equity: ${this.calculateROE(financialData[financialData.length - 1])}%</li>
      </ul>
    `;
  }

  private generateFinancialPerformanceAr(analysisResults: AnalysisResult[], financialData: FinancialStatement[], options: ReportOptions): string {
    return `
      <h2>تحليل الأداء المالي</h2>
      <p>يوفر هذا القسم تحليلاً شاملاً للأداء المالي للشركة عبر مقاييس متعددة.</p>
      
      <h3>مؤشرات الأداء الرئيسية</h3>
      <ul>
        <li>نمو الإيرادات: ${this.calculateRevenueGrowth(financialData)}%</li>
        <li>هامش الربح: ${this.calculateProfitMargin(financialData[financialData.length - 1])}%</li>
        <li>العائد على الأصول: ${this.calculateROA(financialData[financialData.length - 1])}%</li>
        <li>العائد على حقوق الملكية: ${this.calculateROE(financialData[financialData.length - 1])}%</li>
      </ul>
    `;
  }

  private generateRatioAnalysis(analysisResults: AnalysisResult[], financialData: FinancialStatement[], options: ReportOptions): string {
    return `
      <h2>Financial Ratio Analysis</h2>
      <p>Comprehensive analysis of key financial ratios to assess the company's financial health.</p>
      
      <h3>Liquidity Ratios</h3>
      <ul>
        <li>Current Ratio: ${this.calculateCurrentRatio(financialData[financialData.length - 1])}</li>
        <li>Quick Ratio: ${this.calculateQuickRatio(financialData[financialData.length - 1])}</li>
        <li>Cash Ratio: ${this.calculateCashRatio(financialData[financialData.length - 1])}</li>
      </ul>
    `;
  }

  private generateRatioAnalysisAr(analysisResults: AnalysisResult[], financialData: FinancialStatement[], options: ReportOptions): string {
    return `
      <h2>تحليل النسب المالية</h2>
      <p>تحليل شامل للنسب المالية الرئيسية لتقييم الصحة المالية للشركة.</p>
      
      <h3>نسب السيولة</h3>
      <ul>
        <li>النسبة الجارية: ${this.calculateCurrentRatio(financialData[financialData.length - 1])}</li>
        <li>النسبة السريعة: ${this.calculateQuickRatio(financialData[financialData.length - 1])}</li>
        <li>نسبة النقدية: ${this.calculateCashRatio(financialData[financialData.length - 1])}</li>
      </ul>
    `;
  }

  private generateRiskAssessment(analysisResults: AnalysisResult[], financialData: FinancialStatement[], options: ReportOptions): string {
    return `
      <h2>Risk Assessment</h2>
      <p>Comprehensive evaluation of financial and operational risks facing the company.</p>
      
      <h3>Financial Risks</h3>
      <ul>
        <li>Liquidity Risk: ${this.assessLiquidityRisk(financialData[financialData.length - 1])}</li>
        <li>Credit Risk: ${this.assessCreditRisk(financialData[financialData.length - 1])}</li>
        <li>Market Risk: Medium</li>
      </ul>
    `;
  }

  private generateRiskAssessmentAr(analysisResults: AnalysisResult[], financialData: FinancialStatement[], options: ReportOptions): string {
    return `
      <h2>تقييم المخاطر</h2>
      <p>تقييم شامل للمخاطر المالية والتشغيلية التي تواجهها الشركة.</p>
      
      <h3>المخاطر المالية</h3>
      <ul>
        <li>مخاطر السيولة: ${this.assessLiquidityRisk(financialData[financialData.length - 1])}</li>
        <li>مخاطر الائتمان: ${this.assessCreditRisk(financialData[financialData.length - 1])}</li>
        <li>مخاطر السوق: متوسطة</li>
      </ul>
    `;
  }

  // Calculation methods
  private calculateRevenueGrowth(financialData: FinancialStatement[]): number {
    if (financialData.length < 2) return 0;
    const latest = financialData[financialData.length - 1];
    const previous = financialData[financialData.length - 2];
    const latestRevenue = latest.incomeStatement.revenue.salesRevenue;
    const previousRevenue = previous.incomeStatement.revenue.salesRevenue;
    return Math.round(((latestRevenue - previousRevenue) / previousRevenue) * 100);
  }

  private calculateProfitMargin(data: FinancialStatement): number {
    return Math.round((data.incomeStatement.netIncome / data.incomeStatement.revenue.salesRevenue) * 100);
  }

  private calculateROA(data: FinancialStatement): number {
    const totalAssets = this.calculateTotalAssets(data);
    return Math.round((data.incomeStatement.netIncome / totalAssets) * 100);
  }

  private calculateROE(data: FinancialStatement): number {
    const totalEquity = Object.values(data.balanceSheet.equity).reduce((sum, val) => sum + val, 0);
    return Math.round((data.incomeStatement.netIncome / totalEquity) * 100);
  }

  private calculateCurrentRatio(data: FinancialStatement): number {
    const currentAssets = Object.values(data.balanceSheet.currentAssets).reduce((sum, val) => sum + val, 0);
    const currentLiabilities = Object.values(data.balanceSheet.currentLiabilities).reduce((sum, val) => sum + val, 0);
    return Math.round((currentAssets / currentLiabilities) * 100) / 100;
  }

  private calculateQuickRatio(data: FinancialStatement): number {
    const quickAssets = data.balanceSheet.currentAssets.cashAndCashEquivalents + 
                       data.balanceSheet.currentAssets.shortTermInvestments + 
                       data.balanceSheet.currentAssets.accountsReceivable;
    const currentLiabilities = Object.values(data.balanceSheet.currentLiabilities).reduce((sum, val) => sum + val, 0);
    return Math.round((quickAssets / currentLiabilities) * 100) / 100;
  }

  private calculateCashRatio(data: FinancialStatement): number {
    const cash = data.balanceSheet.currentAssets.cashAndCashEquivalents;
    const currentLiabilities = Object.values(data.balanceSheet.currentLiabilities).reduce((sum, val) => sum + val, 0);
    return Math.round((cash / currentLiabilities) * 100) / 100;
  }

  private assessLiquidityRisk(data: FinancialStatement): string {
    const currentRatio = this.calculateCurrentRatio(data);
    if (currentRatio > 2) return 'Low';
    if (currentRatio > 1.5) return 'Medium';
    return 'High';
  }

  private assessCreditRisk(data: FinancialStatement): string {
    const totalDebt = Object.values(data.balanceSheet.currentLiabilities).reduce((sum, val) => sum + val, 0) +
                     Object.values(data.balanceSheet.nonCurrentLiabilities).reduce((sum, val) => sum + val, 0);
    const totalEquity = Object.values(data.balanceSheet.equity).reduce((sum, val) => sum + val, 0);
    const debtToEquity = totalDebt / totalEquity;
    if (debtToEquity < 0.3) return 'Low';
    if (debtToEquity < 0.6) return 'Medium';
    return 'High';
  }

  /**
   * Export report to HTML
   */
  async exportToHTML(report: GeneratedReport, options: ReportOptions): Promise<string> {
    const html = `
      <!DOCTYPE html>
      <html lang="${options.language}" dir="${options.language === 'ar' ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${options.language === 'ar' ? report.titleAr : report.title}</title>
        <style>
          body { 
            font-family: ${options.language === 'ar' ? 'Arial, Tahoma, sans-serif' : 'Arial, sans-serif'}; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
          }
          h1, h2, h3 { color: #2c3e50; margin-top: 30px; }
          .section { margin-bottom: 30px; }
          .metadata { background: #f8f9fa; padding: 20px; border-radius: 5px; border-left: 4px solid #007bff; }
          .recommendations { background: #e8f5e8; padding: 20px; border-radius: 5px; }
          ul { padding-left: 20px; }
          .ar { direction: rtl; text-align: right; }
        </style>
      </head>
      <body class="${options.language === 'ar' ? 'ar' : ''}">
        <h1>${options.language === 'ar' ? report.titleAr : report.title}</h1>
        
        <div class="metadata">
          <h2>${options.language === 'ar' ? 'معلومات التقرير' : 'Report Information'}</h2>
          <p><strong>${options.language === 'ar' ? 'تاريخ الإنشاء:' : 'Generated At:'}</strong> ${new Date(report.metadata.generatedAt).toLocaleDateString()}</p>
          <p><strong>${options.language === 'ar' ? 'الشركة:' : 'Company:'}</strong> ${report.metadata.companyInfo.name}</p>
          <p><strong>${options.language === 'ar' ? 'إجمالي الصفحات:' : 'Total Pages:'}</strong> ${report.metadata.totalPages}</p>
        </div>

        <div class="section">
          <h2>${options.language === 'ar' ? 'الملخص التنفيذي' : 'Executive Summary'}</h2>
          <p>${options.language === 'ar' ? report.executiveSummaryAr : report.executiveSummary}</p>
        </div>

        ${report.sections.map(section => `
          <div class="section">
            <h2>${options.language === 'ar' ? section.titleAr : section.title}</h2>
            <div>${options.language === 'ar' ? section.contentAr : section.content}</div>
          </div>
        `).join('')}

        <div class="section recommendations">
          <h2>${options.language === 'ar' ? 'التوصيات الاستراتيجية' : 'Strategic Recommendations'}</h2>
          <ul>
            ${(options.language === 'ar' ? report.recommendationsAr : report.recommendations).map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      </body>
      </html>
    `;

    return html;
  }
}

// Export singleton instance
export const simpleReportGenerator = SimpleReportGenerator.getInstance();

