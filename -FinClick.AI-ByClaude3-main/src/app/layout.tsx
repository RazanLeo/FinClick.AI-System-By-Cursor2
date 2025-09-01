import type { Metadata } from 'next'
import { Playfair_Display, Tajawal } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const tajawal = Tajawal({ 
  subsets: ['arabic'],
  variable: '--font-tajawal',
  display: 'swap',
  weight: ['300', '400', '500', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'FinClick.AI - Revolutionary AI-Powered Financial Analysis',
  description: 'Advanced financial analysis platform with 181 types of analysis powered by AI',
  keywords: 'financial analysis, AI, artificial intelligence, تحليل مالي, ذكاء اصطناعي',
  authors: [{ name: 'FinClick.AI' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={`${playfair.variable} ${tajawal.variable}`}>
      <body className="min-h-screen bg-black text-finclick-gold font-tajawal">
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#000',
              color: '#D4AF37',
              border: '1px solid #D4AF37',
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
