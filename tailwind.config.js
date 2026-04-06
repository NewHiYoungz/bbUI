/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F47920',
        'primary-dark': '#E06A15',
        accent: '#F47920',
        'accent-dark': '#E06A15',
        'text-dark': '#FFFFFF',
        'text-secondary': '#8A9AB5',
        'text-muted': '#5A6E8A',
        'border-light': '#243656',
        'border-hover': '#344663',
        'body': '#0B1221',
        'surface': '#111D32',
        'surface-light': '#1A2B45',
        'subtle': '#0F1929',
      },
      borderRadius: {
        'custom': '10px',
      },
      fontFamily: {
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 24px rgba(244, 121, 32, 0.1)',
        'dropdown': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 60px rgba(244, 121, 32, 0.15)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
}
