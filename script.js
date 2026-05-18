/**
 * script.js – Resume Interactive Features
 * Frontend & WordPress Developer Resume 2026
 */

/* ── 1. DARK MODE TOGGLE ─────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

// Load saved preference
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fa-solid fa-sun';
  }
})();

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fa-solid fa-sun';
    localStorage.setItem('theme', 'dark');
  }
});

/* ── 2. HAMBURGER / MOBILE MENU ──────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ── 3. STICKY NAV: ACTIVE LINK HIGHLIGHT ────────── */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks  = document.querySelectorAll('.topnav__links a, .mobile-menu a');

const observerOptions = {
  root: null,
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, observerOptions);

sections.forEach(sec => sectionObserver.observe(sec));

/* ── 4. SKILL BAR ANIMATION ──────────────────────── */
const skillBars = document.querySelectorAll('.skill-bar__fill');

const barObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill  = entry.target;
      const width = fill.getAttribute('data-width') + '%';
      // Small delay so the transition is visible on scroll
      requestAnimationFrame(() => {
        fill.style.width = width;
      });
      obs.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));

/* ── 5. BACK TO TOP BUTTON ───────────────────────── */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 350);
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 6. NAV SHADOW ON SCROLL ─────────────────────── */
const topnav = document.getElementById('topnav');

window.addEventListener('scroll', () => {
  topnav.style.boxShadow = window.scrollY > 10
    ? '0 2px 12px rgba(0,0,0,.1)'
    : 'none';
}, { passive: true });

/* ── 7. DOWNLOAD / PRINT PDF ─────────────────────── */
function downloadResume() {
  const btn = document.getElementById('downloadBtn');
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing…';
  btn.disabled = true;

  // Strip JS-injected inline opacity/transform so hidden-until-scroll cards
  // are fully visible in the printed PDF.
  const animated = document.querySelectorAll('[style*="opacity"]');
  const savedStyles = [];
  animated.forEach(el => {
    savedStyles.push({ el, style: el.getAttribute('style') });
    el.removeAttribute('style');
  });

  setTimeout(() => {
    window.print();
    // Restore styles after print dialog closes
    savedStyles.forEach(({ el, style }) => {
      if (style) el.setAttribute('style', style);
    });
    btn.innerHTML = orig;
    btn.disabled = false;
  }, 250);
}

/* ── 8. CARD ENTER ANIMATIONS ON SCROLL ──────────── */
const animatables = document.querySelectorAll('.card, .edu-card, .cert-card, .project-card');

const cardObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger based on position within parent
      const siblings = Array.from(entry.target.parentElement.children);
      const index    = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 60}ms`;
      entry.target.classList.add('card--visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Add initial hidden state via JS (avoids FOUC in CSS)
animatables.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.45s ease, transform 0.45s ease, box-shadow 0.22s ease, border-color 0.22s ease';
  cardObserver.observe(el);
});

// Style for .card--visible
const styleTag = document.createElement('style');
styleTag.textContent = `.card--visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(styleTag);

/* ── 9. SMOOTH SCROLL FOR ALL ANCHOR LINKS ───────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 64; // height of sticky nav
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── 10. CONSOLE EASTER EGG ──────────────────────── */
console.log(
  '%c👋 Hi Recruiter!%c\nThis resume was hand-crafted with HTML, CSS & JS.\nFeel free to reach out — let\'s build something great together!',
  'color:#1d6fce;font-size:1.2rem;font-weight:bold;',
  'color:#6b6860;font-size:0.9rem;'
);
