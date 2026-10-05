/** Typed access to `data/params-2026.json`. No value is ever written in the code (RECETTE §4). */
import raw from '../../data/params-2026.json';

export type Band = [number | null, number];
export const P = raw as typeof raw & {
  sdlt: { residential: Band[]; first_time_buyer: Band[]; non_residential: Band[]; previous: { residential: Band[]; first_time_buyer: Band[] } };
  lbtt: { residential: Band[]; non_residential: Band[] };
  ltt: { main: Band[]; higher: Band[]; higher_previous: Band[]; non_residential: Band[] };
};
export type SourceKey = keyof typeof raw.sources;
export const SOURCES = raw.sources as Record<SourceKey, { url: string; label: string }>;
export type Params = typeof P;
