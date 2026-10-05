import { compute } from '../engine/tax';
import { P } from '../engine/params';
import { gbp } from './_kit';
/** Welsh higher rates refund: higher-rate bill minus main-rate bill, if the old main home sells within the window. */
export default () => ({
  title: 'Your LTT higher rates refund',
  cta: 'Full LTT calculator',
  inputs: [
    { id: 'p', label: 'Price of the new home', def: 340000, unit: '£', max: 50_000_000 },
    { id: 'm', label: 'Months between completion and the sale of the old home', def: 14, max: 120 },
  ],
  run: ({ p, m }: Record<string, number>) => {
    const W = P.ltt;
    const r = compute({ nation: 'wales', price: p, situation: 'additional' });
    const inTime = m <= W.replace_main_residence_years * 12;
    return {
      head: ['Refund you can claim', gbp(inTime ? r.refundable : 0)] as [string, string],
      rows: [
        ['Paid at the higher rates', gbp(r.total)],
        ['Due at the main rates', gbp(r.mainTax)],
        ['Old home sold in time', inTime ? `Yes, within ${W.replace_main_residence_years} years` : `No, after ${W.replace_main_residence_years} years`],
      ] as [string, string][],
      note: `Amend the return within ${W.amend_months} months of the filing date, or claim within ${W.refund_claim_years} years from the day after it. Processing: ${W.refund_processing_working_days} working days.`,
    };
  },
});
