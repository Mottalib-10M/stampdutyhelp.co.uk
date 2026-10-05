/** Tables shared by the city pages: tax on each UK HPI average of a council, computed by the engine. */
import type { Helpers } from './page-types';
import { taxNation, monthLabel, type Region } from './hpi';
import type { Situation } from './engine/tax';

const TYPES: Array<[string, keyof Region]> = [['Flat or maisonette', 'flat'], ['Terraced house', 'terraced'], ['Semi-detached house', 'semi'], ['Detached house', 'detached'], ['All sales', 'avg']];

/** Average price by property type, with the tax for a first-time buyer, a one-home buyer and an additional property. */
export function typesTable(h: Helpers, r: Region, caption?: string) {
  const n = taxNation(r);
  const rows = TYPES.filter(([, k]) => r[k]).map(([l, k]) => {
    const p = r[k] as number;
    return [l, h.gbp(p), h.gbp(h.t(n, p, 'first')), h.gbp(h.t(n, p)), h.gbp(h.t(n, p, 'additional'))];
  });
  return h.table(['Home', 'Average price', 'First-time buyer', 'One home', 'Additional property'], rows, caption ?? `${r.name}: tax on UK HPI averages, ${monthLabel()}`, ['l', 'r', 'r', 'r', 'r']);
}

/** The same price taxed in the three nations, for each buyer situation. */
export function nationsTable(h: Helpers, price: number, caption: string) {
  const sits: Array<[string, Situation]> = [['First-time buyer', 'first'], ['One home', 'home'], ['Additional property', 'additional']];
  return h.table(['Buyer', 'England & NI', 'Scotland', 'Wales'], sits.map(([l, s]) => [l, h.gbp(h.t('england', price, s)), h.gbp(h.t('scotland', price, s)), h.gbp(h.t('wales', price, s))]), caption, ['l', 'r', 'r', 'r']);
}
