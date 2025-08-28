import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-black border-t border-primary-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-gold rounded-lg flex items-center justify-center">
                <span className="text-primary-black font-bold text-lg">F</span>
              </div>
              <h3 className="text-xl font-bold text-primary-gold">FinClick.AI</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-gold transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-gold">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-gold transition-colors text-sm">
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-gold transition-colors text-sm">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-300 hover:text-primary-gold transition-colors text-sm">
                  {t('footer.features')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-primary-gold transition-colors text-sm">
                  {t('footer.pricing')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-gold transition-colors text-sm">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-gold">{t('footer.services')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/analysis" className="text-gray-300 hover:text-primary-gold transition-colors text-sm">
                  {t('footer.financialAnalysis')}
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-gray-300 hover:text-primary-gold transition-colors text-sm">
                  {t('footer.reports')}
                </Link>
              </li>
              <li>
                <Link to="/forecasting" className="text-gray-300 hover:text-primary-gold transition-colors text-sm">
                  {t('footer.forecasting')}
                </Link>
              </li>
              <li>
                <Link to="/risk-assessment" className="text-gray-300 hover:text-primary-gold transition-colors text-sm">
                  {t('footer.riskAssessment')}
                </Link>
              </li>
              <li>
                <Link to="/portfolio-management" className="text-gray-300 hover:text-primary-gold transition-colors text-sm">
                  {t('footer.portfolioManagement')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-gold">{t('footer.contactInfo')}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary-gold" />
                <span className="text-gray-300 text-sm">info@finclick.ai</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary-gold" />
                <span className="text-gray-300 text-sm">+966 50 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-primary-gold" />
                <span className="text-gray-300 text-sm">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>&copy; {currentYear} FinClick.AI. {t('footer.allRightsReserved')}</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-gold transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-gold transition-colors">
                {t('footer.termsOfService')}
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-primary-gold transition-colors">
                {t('footer.cookiePolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
