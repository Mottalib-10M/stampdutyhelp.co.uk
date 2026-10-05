import { compute } from '../engine/tax';
import { gbp, pct } from './_kit';
/** LBTT on a price: the bill, the band the last pound falls in, and the same home in England and Wales. */
export default () => ({
  title: 'LBTT on your price, slice by slice',
  cta: 'Full LBTT calculator',
  inputs: [{ id: 'p', label: 'Purchase price', def: 275000, unit: '£', max: 50_000_000 }],
  run: ({ p }: Record<string, number>) => {
    const r = compute({ nation: 'scotland', price: p, situation: 'home' });
    const top = [...r.bands].reverse().find((b) => b.taxable > 0);
    return {
      head: ['LBTT for a buyer of one home', gbp(r.total)] as [string, string],
      rows: [
        ['Rate on your last pound', top ? pct(top.rate) : pct(0)],
        ['Share of the price', pct(Math.round(r.effectiveRate * 1000) / 1000)],
        ['Same home in England / Wales', `${gbp(compute({ nation: 'england', price: p, situation: 'home' }).total)} / ${gbp(compute({ nation: 'wales', price: p, situation: 'home' }).total)}`],
      ] as [string, string][],
      note: 'Standard residential bands of Revenue Scotland, no supplement and no first-time buyer relief.',
    };
  },
});
