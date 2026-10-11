import { cgt } from '../engine/wealth';
import { gbp, PA, WP } from './_wkit';
export default () => ({
  title: 'What the 60-day return will ask you to pay',
  cta: 'Capital Gains Tax on property calculator',
  inputs: [{ id: 'g', label: 'Chargeable gain on the UK home', def: 60000, unit: '£', max: 100_000_000 }, { id: 'i', label: 'Expected income this tax year', def: 45000, unit: '£', max: 10_000_000 }],
  run: ({ g, i }: Record<string, number>) => {
    const r = cgt({ gains: g, taxableIncome: Math.max(0, i - PA) });
    return {
      head: [`Pay within ${WP.cgt.report_days_residential} days of completion`, gbp(r.tax)] as [string, string],
      rows: [['Allowance deducted', gbp(r.aea)], ['Estimated at the lower rate', gbp(r.atLower)], ['Estimated at the higher rate', gbp(r.atHigher)]] as [string, string][],
      note: 'The figure uses your best estimate of income for the year; the Self Assessment return settles the difference.',
    };
  },
});
