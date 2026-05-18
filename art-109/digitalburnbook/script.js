// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme FIRST before anything else
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);
  
  initBurnBook();
  initThemeToggle();
});

// ====== BURN BOOK FUNCTIONALITY ======
function initBurnBook() {
  const burnButton = document.getElementById('burn-button');
  const entryArea = document.getElementById('entry-area');
  const particleStage = document.getElementById('particle-stage');
  const bookContainer = document.getElementById('book-container');

  if (burnButton) {
    burnButton.addEventListener('click', () => {
      if (entryArea.value.trim()) {
        // Create particles FIRST to show text dissolving
        createParticles(particleStage);
        
        // Clear textarea after a short delay
        setTimeout(() => {
          entryArea.value = '';
        }, 200);
        
        burnButton.disabled = true;
        setTimeout(() => {
          burnButton.disabled = false;
        }, 1500);

        // Trigger page flip after particles start
        setTimeout(() => {
          bookContainer.classList.add('flip');
          setTimeout(() => {
            bookContainer.classList.remove('flip');
          }, 1000);
        }, 300);
      }
    });
  }
}

function createParticles(stage) {
  const particleCount = 48;
  const colors = ['#ff6b6b', '#ff8e72', '#ffa757', '#ff4500', '#e34f2a'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomX = (Math.random() - 0.5) * 200;
    
    particle.style.setProperty('--tx', `${randomX}px`);
    particle.style.background = randomColor;
    particle.style.width = Math.random() * 8 + 4 + 'px';
    particle.style.height = particle.style.width;
    
    stage.appendChild(particle);
    
    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  }
}

// ====== THEME TOGGLE ======
function initThemeToggle() {
  const darkBtn = document.getElementById('dark-mode-btn');
  const lightBtn = document.getElementById('light-mode-btn');

  if (!darkBtn || !lightBtn) {
    console.error('Theme buttons not found');
    return;
  }

  darkBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Dark button clicked');
    applyTheme('dark');
    localStorage.setItem('theme', 'dark');
  });

  lightBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Light button clicked');
    applyTheme('light');
    localStorage.setItem('theme', 'light');
  });
}

function applyTheme(theme) {
  const body = document.body;
  console.log('Applying theme:', theme);
  
  body.classList.remove('dark-mode', 'light-mode');
  
  if (theme === 'light') {
    body.classList.add('light-mode');
    console.log('Light mode applied');
  } else {
    body.classList.add('dark-mode');
    console.log('Dark mode applied');
  }
}
const lightBtn = document.querySelector('.light-btn');
const darkBtn = document.querySelector('.dark-btn');

lightBtn.addEventListener('click', () => {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
});

darkBtn.addEventListener('click', () => {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
});

