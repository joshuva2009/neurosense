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
        neuro: {
          dark: '#070C18',
          navy: '#0B132B',
          deep: '#101B3B',
          card: '#162244',
          cardLight: '#F8FAFC',
          border: '#1E2F5D',
          borderLight: '#E2E8F0',
          teal: {
            DEFAULT: '#06B6D4',
            light: '#22D3EE',
            glow: '#67E8F9',
            dark: '#0891B2',
          },
          purple: {
            DEFAULT: '#8B5CF6',
            light: '#A78BFA',
            glow: '#C4B5FD',
            dark: '#6D28D9',
          },
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.4))' },
          '100%': { opacity: '0.9', filter: 'drop-shadow(0 0 25px rgba(139, 92, 246, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
