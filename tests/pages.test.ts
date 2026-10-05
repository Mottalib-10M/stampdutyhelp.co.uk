/**
 * Every page file is checked before it reaches the build (CONTRIBUTING-PAGES.md):
 * snippet lengths, answer block, FAQ length and uniqueness, links, sources, mini-simulator, banned phrases.
 * One page only: PAGE_FILES=stamp-duty-on-300000 npx vitest run tests/pages.test.ts
 */
import { describe, it, expect } from 'vitest';
import { PAGES } from '../src/lib/pages';
import { HOME } from '../src/content/home';
import { helpers } from '../src/lib/helpers';
import { MINIS } from '../src/lib/mini-specs';
import { SOURCES } from '../src/lib/engine/params';

const only = (process.env.PAGE_FILES ?? '').split(',').filter(Boolean);
const pages = only.length ? PAGES.filter((p) => only.includes(p.id)) : PAGES;
const words = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const BANNED = [/—/, /&mdash;/, /it[’']s important to note/i, /dive into/i, /whether you[’']re/i, /in today[’']s world/i, /\bMoreover\b/, /\bAdditionally\b/, /\bFurthermore\b/];
const allQ = [...HOME.faqs.map((f) => f.q), ...PAGES.flatMap((p) => p.faqs.map((f) => f.q))];

describe('home', () => {
  it('snippets and answer block', () => {
    expect(HOME.title.length).toBeGreaterThanOrEqual(50); expect(HOME.title.length).toBeLessThanOrEqual(60);
    expect(HOME.description.length).toBeGreaterThanOrEqual(150); expect(HOME.description.length).toBeLessThanOrEqual(160);
    expect(words(HOME.resume)).toBeGreaterThanOrEqual(120);
    expect(HOME.faqs.length).toBeGreaterThanOrEqual(6);
    for (const f of HOME.faqs) { const n = words(f.a); expect(n, f.q).toBeGreaterThanOrEqual(40); expect(n, f.q).toBeLessThanOrEqual(90); }
    expect(() => HOME.body(helpers())).not.toThrow();
  });
});

describe.each(pages.map((p) => [p.id, p] as const))('%s', (_id, p) => {
  it('snippets (RECETTE §11)', () => {
    expect(p.title.length, p.title).toBeGreaterThanOrEqual(50); expect(p.title.length, p.title).toBeLessThanOrEqual(60);
    expect(p.description.length, p.description).toBeGreaterThanOrEqual(150); expect(p.description.length, p.description).toBeLessThanOrEqual(160);
    expect(p.title).toMatch(/2026/);
    expect(p.slug).toMatch(/^[a-z0-9-]+$/);
  });
  it('answer block of 120 words or more (RECETTE §21)', () => expect(words(p.resume)).toBeGreaterThanOrEqual(120));
  it('FAQ: 3 to 8 questions, 40 to 90 words, unique on the site (RECETTE §7)', () => {
    expect(p.faqs.length).toBeGreaterThanOrEqual(3); expect(p.faqs.length).toBeLessThanOrEqual(8);
    for (const f of p.faqs) {
      const n = words(f.a); expect(n, f.q).toBeGreaterThanOrEqual(40); expect(n, f.q).toBeLessThanOrEqual(90);
      expect(allQ.filter((q) => q === f.q).length, f.q).toBe(1);
    }
  });
  it('links, sources, simulator', () => {
    expect(() => p.body(helpers())).not.toThrow();
    for (const r of p.related) expect(PAGES.some((x) => x.id === r), `related ${r}`).toBe(true);
    expect(p.related.length).toBeGreaterThanOrEqual(3);
    expect(p.sources.length).toBeGreaterThanOrEqual(2);
    for (const s of p.sources) expect(SOURCES[s], s).toBeTruthy();
    expect(!!p.tool || !!p.mini, 'a tool or a mini-simulator (RECETTE §9.3)').toBe(true);
    if (p.mini) { expect(MINIS[p.mini], p.mini).toBeTruthy(); const spec = MINIS[p.mini](); const out = spec.run(Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]))); expect(out.head[1]).not.toMatch(/NaN|undefined/); }
  });
  it('no banned phrase, no em dash', () => {
    const text = [p.title, p.description, p.h1, p.intro, p.resume, p.card, ...p.faqs.flatMap((f) => [f.q, f.a]), p.body(helpers())].join(' ');
    for (const b of BANNED) expect(text, String(b)).not.toMatch(b);
    expect(text).not.toMatch(/NaN|undefined|\[object/);
  });
  it('body length (guides 850+ words of prose, tool pages 150+)', () => {
    const n = words(p.body(helpers()).replace(/<table[\s\S]*?<\/table>/g, ''));
    expect(n).toBeGreaterThanOrEqual(p.tool ? 150 : 850);
  });
});

it('slugs are unique', () => { const s = PAGES.map((p) => p.slug); expect(new Set(s).size).toBe(s.length); });
