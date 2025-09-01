import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';

export abstract class BaseAnalyzer {
  abstract analyze(
    financialData: FinancialStatement[],
    companyData: Company,
    marketData?: any,
    benchmarkData?: any
  ): Promise<AnalysisResult[]>;

  protected createErrorResult(id: string, name: string): AnalysisResult {
    return {
      id,
      name,
      category: 'error',
      currentValue: 0,
      rating: 'poor',
      interpretation: 'فشل في حساب هذا المؤشر بسبب نقص في البيانات المطلوبة',
      status: 'error',
      recommendations: ['التأكد من اكتمال البيانات المالية المطلوبة للحساب']
    };
  }

  protected calculateTrend(values: number[], direction: 'up_is_better' | 'down_is_better' | 'contextual' = 'up_is_better'): 'up' | 'down' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const latest = values[values.length - 1];
    const previous = values[values.length - 2];
    const change = (latest - previous) / Math.abs(previous);
    
    if (Math.abs(change) < 0.05) return 'stable';
    return change > 0 ? 'up' : 'down';
  }

  protected formatCurrency(value: number): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} مليون`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)} ألف`;
    }
    return value.toLocaleString('ar-SA');
  }

  protected formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  protected formatRatio(value: number): string {
    return `${value.toFixed(2)}:1`;
  }

  protected getRating(value: number, thresholds: {excellent: number, good: number, average: number}): 'excellent' | 'good' | 'average' | 'poor' {
    if (value >= thresholds.excellent) return 'excellent';
    if (value >= thresholds.good) return 'good';
    if (value >= thresholds.average) return 'average';
    return 'poor';
  }

  protected getRatingReverse(value: number, thresholds: {excellent: number, good: number, average: number}): 'excellent' | 'good' | 'average' | 'poor' {
    if (value <= thresholds.excellent) return 'excellent';
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.average) return 'average';
    return 'poor';
  }

  protected calculateGrowthRate(currentValue: number, previousValue: number): number {
    if (previousValue === 0) return 0;
    return (currentValue - previousValue) / Math.abs(previousValue);
  }

  protected calculateCAGR(initialValue: number, finalValue: number, periods: number): number {
    if (initialValue <= 0 || finalValue <= 0 || periods <= 0) return 0;
    return Math.pow(finalValue / initialValue, 1 / periods) - 1;
  }

  protected isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  protected safeCalculate(numerator: number, denominator: number, defaultValue: number = 0): number {
    if (!this.isValidNumber(numerator) || !this.isValidNumber(denominator) || denominator === 0) {
      return defaultValue;
    }
    return numerator / denominator;
  }

  protected generateInsights(metricName: string, value: number, rating: string, category: string): string[] {
    const insights: string[] = [];
    
    // Generic insights based on rating
    switch (rating) {
      case 'excellent':
        insights.push(`${metricName} في المستوى الممتاز ويتفوق على معايير الصناعة`);
        break;
      case 'good':
        insights.push(`${metricName} في مستوى جيد ويقارب أفضل الممارسات`);
        break;
      case 'average':
        insights.push(`${metricName} في المستوى المتوسط ويحتاج للتحسين`);
        break;
      case 'poor':
        insights.push(`${metricName} أقل من المطلوب ويحتاج لانتباه فوري`);
        break;
    }

    return insights;
  }

  protected generateRecommendations(metricName: string, value: number, rating: string, category: string): string[] {
    const recommendations: string[] = [];
    
    if (rating === 'poor' || rating === 'average') {
      switch (category) {
        case 'liquidity':
          recommendations.push('تحسين إدارة التدفق النقدي وتسريع دورة رأس المال العامل');
          recommendations.push('مراجعة سياسات الائتمان وإجراءات التحصيل');
          break;
        case 'profitability':
          recommendations.push('مراجعة هيكل التكاليف وتحسين كفاءة العمليات');
          recommendations.push('تطوير استراتيجيات التسعير وتحسين هوامش الربح');
          break;
        case 'efficiency':
          recommendations.push('تحسين استغلال الأصول وتقليل الهدر في العمليات');
          recommendations.push('مراجعة العمليات التشغيلية وتحسين الإنتاجية');
          break;
        case 'leverage':
          recommendations.push('مراجعة هيكل رأس المال وتحسين نسب المديونية');
          recommendations.push('تقليل الاعتماد على الديون وتعزيز حقوق الملكية');
          break;
      }
    }
    
    return recommendations;
  }

  protected calculateZScore(value: number, mean: number, stdDev: number): number {
    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
  }

  protected normalizeValue(value: number, min: number, max: number): number {
    if (max === min) return 0;
    return (value - min) / (max - min);
  }

  protected weightedAverage(values: number[], weights: number[]): number {
    if (values.length !== weights.length || values.length === 0) return 0;
    
    const weightedSum = values.reduce((sum, value, index) => sum + (value * weights[index]), 0);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    return totalWeight === 0 ? 0 : weightedSum / totalWeight;
  }

  protected calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }

  protected findOutliers(values: number[]): number[] {
    if (values.length < 4) return [];
    
    const sorted = [...values].sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;
    
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    return values.filter(value => value < lowerBound || value > upperBound);
  }

  protected calculateMovingAverage(values: number[], periods: number): number[] {
    if (values.length < periods) return values;
    
    const movingAverages: number[] = [];
    for (let i = periods - 1; i < values.length; i++) {
      const sum = values.slice(i - periods + 1, i + 1).reduce((a, b) => a + b, 0);
      movingAverages.push(sum / periods);
    }
    
    return movingAverages;
  }

  protected calculateRSI(prices: number[], periods: number = 14): number {
    if (prices.length < periods + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= periods; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / periods;
    const avgLoss = losses / periods;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  protected generateAdvancedInsights(
    metricName: string, 
    currentValue: number, 
    historicalValues: number[], 
    benchmarkValue?: number
  ): string[] {
    const insights: string[] = [];
    
    // Trend analysis
    if (historicalValues.length >= 3) {
      const trend = this.calculateTrend(historicalValues);
      const volatility = this.calculateVolatility(historicalValues);
      
      if (trend === 'up') {
        insights.push(`${metricName} يُظهر اتجاهاً تصاعدياً إيجابياً`);
      } else if (trend === 'down') {
        insights.push(`${metricName} يُظهر اتجاهاً تنازلياً يحتاج للمراجعة`);
      }
      
      if (volatility > 0.2) {
        insights.push(`${metricName} يُظهر تذبذباً عالياً في الأداء`);
      }
    }
    
    // Benchmark comparison
    if (benchmarkValue !== undefined) {
      const difference = ((currentValue - benchmarkValue) / benchmarkValue) * 100;
      if (Math.abs(difference) > 10) {
        insights.push(
          difference > 0 
            ? `${metricName} يتفوق على معيار الصناعة بنسبة ${difference.toFixed(1)}%`
            : `${metricName} أقل من معيار الصناعة بنسبة ${Math.abs(difference).toFixed(1)}%`
        );
      }
    }
    
    return insights;
  }

  protected assessRiskLevel(
    metricName: string, 
    currentValue: number, 
    category: string, 
    rating: string
  ): {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    mitigation: string[];
  } {
    let level: 'low' | 'medium' | 'high' = 'medium';
    const factors: string[] = [];
    const mitigation: string[] = [];
    
    // Determine risk level based on rating and category
    if (rating === 'poor') {
      level = 'high';
      factors.push(`${metricName} في مستوى ضعيف يتطلب تدخل فوري`);
    } else if (rating === 'average') {
      level = 'medium';
      factors.push(`${metricName} في مستوى متوسط يحتاج للتحسين`);
    } else {
      level = 'low';
    }
    
    // Category-specific risk factors
    switch (category) {
      case 'liquidity':
        if (level === 'high') {
          factors.push('مخاطر عدم القدرة على الوفاء بالالتزامات قصيرة الأجل');
          mitigation.push('تحسين إدارة التدفق النقدي');
          mitigation.push('ترتيب خطوط ائتمان طارئة');
        }
        break;
      case 'profitability':
        if (level === 'high') {
          factors.push('مخاطر عدم تحقيق عوائد مناسبة للمساهمين');
          mitigation.push('مراجعة استراتيجية التسعير');
          mitigation.push('تحسين كفاءة العمليات');
        }
        break;
      case 'leverage':
        if (level === 'high') {
          factors.push('مخاطر عالية في الرفع المالي');
          mitigation.push('تقليل مستوى المديونية');
          mitigation.push('تعزيز حقوق الملكية');
        }
        break;
    }
    
    return { level, factors, mitigation };
  }
}
