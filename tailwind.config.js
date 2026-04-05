/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C5CE7',
        'primary-dark': '#5A4BD1',
        accent: '#FF8C69',
        'accent-dark': '#E87755',
        'text-dark': '#2D3436',
        'text-secondary': '#B2BEC3',
        'border-light': '#DFE6E9',
        'bg-subtle': '#F8F9FA',
        'bg-code': '#2D3436',
      },
      borderRadius: {
        'custom': '10px',
      },
      fontFamily: {
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(108, 92, 231, 0.08)',
        'dropdown': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
}
