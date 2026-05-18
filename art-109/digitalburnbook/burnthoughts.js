function burnThoughts() {
  const fireOverlay = document.getElementById('fireOverlay');
  const entryText = document.getElementById('entryText');
  const smokeContainer = document.getElementById('smokeContainer');

  // 1. Start the fire sweep animation
  fireOverlay.classList.remove('fire-sweep'); // Reset if already used
  void fireOverlay.offsetWidth; // Trigger a reflow to restart animation
  fireOverlay.classList.add('fire-sweep');

  // 2. Halfway through the fire (around 800ms), fade the text and start smoke
  setTimeout(() => {
    entryText.style.opacity = '0';
    
    // Spawn multiple smoke particles over a brief window
    let smokeInterval = setInterval(() => {
      createSmokeParticle(smokeContainer);
    }, 80);

    // Stop making smoke after 1.5 seconds
    setTimeout(() => {
      clearInterval(smokeInterval);
    }, 1500);

  }, 800); 
}

// Function to generate a single random drifting smoke puff
function createSmokeParticle(container) {
  const smoke = document.createElement('div');
  smoke.classList.add('smoke-particle');

  // Randomize size between 30px and 70px
  const size = Math.random() * 40 + 30;
  smoke.style.width = `${size}px`;
  smoke.style.height = `${size}px`;

  // Randomize horizontal starting position across the notebook
  smoke.style.left = `${Math.random() * 80 + 10}%`;

  // Randomize how far left or right the smoke drifts as it goes up
  const driftX = (Math.random() - 0.5) * 60; // gives a range between -30px and 30px
  smoke.style.setProperty('--drift-x', `${driftX}px`);

  container.appendChild(smoke);

  // Clean up the element after its CSS animation finishes
  setTimeout(() => {
    smoke.remove();
  }, 3000);
}
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the window dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Track the mouse position
const mouse = {
    x: null,
    y: null,
    radius: 100 // How close the mouse needs to be to push particles
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Clear mouse coordinates when it leaves the window
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Class Definition
class Ember {
    constructor() {
        this.reset();
        // Stagger their initial vertical positions so they don't all spawn at once
        this.y = Math.random() * canvas.height; 
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20; // Spawn just below screen
        this.size = Math.random() * 3 + 1; // Random size (1px to 4px)
        this.speedY = Math.random() * 1 + 0.5; // Upward drift speed
        this.speedX = (Math.random() - 0.5) * 0.5; // Faint side-to-side sway
        this.alpha = Math.random() * 0.5 + 0.2; // Opacity (0.2 to 0.7)
        this.fadeSpeed = Math.random() * 0.002 + 0.001;
    }

    update() {
        // Basic floating physics
        this.y -= this.speedY;
        this.x += this.speedX;
        this.alpha -= this.fadeSpeed; // Gradually fade as they rise

        // --- INTERACTIVE MOUSE INTERACTION ---
        if (mouse.x != null && mouse.y != null) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distance = Math.hypot(dx, dy); // Distance formula

            if (distance < mouse.radius) {
                // Calculate push force based on closeness
                let force = (mouse.radius - distance) / mouse.radius;
                let forceX = (dx / distance) * force * 3;
                let forceY = (dy / distance) * force * 3;

                this.x += forceX;
                this.y += forceY;
            }
        }

        // Reset particle if it goes off screen or fully fades out
        if (this.y < 0 || this.alpha <= 0 || this.x < 0 || this.x > canvas.width) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Ember glow style (Orange/Red tint)
        ctx.fillStyle = `rgba(255, 120, 40, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgb(255, 68, 0)';
        
        ctx.fill();
        ctx.restore();
    }
}

// Populate particle array
const particleArray = [];
const numberOfParticles = 100; // Adjust for density vs performance

for (let i = 0; i < numberOfParticles; i++) {
    particleArray.push(new Ember());
}

// Animation Loop
function animate() {
    // Clear canvas with a very slight opacity trail to create motion blur
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
    }
    requestAnimationFrame(animate);
}

animate();