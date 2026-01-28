const storageKey = "theme";
const iuModeKey = "iu-mode";
const toggle = document.getElementById("theme-toggle");
const iuToggle = document.getElementById("iu-toggle");
const stateLabel = document.getElementById("theme-state");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
let iuMode = localStorage.getItem(iuModeKey) === "true";
let spawnDriftItemNow = null;

const updateModeLabel = (mode) => {
  toggle.setAttribute("aria-pressed", mode === "dark");
  stateLabel.textContent = mode === "dark" ? "DARK" : mode === "iu" ? "IU" : "LIGHT";
};

const applyBaseTheme = (mode, persist = true) => {
  document.body.dataset.theme = mode;
  updateModeLabel(mode);
  if (persist) {
    localStorage.setItem(storageKey, mode);
  }
};

const setIuMode = (enabled, persist = true) => {
  iuMode = enabled;
  if (iuToggle) {
    iuToggle.setAttribute("aria-pressed", enabled);
  }

  if (enabled) {
    document.body.dataset.theme = "iu";
    updateModeLabel("iu");
    if (spawnDriftItemNow) {
      spawnDriftItemNow();
    }
  } else {
    const storedTheme = localStorage.getItem(storageKey);
    const baseTheme = storedTheme || (prefersDark.matches ? "dark" : "light");
    applyBaseTheme(baseTheme, false);
  }

  if (persist) {
    localStorage.setItem(iuModeKey, enabled ? "true" : "false");
  }
};

const storedTheme = localStorage.getItem(storageKey);
const initialTheme = storedTheme || (prefersDark.matches ? "dark" : "light");
if (iuMode) {
  setIuMode(true, false);
} else {
  applyBaseTheme(initialTheme, false);
}

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem(storageKey) && !iuMode) {
    applyBaseTheme(event.matches ? "dark" : "light", false);
  }
});

toggle.addEventListener("click", () => {
  if (iuMode) {
    setIuMode(false, true);
    return;
  }
  const nextMode = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyBaseTheme(nextMode, true);
});

if (iuToggle) {
  iuToggle.addEventListener("click", () => {
    setIuMode(!iuMode, true);
  });
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

const portrait = document.querySelector(".portrait");
if (portrait) {
  const noteGlyphs = ["♪", "♫", "♩"];
  const defaultNoteColors = ["#5bb6ff", "#8b6bff", "#c24bff"];
  const iuNoteColors = ["#990000", "#edebeb", "#b31217"];
  const getNoteColors = () =>
    document.body.dataset.theme === "iu" ? iuNoteColors : defaultNoteColors;

  portrait.addEventListener("click", () => {
    const noteColors = getNoteColors();
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
  const iuChants = ["GO IU!!", "HOOSIERS!!", "HOO HOO HOOSIERS!"];

  const spawnDriftItem = () => {
    const item = document.createElement("span");
    const isIU = document.body.dataset.theme === "iu";
    let text = "";
    if (isIU) {
      text = iuChants[Math.floor(Math.random() * iuChants.length)];
      item.className = "drift-item drift-iu";
      const trident = document.createElement("img");
      trident.src = "_Pictures/White_Trident.png";
      trident.alt = "";
      trident.className = "iu-drift-trident";
      item.appendChild(trident);
    } else {
      const roll = Math.random();
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
    }

    const left = Math.random() * 100;
    const driftX = (Math.random() * 2 - 1) * 40;

    item.textContent = text;
    item.style.left = `${left}%`;
    if (!isIU) {
      const color = driftColors[Math.floor(Math.random() * driftColors.length)];
      item.style.color = color;
    }
    item.style.setProperty("--drift-x", `${driftX}px`);
    driftLayer.appendChild(item);

    setTimeout(() => {
      item.remove();
    }, 16500);

    const delay = isIU ? 2200 + Math.random() * 2500 : 6500 + Math.random() * 8000;
    setTimeout(spawnDriftItem, delay);
  };

  const initialDelay = 1500 + Math.random() * 2000;
  setTimeout(spawnDriftItem, initialDelay);
  spawnDriftItemNow = spawnDriftItem;
}

document.addEventListener("keydown", (event) => {
  if (!event.ctrlKey || event.key.toLowerCase() !== "i") {
    return;
  }

  const target = event.target;
  const tag = target && target.tagName;
  if (target && (target.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT")) {
    return;
  }

  event.preventDefault();
  setIuMode(!iuMode, true);
});

const playButtons = document.querySelectorAll(".play-toggle");
if (playButtons.length > 0) {
  let currentAudio = null;
  let currentButton = null;

  const resetButton = (button) => {
    button.setAttribute("aria-pressed", "false");
    button.classList.remove("is-playing");
    const label = button.querySelector(".play-label");
    if (label) {
      label.textContent = "Play";
    }
    const icon = button.querySelector(".play-icon");
    if (icon) {
      icon.textContent = "▶";
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if (currentButton) {
      resetButton(currentButton);
      currentButton = null;
    }
  };

  playButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const src = button.dataset.audioSrc;
      if (!src) {
        return;
      }

      if (currentButton === button) {
        stopAudio();
        return;
      }

      stopAudio();

      const audio = new Audio(src);
      audio.preload = "metadata";
      currentAudio = audio;
      currentButton = button;
      button.setAttribute("aria-pressed", "true");
      button.classList.add("is-playing");

      const icon = button.querySelector(".play-icon");
      if (icon) {
        icon.textContent = "■";
      }

      const label = button.querySelector(".play-label");
      if (label) {
        label.textContent = "Stop";
      }

      audio.addEventListener("ended", () => {
        if (currentButton === button) {
          stopAudio();
        }
      });

      audio.play().catch(() => {
        stopAudio();
      });
    });
  });
}
