/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1F44',
          light: '#1a3a5c',
          dark: '#050f22',
        },
        gray: {
          50: '#F9FAFB',
          200: '#E5E7EB',
          600: '#4B5563',
        },
        accent: {
          blue: '#3B82F6',
          green: '#10B981',
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 16px 48px rgba(10,31,68,0.12)',
        '3d': '0 6px 0 #050f22, 0 8px 16px rgba(10,31,68,0.3)',
        '3d-hover': '0 4px 0 #050f22, 0 6px 12px rgba(10,31,68,0.3)',
        '3d-active': '0 2px 0 #050f22, 0 4px 8px rgba(10,31,68,0.3)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
