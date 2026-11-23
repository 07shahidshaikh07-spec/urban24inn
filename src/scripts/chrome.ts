import { gsap } from 'gsap';
import { motionOK, fine, type Cleanup } from './env';

/** Header, menu sheet and map. Re-run on every page. */
export function initChrome(): Cleanup {
  const offs: Cleanup[] = [];
  const hdr = document.querySelector<HTMLElement>('[data-hdr]');
  const progress = document.querySelector<HTMLElement>('[data-progress]');

  // Header: solid after the first scroll, hides going down, returns going up.
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    const delta = y - lastY;
    hdr?.classList.toggle('hdr--solid', y > 40);
    if (hdr && Math.abs(delta) > 6 && !document.body.classList.contains('sheet-open')) {
      hdr.classList.toggle('hdr--hidden', delta > 0 && y > 320);
      lastY = y;
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress?.style.setProperty('--p', String(max > 0 ? Math.min(1, y / max) : 0));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  offs.push(() => window.removeEventListener('scroll', onScroll));

  // Menu sheet (phones): two gold-seamed doors slide shut from left and right, like the page transitions.
  const sheet = document.querySelector<HTMLElement>('[data-sheet]');
  const openBtn = document.querySelector<HTMLButtonElement>('[data-sheet-open]');
  const closeBtn = sheet?.querySelector<HTMLButtonElement>('[data-sheet-close]');
  if (sheet && openBtn && closeBtn) {
    const doorL = sheet.querySelector('[data-sheet-door="l"]');
    const doorR = sheet.querySelector('[data-sheet-door="r"]');
    const items = sheet.querySelectorAll('[data-sheet-item]');
    let anim: gsap.core.Timeline | null = null;
    let closing = false;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = [...sheet.querySelectorAll<HTMLElement>('a, button')];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const open = () => {
      anim?.kill();
      closing = false;
      sheet.hidden = false;
      document.body.classList.add('sheet-open');
      openBtn.setAttribute('aria-expanded', 'true');
      document.addEventListener('keydown', onKey);
      if (motionOK()) {
        anim = gsap.timeline()
          .fromTo(doorL, { xPercent: -101 }, { xPercent: 0, duration: 0.7, ease: 'expo.inOut' })
          .fromTo(doorR, { xPercent: 101 }, { xPercent: 0, duration: 0.7, ease: 'expo.inOut' }, '<')
          .fromTo(items, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', stagger: 0.07 }, '-=0.35');
      }
      closeBtn.focus();
    };
    const close = () => {
      if (closing || sheet.hidden) return; // repeated Escape / close presses
      closing = true;
      anim?.kill();
      const done = () => {
        closing = false;
        sheet.hidden = true;
        document.body.classList.remove('sheet-open');
        openBtn.setAttribute('aria-expanded', 'false');
        document.removeEventListener('keydown', onKey);
        openBtn.focus();
      };
      if (!motionOK()) return done();
      anim = gsap.timeline({ onComplete: done })
        .to(items, { autoAlpha: 0, duration: 0.2 })
        .to(doorL, { xPercent: -101, duration: 0.55, ease: 'expo.inOut' }, '<')
        .to(doorR, { xPercent: 101, duration: 0.55, ease: 'expo.inOut' }, '<');
    };
    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    offs.push(() => {
      openBtn.removeEventListener('click', open);
      closeBtn.removeEventListener('click', close);
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('sheet-open');
    });
  }

  // Map: load Google Maps only when asked (privacy + speed).
  document.querySelectorAll<HTMLButtonElement>('[data-map-load]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const box = btn.closest<HTMLElement>('[data-map]');
      if (!box) return;
      const frame = document.createElement('iframe');
      frame.src = btn.dataset.src ?? '';
      frame.title = btn.dataset.title ?? 'Map';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.allowFullscreen = true;
      box.replaceChildren(frame);
      frame.focus();
    });
  });

  // Intro: remember it played this session.
  if (document.querySelector('[data-intro]')) {
    try { sessionStorage.setItem('intro-seen', '1'); } catch { /* ignore */ }
  }

  return () => offs.forEach((fn) => fn());
}

/** Brass cursor ring for mouse users. Set up once; it persists across pages. */
export function initCursor(): void {
  const el = document.getElementById('cursor');
  if (!el || !fine() || !motionOK()) return;
  const label = el.querySelector<HTMLElement>('.cursor__label');
  const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    const target = (e.target as Element | null)?.closest('a, button, summary, label, input, select, textarea, [data-cursor]');
    const text = target?.getAttribute('data-cursor') ?? '';
    el.classList.toggle('is-link', !!target && !text);
    el.classList.toggle('is-label', !!text);
    if (label) label.textContent = text;
  });
  document.addEventListener('pointerdown', () => el.classList.add('is-down'));
  document.addEventListener('pointerup', () => el.classList.remove('is-down'));
  document.documentElement.addEventListener('pointerleave', () => gsap.to(el, { autoAlpha: 0, duration: 0.2 }));
  document.documentElement.addEventListener('pointerenter', () => gsap.to(el, { autoAlpha: 1, duration: 0.2 }));
}
