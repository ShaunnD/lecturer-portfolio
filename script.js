/* ============================================================
   Mr. Ikraam Sadek — Portfolio Website
   External JavaScript  |  script.js
   ============================================================ */

'use strict';

/* ===== PARTICLE CANVAS ANIMATION ===== */
const ParticleSystem = (() => {
  let canvas, ctx, particles = [], animId;
  const CONFIG = {
    count:       90,
    maxRadius:   2.5,
    minRadius:   0.5,
    maxSpeed:    0.45,
    lineDistance:120,
    lineOpacity: 0.12,
    colors: ['#8b5cf6', '#7c3aed', '#6d28d9', '#4f46e5', '#9b1a4a', '#1e3a5f'],
  };

  function init() {
    canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    spawnParticles();
    loop();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawnParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * CONFIG.maxSpeed + 0.05;
      particles.push({
        x:      Math.random() * canvas.width,
        y:      Math.random() * canvas.height,
        vx:     Math.cos(angle) * speed,
        vy:     Math.sin(angle) * speed,
        r:      Math.random() * (CONFIG.maxRadius - CONFIG.minRadius) + CONFIG.minRadius,
        color:  CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
        alpha:  Math.random() * 0.6 + 0.2,
      });
    }
  }

  function loop() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.lineDistance) {
          const opacity = CONFIG.lineOpacity * (1 - dist / CONFIG.lineDistance);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    // Update & draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });

    animId = requestAnimationFrame(loop);
  }

  return { init };
})();

/* ===== TYPEWRITER EFFECT ===== */
const Typewriter = (() => {
  function create(element, phrases, {
    typeSpeed   = 75,
    deleteSpeed = 40,
    pauseAfter  = 1800,
    pauseBefore = 400,
    loop        = true,
  } = {}) {
    if (!element) return;
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function tick() {
      const phrase = phrases[phraseIdx];
      if (deleting) {
        charIdx--;
        element.textContent = phrase.substring(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(tick, pauseBefore);
          return;
        }
        setTimeout(tick, deleteSpeed);
      } else {
        charIdx++;
        element.textContent = phrase.substring(0, charIdx);
        if (charIdx === phrase.length) {
          if (!loop && phraseIdx === phrases.length - 1) return;
          deleting = true;
          setTimeout(tick, pauseAfter);
          return;
        }
        setTimeout(tick, typeSpeed);
      }
    }

    setTimeout(tick, 800);
  }

  return { create };
})();

/* ===== SCROLL REVEAL ===== */
const ScrollReveal = (() => {
  let observer;

  function init() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const options = {
      root:      null,
      rootMargin:'0px 0px -60px 0px',
      threshold: 0.12,
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    elements.forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ===== NAVBAR SCROLL EFFECT ===== */
const Navbar = (() => {
  let navbar, lastScroll = 0;

  function init() {
    navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function onScroll() {
    const current = window.scrollY;
    if (current > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = current;
  }

  return { init };
})();

/* ===== MOBILE HAMBURGER MENU ===== */
const MobileMenu = (() => {
  let hamburger, menu, open = false;

  function init() {
    hamburger = document.getElementById('hamburger');
    menu      = document.getElementById('mobileMenu');
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', toggle);

    // Close when a link is clicked
    document.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', close);
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (open && !menu.contains(e.target) && !hamburger.contains(e.target)) {
        close();
      }
    });
  }

  function toggle() {
    open ? close() : openMenu();
  }

  function openMenu() {
    open = true;
    menu.classList.add('open');
    animateHamburger(true);
  }

  function close() {
    open = false;
    menu.classList.remove('open');
    animateHamburger(false);
  }

  function animateHamburger(isOpen) {
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  return { init };
})();

/* ===== ACTIVE NAV LINK (Scroll Spy) ===== */
const ScrollSpy = (() => {
  const sections = ['hero', 'about', 'modules', 'achievements', 'quote', 'fun-facts', 'contact'];

  function init() {
    window.addEventListener('scroll', update, { passive: true });
  }

  function update() {
    const scrollY = window.scrollY + 120;
    let current  = '';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  return { init };
})();

/* ===== FLIP CARDS — TOUCH SUPPORT ===== */
const FlipCards = (() => {
  function init() {
    // Touch toggle for achievement cards (click-to-flip on mobile)
    document.querySelectorAll('.ach-flip-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }
  return { init };
})();

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
const SmoothScroll = (() => {
  function init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = document.getElementById('navbar')?.offsetHeight || 70;
        window.scrollTo({
          top:      target.offsetTop - offset,
          behavior: 'smooth',
        });
      });
    });
  }
  return { init };
})();

/* ===== STATS COUNTER ANIMATION ===== */
const Counter = (() => {
  function animateCount(el, target, duration = 1200) {
    let start = 0, startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  function init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target, +e.target.dataset.count);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  }

  return { init };
})();

/* ===== PARALLAX TILT ON AVATAR WRAPPER ===== */
const TiltEffect = (() => {
  function init() {
    const wrapper = document.querySelector('.avatar-wrapper');
    if (!wrapper) return;

    document.addEventListener('mousemove', e => {
      const rect   = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx     = (e.clientX - centerX) / window.innerWidth;
      const dy     = (e.clientY - centerY) / window.innerHeight;
      const tiltX  = dy * -10;
      const tiltY  = dx *  10;
      wrapper.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    document.addEventListener('mouseleave', () => {
      wrapper.style.transform = '';
    });
  }

  return { init };
})();

/* ===== CURSOR GLOW EFFECT (Desktop) ===== */
const CursorGlow = (() => {
  let glow;

  function init() {
    if (window.innerWidth < 1024) return; // desktop only
    glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      pointer-events: none;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.12s ease, top 0.12s ease;
      z-index: 9999;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

  return { init };
})();

/* ===== HERO SECTION STAGGER ANIMATION ===== */
const HeroStagger = (() => {
  function init() {
    const items = [
      '.hero-greeting',
      '.hero-name',
      '.hero-role',
      '.hero-typed-wrapper',
      '.hero-badges',
      '.hero-cta',
    ];

    items.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.opacity   = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, 300 + i * 120);
    });
  }

  return { init };
})();

/* ===== INITIALISE EVERYTHING ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Particle background
  ParticleSystem.init();

  // Typewriter in hero
  Typewriter.create(
    document.getElementById('typedHero'),
    [
      'passionate educator.',
      'problem solver.',
      'code enthusiast.',
      'helpful mentor.',
      'hiking lover.',
      'interactive lecturer.',
    ],
    { typeSpeed: 70, deleteSpeed: 35, pauseAfter: 2000 }
  );

  // Typewriter in about section
  Typewriter.create(
    document.getElementById('typedAbout'),
    [
      'Junior Lecturer',
      'Developer & Educator',
      'Passionate Problem Solver',
    ],
    { typeSpeed: 80, deleteSpeed: 40, pauseAfter: 2200 }
  );

  // Scroll reveal
  ScrollReveal.init();

  // Navbar scroll
  Navbar.init();

  // Mobile menu
  MobileMenu.init();

  // Scroll spy
  ScrollSpy.init();

  // Flip card touch support
  FlipCards.init();

  // Smooth scrolling
  SmoothScroll.init();

  // Counter animation (for any future counter elements)
  Counter.init();

  // Tilt on avatar
  TiltEffect.init();

  // Cursor glow
  CursorGlow.init();

  // Hero stagger entrance
  HeroStagger.init();
});
