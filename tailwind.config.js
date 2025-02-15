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
        "background-base-alt": "var(--tui-background-base-alt)",
        "background-neutral-1": "(var(--tui-background-neutral-1)",
        "background-neutral-1-hover": "var(--tui-background-neutral-1-hover)",
        "background-neutral-1-pressed":
          "var(--tui-background-neutral-1-pressed)",
        "background-neutral-2": "(var(--tui-background-neutral-2)",
        "background-neutral-2-hover": "var(--tui-background-neutral-2-hover)",
        "background-neutral-2-pressed":
          "var(--tui-background-neutral-2-pressed)",
        "text-primary": "var(--tui-text-primary)",
        "text-secondary": "var(--tui-text-secondary)",
        "text-tertiary": "var(--tui-text-tertiary)",
        "text-action": "var(--tui-text-action)",
        "status-neutral": "var(--tui-status-neutral)",
      },
    },
  },
  plugins: [],
};
