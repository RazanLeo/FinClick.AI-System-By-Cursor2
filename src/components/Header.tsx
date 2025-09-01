'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  User, 
  LogIn, 
  UserPlus,
  Globe,
  ChevronDown,
  Settings,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  language: 'ar' | 'en';
  toggleLanguage: () => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  language, 
  toggleLanguage, 
  showMobileMenu, 
  setShowMobileMenu 
}) => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.pricing'), href: '/pricing' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const userMenuItems = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: <User className="w-4 h-4" /> },
    { name: t('nav.analysis'), href: '/analysis', icon: <Settings className="w-4 h-4" /> },
    { name: t('nav.reports'), href: '/reports', icon: <HelpCircle className="w-4 h-4" /> },
    { name: t('nav.settings'), href: '/settings', icon: <Settings className="w-4 h-4" /> },
    { name: t('nav.logout'), href: '/logout', icon: <LogIn className="w-4 h-4" /> },
  ];

  const contactInfo = [
    { icon: <Phone className="w-4 h-4" />, text: '00966544827213', href: 'tel:00966544827213' },
    { icon: <Mail className="w-4 h-4" />, text: 'finclick.ai@gmail.com', href: 'mailto:finclick.ai@gmail.com' },
    { icon: <MessageCircle className="w-4 h-4" />, text: 'WhatsApp', href: 'https://wa.me/00966544827213' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-md border-b border-finclick-gold/20' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="https://customer-assets.emergentagent.com/job_finmetrics-hub/artifacts/gw8bcd94_%D8%B4%D8%B9%D8%A7%D8%B1%20%D9%86%D8%B8%D8%A7%D9%85%20FinClick.AI%20%D8%A8%D8%AF%D9%88%D9%86%20%D8%A7%D8%B3%D9%85.jpg"
              alt="FinClick.AI Logo"
              className="w-12 h-12 rounded-full shadow-gold-glow"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-finclick-gold font-playfair">
                FinClick.AI
              </h1>
              <p className="text-xs text-finclick-gold/70 font-playfair">
                {language === 'ar' 
                  ? 'نظام التحليل المالي الذكي والثوري'
                  : 'Revolutionary Intelligent Financial Analysis System'
                }
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-finclick-gold hover:text-finclick-gold-light transition-colors font-playfair"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-finclick-gold hover:text-finclick-gold-light transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Language Toggle */}
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-finclick-gold hover:text-finclick-gold-light transition-colors border border-finclick-gold/30 rounded-lg hover:border-finclick-gold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-playfair">
                {language === 'ar' ? 'EN' : 'AR'}
              </span>
            </motion.button>

            {/* Notifications */}
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-finclick-gold hover:text-finclick-gold-light transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-finclick-error rounded-full"></span>
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 text-finclick-gold hover:text-finclick-gold-light transition-colors border border-finclick-gold/30 rounded-lg hover:border-finclick-gold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-playfair hidden sm:block">
                  {t('nav.login')}
                </span>
                <ChevronDown className="w-3 h-3" />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-black border border-finclick-gold/30 rounded-lg shadow-lg z-50"
                  >
                    <div className="p-2">
                      {userMenuItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 text-finclick-gold hover:text-finclick-gold-light hover:bg-finclick-gold/10 rounded transition-colors"
                        >
                          {item.icon}
                          <span className="text-sm font-playfair">{item.name}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-finclick-gold hover:text-finclick-gold-light transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'ابحث في النظام...' : 'Search the system...'}
                  className="w-full px-4 py-3 bg-black/50 border border-finclick-gold/30 rounded-lg text-finclick-gold placeholder-finclick-gold/50 focus:outline-none focus:border-finclick-gold font-playfair"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-finclick-gold/50" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-black/95 border-t border-finclick-gold/20"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Navigation */}
              <nav className="space-y-4 mb-6">
                {navigationItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="block text-finclick-gold hover:text-finclick-gold-light transition-colors font-playfair text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </nav>

              {/* Contact Information */}
              <div className="space-y-3 mb-6">
                <h3 className="text-finclick-gold font-semibold font-playfair">
                  {t('footer.contact')}
                </h3>
                {contactInfo.map((contact, index) => (
                  <motion.a
                    key={contact.text}
                    href={contact.href}
                    className="flex items-center gap-3 text-finclick-gold/80 hover:text-finclick-gold transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (index + 5) * 0.1 }}
                  >
                    {contact.icon}
                    <span className="text-sm font-playfair">{contact.text}</span>
                  </motion.a>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <motion.button
                  className="w-full px-4 py-3 bg-finclick-gold text-black rounded-lg font-semibold font-playfair hover:bg-finclick-gold-light transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('nav.login')}
                </motion.button>
                <motion.button
                  className="w-full px-4 py-3 border border-finclick-gold text-finclick-gold rounded-lg font-semibold font-playfair hover:bg-finclick-gold hover:text-black transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('nav.register')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 bg-black border border-finclick-gold/30 rounded-lg shadow-lg z-50"
          >
            <div className="p-4">
              <h3 className="text-finclick-gold font-semibold mb-3 font-playfair">
                {language === 'ar' ? 'الإشعارات' : 'Notifications'}
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-finclick-gold/10 rounded-lg border-l-4 border-finclick-success">
                  <p className="text-sm text-finclick-gold font-playfair">
                    {language === 'ar' 
                      ? 'تم تحديث النظام بنجاح'
                      : 'System updated successfully'
                    }
                  </p>
                  <p className="text-xs text-finclick-gold/70 mt-1">
                    {language === 'ar' ? 'منذ 5 دقائق' : '5 minutes ago'}
                  </p>
                </div>
                <div className="p-3 bg-finclick-gold/10 rounded-lg border-l-4 border-finclick-info">
                  <p className="text-sm text-finclick-gold font-playfair">
                    {language === 'ar' 
                      ? 'تحليل جديد متاح'
                      : 'New analysis available'
                    }
                  </p>
                  <p className="text-xs text-finclick-gold/70 mt-1">
                    {language === 'ar' ? 'منذ ساعة' : '1 hour ago'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
