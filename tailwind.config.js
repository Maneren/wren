const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/**/*.{js,jsx}',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        primary: '#cb0054',
        secondary: '#2563EB',
        highlight: '#1D4ED8',
        active: '#1E40AF'
      }
    }
  },
  plugins: [require('tw-elements/dist/plugin')]
};
