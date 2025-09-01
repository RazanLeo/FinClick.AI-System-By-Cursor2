import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FinClick.AI - Revolutionary Intelligent Financial Analysis System',
  description: 'ثورة ونقلة نوعية في عالم التحليل المالي - منصة ونظام شامل يغنيك عن أي مدير أو محلل أو خبير مالي',
  keywords: [
    'financial analysis',
    'AI analysis',
    'financial statements',
    'business intelligence',
    'financial modeling',
    'investment analysis',
    'risk assessment',
    'financial reporting',
    'تحليل مالي',
    'ذكاء اصطناعي',
    'قوائم مالية',
    'ذكاء الأعمال',
    'النمذجة المالية',
    'تحليل الاستثمار',
    'تقييم المخاطر',
    'التقارير المالية'
  ],
  authors: [{ name: 'FinClick.AI Team' }],
  creator: 'FinClick.AI',
  publisher: 'FinClick.AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://finclick.ai'),
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/ar',
      'en': '/en',
    },
  },
  openGraph: {
    title: 'FinClick.AI - Revolutionary Intelligent Financial Analysis System',
    description: 'ثورة ونقلة نوعية في عالم التحليل المالي - منصة ونظام شامل يغنيك عن أي مدير أو محلل أو خبير مالي',
    url: 'https://finclick.ai',
    siteName: 'FinClick.AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FinClick.AI - Revolutionary Intelligent Financial Analysis System',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinClick.AI - Revolutionary Intelligent Financial Analysis System',
    description: 'ثورة ونقلة نوعية في عالم التحليل المالي - منصة ونظام شامل يغنيك عن أي مدير أو محلل أو خبير مالي',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#D4AF37" />
        <meta name="msapplication-TileColor" content="#D4AF37" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "FinClick.AI",
              "description": "Revolutionary Intelligent Financial Analysis System",
              "url": "https://finclick.ai",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "5000",
                "priceCurrency": "SAR",
                "availability": "https://schema.org/InStock"
              },
              "author": {
                "@type": "Organization",
                "name": "FinClick.AI",
                "url": "https://finclick.ai"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "150"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#000000',
                color: '#D4AF37',
                border: '1px solid #D4AF37',
                borderRadius: '8px',
                fontFamily: 'Playfair Display, serif',
              },
              success: {
                iconTheme: {
                  primary: '#22C55E',
                  secondary: '#000000',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#000000',
                },
              },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}
