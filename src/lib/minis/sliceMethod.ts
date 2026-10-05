import { compute } from '../engine/tax';
import { gbp, pct, nationOptions, NATIONS } from './_kit';
export default () => ({
  title: 'Slice by slice: your price in any nation',
  cta: 'Full calculator with every situation',
  inputs: [
    { id: 'p', label: 'Purchase price', def: 380000, unit: '£', max: 50_000_000 },
    { id: 'n', label: 'Nation', def: 0, options: nationOptions },
  ],
  run: ({ p, n }: Record<string, number>) => {
    const nation = NATIONS[n] ?? 'england';
    const r = compute({ nation, price: p, situation: 'home' });
    const used = r.bands.filter((b) => b.taxable > 0);
    const top = used[used.length - 1];
    const next = compute({ nation, price: p + 1000, situation: 'home' }).total;
    return {
      head: [`${r.taxName}, one home`, gbp(r.total)] as [string, string],
      rows: [
        ['Slices of the price taxed', String(used.filter((b) => b.rate > 0).length)],
        ['Rate on your top slice', top ? pct(top.rate) : pct(0)],
        ['Effective rate on the whole price', pct(r.effectiveRate)],
        [`Tax on the next ${gbp(1000)}`, gbp(next - r.total)],
      ] as [string, string][],
      note: r.rule,
    };
  },
});
