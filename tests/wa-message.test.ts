// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fillTemplate } from '../src/lib/wa-message.ts';

const TEMPLATE = 'Hello Dalchini, a table for {people} on {date} at {time}. Name: {name}.{note}';

test('fills every placeholder', () => {
  const out = fillTemplate(TEMPLATE, { people: '4', date: 'Sat 28 Nov', time: '20:00', name: 'Asha', note: ' Note: window seat' });
  assert.equal(out, 'Hello Dalchini, a table for 4 on Sat 28 Nov at 20:00. Name: Asha. Note: window seat');
});

// Regression: String.replace with a string treated `$&`, `$'` and `$\`` as patterns and
// re-scanned visitor text, so a name like `A$'B` or `{note}` corrupted the message.
test('visitor text with $ patterns is inserted literally', () => {
  const out = fillTemplate(TEMPLATE, { people: '2', date: 'Mon', time: '13:00', name: "A$'B$&C$`D", note: '' });
  assert.ok(out.includes("Name: A$'B$&C$`D."), out);
});

test('a placeholder typed by the visitor is not expanded', () => {
  const out = fillTemplate(TEMPLATE, { people: '2', date: 'Mon', time: '13:00', name: '{note}', note: ' Note: secret' });
  assert.ok(out.includes('Name: {note}.'), out);
  assert.ok(out.endsWith(' Note: secret'), out);
});

test('missing values become empty, not "undefined"', () => {
  assert.equal(fillTemplate('{name}|{note}', { name: 'X' }), 'X|');
});
