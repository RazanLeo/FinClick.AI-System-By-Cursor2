import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Globe, User, LogOut, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="bg-primary-black border-b border-primary-gold sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-gold rounded-lg flex items-center justify-center">
                <span className="text-primary-black font-bold text-xl">F</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary-gold">FinClick.AI</h1>
                <p className="text-xs text-primary-gold opacity-80">نظام التحليل المالي الذكي</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-primary-gold hover:text-opacity-80 transition-colors">
              {t('header.home')}
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-primary-gold hover:text-opacity-80 transition-colors">
                  {t('header.dashboard')}
                </Link>
                <Link to="/analysis" className="text-primary-gold hover:text-opacity-80 transition-colors">
                  {t('header.analysis')}
                </Link>
              </>
            )}
            <Link to="/about" className="text-primary-gold hover:text-opacity-80 transition-colors">
              {t('header.about')}
            </Link>
            <Link to="/features" className="text-primary-gold hover:text-opacity-80 transition-colors">
              {t('header.features')}
            </Link>
            <Link to="/pricing" className="text-primary-gold hover:text-opacity-80 transition-colors">
              {t('header.pricing')}
            </Link>
            <Link to="/contact" className="text-primary-gold hover:text-opacity-80 transition-colors">
              {t('header.contact')}
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 text-primary-gold hover:text-opacity-80 transition-colors"
              title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe size={20} />
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-primary-gold hover:text-opacity-80 transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:block">{user?.username}</span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-primary-black border border-primary-gold rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-primary-gold">
                      <p className="text-sm text-primary-gold">{user?.email}</p>
                      <p className="text-xs text-primary-gold opacity-80">{user?.role}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-primary-gold hover:bg-primary-gold hover:text-primary-black transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t('header.dashboard')}
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-primary-gold hover:bg-primary-gold hover:text-primary-black transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} className="inline mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-primary-gold hover:bg-primary-gold hover:text-primary-black transition-colors"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      {t('header.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-primary-gold hover:text-opacity-80 transition-colors"
                >
                  {t('header.login')}
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  {t('header.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-primary-gold hover:text-opacity-80 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-primary-gold py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-primary-gold hover:text-opacity-80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.home')}
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-primary-gold hover:text-opacity-80 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.dashboard')}
                  </Link>
                  <Link
                    to="/analysis"
                    className="text-primary-gold hover:text-opacity-80 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.analysis')}
                  </Link>
                </>
              )}
              <Link
                to="/about"
                className="text-primary-gold hover:text-opacity-80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.about')}
              </Link>
              <Link
                to="/features"
                className="text-primary-gold hover:text-opacity-80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.features')}
              </Link>
              <Link
                to="/pricing"
                className="text-primary-gold hover:text-opacity-80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.pricing')}
              </Link>
              <Link
                to="/contact"
                className="text-primary-gold hover:text-opacity-80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.contact')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
