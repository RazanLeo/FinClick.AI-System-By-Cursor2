import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class ExpertAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // 1. تحليل القيمة العادلة
      results.push(this.calculateFairValueAnalysis(latestStatement, marketData, benchmarkData));
      
      // 2. تحليل القيمة الدفترية
      results.push(this.calculateBookValueAnalysis(latestStatement, benchmarkData));
      
      // 3. تحليل القيمة السوقية
      results.push(this.calculateMarketValueAnalysis(latestStatement, marketData, benchmarkData));
      
      // 4. تحليل القيمة الاستثمارية
      results.push(this.calculateInvestmentValueAnalysis(latestStatement, marketData, benchmarkData));
      
      // 5. تحليل القيمة المؤسسية
      results.push(this.calculateEnterpriseValueAnalysis(latestStatement, marketData, benchmarkData));
      
      // 6. تحليل القيمة المضافة
      results.push(this.calculateValueAddedAnalysis(latestStatement, benchmarkData));
      
      // 7. تحليل القيمة المحققة
      results.push(this.calculateRealizedValueAnalysis(latestStatement, benchmarkData));
      
      // 8. تحليل القيمة المحتملة
      results.push(this.calculatePotentialValueAnalysis(latestStatement, marketData, benchmarkData));
      
      // 9. تحليل القيمة المستقبلية
      results.push(this.calculateFutureValueAnalysis(latestStatement, marketData, benchmarkData));
      
      // 10. تحليل القيمة الحالية
      results.push(this.calculatePresentValueAnalysis(latestStatement, marketData, benchmarkData));
      
      // 11. تحليل القيمة المطلقة
      results.push(this.calculateAbsoluteValueAnalysis(latestStatement, benchmarkData));
      
      // 12. تحليل القيمة النسبية
      results.push(this.calculateRelativeValueAnalysis(latestStatement, marketData, benchmarkData));
      
      // 13. تحليل القيمة المضافة
      results.push(this.calculateValueAddedAnalysis(latestStatement, benchmarkData));
      
      // 14. تحليل القيمة المحققة
      results.push(this.calculateRealizedValueAnalysis(latestStatement, benchmarkData));
      
      // 15. تحليل القيمة المحتملة
      results.push(this.calculatePotentialValueAnalysis(latestStatement, marketData, benchmarkData));

      return results;
    } catch (error) {
      console.error('Expert Analysis Error:', error);
      return [this.createErrorResult('expert-error', 'خطأ في التحليل المتخصص')];
    }
  }

  private calculateFairValueAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    const eps = this.calculateEPS(statement);
    const bookValuePerShare = this.calculateBookValuePerShare(statement);
    const revenue = statement.incomeStatement.revenue || 0;
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    
    if (stockPrice === 0 || eps === 0 || bookValuePerShare === 0 || revenue === 0 || sharesOutstanding === 0) {
      return this.createErrorResult('fair-value', 'تحليل القيمة العادلة');
    }

    // حساب تحليل القيمة العادلة
    const peRatio = stockPrice / eps;
    const pbRatio = stockPrice / bookValuePerShare;
    const psRatio = (stockPrice * sharesOutstanding) / revenue;
    const fairValuePE = this.calculateFairValuePE(statement, benchmarkData);
    const fairValuePB = this.calculateFairValuePB(statement, benchmarkData);
    const fairValuePS = this.calculateFairValuePS(statement, benchmarkData);
    
    // مؤشر القيمة العادلة (0-100)
    const fairValueScore = Math.min(100, Math.max(0,
      (Math.min(peRatio / fairValuePE, 1) * 40) +
      (Math.min(pbRatio / fairValuePB, 1) * 30) +
      (Math.min(psRatio / fairValuePS, 1) * 30)
    ));

    return {
      id: 'fair-value',
      name: 'تحليل القيمة العادلة',
      category: 'expert',
      type: 'value-score',
      currentValue: fairValueScore,
      rating: this.rateValueScore(fairValueScore),
      interpretation: `مؤشر القيمة العادلة ${fairValueScore.toFixed(1)}% يعكس مدى قرب السعر الحالي من القيمة العادلة المتوقعة`,
      calculation: {
        formula: '(P/E الحالي ÷ P/E العادل × 40%) + (P/B الحالي ÷ P/B العادل × 30%) + (P/S الحالي ÷ P/S العادل × 30%)',
        variables: {
          'P/E الحالي': peRatio,
          'P/E العادل': fairValuePE,
          'P/B الحالي': pbRatio,
          'P/B العادل': fairValuePB,
          'P/S الحالي': psRatio,
          'P/S العادل': fairValuePS,
          'مؤشر القيمة العادلة': fairValueScore
        }
      },
      insights: [
        fairValueScore > 80 ? 'القيمة العادلة ممتازة تدل على تقييم مناسب للسهم' : '',
        fairValueScore < 50 ? 'القيمة العادلة ضعيفة قد تشير لإفراط في التقييم' : '',
        fairValueScore < 30 ? 'القيمة العادلة ضعيفة جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        fairValueScore < 60 ? 'مراجعة التقييم الحالي والبحث عن فرص تحسين' : '',
        fairValueScore > 90 ? 'الحفاظ على التقييم العادل' : '',
        'مراقبة اتجاهات القيمة العادلة عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.fairValue ? {
        value: benchmarkData.fairValue.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateBookValueAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    const shareholdersEquity = statement.balanceSheet.shareholdersEquity || 0;
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    const totalLiabilities = statement.balanceSheet.totalLiabilities || 0;
    
    if (sharesOutstanding === 0 || totalAssets === 0) {
      return this.createErrorResult('book-value', 'تحليل القيمة الدفترية');
    }

    // حساب تحليل القيمة الدفترية
    const bookValuePerShare = shareholdersEquity / sharesOutstanding;
    const bookValueToAssetsRatio = (shareholdersEquity / totalAssets) * 100;
    const bookValueToLiabilitiesRatio = totalLiabilities > 0 ? (shareholdersEquity / totalLiabilities) * 100 : 0;
    const bookValueGrowth = this.calculateBookValueGrowth(statement);
    
    // مؤشر القيمة الدفترية (0-100)
    const bookValueScore = Math.min(100, Math.max(0,
      (bookValueToAssetsRatio / 2) +
      (Math.min(bookValueToLiabilitiesRatio / 2, 50)) +
      (Math.min(bookValueGrowth * 10, 50))
    ));

    return {
      id: 'book-value',
      name: 'تحليل القيمة الدفترية',
      category: 'expert',
      type: 'value-score',
      currentValue: bookValueScore,
      rating: this.rateValueScore(bookValueScore),
      interpretation: `مؤشر القيمة الدفترية ${bookValueScore.toFixed(1)}% يعكس قوة القيمة الدفترية للشركة`,
      calculation: {
        formula: '(نسبة حقوق الملكية إلى الأصول ÷ 2) + (نسبة حقوق الملكية إلى الالتزامات ÷ 2) + (نمو القيمة الدفترية × 10)',
        variables: {
          'القيمة الدفترية للسهم': bookValuePerShare,
          'نسبة حقوق الملكية إلى الأصول': bookValueToAssetsRatio,
          'نسبة حقوق الملكية إلى الالتزامات': bookValueToLiabilitiesRatio,
          'نمو القيمة الدفترية': bookValueGrowth,
          'مؤشر القيمة الدفترية': bookValueScore
        }
      },
      insights: [
        bookValueScore > 80 ? 'القيمة الدفترية ممتازة تدل على قوة مالية جيدة' : '',
        bookValueScore < 50 ? 'القيمة الدفترية ضعيفة قد تشير لمشاكل في الأصول' : '',
        bookValueScore < 30 ? 'القيمة الدفترية ضعيفة جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        bookValueScore < 60 ? 'تحسين القيمة الدفترية من خلال زيادة حقوق الملكية' : '',
        bookValueScore > 90 ? 'الحفاظ على القيمة الدفترية الممتازة' : '',
        'مراقبة اتجاهات القيمة الدفترية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.bookValue ? {
        value: benchmarkData.bookValue.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateMarketValueAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    const marketCap = stockPrice * sharesOutstanding;
    const revenue = statement.incomeStatement.revenue || 0;
    const netIncome = statement.incomeStatement.netIncome || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (stockPrice === 0 || sharesOutstanding === 0 || revenue === 0 || totalAssets === 0) {
      return this.createErrorResult('market-value', 'تحليل القيمة السوقية');
    }

    // حساب تحليل القيمة السوقية
    const marketCapToRevenue = marketCap / revenue;
    const marketCapToNetIncome = netIncome > 0 ? marketCap / netIncome : 0;
    const marketCapToAssets = marketCap / totalAssets;
    const marketValueGrowth = this.calculateMarketValueGrowth(marketData);
    
    // مؤشر القيمة السوقية (0-100)
    const marketValueScore = Math.min(100, Math.max(0,
      (Math.min(marketCapToRevenue / 5, 1) * 40) +
      (Math.min(marketCapToNetIncome / 20, 1) * 30) +
      (Math.min(marketCapToAssets / 2, 1) * 20) +
      (Math.min(marketValueGrowth * 10, 1) * 10)
    ));

    return {
      id: 'market-value',
      name: 'تحليل القيمة السوقية',
      category: 'expert',
      type: 'value-score',
      currentValue: marketValueScore,
      rating: this.rateValueScore(marketValueScore),
      interpretation: `مؤشر القيمة السوقية ${marketValueScore.toFixed(1)}% يعكس قوة القيمة السوقية للشركة`,
      calculation: {
        formula: '(القيمة السوقية ÷ الإيرادات ÷ 5 × 40%) + (القيمة السوقية ÷ صافي الربح ÷ 20 × 30%) + (القيمة السوقية ÷ الأصول ÷ 2 × 20%) + (نمو القيمة السوقية × 10 × 10%)',
        variables: {
          'القيمة السوقية': marketCap,
          'القيمة السوقية إلى الإيرادات': marketCapToRevenue,
          'القيمة السوقية إلى صافي الربح': marketCapToNetIncome,
          'القيمة السوقية إلى الأصول': marketCapToAssets,
          'نمو القيمة السوقية': marketValueGrowth,
          'مؤشر القيمة السوقية': marketValueScore
        }
      },
      insights: [
        marketValueScore > 80 ? 'القيمة السوقية ممتازة تدل على تقييم قوي في السوق' : '',
        marketValueScore < 50 ? 'القيمة السوقية ضعيفة قد تشير لمشاكل في التقييم' : '',
        marketValueScore < 30 ? 'القيمة السوقية ضعيفة جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        marketValueScore < 60 ? 'تحسين القيمة السوقية من خلال تحسين التقييم' : '',
        marketValueScore > 90 ? 'الحفاظ على القيمة السوقية الممتازة' : '',
        'مراقبة اتجاهات القيمة السوقية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.marketValue ? {
        value: benchmarkData.marketValue.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateInvestmentValueAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    const eps = this.calculateEPS(statement);
    const bookValuePerShare = this.calculateBookValuePerShare(statement);
    const revenue = statement.incomeStatement.revenue || 0;
    const netIncome = statement.incomeStatement.netIncome || 0;
    const totalAssets = statement.balanceSheet.totalAssets || 0;
    
    if (stockPrice === 0 || eps === 0 || bookValuePerShare === 0 || revenue === 0 || totalAssets === 0) {
      return this.createErrorResult('investment-value', 'تحليل القيمة الاستثمارية');
    }

    // حساب تحليل القيمة الاستثمارية
    const peRatio = stockPrice / eps;
    const pbRatio = stockPrice / bookValuePerShare;
    const psRatio = (stockPrice * (statement.balanceSheet.sharesOutstanding || 1000000)) / revenue;
    const roa = (netIncome / totalAssets) * 100;
    const roe = (netIncome / (statement.balanceSheet.shareholdersEquity || 0)) * 100;
    
    // مؤشر القيمة الاستثمارية (0-100)
    const investmentValueScore = Math.min(100, Math.max(0,
      (Math.min(peRatio / 15, 1) * 30) +
      (Math.min(pbRatio / 2, 1) * 25) +
      (Math.min(psRatio / 3, 1) * 20) +
      (Math.min(roa / 10, 1) * 15) +
      (Math.min(roe / 15, 1) * 10)
    ));

    return {
      id: 'investment-value',
      name: 'تحليل القيمة الاستثمارية',
      category: 'expert',
      type: 'value-score',
      currentValue: investmentValueScore,
      rating: this.rateValueScore(investmentValueScore),
      interpretation: `مؤشر القيمة الاستثمارية ${investmentValueScore.toFixed(1)}% يعكس جاذبية الاستثمار في الشركة`,
      calculation: {
        formula: '(P/E ÷ 15 × 30%) + (P/B ÷ 2 × 25%) + (P/S ÷ 3 × 20%) + (ROA ÷ 10 × 15%) + (ROE ÷ 15 × 10%)',
        variables: {
          'نسبة P/E': peRatio,
          'نسبة P/B': pbRatio,
          'نسبة P/S': psRatio,
          'العائد على الأصول': roa,
          'العائد على حقوق الملكية': roe,
          'مؤشر القيمة الاستثمارية': investmentValueScore
        }
      },
      insights: [
        investmentValueScore > 80 ? 'القيمة الاستثمارية ممتازة تدل على فرصة استثمارية جيدة' : '',
        investmentValueScore < 50 ? 'القيمة الاستثمارية ضعيفة قد تشير لمخاطر استثمارية' : '',
        investmentValueScore < 30 ? 'القيمة الاستثمارية ضعيفة جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        investmentValueScore < 60 ? 'تحسين القيمة الاستثمارية من خلال تحسين المؤشرات المالية' : '',
        investmentValueScore > 90 ? 'الحفاظ على القيمة الاستثمارية الممتازة' : '',
        'مراقبة اتجاهات القيمة الاستثمارية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.investmentValue ? {
        value: benchmarkData.investmentValue.average,
        source: 'معايير الصناعة',
        period: 'السنة الحالية'
      } : undefined,
      status: 'completed'
    };
  }

  private calculateEnterpriseValueAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    const stockPrice = marketData?.stockPrice || marketData?.currentPrice || 0;
    const sharesOutstanding = statement.balanceSheet.sharesOutstanding || 1000000;
    const marketCap = stockPrice * sharesOutstanding;
    const totalDebt = (statement.balanceSheet.currentLiabilities || 0) + (statement.balanceSheet.longTermDebt || 0);
    const cash = statement.balanceSheet.cash || 0;
    const enterpriseValue = marketCap + totalDebt - cash;
    const ebitda = this.calculateEBITDA(statement);
    const revenue = statement.incomeStatement.revenue || 0;
    
    if (enterpriseValue === 0 || ebitda === 0 || revenue === 0) {
      return this.createErrorResult('enterprise-value', 'تحليل القيمة المؤسسية');
    }

    // حساب تحليل القيمة المؤسسية
    const evToEBITDA = enterpriseValue / ebitda;
    const evToRevenue = enterpriseValue / revenue;
    const evToAssets = enterpriseValue / (statement.balanceSheet.totalAssets || 0);
    const enterpriseValueGrowth = this.calculateEnterpriseValueGrowth(marketData);
    
    // مؤشر القيمة المؤسسية (0-100)
    const enterpriseValueScore = Math.min(100, Math.max(0,
      (Math.min(evToEBITDA / 15, 1) * 40) +
      (Math.min(evToRevenue / 5, 1) * 30) +
      (Math.min(evToAssets / 2, 1) * 20) +
      (Math.min(enterpriseValueGrowth * 10, 1) * 10)
    ));

    return {
      id: 'enterprise-value',
      name: 'تحليل القيمة المؤسسية',
      category: 'expert',
      type: 'value-score',
      currentValue: enterpriseValueScore,
      rating: this.rateValueScore(enterpriseValueScore),
      interpretation: `مؤشر القيمة المؤسسية ${enterpriseValueScore.toFixed(1)}% يعكس قوة القيمة المؤسسية للشركة`,
      calculation: {
        formula: '(EV ÷ EBITDA ÷ 15 × 40%) + (EV ÷ الإيرادات ÷ 5 × 30%) + (EV ÷ الأصول ÷ 2 × 20%) + (نمو EV × 10 × 10%)',
        variables: {
          'القيمة المؤسسية': enterpriseValue,
          'EV إلى EBITDA': evToEBITDA,
          'EV إلى الإيرادات': evToRevenue,
          'EV إلى الأصول': evToAssets,
          'نمو القيمة المؤسسية': enterpriseValueGrowth,
          'مؤشر القيمة المؤسسية': enterpriseValueScore
        }
      },
      insights: [
        enterpriseValueScore > 80 ? 'القيمة المؤسسية ممتازة تدل على قوة مؤسسية جيدة' : '',
        enterpriseValueScore < 50 ? 'القيمة المؤسسية ضعيفة قد تشير لمشاكل في التقييم' : '',
        enterpriseValueScore < 30 ? 'القيمة المؤسسية ضعيفة جداً تتطلب مراجعة فورية' : ''
      ].filter(Boolean),
      recommendations: [
        enterpriseValueScore < 60 ? 'تحسين القيمة المؤسسية من خلال تحسين التقييم' : '',
        enterpriseValueScore > 90 ? 'الحفاظ على القيمة المؤسسية الممتازة' : '',
        'مراقبة اتجاهات القيمة المؤسسية عبر الزمن'
      ].filter(Boolean),
      industryBenchmark: benchmarkData?.enterpriseValue ? {
        value: benchmarkData.enterpriseValue.average,
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

  private calculateFairValuePE(statement: FinancialStatement, benchmarkData?: any): number {
    // حساب P/E العادل بناءً على نمو الأرباح ومخاطر الشركة
    const growthRate = 0.1; // 10% نمو افتراضي
    const riskFreeRate = 0.03; // 3% معدل خالي من المخاطر
    const riskPremium = 0.05; // 5% علاوة مخاطر
    return (1 + growthRate) / (riskFreeRate + riskPremium - growthRate);
  }

  private calculateFairValuePB(statement: FinancialStatement, benchmarkData?: any): number {
    // حساب P/B العادل بناءً على ROE ومعدل النمو
    const roe = 0.15; // 15% ROE افتراضي
    const growthRate = 0.1; // 10% نمو افتراضي
    const requiredReturn = 0.12; // 12% عائد مطلوب
    return (roe - growthRate) / (requiredReturn - growthRate);
  }

  private calculateFairValuePS(statement: FinancialStatement, benchmarkData?: any): number {
    // حساب P/S العادل بناءً على هامش الربح ومعدل النمو
    const profitMargin = 0.1; // 10% هامش ربح افتراضي
    const growthRate = 0.1; // 10% نمو افتراضي
    const requiredReturn = 0.12; // 12% عائد مطلوب
    return (profitMargin * (1 + growthRate)) / (requiredReturn - growthRate);
  }

  private calculateBookValueGrowth(statement: FinancialStatement): number {
    // حساب نمو القيمة الدفترية - افتراضي 5%
    return 0.05;
  }

  private calculateMarketValueGrowth(marketData: any): number {
    // حساب نمو القيمة السوقية - افتراضي 8%
    return 0.08;
  }

  private calculateEnterpriseValueGrowth(marketData: any): number {
    // حساب نمو القيمة المؤسسية - افتراضي 6%
    return 0.06;
  }

  private rateValueScore(score: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  }

  // باقي التحليلات الـ 10 المتبقية...
  private calculateValueAddedAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('value-added', 'تحليل القيمة المضافة');
  }

  private calculateRealizedValueAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('realized-value', 'تحليل القيمة المحققة');
  }

  private calculatePotentialValueAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('potential-value', 'تحليل القيمة المحتملة');
  }

  private calculateFutureValueAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('future-value', 'تحليل القيمة المستقبلية');
  }

  private calculatePresentValueAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('present-value', 'تحليل القيمة الحالية');
  }

  private calculateAbsoluteValueAnalysis(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('absolute-value', 'تحليل القيمة المطلقة');
  }

  private calculateRelativeValueAnalysis(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('relative-value', 'تحليل القيمة النسبية');
  }
}
