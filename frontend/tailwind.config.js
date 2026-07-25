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
        ghats: {
          950: '#02080e',
          900: '#06121e',
          850: '#0d1f30',
          800: '#142c44',
          750: '#1c3b5a',
          700: '#284d74',
        },
        emerald: {
          jade: '#00e699',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          glow: 'rgba(0, 230, 153, 0.25)',
        },
        periyar: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0284c7',
          glow: 'rgba(6, 182, 212, 0.25)',
        },
        kwa: {
          gold: '#f59e0b',
          amber: '#d97706',
          yellow: '#eab308',
        },
        river: {
          healthy: '#00e699',
          warning: '#f59e0b',
          critical: '#ff3b30',
        }
      },
      fontFamily: {
        syne: ['Syne', 'Outfit', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'rippleRing 3s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))' },
          '50%': { opacity: 0.4, filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.2))' },
        },
        rippleRing: {
          '0%': { transform: 'scale(0.8)', opacity: 0.9 },
          '100%': { transform: 'scale(2.4)', opacity: 0 },
        }
      }
    },
  },
  plugins: [],
}
