import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Settings, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: t('sidebar.dashboard'), path: '/dashboard' },
    { icon: BarChart3, label: t('sidebar.analysis'), path: '/analysis' },
    { icon: TrendingUp, label: t('sidebar.forecasting'), path: '/forecasting' },
    { icon: FileText, label: t('sidebar.reports'), path: '/reports' },
    { icon: Settings, label: t('sidebar.settings'), path: '/settings' },
    { icon: User, label: t('sidebar.profile'), path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            FinClick.AI
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-gold rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.username?.charAt(0) || user.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.username || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-gold text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span>{t('sidebar.logout')}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
