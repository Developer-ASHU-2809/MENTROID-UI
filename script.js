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

// ── Get Quote Modal ──────────────────────────────────────────────
(function () {
  'use strict';

  const modal     = document.getElementById('quote-modal');
  const closeBtn  = document.getElementById('qmodal-close');
  const form      = document.getElementById('quote-form');
  const submitBtn = document.getElementById('quote-submit');
  const statusEl  = document.getElementById('quote-form-status');
  const pkgInput  = document.getElementById('qf-package');

  if (!modal) return;

  // Open modal
  function openModal(packageName) {
    pkgInput.value = packageName || '';

    // Update package tag in header
    let tag = modal.querySelector('.qmodal-package-tag');
    if (packageName) {
      if (!tag) {
        tag = document.createElement('span');
        tag.className = 'qmodal-package-tag';
        modal.querySelector('.qmodal-header').appendChild(tag);
      }
      tag.textContent = '📦 ' + packageName;
      tag.hidden = false;
    } else if (tag) {
      tag.hidden = true;
    }

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    // Focus first input for accessibility
    setTimeout(() => {
      const first = form.querySelector('input:not([type="hidden"]):not([tabindex="-1"])');
      if (first) first.focus();
    }, 50);
  }

  // Close modal
  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    clearStatus();
  }

  // Trigger buttons on pricing cards
  document.querySelectorAll('.quote-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.dataset.package || '');
    });
  });

  // Close on X button
  closeBtn.addEventListener('click', closeModal);

  // Close on overlay click (outside the box)
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });

  // ── Form submission ──────────────────────────────────────────
  function setStatus(type, message) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.className = 'form-status form-status--' + type;
  }

  function clearStatus() {
    if (!statusEl) return;
    statusEl.hidden = true;
    statusEl.textContent = '';
    statusEl.className = 'form-status';
  }

  function setLoading(loading) {
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? 'Sending…' : 'Send Quote Request';
    }
    form.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(function (el) {
      el.disabled = loading;
    });
  }

  function getValues() {
    return {
      name:             form.from_name.value.trim(),
      email:            form.from_email.value.trim(),
      mobile:           form.mobile.value.trim(),
      designation:      form.designation.value.trim(),
      location:         form.location.value.trim(),
      general_details:  form.general_details.value.trim(),
      problem:          form.problem_statement.value.trim(),
      solution:         form.expected_solution.value.trim(),
      package_name:     pkgInput.value.trim(),
    };
  }

  function validate() {
    const v = getValues();
    if (form._honey && form._honey.value) return false;
    if (!v.name)   { setStatus('error', 'Please enter your full name.'); form.from_name.focus(); return false; }
    if (!v.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      setStatus('error', 'Please enter a valid email address.'); form.from_email.focus(); return false;
    }
    if (!v.mobile) { setStatus('error', 'Please enter your mobile number.'); form.mobile.focus(); return false; }
    if (!v.location) { setStatus('error', 'Please select your location.'); form.location.focus(); return false; }
    if (!v.problem) { setStatus('error', 'Please describe your problem statement.'); form.problem_statement.focus(); return false; }
    return true;
  }

  function buildMessage(v) {
    return [
      '📦 Package: '       + (v.package_name || 'General Enquiry'),
      '👤 Name: '          + v.name,
      '📧 Email: '         + v.email,
      '📱 Mobile: '        + v.mobile,
      '💼 Designation: '   + (v.designation || '—'),
      '📍 Location: '      + v.location,
      '📝 Details: '       + (v.general_details || '—'),
      '❓ Problem: '       + v.problem,
      '💡 Solution: '      + (v.solution || '—'),
    ].join('\n');
  }

  function sendQuote() {
    var v   = getValues();
    var cfg = window.MENTROID_CONTACT || window.MENTROID_EMAILJS || {};
    var mail = window.MentroidMail;

    if (!mail) {
      return Promise.reject(new Error('Mail helper not loaded. Please refresh the page.'));
    }
    if (!mail.isReady()) {
      return Promise.reject(new Error('NOT_CONFIGURED'));
    }

    var subject = 'Quote Request – ' + (v.package_name || 'General') + ' | ' + v.name;
    var message = buildMessage(v);

    return mail.send({
      // EmailJS template variables
      to_email:          cfg.toEmail || 'mentroid@mentroid.co.in',
      from_name:         v.name,
      from_email:        v.email,
      reply_to:          v.email,
      subject:           subject,
      message:           message,
      // Extra fields (available in EmailJS template as {{variable}})
      mobile:            v.mobile,
      designation:       v.designation || '—',
      location:          v.location,
      general_details:   v.general_details || '—',
      problem_statement: v.problem,
      expected_solution: v.solution || '—',
      package_name:      v.package_name || 'General Enquiry',
      // Web3Forms fields
      name:              v.name,
      email:             v.email,
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearStatus();
    if (!validate()) return;

    setLoading(true);
    sendQuote()
      .then(function () {
        setStatus('success', '🎉 Quote request sent! We\'ll get back to you within 24 hours.');
        form.reset();
        setTimeout(closeModal, 3000);
      })
      .catch(function (err) {
        console.error('[Quote form]', err);
        if (err && err.message === 'NOT_CONFIGURED') {
          setStatus('error', 'Email delivery is not configured yet. Add your EmailJS keys in emailjs-config.js.');
        } else {
          setStatus('error', 'Could not send your request. Please try again or email mentroid@mentroid.co.in directly.');
        }
      })
      .finally(function () { setLoading(false); });
  });

  form.addEventListener('input', clearStatus);
})();

// ── Get Quote button ripple effect ──────────────────────────────
document.querySelectorAll('.quote-trigger').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    // Remove any existing ripple
    btn.querySelectorAll('.btn-ripple').forEach(function (r) { r.remove(); });

    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var x = e.clientX - rect.left - size / 2;
    var y = e.clientY - rect.top  - size / 2;

    var ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + x + 'px;top:' + y + 'px;';
    btn.appendChild(ripple);

    ripple.addEventListener('animationend', function () { ripple.remove(); });
  });
});
