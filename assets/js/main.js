/**
 * AOLFS — main.js
 * Core page interactivity: scroll reveals, counter animation,
 * ticker, hero parallax, smooth anchor scroll.
 */

(function () {
  'use strict';

  // ── Scroll Reveal (Intersection Observer) ─────────────────────────────────
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    els.forEach(el => observer.observe(el));
  }

  // ── Auto-stagger children inside .stagger-children ────────────────────────
  function initStagger() {
    document.querySelectorAll('.stagger-children').forEach(parent => {
      const delay = parseFloat(parent.dataset.staggerDelay || 0.12);
      parent.querySelectorAll(':scope > *').forEach((child, i) => {
        child.classList.add('reveal', 'reveal-up');
        child.style.transitionDelay = `${i * delay}s`;
      });
    });
  }

  // ── Animated Counter ──────────────────────────────────────────────────────
  function animateCounter(el, target, duration = 1800) {
    const start      = performance.now();
    const isDecimal  = target % 1 !== 0;
    const suffix     = el.dataset.suffix || '';
    const prefix     = el.dataset.prefix || '';

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased    = 1 - Math.pow(1 - progress, 4);
      const value    = target * eased;
      el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseFloat(el.dataset.counter);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  // ── Hero Parallax (subtle) ────────────────────────────────────────────────
  function initHeroParallax() {
    const hero = document.querySelector('.hero__bg-geo');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          hero.style.transform = `translateY(${scrollY * 0.15}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Smooth anchor scroll ──────────────────────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.getElementById(link.getAttribute('href').slice(1));
        if (!target) return;
        e.preventDefault();
        const offset = 90; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ── Ticker pause on hover ─────────────────────────────────────────────────
  function initTicker() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;
    const wrap = track.closest('.ticker-wrap');
    if (!wrap) return;

    wrap.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    wrap.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }

  // ── Accordion (for FAQ, service lists etc.) ───────────────────────────────
  function initAccordion() {
    document.querySelectorAll('.accordion-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const item    = btn.closest('.accordion-item');
        const panel   = item.querySelector('.accordion-panel');
        const isOpen  = item.classList.contains('is-open');

        // Close all siblings
        item.closest('.accordion')?.querySelectorAll('.accordion-item.is-open').forEach(open => {
          open.classList.remove('is-open');
          open.querySelector('.accordion-panel').style.maxHeight = '0';
        });

        if (!isOpen) {
          item.classList.add('is-open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }

  // ── Service card hover tilt ───────────────────────────────────────────────
  function initCardTilt() {
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.service-card[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const cx     = rect.width  / 2;
        const cy     = rect.height / 2;
        const rx     = ((y - cy) / cy) * 4;
        const ry     = ((x - cx) / cx) * -4;
        card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── Copy email on click (contact page) ───────────────────────────────────
  function initCopyEmail() {
    document.querySelectorAll('[data-copy]').forEach(el => {
      el.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(el.dataset.copy);
          const orig = el.textContent;
          el.textContent = 'Copied!';
          setTimeout(() => el.textContent = orig, 2000);
        } catch (_) {}
      });
    });
  }

  // ── Back to top button ────────────────────────────────────────────────────
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Init all ──────────────────────────────────────────────────────────────
  function init() {
    initStagger();        // must run before scroll reveal
    initScrollReveal();
    initCounters();
    initHeroParallax();
    initSmoothScroll();
    initTicker();
    initAccordion();
    initCardTilt();
    initCopyEmail();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
