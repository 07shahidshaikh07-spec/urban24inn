import { motionOK, type Cleanup } from './env';
import { fillTemplate } from '../lib/wa-message';

/**
 * WhatsApp enquiry forms (restaurant table, banquet date) and animated FAQ accordions.
 * A form declares data-wa (number), data-template (with {placeholders}), data-note-prefix and
 * data-err-<field> messages; only fields present in the form are validated.
 */
export function initForms(): Cleanup {
  const offs: Cleanup[] = [];

  document.querySelectorAll<HTMLFormElement>('form[data-wa-form]').forEach((form) => {
    const number = form.dataset.wa ?? '';
    const lang = document.documentElement.lang.startsWith('mr') ? 'mr' : 'en';
    const date = form.querySelector<HTMLInputElement>('input[name="date"]');
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (date) date.min = today;

    const field = (name: string) => form.querySelector<HTMLInputElement>(`[name="${name}"]`);
    const setError = (name: string, msg: string) => {
      field(name)?.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const out = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
      if (out) out.textContent = msg;
    };

    const onSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      const data = new FormData(form);
      const get = (k: string) => String(data.get(k) ?? '').trim();
      const errors: Record<string, string> = {};
      const err = (k: string) => form.dataset[`err${k[0].toUpperCase()}${k.slice(1)}`] ?? '';
      if (field('name') && !get('name')) errors.name = err('name');
      if (date && (!get('date') || get('date') < today)) errors.date = err('date');
      if (field('time') && !get('time')) errors.time = err('time');
      if (field('occasion') && !get('occasion')) errors.occasion = err('occasion');
      const peopleEl = field('people');
      const people = Number(get('people'));
      if (peopleEl) {
        const min = Number(peopleEl.min || 1);
        const max = Number(peopleEl.max || 60);
        if (!Number.isInteger(people) || people < min || people > max) errors.people = err('people');
      }
      ['name', 'date', 'time', 'people', 'occasion'].forEach((k) => setError(k, errors[k] ?? ''));
      const firstBad = Object.keys(errors)[0];
      if (firstBad) { field(firstBad)?.focus(); return; }

      const prettyDate = get('date')
        ? new Intl.DateTimeFormat(lang === 'en' ? 'en-IN' : 'mr-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(get('date') + 'T00:00'))
        : '';
      const text = fillTemplate(form.dataset.template ?? '', {
        people: peopleEl ? String(people) : '',
        date: prettyDate,
        time: get('time'),
        name: get('name'),
        occasion: get('occasion'),
        note: get('note') ? `${form.dataset.notePrefix ?? ''}${get('note')}` : '',
      });
      window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    };
    form.addEventListener('submit', onSubmit);
    offs.push(() => form.removeEventListener('submit', onSubmit));
  });

  // Accordions: animate <details> open and close.
  document.querySelectorAll<HTMLDetailsElement>('details[data-acc]').forEach((d) => {
    const summary = d.querySelector('summary');
    const body = d.querySelector<HTMLElement>('[data-acc-body]');
    if (!summary || !body) return;
    const onClick = (e: MouseEvent) => {
      if (!motionOK()) return;
      e.preventDefault();
      if (d.open) {
        const h = body.offsetHeight;
        body.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.76,0,.24,1)' }).onfinish = () => { d.open = false; };
      } else {
        d.open = true;
        const h = body.offsetHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
    };
    summary.addEventListener('click', onClick);
    offs.push(() => summary.removeEventListener('click', onClick));
  });

  return () => offs.forEach((fn) => fn());
}
