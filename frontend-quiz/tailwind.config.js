/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 沿用我們專案的調色盤
      colors: {
        'tea-green': '#ccd5aeff',
        'beige': '#e9edc9ff',
        'cornsilk': '#fefae0ff',
        'papaya-whip': '#faedcdff',
        'buff': '#d4a373ff',
      }
    },
  },
  plugins: [],
}