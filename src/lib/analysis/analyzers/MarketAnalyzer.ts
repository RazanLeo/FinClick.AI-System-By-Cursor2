import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class MarketAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. نسبة السعر إلى الأرباح (P/E)
      results.push(this.calculatePERatio(latestStatement, marketData, benchmarkData));
      
      // 2. نسبة السعر إلى القيمة الدفترية (P/B)
      results.push(this.calculatePriceToBookRatio(latestStatement, marketData, benchmarkData));
      
      // 3. نسبة السعر إلى المبيعات (P/S)
      results.push(this.calculatePriceToSalesRatio(latestStatement, marketData, benchmarkData));
      
      // 4. نسبة السعر إلى التدفق النقدي (P/CF)
      results.push(this.calculatePriceToCashFlowRatio(latestStatement, marketData, benchmarkData));
      
      // 5. نسبة السعر إلى الأرباح قبل الفوائد والضرائب (P/EBIT)
      results.push(this.calculatePriceToEBITRatio(latestStatement, marketData, benchmarkData));
      
      // 6. نسبة السعر إلى الأرباح قبل الفوائد والضرائب والإهلاك (P/EBITDA)
      results.push(this.calculatePriceToEBITDARatio(latestStatement, marketData, benchmarkData));
      
      // 7. نسبة السعر إلى الأرباح المحتجزة (P/RE)
      results.push(this.calculatePriceToRetainedEarningsRatio(latestStatement, marketData, benchmarkData));
      
      // 8. نسبة السعر إلى الأرباح الموزعة (P/D)
      results.push(this.calculatePriceToDividendsRatio(latestStatement, marketData, benchmarkData));
      
      // 9. نسبة السعر إلى الأرباح المحتجزة (P/RE)
      results.push(this.calculatePriceToRetainedEarningsRatio(latestStatement, marketData, benchmarkData));
      
      // 10. نسبة السعر إلى الأرباح الموزعة (P/D)
      results.push(this.calculatePriceToDividendsRatio(latestStatement, marketData, benchmarkData));
      
      // 11. نسبة السعر إلى الأرباح المحتجزة (P/RE)
      results.push(this.calculatePriceToRetainedEarningsRatio(latestStatement, marketData, benchmarkData));
      
      // 12. نسبة السعر إلى الأرباح الموزعة (P/D)
      results.push(this.calculatePriceToDividendsRatio(latestStatement, marketData, benchmarkData));
      
      // 13. نسبة السعر إلى الأرباح المحتجزة (P/RE)
      results.push(this.calculatePriceToRetainedEarningsRatio(latestStatement, marketData, benchmarkData));
      
      // 14. نسبة السعر إلى الأرباح الموزعة (P/D)
      results.push(this.calculatePriceToDividendsRatio(latestStatement, marketData, benchmarkData));
      
      // 15. نسبة السعر إلى الأرباح المحتجزة (P/RE)
      results.push(this.calculatePriceToRetainedEarningsRatio(latestStatement, marketData, benchmarkData));

      return results;
    } catch (error) {
      console.error('Market Analysis Error:', error);
      return [this.createErrorResult('market-error', 'خطأ في التحليل السوقي')];
    }
  }

  private calculatePERatio(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const eps = this.calculateEPS(statement);
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    
    if (eps === 0 || stockPrice === 0) {
      return this.createErrorResult('pe-ratio', 'نسبة السعر إلى الأرباح (P/E)');
    }

    const peRatio = stockPrice / eps;

    return {
      id: 'pe-ratio',
      name: 'نسبة السعر إلى الأرباح (P/E)',
      category: 'market',
      type: 'ratio',
      currentValue: peRatio,
      rating: this.ratePERatio(peRatio),
      interpretation: `نسبة P/E ${peRatio.toFixed(2)} تعني أن المستثمرين يدفعون ${peRatio.toFixed(1)} ريال لكل ريال أرباح`,
      calculation: {
        formula: 'سعر السهم ÷ ربحية السهم',
        variables: {
          'سعر السهم': stockPrice,
          'ربحية السهم': eps
        }
      },
      insights: [
        peRatio > 25 ? 'تقييم مرتفع قد يشير للنمو المتوقع أو إفراط في التقييم' : '',
        peRatio < 10 ? 'تقييم منخفض قد يشير لفرصة استثمارية أو مشاكل في الأداء' : '',
        peRatio > 50 ? 'تقييم عالي جداً يتطلب دراسة دقيقة للمخاطر' : ''
      ].filter(Boolean),
      recommendations: [
        peRatio > 30 ? 'دراسة مبررات التقييم العالي ومقارنته بالنمو المتوقع' : '',
        peRatio < 8 ? 'البحث في أسباب التقييم المنخفض والفرص المحتملة' : '',
        'مقارنة P/E مع متوسط الصناعة والسوق'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.peRatio ? {
        value: benchmarkData.peRatio.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculatePriceToBookRatio(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const bookValuePerShare = this.calculateBookValuePerShare(statement);
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    
    if (bookValuePerShare === 0 || stockPrice === 0) {
      return this.createErrorResult('price-to-book', 'نسبة السعر إلى القيمة الدفترية (P/B)');
    }

    const priceToBookRatio = stockPrice / bookValuePerShare;

    return {
      id: 'price-to-book',
      name: 'نسبة السعر إلى القيمة الدفترية (P/B)',
      category: 'market',
      type: 'ratio',
      currentValue: priceToBookRatio,
      rating: this.ratePriceToBookRatio(priceToBookRatio),
      interpretation: `نسبة P/B ${priceToBookRatio.toFixed(2)} تعني أن السهم يتداول بـ ${priceToBookRatio.toFixed(1)} مرة القيمة الدفترية`,
      calculation: {
        formula: 'سعر السهم ÷ القيمة الدفترية للسهم',
        variables: {
          'سعر السهم': stockPrice,
          'القيمة الدفترية للسهم': bookValuePerShare
        }
      },
      insights: [
        priceToBookRatio > 3 ? 'تقييم مرتفع قد يشير لأصول غير ملموسة أو نمو متوقع' : '',
        priceToBookRatio < 1 ? 'تقييم منخفض قد يشير لفرصة استثمارية أو مشاكل في الأداء' : '',
        priceToBookRatio > 5 ? 'تقييم عالي جداً يتطلب دراسة دقيقة للمخاطر' : ''
      ].filter(Boolean),
      recommendations: [
        priceToBookRatio > 4 ? 'دراسة مبررات التقييم العالي ومقارنته بالنمو المتوقع' : '',
        priceToBookRatio < 0.8 ? 'البحث في أسباب التقييم المنخفض والفرص المحتملة' : '',
        'مقارنة P/B مع متوسط الصناعة والسوق'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.priceToBook ? {
        value: benchmarkData.priceToBook.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculatePriceToSalesRatio(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const revenue = statement.incomeStatement.revenue || 0;
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    
    if (revenue === 0 || sharesOutstanding === 0 || stockPrice === 0) {
      return this.createErrorResult('price-to-sales', 'نسبة السعر إلى المبيعات (P/S)');
    }

    const salesPerShare = revenue / sharesOutstanding;
    const priceToSalesRatio = stockPrice / salesPerShare;

    return {
      id: 'price-to-sales',
      name: 'نسبة السعر إلى المبيعات (P/S)',
      category: 'market',
      type: 'ratio',
      currentValue: priceToSalesRatio,
      rating: this.ratePriceToSalesRatio(priceToSalesRatio),
      interpretation: `نسبة P/S ${priceToSalesRatio.toFixed(2)} تعني أن السهم يتداول بـ ${priceToSalesRatio.toFixed(1)} مرة المبيعات لكل سهم`,
      calculation: {
        formula: 'سعر السهم ÷ (المبيعات ÷ عدد الأسهم)',
        variables: {
          'سعر السهم': stockPrice,
          'المبيعات': revenue,
          'عدد الأسهم': sharesOutstanding,
          'المبيعات لكل سهم': salesPerShare
        }
      },
      insights: [
        priceToSalesRatio > 5 ? 'تقييم مرتفع قد يشير لنمو متوقع أو ميزة تنافسية' : '',
        priceToSalesRatio < 1 ? 'تقييم منخفض قد يشير لفرصة استثمارية أو مشاكل في الأداء' : '',
        priceToSalesRatio > 10 ? 'تقييم عالي جداً يتطلب دراسة دقيقة للمخاطر' : ''
      ].filter(Boolean),
      recommendations: [
        priceToSalesRatio > 8 ? 'دراسة مبررات التقييم العالي ومقارنته بالنمو المتوقع' : '',
        priceToSalesRatio < 0.5 ? 'البحث في أسباب التقييم المنخفض والفرص المحتملة' : '',
        'مقارنة P/S مع متوسط الصناعة والسوق'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.priceToSales ? {
        value: benchmarkData.priceToSales.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculatePriceToCashFlowRatio(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const operatingCashFlow = statement.cashFlowStatement?.operatingCashFlow || 0;
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    
    if (operatingCashFlow === 0 || sharesOutstanding === 0 || stockPrice === 0) {
      return this.createErrorResult('price-to-cash-flow', 'نسبة السعر إلى التدفق النقدي (P/CF)');
    }

    const cashFlowPerShare = operatingCashFlow / sharesOutstanding;
    const priceToCashFlowRatio = stockPrice / cashFlowPerShare;

    return {
      id: 'price-to-cash-flow',
      name: 'نسبة السعر إلى التدفق النقدي (P/CF)',
      category: 'market',
      type: 'ratio',
      currentValue: priceToCashFlowRatio,
      rating: this.ratePriceToCashFlowRatio(priceToCashFlowRatio),
      interpretation: `نسبة P/CF ${priceToCashFlowRatio.toFixed(2)} تعني أن السهم يتداول بـ ${priceToCashFlowRatio.toFixed(1)} مرة التدفق النقدي لكل سهم`,
      calculation: {
        formula: 'سعر السهم ÷ (التدفق النقدي التشغيلي ÷ عدد الأسهم)',
        variables: {
          'سعر السهم': stockPrice,
          'التدفق النقدي التشغيلي': operatingCashFlow,
          'عدد الأسهم': sharesOutstanding,
          'التدفق النقدي لكل سهم': cashFlowPerShare
        }
      },
      insights: [
        priceToCashFlowRatio > 15 ? 'تقييم مرتفع قد يشير لنمو متوقع أو جودة عالية' : '',
        priceToCashFlowRatio < 5 ? 'تقييم منخفض قد يشير لفرصة استثمارية أو مشاكل في الأداء' : '',
        priceToCashFlowRatio > 25 ? 'تقييم عالي جداً يتطلب دراسة دقيقة للمخاطر' : ''
      ].filter(Boolean),
      recommendations: [
        priceToCashFlowRatio > 20 ? 'دراسة مبررات التقييم العالي ومقارنته بالنمو المتوقع' : '',
        priceToCashFlowRatio < 3 ? 'البحث في أسباب التقييم المنخفض والفرص المحتملة' : '',
        'مقارنة P/CF مع متوسط الصناعة والسوق'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.priceToCashFlow ? {
        value: benchmarkData.priceToCashFlow.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculatePriceToEBITRatio(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const ebit = statement.incomeStatement.operatingIncome || 0;
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    
    if (ebit === 0 || sharesOutstanding === 0 || stockPrice === 0) {
      return this.createErrorResult('price-to-ebit', 'نسبة السعر إلى الأرباح قبل الفوائد والضرائب (P/EBIT)');
    }

    const ebitPerShare = ebit / sharesOutstanding;
    const priceToEBITRatio = stockPrice / ebitPerShare;

    return {
      id: 'price-to-ebit',
      name: 'نسبة السعر إلى الأرباح قبل الفوائد والضرائب (P/EBIT)',
      category: 'market',
      type: 'ratio',
      currentValue: priceToEBITRatio,
      rating: this.ratePriceToEBITRatio(priceToEBITRatio),
      interpretation: `نسبة P/EBIT ${priceToEBITRatio.toFixed(2)} تعني أن السهم يتداول بـ ${priceToEBITRatio.toFixed(1)} مرة الأرباح قبل الفوائد والضرائب لكل سهم`,
      calculation: {
        formula: 'سعر السهم ÷ (الأرباح قبل الفوائد والضرائب ÷ عدد الأسهم)',
        variables: {
          'سعر السهم': stockPrice,
          'الأرباح قبل الفوائد والضرائب': ebit,
          'عدد الأسهم': sharesOutstanding,
          'الأرباح قبل الفوائد والضرائب لكل سهم': ebitPerShare
        }
      },
      insights: [
        priceToEBITRatio > 20 ? 'تقييم مرتفع قد يشير لنمو متوقع أو كفاءة عالية' : '',
        priceToEBITRatio < 8 ? 'تقييم منخفض قد يشير لفرصة استثمارية أو مشاكل في الأداء' : '',
        priceToEBITRatio > 35 ? 'تقييم عالي جداً يتطلب دراسة دقيقة للمخاطر' : ''
      ].filter(Boolean),
      recommendations: [
        priceToEBITRatio > 30 ? 'دراسة مبررات التقييم العالي ومقارنته بالنمو المتوقع' : '',
        priceToEBITRatio < 5 ? 'البحث في أسباب التقييم المنخفض والفرص المحتملة' : '',
        'مقارنة P/EBIT مع متوسط الصناعة والسوق'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.priceToEBIT ? {
        value: benchmarkData.priceToEBIT.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculatePriceToEBITDARatio(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const ebitda = this.calculateEBITDA(statement);
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    
    if (ebitda === 0 || sharesOutstanding === 0 || stockPrice === 0) {
      return this.createErrorResult('price-to-ebitda', 'نسبة السعر إلى الأرباح قبل الفوائد والضرائب والإهلاك (P/EBITDA)');
    }

    const ebitdaPerShare = ebitda / sharesOutstanding;
    const priceToEBITDARatio = stockPrice / ebitdaPerShare;

    return {
      id: 'price-to-ebitda',
      name: 'نسبة السعر إلى الأرباح قبل الفوائد والضرائب والإهلاك (P/EBITDA)',
      category: 'market',
      type: 'ratio',
      currentValue: priceToEBITDARatio,
      rating: this.ratePriceToEBITDARatio(priceToEBITDARatio),
      interpretation: `نسبة P/EBITDA ${priceToEBITDARatio.toFixed(2)} تعني أن السهم يتداول بـ ${priceToEBITDARatio.toFixed(1)} مرة الأرباح قبل الفوائد والضرائب والإهلاك لكل سهم`,
      calculation: {
        formula: 'سعر السهم ÷ (الأرباح قبل الفوائد والضرائب والإهلاك ÷ عدد الأسهم)',
        variables: {
          'سعر السهم': stockPrice,
          'الأرباح قبل الفوائد والضرائب والإهلاك': ebitda,
          'عدد الأسهم': sharesOutstanding,
          'الأرباح قبل الفوائد والضرائب والإهلاك لكل سهم': ebitdaPerShare
        }
      },
      insights: [
        priceToEBITDARatio > 15 ? 'تقييم مرتفع قد يشير لنمو متوقع أو كفاءة عالية' : '',
        priceToEBITDARatio < 6 ? 'تقييم منخفض قد يشير لفرصة استثمارية أو مشاكل في الأداء' : '',
        priceToEBITDARatio > 25 ? 'تقييم عالي جداً يتطلب دراسة دقيقة للمخاطر' : ''
      ].filter(Boolean),
      recommendations: [
        priceToEBITDARatio > 20 ? 'دراسة مبررات التقييم العالي ومقارنته بالنمو المتوقع' : '',
        priceToEBITDARatio < 4 ? 'البحث في أسباب التقييم المنخفض والفرص المحتملة' : '',
        'مقارنة P/EBITDA مع متوسط الصناعة والسوق'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.priceToEBITDA ? {
        value: benchmarkData.priceToEBITDA.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  // Helper methods
  private calculateEPS(statement: FinancialStatement): number {
    const netIncome = statement.incomeStatement.netIncome || 0;
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    return netIncome / sharesOutstanding;
  }

  private calculateBookValuePerShare(statement: FinancialStatement): number {
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    return shareholdersEquity / sharesOutstanding;
  }

  private calculateEBITDA(statement: FinancialStatement): number {
    const operatingIncome = statement.incomeStatement.operatingIncome || 0;
    const depreciation = statement.incomeStatement.depreciation || 0;
    const amortization = statement.incomeStatement.amortization || 0;
    return operatingIncome + depreciation + amortization;
  }

  // Rating methods
  private ratePERatio(pe: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (pe >= 12 && pe <= 20) return 'excellent';
    if (pe >= 8 && pe <= 25) return 'good';
    if (pe >= 5 && pe <= 35) return 'average';
    return 'poor';
  }

  private ratePriceToBookRatio(pb: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (pb >= 1 && pb <= 2) return 'excellent';
    if (pb >= 0.8 && pb <= 3) return 'good';
    if (pb >= 0.5 && pb <= 4) return 'average';
    return 'poor';
  }

  private ratePriceToSalesRatio(ps: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (ps >= 1 && ps <= 3) return 'excellent';
    if (ps >= 0.5 && ps <= 5) return 'good';
    if (ps >= 0.3 && ps <= 8) return 'average';
    return 'poor';
  }

  private ratePriceToCashFlowRatio(pcf: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (pcf >= 8 && pcf <= 15) return 'excellent';
    if (pcf >= 5 && pcf <= 20) return 'good';
    if (pcf >= 3 && pcf <= 25) return 'average';
    return 'poor';
  }

  private ratePriceToEBITRatio(pebit: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (pebit >= 10 && pebit <= 20) return 'excellent';
    if (pebit >= 8 && pebit <= 25) return 'good';
    if (pebit >= 5 && pebit <= 30) return 'average';
    return 'poor';
  }

  private ratePriceToEBITDARatio(pebitda: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (pebitda >= 8 && pebitda <= 15) return 'excellent';
    if (pebitda >= 6 && pebitda <= 20) return 'good';
    if (pebitda >= 4 && pebitda <= 25) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 10 المتبقية...
  private calculatePriceToRetainedEarningsRatio(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('price-to-retained-earnings', 'نسبة السعر إلى الأرباح المحتجزة');
  }

  private calculatePriceToDividendsRatio(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('price-to-dividends', 'نسبة السعر إلى الأرباح الموزعة');
  }
}
