// QA screenshots at the brief's breakpoints, with exact device emulation and real-time waits
// (so entrance animations finish). Drives the installed Chrome over the DevTools protocol.
// Usage: node scripts/qa-screens.mjs http://localhost:4321 <outDir> [--reduced-motion]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const base = process.argv[2] ?? 'http://localhost:4321';
const out = process.argv[3] ?? 'qa-screens';
const reduced = process.argv.includes('--reduced-motion');
const chromePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const pages = ['/', '/rooms/', '/restaurant/', '/banquet/', '/mr/', '/mr/rooms/', '/mr/restaurant/', '/mr/banquet/'];
const sizes = [[360, 780], [390, 844], [768, 1024], [1280, 800]];
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(out, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), 'qa-chrome-'));
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: 'ignore' });

try {
  let targets;
  for (let i = 0; i < 40 && !targets; i++) {
    await sleep(250);
    targets = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json()).catch(() => undefined);
  }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0;
  const pending = new Map();
  const waiters = [];
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
    if (msg.method) waiters.filter((w) => w.method === msg.method).forEach((w) => w.resolve());
  });
  const send = (method, params = {}) => new Promise((resolve) => { const n = ++id; pending.set(n, resolve); ws.send(JSON.stringify({ id: n, method, params })); });
  const once = (method) => new Promise((resolve) => waiters.push({ method, resolve }));

  await send('Page.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] });
  // Warm-up visit: a fresh browser renders its first page late, which would catch the intro mid-play.
  // It also marks the intro as seen for this session, so every shot shows the page itself.
  const warm = once('Page.loadEventFired');
  await send('Page.navigate', { url: base + '/' });
  await warm;
  await sleep(4500);
  for (const p of pages) {
    for (const [w, h] of sizes) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
      await send('Emulation.setTouchEmulationEnabled', { enabled: w < 768 });
      const loaded = once('Page.loadEventFired');
      await send('Page.navigate', { url: base + p });
      await loaded;
      await sleep(4200); // let the intro and entrance animations finish in real time
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const name = `${(p.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home')}-${w}${reduced ? '-rm' : ''}.png`;
      writeFileSync(join(out, name), Buffer.from(shot.data, 'base64'));
      console.log('saved', name);
    }
  }
  ws.close();
} finally {
  chrome.kill();
  await sleep(500);
  try { rmSync(profile, { recursive: true, force: true }); } catch { /* Chrome may still hold files */ }
}
