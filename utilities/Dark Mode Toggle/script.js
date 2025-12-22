const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

/**
 * Detect system theme
 */
const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

/**
 * Apply theme
 */
function applyTheme(theme) {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    toggle.checked = true;
  } else {
    root.removeAttribute("data-theme");
    toggle.checked = false;
  }
}

/**
 * Initial load
 */
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  applyTheme(savedTheme);
} else {
  applyTheme(systemPrefersDark ? "dark" : "light");
}

/**
 * Toggle handler
 */
toggle.addEventListener("change", () => {
  const theme = toggle.checked ? "dark" : "light";
  applyTheme(theme);
  localStorage.setItem("theme", theme);
});
