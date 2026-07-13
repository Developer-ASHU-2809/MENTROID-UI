// =====================================================
// Mentroid Service Page JavaScript
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // Scroll Reveal Animation
  // ===============================

  const revealItems = document.querySelectorAll(
    ".svc-card, .step-card, .section-title, .cta-box"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(40px)";
    item.style.transition = "all .8s ease";

    revealObserver.observe(item);
  });

  // ===============================
  // FAQ Accordion
  // ===============================

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {

    const question = item.querySelector(".faq-question");

    if (!question) return;

    question.addEventListener("click", () => {

      faqItems.forEach((faq) => {
        if (faq !== item) {
          faq.classList.remove("active");
        }
      });

      item.classList.toggle("active");

    });

  });

  // ===============================
  // Active Navbar
  // ===============================

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a");

  function activeMenu() {

    let current = "";

    sections.forEach((section) => {

      const sectionTop = section.offsetTop - 120;

      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }

    });

    navLinks.forEach((link) => {

      link.classList.remove("active");

      const href = link.getAttribute("href");

      if (!href) return;

      if (href.includes("#" + current)) {
        link.classList.add("active");
      }

    });

  }

  window.addEventListener("scroll", activeMenu);

  // ===============================
  // Smooth Scroll
  // ===============================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

    anchor.addEventListener("click", function (e) {

      const target = document.querySelector(this.getAttribute("href"));

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
      });

    });

  });

  // ===============================
  // Hero Logo Mouse Effect
  // ===============================

  const heroLogo = document.querySelector(".service-hero img");

  if (heroLogo) {

    window.addEventListener("mousemove", (e) => {

      const x = (window.innerWidth / 2 - e.clientX) / 60;
      const y = (window.innerHeight / 2 - e.clientY) / 60;

      heroLogo.style.transform =
        `translate(${x}px, ${y}px)`;

    });

  }

  // ===============================
  // Ripple Button Effect
  // ===============================

  document.querySelectorAll(".btn-primary, .btn-outline").forEach((button) => {

    button.addEventListener("click", function (e) {

      const ripple = document.createElement("span");

      ripple.classList.add("ripple");

      const rect = this.getBoundingClientRect();

      ripple.style.left = (e.clientX - rect.left) + "px";
      ripple.style.top = (e.clientY - rect.top) + "px";

      this.appendChild(ripple);

      setTimeout(() => {

        ripple.remove();

      }, 600);

    });

  });

  // ===============================
  // Floating Cards Effect
  // ===============================

  document.querySelectorAll(".svc-card").forEach((card) => {

    card.addEventListener("mousemove", (e) => {

      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = (y / rect.height - 0.5) * -8;
      const rotateY = (x / rect.width - 0.5) * 8;

      card.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

    });

    card.addEventListener("mouseleave", () => {

      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";

    });

  });

  // ===============================
  // Animated Counter
  // ===============================

  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {

    const target = Number(counter.dataset.target);

    if (!target) return;

    let count = 0;

    const speed = target / 80;

    function updateCounter() {

      count += speed;

      if (count < target) {

        counter.innerText = Math.floor(count);

        requestAnimationFrame(updateCounter);

      } else {

        counter.innerText = target;

      }

    }

    updateCounter();

  });

  // ===============================
  // Current Year
  // ===============================

  const year = document.querySelector(".current-year");

  if (year) {

    year.innerText = new Date().getFullYear();

  }

});