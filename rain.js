// ═══ Falling Water / Rain Background ═══
(function () {
  const canvas = document.getElementById('rainCanvas');
  const ctx = canvas.getContext('2d');

  let drops = [];
  const DROP_COUNT = 180;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    initDrops();
  });

  // A single raindrop
  function Drop() {
    this.reset(true);
  }

  Drop.prototype.reset = function (initial) {
    this.x = Math.random() * canvas.width;
    // On init spread drops across full height; on respawn start from top
    this.y = initial ? Math.random() * canvas.height : -20;
    this.length = 10 + Math.random() * 20;   // streak length
    this.speed = 6 + Math.random() * 10;     // fall speed
    this.width = 0.5 + Math.random() * 1.2;  // streak width
    this.opacity = 0.15 + Math.random() * 0.45;
    // Slight angle (wind drift)
    this.angle = 0.1 + Math.random() * 0.15;
  };

  function initDrops() {
    drops = [];
    for (let i = 0; i < DROP_COUNT; i++) {
      drops.push(new Drop());
    }
  }
  initDrops();

  // Splash particles pool
  let splashes = [];

  function Splash(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        vx: (Math.random() - 0.5) * 3,
        vy: -(Math.random() * 2 + 1),
        life: 1,
        decay: 0.06 + Math.random() * 0.06,
      });
    }
  }

  function draw() {
    // Fade trail — reads current theme color
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? 'rgba(10, 10, 18, 0.3)' : 'rgba(245, 245, 240, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drops.forEach((d, i) => {
      // Draw streak
      const dx = Math.sin(d.angle) * d.length;
      const dy = Math.cos(d.angle) * d.length;

      const grad = ctx.createLinearGradient(d.x, d.y, d.x + dx, d.y + dy);
      grad.addColorStop(0, `rgba(80, 30, 160, 0)`);
      grad.addColorStop(0.5, `rgba(100, 50, 190, ${d.opacity})`);
      grad.addColorStop(1, `rgba(120, 70, 210, ${d.opacity * 0.6})`);

      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + dx, d.y + dy);
      ctx.strokeStyle = grad;
      ctx.lineWidth = d.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Move drop
      d.x += Math.sin(d.angle) * d.speed;
      d.y += Math.cos(d.angle) * d.speed;

      // Hit bottom — spawn splash, reset
      if (d.y > canvas.height + 20) {
        splashes.push(new Splash(d.x, canvas.height - 2));
        d.reset(false);
      }
    });

    // Draw & age splashes
    splashes = splashes.filter(s => {
      s.particles = s.particles.filter(p => {
        ctx.beginPath();
        ctx.arc(s.x + p.vx * 4, s.y + p.vy * 4, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 50, 190, ${p.life * 0.4})`;
        ctx.fill();
        p.vx *= 0.9;
        p.vy += 0.15; // gravity
        p.life -= p.decay;
        return p.life > 0;
      });
      return s.particles.length > 0;
    });

    requestAnimationFrame(draw);
  }

  draw();
})();
