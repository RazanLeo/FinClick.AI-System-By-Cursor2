import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  BarChart3, 
  FileText, 
  CreditCard, 
  Settings, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Download,
  Upload,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  Save
} from 'lucide-react';
import { Card, Button, Input, Alert } from '../components';

const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // بيانات تجريبية للمشرف
  const stats = [
    {
      title: t('admin.totalUsers'),
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: t('admin.totalAnalyses'),
      value: '8,943',
      change: '+23%',
      trend: 'up',
      icon: BarChart3,
      color: 'bg-green-500'
    },
    {
      title: t('admin.totalDocuments'),
      value: '3,456',
      change: '+8%',
      trend: 'up',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: t('admin.totalRevenue'),
      value: '$45,678',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-yellow-500'
    }
  ];

  // المستخدمون
  const users = [
    {
      id: 1,
      username: 'ahmed_user',
      email: 'ahmed@example.com',
      firstName: 'أحمد',
      lastName: 'محمد',
      status: 'active',
      subscription: 'pro',
      lastLogin: '2024-01-15',
      analyses: 23,
      documents: 12
    },
    {
      id: 2,
      username: 'sara_investor',
      email: 'sara@example.com',
      firstName: 'سارة',
      lastName: 'أحمد',
      status: 'active',
      subscription: 'enterprise',
      lastLogin: '2024-01-14',
      analyses: 45,
      documents: 28
    },
    {
      id: 3,
      username: 'mohammed_trader',
      email: 'mohammed@example.com',
      firstName: 'محمد',
      lastName: 'علي',
      status: 'suspended',
      subscription: 'basic',
      lastLogin: '2024-01-10',
      analyses: 8,
      documents: 3
    }
  ];

  // التحليلات
  const analyses = [
    {
      id: 1,
      userId: 'ahmed_user',
      symbol: 'AAPL',
      type: 'fundamental',
      status: 'completed',
      createdAt: '2024-01-15',
      processingTime: '45s',
      score: 85
    },
    {
      id: 2,
      userId: 'sara_investor',
      symbol: 'GOOGL',
      type: 'technical',
      status: 'completed',
      createdAt: '2024-01-14',
      processingTime: '32s',
      score: 78
    },
    {
      id: 3,
      userId: 'mohammed_trader',
      symbol: 'MSFT',
      type: 'risk',
      status: 'failed',
      createdAt: '2024-01-13',
      processingTime: '0s',
      score: null
    }
  ];

  // المستندات
  const documents = [
    {
      id: 1,
      userId: 'ahmed_user',
      name: 'Financial_Report_2024.pdf',
      type: 'pdf',
      size: '2.4 MB',
      status: 'processed',
      uploadedAt: '2024-01-15'
    },
    {
      id: 2,
      userId: 'sara_investor',
      name: 'Balance_Sheet.xlsx',
      type: 'excel',
      size: '1.8 MB',
      status: 'processing',
      uploadedAt: '2024-01-14'
    },
    {
      id: 3,
      userId: 'mohammed_trader',
      name: 'Company_Profile.docx',
      type: 'word',
      size: '3.2 MB',
      status: 'processed',
      uploadedAt: '2024-01-13'
    }
  ];

  // معالجة تغيير الحالة
  const handleStatusChange = (userId: number, newStatus: string) => {
    console.log(`Changing user ${userId} status to ${newStatus}`);
  };

  // معالجة حذف المستخدم
  const handleDeleteUser = (userId: number) => {
    if (confirm(t('admin.confirmDeleteUser'))) {
      console.log(`Deleting user ${userId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('admin.pageTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('admin.pageSubtitle')}
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
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

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', name: t('admin.dashboard'), icon: BarChart3 },
                { id: 'users', name: t('admin.users'), icon: Users },
                { id: 'analyses', name: t('admin.analyses'), icon: BarChart3 },
                { id: 'documents', name: t('admin.documents'), icon: FileText },
                { id: 'subscriptions', name: t('admin.subscriptions'), icon: CreditCard },
                { id: 'settings', name: t('admin.settings'), icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('admin.recentActivity')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('admin.newUserRegistered')}: sara_investor
                  </span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('admin.analysisCompleted')}: AAPL Fundamental Analysis
                  </span>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('admin.subscriptionUpgraded')}: ahmed_user → Pro Plan
                  </span>
                  <span className="text-xs text-gray-500">3 hours ago</span>
                </div>
              </div>
            </Card>

            {/* System Health */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('admin.systemHealth')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    {t('admin.database')}
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-200">Healthy</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    {t('admin.aiEngine')}
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-200">Online</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                    {t('admin.storage')}
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">75% Full</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('admin.users')} ({users.length})
              </h3>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder={t('admin.searchUsers')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                  className="w-64"
                />
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('admin.filters')}
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('admin.addUser')}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.user')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.status')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.subscription')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.lastLogin')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            @{user.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {user.status === 'active' ? t('admin.active') : t('admin.suspended')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.subscription}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {user.lastLogin}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'analyses' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('admin.analyses')} ({analyses.length})
              </h3>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder={t('admin.searchAnalyses')}
                  icon={Search}
                  className="w-64"
                />
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('admin.filters')}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.user')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.symbol')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.type')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.status')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.score')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.map((analysis) => (
                    <tr key={analysis.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {analysis.userId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {analysis.symbol}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {analysis.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          analysis.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : analysis.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {analysis.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {analysis.score ? (
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {analysis.score}/100
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('admin.documents')} ({documents.length})
              </h3>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder={t('admin.searchDocuments')}
                  icon={Search}
                  className="w-64"
                />
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('admin.filters')}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.user')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.document')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.type')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.status')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('admin.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((document) => (
                    <tr key={document.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {document.userId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {document.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {document.size} • {document.uploadedAt}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {document.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          document.status === 'processed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {document.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'subscriptions' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('admin.subscriptions')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                  847
                </h4>
                <p className="text-blue-700 dark:text-blue-200">{t('admin.freeUsers')}</p>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                  234
                </h4>
                <p className="text-green-700 dark:text-green-200">{t('admin.paidUsers')}</p>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                  $12,450
                </h4>
                <p className="text-purple-700 dark:text-purple-200">{t('admin.monthlyRevenue')}</p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('admin.systemSettings')}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  {t('admin.generalSettings')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('admin.siteName')}
                    </label>
                    <Input value="FinClick.AI" fullWidth />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('admin.defaultLanguage')}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  {t('admin.securitySettings')}
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('admin.enableTwoFactor')}
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('admin.requireStrongPasswords')}
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('admin.enableRateLimiting')}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  {t('admin.saveSettings')}
                </Button>
                <Button variant="outline">
                  {t('admin.resetToDefault')}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
