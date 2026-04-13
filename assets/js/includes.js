/**
 * AOLFS — includes.js
 * Injects shared nav + footer into every page.
 * Handles: active nav state, nav scroll class, mobile menu, mega menu.
 *
 * Usage: add data-base attribute to <html>
 *   Root pages:      <html data-base="./">
 *   /services/ pages:<html data-base="../">
 *   /blog/ pages:    <html data-base="../">
 *   /blog/articles/: <html data-base="../../">
 *   /admin/:         <html data-base="../">
 *   /portal/:        <html data-base="../">
 */

(function () {
  'use strict';

  // ── Determine base path ──────────────────────────────────────────────────
  const base = document.documentElement.dataset.base || './';

  // ── Inject HTML helper ────────────────────────────────────────────────────
  async function injectHTML(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      el.innerHTML = await res.text();
    } catch (e) {
      console.warn(`[AOLFS includes] Could not load ${url}:`, e.message);
    }
  }

  // ── Rewrite relative links inside includes ────────────────────────────────
  function fixLinks(container) {
    // Convert data-href="services/x.html" → correct relative path
    container.querySelectorAll('[data-href]').forEach(el => {
      el.setAttribute('href', base + el.dataset.href);
    });
  }

  // ── Set active nav link ───────────────────────────────────────────────────
  function setActiveNav() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link, .mega-col ul li a, .nav-mobile__link, .nav-mobile__sub-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      // Remove base path nuances — match on the meaningful path segment
      const clean = href.replace(/^(\.\.\/)+|^\.\//g, '/');
      if (path.endsWith(clean) || (clean !== '/' && path.includes(clean.replace('.html', '')))) {
        link.classList.add('is-active');
      }
    });
  }

  // ── Nav scroll behaviour ──────────────────────────────────────────────────
  function initNavScroll() {
    const nav = document.getElementById('siteNav');
    if (!nav) return;

    function update() {
      if (window.scrollY > 60) {
        nav.classList.remove('site-nav--transparent');
        nav.classList.add('site-nav--scrolled');
      } else {
        nav.classList.add('site-nav--transparent');
        nav.classList.remove('site-nav--scrolled');
      }
    }

    update(); // run once on load
    window.addEventListener('scroll', update, { passive: true });
  }

  // ── Mobile hamburger menu ─────────────────────────────────────────────────
  function initMobileMenu() {
    const burger  = document.getElementById('navHamburger');
    const drawer  = document.getElementById('navMobile');
    if (!burger || !drawer) return;

    function toggle() {
      const isOpen = burger.classList.toggle('is-open');
      drawer.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    burger.addEventListener('click', toggle);

    // Close on overlay click (outside drawer content)
    drawer.addEventListener('click', e => {
      if (e.target === drawer) toggle();
    });

    // ESC closes
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && burger.classList.contains('is-open')) toggle();
    });

    // Mobile services accordion
    const mobileToggles = drawer.querySelectorAll('.nav-mobile__toggle');
    mobileToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.closest('.nav-mobile__item')?.querySelector('.nav-mobile__sub');
        if (!sub) return;
        const isOpen = sub.classList.toggle('is-open');
        btn.classList.toggle('is-open', isOpen);
      });
    });
  }

  // ── Mega menu keyboard accessibility ─────────────────────────────────────
  function initMegaMenu() {
    const triggers = document.querySelectorAll('.nav-item--has-dropdown > .nav-link');
    triggers.forEach(trigger => {
      trigger.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const item = trigger.closest('.nav-item--has-dropdown');
          item.classList.toggle('is-open');
          trigger.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!e.target.closest('.nav-item--has-dropdown')) {
        document.querySelectorAll('.nav-item--has-dropdown.is-open').forEach(item => {
          item.classList.remove('is-open');
        });
      }
    });
  }

  // ── Newsletter form (footer) ──────────────────────────────────────────────
  function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button');
      if (!input?.value) return;

      // TODO: wire to Firebase / Mailchimp in Phase 4
      btn.textContent = '✓ Subscribed!';
      btn.disabled = true;
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
      }, 4000);
    });
  }

  // ── WhatsApp float tooltip ───────────────────────────────────────────────
  function initWhatsApp() {
    const wa = document.querySelector('.whatsapp-float');
    if (!wa) return;
    // Pulse after 3 seconds to draw attention
    setTimeout(() => {
      wa.style.animation = 'waPulse 0.6s ease 0s 2';
    }, 3000);
  }

  // ── Main init ─────────────────────────────────────────────────────────────
  async function init() {
    // Inject nav and footer in parallel
    await Promise.all([
      injectHTML('#navPlaceholder',    base + 'includes/nav.html'),
      injectHTML('#footerPlaceholder', base + 'includes/footer.html'),
    ]);

    // Fix paths in injected HTML
    const nav    = document.getElementById('navPlaceholder');
    const footer = document.getElementById('footerPlaceholder');
    if (nav)    fixLinks(nav);
    if (footer) fixLinks(footer);

    // Run all sub-initialisers after injection
    initNavScroll();
    initMobileMenu();
    initMegaMenu();
    initNewsletter();
    initWhatsApp();
    setActiveNav();
  }

  // Kick off when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
