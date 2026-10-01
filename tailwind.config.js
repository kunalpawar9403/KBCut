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
        brand: {
          50: '#EEF3FD',
          100: '#D5E2FA',
          200: '#ADC6F6',
          300: '#7AA3F1',
          400: '#477DEC',
          500: '#1F4FD8', // Primary deep blue
          600: '#193FB0',
          700: '#14318A',
          800: '#102465',
          900: '#0C1B4B',
          DEFAULT: '#1F4FD8',
        },
        accent: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#16A34A', // Accent green
          600: '#15803D',
          700: '#166534',
          800: '#14532D',
          DEFAULT: '#16A34A',
        },
        warning: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          500: '#F97316',
          600: '#EA580C',
          DEFAULT: '#EA580C',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(31, 79, 216, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        card: '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(0, 0, 0, 0.02)',
        elevated: '0 20px 40px -15px rgba(31, 79, 216, 0.15)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
