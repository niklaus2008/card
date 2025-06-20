/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'chinese': ['PingFang SC', 'Microsoft YaHei', 'SimHei', 'Arial', 'sans-serif'],
      },
      colors: {
        'card-bg': '#f8f9fa',
        'card-border': '#e9ecef',
        'text-primary': '#212529',
        'text-secondary': '#6c757d',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
} 