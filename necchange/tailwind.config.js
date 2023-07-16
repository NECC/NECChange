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
        width: '10px', // Width of the scrollbar
        track: 'rgba(0, 0, 0, 0.1)', // Background color of the scrollbar track
        thumb: 'rgba(255, 255, 255, 0.3)', // Color of the scrollbar thumb
      }
    },
  },
  plugins: [],
}
