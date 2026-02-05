const storageKey = "theme";
const toggle = document.getElementById("theme-toggle");
const iuInline = document.getElementById("iu-inline");
const stateLabel = document.getElementById("theme-state");
const themes = ["dark", "light", "iu"];
let spawnDriftItemNow = null;

const updateModeLabel = (mode) => {
  toggle.setAttribute("aria-pressed", mode === "dark");
  stateLabel.textContent = mode === "dark" ? "DARK" : mode === "iu" ? "IU" : "LIGHT";
};

const applyTheme = (mode, persist = true) => {
  document.body.dataset.theme = mode;
  updateModeLabel(mode);
  if (persist) {
    localStorage.setItem(storageKey, mode);
  }
  if (mode === "iu" && spawnDriftItemNow) {
    spawnDriftItemNow();
  }
};

const storedTheme = localStorage.getItem(storageKey);
const legacyIu = localStorage.getItem("iu-mode") === "true";
const initialTheme = themes.includes(storedTheme) ? storedTheme : legacyIu ? "iu" : "dark";
applyTheme(initialTheme, false);

toggle.addEventListener("click", () => {
  const current = document.body.dataset.theme;
  const index = themes.indexOf(current);
  const nextMode = index === -1 ? themes[0] : themes[(index + 1) % themes.length];
  applyTheme(nextMode, true);
});

if (iuInline) {
  iuInline.addEventListener("click", () => {
    if (document.body.dataset.theme === "iu") {
      applyTheme("dark", true);
      return;
    }
    if (window.confirm("Do you want to enter IU mode?")) {
      applyTheme("iu", true);
    }
  });
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

const featureCards = document.querySelectorAll(".feature-card");
if (featureCards.length > 0) {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-inview", entry.isIntersecting);
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );

    featureCards.forEach((card) => observer.observe(card));
  } else {
    featureCards.forEach((card) => card.classList.add("is-inview"));
  }
}

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
      trident.src = "Pictures_/White_Trident.png";
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
  if (document.body.dataset.theme === "iu") {
    applyTheme("dark", true);
  } else {
    applyTheme("iu", true);
  }
});

const playButtons = document.querySelectorAll(".play-toggle");
if (playButtons.length > 0) {
  let currentAudio = null;
  let currentButton = null;
  const volumeSlider = document.getElementById("volume-slider");
  let volumeLevel = volumeSlider ? Number(volumeSlider.value || 0) / 100 : 0;
  let audioContext = null;
  let gainNode = null;
  let mediaSource = null;
  let useWebAudio = false;

  const updateVolumeFill = (value) => {
    if (!volumeSlider) {
      return;
    }
    const clamped = Math.min(Math.max(Number(value) || 0, 0), 100);
    const styles = getComputedStyle(volumeSlider);
    const colorA = styles.getPropertyValue("--volume-a").trim() || "rgba(10, 180, 160, 0.65)";
    const colorB = styles.getPropertyValue("--volume-b").trim() || "rgba(26, 108, 186, 0.75)";
    const colorBg = styles.getPropertyValue("--volume-bg").trim() || "#0b0b0d";
    volumeSlider.style.setProperty("--volume-fill", `${clamped}%`);
    volumeSlider.style.background = `linear-gradient(90deg, ${colorA} 0%, ${colorB} ${clamped}%, ${colorBg} ${clamped}%, ${colorBg} 100%)`;
  };

  const ensureAudioContext = () => {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
        gainNode = audioContext.createGain();
        gainNode.gain.value = volumeLevel;
        gainNode.connect(audioContext.destination);
      }
    }
  };

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
    if (mediaSource) {
      mediaSource.disconnect();
      mediaSource = null;
    }
    useWebAudio = false;
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

      ensureAudioContext();
      const audio = new Audio(src);
      audio.preload = "metadata";
      audio.volume = 1;
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

      if (audioContext && audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
      }

      if (audioContext && gainNode) {
        try {
          mediaSource = audioContext.createMediaElementSource(audio);
          mediaSource.connect(gainNode);
          useWebAudio = true;
        } catch {
          mediaSource = null;
          useWebAudio = false;
        }
      }

      if (!useWebAudio) {
        audio.volume = volumeLevel;
      }

      audio.play().catch(() => {
        stopAudio();
      });
    });
  });

  if (volumeSlider) {
    updateVolumeFill(volumeSlider.value);
    volumeSlider.addEventListener("input", (event) => {
      const value = Number(event.target.value || 0);
      volumeLevel = Math.min(Math.max(value, 0), 100) / 100;
      updateVolumeFill(value);
      if (useWebAudio && gainNode) {
        gainNode.gain.value = volumeLevel;
      } else if (currentAudio) {
        currentAudio.volume = volumeLevel;
      }
    });
  }
}
