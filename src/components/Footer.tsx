'use client';

import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  ChevronUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FooterProps {
  language: 'ar' | 'en';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: t('footer.contact'),
      items: [
        { icon: <Phone className="w-4 h-4" />, text: '00966544827213', href: 'tel:00966544827213' },
        { icon: <Mail className="w-4 h-4" />, text: 'finclick.ai@gmail.com', href: 'mailto:finclick.ai@gmail.com' },
        { icon: <MessageCircle className="w-4 h-4" />, text: 'WhatsApp', href: 'https://wa.me/00966544827213' },
        { icon: <MessageCircle className="w-4 h-4" />, text: 'Telegram', href: 'https://t.me/00966544827213' },
      ]
    },
    {
      title: t('footer.legalPolicies'),
      items: [
        { text: t('footer.privacy'), href: '/privacy' },
        { text: t('footer.terms'), href: '/terms' },
        { text: t('footer.security'), href: '/security' },
        { text: t('footer.compliance'), href: '/compliance' },
        { text: t('footer.intellectualProperty'), href: '/intellectual-property' },
        { text: t('footer.payment'), href: '/payment-policy' },
      ]
    },
    {
      title: t('footer.system'),
      items: [
        { text: t('footer.features'), href: '/features' },
        { text: t('footer.analysisTypes'), href: '/analysis-types' },
        { text: t('footer.subscriptions'), href: '/pricing' },
        { text: t('footer.manual'), href: '/manual' },
        { text: t('footer.faq'), href: '/faq' },
      ]
    },
    {
      title: t('footer.company'),
      items: [
        { text: t('footer.vision'), href: '/about' },
        { text: t('footer.events'), href: '/events' },
        { text: t('footer.blog'), href: '/blog' },
        { text: t('footer.media'), href: '/media' },
        { text: t('footer.jobs'), href: '/jobs' },
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'YouTube' },
    { icon: <Github className="w-5 h-5" />, href: '#', label: 'GitHub' },
  ];

  const paymentMethods = [
    'MADA',
    'Visa',
    'Master Card',
    'PayPal',
    'Apple Pay'
  ];

  return (
    <footer className="bg-finclick-gray border-t-2 border-finclick-gold/30 text-finclick-gold">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4 font-playfair border-b border-finclick-gold/30 pb-2">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={item.text}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={item.href}
                      className="flex items-center gap-2 text-finclick-gold/80 hover:text-finclick-gold transition-colors font-playfair text-sm"
                    >
                      {item.icon && item.icon}
                      <span>{item.text}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Company Info and Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8 p-6 bg-black/30 rounded-lg border border-finclick-gold/20"
        >
          <div className="flex items-center gap-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_finmetrics-hub/artifacts/gw8bcd94_%D8%B4%D8%B9%D8%A7%D8%B1%20%D9%86%D8%B8%D8%A7%D9%85%20FinClick.AI%20%D8%A8%D8%AF%D9%88%D9%86%20%D8%A7%D8%B3%D9%85.jpg"
              alt="FinClick.AI Logo"
              className="w-16 h-16 rounded-full shadow-gold-glow"
            />
            <div>
              <h2 className="text-2xl font-bold text-finclick-gold font-playfair">
                FinClick.AI
              </h2>
              <p className="text-finclick-gold/70 font-playfair">
                {language === 'ar' 
                  ? 'نظام التحليل المالي الذكي والثوري'
                  : 'Revolutionary Intelligent Financial Analysis System'
                }
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="text-center lg:text-right">
            <h4 className="text-sm font-semibold mb-3 font-playfair">
              {t('pricing.paymentMethods')}
            </h4>
            <div className="flex flex-wrap justify-center lg:justify-end gap-2">
              {paymentMethods.map((method, index) => (
                <motion.span
                  key={method}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="px-3 py-1 bg-finclick-gold/10 border border-finclick-gold/30 rounded-lg text-xs font-playfair"
                >
                  {method}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6 mb-8"
        >
          <h4 className="text-lg font-semibold font-playfair">
            {language === 'ar' ? 'تابعنا على وسائل التواصل الاجتماعي' : 'Follow us on social media'}
          </h4>
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="p-3 bg-finclick-gold/10 border border-finclick-gold/30 rounded-full text-finclick-gold hover:text-finclick-gold-light hover:bg-finclick-gold/20 transition-all duration-300"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-finclick-gold/20 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-right">
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {t('footer.copyright')}
              </p>
              <p className="text-xs text-finclick-gold/50 font-playfair mt-1">
                {t('footer.madeIn')} 🇸🇦
              </p>
            </div>

            {/* Back to Top Button */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 bg-finclick-gold text-black rounded-lg font-semibold font-playfair hover:bg-finclick-gold-light transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronUp className="w-4 h-4" />
              <span className="text-sm">
                {language === 'ar' ? 'العودة للأعلى' : 'Back to Top'}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Live Chat Support */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <motion.button
          className="p-4 bg-finclick-gold text-black rounded-full shadow-gold-glow hover:shadow-gold-strong transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </footer>
  );
};

export default Footer;
