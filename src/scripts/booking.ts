import { gsap } from 'gsap';
import { motionOK, type Cleanup } from './env';

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (v: string) => { const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d); };
const DAY = 86400000;

/** Stayflexi expects ?checkin=DD-MM-YYYY&num_nights=N&num_guests=G (as used by Google Hotels). */
export function bookingUrl(base: string, checkin: Date, nights: number, guests: number): string {
  const dmy = `${pad(checkin.getDate())}-${pad(checkin.getMonth() + 1)}-${checkin.getFullYear()}`;
  const u = new URL(base);
  u.searchParams.set('checkin', dmy);
  u.searchParams.set('num_nights', String(nights));
  u.searchParams.set('num_guests', String(guests));
  return u.toString();
}

export function initBooking(): Cleanup {
  const offs: Cleanup[] = [];
  document.querySelectorAll<HTMLFormElement>('form[data-booking]').forEach((form) => {
    const inEl = form.querySelector<HTMLInputElement>('[data-in]');
    const outEl = form.querySelector<HTMLInputElement>('[data-out]');
    const count = form.querySelector<HTMLOutputElement>('[data-guests]');
    const hidden = form.querySelector<HTMLInputElement>('[data-guests-input]');
    const err = form.querySelector<HTMLElement>('[data-bk-error]');
    if (!inEl || !outEl || !count || !hidden) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    inEl.min = iso(today);
    if (!inEl.value) inEl.value = iso(today);
    const syncOut = () => {
      const next = new Date(parse(inEl.value).getTime() + DAY);
      outEl.min = iso(next);
      if (!outEl.value || parse(outEl.value) <= parse(inEl.value)) outEl.value = iso(next);
    };
    syncOut();
    let guests = Number(hidden.value) || 2;
    const setGuests = (n: number, dir: number) => {
      guests = Math.min(9, Math.max(1, n));
      hidden.value = String(guests);
      if (motionOK() && dir) {
        gsap.fromTo(count, { yPercent: dir * 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out' });
      }
      count.textContent = String(guests);
    };
    const onStep = (e: Event) => {
      const b = (e.target as Element).closest<HTMLButtonElement>('[data-step]');
      if (!b) return;
      const dir = Number(b.dataset.step);
      setGuests(guests + dir, dir);
    };
    const onSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      const ci = parse(inEl.value);
      const co = parse(outEl.value);
      let msg = '';
      if (!inEl.value || ci < today) msg = form.dataset.errPast ?? '';
      else if (!outEl.value || co <= ci) msg = form.dataset.errOrder ?? '';
      if (err) err.textContent = msg;
      if (msg) { (ci < today ? inEl : outEl).focus(); return; }
      const nights = Math.round((co.getTime() - ci.getTime()) / DAY);
      window.open(bookingUrl(form.action, ci, nights, guests), '_blank', 'noopener');
    };
    form.addEventListener('click', onStep);
    form.addEventListener('submit', onSubmit);
    inEl.addEventListener('change', syncOut);
    offs.push(() => {
      form.removeEventListener('click', onStep);
      form.removeEventListener('submit', onSubmit);
      inEl.removeEventListener('change', syncOut);
    });
  });
  return () => offs.forEach((fn) => fn());
}
