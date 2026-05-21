let canvas, container;
let bubbles = [];

function setup() {
  container = document.getElementById('p5-header');
  const w = container ? container.offsetWidth : window.innerWidth;
  const h = container ? max(container.offsetHeight, 180) : 220;
  canvas = createCanvas(w, h);
  canvas.parent('p5-header');
  canvas.style('position', 'absolute');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '0');
  canvas.elt.style.pointerEvents = 'none';
  clear();
  pixelDensity(min(2, window.devicePixelRatio || 1));

  const count = Math.max(10, Math.floor(width / 80));
  for (let i = 0; i < count; i++) {
    bubbles.push(new Bubble());
  }
}

function draw() {
  clear(); // transparent background so header color shows

  for (let b of bubbles) {
    b.update();
    b.draw();
  }
}

function windowResized() {
  const w = container ? container.offsetWidth : window.innerWidth;
  const h = container ? max(container.offsetHeight, 180) : 220;
  resizeCanvas(w, h);
}

class Bubble {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.size = random(12, 48);
    this.x = random(0, width);
    this.y = initial ? random(0, height) : random(height + 10, height + 220);
    this.speed = random(0.25, 1.2);
    this.alpha = random(160, 255);
    // slight color variation around pink
    this.r = 255;
    this.g = random(35, 120);
    this.b = random(130, 210);
    this.rotation = random(TWO_PI);
    this.wobble = random(0.3, 1.6);
    this.offset = random(0, TWO_PI);
  }

  update() {
    this.y -= this.speed;
    this.x += sin((frameCount * 0.01) * this.wobble + this.offset) * 0.6;
    if (this.y + this.size < -60) this.reset(false);
  }

  draw() {
    noStroke();
    // subtle outer glow
    for (let i = 4; i > 0; i--) {
      const a = (this.alpha / 255) * (0.08 * i);
      fill(this.r, this.g, this.b, a * 255);
      ellipse(this.x, this.y, this.size * (1 + i * 0.18));
    }
    // main bubble
    fill(this.r, this.g, this.b, this.alpha);
    ellipse(this.x, this.y, this.size);
    // highlight
    fill(255, 255, 255, 200);
    ellipse(this.x - this.size * 0.18, this.y - this.size * 0.18, this.size * 0.25);
  }
}
