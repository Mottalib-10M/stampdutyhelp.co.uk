import { compute } from '../engine/tax';
import { gbp, pct } from './_kit';
export default () => ({
  title: 'Your price through the SDLT bands',
  cta: 'Full calculator with every situation',
  inputs: [{ id: 'p', label: 'Purchase price', def: 450000, unit: '£', max: 50_000_000 }],
  run: ({ p }: Record<string, number>) => {
    const r = compute({ nation: 'england', price: p, situation: 'home' });
    const used = r.bands.filter((b) => b.taxable > 0);
    const last = used[used.length - 1];
    return {
      head: ['SDLT at standard residential rates', gbp(r.total)] as [string, string],
      rows: [
        ['Highest band reached', last ? pct(last.rate) : pct(0)],
        ['Tax on the slice in that band', gbp(last ? Math.floor(last.tax) : 0)],
        ['Effective rate on the whole price', pct(r.effectiveRate)],
        ['First-time buyer / second home', `${gbp(compute({ nation: 'england', price: p, situation: 'first' }).total)} / ${gbp(compute({ nation: 'england', price: p, situation: 'additional' }).total)}`],
      ] as [string, string][],
      note: r.rule,
    };
  },
});
