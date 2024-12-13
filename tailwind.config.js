/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        action: "var(--tui-text-action)",
        border_normal: "var(--tui-border-normal)",
        background_base: "var(--tui-background-base)",
        text_primary: "var(--tui-text-primary)",
        text_secondary: "var(--tui-text-secondary)",
        text_tertiary: "var(--tui-text-tertiary)",
      },
    },
  },
  plugins: [],
};
