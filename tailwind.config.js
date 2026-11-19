/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic Tokens (CSS Variables mapped to dark/light palettes)
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'app-border': 'var(--border)',
        text: 'var(--text-main)',
        'app-text': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
        'app-text-muted': 'var(--text-muted)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)',
        'focus-ring': 'var(--focus-ring)',

        // Slate / Elevated Modern Surfaces
        slate: {
          850: '#131c2e',
          925: '#0c1322',
          950: '#070c18',
          tempered: '#1E293B',
          hairline: '#334155',
        },
        // Dark Hero / Shell Surfaces
        obsidian: {
          DEFAULT: '#0B0F19',
          900: '#0B0F19',
          800: '#111827',
          deep: '#060911',
        },
        gunmetal: {
          DEFAULT: '#111827',
          billet: '#151f32',
          elevated: '#1a263d',
        },
        // Light Workbench Surfaces
        alabaster: {
          DEFAULT: '#F8FAFC',
          steel: '#F8FAFC',
        },
        mill: {
          sheet: '#FFFFFF',
        },
        border: {
          DEFAULT: 'var(--border)',
          crisp: '#E2E8F0',
          dark: '#334155',
        },
        // Primary Accent: Electric Emerald (CBAM & ASTM Pass)
        emerald: {
          DEFAULT: '#10B981',
          electric: '#10B981',
          viridian: '#059669',
          badge: '#D1FAE5',
          darkText: '#065F46',
        },
        // Secondary Accent: Molten Amber & Smelting Copper (Heat Trace & Melt-and-Pour)
        amber: {
          DEFAULT: '#F59E0B',
          molten: '#F59E0B',
          badge: '#FEF3C7',
          darkText: '#92400E',
        },
        copper: {
          smelting: '#EA580C',
        },
        // Telemetry Accent (PDF Coordinates & Clause 6)
        cobalt: {
          DEFAULT: '#2563EB',
          blueprint: '#2563EB',
          light: '#DBEAFE',
          darkText: '#1E40AF',
        },
        // Alert Accent (Off-Spec Chemistry / Rejection)
        crimson: {
          DEFAULT: '#EF4444',
          oxide: '#EF4444',
          badge: '#FEE2E2',
          darkText: '#991B1B',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],       // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px (app body on mobile)
        'base': ['1rem', { lineHeight: '1.5rem' }],       // 16px (marketing body)
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
        'xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '2xl': ['2rem', { lineHeight: '2.5rem' }],       // 32px
        '3xl': ['3rem', { lineHeight: '1.15' }],         // 48px
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 80% 20%, rgba(16, 185, 129, 0.20), transparent), radial-gradient(ellipse 70% 50% at 20% 80%, rgba(245, 158, 11, 0.16), transparent)',
        'mesh-glow': 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
        'forge-beam': 'linear-gradient(90deg, #F59E0B 0%, #EA580C 100%)',
        'emerald-beam': 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
        'aurora': 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(245, 158, 11, 0.12) 100%)',
      },
      boxShadow: {
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.4)',
        'glow-amber': '0 0 30px -5px rgba(245, 158, 11, 0.4)',
        'glow-blue': '0 0 30px -5px rgba(59, 130, 246, 0.4)',
        'card-dark': '0 8px 30px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'card-light': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulseGlow 5s ease-in-out infinite',
        'scan-line': 'scanLine 2.5s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'shimmer': 'shimmer 4s linear infinite',
        'flow-signal': 'flowSignal 2.5s ease-in-out infinite',
      },
      keyframes: {
        scanLine: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        flowSignal: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '30%': { opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'translateX(250%)', opacity: '0' },
        },
      }
    },
  },
  plugins: [],
}
