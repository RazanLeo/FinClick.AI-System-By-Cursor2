import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Play, 
  Download, 
  Share2, 
  Eye, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Building2, 
  Globe,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Card, Button, Input, Alert } from '../components';

const AnalysisPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // فئات التحليل
  const categories = [
    { id: 'all', name: t('analysis.allCategories'), icon: BarChart3, count: 170 },
    { id: 'fundamental', name: t('analysis.fundamental'), icon: Building2, count: 35 },
    { id: 'technical', name: t('analysis.technical'), icon: TrendingUp, count: 42 },
    { id: 'risk', name: t('analysis.risk'), icon: AlertTriangle, count: 28 },
    { id: 'sector', name: t('analysis.sector'), icon: Building2, count: 25 },
    { id: 'macro', name: t('analysis.macro'), icon: Globe, count: 20 }
  ];

  // أنواع التحليل المتاحة
  const analysisTypes = {
    fundamental: [
      { id: 'fundamental_overview', name: t('analysis.fundamentalOverview'), description: t('analysis.fundamentalOverviewDesc'), complexity: 'medium', time: '30s' },
      { id: 'valuation_analysis', name: t('analysis.valuationAnalysis'), description: t('analysis.valuationAnalysisDesc'), complexity: 'high', time: '45s' },
      { id: 'financial_health', name: t('analysis.financialHealth'), description: t('analysis.financialHealthDesc'), complexity: 'medium', time: '35s' },
      { id: 'profitability_analysis', name: t('analysis.profitabilityAnalysis'), description: t('analysis.profitabilityAnalysisDesc'), complexity: 'medium', time: '30s' },
      { id: 'growth_analysis', name: t('analysis.growthAnalysis'), description: t('analysis.growthAnalysisDesc'), complexity: 'medium', time: '35s' },
      { id: 'cash_flow_analysis', name: t('analysis.cashFlowAnalysis'), description: t('analysis.cashFlowAnalysisDesc'), complexity: 'high', time: '40s' },
      { id: 'debt_analysis', name: t('analysis.debtAnalysis'), description: t('analysis.debtAnalysisDesc'), complexity: 'medium', time: '30s' },
      { id: 'efficiency_analysis', name: t('analysis.efficiencyAnalysis'), description: t('analysis.efficiencyAnalysisDesc'), complexity: 'medium', time: '35s' }
    ],
    technical: [
      { id: 'technical_overview', name: t('analysis.technicalOverview'), description: t('analysis.technicalOverviewDesc'), complexity: 'medium', time: '25s' },
      { id: 'trend_analysis', name: t('analysis.trendAnalysis'), description: t('analysis.trendAnalysisDesc'), complexity: 'medium', time: '30s' },
      { id: 'momentum_analysis', name: t('analysis.momentumAnalysis'), description: t('analysis.momentumAnalysisDesc'), complexity: 'medium', time: '25s' },
      { id: 'support_resistance', name: t('analysis.supportResistance'), description: t('analysis.supportResistanceDesc'), complexity: 'high', time: '40s' },
      { id: 'volume_analysis', name: t('analysis.volumeAnalysis'), description: t('analysis.volumeAnalysisDesc'), complexity: 'medium', time: '25s' },
      { id: 'pattern_recognition', name: t('analysis.patternRecognition'), description: t('analysis.patternRecognitionDesc'), complexity: 'high', time: '45s' },
      { id: 'oscillator_analysis', name: t('analysis.oscillatorAnalysis'), description: t('analysis.oscillatorAnalysisDesc'), complexity: 'medium', time: '30s' },
      { id: 'moving_average_analysis', name: t('analysis.movingAverageAnalysis'), description: t('analysis.movingAverageAnalysisDesc'), complexity: 'medium', time: '25s' }
    ],
    risk: [
      { id: 'risk_assessment', name: t('analysis.riskAssessment'), description: t('analysis.riskAssessmentDesc'), complexity: 'high', time: '45s' },
      { id: 'volatility_analysis', name: t('analysis.volatilityAnalysis'), description: t('analysis.volatilityAnalysisDesc'), complexity: 'medium', time: '30s' },
      { id: 'correlation_analysis', name: t('analysis.correlationAnalysis'), description: t('analysis.correlationAnalysisDesc'), complexity: 'high', time: '40s' },
      { id: 'drawdown_analysis', name: t('analysis.drawdownAnalysis'), description: t('analysis.drawdownAnalysisDesc'), complexity: 'medium', time: '35s' },
      { id: 'var_analysis', name: t('analysis.varAnalysis'), description: t('analysis.varAnalysisDesc'), complexity: 'high', time: '50s' },
      { id: 'stress_testing', name: t('analysis.stressTesting'), description: t('analysis.stressTestingDesc'), complexity: 'high', time: '45s' },
      { id: 'scenario_analysis', name: t('analysis.scenarioAnalysis'), description: t('analysis.scenarioAnalysisDesc'), complexity: 'medium', time: '35s' }
    ],
    sector: [
      { id: 'sector_comparison', name: t('analysis.sectorComparison'), description: t('analysis.sectorComparisonDesc'), complexity: 'medium', time: '35s' },
      { id: 'industry_position', name: t('analysis.industryPosition'), description: t('analysis.industryPositionDesc'), complexity: 'medium', time: '30s' },
      { id: 'market_share', name: t('analysis.marketShare'), description: t('analysis.marketShareDesc'), complexity: 'medium', time: '30s' },
      { id: 'sector_trends', name: t('analysis.sectorTrends'), description: t('analysis.sectorTrendsDesc'), complexity: 'medium', time: '35s' },
      { id: 'peer_analysis', name: t('analysis.peerAnalysis'), description: t('analysis.peerAnalysisDesc'), complexity: 'medium', time: '35s' },
      { id: 'competitive_analysis', name: t('analysis.competitiveAnalysis'), description: t('analysis.competitiveAnalysisDesc'), complexity: 'high', time: '40s' }
    ],
    macro: [
      { id: 'macro_impact', name: t('analysis.macroImpact'), description: t('analysis.macroImpactDesc'), complexity: 'high', time: '45s' },
      { id: 'interest_rate_sensitivity', name: t('analysis.interestRateSensitivity'), description: t('analysis.interestRateSensitivityDesc'), complexity: 'high', time: '40s' },
      { id: 'inflation_impact', name: t('analysis.inflationImpact'), description: t('analysis.inflationImpactDesc'), complexity: 'medium', time: '35s' },
      { id: 'currency_risk', name: t('analysis.currencyRisk'), description: t('analysis.currencyRiskDesc'), complexity: 'medium', time: '35s' },
      { id: 'economic_cycle', name: t('analysis.economicCycle'), description: t('analysis.economicCycleDesc'), complexity: 'high', time: '45s' }
    ]
  };

  // الحصول على التحليلات حسب الفئة المحددة
  const getAnalysesByCategory = () => {
    if (selectedCategory === 'all') {
      return Object.values(analysisTypes).flat();
    }
    return analysisTypes[selectedCategory as keyof typeof analysisTypes] || [];
  };

  // تبديل اختيار التحليل
  const toggleAnalysis = (analysisId: string) => {
    setSelectedAnalyses(prev => 
      prev.includes(analysisId) 
        ? prev.filter(id => id !== analysisId)
        : [...prev, analysisId]
    );
  };

  // تشغيل التحليل
  const runAnalysis = async () => {
    if (selectedAnalyses.length === 0) {
      return;
    }

    setIsAnalyzing(true);
    
    // محاكاة التحليل
    setTimeout(() => {
      setAnalysisResults({
        symbol: 'AAPL',
        analyses: selectedAnalyses,
        totalScore: 82,
        riskLevel: 'medium',
        recommendations: [
          'معدل العائد على حقوق الملكية ممتاز (18.5%)',
          'نمو الإيرادات جيد (15.2%)',
          'مستوى الدين منخفض - صحة مالية ممتازة',
          'السعر معقول مقارنة بالأرباح'
        ],
        timestamp: new Date().toISOString()
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  // تصفية التحليلات
  const filteredAnalyses = getAnalysesByCategory().filter(analysis =>
    analysis.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    analysis.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('analysis.pageTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('analysis.pageSubtitle')}
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder={t('analysis.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                fullWidth
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              {t('analysis.filters')}
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-center">
                  <category.icon className={`w-6 h-6 mx-auto mb-2 ${
                    selectedCategory === category.id ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <h3 className={`font-medium text-sm ${
                    selectedCategory === category.id ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                  }`}>
                    {category.name}
                  </h3>
                  <p className={`text-xs ${
                    selectedCategory === category.id ? 'text-blue-700 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {category.count} {t('analysis.types')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Types */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('analysis.availableTypes')} ({filteredAnalyses.length})
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedAnalyses.length} {t('analysis.selected')}
              </span>
              <Button
                onClick={runAnalysis}
                disabled={selectedAnalyses.length === 0 || isAnalyzing}
                className="min-w-[120px]"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    {t('analysis.analyzing')}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {t('analysis.runAnalysis')}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnalyses.map((analysis) => (
              <Card
                key={analysis.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedAnalyses.includes(analysis.id)
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
                onClick={() => toggleAnalysis(analysis.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {analysis.name}
                      </h3>
                      {selectedAnalyses.includes(analysis.id) && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {analysis.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        {analysis.complexity}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {analysis.time}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResults && (
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('analysis.results')} - {analysisResults.symbol}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    {t('analysis.download')}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    {t('analysis.share')}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                    {t('analysis.totalScore')}
                  </h3>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {analysisResults.totalScore}/100
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h3 className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">
                    {t('analysis.riskLevel')}
                  </h3>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                    {analysisResults.riskLevel}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                    {t('analysis.analysesCount')}
                  </h3>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {analysisResults.analyses.length}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('analysis.recommendations')}
                </h3>
                <div className="space-y-2">
                  {analysisResults.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('analysis.lastUpdated')}: {new Date(analysisResults.timestamp).toLocaleString()}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Start Guide */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('analysis.quickStart')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">1</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('analysis.step1Title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('analysis.step1Desc')}
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg">2</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('analysis.step2Title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('analysis.step2Desc')}
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">3</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('analysis.step3Title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('analysis.step3Desc')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
