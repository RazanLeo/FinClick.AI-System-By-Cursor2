'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  Award,
  TrendingUp,
  Users,
  CheckCircle,
  Globe,
  Building,
  User,
  Briefcase
} from 'lucide-react';

interface TestimonialsProps {
  language: 'ar' | 'en';
}

const Testimonials: React.FC<TestimonialsProps> = ({ language }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      position: language === 'ar' ? 'مدير مالي' : 'Financial Manager',
      company: language === 'ar' ? 'شركة التقنية المتقدمة' : 'Advanced Tech Corp',
      country: language === 'ar' ? 'الإمارات العربية المتحدة' : 'UAE',
      avatar: '/avatars/ahmed.jpg',
      rating: 5,
      content: language === 'ar' 
        ? 'FinClick.AI غيرت طريقة تحليلنا المالي تماماً. الأدوات المتقدمة والتحليلات الذكية ساعدتنا في اتخاذ قرارات استثمارية أفضل بنسبة 40%. النظام سهل الاستخدام والنتائج دقيقة جداً.'
        : 'FinClick.AI completely transformed our financial analysis approach. The advanced tools and intelligent analytics helped us make 40% better investment decisions. The system is user-friendly and results are highly accurate.',
      features: [
        language === 'ar' ? 'تحليل متقدم للبيانات' : 'Advanced data analysis',
        language === 'ar' ? 'تقارير مفصلة' : 'Detailed reports',
        language === 'ar' ? 'دعم فني ممتاز' : 'Excellent support'
      ]
    },
    {
      id: 2,
      name: language === 'ar' ? 'سارة أحمد' : 'Sarah Ahmed',
      position: language === 'ar' ? 'محللة استثمارات' : 'Investment Analyst',
      company: language === 'ar' ? 'بنك الخليج الاستثماري' : 'Gulf Investment Bank',
      country: language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia',
      avatar: '/avatars/sarah.jpg',
      rating: 5,
      content: language === 'ar' 
        ? 'أستخدم FinClick.AI يومياً في عملي. المحاكاة الإحصائية والتحليل المتقدم ساعدتني في تقديم توصيات استثمارية أكثر دقة لعملائنا. النظام يوفر الوقت والجهد بشكل كبير.'
        : 'I use FinClick.AI daily in my work. The statistical simulations and advanced analysis helped me provide more accurate investment recommendations to our clients. The system saves significant time and effort.',
      features: [
        language === 'ar' ? 'محاكاة إحصائية' : 'Statistical simulations',
        language === 'ar' ? 'تحليل المخاطر' : 'Risk analysis',
        language === 'ar' ? 'توفير الوقت' : 'Time saving'
      ]
    },
    {
      id: 3,
      name: language === 'ar' ? 'محمد علي' : 'Mohammed Ali',
      position: language === 'ar' ? 'مدير محفظة استثمارية' : 'Portfolio Manager',
      company: language === 'ar' ? 'صندوق الاستثمار الخليجي' : 'Gulf Investment Fund',
      country: language === 'ar' ? 'قطر' : 'Qatar',
      avatar: '/avatars/mohammed.jpg',
      rating: 5,
      content: language === 'ar' 
        ? 'FinClick.AI هو أفضل نظام تحليل مالي استخدمته. التحليلات المتقدمة والتنبؤات الذكية ساعدتنا في تحقيق عوائد أعلى بنسبة 25% مقارنة بالعام السابق. أنصح به بشدة.'
        : 'FinClick.AI is the best financial analysis system I\'ve used. The advanced analytics and intelligent predictions helped us achieve 25% higher returns compared to last year. I highly recommend it.',
      features: [
        language === 'ar' ? 'تنبؤات ذكية' : 'Intelligent predictions',
        language === 'ar' ? 'تحليل المحفظة' : 'Portfolio analysis',
        language === 'ar' ? 'عوائد أعلى' : 'Higher returns'
      ]
    },
    {
      id: 4,
      name: language === 'ar' ? 'فاطمة حسن' : 'Fatima Hassan',
      position: language === 'ar' ? 'مديرة تحليل مالي' : 'Financial Analysis Director',
      company: language === 'ar' ? 'مجموعة الأعمال الدولية' : 'International Business Group',
      country: language === 'ar' ? 'الكويت' : 'Kuwait',
      avatar: '/avatars/fatima.jpg',
      rating: 5,
      content: language === 'ar' 
        ? 'النظام ممتاز للشركات الكبيرة والصغيرة. التحليلات الشاملة والتقارير التفصيلية ساعدتنا في تحسين أداء الشركة بشكل كبير. الفريق الداعم متعاون جداً.'
        : 'The system is excellent for both large and small companies. The comprehensive analytics and detailed reports helped us significantly improve company performance. The support team is very cooperative.',
      features: [
        language === 'ar' ? 'تحليلات شاملة' : 'Comprehensive analytics',
        language === 'ar' ? 'تقارير تفصيلية' : 'Detailed reports',
        language === 'ar' ? 'دعم ممتاز' : 'Excellent support'
      ]
    },
    {
      id: 5,
      name: language === 'ar' ? 'علي راشد' : 'Ali Rashid',
      position: language === 'ar' ? 'مستشار مالي' : 'Financial Advisor',
      company: language === 'ar' ? 'شركة الاستشارات المالية' : 'Financial Advisory Co.',
      country: language === 'ar' ? 'عمان' : 'Oman',
      avatar: '/avatars/ali.jpg',
      rating: 5,
      content: language === 'ar' 
        ? 'FinClick.AI يوفر أدوات تحليل متقدمة لا تتوفر في أي نظام آخر. التحليلات الإحصائية والمحاكاة ساعدتني في تقديم استشارات مالية أفضل لعملائي. استثمار ممتاز.'
        : 'FinClick.AI provides advanced analysis tools not available in any other system. The statistical analysis and simulations helped me provide better financial advice to my clients. Excellent investment.',
      features: [
        language === 'ar' ? 'أدوات متقدمة' : 'Advanced tools',
        language === 'ar' ? 'تحليل إحصائي' : 'Statistical analysis',
        language === 'ar' ? 'استشارات أفضل' : 'Better advice'
      ]
    }
  ];

  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: language === 'ar' ? 'مستخدم نشط' : 'Active Users',
      color: 'text-finclick-success'
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: language === 'ar' ? 'معدل الرضا' : 'Satisfaction Rate',
      color: 'text-finclick-warning'
    },
    {
      icon: Award,
      value: '50+',
      label: language === 'ar' ? 'جائزة دولية' : 'International Awards',
      color: 'text-finclick-error'
    },
    {
      icon: Globe,
      value: '25+',
      label: language === 'ar' ? 'دولة' : 'Countries',
      color: 'text-finclick-info'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-finclick-gold/5 via-finclick-gold/10 to-finclick-gold/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-finclick-gold mb-4 font-playfair">
            {language === 'ar' ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say'}
          </h2>
          <p className="text-xl text-finclick-gold/70 max-w-3xl mx-auto font-playfair">
            {language === 'ar' 
              ? 'اكتشف لماذا يثق آلاف المحللين الماليين والمستثمرين في FinClick.AI'
              : 'Discover why thousands of financial analysts and investors trust FinClick.AI'
            }
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 bg-white/80 backdrop-blur-sm border border-finclick-gold/20 rounded-xl"
            >
              <div className={`inline-flex p-3 rounded-lg bg-finclick-gold/10 ${stat.color} mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-finclick-gold font-playfair mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-finclick-gold/70 font-playfair">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-finclick-gold to-finclick-gold-light rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="w-8 h-8 text-finclick-gold/30" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonials[currentTestimonial].rating }, (_, i) => (
                      <Star key={i} className="w-5 h-5 text-finclick-gold fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-lg text-finclick-gold/80 mb-6 font-playfair leading-relaxed">
                    {testimonials[currentTestimonial].content}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {testimonials[currentTestimonial].features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-finclick-gold/10 text-finclick-gold text-sm rounded-full font-playfair"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-finclick-gold font-playfair">
                        {testimonials[currentTestimonial].name}
                      </h4>
                      <p className="text-sm text-finclick-gold/70 font-playfair">
                        {testimonials[currentTestimonial].position}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building className="w-3 h-3 text-finclick-gold/50" />
                        <span className="text-xs text-finclick-gold/60 font-playfair">
                          {testimonials[currentTestimonial].company}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="w-3 h-3 text-finclick-gold/50" />
                        <span className="text-xs text-finclick-gold/60 font-playfair">
                          {testimonials[currentTestimonial].country}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-finclick-gold/10 text-finclick-gold hover:bg-finclick-gold hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-finclick-gold'
                      : 'bg-finclick-gold/30 hover:bg-finclick-gold/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-finclick-gold/10 text-finclick-gold hover:bg-finclick-gold hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <h3 className="text-2xl font-bold text-finclick-gold mb-4 font-playfair">
            {language === 'ar' ? 'انضم إلى آلاف المستخدمين الراضين' : 'Join Thousands of Satisfied Users'}
          </h3>
          <p className="text-lg text-finclick-gold/70 mb-6 font-playfair">
            {language === 'ar' 
              ? 'ابدأ رحلة التحليل المالي المتقدم اليوم'
              : 'Start your advanced financial analysis journey today'
            }
          </p>
          <motion.button
            className="btn btn-primary btn-lg flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="w-5 h-5" />
            {language === 'ar' ? 'ابدأ الآن مجاناً' : 'Start Free Today'}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
