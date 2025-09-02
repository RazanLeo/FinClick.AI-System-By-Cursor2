import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';
import { BaseAnalyzer } from './BaseAnalyzer';

export class ValuationAnalyzer extends BaseAnalyzer {
  async analyze(financialData: FinancialStatement[], companyData: Company, marketData?: any, benchmarkData?: any): Promise<AnalysisResult[]> {
    const latestStatement = financialData[financialData.length - 1];
    const results: AnalysisResult[] = [];

    try {
      // تحليلات التقييم الـ 18
      results.push(this.calculateDCFValuation(financialData, companyData, marketData));
      results.push(this.calculateIntrinsicValue(latestStatement, financialData, marketData));
      results.push(this.calculateFairValue(latestStatement, marketData, benchmarkData));
      results.push(this.calculateEVA(latestStatement, benchmarkData));
      results.push(this.calculateMVA(latestStatement, marketData));
      results.push(this.calculateGordonGrowthModel(latestStatement, marketData));
      results.push(this.calculateAssetBasedValuation(latestStatement));
      results.push(this.calculateLiquidationValue(latestStatement));
      results.push(this.calculateRealOptionsValue(latestStatement, companyData));
      results.push(this.calculateRelativeValuation(latestStatement, benchmarkData));
      results.push(this.calculateStrategicValue(latestStatement, companyData));
      results.push(this.calculateIPValuation(latestStatement, companyData));
      results.push(this.calculateBookValue(latestStatement));
      results.push(this.calculateReplacementCost(latestStatement));
      results.push(this.calculateGoingConcernValue(latestStatement, financialData));
      results.push(this.calculateTerminalValue(latestStatement, financialData));
      results.push(this.calculateSumOfParts(latestStatement, companyData));
      results.push(this.calculateRiskAdjustedValue(latestStatement, marketData));

      return results;
    } catch (error) {
      console.error('Valuation Analysis Error:', error);
      return [this.createErrorResult('valuation-error', 'خطأ في تحليل التقييم')];
    }
  }

  private calculateDCFValuation(financialData: FinancialStatement[], companyData: Company, marketData: any): AnalysisResult {
    const freeCashFlows = this.projectFreeCashFlows(financialData, 5);
    const wacc = this.calculateWACC(financialData[financialData.length - 1], marketData);
    const terminalValue = this.calculateTerminalValue(financialData[financialData.length - 1], financialData);
    const presentValue = this.calculatePresentValue(freeCashFlows, wacc, terminalValue);

    return {
      id: 'dcf-valuation',
      name: 'التقييم بالتدفق النقدي المخصوم (DCF)',
      category: 'valuation',
      type: 'currency',
      currentValue: presentValue,
      rating: this.rateValuation(presentValue, marketData?.marketCap || 0),
      interpretation: `القيمة الجوهرية المحسوبة ${this.formatCurrency(presentValue)} بناءً على التدفقات النقدية المستقبلية`,
      calculation: {
        formula: 'مجموع القيم الحالية للتدفقات النقدية + القيمة النهائية',
        variables: {
          'WACC': wacc,
          'التدفقات النقدية المتوقعة': freeCashFlows,
          'القيمة النهائية': terminalValue
        }
      },
      status: 'completed'
    };
  }

  private projectFreeCashFlows(financialData: FinancialStatement[], years: number): number[] {
    const latestCashFlow = financialData[financialData.length - 1].cashFlowStatement?.freeCashFlow || 0;
    const growthRate = this.calculateHistoricalGrowthRate(financialData);
    
    const projections = [];
    for (let i = 1; i <= years; i++) {
      projections.push(latestCashFlow * Math.pow(1 + growthRate, i));
    }
    return projections;
  }

  private calculateWACC(statement: FinancialStatement, marketData: any): number {
    const totalDebt = this.calculateTotalDebt(statement);
    const marketValueEquity = marketData?.marketCap || statement.balanceSheet.shareholdersEquity || 0;
    const totalValue = totalDebt + marketValueEquity;
    
    const costOfDebt = this.calculateCostOfDebt(statement);
    const costOfEquity = this.calculateCostOfEquity(statement, marketData);
    const taxRate = 0.25;
    
    const weightDebt = totalDebt / totalValue;
    const weightEquity = marketValueEquity / totalValue;
    
    return (weightDebt * costOfDebt * (1 - taxRate)) + (weightEquity * costOfEquity);
  }

  private calculateCostOfDebt(statement: FinancialStatement): number {
    const interestExpense = statement.incomeStatement.interestExpense || 0;
    const totalDebt = this.calculateTotalDebt(statement);
    return totalDebt > 0 ? interestExpense / totalDebt : 0.05;
  }

  private calculateCostOfEquity(statement: FinancialStatement, marketData: any): number {
    const riskFreeRate = marketData?.riskFreeRate || 0.03;
    const beta = marketData?.beta || 1.0;
    const marketRiskPremium = marketData?.marketRiskPremium || 0.06;
    
    return riskFreeRate + (beta * marketRiskPremium);
  }

  private calculatePresentValue(cashFlows: number[], discountRate: number, terminalValue: number): number {
    let pv = 0;
    
    for (let i = 0; i < cashFlows.length; i++) {
      pv += cashFlows[i] / Math.pow(1 + discountRate, i + 1);
    }
    
    pv += terminalValue / Math.pow(1 + discountRate, cashFlows.length);
    
    return pv;
  }

  private calculateTotalDebt(statement: FinancialStatement): number {
    return (statement.balanceSheet.longTermDebt || 0) + (statement.balanceSheet.shortTermDebt || 0);
  }

  private calculateHistoricalGrowthRate(financialData: FinancialStatement[]): number {
    if (financialData.length < 2) return 0.05;
    
    const latest = financialData[financialData.length - 1].cashFlowStatement?.freeCashFlow || 0;
    const previous = financialData[financialData.length - 2].cashFlowStatement?.freeCashFlow || 0;
    
    if (previous === 0) return 0.05;
    
    return (latest - previous) / previous;
  }

  private calculateTerminalValue(statement: FinancialStatement, financialData: FinancialStatement[]): number {
    const latestCashFlow = statement.cashFlowStatement?.freeCashFlow || 0;
    const growthRate = this.calculateHistoricalGrowthRate(financialData);
    const discountRate = 0.1;
    
    return (latestCashFlow * (1 + growthRate)) / (discountRate - growthRate);
  }

  private rateValuation(intrinsicValue: number, marketValue: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (marketValue === 0) return 'average';
    
    const ratio = intrinsicValue / marketValue;
    if (ratio > 1.5) return 'excellent';
    if (ratio > 1.2) return 'good';
    if (ratio > 0.8) return 'average';
    return 'poor';
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(value);
  }

  // باقي الطرق المطلوبة...
  private calculateIntrinsicValue(statement: FinancialStatement, financialData: FinancialStatement[], marketData: any): AnalysisResult {
    return this.createErrorResult('intrinsic-value', 'القيمة الجوهرية');
  }

  private calculateFairValue(statement: FinancialStatement, marketData: any, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('fair-value', 'القيمة العادلة');
  }

  private calculateEVA(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('eva', 'القيمة الاقتصادية المضافة');
  }

  private calculateMVA(statement: FinancialStatement, marketData: any): AnalysisResult {
    return this.createErrorResult('mva', 'القيمة السوقية المضافة');
  }

  private calculateGordonGrowthModel(statement: FinancialStatement, marketData: any): AnalysisResult {
    return this.createErrorResult('gordon-model', 'نموذج جوردون للنمو');
  }

  private calculateAssetBasedValuation(statement: FinancialStatement): AnalysisResult {
    return this.createErrorResult('asset-based', 'التقييم على أساس الأصول');
  }

  private calculateLiquidationValue(statement: FinancialStatement): AnalysisResult {
    return this.createErrorResult('liquidation-value', 'قيمة التصفية');
  }

  private calculateRealOptionsValue(statement: FinancialStatement, companyData: Company): AnalysisResult {
    return this.createErrorResult('real-options', 'قيمة الخيارات الحقيقية');
  }

  private calculateRelativeValuation(statement: FinancialStatement, benchmarkData?: any): AnalysisResult {
    return this.createErrorResult('relative-valuation', 'التقييم النسبي');
  }

  private calculateStrategicValue(statement: FinancialStatement, companyData: Company): AnalysisResult {
    return this.createErrorResult('strategic-value', 'القيمة الاستراتيجية');
  }

  private calculateIPValuation(statement: FinancialStatement, companyData: Company): AnalysisResult {
    return this.createErrorResult('ip-valuation', 'تقييم الملكية الفكرية');
  }

  private calculateBookValue(statement: FinancialStatement): AnalysisResult {
    return this.createErrorResult('book-value', 'القيمة الدفترية');
  }

  private calculateReplacementCost(statement: FinancialStatement): AnalysisResult {
    return this.createErrorResult('replacement-cost', 'تكلفة الاستبدال');
  }

  private calculateGoingConcernValue(statement: FinancialStatement, financialData: FinancialStatement[]): AnalysisResult {
    return this.createErrorResult('going-concern', 'قيمة الاستمرارية');
  }

  private calculateSumOfParts(statement: FinancialStatement, companyData: Company): AnalysisResult {
    return this.createErrorResult('sum-of-parts', 'مجموع الأجزاء');
  }

  private calculateRiskAdjustedValue(statement: FinancialStatement, marketData: any): AnalysisResult {
    return this.createErrorResult('risk-adjusted', 'القيمة المعدلة للمخاطر');
  }
}
