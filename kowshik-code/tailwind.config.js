/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          blue: '#0284c7',
          dark: '#0f172a',
          teal: '#0d9488',
          bg: '#f8fafc',
          surface: '#ffffff',
          border: '#e2e8f0',
          muted: '#64748b',
          pass: '#10b981',
          warn: '#f59e0b',
          fail: '#ef4444',
          tier1: '#6366f1'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      }
    },
  },
  plugins: [],
}
