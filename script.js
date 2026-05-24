// Hamburger menu toggle
const hamburger = document.querySelector('.nav-hamburger');
const drawer = document.querySelector('.nav-drawer');
hamburger.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});
// Close drawer when a link is clicked
drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Filter pills – services
document.querySelectorAll('.svc-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.svc-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Dept tabs – team
document.querySelectorAll('.dept-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.dept-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Smooth active nav on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('nav-active', a.getAttribute('href') === '#' + cur);
  });
});

// 3D cinematic tilt on nav logo
const logoWrap = document.querySelector('.nav-logo');
const logoTilt = document.querySelector('.nav-logo-tilt');
if (logoWrap && logoTilt) {
  logoWrap.addEventListener('mousemove', (e) => {
    const rect = logoWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    logoTilt.style.animation = 'none';
    logoTilt.style.transform =
      'rotateX(' + (-dy * 24).toFixed(2) + 'deg) rotateY(' + (dx * 24).toFixed(2) + 'deg) scale(1.1) translateZ(10px)';
  });
  logoWrap.addEventListener('mouseleave', () => {
    logoTilt.style.animation = '';
    logoTilt.style.transform = '';
  });
}

// Theme (no toggle UI — voice assistant can still switch via applyTheme)
window.applyTheme = function (theme) {
  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
  localStorage.setItem('mentroid-theme', theme === 'light' ? 'light' : 'dark');
};
applyTheme(localStorage.getItem('mentroid-theme') || 'dark');

// ══ 3D BACKGROUND ANIMATION ══
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes, animId;
  const NODE_COUNT = 90;
  const MAX_DIST = 180;
  const NODE_SPEED = 0.42;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Colour helpers ── */
  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  function palette() {
    return isDark()
      ? { node: 'rgba(167,139,250,', line: 'rgba(124,58,237,', accent: 'rgba(96,165,250,', nodeAlpha: 0.9, lineAlpha: 0.55 }
      : { node: 'rgba(8,145,178,', line: 'rgba(38,151,237,', accent: 'rgba(107,237,224,', nodeAlpha: 0.85, lineAlpha: 0.50 };
  }

  /* ── Node factory ── */
  function makeNode() {
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.3 + Math.random() * 0.7) * NODE_SPEED;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 1.2 + Math.random() * 2.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.018 + Math.random() * 0.025,
      /* 3-D depth illusion */
      z: 0.4 + Math.random() * 0.6,
    };
  }

  function init() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, makeNode);
  }

  /* ── Draw one frame ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const p = palette();

    /* update */
    nodes.forEach(n => {
      n.x += n.vx * n.z;
      n.y += n.vy * n.z;
      n.pulse += n.pulseSpeed;

      /* wrap */
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
    });

    /* lines */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * (p.lineAlpha || 0.55) * Math.min(a.z, b.z);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          /* slight curve for organic feel */
          const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.08;
          const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.08;
          ctx.quadraticCurveTo(mx, my, b.x, b.y);
          ctx.strokeStyle = p.line + alpha + ')';
          ctx.lineWidth = 0.7 * Math.min(a.z, b.z);
          ctx.stroke();
        }
      }
    }

    /* nodes */
    nodes.forEach(n => {
      const glow = 1 + 0.35 * Math.sin(n.pulse);
      const r = n.r * n.z * glow;
      const alpha = (p.nodeAlpha || 0.9) * (0.7 + 0.3 * Math.sin(n.pulse));

      /* outer glow */
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
      grad.addColorStop(0, p.node + (alpha * 0.7) + ')');
      grad.addColorStop(0.4, p.accent + (alpha * 0.25) + ')');
      grad.addColorStop(1, p.node + '0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      /* core dot */
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = p.node + alpha + ')';
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  /* ── Mouse parallax ── */
  let mx = W / 2, my = H / 2;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    nodes.forEach((n, i) => {
      if (i % 4 === 0) {
        const dx = (mx - W / 2) / W;
        const dy = (my - H / 2) / H;
        n.vx += dx * 0.012 * n.z;
        n.vy += dy * 0.012 * n.z;
        /* clamp speed */
        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (spd > NODE_SPEED * 2.5) { n.vx *= 0.92; n.vy *= 0.92; }
      }
    });
  });

  /* ── Scroll depth effect ── */
  window.addEventListener('scroll', () => {
    const ratio = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    canvas.style.opacity = isDark()
      ? (0.85 - ratio * 0.15).toFixed(2)
      : (0.65 - ratio * 0.12).toFixed(2);
  });

  /* ── Theme change ── */
  const observer = new MutationObserver(() => {
    /* colours update automatically via palette() */
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  window.addEventListener('resize', () => { resize(); });

  init();
  draw();
})();
