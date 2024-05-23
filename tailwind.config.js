/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'from-blue', 'from-green', 'from-red', 'from-yellow', 
    'from-orange', 'from-violet', 'from-indigo'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        bgCard: '#2A2A2A',
        primaryLight: '#FFD166',
        accent: '#FF3F00',
        bgDark: '#121212',
        bgLight: '#383838',
        text: '#E8E8E8',
        confirm: '#3FA796',
        warning: '#F77F00',
        shadow: 'rgba(0, 0, 0, 0.5)',
        red: '#FF6347',
        orange: '#FFA07A',
        yellow: '#FFD700',
        green: '#90EE90',
        blue: '#ADD8E6',
        indigo: '#6A5ACD',
        violet: '#EE82EE',
        datasetPrimary: '#03b7f2',
        datasetSecondary: '#a100ee',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0%)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 120s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // Add custom plugin for hiding scrollbar
    plugin(function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* For Firefox */
          'scrollbar-width': 'none',
          /* For Chrome, Safari, and Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }, ['responsive']);
    }),
  ],
};
