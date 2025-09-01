import { AnalysisResult, FinancialStatement, Company } from '@/lib/types';

/**
 * النظام الكامل للتحليلات المالية الـ 181 
 * حسب التصنيف المحدد في البرومبت
 */

export class Complete181FinancialAnalyzer {

  /************************************************
   * المستوى الأول: التحليل الأساسي الكلاسيكي (55 تحليل)
   ************************************************/

  // 1. التحليل الهيكلي للقوائم المالية (15 تحليل)
  
  async performStructuralAnalysis(statements: FinancialStatement[]): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    
    // 1) التحليل الرأسي (Vertical Analysis)
    results.push(await this.calculateVerticalAnalysis(statements));
    
    // 2) التحليل الأفقي (Horizontal Analysis) 
    results.push(await this.calculateHorizontalAnalysis(statements));
    
    // 3) التحليل المختلط (Combined Analysis)
    results.push(await this.calculateCombinedAnalysis(statements));
    
    // 4) تحليل الاتجاه (Trend Analysis)
    results.push(await this.calculateTrendAnalysis(statements));
    
    // 5) التحليل المقارن الأساسي (Basic Comparative)
    results.push(await this.calculateBasicComparative(statements));
    
    // 6) تحليل القيمة المضافة
    results.push(await this.calculateValueAddedAnalysis(statements));
    
    // 7) تحليل الأساس المشترك (Common-Size)
    results.push(await this.calculateCommonSizeAnalysis(statements));
    
    // 8) تحليل السلاسل الزمنية البسيط
    results.push(await this.calculateSimpleTimeSeriesAnalysis(statements));
    
    // 9) تحليل التغيرات النسبية
    results.push(await this.calculatePercentageChangesAnalysis(statements));
    
    // 10) تحليل معدلات النمو
    results.push(await this.calculateGrowthRatesAnalysis(statements));
    
    // 11) تحليل الانحرافات الأساسي
    results.push(await this.calculateBasicVarianceAnalysis(statements));
    
    // 12) تحليل التباين البسيط
    results.push(await this.calculateSimpleVariationAnalysis(statements));
    
    // 13) تحليل الفروقات
    results.push(await this.calculateDifferencesAnalysis(statements));
    
    // 14) تحليل البنود الاستثنائية
    results.push(await this.calculateExceptionalItemsAnalysis(statements));
    
    // 15) تحليل الأرقام القياسية
    results.push(await this.calculateIndexNumbersAnalysis(statements));

    return results;
  }

  private async calculateVerticalAnalysis(statements: FinancialStatement[]): Promise<AnalysisResult> {
    const latest = statements[statements.length - 1];
    const totalRevenue = latest.incomeStatement.revenue || 0;
    const totalAssets = latest.balanceSheet.totalAssets || 0;
    
    // حساب النسب العمودية لجميع البنود
    const incomeStatementVertical = {
      revenue: 100, // الأساس
      cogs: ((latest.incomeStatement.costOfGoodsSold || 0) / totalRevenue) * 100,
      grossProfit: (((latest.incomeStatement.revenue || 0) - (latest.incomeStatement.costOfGoodsSold || 0)) / totalRevenue) * 100,
      operatingExpenses: ((latest.incomeStatement.operatingExpenses || 0) / totalRevenue) * 100,
      operatingIncome: ((latest.incomeStatement.operatingIncome || 0) / totalRevenue) * 100,
      netIncome: ((latest.incomeStatement.netIncome || 0) / totalRevenue) * 100
    };

    const balanceSheetVertical = {
      currentAssets: ((latest.balanceSheet.currentAssets || 0) / totalAssets) * 100,
      fixedAssets: ((latest.balanceSheet.fixedAssets || 0) / totalAssets) * 100,
      totalAssets: 100, // الأساس
      currentLiabilities: ((latest.balanceSheet.currentLiabilities || 0) / totalAssets) * 100,
      longTermDebt: ((latest.balanceSheet.longTermDebt || 0) / totalAssets) * 100,
      shareholdersEquity: ((latest.balanceSheet.shareholdersEquity || 0) / totalAssets) * 100
    };

    return {
      id: 'vertical-analysis',
      name: 'التحليل الرأسي (Vertical Analysis)',
      category: 'structural',
      type: 'percentage',
      currentValue: incomeStatementVertical.netIncome,
      rating: this.rateVerticalAnalysis(incomeStatementVertical, balanceSheetVertical),
      interpretation: `التحليل الرأسي يُظهر أن صافي الربح يمثل ${incomeStatementVertical.netIncome.toFixed(1)}% من الإيرادات، وحقوق الملكية تمثل ${balanceSheetVertical.shareholdersEquity.toFixed(1)}% من الأصول`,
      
      calculation: {
        formula: 'نسبة كل بند = (قيمة البند ÷ القيمة الأساسية) × 100',
        variables: {
          'هيكل قائمة الدخل': incomeStatementVertical,
          'هيكل الميزانية': balanceSheetVertical
        }
      },

      insights: [
        incomeStatementVertical.cogs > 70 ? 'تكلفة البضاعة المباعة عالية نسبياً وتحتاج مراجعة' : '',
        incomeStatementVertical.operatingExpenses > 25 ? 'المصروفات التشغيلية مرتفعة وتؤثر على الربحية' : '',
        balanceSheetVertical.currentAssets < 30 ? 'الأصول المتداولة منخفضة قد تؤثر على السيولة' : '',
        balanceSheetVertical.longTermDebt > 40 ? 'الديون طويلة الأجل مرتفعة وتزيد المخاطر المالية' : ''
      ].filter(Boolean),

      recommendations: [
        incomeStatementVertical.netIncome < 5 ? 'تحسين هامش الربح من خلال زيادة الكفاءة وتقليل التكاليف' : '',
        incomeStatementVertical.cogs > 65 ? 'مراجعة استراتيجية المشتريات وتحسين كفاءة الإنتاج' : '',
        balanceSheetVertical.currentAssets < 25 ? 'تعزيز السيولة وتحسين إدارة الأصول المتداولة' : '',
        'مراقبة التغيرات في الهيكل عبر الزمن لتحديد الاتجاهات'
      ].filter(Boolean),

      detailedBreakdown: {
        incomeStatementStructure: incomeStatementVertical,
        balanceSheetStructure: balanceSheetVertical,
        keyRatios: {
          profitabilityStructure: incomeStatementVertical.netIncome,
          assetStructureHealth: balanceSheetVertical.currentAssets + balanceSheetVertical.fixedAssets,
          leverageStructure: balanceSheetVertical.longTermDebt
        }
      },

      status: 'completed'
    };
  }

  private async calculateHorizontalAnalysis(statements: FinancialStatement[]): Promise<AnalysisResult> {
    if (statements.length < 2) {
      throw new Error('التحليل الأفقي يتطلب سنتين على الأقل من البيانات');
    }

    const current = statements[statements.length - 1];
    const previous = statements[statements.length - 2];
    
    // حساب التغيرات الأفقية
    const incomeStatementChanges = {
      revenue: this.calculatePercentageChange(previous.incomeStatement.revenue, current.incomeStatement.revenue),
      cogs: this.calculatePercentageChange(previous.incomeStatement.costOfGoodsSold, current.incomeStatement.costOfGoodsSold),
      grossProfit: this.calculatePercentageChange(
        (previous.incomeStatement.revenue || 0) - (previous.incomeStatement.costOfGoodsSold || 0),
        (current.incomeStatement.revenue || 0) - (current.incomeStatement.costOfGoodsSold || 0)
      ),
      operatingIncome: this.calculatePercentageChange(previous.incomeStatement.operatingIncome, current.incomeStatement.operatingIncome),
      netIncome: this.calculatePercentageChange(previous.incomeStatement.netIncome, current.incomeStatement.netIncome)
    };

    const balanceSheetChanges = {
      totalAssets: this.calculatePercentageChange(previous.balanceSheet.totalAssets, current.balanceSheet.totalAssets),
      currentAssets: this.calculatePercentageChange(previous.balanceSheet.currentAssets, current.balanceSheet.currentAssets),
      fixedAssets: this.calculatePercentageChange(previous.balanceSheet.fixedAssets, current.balanceSheet.fixedAssets),
      totalLiabilities: this.calculatePercentageChange(previous.balanceSheet.totalLiabilities, current.balanceSheet.totalLiabilities),
      shareholdersEquity: this.calculatePercentageChange(previous.balanceSheet.shareholdersEquity, current.balanceSheet.shareholdersEquity)
    };

    return {
      id: 'horizontal-analysis',
      name: 'التحليل الأفقي (Horizontal Analysis)',
      category: 'structural',
      type: 'percentage',
      currentValue: incomeStatementChanges.revenue,
      rating: this.rateHorizontalAnalysis(incomeStatementChanges, balanceSheetChanges),
      interpretation: `التحليل الأفقي يُظهر نمو الإيرادات بنسبة ${incomeStatementChanges.revenue.toFixed(1)}% ونمو صافي الربح بنسبة ${incomeStatementChanges.netIncome.toFixed(1}}%`,

      calculation: {
        formula: 'نسبة التغير = ((القيمة الحالية - القيمة السابقة) ÷ القيمة السابقة) × 100',
        variables: {
          'تغيرات قائمة الدخل': incomeStatementChanges,
          'تغيرات الميزانية': balanceSheetChanges,
          'السنة الحالية': current.year,
          'السنة السابقة': previous.year
        }
      },

      insights: [
        incomeStatementChanges.revenue > 15 ? 'نمو ممتاز في الإيرادات يدل على قوة الطلب' : '',
        incomeStatementChanges.netIncome < 0 ? 'انخفاض في صافي الربح يتطلب مراجعة فورية' : '',
        balanceSheetChanges.totalAssets > 20 ? 'نمو كبير في الأصول قد يشير للتوسع' : '',
        Math.abs(incomeStatementChanges.revenue - incomeStatementChanges.netIncome) > 10 ? 'عدم تناسق بين نمو الإيرادات والأرباح' : ''
      ].filter(Boolean),

      recommendations: [
        incomeStatementChanges.revenue < 5 ? 'وضع استراتيجيات لتحفيز النمو وزيادة الإيرادات' : '',
        incomeStatementChanges.netIncome < incomeStatementChanges.revenue / 2 ? 'مراجعة هيكل التكاليف وتحسين الكفاءة' : '',
        balanceSheetChanges.totalLiabilities > balanceSheetChanges.totalAssets ? 'مراقبة مستوى المديونية وإدارة المخاطر' : '',
        'تحليل أسباب التغيرات الكبيرة ووضع خطط للاستفادة منها'
      ].filter(Boolean),

      trendData: {
        incomeGrowthTrends: incomeStatementChanges,
        balanceSheetTrends: balanceSheetChanges,
        overallGrowthRate: (incomeStatementChanges.revenue + incomeStatementChanges.netIncome) / 2
      },

      status: 'completed'
    };
  }

  // 2. النسب المالية الأساسية (30 نسبة)
  
  async performBasicFinancialRatios(statement: FinancialStatement): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];

    // نسب السيولة (5 نسب)
    results.push(...await this.calculateLiquidityRatios(statement));
    
    // نسب النشاط/الكفاءة (9 نسب)
    results.push(...await this.calculateActivityEfficiencyRatios(statement));
    
    // نسب المديونية/الرفع المالي (5 نسب)
    results.push(...await this.calculateLeverageRatios(statement));
    
    // نسب الربحية (6 نسب)
    results.push(...await this.calculateProfitabilityRatios(statement));
    
    // نسب السوق/القيمة (5 نسب)
    results.push(...await this.calculateMarketValueRatios(statement));

    return results;
  }

  private async calculateLiquidityRatios(statement: FinancialStatement): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];

    // 1) النسبة الجارية
    const currentRatio = (statement.balanceSheet.currentAssets || 0) / (statement.balanceSheet.currentLiabilities || 1);
    results.push({
      id: 'current-ratio',
      name: 'النسبة الجارية',
      category: 'liquidity',
      type: 'ratio',
      currentValue: currentRatio,
      rating: this.rateCurrentRatio(currentRatio),
      interpretation: `النسبة الجارية ${currentRatio.toFixed(2)} تشير إلى ${this.interpretCurrentRatio(currentRatio)}`,
      calculation: {
        formula: 'الأصول المتداولة ÷ الالتزامات المتداولة',
        variables: {
          'الأصول المتداولة': statement.balanceSheet.currentAssets || 0,
          'الالتزامات المتداولة': statement.balanceSheet.currentLiabilities || 0
        }
      },
      benchmarkComparison: this.getBenchmarkComparison('current-ratio', currentRatio),
      competitorAnalysis: this.getCompetitorAnalysis('current-ratio', currentRatio),
      competitivePosition: this.getCompetitivePosition(currentRatio, 'current-ratio'),
      recommendations: this.getCurrentRatioRecommendations(currentRatio),
      status: 'completed'
    });

    // 2) النسبة السريعة
    const quickAssets = (statement.balanceSheet.currentAssets || 0) - (statement.balanceSheet.inventory || 0);
    const quickRatio = quickAssets / (statement.balanceSheet.currentLiabilities || 1);
    results.push({
      id: 'quick-ratio',
      name: 'النسبة السريعة',
      category: 'liquidity',
      type: 'ratio',
      currentValue: quickRatio,
      rating: this.rateQuickRatio(quickRatio),
      interpretation: `النسبة السريعة ${quickRatio.toFixed(2)} تدل على ${this.interpretQuickRatio(quickRatio)}`,
      calculation: {
        formula: '(الأصول المتداولة - المخزون) ÷ الالتزامات المتداولة',
        variables: {
          'الأصول السريعة': quickAssets,
          'الالتزامات المتداولة': statement.balanceSheet.currentLiabilities || 0
        }
      },
      benchmarkComparison: this.getBenchmarkComparison('quick-ratio', quickRatio),
      competitorAnalysis: this.getCompetitorAnalysis('quick-ratio', quickRatio),
      competitivePosition: this.getCompetitivePosition(quickRatio, 'quick-ratio'),
      recommendations: this.getQuickRatioRecommendations(quickRatio),
      status: 'completed'
    });

    // 3) نسبة النقد
    const cashRatio = ((statement.balanceSheet.cash || 0) + (statement.balanceSheet.marketableSecurities || 0)) / (statement.balanceSheet.currentLiabilities || 1);
    results.push({
      id: 'cash-ratio',
      name: 'نسبة النقد',
      category: 'liquidity', 
      type: 'ratio',
      currentValue: cashRatio,
      rating: this.rateCashRatio(cashRatio),
      interpretation: `نسبة النقد ${cashRatio.toFixed(3)} تعكس ${this.interpretCashRatio(cashRatio)}`,
      calculation: {
        formula: '(النقدية + الأوراق المالية قصيرة الأجل) ÷ الالتزامات المتداولة',
        variables: {
          'النقدية': statement.balanceSheet.cash || 0,
          'الأوراق المالية قصيرة الأجل': statement.balanceSheet.marketableSecurities || 0,
          'الالتزامات المتداولة': statement.balanceSheet.currentLiabilities || 0
        }
      },
      benchmarkComparison: this.getBenchmarkComparison('cash-ratio', cashRatio),
      competitorAnalysis: this.getCompetitorAnalysis('cash-ratio', cashRatio),
      competitivePosition: this.getCompetitivePosition(cashRatio, 'cash-ratio'),
      recommendations: this.getCashRatioRecommendations(cashRatio),
      status: 'completed'
    });

    // 4) نسبة التدفقات النقدية التشغيلية
    const operatingCashFlowRatio = (statement.cashFlowStatement?.operatingCashFlow || 0) / (statement.balanceSheet.currentLiabilities || 1);
    results.push({
      id: 'operating-cash-flow-ratio',
      name: 'نسبة التدفقات النقدية التشغيلية',
      category: 'liquidity',
      type: 'ratio',
      currentValue: operatingCashFlowRatio,
      rating: this.rateOperatingCashFlowRatio(operatingCashFlowRatio),
      interpretation: `نسبة التدفق النقدي التشغيلي ${operatingCashFlowRatio.toFixed(3)} توضح ${this.interpretOperatingCashFlowRatio(operatingCashFlowRatio)}`,
      calculation: {
        formula: 'التدفق النقدي التشغيلي ÷ الالتزامات المتداولة',
        variables: {
          'التدفق النقدي التشغيلي': statement.cashFlowStatement?.operatingCashFlow || 0,
          'الالتزامات المتداولة': statement.balanceSheet.currentLiabilities || 0
        }
      },
      benchmarkComparison: this.getBenchmarkComparison('operating-cash-flow-ratio', operatingCashFlowRatio),
      competitorAnalysis: this.getCompetitorAnalysis('operating-cash-flow-ratio', operatingCashFlowRatio),
      competitivePosition: this.getCompetitivePosition(operatingCashFlowRatio, 'operating-cash-flow-ratio'),
      recommendations: this.getOperatingCashFlowRatioRecommendations(operatingCashFlowRatio),
      status: 'completed'
    });

    // 5) نسبة رأس المال العامل
    const workingCapital = (statement.balanceSheet.currentAssets || 0) - (statement.balanceSheet.currentLiabilities || 0);
    const workingCapitalRatio = workingCapital / (statement.balanceSheet.totalAssets || 1);
    results.push({
      id: 'working-capital-ratio',
      name: 'نسبة رأس المال العامل',
      category: 'liquidity',
      type: 'ratio', 
      currentValue: workingCapitalRatio,
      rating: this.rateWorkingCapitalRatio(workingCapitalRatio),
      interpretation: `نسبة رأس المال العامل ${workingCapitalRatio.toFixed(3)} تشير إلى ${this.interpretWorkingCapitalRatio(workingCapitalRatio)}`,
      calculation: {
        formula: '(الأصول المتداولة - الالتزامات المتداولة) ÷ إجمالي الأصول',
        variables: {
          'رأس المال العامل': workingCapital,
          'إجمالي الأصول': statement.balanceSheet.totalAssets || 0
        }
      },
      benchmarkComparison: this.getBenchmarkComparison('working-capital-ratio', workingCapitalRatio),
      competitorAnalysis: this.getCompetitorAnalysis('working-capital-ratio', workingCapitalRatio),
      competitivePosition: this.getCompetitivePosition(workingCapitalRatio, 'working-capital-ratio'),
      recommendations: this.getWorkingCapitalRatioRecommendations(workingCapitalRatio),
      status: 'completed'
    });

    return results;
  }

  /************************************************
   * المستوى الثاني: التحليل التطبيقي المتوسط (61 تحليل)
   ************************************************/

  // 4. تحليلات المقارنة المتقدمة (10 تحليل)
  async performAdvancedComparativeAnalysis(statements: FinancialStatement[], companyData: Company): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];

    // 1) التحليل المقارن الصناعي
    results.push(await this.calculateIndustryComparative(statements, companyData));
    
    // 2) التحليل المقارن مع الأقران
    results.push(await this.calculatePeerComparative(statements, companyData));
    
    // 3) التحليل التاريخي المقارن
    results.push(await this.calculateHistoricalComparative(statements));
    
    // 4) تحليل المعايير المرجعية (Benchmarking)
    results.push(await this.calculateBenchmarkingAnalysis(statements, companyData));
    
    // 5) تحليل الفجوات
    results.push(await this.calculateGapAnalysis(statements, companyData));
    
    // 6) تحليل الموقع التنافسي
    results.push(await this.calculateCompetitivePositioning(statements, companyData));
    
    // 7) تحليل الحصة السوقية
    results.push(await this.calculateMarketShareAnalysis(statements, companyData));
    
    // 8) تحليل القدرة التنافسية
    results.push(await this.calculateCompetitiveCapabilityAnalysis(statements, companyData));
    
    // 9) تحليل نقاط القوة والضعف المالية
    results.push(await this.calculateFinancialSWOTAnalysis(statements));
    
    // 10) تحليل الأداء النسبي
    results.push(await this.calculateRelativePerformanceAnalysis(statements, companyData));

    return results;
  }

  /************************************************
   * المستوى الثالث: التحليل المتقدم (65 تحليل)  
   ************************************************/

  // 8. النمذجة والمحاكاة (15 تحليل)
  async performModelingAndSimulation(statements: FinancialStatement[], companyData: Company): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];

    // 1) تحليل السيناريوهات المتقدم
    results.push(await this.calculateAdvancedScenarioAnalysis(statements, companyData));
    
    // 2) تحليل مونت كارلو
    results.push(await this.calculateMonteCarloAnalysis(statements));
    
    // 3) النمذجة المالية المعقدة
    results.push(await this.calculateComplexFinancialModeling(statements));
    
    // 4) تحليل الحساسية متعدد المتغيرات
    results.push(await this.calculateMultiVariateSensitivityAnalysis(statements));
    
    // 5) تحليل شجرة القرار
    results.push(await this.calculateDecisionTreeAnalysis(statements, companyData));
    
    // 6) تحليل الخيارات الحقيقية
    results.push(await this.calculateRealOptionsAnalysis(statements, companyData));
    
    // 7) نماذج التنبؤ المالي
    results.push(await this.calculateFinancialForecastingModels(statements));
    
    // 8) تحليل What-If
    results.push(await this.calculateWhatIfAnalysis(statements));
    
    // 9) المحاكاة العشوائية
    results.push(await this.calculateStochasticSimulation(statements));
    
    // 10) نماذج التحسين
    results.push(await this.calculateOptimizationModels(statements, companyData));
    
    // 11) البرمجة الخطية المالية
    results.push(await this.calculateFinancialLinearProgramming(statements));
    
    // 12) تحليل البرمجة الديناميكية
    results.push(await this.calculateDynamicProgrammingAnalysis(statements));
    
    // 13) نماذج التخصيص الأمثل
    results.push(await this.calculateOptimalAllocationModels(statements));
    
    // 14) تحليل نظرية الألعاب المالية
    results.push(await this.calculateFinancialGameTheoryAnalysis(statements, companyData));
    
    // 15) تحليل الشبكات المالية
    results.push(await this.calculateFinancialNetworkAnalysis(statements, companyData));

    return results;
  }

  // 10. الكشف والتنبؤ الذكي (18 تحليل)
  async performIntelligentDetectionAndPrediction(statements: FinancialStatement[], companyData: Company): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];

    // 1) كشف الاحتيال بالذكاء الاصطناعي
    results.push(await this.calculateAIFraudDetection(statements));
    
    // 2) كشف غسيل الأموال
    results.push(await this.calculateMoneyLaunderingDetection(statements));
    
    // 3) كشف التلاعب في السوق
    results.push(await this.calculateMarketManipulationDetection(statements, companyData));
    
    // 4) التنبؤ بالإفلاس (Z-Score متقدم)
    results.push(await this.calculateAdvancedBankruptcyPrediction(statements));
    
    // 5) التنبؤ بالأزمات المالية
    results.push(await this.calculateFinancialCrisisPrediction(statements));
    
    // 6) كشف الشذوذ في الوقت الفعلي
    results.push(await this.calculateRealTimeAnomalyDetection(statements));
    
    // 7) التنبؤ بتقلبات السوق
    results.push(await this.calculateMarketVolatilityPrediction(statements));
    
    // 8) نماذج الإنذار المبكر
    results.push(await this.calculateEarlyWarningModels(statements));
    
    // 9) تحليل السلوك المالي الذكي
    results.push(await this.calculateIntelligentFinancialBehaviorAnalysis(statements));
    
    // 10) Explainable AI للقرارات المالية
    results.push(await this.calculateExplainableAIFinancialDecisions(statements));
    
    // 11) الشبكات العصبية للتنبؤ المالي
    results.push(await this.calculateNeuralNetworkFinancialPrediction(statements));
    
    // 12) شبكات LSTM للسلاسل الزمنية
    results.push(await this.calculateLSTMTimeSeriesAnalysis(statements));
    
    // 13) Random Forest للتصنيف الائتماني
    results.push(await this.calculateRandomForestCreditClassification(statements));
    
    // 14) Gradient Boosting للتنبؤ
    results.push(await this.calculateGradientBoostingPrediction(statements));
    
    // 15) Clustering للتصنيف المالي
    results.push(await this.calculateClusteringFinancialClassification(statements, companyData));
    
    // 16) Autoencoders للكشف عن الشذوذ
    results.push(await this.calculateAutoencodersAnomalyDetection(statements));
    
    // 17) تحليل المشاعر بالذكاء الاصطناعي
    results.push(await this.calculateAISentimentAnalysis(statements, companyData));
    
    // 18) Blockchain Analytics
    results.push(await this.calculateBlockchainAnalytics(statements, companyData));

    return results;
  }

  // Helper Methods للحسابات المشتركة
  
  private calculatePercentageChange(oldValue: number | undefined, newValue: number | undefined): number {
    const old = oldValue || 0;
    const current = newValue || 0;
    
    if (old === 0) return current > 0 ? 100 : 0;
    return ((current - old) / Math.abs(old)) * 100;
  }

  private rateValue(value: number, thresholds: { excellent: number; good: number; average: number }): 'excellent' | 'good' | 'average' | 'poor' {
    if (value >= thresholds.excellent) return 'excellent';
    if (value >= thresholds.good) return 'good';
    if (value >= thresholds.average) return 'average';
    return 'poor';
  }

  // تقييم النسب المالية
  private rateCurrentRatio(ratio: number): 'excellent' | 'good' | 'average' | 'poor' {
    return this.rateValue(ratio, { excellent: 2.5, good: 1.5, average: 1.0 });
  }

  private rateVerticalAnalysis(income: any, balance: any): 'excellent' | 'good' | 'average' | 'poor' {
    // تقييم بناءً على صحة الهيكل المالي
    if (income.netIncome > 10 && balance.shareholdersEquity > 40) return 'excellent';
    if (income.netIncome > 5 && balance.shareholdersEquity > 30) return 'good';
    if (income.netIncome > 2 && balance.shareholdersEquity > 20) return 'average';
    return 'poor';
  }

  private rateHorizontalAnalysis(income: any, balance: any): 'excellent' | 'good' | 'average' | 'poor' {
    const avgGrowth = (income.revenue + income.netIncome + balance.totalAssets) / 3;
    return this.rateValue(avgGrowth, { excellent: 15, good: 8, average: 3 });
  }

  // تفسير النسب
  private interpretCurrentRatio(ratio: number): string {
    if (ratio >= 2.5) return 'قدرة ممتازة على الوفاء بالالتزامات قصيرة الأجل';
    if (ratio >= 1.5) return 'قدرة جيدة على الوفاء بالالتزامات المتداولة';
    if (ratio >= 1.0) return 'قدرة محدودة على الوفاء بالالتزامات قصيرة الأجل';
    return 'صعوبة في الوفاء بالالتزامات المتداولة';
  }

  // المقارنات المعيارية (ستتم إضافة البيانات الفعلية)
  private getBenchmarkComparison(ratio: string, value: number): any {
    const benchmarks: Record<string, { industry: number; market: number }> = {
      'current-ratio': { industry: 2.0, market: 1.8 },
      'quick-ratio': { industry: 1.2, market: 1.0 },
      'cash-ratio': { industry: 0.2, market: 0.15 }
      // يتم إضافة باقي المعايير
    };

    const benchmark = benchmarks[ratio];
    if (!benchmark) return null;

    return {
      industryAverage: benchmark.industry,
      marketAverage: benchmark.market,
      companyValue: value,
      industryDifference: ((value - benchmark.industry) / benchmark.industry * 100).toFixed(1),
      marketDifference: ((value - benchmark.market) / benchmark.market * 100).toFixed(1),
      position: value > benchmark.industry ? 'أعلى من المتوسط' : 'أقل من المتوسط'
    };
  }

  // تحليل المنافسين (بيانات نموذجية)
  private getCompetitorAnalysis(ratio: string, value: number): any {
    // هذه بيانات نموذجية - يجب ربطها بمصادر بيانات حقيقية
    const competitors = [
      { name: 'منافس أ', value: value * 1.1 },
      { name: 'منافس ب', value: value * 0.9 },
      { name: 'منافس ج', value: value * 1.05 }
    ];

    return {
      competitors,
      ranking: competitors.filter(c => c.value < value).length + 1,
      averageCompetitorValue: competitors.reduce((sum, c) => sum + c.value, 0) / competitors.length
    };
  }

  private getCompetitivePosition(value: number, ratio: string): string {
    const benchmark = this.getBenchmarkComparison(ratio, value);
    if (!benchmark) return 'غير محدد';
    
    const industryDiff = parseFloat(benchmark.industryDifference);
    if (industryDiff > 20) return 'متفوق بشكل كبير';
    if (industryDiff > 10) return 'متفوق';
    if (industryDiff > -10) return 'متوسط';
    if (industryDiff > -20) return 'أقل من المتوسط';
    return 'ضعيف';
  }

  // التوصيات المخصصة
  private getCurrentRatioRecommendations(ratio: number): string[] {
    const recommendations: string[] = [];
    
    if (ratio < 1) {
      recommendations.push('زيادة الأصول المتداولة أو تقليل الالتزامات قصيرة الأجل فوراً');
      recommendations.push('مراجعة سياسات الائتمان وتحسين التحصيل');
    } else if (ratio > 3) {
      recommendations.push('استثمار الأصول الزائدة في فرص نمو مربحة');
      recommendations.push('مراجعة كفاءة استخدام رأس المال العامل');
    }
    
    recommendations.push('مراقبة النسبة شهرياً وربطها بالتدفق النقدي');
    
    return recommendations;
  }

  // إضافة باقي الحسابات المطلوبة للـ 181 تحليل...
  // [المتبقي من التحليلات سيتم إضافته بنفس التفصيل]

}
