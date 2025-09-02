'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BarChart3,
  DollarSign,
  Settings,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Crown,
  User,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  Database,
  Cpu,
  HardDrive,
  Network,
  Server,
  Cloud,
  Lock,
  Unlock,
  Key,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Folder,
  File,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderClock,
  FolderStar,
  FolderHeart,
  FolderUser,
  FolderSettings,
  FolderSearch,
  FolderDownload,
  FolderUpload,
  FolderRefresh,
  FolderEdit,
  FolderTrash,
  FolderCopy,
  FolderMove,
  FolderShare,
  FolderLink,
  FolderExternal,
  FolderHome,
  FolderUp,
  FolderDown,
  FolderLeft,
  FolderRight,
  FolderMinus2,
  FolderPlus2,
  FolderX2,
  FolderCheck2,
  FolderClock2,
  FolderStar2,
  FolderHeart2,
  FolderUser2,
  FolderSettings2,
  FolderSearch2,
  FolderDownload2,
  FolderUpload2,
  FolderRefresh2,
  FolderEdit2,
  FolderTrash2,
  FolderCopy2,
  FolderMove2,
  FolderShare2,
  FolderLink2,
  FolderExternal2,
  FolderHome2,
  FolderUp2,
  FolderDown2,
  FolderLeft2,
  FolderRight2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'admin' | 'subscriber' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  subscriptionType: 'monthly' | 'yearly' | 'guest';
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  lastLogin: string;
  createdAt: string;
  totalAnalyses: number;
  totalReports: number;
  totalSpent: number;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalAnalyses: number;
  totalRevenue: number;
  monthlyRevenue: number;
  systemUptime: number;
  averageResponseTime: number;
  errorRate: number;
}

export default function AdminDashboard() {
  const { language, toggleLanguage } = useLanguage();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 15420,
    activeUsers: 12890,
    totalAnalyses: 125000,
    totalRevenue: 2500000,
    monthlyRevenue: 125000,
    systemUptime: 99.9,
    averageResponseTime: 1.2,
    errorRate: 0.1
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      type: 'subscriber',
      status: 'active',
      subscriptionType: 'monthly',
      subscriptionStatus: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2023-06-15T08:00:00Z',
      totalAnalyses: 45,
      totalReports: 12,
      totalSpent: 15000
    },
    {
      id: '2',
      name: 'فاطمة أحمد',
      email: 'fatima@example.com',
      type: 'subscriber',
      status: 'active',
      subscriptionType: 'yearly',
      subscriptionStatus: 'active',
      lastLogin: '2024-01-14T15:45:00Z',
      createdAt: '2023-08-20T12:00:00Z',
      totalAnalyses: 78,
      totalReports: 25,
      totalSpent: 54000
    },
    {
      id: '3',
      name: 'محمد علي',
      email: 'mohammed@example.com',
      type: 'guest',
      status: 'active',
      subscriptionType: 'guest',
      subscriptionStatus: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-10T14:30:00Z',
      totalAnalyses: 5,
      totalReports: 0,
      totalSpent: 0
    },
    {
      id: '4',
      name: 'نورا السعيد',
      email: 'nora@example.com',
      type: 'subscriber',
      status: 'inactive',
      subscriptionType: 'monthly',
      subscriptionStatus: 'expired',
      lastLogin: '2023-12-20T16:20:00Z',
      createdAt: '2023-05-10T10:00:00Z',
      totalAnalyses: 23,
      totalReports: 8,
      totalSpent: 10000
    }
  ]);

  const tabs = [
    { id: 'overview', name: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: BarChart3 },
    { id: 'users', name: language === 'ar' ? 'المستخدمين' : 'Users', icon: Users },
    { id: 'analytics', name: language === 'ar' ? 'التحليلات' : 'Analytics', icon: TrendingUp },
    { id: 'revenue', name: language === 'ar' ? 'الإيرادات' : 'Revenue', icon: DollarSign },
    { id: 'system', name: language === 'ar' ? 'النظام' : 'System', icon: Settings }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-finclick-success';
      case 'inactive': return 'text-finclick-warning';
      case 'suspended': return 'text-finclick-error';
      default: return 'text-finclick-gold';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'text-finclick-error';
      case 'subscriber': return 'text-finclick-success';
      case 'guest': return 'text-finclick-warning';
      default: return 'text-finclick-gold';
    }
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action: ${action} for user: ${userId}`);
    // Implement user actions here
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for users:`, selectedUsers);
    // Implement bulk actions here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-finclick-gold/5 via-finclick-gold/10 to-finclick-gold/5">
      <Header
        language={language}
        toggleLanguage={toggleLanguage}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-finclick-gold mb-2 font-playfair">
                  {language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
                </h1>
                <p className="text-finclick-gold/70 font-playfair">
                  {language === 'ar'
                    ? 'إدارة النظام والمستخدمين والإحصائيات'
                    : 'System, users, and statistics management'
                  }
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="btn btn-outline btn-lg flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  {language === 'ar' ? 'تصدير البيانات' : 'Export Data'}
                </button>
                <button className="btn btn-primary btn-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {language === 'ar' ? 'إعدادات النظام' : 'System Settings'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-finclick-gold text-black'
                      : 'bg-white/80 backdrop-blur-sm border border-finclick-gold/20 text-finclick-gold hover:border-finclick-gold'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-finclick-success/10 text-finclick-success">
                      <Users className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-finclick-success" />
                  </div>
                  <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                    {systemStats.totalUsers.toLocaleString()}
                  </h3>
                  <p className="text-sm text-finclick-gold/70 font-playfair">
                    {language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-finclick-warning/10 text-finclick-warning">
                      <Activity className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-finclick-warning" />
                  </div>
                  <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                    {systemStats.totalAnalyses.toLocaleString()}
                  </h3>
                  <p className="text-sm text-finclick-gold/70 font-playfair">
                    {language === 'ar' ? 'إجمالي التحليلات' : 'Total Analyses'}
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-finclick-error/10 text-finclick-error">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-finclick-error" />
                  </div>
                  <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                    ${(systemStats.totalRevenue / 1000000).toFixed(1)}M
                  </h3>
                  <p className="text-sm text-finclick-gold/70 font-playfair">
                    {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-finclick-info/10 text-finclick-info">
                      <Server className="w-6 h-6" />
                    </div>
                    <CheckCircle className="w-5 h-5 text-finclick-success" />
                  </div>
                  <h3 className="text-2xl font-bold text-finclick-gold font-playfair">
                    {systemStats.systemUptime}%
                  </h3>
                  <p className="text-sm text-finclick-gold/70 font-playfair">
                    {language === 'ar' ? 'وقت التشغيل' : 'Uptime'}
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-finclick-gold mb-6 font-playfair">
                  {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                </h3>
                <div className="space-y-4">
                  {[
                    { action: 'New user registered', user: 'أحمد محمد', time: '2 minutes ago' },
                    { action: 'Analysis completed', user: 'فاطمة أحمد', time: '5 minutes ago' },
                    { action: 'Report generated', user: 'محمد علي', time: '10 minutes ago' },
                    { action: 'Payment received', user: 'نورا السعيد', time: '15 minutes ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-finclick-gold/5 rounded-lg">
                      <div className="p-2 rounded-lg bg-finclick-gold/10">
                        <Activity className="w-4 h-4 text-finclick-gold" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-finclick-gold font-playfair">
                          {activity.action} - {activity.user}
                        </p>
                        <p className="text-xs text-finclick-gold/70 font-playfair">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Search and Actions */}
              <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-finclick-gold/50" />
                      <input
                        type="text"
                        placeholder={language === 'ar' ? 'البحث في المستخدمين...' : 'Search users...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-finclick-gold/30 rounded-lg bg-white/50 text-finclick-gold font-playfair focus:border-finclick-gold focus:outline-none"
                      />
                    </div>
                    <button className="btn btn-outline flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      {language === 'ar' ? 'تصفية' : 'Filter'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBulkAction('activate')}
                      className="btn btn-success btn-sm flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      {language === 'ar' ? 'تفعيل' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleBulkAction('suspend')}
                      className="btn btn-warning btn-sm flex items-center gap-2"
                    >
                      <UserX className="w-4 h-4" />
                      {language === 'ar' ? 'تعليق' : 'Suspend'}
                    </button>
                    <button className="btn btn-primary btn-sm flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      {language === 'ar' ? 'مستخدم جديد' : 'New User'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-finclick-gold/10">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            className="rounded border-finclick-gold/30"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(filteredUsers.map(u => u.id));
                              } else {
                                setSelectedUsers([]);
                              }
                            }}
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-finclick-gold font-playfair">
                          {language === 'ar' ? 'المستخدم' : 'User'}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-finclick-gold font-playfair">
                          {language === 'ar' ? 'النوع' : 'Type'}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-finclick-gold font-playfair">
                          {language === 'ar' ? 'الحالة' : 'Status'}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-finclick-gold font-playfair">
                          {language === 'ar' ? 'التحليلات' : 'Analyses'}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-finclick-gold font-playfair">
                          {language === 'ar' ? 'الإيرادات' : 'Revenue'}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-finclick-gold font-playfair">
                          {language === 'ar' ? 'آخر دخول' : 'Last Login'}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-finclick-gold font-playfair">
                          {language === 'ar' ? 'الإجراءات' : 'Actions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-finclick-gold/10">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-finclick-gold/5">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              className="rounded border-finclick-gold/30"
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers([...selectedUsers, user.id]);
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                }
                              }}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-finclick-gold font-playfair">{user.name}</p>
                              <p className="text-sm text-finclick-gold/70 font-playfair">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(user.type)}`}>
                              {language === 'ar' 
                                ? (user.type === 'admin' ? 'مدير' : user.type === 'subscriber' ? 'مشترك' : 'ضيف')
                                : user.type
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {language === 'ar' 
                                ? (user.status === 'active' ? 'نشط' : user.status === 'inactive' ? 'غير نشط' : 'معلق')
                                : user.status
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4 text-finclick-gold font-playfair">
                            {user.totalAnalyses}
                          </td>
                          <td className="px-6 py-4 text-finclick-gold font-playfair">
                            ${user.totalSpent.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-finclick-gold/70 font-playfair">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUserAction(user.id, 'view')}
                                className="p-1 rounded hover:bg-finclick-gold/10 transition-all duration-300"
                              >
                                <Eye className="w-4 h-4 text-finclick-gold" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'edit')}
                                className="p-1 rounded hover:bg-finclick-gold/10 transition-all duration-300"
                              >
                                <Edit className="w-4 h-4 text-finclick-gold" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="p-1 rounded hover:bg-finclick-gold/10 transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4 text-finclick-error" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <BarChart3 className="w-16 h-16 text-finclick-gold/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-finclick-gold font-playfair">
                {language === 'ar' ? 'التحليلات المتقدمة' : 'Advanced Analytics'}
              </h3>
              <p className="text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'قريباً...' : 'Coming soon...'}
              </p>
            </motion.div>
          )}

          {activeTab === 'revenue' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <DollarSign className="w-16 h-16 text-finclick-gold/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-finclick-gold font-playfair">
                {language === 'ar' ? 'إدارة الإيرادات' : 'Revenue Management'}
              </h3>
              <p className="text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'قريباً...' : 'Coming soon...'}
              </p>
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Settings className="w-16 h-16 text-finclick-gold/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-finclick-gold font-playfair">
                {language === 'ar' ? 'إعدادات النظام' : 'System Settings'}
              </h3>
              <p className="text-finclick-gold/70 font-playfair">
                {language === 'ar' ? 'قريباً...' : 'Coming soon...'}
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
