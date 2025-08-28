import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  Award,
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react';
import { Button, Card } from '../components';

const HomePage: React.FC = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: TrendingUp,
      title: t('home.features.analysis.title'),
      description: t('home.features.analysis.description'),
    },
    {
      icon: BarChart3,
      title: t('home.features.reports.title'),
      description: t('home.features.reports.description'),
    },
    {
      icon: Shield,
      title: t('home.features.security.title'),
      description: t('home.features.security.description'),
    },
    {
      icon: Zap,
      title: t('home.features.speed.title'),
      description: t('home.features.speed.description'),
    },
  ];

  const stats = [
    { label: t('home.stats.users'), value: '10K+', icon: Users },
    { label: t('home.stats.accuracy'), value: '99.9%', icon: Award },
    { label: t('home.stats.savings'), value: '$2M+', icon: TrendingUp },
  ];

  const testimonials = [
    {
      name: 'أحمد محمد',
      role: 'مدير مالي',
      company: 'شركة التقنية المتقدمة',
      content: 'FinClick.AI غيرت طريقة تحليلنا المالي تماماً. الدقة والسرعة مذهلة!',
      rating: 5,
    },
    {
      name: 'سارة أحمد',
      role: 'محللة مالية',
      company: 'بنك المستقبل',
      content: 'أفضل أداة تحليل مالي استخدمتها. التقارير مفصلة وسهلة الفهم.',
      rating: 5,
    },
    {
      name: 'محمد علي',
      role: 'مستشار مالي',
      company: 'مجموعة الاستثمار الذكية',
      content: 'FinClick.AI يوفر رؤى مالية قيمة تساعد في اتخاذ قرارات أفضل.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary-black text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-black to-gray-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-gold mb-8 max-w-3xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-4">
              <Link to="/register">
                {t('home.hero.getStarted')}
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <Play size={20} className="mr-2" />
              {t('home.hero.watchDemo')}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-gold rounded-full mb-4">
                    <Icon size={32} className="text-primary-black" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-gold rounded-full mb-4">
                    <Icon size={32} className="text-primary-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-gold rounded-full mb-4 text-2xl font-bold text-primary-black">
                  {step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t(`home.howItWorks.step${step}.title`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t(`home.howItWorks.step${step}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <CheckCircle key={i} size={20} className="text-primary-gold" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role} - {testimonial.company}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-primary-gold mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-4">
              <Link to="/register">
                {t('home.cta.getStarted')}
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <Link to="/contact">
                {t('home.cta.contactUs')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
