import React from 'react';
import { Sidebar } from '../components';
import { useLanguage } from '../context/LanguageContext';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Users,
  BarChart3,
  LucideIcon
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  color: string;
}

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();

  const metrics: MetricCard[] = [
    {
      title: t('dashboard.total_revenue'),
      value: '$2,450,000',
      change: 12.5,
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: t('dashboard.total_expenses'),
      value: '$1,230,000',
      change: -8.2,
      changeType: 'decrease',
      icon: TrendingDown,
      color: 'text-red-600',
    },
    {
      title: t('dashboard.net_profit'),
      value: '$1,220,000',
      change: 23.1,
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: t('dashboard.active_users'),
      value: '12,450',
      change: 5.7,
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      description: 'Subscription Payment',
      amount: 299.00,
      type: 'income',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      description: 'Server Hosting',
      amount: -89.99,
      type: 'expense',
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: 3,
      description: 'Marketing Campaign',
      amount: -1500.00,
      type: 'expense',
      date: '2024-01-13',
      status: 'pending'
    },
    {
      id: 4,
      description: 'Consulting Fee',
      amount: 2500.00,
      type: 'income',
      date: '2024-01-12',
      status: 'completed'
    },
    {
      id: 5,
      description: 'Office Supplies',
      amount: -234.50,
      type: 'expense',
      date: '2024-01-11',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {metric.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${metric.color} bg-opacity-10`}>
                      <Icon size={24} className={metric.color} />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <span
                      className={`text-sm font-medium ${
                        metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metric.changeType === 'increase' ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {t('dashboard.from_last_month')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue vs Expenses Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('dashboard.revenue_vs_expenses')}
                </h3>
                <BarChart3 size={20} className="text-gray-400" />
              </div>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <BarChart3 size={48} className="mx-auto mb-2" />
                  <p>{t('dashboard.chart_placeholder')}</p>
                </div>
              </div>
            </div>

            {/* Profit Trend Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('dashboard.profit_trend')}
                </h3>
                <TrendingUp size={20} className="text-gray-400" />
              </div>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <TrendingUp size={48} className="mx-auto mb-2" />
                  <p>{t('dashboard.chart_placeholder')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('dashboard.recent_transactions')}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.description')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.amount')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.date')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.status')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={getTypeColor(transaction.type)}>
                          {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
