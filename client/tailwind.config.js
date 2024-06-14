/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B5A7D",
        secondary: "#EDA415",
        tertiary: "#E2F4FF",
      },
    },
  },
  plugins: [],
}
