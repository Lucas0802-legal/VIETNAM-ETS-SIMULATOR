/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#116C5B',
          dark: '#0B5148',
        },
        eco: {
          DEFAULT: '#16853D',
          light: '#5BA12F',
          soft: '#ABC7B3',
        },
        canvas: '#EEF6F3',
        surface: '#FFFFFF',
        hairline: '#B7CDC8',
        ink: {
          DEFAULT: '#1F3738',
          muted: '#5A706B',
        },
        navy: '#0B3855',
        // Neutrals re-tinted toward the brand's teal-green so surfaces,
        // borders and muted text read as one system.
        slate: {
          50: '#F7FBF9',
          100: '#EEF6F3',
          200: '#DCEAE5',
          300: '#B7CDC8',
          400: '#8AA49E',
          500: '#5A706B',
          600: '#4A5F5B',
          700: '#35504B',
          800: '#26403C',
          850: '#1D3432',
          900: '#1F3738',
          950: '#152726',
        },
        emerald: {
          50: '#EAF5EE',
          100: '#D6EBDD',
          200: '#ABC7B3',
          300: '#8CBB98',
          400: '#5BA12F',
          500: '#2E9450',
          600: '#16853D',
          700: '#116C5B',
          800: '#0B5148',
          900: '#0A423B',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 20px -5px rgba(15, 23, 42, 0.07), 0 4px 6px -2px rgba(15, 23, 42, 0.03)',
      }
    },
  },
  plugins: [],
}
