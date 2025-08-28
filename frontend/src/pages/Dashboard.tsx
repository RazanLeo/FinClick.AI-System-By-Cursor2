import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  FileText, 
  Settings, 
  Bell,
  Search,
  Filter,
  Download,
  Share2,
  Eye,
  Plus
} from 'lucide-react';
import { Card, Button, Input } from '../components';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [searchQuery, setSearchQuery] = useState('');

  // بيانات تجريبية
  const stats = [
    {
      title: t('dashboard.totalAnalyses'),
      value: '47',
      change: '+12%',
      trend: 'up',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      title: t('dashboard.totalDocuments'),
      value: '23',
      change: '+8%',
      trend: 'up',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: t('dashboard.subscriptionValue'),
      value: '$299',
      change: '+5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: t('dashboard.successRate'),
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const recentAnalyses = [
    {
      id: 1,
      symbol: 'AAPL',
      type: t('analysis.fundamental'),
      status: 'completed',
      date: '2024-01-15',
      score: 85,
      recommendation: 'buy'
    },
    {
      id: 2,
      symbol: 'GOOGL',
      type: t('analysis.technical'),
      status: 'completed',
      date: '2024-01-14',
      score: 72,
      recommendation: 'hold'
    },
    {
      id: 3,
      symbol: 'MSFT',
      type: t('analysis.risk'),
      status: 'processing',
      date: '2024-01-13',
      score: null,
      recommendation: null
    }
  ];

  const quickActions = [
    {
      title: t('dashboard.newAnalysis'),
      description: t('dashboard.newAnalysisDesc'),
      icon: Plus,
      color: 'bg-blue-500',
      action: () => console.log('New Analysis')
    },
    {
      title: t('dashboard.uploadDocument'),
      description: t('dashboard.uploadDocumentDesc'),
      icon: FileText,
      color: 'bg-green-500',
      action: () => console.log('Upload Document')
    },
    {
      title: t('dashboard.viewReports'),
      description: t('dashboard.viewReportsDesc'),
      icon: BarChart3,
      color: 'bg-purple-500',
      action: () => console.log('View Reports')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('dashboard.welcome')}, {user?.username || 'User'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder={t('dashboard.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                fullWidth
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              {t('dashboard.filters')}
            </Button>
            <div className="flex items-center space-x-2">
              {['1W', '1M', '3M', '1Y'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('dashboard.quickActions')}
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${action.color} p-2 rounded-lg`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Analyses */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('dashboard.recentAnalyses')}
                </h3>
                <Button variant="outline" size="sm">
                  {t('dashboard.viewAll')}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t('dashboard.symbol')}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t('dashboard.type')}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t('dashboard.status')}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t('dashboard.score')}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t('dashboard.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAnalyses.map((analysis) => (
                      <tr key={analysis.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {analysis.symbol}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {analysis.type}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            analysis.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {analysis.status === 'completed' ? t('dashboard.completed') : t('dashboard.processing')}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {analysis.score ? (
                            <span className={`font-medium ${
                              analysis.score >= 80 ? 'text-green-600' :
                              analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {analysis.score}/100
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* Market Overview */}
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('dashboard.marketOverview')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {t('dashboard.saudiMarket')}
                </h4>
                <p className="text-2xl font-bold text-green-600">+2.4%</p>
                <p className="text-sm text-gray-500 mt-1">TASI: 12,847</p>
              </div>
              <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {t('dashboard.usMarket')}
                </h4>
                <p className="text-2xl font-bold text-red-600">-0.8%</p>
                <p className="text-sm text-gray-500 mt-1">S&P 500: 4,892</p>
              </div>
              <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {t('dashboard.crypto')}
                </h4>
                <p className="text-2xl font-bold text-green-600">+5.2%</p>
                <p className="text-sm text-gray-500 mt-1">BTC: $43,250</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
