import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { motionOK, fine, type Cleanup } from './env';
import { initTransitions } from './transitions';
import { initChrome, initCursor } from './chrome';
import { initEffects } from './effects';
import { initForms } from './forms';
import { initBooking } from './booking';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

// Page modules load on demand, so each page only downloads its own code.
const pageModules: Record<string, () => Promise<() => Cleanup>> = {
  home: () => import('./home').then((m) => m.initHome),
  rooms: () => import('./rooms').then((m) => m.initRooms),
  restaurant: () => import('./restaurant').then((m) => m.initRestaurant),
};
let mountId = 0;

// Safari has no requestIdleCallback; a short timeout is close enough there.
const ric = (window as { requestIdleCallback?: Window['requestIdleCallback'] }).requestIdleCallback;
const whenIdle = (cb: () => void) => (ric ? ric.call(window, cb, { timeout: 1500 }) : window.setTimeout(cb, 200));

let lenis: Lenis | null = null;
const lenisTick = (time: number) => lenis?.raf(time * 1000);
let ctx: gsap.Context | null = null;
let cleanups: Cleanup[] = [];

function ensureLenis(): void {
  if (!motionOK() || !fine()) {
    if (lenis) {
      gsap.ticker.remove(lenisTick);
      lenis.destroy();
      lenis = null;
    }
    return;
  }
  if (lenis) return;
  lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(lenisTick); // one shared callback, removed on destroy
  gsap.ticker.lagSmoothing(0);
}

function mount(): void {
  const root = document.documentElement;
  // <html> attributes are replaced on every client-side navigation, so re-apply ours.
  root.classList.add('js');
  root.classList.toggle('motion', motionOK());
  root.classList.toggle('has-cursor', fine() && motionOK());
  ensureLenis();
  if (lenis) root.classList.add('lenis', 'lenis-smooth');

  const page = document.body.dataset.page ?? 'other';
  const id = ++mountId;
  ctx = gsap.context(() => {});
  cleanups.push(initChrome(), initForms(), initBooking());
  // Scroll effects (headline splits, reveals) are the heaviest set-up, so they run as a separate
  // task: the page stays responsive while it starts.
  const fx = window.setTimeout(() => {
    if (id === mountId && ctx) ctx.add(() => cleanups.push(initEffects()));
  }, 0);
  cleanups.push(() => window.clearTimeout(fx));
  // Decorative loops (toran sway, falling petals, the hero badge) wait until the page has loaded
  // and the browser is idle, so they never compete with loading.
  const live = () => { if (id === mountId) root.classList.add('deco-live'); };
  if (document.readyState === 'complete') live();
  else window.addEventListener('load', () => whenIdle(live), { once: true });
  const load = pageModules[page];
  if (load) {
    load().then((init) => {
      if (id !== mountId || !ctx) return; // the visitor already moved on
      ctx.add(() => cleanups.push(init()));
    }).catch((err) => console.error('Page script failed to load', err));
  }

  // ScrollTrigger re-measures by itself on window load. Re-measure again only if web fonts finish
  // after that (a slow font, or a client-side navigation), because new fonts move text.
  if (document.fonts && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(() => { if (document.readyState === 'complete' && id === mountId) ScrollTrigger.refresh(); }).catch(() => {});
  }
}

function unmount(): void {
  for (const fn of cleanups) {
    try { fn(); } catch { /* element already gone */ }
  }
  cleanups = [];
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach((st) => st.kill());
}

document.addEventListener('astro:page-load', mount);
document.addEventListener('astro:before-swap', unmount);
document.addEventListener('astro:after-swap', () => {
  lenis?.scrollTo(0, { immediate: true, force: true });
});

// Sections using content-visibility:auto change height when first rendered; re-measure triggers.
let cvTimer = 0;
document.addEventListener('contentvisibilityautostatechange', () => {
  window.clearTimeout(cvTimer);
  cvTimer = window.setTimeout(() => ScrollTrigger.refresh(), 160);
}, { capture: true });

initTransitions();
initCursor();
