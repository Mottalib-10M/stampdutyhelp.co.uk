import { compute } from '../engine/tax';
import { P } from '../engine/params';
import { gbp } from './_kit';
/** Additional Dwelling Supplement on a price, for a person or a company. */
export default () => ({
  title: 'Additional Dwelling Supplement on your purchase',
  cta: 'Full LBTT calculator',
  inputs: [
    { id: 'p', label: 'Purchase price', def: 180000, unit: '£', max: 50_000_000 },
    { id: 'c', label: 'Buyer', def: 0, options: [{ value: '0', label: 'One or more people' }, { value: '1', label: 'A company' }] },
  ],
  run: ({ p, c }: Record<string, number>) => {
    const r = compute({ nation: 'scotland', price: p, situation: 'additional', company: c === 1 });
    return {
      head: ['ADS due', gbp(r.surcharge)] as [string, string],
      rows: [
        ['LBTT on the bands', gbp(r.mainTax)],
        ['Total to Revenue Scotland', gbp(r.total)],
        [`Repayable if a former main home sells within ${P.lbtt.replace_main_residence_months} months`, gbp(r.refundable)],
      ] as [string, string][],
      note: r.notes[0] ?? r.rule,
    };
  },
});
