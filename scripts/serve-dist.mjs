// Tiny static server with Brotli/gzip, like a real host (Netlify, Vercel, Cloudflare Pages).
// Used for local Lighthouse runs: node scripts/serve-dist.mjs dist 4500
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, sep } from 'node:path';
import zlib from 'node:zlib';

const root = resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || 4500);
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json',
  '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff',
};
const compressible = /text|javascript|xml|json|svg/;

http.createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    let file = resolve(join(root, path));
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) { file = join(file, 'index.html'); info = await stat(file).catch(() => null); }
    let status = 200;
    if (!info) { file = join(root, '404.html'); status = 404; }
    let body = await readFile(file);
    const type = types[extname(file)] ?? 'application/octet-stream';
    const headers = {
      'Content-Type': type,
      'Cache-Control': path.startsWith('/_astro/') ? 'public, max-age=31536000, immutable' : 'no-cache',
    };
    const accept = String(req.headers['accept-encoding'] ?? '');
    if (compressible.test(type) && accept.includes('br')) { body = zlib.brotliCompressSync(body); headers['Content-Encoding'] = 'br'; }
    else if (compressible.test(type) && accept.includes('gzip')) { body = zlib.gzipSync(body); headers['Content-Encoding'] = 'gzip'; }
    headers['Content-Length'] = body.length;
    res.writeHead(status, headers).end(body);
  } catch (err) {
    res.writeHead(500).end(String(err));
  }
}).listen(port, '127.0.0.1', () => console.log(`Serving ${root} at http://localhost:${port}`));
