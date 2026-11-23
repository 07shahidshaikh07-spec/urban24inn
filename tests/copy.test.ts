// Wording the live site shows while the WhatsApp number is unconfirmed (the production build hides the forms).
// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ui } from '../src/i18n/ui.ts';

test('fallback copy never mentions WhatsApp or an unconfirmed number', () => {
  for (const lang of ['en', 'mr'] as const) {
    const t = ui[lang];
    for (const s of [t.cta.textNoWa, t.restaurant.table.unavailable, t.banquet.form.unavailable]) {
      assert.ok(s.trim(), `${lang}: empty fallback text`);
      assert.doesNotMatch(s, /whatsapp|व्हॉट्स|confirm|निश्चित|number|नंबर/i, `${lang}: "${s}"`);
    }
  }
});
