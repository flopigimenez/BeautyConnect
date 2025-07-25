import { type Config } from "tailwindcss"

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['"Nunito"', 'sans-serif'],
        quicksand: ['"Quicksand"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config;