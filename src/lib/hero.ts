import { getImage } from 'astro:assets';
import { photos, type PhotoId } from './photos';

const WIDTHS = [480, 760, 1100];

/** `sizes` for the hero photos. The page's preload must use the same value, or the browser fetches twice. */
export const HOME_HERO_SIZES = '(min-width: 960px) 36vw, 92vw';
export const PAGE_HERO_SIZES = '(min-width: 960px) 52vw, 100vw';

/** Responsive sources for an above-the-fold photo; shared by the <picture> and its preload. */
export async function getHeroSources(id: PhotoId) {
  const src = photos[id].src;
  const ws = [...new Set([...WIDTHS.filter((w) => w < src.width), src.width])];
  const set = async (format: 'avif' | 'webp') =>
    (await Promise.all(ws.map((w) => getImage({ src, width: w, format })))).map((r, i) => `${r.src} ${ws[i]}w`).join(', ');
  const [avif, webp, fb] = await Promise.all([set('avif'), set('webp'), getImage({ src, width: 760, format: 'jpg', quality: 78 })]);
  return { avif, webp, fallback: fb.src, width: src.width, height: src.height };
}
