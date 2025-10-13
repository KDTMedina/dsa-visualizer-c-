/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#006989',
        'secondary': '#007090',
        'accent': '#01A7C2',
        'neutral': '#A3BAC3',
        'light': '#EAEBED',
      },
    },
  },
  plugins: [],
}