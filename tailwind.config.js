/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", '[data-theme="dim"]'],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["emerald", "dim"],
  },
};
