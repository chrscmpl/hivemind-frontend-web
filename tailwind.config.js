/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        action: "var(--tui-text-action)",
      },
    },
  },
  plugins: [],
};
