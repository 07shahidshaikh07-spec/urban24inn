import site from '../content/site.json';
import restaurant from '../content/restaurant.json';
import rooms from '../content/rooms.json';
import banquet from '../content/banquet.json';

export { site, restaurant, rooms, banquet };

export type Lang = 'en' | 'mr';
export type L10n = { en: string; mr: string };
export type PageKey = 'home' | 'rooms' | 'restaurant' | 'banquet';

/**
 * Draft mode shows facts the owner has not confirmed yet, with a dashed "to confirm" mark.
 * On for `astro dev` and `npm run build:draft` (astro build --mode draft).
 * Off for `npm run build`, which strips every unconfirmed fact from the pages.
 */
export const DRAFT: boolean = import.meta.env.DEV || import.meta.env.MODE === 'draft';

type Flagged = { confirmed?: boolean } | null | undefined;
/** Should this fact appear on the page? */
export const show = (f: Flagged): boolean => !!f && (f.confirmed === true || DRAFT);
/** Is this fact unconfirmed (so it needs a "to confirm" mark)? */
export const tbc = (f: Flagged): boolean => !!f && f.confirmed !== true;

export const tr = (v: L10n | string | null | undefined, lang: Lang): string =>
  v == null ? '' : typeof v === 'string' ? v : (v[lang] ?? v.en);

export const routes: Record<PageKey, Record<Lang, string>> = {
  home: { en: '/', mr: '/mr/' },
  rooms: { en: '/rooms/', mr: '/mr/rooms/' },
  restaurant: { en: '/restaurant/', mr: '/mr/restaurant/' },
  banquet: { en: '/banquet/', mr: '/mr/banquet/' },
};
export const href = (page: PageKey, lang: Lang, hash = ''): string => routes[page][lang] + hash;

const MR_DIGITS = '०१२३४५६७८९';
/** Marathi pages use Devanagari numerals. */
export const num = (n: number | string, lang: Lang): string =>
  lang === 'mr' ? String(n).replace(/[0-9]/g, (d) => MR_DIGITS[Number(d)]) : String(n);

export const rupees = (n: number, lang: Lang): string => '₹' + num(n.toLocaleString('en-IN'), lang);

/** "12:00" -> "12 noon" / "दुपारी १२" */
export function fmtTime(hhmm: string, lang: Lang): string {
  const [h, m] = hhmm.split(':').map(Number);
  const h12 = ((h + 11) % 12) + 1;
  const mins = m ? ':' + String(m).padStart(2, '0') : '';
  if (lang === 'en') {
    if (h === 12 && !m) return '12 noon';
    return `${h12}${mins} ${h >= 12 ? 'PM' : 'AM'}`;
  }
  const part = h < 12 ? 'सकाळी' : h < 16 ? 'दुपारी' : h < 19 ? 'संध्याकाळी' : 'रात्री';
  return `${part} ${num(h12 + mins, 'mr')}`;
}

export const DAYS: Record<string, L10n> = {
  mon: { en: 'Monday', mr: 'सोमवार' },
  tue: { en: 'Tuesday', mr: 'मंगळवार' },
  wed: { en: 'Wednesday', mr: 'बुधवार' },
  thu: { en: 'Thursday', mr: 'गुरुवार' },
  fri: { en: 'Friday', mr: 'शुक्रवार' },
  sat: { en: 'Saturday', mr: 'शनिवार' },
  sun: { en: 'Sunday', mr: 'रविवार' },
};

export const waLink = (number: string, text: string): string =>
  `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

export function fullAddress(lang: Lang, withPostcode = show(site.property.address.postcode)): string {
  const a = site.property.address;
  const parts = [tr(a.street, lang), tr(a.road, lang), tr(a.city, lang)];
  const tail = withPostcode ? `${tr(a.region, lang)} ${num(a.postcode.value, lang)}` : tr(a.region, lang);
  return [...parts, tail].join(', ');
}

export interface ChecklistEntry { label: string; value: string; source: string; area: string }

/** Every unconfirmed fact in the content files, for the owner checklist page. */
export function collectUnconfirmed(): ChecklistEntry[] {
  const out: ChecklistEntry[] = [];
  const walk = (node: unknown, area: string) => {
    if (Array.isArray(node)) return node.forEach((n) => walk(n, area));
    if (!node || typeof node !== 'object') return;
    const o = node as Record<string, unknown>;
    if (o.confirmed === false && typeof o.label === 'string') {
      const v = o.value ?? o.display ?? o.items ?? o.days ?? o.a ?? '';
      out.push({
        label: o.label,
        value: typeof v === 'string' || typeof v === 'number' ? String(v) : JSON.stringify(v).slice(0, 160),
        source: String(o.source ?? ''),
        area,
      });
    }
    for (const [k, v] of Object.entries(o)) if (k !== 'value') walk(v, area);
  };
  walk(site, 'Brand and contact');
  walk(rooms, 'Rooms');
  walk(restaurant, 'Restaurant');
  walk(banquet, 'Banquet hall');
  return out;
}
