/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        metana: ['NeueMetana', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  darkMode: ['class'],
  plugins: [require('rippleui')],
};
