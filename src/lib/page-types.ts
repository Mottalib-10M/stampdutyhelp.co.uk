/**
 * One page = ONE data file in `src/content/pages/<id>.ts` (CONTRIBUTING-PAGES.md). It carries the
 * URL, the snippets, the answer block, the FAQ, the body, the sources, the calculator or mini-simulator
 * and the related pages. Routes, menus, footer, sitemap, schemas and internal links read it alone.
 */
import type { Params, SourceKey } from './engine/params';
import type { Nation, Situation, Result, Input } from './engine/tax';
import type { Region } from './hpi';

export type Group = 'calculators' | 'england' | 'scotland' | 'wales' | 'situations' | 'prices' | 'places' | 'gains' | 'inheritance';
export interface FAQ { q: string; a: string }

export interface Helpers {
  /** Internal link by page id. An unknown id fails the page test. */
  a: (id: string, text: string) => string;
  /** £1,234 (no pence by default). */
  gbp: (n: number, decimals?: number) => string;
  num: (n: number, decimals?: number) => string;
  /** 0.05 → "5%" ; one decimal only when needed (7.5%). */
  pct: (x: number) => string;
  date: (iso: string) => string;
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to an official source of params-2026.json. */
  src: (key: SourceKey, text?: string) => string;
  /** The engine: every figure in a sentence is computed, never typed. */
  tax: (i: Input) => Result;
  /** Shorthand: total tax for a nation, price and situation. */
  t: (nation: Nation, price: number, situation?: Situation, extra?: Partial<Input>) => number;
  /** Band table of a nation, rendered from the parameters. */
  bands: (which: 'sdlt' | 'sdltFtb' | 'sdltHigher' | 'sdltNonRes' | 'lbtt' | 'lbttFtb' | 'lbttNonRes' | 'ltt' | 'lttHigher' | 'lttNonRes', caption?: string) => string;
  /** Worked example: band-by-band table from the engine. */
  breakdown: (i: Input, caption?: string) => string;
  /** UK House Price Index row for a region key (src/data/hpi.json). */
  place: (key: string) => Region;
  P: Params;
}

export type ToolKind = 'calc' | 'area' | 'joint' | 'shared' | 'refund' | 'transfer' | 'cgt' | 'iht' | 'dividend' | 'rental';
export interface ToolProps { cgtMode?: 'property' | 'any'; nation?: Nation; lockNation?: boolean; situation?: Situation; price?: number; company?: boolean; nonResident?: boolean; kind?: 'residential' | 'nonresidential' }

export interface PageDef {
  /** Equal to the file name. */
  id: string;
  group: Group;
  order: number;
  /** URL segment: lowercase and dashes. A price page carries its amount (stamp-duty-on-300000). */
  slug: string;
  nav: string;
  card: string;
  /** 50 to 60 characters, key term first, year included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, year included. */
  description: string;
  h1: string;
  intro: string;
  /** ONE paragraph of 120 words or more, with the figures (RECETTE §21). */
  resume: string;
  /** Real questions, 40 to 90-word answers, unique across the site (RECETTE §7). */
  faqs: FAQ[];
  /** HTML body. `<!--mini:kind-->` inserts one more mini-simulator. */
  body: (h: Helpers) => string;
  /** Full tool of a tool page (placed before the answer block). */
  tool?: ToolKind;
  toolProps?: ToolProps;
  /** Mini-simulator after the answer block (`src/lib/minis/<kind>.ts`). Ignored when `tool` is set. */
  mini?: string;
  /** Page the mini-simulator button points to (default: home calculator). */
  miniHref?: string;
  /** City pages: UK HPI region key (src/data/hpi.json). The calculator opens on its average price. */
  place?: string;
  related: string[];
  sources: SourceKey[];
}
export const definePage = (p: PageDef): PageDef => p;
