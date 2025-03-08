/** @type {import('tailwindcss').Config} */

const twNumberSizes = [];
for (let i = 4; i <= 96; i += 4) {
  twNumberSizes.push(i);
}

const tuiSizes = ["xs", "s", "m", "l", "xl"];

const tuiSizesLong = ["xs", "ui-s", "s", "ui-m", "m", "ui-l", "l", "xl"];

const appColors = [
  "controversial",
  "popular",
  "unpopular",
  "new",
  "upvote",
  "downvote",
  "logo",
];

const tuiColors = [
  "text-primary",
  "text-secondary",
  "text-tertiary",
  "text-primary-on-accent-1",
  "text-primary-on-accent-2",
  "text-action",
  "text-action-hover",
  "text-negative",
  "text-negative-hover",
  "text-positive",
  "text-positive-hover",
  "text-primary",
  "text-secondary",
  "text-tertiary",
  "text-primary-on-accent-1",
  "text-primary-on-accent-2",
  "text-action",
  "text-action-hover",
  "text-negative",
  "text-negative-hover",
  "text-positive",
  "text-positive-hover",
  "background-base",
  "background-base-alt",
  "background-neutral-1",
  "background-neutral-1-hover",
  "background-neutral-1-pressed",
  "background-neutral-2",
  "background-neutral-2-hover",
  "background-neutral-2-pressed",
  "background-accent-1",
  "background-accent-1-hover",
  "background-accent-1-pressed",
  "background-accent-2",
  "background-accent-2-hover",
  "background-accent-2-pressed",
  "background-accent-opposite",
  "background-accent-opposite-hover",
  "background-accent-opposite-pressed",
  "background-elevation-1",
  "background-elevation-2",
  "background-elevation-3",
  "background-base",
  "background-base-alt",
  "background-neutral-1",
  "background-neutral-1-hover",
  "background-neutral-1-pressed",
  "background-neutral-2",
  "background-neutral-2-hover",
  "background-neutral-2-pressed",
  "background-accent-1",
  "background-accent-1-hover",
  "background-accent-1-pressed",
  "background-accent-2",
  "background-accent-2-hover",
  "background-accent-2-pressed",
  "background-accent-opposite",
  "background-accent-opposite-hover",
  "background-accent-opposite-pressed",
  "background-elevation-1",
  "background-elevation-2",
  "background-elevation-3",
  "status-negative",
  "status-negative-pale",
  "status-negative-pale-hover",
  "status-positive",
  "status-positive-pale",
  "status-positive-pale-hover",
  "status-warning",
  "status-warning-pale",
  "status-warning-pale-hover",
  "status-info",
  "status-info-pale",
  "status-info-pale-hover",
  "status-neutral",
  "status-negative",
  "status-negative-pale",
  "status-negative-pale-hover",
  "status-positive",
  "status-positive-pale",
  "status-positive-pale-hover",
  "status-warning",
  "status-warning-pale",
  "status-warning-pale-hover",
  "status-info",
  "status-info-pale",
  "status-info-pale-hover",
  "status-neutral",
  "border-normal",
  "border-hover",
  "border-focus",
  "service-autofill-background",
  "service-selection-background",
  "service-backdrop",
  "border-normal",
  "border-hover",
  "border-focus",
  "service-autofill-background",
  "service-selection-background",
  "service-backdrop",
  "chart-categorical-00",
  "chart-categorical-01",
  "chart-categorical-02",
  "chart-categorical-03",
  "chart-categorical-04",
  "chart-categorical-05",
  "chart-categorical-06",
  "chart-categorical-07",
  "chart-categorical-08",
  "chart-categorical-09",
  "chart-categorical-10",
  "chart-categorical-11",
  "chart-categorical-12",
  "chart-categorical-13",
  "chart-categorical-14",
  "chart-categorical-15",
  "chart-categorical-16",
  "chart-categorical-17",
  "chart-categorical-18",
  "chart-categorical-19",
  "chart-categorical-20",
];

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      transitionDuration: {
        tui: "var(--tui-duration)",
      },
      borderRadius: () => {
        return Object.fromEntries(
          tuiSizes.flatMap((size) => [
            [`tui-${size}`, `var(--tui-radius-${size})`],
          ]),
        );
      },
      gridTemplateColumns: () => {
        return Object.fromEntries(
          twNumberSizes.flatMap((size) => [
            [
              `auto-fit-${size}`,
              `repeat(auto-fit, minmax(${size / 4}rem, 1fr))`,
            ],
            [
              `auto-fill-${size}`,
              `repeat(auto-fill, minmax(${size / 4}rem, 1fr))`,
            ],
          ]),
        );
      },
      colors: () => {
        return Object.fromEntries([
          ...appColors.flatMap((color) => [
            [`${color}`, `var(--color-${color})`],
            [`${color}-transparent`, `var(--color-${color}-transparent)`],
            [
              `${color}-transparent-pressed`,
              `var(--color-${color}-transparent-pressed)`,
            ],
          ]),
          ...tuiColors.flatMap((color) => [
            [`${color}`, `var(--tui-${color})`],
          ]),
        ]);
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        Object.fromEntries(
          [1, 2, 3, 4, 5, 6]
            .map((size) => [
              `.font-tui-heading-${size}`,
              {
                font: `var(--tui-font-heading-${size})`,
              },
            ])
            .concat(
              tuiSizesLong.map((size) => [
                `.font-tui-text-${size}`,
                {
                  font: `var(--tui-font-text-${size})`,
                },
              ]),
            ),
        ),
      );
    },
  ],
};
