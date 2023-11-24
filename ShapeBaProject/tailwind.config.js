/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'Gray': '#F7F7FB',
        'Darkgray': '#4B4B4B',
        'Orange': '#EC744A',
        'Yellow': '#FBBB57',
        'Green': '#025146',
      }
    },

  },
  plugins: [],
}


