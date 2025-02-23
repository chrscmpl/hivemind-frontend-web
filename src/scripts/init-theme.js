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
document.body.setAttribute("data-theme", theme);
