'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Palette,
  Download,
  Upload,
  Trash2,
  Edit,
  Save,
  X,
  Check,
  AlertCircle,
  Info,
  Clock,
  Star,
  Users,
  DollarSign,
  PieChart,
  LineChart,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  RefreshCw,
  HelpCircle,
  BookOpen,
  FileText,
  Image,
  ExternalLink,
  Link,
  Mail,
  Phone,
  MapPin,
  Globe as GlobeIcon,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Gitlab,
  Bitbucket,
  Slack,
  Discord,
  Telegram,
  WhatsApp,
  Skype,
  Zoom,
  Teams,
  Google,
  Apple,
  Microsoft,
  Amazon,
  Netflix,
  Spotify,
  Uber,
  Airbnb,
  Tesla,
  SpaceX,
  OpenAI,
  Anthropic,
  GoogleAI,
  Meta,
  AppleAI,
  MicrosoftAI,
  AmazonAI,
  NetflixAI,
  SpotifyAI,
  UberAI,
  AirbnbAI,
  TeslaAI,
  SpaceXAI,
  OpenAIAI,
  AnthropicAI,
  GoogleAIAI,
  MetaAI,
  AppleAIAI,
  MicrosoftAIAI,
  AmazonAIAI,
  NetflixAIAI,
  SpotifyAIAI,
  UberAIAI,
  AirbnbAIAI,
  TeslaAIAI,
  SpaceXAIAI,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Database,
  Cpu,
  Brain,
  Zap,
  Target,
  Crown,
  Play,
  Pause,
  Stop,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Server,
  Cloud,
  HardDrive,
  Memory,
  Cpu as CpuIcon,
  Gpu,
  Network,
  Bluetooth,
  Usb,
  Hdmi,
  Vga,
  Dvi,
  Displayport,
  Audio,
  Video,
  Camera,
  Microphone,
  Speaker,
  Headphones,
  Keyboard,
  Mouse,
  Gamepad,
  Joystick,
  Remote,
  Controller,
  Wheel,
  Pedal,
  Stick,
  Button,
  Switch,
  Toggle,
  Slider,
  Knob,
  Dial,
  Potentiometer,
  Resistor,
  Capacitor,
  Inductor,
  Diode,
  Transistor,
  Ic,
  Chip,
  Circuit,
  Board,
  Pcb,
  Breadboard,
  Wire,
  Cable,
  Connector,
  Jack,
  Plug,
  Socket,
  Adapter,
  Converter,
  Transformer,
  Rectifier,
  Inverter,
  Amplifier,
  Oscillator,
  Filter,
  Mixer,
  Modulator,
  Demodulator,
  Encoder,
  Decoder,
  Multiplexer,
  Demultiplexer,
  FlipFlop,
  Latch,
  Register,
  Counter,
  Timer,
  Clock as ClockIcon,
  Watch,
  Calendar,
  Alarm,
  Stopwatch,
  Timer as TimerIcon,
  Hourglass,
  Sand,
  Water,
  Fire,
  Earth,
  Wind,
  Lightning,
  Thunder,
  Rain,
  Snow,
  Hail,
  Sleet,
  Fog,
  Mist,
  Dew,
  Frost,
  Ice,
  Steam,
  Smoke,
  Dust,
  Ash,
  Lava,
  Magma,
  Rock,
  Stone,
  Crystal,
  Gem,
  Diamond,
  Ruby,
  Emerald,
  Sapphire,
  Pearl,
  Coral,
  Shell,
  Bone,
  Wood,
  Leaf,
  Flower,
  Tree,
  Grass,
  Moss,
  Algae,
  Fungus,
  Mushroom,
  Bacteria,
  Virus,
  Cell,
  Dna,
  Gene,
  Chromosome,
  Protein,
  Enzyme,
  Hormone,
  Vitamin,
  Mineral,
  Salt,
  Sugar,
  Fat,
  Oil,
  Wax,
  Soap,
  Detergent,
  Bleach,
  Acid,
  Base,
  Chemical,
  Compound,
  Element,
  Atom,
  Molecule,
  Ion,
  Electron,
  Proton,
  Neutron,
  Quark,
  Gluon,
  Photon,
  Boson,
  Fermion,
  Lepton,
  Hadron,
  Meson,
  Baryon,
  Nucleon,
  Nucleus,
  Orbital,
  Shell as ShellIcon,
  Subshell,
  Energy,
  Force,
  Power,
  Work,
  Heat,
  Temperature,
  Pressure,
  Volume,
  Mass,
  Weight,
  Density,
  Viscosity,
  Elasticity,
  Plasticity,
  Ductility,
  Malleability,
  Hardness,
  Strength,
  Toughness,
  Brittleness,
  Conductivity,
  Resistivity,
  Capacitance,
  Inductance,
  Impedance,
  Admittance,
  Reactance,
  Susceptance,
  Permeability,
  Permittivity,
  Refractive,
  Absorptive,
  Reflective,
  Transmissive,
  Diffractive,
  Interferometric,
  Polarimetric,
  Spectroscopic,
  Chromatographic,
  Electrophoretic,
  Centrifugal,
  Gravitational,
  Magnetic,
  Electric,
  Nuclear,
  Weak,
  Strong,
  Electromagnetic,
  Quantum,
  Classical,
  Relativistic,
  Nonrelativistic,
  Linear,
  Nonlinear,
  Deterministic,
  Stochastic,
  Chaotic,
  Ordered,
  Disordered,
  Crystalline,
  Amorphous,
  Polycrystalline,
  Single,
  Multiple,
  Binary,
  Ternary,
  Quaternary,
  Quinary,
  Senary,
  Septenary,
  Octonary,
  Nonary,
  Denary,
  Duodecimal,
  Hexadecimal,
  Vigesimal,
  Sexagesimal,
  Centesimal,
  Millesimal,
  Microsimal,
  Nanosimal,
  Picosimal,
  Femtosimal,
  Attosimal,
  Zeptosimal,
  Yoctosimal,
  Ronnasimal,
  Quettasimal,
  Rontosimal,
  Quectosimal
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface SettingSection {
  id: string;
  title: string;
  englishTitle: string;
  icon: any;
  color: string;
  settings: Setting[];
}

interface Setting {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  englishDescription: string;
  type: 'toggle' | 'select' | 'input' | 'textarea' | 'file' | 'color' | 'range';
  value: any;
  options?: { value: string; label: string; englishLabel: string }[];
  min?: number;
  max?: number;
  step?: number;
}

export default function SettingsPage() {
  const { language, toggleLanguage } = useLanguage();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState<{ [key: string]: any }>({
    // Profile Settings
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    company: 'شركة التحليل المالي',
    position: 'محلل مالي',
    bio: 'محلل مالي محترف مع خبرة 10 سنوات في التحليل المالي المتقدم',
    
    // Security Settings
    twoFactorAuth: true,
    emailNotifications: true,
    smsNotifications: false,
    sessionTimeout: 30,
    passwordChangeRequired: false,
    
    // Notification Settings
    analysisComplete: true,
    reportReady: true,
    systemUpdates: false,
    marketingEmails: false,
    pushNotifications: true,
    emailDigest: true,
    
    // Appearance Settings
    theme: 'light',
    language: 'ar',
    fontSize: 16,
    compactMode: false,
    showAnimations: true,
    
    // Data Settings
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '2years',
    exportFormat: 'pdf',
    includeCharts: true,
    
    // API Settings
    apiKey: 'sk-1234567890abcdef',
    webhookUrl: 'https://webhook.site/123456',
    rateLimit: 1000,
    timeout: 30,
    retryAttempts: 3
  });

  const settingSections: SettingSection[] = [
    {
      id: 'profile',
      title: 'الملف الشخصي',
      englishTitle: 'Profile',
      icon: User,
      color: 'text-finclick-success',
      settings: [
        {
          id: 'firstName',
          title: 'الاسم الأول',
          englishTitle: 'First Name',
          description: 'الاسم الأول للمستخدم',
          englishDescription: 'User\'s first name',
          type: 'input',
          value: settings.firstName
        },
        {
          id: 'lastName',
          title: 'اسم العائلة',
          englishTitle: 'Last Name',
          description: 'اسم العائلة للمستخدم',
          englishDescription: 'User\'s last name',
          type: 'input',
          value: settings.lastName
        },
        {
          id: 'email',
          title: 'البريد الإلكتروني',
          englishTitle: 'Email',
          description: 'عنوان البريد الإلكتروني',
          englishDescription: 'Email address',
          type: 'input',
          value: settings.email
        },
        {
          id: 'phone',
          title: 'رقم الهاتف',
          englishTitle: 'Phone Number',
          description: 'رقم الهاتف للتواصل',
          englishDescription: 'Phone number for contact',
          type: 'input',
          value: settings.phone
        },
        {
          id: 'company',
          title: 'الشركة',
          englishTitle: 'Company',
          description: 'اسم الشركة أو المؤسسة',
          englishDescription: 'Company or organization name',
          type: 'input',
          value: settings.company
        },
        {
          id: 'position',
          title: 'المنصب',
          englishTitle: 'Position',
          description: 'المنصب الوظيفي',
          englishDescription: 'Job position',
          type: 'input',
          value: settings.position
        },
        {
          id: 'bio',
          title: 'السيرة الذاتية',
          englishTitle: 'Bio',
          description: 'نبذة مختصرة عن المستخدم',
          englishDescription: 'Brief user biography',
          type: 'textarea',
          value: settings.bio
        }
      ]
    },
    {
      id: 'security',
      title: 'الأمان',
      englishTitle: 'Security',
      icon: Shield,
      color: 'text-finclick-warning',
      settings: [
        {
          id: 'twoFactorAuth',
          title: 'المصادقة الثنائية',
          englishTitle: 'Two-Factor Authentication',
          description: 'تفعيل المصادقة الثنائية لحسابك',
          englishDescription: 'Enable two-factor authentication for your account',
          type: 'toggle',
          value: settings.twoFactorAuth
        },
        {
          id: 'emailNotifications',
          title: 'إشعارات البريد الإلكتروني',
          englishTitle: 'Email Notifications',
          description: 'استلام إشعارات عبر البريد الإلكتروني',
          englishDescription: 'Receive notifications via email',
          type: 'toggle',
          value: settings.emailNotifications
        },
        {
          id: 'smsNotifications',
          title: 'إشعارات الرسائل النصية',
          englishTitle: 'SMS Notifications',
          description: 'استلام إشعارات عبر الرسائل النصية',
          englishDescription: 'Receive notifications via SMS',
          type: 'toggle',
          value: settings.smsNotifications
        },
        {
          id: 'sessionTimeout',
          title: 'مهلة الجلسة',
          englishTitle: 'Session Timeout',
          description: 'الوقت قبل انتهاء صلاحية الجلسة (دقائق)',
          englishDescription: 'Time before session expires (minutes)',
          type: 'range',
          value: settings.sessionTimeout,
          min: 5,
          max: 120,
          step: 5
        },
        {
          id: 'passwordChangeRequired',
          title: 'تغيير كلمة المرور مطلوب',
          englishTitle: 'Password Change Required',
          description: 'إجبار تغيير كلمة المرور عند تسجيل الدخول',
          englishDescription: 'Force password change on login',
          type: 'toggle',
          value: settings.passwordChangeRequired
        }
      ]
    },
    {
      id: 'notifications',
      title: 'الإشعارات',
      englishTitle: 'Notifications',
      icon: Bell,
      color: 'text-finclick-error',
      settings: [
        {
          id: 'analysisComplete',
          title: 'اكتمال التحليل',
          englishTitle: 'Analysis Complete',
          description: 'إشعار عند اكتمال التحليل المالي',
          englishDescription: 'Notification when financial analysis is complete',
          type: 'toggle',
          value: settings.analysisComplete
        },
        {
          id: 'reportReady',
          title: 'التقرير جاهز',
          englishTitle: 'Report Ready',
          description: 'إشعار عند جاهزية التقرير',
          englishDescription: 'Notification when report is ready',
          type: 'toggle',
          value: settings.reportReady
        },
        {
          id: 'systemUpdates',
          title: 'تحديثات النظام',
          englishTitle: 'System Updates',
          description: 'إشعارات تحديثات النظام',
          englishDescription: 'System update notifications',
          type: 'toggle',
          value: settings.systemUpdates
        },
        {
          id: 'marketingEmails',
          title: 'رسائل التسويق',
          englishTitle: 'Marketing Emails',
          description: 'استلام رسائل التسويق',
          englishDescription: 'Receive marketing emails',
          type: 'toggle',
          value: settings.marketingEmails
        },
        {
          id: 'pushNotifications',
          title: 'الإشعارات الفورية',
          englishTitle: 'Push Notifications',
          description: 'الإشعارات الفورية في المتصفح',
          englishDescription: 'Push notifications in browser',
          type: 'toggle',
          value: settings.pushNotifications
        },
        {
          id: 'emailDigest',
          title: 'ملخص البريد الإلكتروني',
          englishTitle: 'Email Digest',
          description: 'ملخص يومي عبر البريد الإلكتروني',
          englishDescription: 'Daily email digest',
          type: 'toggle',
          value: settings.emailDigest
        }
      ]
    },
    {
      id: 'appearance',
      title: 'المظهر',
      englishTitle: 'Appearance',
      icon: Palette,
      color: 'text-finclick-info',
      settings: [
        {
          id: 'theme',
          title: 'المظهر',
          englishTitle: 'Theme',
          description: 'اختر مظهر التطبيق',
          englishDescription: 'Choose application theme',
          type: 'select',
          value: settings.theme,
          options: [
            { value: 'light', label: 'فاتح', englishLabel: 'Light' },
            { value: 'dark', label: 'داكن', englishLabel: 'Dark' },
            { value: 'auto', label: 'تلقائي', englishLabel: 'Auto' }
          ]
        },
        {
          id: 'language',
          title: 'اللغة',
          englishTitle: 'Language',
          description: 'اختر لغة التطبيق',
          englishDescription: 'Choose application language',
          type: 'select',
          value: settings.language,
          options: [
            { value: 'ar', label: 'العربية', englishLabel: 'Arabic' },
            { value: 'en', label: 'English', englishLabel: 'English' }
          ]
        },
        {
          id: 'fontSize',
          title: 'حجم الخط',
          englishTitle: 'Font Size',
          description: 'حجم الخط في التطبيق',
          englishDescription: 'Font size in application',
          type: 'range',
          value: settings.fontSize,
          min: 12,
          max: 24,
          step: 1
        },
        {
          id: 'compactMode',
          title: 'الوضع المضغوط',
          englishTitle: 'Compact Mode',
          description: 'عرض مضغوط للواجهة',
          englishDescription: 'Compact interface display',
          type: 'toggle',
          value: settings.compactMode
        },
        {
          id: 'showAnimations',
          title: 'إظهار الرسوم المتحركة',
          englishTitle: 'Show Animations',
          description: 'إظهار الرسوم المتحركة في التطبيق',
          englishDescription: 'Show animations in application',
          type: 'toggle',
          value: settings.showAnimations
        }
      ]
    },
    {
      id: 'data',
      title: 'البيانات',
      englishTitle: 'Data',
      icon: Database,
      color: 'text-finclick-success',
      settings: [
        {
          id: 'autoBackup',
          title: 'النسخ الاحتياطي التلقائي',
          englishTitle: 'Auto Backup',
          description: 'النسخ الاحتياطي التلقائي للبيانات',
          englishDescription: 'Automatic data backup',
          type: 'toggle',
          value: settings.autoBackup
        },
        {
          id: 'backupFrequency',
          title: 'تكرار النسخ الاحتياطي',
          englishTitle: 'Backup Frequency',
          description: 'تكرار النسخ الاحتياطي',
          englishDescription: 'Backup frequency',
          type: 'select',
          value: settings.backupFrequency,
          options: [
            { value: 'daily', label: 'يومي', englishLabel: 'Daily' },
            { value: 'weekly', label: 'أسبوعي', englishLabel: 'Weekly' },
            { value: 'monthly', label: 'شهري', englishLabel: 'Monthly' }
          ]
        },
        {
          id: 'dataRetention',
          title: 'احتفاظ البيانات',
          englishTitle: 'Data Retention',
          description: 'فترة الاحتفاظ بالبيانات',
          englishDescription: 'Data retention period',
          type: 'select',
          value: settings.dataRetention,
          options: [
            { value: '1year', label: 'سنة واحدة', englishLabel: '1 Year' },
            { value: '2years', label: 'سنتان', englishLabel: '2 Years' },
            { value: '5years', label: '5 سنوات', englishLabel: '5 Years' },
            { value: 'forever', label: 'إلى الأبد', englishLabel: 'Forever' }
          ]
        },
        {
          id: 'exportFormat',
          title: 'صيغة التصدير',
          englishTitle: 'Export Format',
          description: 'صيغة ملف التصدير الافتراضية',
          englishDescription: 'Default export file format',
          type: 'select',
          value: settings.exportFormat,
          options: [
            { value: 'pdf', label: 'PDF', englishLabel: 'PDF' },
            { value: 'excel', label: 'Excel', englishLabel: 'Excel' },
            { value: 'word', label: 'Word', englishLabel: 'Word' },
            { value: 'powerpoint', label: 'PowerPoint', englishLabel: 'PowerPoint' }
          ]
        },
        {
          id: 'includeCharts',
          title: 'تضمين الرسوم البيانية',
          englishTitle: 'Include Charts',
          description: 'تضمين الرسوم البيانية في التقارير',
          englishDescription: 'Include charts in reports',
          type: 'toggle',
          value: settings.includeCharts
        }
      ]
    },
    {
      id: 'api',
      title: 'واجهة برمجة التطبيقات',
      englishTitle: 'API',
      icon: Cpu,
      color: 'text-finclick-warning',
      settings: [
        {
          id: 'apiKey',
          title: 'مفتاح API',
          englishTitle: 'API Key',
          description: 'مفتاح واجهة برمجة التطبيقات',
          englishDescription: 'API key',
          type: 'input',
          value: settings.apiKey
        },
        {
          id: 'webhookUrl',
          title: 'رابط Webhook',
          englishTitle: 'Webhook URL',
          description: 'رابط Webhook للإشعارات',
          englishDescription: 'Webhook URL for notifications',
          type: 'input',
          value: settings.webhookUrl
        },
        {
          id: 'rateLimit',
          title: 'حد المعدل',
          englishTitle: 'Rate Limit',
          description: 'حد عدد الطلبات في الدقيقة',
          englishDescription: 'Rate limit per minute',
          type: 'range',
          value: settings.rateLimit,
          min: 100,
          max: 10000,
          step: 100
        },
        {
          id: 'timeout',
          title: 'مهلة الطلب',
          englishTitle: 'Request Timeout',
          description: 'مهلة الطلب بالثواني',
          englishDescription: 'Request timeout in seconds',
          type: 'range',
          value: settings.timeout,
          min: 5,
          max: 120,
          step: 5
        },
        {
          id: 'retryAttempts',
          title: 'محاولات إعادة المحاولة',
          englishTitle: 'Retry Attempts',
          description: 'عدد محاولات إعادة المحاولة',
          englishDescription: 'Number of retry attempts',
          type: 'range',
          value: settings.retryAttempts,
          min: 1,
          max: 10,
          step: 1
        }
      ]
    }
  ];

  const handleSettingChange = (sectionId: string, settingId: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: value
    }));
  };

  const handleSaveSettings = () => {
    // هنا يمكن إضافة منطق حفظ الإعدادات
    console.log('Saving settings:', settings);
  };

  const renderSettingInput = (setting: Setting, sectionId: string) => {
    const currentValue = settings[setting.id];

    switch (setting.type) {
      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentValue}
              onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-finclick-gold/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-finclick-gold/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-finclick-gold after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-finclick-gold"></div>
          </label>
        );

      case 'select':
        return (
          <select
            value={currentValue}
            onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.value)}
            className="w-full p-3 border border-finclick-gold/30 rounded-lg bg-white/50 text-finclick-gold font-playfair focus:border-finclick-gold focus:outline-none"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {language === 'ar' ? option.label : option.englishLabel}
              </option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.value)}
            className="w-full p-3 border border-finclick-gold/30 rounded-lg bg-white/50 text-finclick-gold font-playfair focus:border-finclick-gold focus:outline-none"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={currentValue}
            onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.value)}
            rows={3}
            className="w-full p-3 border border-finclick-gold/30 rounded-lg bg-white/50 text-finclick-gold font-playfair focus:border-finclick-gold focus:outline-none resize-none"
          />
        );

      case 'range':
        return (
          <div className="w-full">
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              step={setting.step}
              value={currentValue}
              onChange={(e) => handleSettingChange(sectionId, setting.id, parseInt(e.target.value))}
              className="w-full h-2 bg-finclick-gold/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center mt-2">
              <span className="text-sm text-finclick-gold font-playfair">{currentValue}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
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
                  {language === 'ar' ? 'الإعدادات' : 'Settings'}
                </h1>
                <p className="text-finclick-gold/70 font-playfair">
                  {language === 'ar'
                    ? 'تخصيص إعدادات حسابك وتفضيلاتك'
                    : 'Customize your account settings and preferences'
                  }
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSaveSettings}
                  className="btn btn-primary btn-lg flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-finclick-gold mb-6 font-playfair">
                  {language === 'ar' ? 'الأقسام' : 'Sections'}
                </h2>
                <div className="space-y-2">
                  {settingSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-finclick-gold text-black'
                          : 'text-finclick-gold hover:bg-finclick-gold/10'
                      }`}
                    >
                      <section.icon className="w-5 h-5" />
                      <span className="font-medium font-playfair">
                        {language === 'ar' ? section.title : section.englishTitle}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/90 backdrop-blur-sm border border-finclick-gold/20 rounded-xl p-8 shadow-lg">
                {settingSections.map((section) => (
                  <div key={section.id} className={activeSection === section.id ? 'block' : 'hidden'}>
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`p-3 rounded-lg bg-finclick-gold/10 ${section.color}`}>
                        <section.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-finclick-gold font-playfair">
                          {language === 'ar' ? section.title : section.englishTitle}
                        </h2>
                        <p className="text-finclick-gold/70 font-playfair">
                          {language === 'ar'
                            ? 'تخصيص إعدادات هذا القسم'
                            : 'Customize settings for this section'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {section.settings.map((setting) => (
                        <div key={setting.id} className="border-b border-finclick-gold/10 pb-6 last:border-b-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
                                {language === 'ar' ? setting.title : setting.englishTitle}
                              </h3>
                              <p className="text-sm text-finclick-gold/70 font-playfair">
                                {language === 'ar' ? setting.description : setting.englishDescription}
                              </p>
                            </div>
                            <div className="ml-4">
                              {renderSettingInput(setting, section.id)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
