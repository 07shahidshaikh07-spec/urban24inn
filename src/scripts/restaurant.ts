import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { motionOK, type Cleanup } from './env';

gsap.registerPlugin(Flip);

type Diet = 'all' | 'veg' | 'nonveg';

export function initRestaurant(): Cleanup {
  const offs: Cleanup[] = [];
  const motion = motionOK();

  // ---------- Menu: sections as tabs, veg / non-veg filter with FLIP ----------
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (menu) {
    const tablist = menu.querySelector<HTMLElement>('[data-tablist]');
    const tabs = [...menu.querySelectorAll<HTMLButtonElement>('[data-tab]')];
    const panels = [...menu.querySelectorAll<HTMLElement>('[data-panel]')];
    const dietGroup = menu.querySelector<HTMLElement>('[data-diet-group]');
    const dietBtns = [...menu.querySelectorAll<HTMLButtonElement>('[data-diet]')];
    const ind = menu.querySelector<HTMLElement>('[data-diet-ind]');
    let current = 0;

    const itemsIn = (p: HTMLElement) => [...p.querySelectorAll<HTMLElement>('.mi')];
    const shown = (el: HTMLElement) => el.style.display !== 'none';

    const animateIn = (panel: HTMLElement) => {
      if (!motion) return;
      gsap.fromTo(panel.querySelector('.menu__cat'), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out' });
      gsap.fromTo(itemsIn(panel).filter(shown), { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75, ease: 'expo.out', stagger: 0.022, delay: 0.05 });
    };

    const select = (i: number, focus = false) => {
      if (i === current || !panels[i]) return;
      const prev = panels[current];
      const next = panels[i];
      tabs.forEach((t, j) => {
        t.setAttribute('aria-selected', String(j === i));
        t.tabIndex = j === i ? 0 : -1;
      });
      current = i;
      if (focus) tabs[i].focus();
      tabs[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: motion ? 'smooth' : 'auto' });
      // Rapid clicks: stop older fades and hide everything except the outgoing and incoming panels.
      gsap.killTweensOf(panels);
      const reset = (p: HTMLElement) => { p.hidden = true; gsap.set(p, { clearProps: 'opacity,visibility,transform' }); };
      panels.forEach((p) => { if (p !== prev && p !== next) reset(p); });
      const show = () => { if (current !== i) return; next.hidden = false; animateIn(next); };
      if (motion && !prev.hidden) {
        gsap.to(prev, { autoAlpha: 0, y: -14, duration: 0.22, ease: 'power2.in', onComplete: () => { reset(prev); show(); } });
      } else {
        reset(prev);
        show();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const keys: Record<string, number> = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      select((keys[e.key] + tabs.length) % tabs.length, true);
    };

    if (tablist && tabs.length === panels.length && tabs.length > 1) {
      menu.classList.add('is-tabbed');
      tablist.hidden = false;
      tablist.setAttribute('role', 'tablist');
      tabs.forEach((t, i) => {
        t.setAttribute('role', 'tab');
        t.setAttribute('aria-controls', panels[i].id);
        t.setAttribute('aria-selected', String(i === 0));
        t.tabIndex = i === 0 ? 0 : -1;
        const click = () => select(i);
        t.addEventListener('click', click);
        t.addEventListener('keydown', onKey);
        offs.push(() => { t.removeEventListener('click', click); t.removeEventListener('keydown', onKey); });
      });
      panels.forEach((p, i) => {
        p.setAttribute('role', 'tabpanel');
        p.setAttribute('aria-labelledby', tabs[i].id);
        p.tabIndex = 0;
        p.hidden = i !== 0;
      });
    }

    const moveInd = (instant = false) => {
      const b = dietBtns.find((x) => x.getAttribute('aria-pressed') === 'true');
      if (!b || !ind) return;
      gsap.to(ind, { x: b.offsetLeft, width: b.offsetWidth, duration: motion && !instant ? 0.55 : 0, ease: 'expo.out' });
    };

    const applyDiet = (d: Diet) => {
      dietBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.diet === d)));
      moveInd();
      const live = panels[current];
      const state = motion && live ? Flip.getState(itemsIn(live)) : null;
      panels.forEach((p, i) => {
        let n = 0;
        itemsIn(p).forEach((it) => {
          const ok = d === 'all' || (d === 'veg') === (it.dataset.veg === 'true');
          it.style.display = ok ? '' : 'none';
          if (ok) n++;
        });
        const empty = p.querySelector<HTMLElement>('[data-empty]');
        if (empty) empty.hidden = n > 0;
        const count = tabs[i]?.querySelector('[data-count]');
        if (count) count.textContent = String(n);
        tabs[i]?.classList.toggle('is-empty', n === 0);
      });
      if (state) {
        Flip.from(state, {
          duration: 0.6,
          ease: 'expo.out',
          absolute: true,
          onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.015, clearProps: 'opacity,visibility,transform' }),
          // Leaving items end display:none; clear their inline styles so they come back whole.
          onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.25, onComplete: () => gsap.set(els, { clearProps: 'opacity,visibility,transform' }) }),
        });
      }
    };

    if (dietGroup && dietBtns.length) {
      dietGroup.hidden = false;
      dietBtns.forEach((b) => {
        const click = () => applyDiet((b.dataset.diet as Diet) ?? 'all');
        b.addEventListener('click', click);
        offs.push(() => b.removeEventListener('click', click));
      });
      requestAnimationFrame(() => moveInd(true));
      const onResize = () => moveInd(true);
      window.addEventListener('resize', onResize);
      offs.push(() => window.removeEventListener('resize', onResize));
    }
  }

  // ---------- What to order: Marathi names slide in from alternate sides as you scroll ----------
  if (motion) {
    document.querySelectorAll<HTMLElement>('[data-sig]').forEach((row, i) => {
      const name = row.querySelector('[data-sig-mr]');
      if (!name) return;
      gsap.fromTo(name, { xPercent: i % 2 ? 22 : -22 }, {
        xPercent: 0, ease: 'none',
        scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 58%', scrub: 0.6 },
      });
    });
  }

  // ---------- Thali: the plate lands, bowls drop in, steam rises ----------
  const thali = document.querySelector<HTMLElement>('[data-thali]');
  if (thali) {
    const svg = thali.querySelector<SVGSVGElement>('svg');
    const bowls = [...thali.querySelectorAll<SVGGElement>('.th-bowl')];
    const parts = [...thali.querySelectorAll<HTMLButtonElement>('[data-part]')];
    const choices = [...thali.querySelectorAll<HTMLButtonElement>('[data-thali-pick]')];
    const lists = [...thali.querySelectorAll<HTMLElement>('[data-thali-list]')];
    const tones: Record<string, string> = JSON.parse(thali.dataset.tones ?? '{}');
    const sets: Record<string, string[]> = JSON.parse(thali.dataset.sets ?? '{}');

    const focusPart = (i: number | null) => {
      bowls.forEach((b, j) => {
        const on = i === null || i === j;
        if (motion) gsap.to(b, { opacity: on ? 1 : 0.35, scale: i === j ? 1.1 : 1, transformOrigin: '50% 50%', duration: 0.5, ease: 'expo.out' });
        else b.style.opacity = on ? '1' : '0.35';
        b.classList.toggle('is-on', i === j);
      });
    };
    parts.forEach((p) => {
      const i = Number(p.dataset.part);
      const on = () => focusPart(i);
      const off = () => focusPart(null);
      p.addEventListener('pointerenter', on);
      p.addEventListener('focus', on);
      p.addEventListener('pointerleave', off);
      p.addEventListener('blur', off);
      offs.push(() => { p.removeEventListener('pointerenter', on); p.removeEventListener('focus', on); p.removeEventListener('pointerleave', off); p.removeEventListener('blur', off); });
    });

    const pick = (id: string) => {
      choices.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.thaliPick === id)));
      lists.forEach((l) => { l.hidden = l.dataset.thaliList !== id; });
      const set = sets[id] ?? [];
      bowls.forEach((b, j) => {
        const fill = b.querySelector<SVGElement>('.th-fill');
        const color = tones[set[j]] ?? '#888';
        if (!fill) return;
        if (motion) {
          gsap.timeline()
            .to(fill, { scale: 0.2, transformOrigin: '50% 50%', duration: 0.25, ease: 'power2.in', delay: j * 0.04 })
            .set(fill, { attr: { fill: color } })
            .to(fill, { scale: 1, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(2.2)' });
        } else fill.setAttribute('fill', color);
      });
    };
    choices.forEach((c) => {
      const click = () => pick(c.dataset.thaliPick ?? 'mutton');
      c.addEventListener('click', click);
      offs.push(() => c.removeEventListener('click', click));
    });

    if (motion && svg) {
      // Transforms only: opacity is left to CSS so nothing can strand a bowl invisible.
      gsap.set(bowls, { y: -260 });
      gsap.set(svg.querySelector('.th-plate'), { scale: 0.55, rotation: -40, svgOrigin: '300 300' });
      const tl = gsap.timeline({ scrollTrigger: { trigger: thali, start: 'top 75%', once: true } });
      tl.to(svg.querySelector('.th-plate'), { scale: 1, rotation: 0, svgOrigin: '300 300', duration: 1.3, ease: 'expo.out' })
        .to(bowls, { y: 0, duration: 0.95, ease: 'bounce.out', stagger: 0.09 }, '-=0.8')
        .add(() => thali.classList.add('is-steaming'), '-=0.3');
    } else {
      thali.classList.add('is-steaming');
    }
  }

  return () => offs.forEach((fn) => fn());
}
