/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      transitionDuration: {
        tui: "var(--tui-duration)",
      },
      colors: {
        controversial: "var(--controversial)",
        "controversial-transparent": "var(--controversial-transparent)",
        "controversial-transparent-pressed":
          "var(--controversial-transparent-pressed)",
        popular: "var(--popular)",
        "popular-transparent": "var(--popular-transparent)",
        "popular-transparent-pressed": "var(--popular-transparent-pressed)",
        unpopular: "var(--unpopular)",
        "unpopular-transparent": "var(--unpopular-transparent)",
        "unpopular-transparent-pressed": "var(--unpopular-transparent-pressed)",
        upvote: "var(--upvote-color)",
        downvote: "var(--downvote-color)",
        "border-normal": "var(--tui-border-normal)",
        "border-hover": "var(--tui-border-hover)",
        "border-focus": "var(--tui-border-focus)",
        "background-base": "var(--tui-background-base)",
        "background-base-alt": "var(--tui-background-base-alt)",
        "background-neutral-1": "var(--tui-background-neutral-1)",
        "background-neutral-1-hover": "var(--tui-background-neutral-1-hover)",
        "background-neutral-1-pressed":
          "var(--tui-background-neutral-1-pressed)",
        "background-neutral-2": "var(--tui-background-neutral-2)",
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
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".font-tui-1": {
          font: "var(--tui-font-heading-1)",
        },
        ".font-tui-2": {
          font: "var(--tui-font-heading-2)",
        },
        ".font-tui-3": {
          font: "var(--tui-font-heading-3)",
        },
        ".font-tui-4": {
          font: "var(--tui-font-heading-4)",
        },
        ".font-tui-5": {
          font: "var(--tui-font-heading-5)",
        },
        ".font-tui-6": {
          font: "var(--tui-font-heading-6)",
        },
      });
    },
  ],
};
