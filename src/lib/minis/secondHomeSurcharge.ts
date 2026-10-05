import { compute } from '../engine/tax';
import { gbp, pct, nationOptions, NATIONS } from './_kit';
export default () => ({
  title: 'Second home surcharge on your price',
  cta: 'Full calculator with every situation',
  inputs: [
    { id: 'p', label: 'Price of the second home', def: 275000, unit: '£', max: 50_000_000 },
    { id: 'n', label: 'Where is it?', def: 0, options: nationOptions },
  ],
  run: ({ p, n }: Record<string, number>) => {
    const nation = NATIONS[n] ?? 'england';
    const r = compute({ nation, price: p, situation: 'additional' });
    return {
      head: ['Extra tax because you will own two homes', gbp(r.surcharge)] as [string, string],
      rows: [
        ['Total bill on the second home', gbp(r.total)],
        ['Same purchase as your only home', gbp(r.mainTax)],
        ['Effective rate with the surcharge', pct(r.effectiveRate)],
      ] as [string, string][],
      note: r.notes[0] ?? r.rule,
    };
  },
});
