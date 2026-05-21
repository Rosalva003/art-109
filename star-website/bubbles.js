const bubbles = [];
const BUBBLE_COUNT = 40;
let bubbleColors = ["#ff6eb4", "#ff8ec8", "#ffb3d9", "#ff4da6"];
let motionScale = 1;

function pickBubbleColor() {
    return bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
}

function makeBubble(randomY = false) {
    return {
        x: random(width),
        y: randomY ? random(height) : height + random(20, 120),
        r: random(12, 42),
        speed: random(0.25, 0.85),
        phase: random(TWO_PI),
        wobble: random(0.15, 0.45),
        alpha: random(35, 90),
        color: pickBubbleColor(),
    };
}

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("bubble-canvas");

    motionScale = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

    for (let i = 0; i < BUBBLE_COUNT; i++) {
        bubbles.push(makeBubble(true));
    }

    window.addEventListener("palette-change", (e) => {
        bubbleColors = e.detail.colors;
        bubbles.forEach((b) => {
            b.color = pickBubbleColor();
        });
    });

    if (window.__starPaletteColors) {
        bubbleColors = window.__starPaletteColors;
    }
}

function draw() {
    clear();

    if (motionScale === 0) return;

    noStroke();

    for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];

        const c = color(b.color);
        fill(red(c), green(c), blue(c), b.alpha);

        circle(b.x, b.y, b.r * 2);

        b.y -= b.speed * motionScale;
        b.x += sin(frameCount * 0.015 + b.phase) * b.wobble;

        if (b.y < -b.r) {
            bubbles[i] = makeBubble(false);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
