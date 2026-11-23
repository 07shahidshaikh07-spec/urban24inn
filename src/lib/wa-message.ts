// Builds WhatsApp enquiry text. Dependency-free so it can be unit-tested with plain Node.

export const WA_KEYS = ['people', 'date', 'time', 'name', 'note', 'occasion'] as const;
export type WaKey = (typeof WA_KEYS)[number];

/**
 * Fill {people} {date} {time} {name} {note} {occasion} in one pass. A function replacer is used
 * so that whatever a visitor types (including `$&`, `$'` or `{note}`) is inserted literally.
 */
export function fillTemplate(template: string, values: Partial<Record<WaKey, string>>): string {
  return template.replace(/\{(people|date|time|name|note|occasion)\}/g, (_m, key: WaKey) => values[key] ?? '');
}
