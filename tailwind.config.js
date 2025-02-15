/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        controversial: "var(--controversial)",
        "controversial-transparent": "var(--controversial-transparent)",
        popular: "var(--popular)",
        "popular-transparent": "var(--popular-transparent)",
        unpopular: "var(--unpopular)",
        "unpopular-transparent": "var(--unpopular-transparent)",
        upvote: "var(--upvote-color)",
        downvote: "var(--downvote-color)",
        "border-normal": "var(--tui-border-normal)",
        "background-base": "var(--tui-background-base)",
        "background-neutral-1": "(var(--tui-background-neutral-1)",
        "text-primary": "var(--tui-text-primary)",
        "text-secondary": "var(--tui-text-secondary)",
        "text-tertiary": "var(--tui-text-tertiary)",
        "background-neutral-1": "var(--tui-background-neutral-1)",
        "text-action": "var(--tui-text-action)",
        "status-neutral": "var(--tui-status-neutral)",
      },
    },
  },
  plugins: [],
};
