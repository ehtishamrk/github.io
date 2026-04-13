/* ================================================================
   AOLFS — components.js
   Nav & Footer loader + Scroll Animations + Cursor + Counters
   ================================================================ */

/* ── PATH RESOLVER ────────────────────────────────────────────── */
function getRoot() {
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  // If on custom domain (aolfs.com), paths start from /
  // Detect if we're in a subdirectory
  const isSubdir = depth > 1 && !window.location.pathname.endsWith('/');
  if (isSubdir) {
    return '../'.repeat(depth - 1);
  }
  return '/';
}

// Always use absolute paths on the deployed site
function componentPath(file) {
  // Try absolute first (works with custom domain on GitHub Pages)
  return '/components/' + file;
}

/* ── COMPONENT LOADER ─────────────────────────────────────────── */
async function loadComponent(id, file, initFn) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const root = window.AOLFS_ROOT || '';
    const res  = await fetch(root + '/components/' + file);
    if (!res.ok) throw new Error('Not found');
    const html = await res.text();
    el.innerHTML = html;
    if (initFn) initFn();
  } catch (e) {
    // Fallback: try relative path
    try {
      const depth = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean).length;
      const rel   = '../'.repeat(Math.max(0, depth - (window.location.hostname === 'localhost' ? 0 : 0)));
      const res   = await fetch(rel + 'components/' + file);
      const html  = await res.text();
      el.innerHTML = html;
      if (initFn) initFn();
    } catch (e2) {
      console.warn('Component load failed:', file, e2);
    }
  }
}

/* ── INIT NAV ─────────────────────────────────────────────────── */
function initNav() {
  const nav       = document.getElementById('site-nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const megaMenu  = document.querySelector('.mega-menu');
  const servicesBtn = document.querySelector('.nav-services-btn');
  const mobileServicesToggle = document.querySelector('.mobile-services-toggle');
  const mobileServicesItems  = document.querySelector('.mobile-services-items');

  if (!nav) return;

  // Scroll state
  function updateNavScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();

  // Mega menu toggle
  if (servicesBtn && megaMenu) {
    servicesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = megaMenu.classList.contains('open');
      closeMega();
      if (!isOpen) {
        megaMenu.classList.add('open');
        servicesBtn.classList.add('open');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('click', closeMega);
    megaMenu.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeMega(); closeMobile(); }
    });
  }

  function closeMega() {
    if (megaMenu) megaMenu.classList.remove('open');
    if (servicesBtn) servicesBtn.classList.remove('open');
  }

  // Mobile hamburger
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      hamburger.classList.toggle('open', !isOpen);
      mobileNav.classList.toggle('open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
  }

  function closeMobile() {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileNav) mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Mobile services accordion
  if (mobileServicesToggle && mobileServicesItems) {
    mobileServicesToggle.addEventListener('click', () => {
      mobileServicesItems.classList.toggle('open');
    });
  }

  // Highlight active page link
  const links = document.querySelectorAll('.nav-links a, .mega-col__link');
  const path  = window.location.pathname;
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && path.includes(href) && href !== '/' && href !== '/index.html') {
      link.classList.add('active');
    }
  });
  if (path === '/' || path.endsWith('/index.html')) {
    const homeLink = document.querySelector('.nav-links a[href="/"], .nav-links a[href="/index.html"]');
    if (homeLink) homeLink.classList.add('active');
  }

  // Cursor hover on nav links
  const hoverables = document.querySelectorAll('.nav-links a, .nav-links button, .nav-portal-btn, .mega-col__link');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ── INIT FOOTER ──────────────────────────────────────────────── */
function initFooter() {
  // Set current year
  const yearEl = document.querySelector('.footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ── CUSTOM CURSOR ────────────────────────────────────────────── */
function initCursor() {
  // Only on pointer devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  const dot  = document.querySelector('.cursor__dot');
  const ring = document.querySelector('.cursor__ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover expansion
  const hoverTargets = document.querySelectorAll('a, button, [role="button"], .card, .service-cat-card, .blog-card, .industry-card, .pain-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ── SCROLL REVEAL ────────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .stat-item');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Don't unobserve stats so we can re-trigger on revisit
        if (!entry.target.classList.contains('stat-item')) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ── ANIMATED COUNTERS ────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseFloat(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const duration = 2000;
  const decimals = String(target).includes('.') ? String(target).split('.')[1].length : 0;
  const start    = performance.now();

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutCubic(progress);
    const value    = (eased * target).toFixed(decimals);

    const numEl = el.querySelector('.num') || el;
    numEl.textContent = prefix + value;

    const suffixEl = el.querySelector('.suffix');
    if (suffixEl) suffixEl.textContent = suffix;
    else if (!el.querySelector('.num')) el.textContent = prefix + value + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ── PAGE LOADER ──────────────────────────────────────────────── */
function initLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  // Fallback in case load is slow
  setTimeout(() => loader.classList.add('hidden'), 3000);
}

/* ── HORIZONTAL DRAG SCROLL ───────────────────────────────────── */
function initDragScroll() {
  const tracks = document.querySelectorAll('.industries-scroll-track');
  tracks.forEach(track => {
    let isDown = false, startX, scrollLeft;
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup',    () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove',  (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  });
}

/* ── WHATSAPP WIDGET ──────────────────────────────────────────── */
function initWhatsApp() {
  const btn = document.querySelector('.wa-widget__btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const phone = '923056160430'; // 0305 6160430 → international format
    const msg   = encodeURIComponent('Hello AOLFS, I would like to learn more about your services.');
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener');
  });
}

/* ── SMOOTH HASH SCROLL ───────────────────────────────────────── */
function initHashScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── MAIN BOOT ────────────────────────────────────────────────── */
async function boot() {
  // Init loader first
  initLoader();

  // Load shared components
  await Promise.all([
    loadComponent('nav-placeholder',    'nav.html',    initNav),
    loadComponent('footer-placeholder', 'footer.html', initFooter),
  ]);

  // Init interactions
  initCursor();
  initScrollReveal();
  initCounters();
  initDragScroll();
  initWhatsApp();
  initHashScroll();

  // Re-run cursor on dynamically loaded elements
  setTimeout(initCursor, 100);
}

// Boot on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
