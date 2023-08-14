/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        sm: '3px'
      },
      fontFamily: {
        popUp: "Montserrat, sans-serif"
      },
      scrollbar: {
        width: '10px',
        track: 'rgba(0, 0, 0, 0.1)',
        thumb: 'rgba(255, 255, 255, 0.3)',
      },
      screens: {
        'tall': { 'raw': '(max-height: 640px)' },
      }
    },
  },
  plugins: [],
};
