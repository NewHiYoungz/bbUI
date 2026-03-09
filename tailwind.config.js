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
        accent: '#FF8C69',
        'text-dark': '#2D3436',
        'text-secondary': '#B2BEC3',
        'border-light': '#DFE6E9',
      },
      borderRadius: {
        'custom': '10px',
      },
    },
  },
  plugins: [],
}

