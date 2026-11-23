import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { motionOK, fine, type Cleanup } from './env';

const isMarathi = (el: Element) => (el.closest('[lang]')?.getAttribute('lang') ?? '').startsWith('mr');

/** Effects any page can opt into with data attributes. */
export function initEffects(): Cleanup {
  const offs: Cleanup[] = [];
  const motion = motionOK();

  // Headlines: lines (or words / letters) rise out of a mask. Devanagari is never split
  // into letters, because that would break conjuncts and vowel signs.
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    if (!motion) { el.classList.add('is-split'); return; }
    const wanted = el.dataset.split || 'lines';
    const type = isMarathi(el) || wanted === 'lines' ? 'lines' : wanted === 'words' ? 'words,lines' : 'chars,words,lines';
    const split = SplitText.create(el, {
      type,
      // aria-label is only allowed on elements that can be named (headings), not on <p> or <span>.
      aria: el.matches('h1, h2, h3, h4, h5, h6') ? 'auto' : 'none',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        el.classList.add('is-split');
        const parts = type.startsWith('chars') ? self.chars : type.startsWith('words') ? self.words : self.lines;
        return gsap.from(parts, {
          yPercent: 118,
          rotate: type.startsWith('chars') ? 7 : 0,
          duration: 1.15,
          ease: 'expo.out',
          stagger: type.startsWith('chars') ? 0.024 : 0.1,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      },
    });
    offs.push(() => split.revert());
  });

  if (!motion) return () => offs.forEach((fn) => fn());

  // Photos: open from a smaller window while the image settles from a zoom.
  document.querySelectorAll<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
    const img = el.querySelector('img');
    const st = { trigger: el, start: 'top 88%', once: true };
    gsap.fromTo(el, { clipPath: 'inset(16% 10% 16% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out', scrollTrigger: st });
    if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.9, ease: 'expo.out', scrollTrigger: st });
  });

  // Photos: a gold curtain slides off while the photo settles from a zoom.
  document.querySelectorAll<HTMLElement>('[data-reveal="curtain"]').forEach((el) => {
    const cover = document.createElement('span');
    cover.className = 'reveal-curtain';
    cover.setAttribute('aria-hidden', 'true');
    el.appendChild(cover);
    const img = el.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    tl.to(cover, { scaleX: 0, duration: 1.25, ease: 'expo.inOut' }, 0);
    if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.9, ease: 'expo.out' }, 0.05);
    offs.push(() => cover.remove());
  });

  // Depth: a photo drifts inside its frame as the page scrolls (the picture is taller than the frame).
  document.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
    const pic = el.querySelector('picture');
    if (!pic) return;
    gsap.fromTo(pic, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Rings around chapter numbers draw themselves.
  document.querySelectorAll<SVGCircleElement>('[data-draw] circle').forEach((c) => {
    gsap.fromTo(c, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: c.closest('[data-draw]') ?? c, start: 'top 90%', once: true } });
  });

  // Statements: the words fill in as the line scrolls up the screen. They start at half strength,
  // not fainter: large text needs 3:1 contrast even before it fills in.
  document.querySelectorAll<HTMLElement>('[data-fill]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', aria: el.matches('h1, h2, h3, h4, h5, h6') ? 'auto' : 'none' });
    gsap.fromTo(split.words, { opacity: 0.5 }, { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: true } });
    offs.push(() => split.revert());
  });

  // Content blocks rise into place as they scroll into view, a few at a time (one batch per scroll).
  // Heroes, split headlines, photos with their own reveal and [data-rise] groups are left alone.
  const blocks = gsap.utils.toArray<HTMLElement>(
    'main section :is(.eyebrow, .lede, .chap__tag, .chap__ctas, .cta__btns, .stay__rooms > li, .stay__amn > li, .dishes__item, .am__item, .fq__item, .visit__card, .visit__map, .wf, .eq__alt, .tb__alt, .stmt__mark)',
  ).filter((el) => !el.closest('[data-page-hero], .hero, .bh, [data-rise], [data-split]'));
  if (blocks.length) {
    gsap.set(blocks, { y: 38, autoAlpha: 0 });
    const batches = ScrollTrigger.batch(blocks, {
      start: 'top 94%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
    });
    offs.push(() => batches.forEach((st) => st.kill()));
  }

  // Gentle depth on scroll.
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amt = parseFloat(el.dataset.parallax || '12');
    gsap.fromTo(el, { yPercent: -amt / 2 }, {
      yPercent: amt / 2,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Marquee: speeds up, reverses and leans with scroll velocity.
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((m) => {
    const track = m.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return;
    const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 42, repeat: -1 });
    const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power3' });
    let dir = 1;
    let settle: gsap.core.Tween | null = null;
    const st = ScrollTrigger.create({
      trigger: m,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()),
      onUpdate: (self) => {
        const v = self.getVelocity();
        dir = self.direction;
        settle?.kill();
        loop.timeScale(dir * (1 + Math.min(Math.abs(v) / 250, 7)));
        skewTo(gsap.utils.clamp(-9, 9, v / -220));
        settle = gsap.to(loop, { timeScale: dir, duration: 0.9, ease: 'power2.out', delay: 0.08, onComplete: () => skewTo(0) });
      },
    });
    offs.push(() => { st.kill(); loop.kill(); settle?.kill(); });
  });

  // Brass light sweep across big letters.
  document.querySelectorAll<HTMLElement>('[data-sweep]').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => el.classList.add('is-swept') });
  });

  // Groups of small things rise in sequence (lists, button rows). Used sparingly.
  document.querySelectorAll<HTMLElement>('[data-rise]').forEach((el) => {
    gsap.from(el.children, {
      y: 36,
      autoAlpha: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.07,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Magnetic buttons for mouse users.
  if (fine()) {
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.32);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.45);
      };
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      offs.push(() => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
  }

  return () => offs.forEach((fn) => fn());
}
