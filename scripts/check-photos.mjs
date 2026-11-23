// Checks that no photo appears twice on the same page: each photo illustrates one thing only.
// Usage: npm run build && npm run check:photos        (checks dist/)
//        node scripts/check-photos.mjs dist-prod       (checks another build folder)
import { readdir, readFile } from 'node:fs/promises';
import { join, extname, resolve, relative } from 'node:path';

const DIST = resolve(process.argv[2] ?? 'dist');
const PHOTOS = (await readdir(resolve('src/assets/photos'))).map((f) => f.replace(/\.[^.]+$/, ''));

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (extname(p) === '.html') out.push(p);
  }
  return out;
}

let problems = 0;
const pages = await walk(DIST);
for (const page of pages) {
  const html = (await readFile(page, 'utf8')).replace(/<head>[\s\S]*?<\/head>/, ''); // skip preloads and meta images
  const counts = new Map();
  // One <picture> (or a bare <img>) is one use of a photo, however many sizes its srcset lists.
  for (const m of html.matchAll(/<picture\b[\s\S]*?<\/picture>|<img\b[^>]*>/g)) {
    const used = PHOTOS.filter((name) => m[0].includes(`/_astro/${name}.`));
    for (const name of new Set(used)) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  for (const [name, n] of counts) {
    if (n > 1) { problems++; console.log(`DUPLICATE PHOTO  /${relative(DIST, page).replace(/\\/g, '/').replace(/index\.html$/, '')}  ${name} x${n}`); }
  }
}
console.log(`${pages.length} pages checked, ${problems} photo(s) used more than once on a page.`);
process.exit(problems ? 1 : 0);
