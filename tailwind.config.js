/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bni: {
          orange: '#ED6B23',
          'orange-dark': '#C9551A',
          teal: '#00857C',
          'teal-dark': '#005E6A',
          navy: '#14233A',
          'navy-light': '#1E3350',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(20,35,58,0.08), 0 1px 2px rgba(20,35,58,0.06)',
        'card-hover': '0 8px 24px rgba(20,35,58,0.12)',
      },
    },
  },
  plugins: [],
}
