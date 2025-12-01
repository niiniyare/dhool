import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map to PrimeVue CSS variables
        primary: {
          DEFAULT: 'var(--p-primary-color)',
          50: 'var(--p-primary-50)',
          100: 'var(--p-primary-100)',
          200: 'var(--p-primary-200)',
          300: 'var(--p-primary-300)',
          400: 'var(--p-primary-400)',
          500: 'var(--p-primary-500)',
          600: 'var(--p-primary-600)',
          700: 'var(--p-primary-700)',
          800: 'var(--p-primary-800)',
          900: 'var(--p-primary-900)',
          950: 'var(--p-primary-950)'
        },
        surface: {
          ground: 'var(--p-surface-ground)',
          section: 'var(--p-surface-section)',
          card: 'var(--p-surface-card)',
          overlay: 'var(--p-surface-overlay)',
          border: 'var(--p-surface-border)',
          hover: 'var(--p-surface-hover)'
        },
        content: {
          DEFAULT: 'var(--p-content-color)',
          hover: 'var(--p-content-hover-color)',
          muted: 'var(--p-content-muted-color)'
        }
      },
      borderRadius: {
        DEFAULT: 'var(--p-border-radius)',
        xs: 'var(--p-border-radius-xs)',
        sm: 'var(--p-border-radius-sm)',
        md: 'var(--p-border-radius-md)',
        lg: 'var(--p-border-radius-lg)',
        xl: 'var(--p-border-radius-xl)'
      },
      fontFamily: {
        sans: ['var(--p-font-family)']
      }
    }
  },
  plugins: []
} satisfies Config