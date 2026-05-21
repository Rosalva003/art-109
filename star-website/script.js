const canvas = document.getElementById("star-trail");
const ctx = canvas.getContext("2d");
const themeToggle = document.getElementById("theme-toggle");
const paletteEl = document.getElementById("palette");
const shapePickerEl = document.getElementById("shape-picker");
const root = document.documentElement;

const particles = [];
const maxParticles = 80;
let mouseX = -100;
let mouseY = -100;
let lastSpawn = 0;
let starColors = ["#ff6eb4", "#ff8ec8", "#ffb3d9", "#ff4da6"];
let starGlow = "#ff6eb4";
let activeShape = "star";

const shapes = {
    star: { icon: "★", label: "Star" },
    heart: { icon: "♥", label: "Heart" },
    moon: { icon: "☽", label: "Crescent moon" },
    circle: { icon: "●", label: "Circle" },
    diamond: { icon: "◆", label: "Diamond" },
};

const palettes = {
    pink: {
        swatch: "#ff6eb4",
        stars: ["#ff6eb4", "#ff8ec8", "#ffb3d9", "#ff4da6"],
        glow: "#ff6eb4",
        accentGlow: "rgba(255, 110, 180, 0.45)",
        skyTopDark: "#0a0618",
        skyBottomDark: "#1a1035",
        skyTopLight: "#fce8f4",
        skyBottomLight: "#e8d4ff",
        cloud1Dark: "rgba(120, 80, 180, 0.35)",
        cloud2Dark: "rgba(255, 110, 180, 0.28)",
        cloud3Dark: "rgba(60, 120, 200, 0.3)",
        cloud1Light: "rgba(255, 182, 220, 0.55)",
        cloud2Light: "rgba(200, 160, 255, 0.45)",
        cloud3Light: "rgba(180, 220, 255, 0.5)",
        toggleBorder: "rgba(255, 182, 220, 0.35)",
    },
    lavender: {
        swatch: "#b794f6",
        stars: ["#b794f6", "#d6bcfa", "#e9d8fd", "#9f7aea"],
        glow: "#b794f6",
        accentGlow: "rgba(183, 148, 246, 0.45)",
        skyTopDark: "#12081f",
        skyBottomDark: "#2a1845",
        skyTopLight: "#f3ebff",
        skyBottomLight: "#ddd6fe",
        cloud1Dark: "rgba(159, 122, 234, 0.35)",
        cloud2Dark: "rgba(183, 148, 246, 0.3)",
        cloud3Dark: "rgba(100, 80, 180, 0.28)",
        cloud1Light: "rgba(221, 214, 254, 0.6)",
        cloud2Light: "rgba(196, 181, 253, 0.5)",
        cloud3Light: "rgba(167, 139, 250, 0.4)",
        toggleBorder: "rgba(183, 148, 246, 0.4)",
    },
    ocean: {
        swatch: "#5eead4",
        stars: ["#5eead4", "#99f6e4", "#2dd4bf", "#38bdf8"],
        glow: "#5eead4",
        accentGlow: "rgba(94, 234, 212, 0.45)",
        skyTopDark: "#041018",
        skyBottomDark: "#0c2a3a",
        skyTopLight: "#e0f7fa",
        skyBottomLight: "#b2ebf2",
        cloud1Dark: "rgba(56, 189, 248, 0.3)",
        cloud2Dark: "rgba(94, 234, 212, 0.28)",
        cloud3Dark: "rgba(14, 116, 144, 0.35)",
        cloud1Light: "rgba(178, 235, 242, 0.6)",
        cloud2Light: "rgba(128, 222, 234, 0.5)",
        cloud3Light: "rgba(77, 182, 172, 0.4)",
        toggleBorder: "rgba(94, 234, 212, 0.4)",
    },
    sunset: {
        swatch: "#fb923c",
        stars: ["#fb923c", "#fdba74", "#f472b6", "#fbbf24"],
        glow: "#fb923c",
        accentGlow: "rgba(251, 146, 60, 0.45)",
        skyTopDark: "#1a0808",
        skyBottomDark: "#3d1520",
        skyTopLight: "#fff1e6",
        skyBottomLight: "#fecdd3",
        cloud1Dark: "rgba(251, 146, 60, 0.32)",
        cloud2Dark: "rgba(244, 114, 182, 0.28)",
        cloud3Dark: "rgba(220, 80, 60, 0.3)",
        cloud1Light: "rgba(254, 215, 170, 0.6)",
        cloud2Light: "rgba(251, 207, 232, 0.5)",
        cloud3Light: "rgba(252, 211, 77, 0.4)",
        toggleBorder: "rgba(251, 146, 60, 0.4)",
    },
    mint: {
        swatch: "#6ee7b7",
        stars: ["#6ee7b7", "#a7f3d0", "#34d399", "#86efac"],
        glow: "#6ee7b7",
        accentGlow: "rgba(110, 231, 183, 0.45)",
        skyTopDark: "#061210",
        skyBottomDark: "#0f2a22",
        skyTopLight: "#ecfdf5",
        skyBottomLight: "#d1fae5",
        cloud1Dark: "rgba(52, 211, 153, 0.3)",
        cloud2Dark: "rgba(110, 231, 183, 0.28)",
        cloud3Dark: "rgba(20, 120, 90, 0.32)",
        cloud1Light: "rgba(209, 250, 229, 0.6)",
        cloud2Light: "rgba(167, 243, 208, 0.5)",
        cloud3Light: "rgba(134, 239, 172, 0.4)",
        toggleBorder: "rgba(110, 231, 183, 0.4)",
    },
    gold: {
        swatch: "#fbbf24",
        stars: ["#fbbf24", "#fde68a", "#f59e0b", "#fcd34d"],
        glow: "#fbbf24",
        accentGlow: "rgba(251, 191, 36, 0.45)",
        skyTopDark: "#141008",
        skyBottomDark: "#2a2210",
        skyTopLight: "#fffbeb",
        skyBottomLight: "#fef3c7",
        cloud1Dark: "rgba(251, 191, 36, 0.3)",
        cloud2Dark: "rgba(245, 158, 11, 0.28)",
        cloud3Dark: "rgba(180, 120, 40, 0.3)",
        cloud1Light: "rgba(254, 243, 199, 0.65)",
        cloud2Light: "rgba(253, 230, 138, 0.5)",
        cloud3Light: "rgba(252, 211, 77, 0.45)",
        toggleBorder: "rgba(251, 191, 36, 0.4)",
    },
};

let activePalette = "pink";

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function applyPalette(name) {
    const p = palettes[name];
    if (!p) return;

    activePalette = name;
    starColors = p.stars;
    starGlow = p.glow;
    window.__starPaletteColors = p.stars;

    const isLight = root.getAttribute("data-theme") === "light";

    root.style.setProperty("--accent-glow", p.accentGlow);
    root.style.setProperty("--sky-top", isLight ? p.skyTopLight : p.skyTopDark);
    root.style.setProperty("--sky-bottom", isLight ? p.skyBottomLight : p.skyBottomDark);
    root.style.setProperty("--cloud-1", isLight ? p.cloud1Light : p.cloud1Dark);
    root.style.setProperty("--cloud-2", isLight ? p.cloud2Light : p.cloud2Dark);
    root.style.setProperty("--cloud-3", isLight ? p.cloud3Light : p.cloud3Dark);
    root.style.setProperty("--toggle-border", p.toggleBorder);

    paletteEl.querySelectorAll(".palette-swatch").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.palette === name);
    });

    localStorage.setItem("star-website-palette", name);

    window.dispatchEvent(
        new CustomEvent("palette-change", { detail: { colors: p.stars, glow: p.glow } })
    );
}

function buildPalette() {
    Object.entries(palettes).forEach(([name, p]) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "palette-swatch";
        btn.dataset.palette = name;
        btn.style.background = p.swatch;
        btn.setAttribute("aria-label", name);
        btn.addEventListener("click", () => applyPalette(name));
        paletteEl.appendChild(btn);
    });
}

function applyShape(name) {
    if (!shapes[name]) return;
    activeShape = name;
    shapePickerEl.querySelectorAll(".shape-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.shape === name);
    });
    localStorage.setItem("star-website-shape", name);
}

function buildShapePicker() {
    Object.entries(shapes).forEach(([name, s]) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "shape-btn";
        btn.dataset.shape = name;
        btn.textContent = s.icon;
        btn.setAttribute("aria-label", s.label);
        btn.addEventListener("click", () => applyShape(name));
        shapePickerEl.appendChild(btn);
    });
}

function spawnParticle(x, y) {
    const size = 14 + Math.random() * 22;
    particles.push({
        x: x + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 18,
        size,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.08,
        life: 1,
        decay: 0.012 + Math.random() * 0.018,
        color: starColors[Math.floor(Math.random() * starColors.length)],
    });

    if (particles.length > maxParticles) {
        particles.shift();
    }
}

function traceStar(size) {
    const spikes = 5;
    const outer = size;
    const inner = size * 0.4;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outer : inner;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

function traceHeart(size) {
    const s = size * 0.95;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(0, -s * 0.15, -s * 1.1, -s * 0.55, 0, -s);
    ctx.bezierCurveTo(s * 1.1, -s * 0.55, 0, -s * 0.15, 0, s * 0.35);
    ctx.closePath();
}

function traceMoon(size) {
    const r = size;
    ctx.beginPath();
    ctx.arc(-r * 0.15, 0, r, -Math.PI / 2, Math.PI / 2);
    ctx.arc(r * 0.4, 0, r * 0.78, Math.PI / 2, -Math.PI / 2, true);
    ctx.closePath();
}

function traceCircle(size) {
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
}

function traceDiamond(size) {
    const s = size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.75, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 0.75, 0);
    ctx.closePath();
}

const shapeDrawers = {
    star: traceStar,
    heart: traceHeart,
    moon: traceMoon,
    circle: traceCircle,
    diamond: traceDiamond,
};

function drawParticle(x, y, size, rotation, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = starGlow;
    ctx.shadowBlur = 16;

    const drawer = shapeDrawers[activeShape] || traceStar;
    drawer(size);

    ctx.fill();

    ctx.restore();
}

function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (time - lastSpawn > 24) {
        spawnParticle(mouseX, mouseY);
        lastSpawn = time;
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const s = particles[i];
        s.life -= s.decay;
        s.rotation += s.spin;
        s.y -= 0.3;

        if (s.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        drawParticle(s.x, s.y, s.size * s.life, s.rotation, s.color, s.life);
    }

    requestAnimationFrame(animate);
}

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener("touchmove", (e) => {
    if (e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
}, { passive: true });

function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("star-website-theme", theme);
    applyPalette(activePalette);
}

function initTheme() {
    const saved = localStorage.getItem("star-website-theme");
    if (saved === "light" || saved === "dark") {
        setTheme(saved);
        return;
    }
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    setTheme(prefersLight ? "light" : "dark");
}

function initPalette() {
    const saved = localStorage.getItem("star-website-palette");
    const name = palettes[saved] ? saved : "pink";
    applyPalette(name);
}

function initShape() {
    const saved = localStorage.getItem("star-website-shape");
    const name = shapes[saved] ? saved : "star";
    applyShape(name);
}

themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
});

window.addEventListener("resize", resizeCanvas);

buildShapePicker();
buildPalette();
resizeCanvas();
initTheme();
initPalette();
initShape();
requestAnimationFrame(animate);
