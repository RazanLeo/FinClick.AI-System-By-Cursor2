import { FinancialStatement, Company } from '@/lib/types';

export class DataProcessor {
  
  async processFinancialStatements(
    files: any[],
    companyData: Company
  ): Promise<FinancialStatement[]> {
    const processedStatements: FinancialStatement[] = [];

    try {
      for (const file of files) {
        const statement = await this.processFile(file, companyData);
        if (statement) {
          processedStatements.push(statement);
        }
      }

      // ترتيب البيانات حسب السنة
      processedStatements.sort((a, b) => a.year - b.year);

      // التحقق من اكتمال البيانات
      this.validateStatements(processedStatements);

      return processedStatements;

    } catch (error) {
      console.error('Data Processing Error:', error);
      throw new Error(`فشل في معالجة البيانات المالية: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  }

  private async processFile(file: any, companyData: Company): Promise<FinancialStatement | null> {
    try {
      // استخراج البيانات بناءً على نوع الملف
      let extractedData: any;

      if (file.type === 'application/pdf') {
        extractedData = await this.processPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel') {
        extractedData = await this.processExcel(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedData = await this.processWord(file);
      } else if (file.type.startsWith('image/')) {
        extractedData = await this.processImage(file);
      } else {
        throw new Error(`نوع الملف غير مدعوم: ${file.type}`);
      }

      // تنظيف وهيكلة البيانات
      return this.structureFinancialData(extractedData, companyData);

    } catch (error) {
      console.error(`خطأ في معالجة الملف ${file.name}:`, error);
      return null;
    }
  }

  private async processPDF(file: any): Promise<any> {
    // معالجة ملفات PDF باستخدام تقنيات OCR و AI
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'pdf');

    const response = await fetch('/api/process/pdf', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('فشل في معالجة ملف PDF');
    }

    return response.json();
  }

  private async processExcel(file: any): Promise<any> {
    // معالجة ملفات Excel
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'excel');

    const response = await fetch('/api/process/excel', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('فشل في معالجة ملف Excel');
    }

    return response.json();
  }

  private async processWord(file: any): Promise<any> {
    // معالجة ملفات Word
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'word');

    const response = await fetch('/api/process/word', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('فشل في معالجة ملف Word');
    }

    return response.json();
  }

  private async processImage(file: any): Promise<any> {
    // معالجة الصور باستخدام OCR
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    const response = await fetch('/api/process/ocr', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('فشل في معالجة الصورة');
    }

    return response.json();
  }

  private structureFinancialData(rawData: any, companyData: Company): FinancialStatement {
    // تحويل البيانات الخام إلى هيكل مالي موحد
    
    // استخراج السنة
    const year = this.extractYear(rawData);
    
    // هيكلة قائمة الدخل
    const incomeStatement = this.structureIncomeStatement(rawData);
    
    // هيكلة الميزانية العمومية
    const balanceSheet = this.structureBalanceSheet(rawData);
    
    // هيكلة قائمة التدفقات النقدية
    const cashFlowStatement = this.structureCashFlowStatement(rawData);

    return {
      id: `${companyData.id}_${year}`,
      companyId: companyData.id,
      year,
      period: 'annual',
      currency: companyData.currency || 'SAR',
      incomeStatement,
      balanceSheet,
      cashFlowStatement,
      createdAt: new Date().toISOString()
    };
  }

  private extractYear(rawData: any): number {
    // استخراج السنة من النص باستخدام patterns
    const yearPatterns = [
      /20\d{2}/g,
      /\d{4}/g,
      /للسنة\s+المالية\s+المنتهية\s+في\s+(\d{4})/g,
      /للسنة\s+المنتهية\s+في\s+\d{1,2}\/\d{1,2}\/(\d{4})/g
    ];

    for (const pattern of yearPatterns) {
      const matches = rawData.text?.match(pattern);
      if (matches && matches.length > 0) {
        const year = parseInt(matches[matches.length - 1]);
        if (year >= 2010 && year <= new Date().getFullYear()) {
          return year;
        }
      }
    }

    // إذا لم نجد السنة، استخدم السنة الحالية
    return new Date().getFullYear();
  }

  private structureIncomeStatement(rawData: any): any {
    // استخراج بنود قائمة الدخل باستخدام AI وpattern matching
    const incomeStatement = {
      revenue: this.extractValue(rawData, ['الإيرادات', 'المبيعات', 'الدخل', 'revenue', 'sales']),
      costOfGoodsSold: this.extractValue(rawData, ['تكلفة البضاعة المباعة', 'تكلفة المبيعات', 'cost of goods sold', 'cogs']),
      grossProfit: 0,
      operatingExpenses: this.extractValue(rawData, ['المصروفات التشغيلية', 'operating expenses']),
      operatingIncome: this.extractValue(rawData, ['الربح التشغيلي', 'operating income', 'دخل العمليات']),
      interestExpense: this.extractValue(rawData, ['مصروفات الفوائد', 'interest expense']),
      interestIncome: this.extractValue(rawData, ['إيرادات الفوائد', 'interest income']),
      incomeBeforeTaxes: this.extractValue(rawData, ['الربح قبل الضرائب', 'income before taxes']),
      incomeTaxExpense: this.extractValue(rawData, ['مصروف ضريبة الدخل', 'income tax expense']),
      netIncome: this.extractValue(rawData, ['صافي الربح', 'الربح الصافي', 'net income', 'net profit']),
      depreciation: this.extractValue(rawData, ['الاستهلاك', 'depreciation']),
      amortization: this.extractValue(rawData, ['الإطفاء', 'amortization']),
      salariesAndWages: this.extractValue(rawData, ['الرواتب والأجور', 'salaries and wages']),
      totalExpenses: 0
    };

    // حساب البنود المحسوبة
    incomeStatement.grossProfit = incomeStatement.revenue - incomeStatement.costOfGoodsSold;
    incomeStatement.totalExpenses = incomeStatement.costOfGoodsSold + incomeStatement.operatingExpenses;

    return incomeStatement;
  }

  private structureBalanceSheet(rawData: any): any {
    return {
      // الأصول المتداولة
      cash: this.extractValue(rawData, ['النقدية', 'النقد', 'cash', 'cash and cash equivalents']),
      marketableSecurities: this.extractValue(rawData, ['الأوراق المالية', 'marketable securities']),
      accountsReceivable: this.extractValue(rawData, ['الذمم المدينة', 'العملاء', 'accounts receivable']),
      inventory: this.extractValue(rawData, ['المخزون', 'البضاعة', 'inventory']),
      prepaidExpenses: this.extractValue(rawData, ['المصروفات المدفوعة مقدماً', 'prepaid expenses']),
      currentAssets: this.extractValue(rawData, ['الأصول المتداولة', 'current assets']),

      // الأصول الثابتة
      fixedAssets: this.extractValue(rawData, ['الأصول الثابتة', 'fixed assets', 'ممتلكات ومعدات']),
      accumulatedDepreciation: this.extractValue(rawData, ['مجمع الاستهلاك', 'accumulated depreciation']),
      intangibleAssets: this.extractValue(rawData, ['الأصول غير المادية', 'intangible assets']),
      totalAssets: this.extractValue(rawData, ['إجمالي الأصول', 'total assets']),

      // الالتزامات المتداولة
      accountsPayable: this.extractValue(rawData, ['الذمم الدائنة', 'الموردون', 'accounts payable']),
      shortTermDebt: this.extractValue(rawData, ['الديون قصيرة الأجل', 'short term debt']),
      accruedExpenses: this.extractValue(rawData, ['المصروفات المستحقة', 'accrued expenses']),
      currentLiabilities: this.extractValue(rawData, ['الالتزامات المتداولة', 'current liabilities']),

      // الالتزامات طويلة الأجل
      longTermDebt: this.extractValue(rawData, ['الديون طويلة الأجل', 'long term debt']),
      totalLiabilities: this.extractValue(rawData, ['إجمالي الالتزامات', 'total liabilities']),

      // حقوق الملكية
      shareholdersEquity: this.extractValue(rawData, ['حقوق المساهمين', 'حقوق الملكية', 'shareholders equity']),
      retainedEarnings: this.extractValue(rawData, ['الأرباح المحتجزة', 'retained earnings']),
      sharesOutstanding: this.extractValue(rawData, ['عدد الأسهم القائمة', 'shares outstanding'], 1000000)
    };
  }

  private structureCashFlowStatement(rawData: any): any {
    return {
      operatingCashFlow: this.extractValue(rawData, ['التدفق النقدي التشغيلي', 'operating cash flow']),
      investingCashFlow: this.extractValue(rawData, ['التدفق النقدي الاستثماري', 'investing cash flow']),
      financingCashFlow: this.extractValue(rawData, ['التدفق النقدي التمويلي', 'financing cash flow']),
      netCashFlow: this.extractValue(rawData, ['صافي التدفق النقدي', 'net cash flow']),
      freeCashFlow: this.extractValue(rawData, ['التدفق النقدي الحر', 'free cash flow']),
      capitalExpenditures: this.extractValue(rawData, ['النفقات الرأسمالية', 'capital expenditures']),
      dividendsPaid: this.extractValue(rawData, ['الأرباح الموزعة', 'dividends paid']),
      debtRepayments: this.extractValue(rawData, ['سداد الديون', 'debt repayments'])
    };
  }

  private extractValue(rawData: any, keywords: string[], defaultValue: number = 0): number {
    // استخراج القيم باستخدام pattern matching و AI
    
    if (!rawData.text && !rawData.tables) {
      return defaultValue;
    }

    // البحث في النص المستخرج
    if (rawData.text) {
      for (const keyword of keywords) {
        const pattern = new RegExp(`${keyword}[:\s]*([0-9,\.]+)`, 'i');
        const match = rawData.text.match(pattern);
        if (match && match[1]) {
          return this.parseNumber(match[1]);
        }
      }
    }

    // البحث في الجداول
    if (rawData.tables) {
      for (const table of rawData.tables) {
        const value = this.searchInTable(table, keywords);
        if (value !== null) {
          return value;
        }
      }
    }

    // استخدام AI لاستخراج القيم
    if (rawData.aiExtracted) {
      for (const keyword of keywords) {
        if (rawData.aiExtracted[keyword] !== undefined) {
          return rawData.aiExtracted[keyword];
        }
      }
    }

    return defaultValue;
  }

  private searchInTable(table: any[], keywords: string[]): number | null {
    for (const row of table) {
      for (let i = 0; i < row.length - 1; i++) {
        const cell = row[i]?.toString().toLowerCase() || '';
        for (const keyword of keywords) {
          if (cell.includes(keyword.toLowerCase())) {
            // البحث عن القيمة في الخلايا المجاورة
            for (let j = i + 1; j < row.length; j++) {
              const value = this.parseNumber(row[j]);
              if (value !== 0) {
                return value;
              }
            }
          }
        }
      }
    }
    return null;
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') {
      return value;
    }
    
    if (typeof value === 'string') {
      // إزالة الفواصل والرموز
      const cleaned = value.replace(/[,\s]/g, '').replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    return 0;
  }

  private validateStatements(statements: FinancialStatement[]): void {
    if (statements.length === 0) {
      throw new Error('لم يتم استخراج أي بيانات مالية من الملفات المرفوعة');
    }

    for (const statement of statements) {
      // التحقق من وجود البيانات الأساسية
      if (!statement.incomeStatement.revenue && !statement.incomeStatement.netIncome) {
        console.warn(`بيانات ناقصة للسنة ${statement.year} - قد تكون النتائج غير دقيقة`);
      }

      if (!statement.balanceSheet.totalAssets && !statement.balanceSheet.currentAssets) {
        console.warn(`بيانات الميزانية ناقصة للسنة ${statement.year}`);
      }

      // التحقق من التوازن المحاسبي
      const assets = statement.balanceSheet.totalAssets || 0;
      const liabilities = statement.balanceSheet.totalLiabilities || 0;
      const equity = statement.balanceSheet.shareholdersEquity || 0;
      
      if (assets > 0 && Math.abs(assets - (liabilities + equity)) > assets * 0.05) {
        console.warn(`عدم توازن محاسبي محتمل للسنة ${statement.year}`);
      }
    }
  }

  // تنظيف وتطبيع البيانات
  cleanAndNormalizeData(statements: FinancialStatement[]): FinancialStatement[] {
    return statements.map(statement => {
      // إزالة القيم السالبة غير المنطقية
      statement.incomeStatement.revenue = Math.max(0, statement.incomeStatement.revenue);
      statement.balanceSheet.totalAssets = Math.max(0, statement.balanceSheet.totalAssets);
      
      // تطبيق قواعد المحاسبة
      if (statement.incomeStatement.grossProfit === 0 && statement.incomeStatement.revenue > 0) {
        statement.incomeStatement.grossProfit = 
          statement.incomeStatement.revenue - statement.incomeStatement.costOfGoodsSold;
      }

      // تقدير البيانات المفقودة
      if (!statement.cashFlowStatement.freeCashFlow && statement.cashFlowStatement.operatingCashFlow > 0) {
        statement.cashFlowStatement.freeCashFlow = 
          statement.cashFlowStatement.operatingCashFlow - (statement.cashFlowStatement.capitalExpenditures || 0);
      }

      return statement;
    });
  }

  // إضافة metadata للبيانات
  addMetadata(statements: FinancialStatement[], companyData: Company): FinancialStatement[] {
    return statements.map(statement => ({
      ...statement,
      metadata: {
        processingDate: new Date().toISOString(),
        source: 'file_upload',
        quality: this.assessDataQuality(statement),
        completeness: this.calculateCompleteness(statement),
        reliability: this.assessReliability(statement)
      }
    }));
  }

  private assessDataQuality(statement: FinancialStatement): 'high' | 'medium' | 'low' {
    let score = 0;
    let total = 0;

    // فحص قائمة الدخل
    const incomeFields = ['revenue', 'netIncome', 'operatingIncome'];
    incomeFields.forEach(field => {
      total++;
      if (statement.incomeStatement[field] > 0) score++;
    });

    // فحص الميزانية
    const balanceFields = ['totalAssets', 'currentAssets', 'shareholdersEquity'];
    balanceFields.forEach(field => {
      total++;
      if (statement.balanceSheet[field] > 0) score++;
    });

    const ratio = score / total;
    if (ratio >= 0.8) return 'high';
    if (ratio >= 0.5) return 'medium';
    return 'low';
  }

  private calculateCompleteness(statement: FinancialStatement): number {
    const allFields = [
      ...Object.values(statement.incomeStatement),
      ...Object.values(statement.balanceSheet),
      ...Object.values(statement.cashFlowStatement || {})
    ];

    const filledFields = allFields.filter(value => value !== 0 && value !== null && value !== undefined);
    return (filledFields.length / allFields.length) * 100;
  }

  private assessReliability(statement: FinancialStatement): number {
    // حساب مؤشر الموثوقية بناءً على التوازن المحاسبي والمنطق التجاري
    let reliability = 100;

    // فحص التوازن المحاسبي
    const assets = statement.balanceSheet.totalAssets || 0;
    const liabilities = statement.balanceSheet.totalLiabilities || 0;
    const equity = statement.balanceSheet.shareholdersEquity || 0;
    
    if (assets > 0) {
      const imbalance = Math.abs(assets - (liabilities + equity)) / assets;
      if (imbalance > 0.1) reliability -= 30;
      else if (imbalance > 0.05) reliability -= 15;
    }

    // فحص المنطق التجاري
    if (statement.incomeStatement.revenue > 0 && statement.incomeStatement.netIncome < 0) {
      // خسائر مع وجود إيرادات - طبيعي
    } else if (statement.incomeStatement.revenue === 0 && statement.incomeStatement.netIncome > 0) {
      // ربح بدون إيرادات - مشكوك
      reliability -= 20;
    }

    return Math.max(0, reliability);
  }
}
