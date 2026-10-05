import { compute } from '../engine/tax';
import { P } from '../engine/params';
import { gbp } from './_kit';
/** ADS repayment: what comes back when the former main home sells after the new purchase. */
export default () => ({
  title: 'Your ADS repayment',
  cta: 'Full LBTT calculator',
  inputs: [
    { id: 'p', label: 'Price of the new home', def: 320000, unit: '£', max: 50_000_000 },
    { id: 'm', label: 'Months between entry and the sale of the old home', def: 9, max: 120 },
  ],
  run: ({ p, m }: Record<string, number>) => {
    const L = P.lbtt;
    const r = compute({ nation: 'scotland', price: p, situation: 'additional' });
    const inTime = m <= L.replace_main_residence_months;
    return {
      head: ['ADS you can reclaim', gbp(inTime ? r.refundable : 0)] as [string, string],
      rows: [
        ['ADS paid at entry', gbp(r.surcharge)],
        ['Sale inside the window', inTime ? `Yes (${L.replace_main_residence_months} months)` : `No, more than ${L.replace_main_residence_months} months`],
        ['Usual route', !inTime ? 'No repayment' : m < L.amend_months ? 'Amend the LBTT return' : 'Amend if still in time, otherwise an overpayment claim'],
      ] as [string, string][],
      note: `Amendment within ${L.amend_months} months of the filing date; after that, a claim within ${L.overpayment_claim_years} years of the date the return was due.`,
    };
  },
});
