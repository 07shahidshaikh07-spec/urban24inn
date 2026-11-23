// Content integrity: guards the "never publish unconfirmed facts" rule and the menu data.
// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import site from '../src/content/site.json' with { type: 'json' };
import restaurant from '../src/content/restaurant.json' with { type: 'json' };
import rooms from '../src/content/rooms.json' with { type: 'json' };
import banquet from '../src/content/banquet.json' with { type: 'json' };

function walk(node, visit, path = '') {
  if (Array.isArray(node)) return node.forEach((n, i) => walk(n, visit, `${path}[${i}]`));
  if (!node || typeof node !== 'object') return;
  visit(node, path);
  for (const [k, v] of Object.entries(node)) walk(v, visit, `${path}.${k}`);
}

test('every unconfirmed fact has a label and a source (so it reaches the owner checklist)', () => {
  for (const [name, doc] of Object.entries({ site, restaurant, rooms, banquet })) {
    walk(doc, (o, path) => {
      if (o.confirmed === false) {
        assert.ok(typeof o.label === 'string' && o.label.length > 3, `${name}${path} needs a label`);
        assert.ok(typeof o.source === 'string' && o.source.length > 3, `${name}${path} needs a source`);
      }
    });
  }
});

test('every menu dish has English, Marathi, a veg flag and a positive whole-rupee price', () => {
  let n = 0;
  for (const cat of restaurant.menu.categories) {
    assert.ok(cat.name.en && cat.name.mr, `category ${cat.id} needs both names`);
    for (const it of cat.items) {
      n++;
      assert.ok(it.en?.trim(), `${cat.id}: dish missing English name`);
      assert.match(it.mr ?? '', /[ऀ-ॿ]/, `${cat.id}/${it.en}: Marathi name must be Devanagari`);
      assert.equal(typeof it.veg, 'boolean', `${cat.id}/${it.en}: veg must be true or false`);
      assert.ok(Number.isInteger(it.price) && it.price > 0, `${cat.id}/${it.en}: price must be a whole number of rupees`);
    }
  }
  assert.ok(n > 100, `expected the full menu, got ${n} dishes`);
});

test('bilingual fields are filled in both languages', () => {
  for (const [name, doc] of Object.entries({ site, restaurant, rooms, banquet })) {
    walk(doc, (o, path) => {
      if ('en' in o && 'mr' in o && typeof o.en === 'string') {
        assert.ok(o.en.trim(), `${name}${path}: empty English`);
        assert.ok(typeof o.mr === 'string' && o.mr.trim(), `${name}${path}: empty Marathi`);
      }
    });
  }
});

test('hours use 24-hour times and cover all seven days', () => {
  const days = restaurant.hours.days.map((d) => d.day);
  assert.deepEqual([...new Set(days)].sort(), ['fri', 'mon', 'sat', 'sun', 'thu', 'tue', 'wed']);
  for (const d of restaurant.hours.days) {
    if (d.closed) continue;
    assert.match(d.open, /^([01]\d|2[0-3]):[0-5]\d$/);
    assert.match(d.close, /^([01]\d|2[0-3]):[0-5]\d$/);
  }
});

test('phone and WhatsApp numbers are well formed when present', () => {
  for (const key of ['phone']) {
    const v = site.contact[key].value;
    if (v) assert.match(v, /^\+91\d{10}$/, `${key} must look like +91XXXXXXXXXX`);
  }
  for (const key of ['whatsapp']) {
    const v = site.contact[key].value;
    if (v) assert.match(v, /^91\d{10}$/, `${key} must be digits with country code`);
  }
});

test('the four services are recorded in the client’s order, with the rooftop bar marked coming soon', () => {
  assert.deepEqual(Object.keys(site.services), ['dine', 'stay', 'celebrate', 'unwind']);
  assert.equal(site.services.unwind.status, 'coming-soon');
});

test('no leftover Dalchini branding in visitor-facing content (the brand is Urban 24 Inn)', () => {
  const text = JSON.stringify({ restaurant, rooms, banquet, brand: site.brand, services: site.services });
  assert.ok(!/dalchini|दालचिनी/i.test(text), 'found Dalchini in content');
});
