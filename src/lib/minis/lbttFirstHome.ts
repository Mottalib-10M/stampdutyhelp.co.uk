import { compute } from '../engine/tax';
import { gbp, pct } from './_kit';
/** LBTT first-time buyer relief on a price: the bill with the wider nil band and what it saves. */
export default () => ({
  title: 'Scottish first-time buyer relief on your price',
  cta: 'Full LBTT calculator',
  inputs: [{ id: 'p', label: 'Purchase price', def: 210000, unit: '£', max: 50_000_000 }],
  run: ({ p }: Record<string, number>) => {
    const ftb = compute({ nation: 'scotland', price: p, situation: 'first' });
    const std = compute({ nation: 'scotland', price: p, situation: 'home' });
    return {
      head: ['LBTT for first-time buyers', gbp(ftb.total)] as [string, string],
      rows: [
        ['If one buyer has owned before', gbp(std.total)],
        ['Saved by the relief', gbp(ftb.ftbSaving)],
        ['Bill as a share of the price', pct(ftb.effectiveRate)],
      ] as [string, string][],
      note: 'Every buyer must never have owned a dwelling anywhere and must live in the home. No relief when the supplement applies.',
    };
  },
});
