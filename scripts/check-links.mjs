// Checks every internal link, anchor and asset in a build points at something that exists.
// Usage: npm run build && npm run check:links        (checks dist/)
//        node scripts/check-links.mjs dist-prod        (checks another build folder)
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = process.argv[2] ? resolve(process.argv[2]) + sep : fileURLToPath(new URL('../dist/', import.meta.url));

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (extname(p) === '.html') out.push(p);
  }
  return out;
}

async function exists(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (!clean) return true;
  const candidates = clean.endsWith('/') ? [join(DIST, clean, 'index.html')] : [join(DIST, clean), join(DIST, clean, 'index.html')];
  for (const c of candidates) {
    try { if ((await stat(c)).isFile()) return true; } catch { /* try next */ }
  }
  return false;
}

const pages = await walk(DIST);
let broken = 0;
let checked = 0;
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g), ...html.matchAll(/\ssrcset="([^"]+)"/g)]
    .flatMap((m) => (m[0].includes('srcset') ? m[1].split(',').map((s) => s.trim().split(' ')[0]) : [m[1]]))
    .filter((u) => u.startsWith('/') && !u.startsWith('//'));
  for (const ref of new Set(refs)) {
    checked++;
    if (!(await exists(ref))) {
      broken++;
      console.log(`BROKEN  ${page.replace(DIST, '/')} -> ${ref}`);
    }
  }
  // In-page anchors
  for (const m of html.matchAll(/\shref="#([^"]+)"/g)) {
    checked++;
    if (!html.includes(`id="${m[1]}"`)) {
      broken++;
      console.log(`MISSING ANCHOR  ${page.replace(DIST, '/')} -> #${m[1]}`);
    }
  }
}
console.log(`\n${pages.length} pages, ${checked} internal links checked, ${broken} broken.`);
process.exit(broken ? 1 : 0);
