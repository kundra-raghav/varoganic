import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import containerQueries from '@tailwindcss/container-queries'

const withOpacity = (variable) => `rgb(var(${variable}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    screens: {
      xs: '360px',
      sm: '600px',
      md: '900px',
      lg: '1200px',
      xl: '1536px',
      '2xl': '1920px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: withOpacity('--color-primary'),
          hover: withOpacity('--color-primary-hover'),
          foreground: withOpacity('--color-on-primary'),
        },
        accent: {
          DEFAULT: withOpacity('--color-accent'),
          strong: withOpacity('--color-accent-strong'),
        },
        ink: withOpacity('--color-ink'),
        body: withOpacity('--color-body'),
        muted: withOpacity('--color-muted'),
        lines: withOpacity('--color-lines'),
        paper: withOpacity('--color-paper'),
        success: withOpacity('--color-success'),
        info: withOpacity('--color-info'),
        warning: withOpacity('--color-warning'),
        error: withOpacity('--color-error'),
        focus: withOpacity('--color-focus-ring'),
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', ...defaultTheme.fontFamily.sans],
        heading: ['"Playfair Display"', 'Fraunces', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        h1: ['var(--font-size-h1)', { lineHeight: 'var(--line-height-h1)', fontWeight: '600', letterSpacing: '-0.02em' }],
        h2: ['var(--font-size-h2)', { lineHeight: 'var(--line-height-h2)', fontWeight: '600', letterSpacing: '-0.01em' }],
        h3: ['var(--font-size-h3)', { lineHeight: 'var(--line-height-h3)', fontWeight: '600' }],
        base: ['var(--font-size-body)', { lineHeight: 'var(--line-height-body)' }],
        sm: ['var(--font-size-small)', { lineHeight: 'var(--line-height-small)' }],
      },
      spacing: {
        '0.5': 'var(--space-2)',
        1: 'var(--space-4)',
        2: 'var(--space-8)',
        3: 'var(--space-12)',
        4: 'var(--space-16)',
        6: 'var(--space-24)',
        8: 'var(--space-32)',
        10: 'var(--space-40)',
        12: 'var(--space-48)',
        16: 'var(--space-64)',
        20: 'var(--space-80)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
      ringColor: {
        DEFAULT: withOpacity('--color-focus-ring'),
      },
      backgroundImage: {
        'accent-gradient': 'var(--accent-gradient)',
        confetti: 'var(--surface-confetti)',
      },
    },
  },
  plugins: [forms, typography, containerQueries],
}
