import { compute } from '../engine/tax';
import { P } from '../engine/params';
import { gbp, nationOptions, NATIONS } from './_kit';
/** Moving home: the tax if the old home is sold first, and the surcharge to fund if it is not. */
export default () => ({
  title: 'Buying before you sell: the surcharge to fund',
  cta: 'Full calculator with every situation',
  inputs: [
    { id: 'p', label: 'Price of your next home', def: 425000, unit: '£', max: 50_000_000 },
    { id: 'n', label: 'Where is it?', def: 0, options: nationOptions },
  ],
  run: ({ p, n }: Record<string, number>) => {
    const nation = NATIONS[n] ?? 'england';
    const sold = compute({ nation, price: p, situation: 'home' });
    const notSold = compute({ nation, price: p, situation: 'additional' });
    const window = nation === 'scotland' ? `${P.lbtt.replace_main_residence_months} months` : `${nation === 'wales' ? P.ltt.replace_main_residence_years : P.sdlt.replace_main_residence_years} years`;
    return {
      head: ['Extra tax at completion if the old home is unsold', gbp(notSold.refundable)] as [string, string],
      rows: [
        ['Old home sold first (or the same day)', gbp(sold.total)],
        ['Paid at completion if not sold yet', gbp(notSold.total)],
        [`Sale deadline to reclaim the extra`, `${window} after completion`],
      ] as [string, string][],
      note: notSold.rule,
    };
  },
});
