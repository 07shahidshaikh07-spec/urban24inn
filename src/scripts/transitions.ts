import { gsap } from 'gsap';
import { motionOK } from './env';

type Kind = 'doors' | 'lang';
const KINDS: Kind[] = ['doors', 'lang'];
const strip = (p: string) => p.replace(/^\/mr(?=\/)/, '') || '/';
const kindFor = (to: URL, from: URL): Kind => (strip(to.pathname) === strip(from.pathname) ? 'lang' : 'doors');
const layer = (k: Kind) => document.querySelector<HTMLElement>(`#curtain [data-cur="${k}"]`);
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** Close the lift doors (or draw the language line) while the next page downloads. */
function cover(k: Kind): Promise<void> {
  const el = layer(k);
  if (!el) return Promise.resolve();
  gsap.set(el, { autoAlpha: 1 });
  const tl = gsap.timeline();
  if (k === 'doors') {
    tl.fromTo(el.querySelector('.cur__door--l'), { xPercent: -101 }, { xPercent: 0, duration: 0.7, ease: 'expo.inOut' })
      .fromTo(el.querySelector('.cur__door--r'), { xPercent: 101 }, { xPercent: 0, duration: 0.7, ease: 'expo.inOut' }, '<')
      .fromTo(el.querySelector('.cur__seam'), { scaleY: 0, autoAlpha: 1 }, { scaleY: 1, duration: 0.45, ease: 'expo.out' }, '-=0.2')
      .fromTo(el.querySelector('.cur__mark'), { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out' }, '<');
  } else {
    tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
      .fromTo(el.querySelector('.cur__line'), { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'expo.inOut' }, 0);
  }
  return tl.then(() => undefined);
}

/** Open the doors on the new page. */
function reveal(k: Kind): void {
  const el = layer(k);
  if (!el) return;
  gsap.killTweensOf([el, ...el.querySelectorAll('*')]);
  const tl = gsap.timeline({ onComplete: () => { gsap.set(el, { autoAlpha: 0 }); } });
  if (k === 'doors') {
    tl.to(el.querySelector('.cur__mark'), { autoAlpha: 0, scale: 1.08, duration: 0.3, ease: 'power2.in' })
      .to(el.querySelector('.cur__seam'), { autoAlpha: 0, duration: 0.2 }, '<')
      .to(el.querySelector('.cur__door--l'), { xPercent: -101, duration: 0.85, ease: 'expo.inOut' }, '-=0.05')
      .to(el.querySelector('.cur__door--r'), { xPercent: 101, duration: 0.85, ease: 'expo.inOut' }, '<');
  } else {
    tl.to(el.querySelector('.cur__line'), { scaleX: 0, transformOrigin: 'right', duration: 0.35, ease: 'expo.in' })
      .to(el, { autoAlpha: 0, duration: 0.35 }, '-=0.1')
      .set(el.querySelector('.cur__line'), { transformOrigin: 'left' });
  }
}

/** Hide a layer immediately, whatever state its animation is in. */
function clear(k: Kind): void {
  const el = layer(k);
  if (!el) return;
  gsap.killTweensOf([el, ...el.querySelectorAll('*')]);
  gsap.set(el, { autoAlpha: 0 });
}

/**
 * Wraps Astro's page loader so the doors close while the next page downloads.
 * Safety rules: navigation never waits more than 1.2 s for the animation, and the
 * curtain is always cleared, even if the tab is hidden or an animation stalls.
 */
export function initTransitions(): void {
  let pending: Kind | null = null;
  let safety = 0;

  document.addEventListener('astro:before-preparation', (event) => {
    window.clearTimeout(safety);
    if (!motionOK() || document.visibilityState === 'hidden') return;
    const kind = kindFor(event.to, event.from);
    pending = kind;
    const load = event.loader;
    event.loader = async () => {
      await Promise.all([Promise.race([cover(kind), wait(1200)]), load()]);
    };
  });

  document.addEventListener('astro:after-swap', () => {
    if (!pending) return;
    const k = pending;
    pending = null;
    window.clearTimeout(safety);
    KINDS.filter((x) => x !== k).forEach(clear);
    if (document.visibilityState === 'hidden') return clear(k);
    requestAnimationFrame(() => reveal(k));
    safety = window.setTimeout(() => clear(k), 2600);
  });

  window.addEventListener('pageshow', () => KINDS.forEach(clear));
}
