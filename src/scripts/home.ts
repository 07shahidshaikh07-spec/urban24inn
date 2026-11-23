import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionOK, fine, type Cleanup } from './env';

// Typewriter timings (ms): per character typed, per character deleted, and the pause on a full phrase.
const TYPE_MS = 85;
const DELETE_MS = 38;
const HOLD_MS = 1800;

export function initHome(): Cleanup {
  const offs: Cleanup[] = [];
  const motion = motionOK();

  // ---------- Hero: the second line types itself; the photo drifts slower than the page ----------
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero && motion) {
    let inView = true;
    let alive = true;
    let timer = 0;
    const wait = (ms: number) => new Promise<void>((done) => { timer = window.setTimeout(done, ms); });

    // Types each phrase, pauses, deletes it and types the next. Only one phrase is ever on the line.
    // Text is split into graphemes, so Marathi vowel signs and conjuncts appear whole, never half-typed.
    const typed = hero.querySelector<HTMLElement>('[data-typed]');
    if (typed) {
      const phrases: string[] = JSON.parse(typed.dataset.typed ?? '[]');
      const segmenter = 'Segmenter' in Intl ? new Intl.Segmenter(document.documentElement.lang || 'en', { granularity: 'grapheme' }) : null;
      const parts = (s: string) => (segmenter ? [...segmenter.segment(s)].map((g) => g.segment) : [...s]);
      // Wait for the intro on a first visit, so the typing starts once the page is in view.
      const intro = !!document.querySelector('[data-intro]') && !document.documentElement.classList.contains('intro-seen');
      const run = async () => {
        let i = 0;
        await wait(intro ? 4000 : 1200);
        while (alive && phrases.length > 1) {
          await wait(HOLD_MS);
          while (alive && (!inView || document.hidden)) await wait(400);
          const now = parts(phrases[i]);
          i = (i + 1) % phrases.length;
          const next = parts(phrases[i]);
          // Keep what the two phrases share ("to "), and only delete and type the rest.
          let keep = 0;
          while (keep < now.length && keep < next.length && now[keep] === next[keep]) keep++;
          for (let n = now.length - 1; n >= keep && alive; n--) { typed.textContent = now.slice(0, n).join(''); await wait(DELETE_MS); }
          for (let n = keep + 1; n <= next.length && alive; n++) { typed.textContent = next.slice(0, n).join(''); await wait(TYPE_MS); }
        }
      };
      run().catch(() => {});
    }
    const st = ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top', onToggle: (self) => { inView = self.isActive; } });

    // Leaving the hero: the words lift and fade, the arch eases back and its photo drifts.
    const exit = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    const text = hero.querySelector('.hero__text');
    const media = hero.querySelector('.hero__media');
    const pic = hero.querySelector('[data-hero-arch] picture');
    if (text) exit.to(text, { yPercent: -12, opacity: 0.15, ease: 'none' }, 0);
    if (media) exit.to(media, { yPercent: 6, scale: 0.94, ease: 'none' }, 0);
    if (pic) exit.to(pic, { yPercent: 6, ease: 'none' }, 0);

    offs.push(() => {
      alive = false;
      window.clearTimeout(timer);
      st.kill();
      exit.scrollTrigger?.kill();
      exit.kill();
    });
  }

  // ---------- Room cards: 3D tilt that follows the mouse ----------
  if (motion && fine()) {
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      gsap.set(card, { transformPerspective: 900 });
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 9);
        rx(((e.clientY - r.top) / r.height - 0.5) * -9);
      };
      const leave = () => { rx(0); ry(0); };
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
      offs.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); });
    });
  }

  return () => offs.forEach((fn) => fn());
}
