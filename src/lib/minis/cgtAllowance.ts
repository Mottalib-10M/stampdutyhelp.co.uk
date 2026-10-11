import { cgt } from '../engine/wealth';
import { gbp, PA, WP } from './_wkit';
export default () => ({
  title: 'What the annual exempt amount saves you',
  cta: 'Full Capital Gains Tax calculator',
  inputs: [{ id: 'g', label: 'Gains this tax year, after losses', def: 9000, unit: '£', max: 100_000_000 }, { id: 'i', label: 'Income before the Personal Allowance', def: 60000, unit: '£', max: 10_000_000 }],
  run: ({ g, i }: Record<string, number>) => {
    const t = Math.max(0, i - PA);
    const now = cgt({ gains: g, taxableIncome: t });
    const old = cgt({ gains: g, taxableIncome: t, aea: WP.cgt.aea_history[0][1] as number });
    return {
      head: ['Tax with the current allowance', gbp(now.tax)] as [string, string],
      rows: [['Allowance used', gbp(now.aea)], ['Taxable after the allowance', gbp(now.taxable)], [`Same gains with the ${WP.cgt.aea_history[0][0]} allowance`, gbp(old.tax)]] as [string, string][],
      note: g <= WP.cgt.annual_exempt_amount ? 'Inside the allowance: nothing to pay, and nothing to report unless the sale proceeds pass the reporting limit.' : undefined,
    };
  },
});
