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

const portrait = document.querySelector(".portrait");
if (portrait) {
  const noteGlyphs = ["♪", "♫", "♩"];
  const noteColors = ["#5bb6ff", "#8b6bff", "#c24bff"];

  portrait.addEventListener("click", () => {
    if (portrait.pulseTimeout) {
      clearTimeout(portrait.pulseTimeout);
    }
    portrait.classList.remove("pulse", "shake");
    void portrait.offsetWidth;
    portrait.classList.add("pulse", "shake");

    for (let i = 0; i < 6; i += 1) {
      const note = document.createElement("span");
      const glyph = noteGlyphs[Math.floor(Math.random() * noteGlyphs.length)];
      const color = noteColors[Math.floor(Math.random() * noteColors.length)];
      const left = 15 + Math.random() * 70;
      const top = 55 + Math.random() * 30;
      const delay = Math.random() * 0.2;
      const size = 1.2 + Math.random() * 0.8;

      note.className = "note";
      note.textContent = glyph;
      note.style.left = `${left}%`;
      note.style.top = `${top}%`;
      note.style.setProperty("--note-color", color);
      note.style.animationDelay = `${delay}s`;
      note.style.fontSize = `${size}rem`;
      portrait.appendChild(note);

      setTimeout(() => {
        note.remove();
      }, 1600);
    }

    for (let i = 0; i < 4; i += 1) {
      const note = document.createElement("span");
      const glyph = noteGlyphs[Math.floor(Math.random() * noteGlyphs.length)];
      const color = noteColors[Math.floor(Math.random() * noteColors.length)];
      const left = -15 + Math.random() * 130;
      const top = 30 + Math.random() * 50;
      const delay = Math.random() * 0.3;
      const size = 1.1 + Math.random() * 0.9;

      note.className = "note wide";
      note.textContent = glyph;
      note.style.left = `${left}%`;
      note.style.top = `${top}%`;
      note.style.setProperty("--note-color", color);
      note.style.animationDelay = `${delay}s`;
      note.style.fontSize = `${size}rem`;
      portrait.appendChild(note);

      setTimeout(() => {
        note.remove();
      }, 2000);
    }

    portrait.pulseTimeout = setTimeout(() => {
      portrait.classList.remove("pulse", "shake");
    }, 750);
  });
}

const driftLayer = document.querySelector(".drift-layer");
const motionSafe = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (driftLayer && motionSafe) {
  const driftColors = [
    "rgba(91, 182, 255, 0.7)",
    "rgba(139, 107, 255, 0.7)",
    "rgba(194, 75, 255, 0.65)"
  ];
  const sqlSnippets = [
    "WITH recent_orders AS (SELECT * FROM orders ORDER BY order_date DESC LIMIT 5) SELECT * FROM recent_orders;",
    "SELECT c.name, o.total FROM customers c JOIN orders o ON o.customer_id = c.id ORDER BY o.total DESC LIMIT 5;",
    "WITH totals AS (SELECT customer_id, SUM(amount) AS total_paid FROM payments GROUP BY customer_id) SELECT * FROM totals;"
  ];
  const pySnippets = [
    "for beat in range(4): print(\"tick\")",
    "def vibe(x): return x * 2",
    "notes = [\"C\", \"G\", \"A\"]; print(notes)"
  ];
  const driftNotes = ["♪", "♫", "♩"];

  const spawnDriftItem = () => {
    const item = document.createElement("span");
    const roll = Math.random();
    let text = "";
    if (roll < 0.34) {
      text = driftNotes[Math.floor(Math.random() * driftNotes.length)];
      item.className = "drift-item drift-note";
    } else if (roll < 0.67) {
      text = sqlSnippets[Math.floor(Math.random() * sqlSnippets.length)];
      item.className = "drift-item drift-sql";
    } else {
      text = pySnippets[Math.floor(Math.random() * pySnippets.length)];
      item.className = "drift-item drift-py";
    }

    const color = driftColors[Math.floor(Math.random() * driftColors.length)];
    const left = Math.random() * 100;
    const driftX = (Math.random() * 2 - 1) * 40;

    item.textContent = text;
    item.style.left = `${left}%`;
    item.style.color = color;
    item.style.setProperty("--drift-x", `${driftX}px`);
    driftLayer.appendChild(item);

    setTimeout(() => {
      item.remove();
    }, 16500);

    const delay = 6500 + Math.random() * 8000;
    setTimeout(spawnDriftItem, delay);
  };

  const initialDelay = 1500 + Math.random() * 2000;
  setTimeout(spawnDriftItem, initialDelay);
}
