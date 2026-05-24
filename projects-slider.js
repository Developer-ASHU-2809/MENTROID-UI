(function () {
  'use strict';

  const section = document.getElementById('projects');
  if (!section) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const parallaxEls = section.querySelectorAll('[data-projects-parallax]');
  const cards = section.querySelectorAll('.project-card');
  const track = section.querySelector('.projects-track');

  let ticking = false;

  function getScrollOffset() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh;
    const visible = vh - rect.top;
    return Math.max(0, Math.min(1, visible / total)) - 0.5;
  }

  function applyParallax() {
    if (reducedMotion) return;

    const offset = getScrollOffset() * 120;

    parallaxEls.forEach(function (el) {
      const speed = parseFloat(el.getAttribute('data-projects-parallax')) || 0.2;
      el.style.transform = 'translate3d(0, ' + (offset * speed) + 'px, 0)';
    });

    const headerTitle = section.querySelector('.projects-header .section-title');
    const headerSub = section.querySelector('.projects-header .section-sub');
    if (headerTitle) {
      headerTitle.style.transform = 'translate3d(0, ' + (offset * 0.12) + 'px, 0)';
    }
    if (headerSub) {
      headerSub.style.transform = 'translate3d(0, ' + (offset * 0.08) + 'px, 0)';
    }

    cards.forEach(function (card) {
      const speed = parseFloat(card.getAttribute('data-parallax-speed')) || 0.15;
      card.style.setProperty('--parallax-y', offset * speed + 'px');
    });

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyParallax);
  }

  if (!reducedMotion) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    applyParallax();
  } else if (track) {
    track.style.animation = 'none';
  }
})();
