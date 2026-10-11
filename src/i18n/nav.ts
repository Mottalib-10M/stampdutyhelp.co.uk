import { route, type Locale } from './routes';
import { PAGES, pageById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Home', method: 'How we calculate', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const GROUP_LABEL: Record<Group, string> = {
  calculators: 'Calculators', england: 'England & NI', scotland: 'Scotland', wales: 'Wales', situations: 'Your situation', prices: 'By price', places: 'By city', gains: 'Gains, dividends & rent', inheritance: 'Inheritance tax',
};
export const GROUP_ORDER: Group[] = ['calculators', 'england', 'scotland', 'wales', 'situations', 'prices', 'places', 'gains', 'inheritance'];
export const label = (id: string, _lang?: Locale) => CORE[id] ?? pageById(id)?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
export const inGroup = (g: Group, lang: Locale) => PAGES.filter((p) => p.group === g).map((p) => link(p.id, lang));
const byGroup = (lang: Locale) => GROUP_ORDER.map((g) => ({ label: GROUP_LABEL[g], links: inGroup(g, lang) })).filter((c) => c.links.length);
/** Header menu: the taxes after the purchase (gains, dividends, rent, inheritance) share one dropdown
 *  so that the bar keeps its width; the footer keeps one column per group. */
const MERGED: Group[] = ['gains', 'inheritance'];
export function navCategories(lang: Locale): NavCategory[] {
  const main = GROUP_ORDER.filter((g) => !MERGED.includes(g)).map((g) => ({ label: GROUP_LABEL[g], links: inGroup(g, lang) })).filter((c) => c.links.length);
  const other = MERGED.flatMap((g) => inGroup(g, lang));
  return other.length ? [...main, { label: 'Other taxes', links: other }] : main;
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [...byGroup(lang), { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) }];
export const popularLinks = (_lang: Locale): NavLink[] => [];
