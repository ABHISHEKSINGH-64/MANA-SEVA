export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Geist', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace']
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        accent: '#4f46e5',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        ink: '#0f172a',
        saffron: '#f97316'
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        official: '0 10px 25px -5px rgba(37, 99, 235, 0.05), 0 8px 16px -6px rgba(37, 99, 235, 0.03)',
        premium: '0 20px 25px -5px rgba(15, 23, 42, 0.04), 0 10px 10px -5px rgba(15, 23, 42, 0.02)'
      }
    }
  },
  plugins: []
};
