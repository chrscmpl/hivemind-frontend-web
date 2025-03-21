// This script does something very similar to what ThemeService does in
// src/app/core/misc/services/theme.service.ts
// However this script is necessary to prevent Flash of Unstyled Content (FOUC)
// by being linked in the head

let theme;
try {
  theme =
    localStorage.getItem("theme") ??
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") ??
    "light";
} catch {
  theme = "light";
}
const variation = localStorage.getItem(`${theme}-theme-variation`);
const link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = `./theme-${theme}${
  variation && variation !== "default" ? `-${variation}` : ""
}.css`;
link.className = "theme-link";
document.head.appendChild(link);
document.documentElement.setAttribute("data-theme", theme);
