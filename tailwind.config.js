/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", '[data-theme="dim"]'],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: { boxShadow: { inner: "inset 0 0 1px var(--tw-ring-color)" } },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [{ emerald: { accent: "#10b981" } }, "dim"],
  },
};
