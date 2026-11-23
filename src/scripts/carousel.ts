import { motionOK, type Cleanup } from './env';

/**
 * Scroll-snap carousel: native swipe on phones, drag with a mouse, prev/next buttons,
 * a progress line and an optional "Photo 1 of 4" counter. Used by dish cards and room galleries.
 * Markup: [data-carousel] or [data-gallery] containing [data-track] (+ [data-prev] [data-next] [data-prog] [data-pos]).
 */
export function initCarousels(): Cleanup {
  const offs: Cleanup[] = [];
  const motion = motionOK();
  document.querySelectorAll<HTMLElement>('[data-carousel], [data-gallery]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-track]');
    const slides = track ? ([...track.children] as HTMLElement[]) : [];
    if (!track || slides.length < 2) return;
    const prev = root.querySelector<HTMLElement>('[data-prev]');
    const next = root.querySelector<HTMLElement>('[data-next]');
    const prog = root.querySelector<HTMLElement>('[data-prog]');
    const pos = root.querySelector<HTMLElement>('[data-pos]');
    const tpl = pos?.dataset.template ?? '{i} / {n}';
    const step = () => {
      const a = slides[0].getBoundingClientRect();
      const b = slides[1].getBoundingClientRect();
      return Math.max(1, b.left - a.left);
    };
    const maxScroll = () => track.scrollWidth - track.clientWidth;
    const index = () => Math.round(track.scrollLeft / step());
    const update = () => {
      const max = maxScroll();
      const ratio = max > 0 ? track.scrollLeft / max : 1;
      const i = Math.min(slides.length - 1, Math.max(0, index()));
      if (prog) prog.style.transform = `scaleX(${Math.max(0.08, ratio)})`;
      if (pos) pos.textContent = tpl.replace('{i}', String(i + 1)).replace('{n}', String(slides.length));
      // aria-disabled keeps keyboard focus on the button at either end
      prev?.setAttribute('aria-disabled', String(track.scrollLeft <= 2));
      next?.setAttribute('aria-disabled', String(track.scrollLeft >= max - 2));
    };
    const go = (dir: number) => {
      if ((dir < 0 && track.scrollLeft <= 2) || (dir > 0 && track.scrollLeft >= maxScroll() - 2)) return;
      track.scrollBy({ left: dir * step(), behavior: motion ? 'smooth' : 'auto' });
    };
    const onPrev = () => go(-1);
    const onNext = () => go(1);
    track.addEventListener('scroll', update, { passive: true });
    prev?.addEventListener('click', onPrev);
    next?.addEventListener('click', onNext);
    window.addEventListener('resize', update);
    update();

    // Drag with a mouse
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const pd = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add('is-drag');
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startLeft - dx;
    };
    const pu = () => {
      if (!down) return;
      down = false;
      track.classList.remove('is-drag');
      track.scrollTo({ left: index() * step(), behavior: motion ? 'smooth' : 'auto' });
    };
    // Swallow the click that ends a drag so links inside cards don't fire
    const onClick = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    track.addEventListener('pointerdown', pd);
    window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);
    window.addEventListener('pointercancel', pu);
    track.addEventListener('click', onClick, true);
    offs.push(() => {
      track.removeEventListener('scroll', update);
      prev?.removeEventListener('click', onPrev);
      next?.removeEventListener('click', onNext);
      window.removeEventListener('resize', update);
      track.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointermove', pm);
      window.removeEventListener('pointerup', pu);
      window.removeEventListener('pointercancel', pu);
      track.removeEventListener('click', onClick, true);
    });
  });
  return () => offs.forEach((fn) => fn());
}
