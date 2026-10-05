import { compute } from '../engine/tax';
import { gbp, pct } from './_kit';
/** Welsh higher residential rates on a price: the bill, the main-rate bill, and the extra cost of owning another home. */
export default () => ({
  title: 'LTT higher rates on a second home',
  cta: 'Full LTT calculator',
  inputs: [{ id: 'p', label: 'Purchase price', def: 260000, unit: '£', max: 50_000_000 }],
  run: ({ p }: Record<string, number>) => {
    const r = compute({ nation: 'wales', price: p, situation: 'additional' });
    return {
      head: ['LTT at the higher rates', gbp(r.total)] as [string, string],
      rows: [
        ['At main rates instead', gbp(r.mainTax)],
        ['Extra cost of the other home', gbp(r.surcharge)],
        ['Bill as a share of the price', pct(r.effectiveRate)],
      ] as [string, string][],
      note: r.notes[0] ?? 'Higher residential rates: a separate band table in force since 11 December 2024.',
    };
  },
});
