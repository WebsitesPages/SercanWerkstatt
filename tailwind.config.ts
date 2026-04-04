import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-antonio)', 'sans-serif'],
        body: ['var(--font-barlow)', 'sans-serif'],
      },
      colors: {
        carbon: {
          950: '#080808',
          900: '#111111',
          800: '#1a1a1a',
          700: '#252525',
          600: '#3a3a3a',
          500: '#555555',
          400: '#8a8a8a',
          300: '#aaaaaa',
          200: '#c8c8c8',
          100: '#e0e0e0',
          50: '#f0f0f0',
        },
        accent: {
          red: '#c92a2a',
          'red-light': '#e03131',
          copper: '#b87333',
          glow: 'rgba(201, 42, 42, 0.15)',
        },
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'line-grow': 'lineGrow 1.5s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 42, 42, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 42, 42, 0.25), 0 0 80px rgba(201, 42, 42, 0.08)' },
        },
        lineGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
