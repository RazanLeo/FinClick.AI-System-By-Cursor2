# 🎨 FinClick.AI Frontend

## نظرة عامة
الواجهة الأمامية لنظام FinClick.AI - نظام تحليل مالي ذكي ثوري مع 170+ نوع تحليل مالي.

## 🚀 المميزات

### **واجهة المستخدم المتقدمة**
- **React 18** - أحدث تقنيات الواجهة
- **TypeScript** - أمان النوع والكود
- **Tailwind CSS** - تصميم متجاوب وجميل
- **Dark Mode** - الوضع المظلم
- **RTL Support** - دعم كامل للغة العربية
- **Responsive Design** - يعمل على جميع الأجهزة

### **المكونات المتقدمة**
- **Header** - شريط التنقل مع دعم اللغة
- **Sidebar** - قائمة جانبية قابلة للطي
- **Dashboard** - لوحة تحكم شاملة
- **Charts** - رسوم بيانية تفاعلية
- **Tables** - جداول بيانات متقدمة
- **Forms** - نماذج ذكية مع التحقق

### **نظام المصادقة**
- **تسجيل الدخول** - مع دعم الضيوف والإدارة
- **التسجيل** - مع التحقق من قوة كلمة المرور
- **إدارة الحالة** - Context API متقدم
- **حماية المسارات** - مسارات محمية

### **دعم متعدد اللغات**
- **العربية** - دعم كامل مع RTL
- **الإنجليزية** - دعم عالمي
- **تبديل تلقائي** للاتجاه واللغة
- **ترجمات شاملة** لجميع النصوص

## 🛠️ التقنيات المستخدمة

- **React 18** - مكتبة الواجهة الرئيسية
- **TypeScript** - لغة البرمجة الآمنة
- **Tailwind CSS** - إطار العمل CSS
- **React Router** - التنقل بين الصفحات
- **Context API** - إدارة الحالة
- **Chart.js** - الرسوم البيانية
- **Lucide React** - الأيقونات
- **Axios** - طلبات HTTP

## 📦 التثبيت والتشغيل

### **المتطلبات**
- Node.js 18+
- npm 8+

### **التثبيت**
```bash
# تثبيت التبعيات
npm install

# تشغيل في وضع التطوير
npm start

# بناء للإنتاج
npm run build

# تشغيل الاختبارات
npm test

# فحص الكود
npm run lint
```

### **البيئة**
```bash
# نسخ ملف البيئة
cp .env.example .env

# تعديل المتغيرات
REACT_APP_API_URL=http://localhost:8000
REACT_APP_LANGUAGE=ar
```

## 🏗️ هيكل المشروع

```
frontend/
├── public/                 # الملفات العامة
├── src/                    # الكود المصدري
│   ├── components/         # المكونات
│   ├── pages/             # الصفحات
│   ├── context/           # إدارة الحالة
│   ├── services/          # الخدمات
│   ├── utils/             # الأدوات المساعدة
│   ├── types/             # أنواع TypeScript
│   └── styles/            # الأنماط
├── package.json           # تبعيات المشروع
└── tsconfig.json          # إعدادات TypeScript
```

## 🎯 المكونات الرئيسية

### **Header Component**
```tsx
import { Header } from '../components';

<Header 
  onLanguageChange={handleLanguageChange}
  onLogout={handleLogout}
  user={currentUser}
/>
```

### **Sidebar Component**
```tsx
import { Sidebar } from '../components';

<Sidebar 
  collapsed={sidebarCollapsed}
  onToggle={toggleSidebar}
  user={currentUser}
/>
```

### **Dashboard Component**
```tsx
import { DashboardPage } from '../pages';

<DashboardPage />
```

## 🌐 دعم اللغات

### **العربية (RTL)**
```tsx
// تبديل اللغة
const { language, setLanguage } = useLanguage();

// تغيير الاتجاه
document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
```

### **الترجمات**
```tsx
// استخدام الترجمة
const { t } = useLanguage();

<h1>{t('dashboard.title')}</h1>
<p>{t('dashboard.subtitle')}</p>
```

## 🎨 التصميم

### **Tailwind CSS**
```tsx
// استخدام الفئات
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
    {title}
  </h2>
</div>
```

### **Dark Mode**
```tsx
// تبديل الوضع المظلم
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  document.documentElement.classList.toggle('dark', darkMode);
}, [darkMode]);
```

## 📱 التصميم المتجاوب

### **Breakpoints**
```css
/* Mobile First */
.container {
  @apply px-4 py-6;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    @apply px-6 py-8;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    @apply px-8 py-10;
  }
}
```

## 🔒 الأمان

### **حماية المسارات**
```tsx
// مسار محمي
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// مسار عام
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

### **التحقق من المدخلات**
```tsx
// التحقق من كلمة المرور
const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
  return {
    valid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    score: [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length
  };
};
```

## 🧪 الاختبارات

### **Jest + React Testing Library**
```tsx
import { render, screen } from '@testing-library/react';
import { DashboardPage } from './DashboardPage';

test('renders dashboard title', () => {
  render(<DashboardPage />);
  const titleElement = screen.getByText(/لوحة التحكم/i);
  expect(titleElement).toBeInTheDocument();
});
```

## 🚀 النشر

### **Vercel**
```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel --prod
```

### **Docker**
```bash
# بناء الصورة
docker build -t finclick-frontend .

# تشغيل الحاوية
docker run -p 3000:3000 finclick-frontend
```

## 📊 الأداء

### **Code Splitting**
```tsx
// تقسيم الكود
const DashboardPage = lazy(() => import('./DashboardPage'));
const AnalysisPage = lazy(() => import('./AnalysisPage'));

// استخدام Suspense
<Suspense fallback={<Loading />}>
  <DashboardPage />
</Suspense>
```

### **Memoization**
```tsx
// حفظ المكونات
const MemoizedChart = memo(Chart);

// حفظ القيم
const memoizedData = useMemo(() => processData(rawData), [rawData]);
```

## 🔧 التطوير

### **ESLint + Prettier**
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,css,md}"
  }
}
```

### **Husky + Lint-staged**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## 📚 التوثيق

### **Storybook**
```bash
# تشغيل Storybook
npm run storybook

# بناء Storybook
npm run build-storybook
```

### **JSDoc**
```tsx
/**
 * مكون لوحة التحكم الرئيسية
 * @param {DashboardProps} props - خصائص المكون
 * @returns {JSX.Element} عنصر React
 */
const DashboardPage: React.FC<DashboardProps> = ({ user, data }) => {
  // الكود هنا
};
```

## 🤝 المساهمة

### **معايير الكود**
- استخدام TypeScript بشكل صحيح
- اتباع معايير ESLint
- كتابة اختبارات شاملة
- تحديث التوثيق

### **عملية المساهمة**
1. Fork المشروع
2. إنشاء branch جديد
3. إجراء التعديلات
4. كتابة الاختبارات
5. إنشاء Pull Request

## 📞 الدعم

### **المساعدة**
- **المسائل**: GitHub Issues
- **الوثائق**: README.md
- **الدردشة**: Discord Server
- **البريد**: support@finclick.ai

### **المطورون**
- **المطور الرئيسي**: Razan Leo
- **المصمم**: FinClick.AI Team
- **المدققون**: Community Contributors

---

## ⭐ إذا أعجبك المشروع، لا تنس إعطاءه نجمة!

**FinClick.AI** - نظام التحليل المالي الذكي المتقدم 🚀
