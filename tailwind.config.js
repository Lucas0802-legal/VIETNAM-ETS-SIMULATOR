/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151f32',
          950: '#090d16',
        },
        navy: {
          50: '#f0f5fa',
          100: '#e1ebf4',
          200: '#c3d7e9',
          300: '#94badd',
          400: '#5f97cd',
          500: '#3b7bbe',
          600: '#2c62a3',
          700: '#244e83',
          800: '#21436e',
          900: '#0f172a',
          950: '#090d18',
        },
        emerald: {
          600: '#059669',
          700: '#047857',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
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
