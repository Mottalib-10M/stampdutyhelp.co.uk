/** UK House Price Index by local authority (scripts/data/build-hpi.py → data/hpi.json). */
import raw from '../data/hpi.json';
export interface Region { name: string; gss: string; nation: 'england' | 'wales' | 'scotland' | 'ni' | 'uk'; level: string; avg: number; ftb: number | null; mover: number | null; flat: number | null; detached: number | null; semi: number | null; terraced: number | null; change: number | null }
export const HPI = raw as { month: string; retrieved_at: string; source: string; regions: Record<string, Region> };
export function place(key: string): Region {
  const r = HPI.regions[key];
  if (!r) throw new Error(`Unknown UK HPI region: ${key}`);
  return r;
}
/** Tax nation of a region: Northern Ireland pays SDLT like England. */
export const taxNation = (r: Region) => (r.nation === 'scotland' ? 'scotland' : r.nation === 'wales' ? 'wales' : 'england') as 'england' | 'scotland' | 'wales';
export const monthLabel = (m = HPI.month) => new Date(`${m}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
