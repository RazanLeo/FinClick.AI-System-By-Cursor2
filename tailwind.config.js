/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'finclick-gold': '#D4AF37',
        'finclick-gold-light': '#FFD700',
        'finclick-gold-dark': '#B8860B',
        'finclick-black': '#000000',
        'finclick-gray': '#111111',
        'finclick-gray-light': '#222222',
        'finclick-success': '#22C55E',
        'finclick-warning': '#EAB308',
        'finclick-error': '#EF4444',
        'finclick-info': '#3B82F6',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'arabic': ['Noto Sans Arabic', 'sans-serif'],
      },
      animation: {
        'logo-flash': 'logoFlash 1.5s ease-in-out infinite',
        'step-pulse-1': 'stepPulse1 3s ease-in-out infinite',
        'step-pulse-2': 'stepPulse2 3s ease-in-out infinite',
        'step-pulse-3': 'stepPulse3 3s ease-in-out infinite',
        'flow-right': 'flowRight 2s ease-in-out infinite',
        'number-glow': 'numberGlow 2s ease-in-out infinite',
        'sentiment-pulse': 'sentimentPulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        logoFlash: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.6))',
            opacity: '1',
          },
          '50%': {
            filter: 'drop-shadow(0 0 40px rgba(212, 175, 55, 1))',
            opacity: '0.7',
          },
        },
        stepPulse1: {
          '0%, 100%': { borderColor: 'rgba(212, 175, 55, 0.4)' },
          '50%': { borderColor: '#22C55E' },
        },
        stepPulse2: {
          '0%, 100%': { borderColor: 'rgba(212, 175, 55, 0.4)' },
          '33%': { borderColor: '#3B82F6' },
        },
        stepPulse3: {
          '0%, 100%': { borderColor: 'rgba(212, 175, 55, 0.4)' },
          '66%': { borderColor: '#EF4444' },
        },
        flowRight: {
          '0%': { opacity: '0.3' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.3' },
        },
        numberGlow: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        sentimentPulse: {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.8)',
            transform: 'translateX(-50%) scale(1)',
          },
          '50%': {
            boxShadow: '0 0 25px rgba(212, 175, 55, 1)',
            transform: 'translateX(-50%) scale(1.1)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          'from': {
            filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.6))',
          },
          'to': {
            filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.9))',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)',
        'gradient-gold-dark': 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(0, 0, 0, 0.9) 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.4)',
        'gold-strong': '0 0 30px rgba(212, 175, 55, 0.7)',
        'gold-glow': '0 0 40px rgba(212, 175, 55, 0.8)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
  darkMode: 'class',
}
