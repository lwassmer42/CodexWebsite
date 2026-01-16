const storageKey = "theme";
const toggle = document.getElementById("theme-toggle");
const stateLabel = document.getElementById("theme-state");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(mode, persist = true) {
  document.body.dataset.theme = mode;
  toggle.setAttribute("aria-pressed", mode === "dark");
  stateLabel.textContent = mode === "dark" ? "DARK" : "LIGHT";
  if (persist) {
    localStorage.setItem(storageKey, mode);
  }
}

const storedTheme = localStorage.getItem(storageKey);
if (storedTheme) {
  applyTheme(storedTheme, true);
} else {
  applyTheme(prefersDark.matches ? "dark" : "light", false);
}

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem(storageKey)) {
    applyTheme(event.matches ? "dark" : "light", false);
  }
});

toggle.addEventListener("click", () => {
  const nextMode = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextMode, true);
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
