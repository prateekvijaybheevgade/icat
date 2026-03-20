/* ========================================
   iCat Infotech — 3D & Security Animations
   Interactive Particle Network, 3D Cards,
   Scanning Lines, Matrix Rain, Cyber Effects
   ======================================== */

// ── 1. Interactive Particle Network (Hero Canvas) ──
class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.particleCount = 80;
    this.maxDistance = 120;
    this.animFrame = null;

    this.resize();
    this.init();
    this.animate();

    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const time = Date.now() * 0.001;

    // Update & draw particles
    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Mouse interaction — repel particles near cursor
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x += (dx / dist) * force * 2;
          p.y += (dy / dist) * force * 2;
        }
      }

      // Pulsing glow
      const pulse = Math.sin(time * 2 + p.pulsePhase) * 0.3 + 0.7;
      const size = p.size * pulse;

      // Draw particle with glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 106, 0, ${p.opacity * pulse})`;
      this.ctx.fill();

      // Outer glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 106, 0, ${p.opacity * 0.1 * pulse})`;
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const q = this.particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const opacity = (1 - dist / this.maxDistance) * 0.25;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(q.x, q.y);
          this.ctx.strokeStyle = `rgba(255, 106, 0, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }

      // Draw connections to mouse
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const opacity = (1 - dist / this.mouse.radius) * 0.4;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(255, 106, 0, ${opacity})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    });

    this.animFrame = requestAnimationFrame(() => this.animate());
  }
}


// ── 2. 3D Tilt Effect on Cards ──
class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll('.card, .cert-card, .value-card, .solution-card, .office-card');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }
}


// ── 3. Matrix Code Rain (Background Canvas) ──
class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.chars = '01アイウエオカキクケコ{}[]<>ICAT'.split('');
    this.fontSize = 12;
    this.columns = 0;
    this.drops = [];

    this.resize();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array(this.columns).fill(1);
  }

  animate() {
    // Slight fade overlay for trail effect
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = 'rgba(255, 106, 0, 0.12)';
    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);

      if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }

    requestAnimationFrame(() => this.animate());
  }
}


// ── 4. Scanning Line Effect ──
class ScanlineEffect {
  constructor() {
    const scanSections = document.querySelectorAll('.hero, .footprint-section, .team-banner');
    scanSections.forEach(section => {
      const scanline = document.createElement('div');
      scanline.classList.add('cyber-scanline');
      section.style.position = section.style.position || 'relative';
      section.style.overflow = 'hidden';
      section.appendChild(scanline);
    });
  }
}


// ── 5. Floating Security Shield Badge ──
class SecurityBadge {
  constructor() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const badge = document.createElement('div');
    badge.className = 'security-badge';
    badge.innerHTML = `
      <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
      <span>SECURED</span>
    `;
    hero.appendChild(badge);
  }
}


// ── 6. Typing Effect for Hero Subtitle ──
class GlitchText {
  constructor() {
    const accents = document.querySelectorAll('.heading-xl .text-accent');
    accents.forEach(el => {
      el.setAttribute('data-text', el.textContent);
      el.classList.add('glitch-text');
    });
  }
}


// ── 7. Hex Grid Decoration ──
class HexGridDecoration {
  constructor() {
    const sections = document.querySelectorAll('.cert-section');
    sections.forEach(section => {
      const grid = document.createElement('div');
      grid.className = 'hex-grid-bg';
      section.style.position = 'relative';
      section.style.overflow = 'hidden';
      section.appendChild(grid);
    });
  }
}


// ── 8. Cursor Trail Effect ──
class CursorTrail {
  constructor() {
    this.trail = [];
    this.maxTrail = 8;
    document.addEventListener('mousemove', (e) => this.addDot(e));
  }

  addDot(e) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    document.body.appendChild(dot);
    this.trail.push(dot);

    setTimeout(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'scale(0)';
    }, 50);

    setTimeout(() => {
      dot.remove();
      this.trail.shift();
    }, 500);
  }
}


// ── 9. Parallax Depth Effect ──
class ParallaxDepth {
  constructor() {
    this.elements = document.querySelectorAll('.beyond-image, .footprint-map, .about-story-image');
    window.addEventListener('scroll', () => this.update(), { passive: true });
  }

  update() {
    const scrollY = window.pageYOffset;
    this.elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const speed = 0.05;
      const yPos = (rect.top - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${yPos}px) scale(1.02)`;
    });
  }
}


// ── Initialize Everything on DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  // Particle network in hero
  new ParticleNetwork('particleCanvas');

  // Matrix rain background (very subtle)
  new MatrixRain('matrixCanvas');

  // 3D tilt on cards
  new TiltEffect();

  // Scanning line effect
  new ScanlineEffect();

  // Floating security badge
  new SecurityBadge();

  // Glitch text effect
  new GlitchText();

  // Hex grid decoration
  new HexGridDecoration();

  // Cursor trail
  new CursorTrail();

  // Parallax depth
  new ParallaxDepth();

  // ── Number scramble effect on stat numbers ──
  const statNumbers = document.querySelectorAll('.about-stat-number, .beyond-stat .stat-number');
  statNumbers.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const original = el.textContent;
      let iterations = 0;
      const interval = setInterval(() => {
        el.textContent = original.split('').map((char, i) => {
          if (i < iterations) return original[i];
          if (char.match(/[0-9]/)) return Math.floor(Math.random() * 10);
          return char;
        }).join('');
        iterations += 1 / 2;
        if (iterations >= original.length) {
          el.textContent = original;
          clearInterval(interval);
        }
      }, 30);
    });
  });
});
